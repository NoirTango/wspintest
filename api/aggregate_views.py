import datetime
from collections import OrderedDict, defaultdict

from django.db.models.aggregates import Count
from rest_framework import views
from rest_framework.response import Response

from . import models
from api.grade_score_calculator import GradeScoreCalculator


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

    def get_points_from_composite_grade(self, grade):
        points = 0.
        num_grades = 0
        for exact_grade in grade.split('/'):
            try:
                points += self.grade_scores[exact_grade]
            except KeyError:
                pass
            num_grades += 1
        if num_grades:
            points /= num_grades
        return points

    def consume_climbrecord(self, climb_record):
        grade = climb_record.route.grade
        year = climb_record.date.year
        points = self.get_points_from_composite_grade(grade)

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
        up_g = None
        for g in self.grade_scores:
            mid_grade = '{}/{}'.format(g, up_g)
            if mid_grade in self.grades:
                yield mid_grade
            if g in self.grades:
                yield g
            up_g = g

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
        
class SumHistoryView(views.APIView):
    def get(self, request):
        try:
            end_year = int(request.query_params['end_year'])
        except (KeyError, ValueError):
            end_year = datetime.date.today().year
            
        try:
            start_year = int(request.query_params['start_year'])
        except (KeyError, ValueError):
            start_year = end_year - 10
        
        calc = GradeScoreCalculator(request.user)
        data = {}
        for year in range(start_year, end_year + 1):
            data[year] = 0
        for record in models.ClimbRecord.objects.filter(user=request.user, date__year__lte=end_year, date__year__gte=start_year):
            data[record.date.year] += calc.get_total_score(record.route.grade, record.style)

        return Response(data)
