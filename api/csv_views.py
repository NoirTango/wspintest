import csv
import datetime
from io import StringIO

from django.http.response import HttpResponse
from rest_framework import views
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response

from . import models


class CSVExportView(views.APIView):
    def get(self, request):
        climb_data = models.ClimbRecord.objects.filter(user=request.user)
        with StringIO() as payload:
            writer = csv.DictWriter(payload, fieldnames=['Date', 'Route', 'Style', 'Grade', 'Sector', 'Crag', 'Country'])
            writer.writeheader()
            for cr in climb_data:
                writer.writerow(dict(
                    Date=cr.date,
                    Route=cr.route.name,
                    Grade=cr.route.grade,
                    Style=cr.style,
                    Sector=cr.route.sector.name,
                    Crag=cr.route.sector.crag.name,
                    Country=cr.route.sector.crag.country
                ))
            res = HttpResponse(payload.getvalue(), content_type='text/csv')
            res['Content-Disposition'] = 'attachment;filename=wspinologia-{}.csv'.format(datetime.date.today())
        return res


class CSVImportView(views.APIView):
    parser_classes = (FileUploadParser,)

    def text_file(self, request):
        for line in request.data['file']:
            yield line.decode('utf-8')

    def post(self, request):
        reader = csv.DictReader(self.text_file(request))
        for row in reader:
            crag, _ = models.Crag.get_first_or_create(name=row['Crag'], country=row['Country'])
            sector, _ = models.Sector.get_first_or_create(name=row['Sector'], crag=crag)
            route, _ = models.Route.get_first_or_create(name=row['Route'], grade=row['Grade'], sector=sector)

            cr = models.ClimbRecord(date=row['Date'], style=row.get('Style', ''), route=route, user=request.user)
            cr.save()
        return Response({"status": "OK"}, status=201)
