import csv
import datetime
from collections import OrderedDict, defaultdict
from io import StringIO

from django.db.models.aggregates import Count
from django.http.response import HttpResponse
from rest_framework import viewsets, filters, exceptions, views
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.parsers import FileUploadParser

from . import models
from . import serializers


class ClimbRecordViewSet(viewsets.ModelViewSet):
    model = models.ClimbRecord
    base_name = 'Climb Records'
    serializer_class = serializers.ClimbRecordSerializer

    def create(self, request, *args, **kwargs):
        if 'user' not in request.data:
            request.data['user'] = request.user.id

        if int(request.data.get('user')) == request.user.id or request.user.is_staff:
            return viewsets.ModelViewSet.create(self, request, *args, **kwargs)
        else:
            raise exceptions.PermissionDenied('Not allowed to add for another user')

    def get_queryset(self):
        user = self.request.user
        return models.ClimbRecord.objects.filter(user=user).order_by('-date')

    @list_route(methods=['post'])
    def ajax(self, request):
        if request.data.get('route') is None:
            route = self.create_route_from_ajax_request(request.data)
        else:
            route = models.Route.objects.get(id=request.data.get('route'))

        cr = models.ClimbRecord.objects.create(user=request.user, route=route, date=request.data['date'])
        return Response('{}'.format(cr), status=HTTP_201_CREATED)

    def create_route_from_ajax_request(self, data):
        if data.get('sector') is None:
            sector = self.create_sector_from_ajax_request(data)
        else:
            sector = models.Sector.objects.get(id=data.get('sector'))
        return models.Route.objects.create(sector=sector, name=data['route_name'], grade=data['route_grade'])

    def create_sector_from_ajax_request(self, data):
        if data.get('crag') is None:
            crag = self.create_crag_from_ajax_request(data)
        else:
            crag = models.Crag.objects.get(id=data.get('crag'))
        return models.Sector.objects.create(crag=crag, name=data['sector_name'])

    def create_crag_from_ajax_request(self, data):
        return models.Crag.objects.create(name=data['crag_name'], country=data['crag_country'])


class ClimbScoreViewset(viewsets.ModelViewSet):
    model = models.GradeScore
    serializer_class = serializers.ClimbScoreSerializer

    def get_queryset(self):
        user = self.request.user
        return models.GradeScore.objects.filter(user=user).order_by('-score')


class RouteViewSet(viewsets.ModelViewSet):
    model = models.Route
    base_name = 'Routes'
    queryset = models.Route.objects.all()
    serializer_class = serializers.RouteSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class SectorViewSet(viewsets.ModelViewSet):
    model = models.Sector
    base_name = 'Sectors'
    queryset = models.Sector.objects.all()
    serializer_class = serializers.SectorSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CragViewSet(viewsets.ModelViewSet):
    model = models.Crag
    base_name = 'Crags'
    queryset = models.Crag.objects.all()
    serializer_class = serializers.CragSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


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


class CSVExportView(views.APIView):
    def get(self, request):
        climb_data = models.ClimbRecord.objects.filter(user=request.user)
        with StringIO() as payload:
            writer = csv.DictWriter(payload, fieldnames=['Date', 'Route', 'Grade', 'Sector', 'Crag', 'Country'])
            writer.writeheader()
            for cr in climb_data:
                writer.writerow(dict(
                    Date=cr.date,
                    Route=cr.route.name,
                    Grade=cr.route.grade,
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
        for line in request.FILES['file']:
            yield line.decode('utf-8')

    def post(self, request):
        reader = csv.DictReader(self.text_file(request))
        for row in reader:
            crag, _ = models.Crag.objects.get_or_create(name=row['Crag'], country=row['Country'])
            sector, _ = models.Sector.objects.get_or_create(name=row['Sector'], crag=crag)
            route, _ = models.Route.objects.get_or_create(name=row['Route'], grade=row['Grade'], sector=sector)
            cr = models.ClimbRecord(date=row['Date'], route=route, user=request.user)
            cr.save()
        return Response(status=204)
