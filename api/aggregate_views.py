from collections import OrderedDict, defaultdict

from django.db.models.aggregates import Count
from rest_framework import views
from rest_framework.response import Response

from . import models


class ScoreSumView(views.APIView):
    def get(self, request):
        query = models.ClimbRecord.objects.filter(user=request.user)
        year = request.GET.get('year')
        if year:
            query = query.filter(date__year=year)

        stats = query.values('route__grade').annotate(count=Count('route__grade'))

        score_maps = models.GradeScore.objects.filter(user=request.user).order_by('-score')
        score_dict = OrderedDict((gs.grade, gs.score) for gs in score_maps)
        for stat in stats:
            score_dict[stat['route__grade']] = {
                'grade': stat['route__grade'],
                'count': stat['count'],
            }

        return Response([v for _, v in score_dict.items() if isinstance(v, dict)])


class HistoryAggregator:
    def __init__(self):
        self.specific_count = defaultdict(lambda: defaultdict(int))
        self.aggregated_count = defaultdict(int)
        self.aggregated_points = defaultdict(int)
        self.grade_scores = OrderedDict()
        self.years = set()
        self.grades = set()
        self.min_year = None
        self.max_year = None

    def consume_grade_scores(self, grade_list):
        for grade_score in grade_list:
            self.grade_scores[grade_score.grade] = grade_score.score

    def consume_climbrecord(self, climb_record):
        grade = climb_record.route.grade
        year = climb_record.date.year
        points = self.grade_scores[grade]

        self.specific_count[grade][year] += 1
        self.aggregated_points[year] += points
        self.aggregated_count[year] += 1
        self.years.add(year)
        self.grades.add(grade)

    def consume_climbrecord_list(self, cr_list):
        for cr in cr_list:
            self.consume_climbrecord(cr)

    def get_years(self):
        if self.min_year is None:
            self.min_year = min(self.years)
        if self.max_year is None:
            self.max_year = max(self.years)
        return range(self.min_year, self.max_year + 1)

    def get_grades(self):
        for g in self.grade_scores:
            if g in self.grades:
                yield g

    def get_total_points(self):
        for year in self.get_years():
            yield year, self.aggregated_points[year]

    def get_total_count(self):
        for year in self.get_years():
            yield year, self.aggregated_count[year]

    def get_count_data(self):
        for grade in self.get_grades():
            yield dict(grade=grade, count=[self.specific_count[grade][year] for year in self.get_years()])


class HistorySumView(views.APIView):
    def get(self, request):
        climb_data = models.ClimbRecord.objects.filter(user=request.user)
        score_data = models.GradeScore.objects.filter(user=request.user).order_by('-score')
        aggregator = HistoryAggregator()
        aggregator.consume_grade_scores(score_data)
        aggregator.consume_climbrecord_list(climb_data)

        return Response({
            'years': list(aggregator.get_years()),
            'grades': list(aggregator.get_grades()),
            'counts': list(aggregator.get_count_data()),
            'total_counts': dict(aggregator.get_total_count()),
            'total_points': dict(aggregator.get_total_points())
        })
