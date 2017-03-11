import datetime

from rest_framework import views
from rest_framework.response import Response

from . import models
from api.grade_score_calculator import GradeScoreCalculator


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

        styles = [cs.style for cs in models.ClimbStyle.objects.filter(user=request.user)]

        calc = GradeScoreCalculator(request.user)
        data = {}
        for year in range(start_year, end_year + 1):
            data[year] = {'year': year, 'other': 0}
            for climbing_style in styles:
                data[year][climbing_style] = 0

        for record in models.ClimbRecord.objects.filter(user=request.user, date__year__lte=end_year, date__year__gte=start_year):
            if record.style in styles:
                key = record.style
            else:
                key = 'other'
            data[record.date.year][key] += calc.get_total_score(record.route.grade, record.style)

        list_data = [data[year] for year in range(start_year, end_year + 1)]
        return Response(list_data)
