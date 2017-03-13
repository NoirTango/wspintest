import datetime

from rest_framework import views
from rest_framework.response import Response

from . import models
from api.grade_score_calculator import GradeScoreCalculator
from collections import defaultdict, OrderedDict


DEFAULT_YEAR_SPAN = 10


class AggregatedByYearView(views.APIView):
    def get_years_from_request(self, request):
        try:
            self.end_year = int(request.query_params['end_year'])
        except (KeyError, ValueError):
            self.end_year = datetime.date.today().year

        try:
            self.start_year = int(request.query_params['start_year'])
        except (KeyError, ValueError):
            self.start_year = self.end_year - DEFAULT_YEAR_SPAN

    def year_range(self):
        return range(self.start_year, self.end_year + 1)

    def climb_records(self, request):
        return models.ClimbRecord.objects.filter(user=request.user,
                                                 date__year__lte=self.end_year, date__year__gte=self.start_year)


class SumHistoryView(AggregatedByYearView):
    def get(self, request):
        self.get_years_from_request(request)

        styles = [cs.style for cs in models.ClimbStyle.objects.filter(user=request.user)]

        calc = GradeScoreCalculator(request.user)
        data = {}
        for year in self.year_range():
            data[year] = {'year': year, 'other': 0}
            for climbing_style in styles:
                data[year][climbing_style] = 0

        for record in self.climb_records(request):
            if record.style in styles:
                key = record.style
            else:
                key = 'other'
            data[record.date.year][key] += calc.get_total_score(record.route.grade, record.style)

        list_data = [data[year] for year in self.year_range()]
        return Response(list_data)


class AggregatePlacesView(AggregatedByYearView):
    def get(self, request):
        aggregated_data = defaultdict(float)

        self.get_years_from_request(request)

        calc = GradeScoreCalculator(request.user)
        for record in self.climb_records(request):
            score = calc.get_total_score(record.route.grade, record.style)
            aggregated_data[(record.route.sector.crag.country, record.route.sector.crag.name)] += score

        keys = sorted(aggregated_data.keys())
        aggregated_country = OrderedDict()
        output_crag = []
        for country, crag in keys:
            total = aggregated_data[(country, crag)]
            output_crag.append({'name': crag, 'value': total})
            try:
                aggregated_country[country] += total
            except KeyError:
                aggregated_country[country] = total

        output_country = [{'name': k, 'value': v} for k, v in aggregated_country.items()]

        return Response({'crag': output_crag, 'country': output_country})
