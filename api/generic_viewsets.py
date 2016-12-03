from rest_framework import viewsets, filters, exceptions
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

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


class GradeScoreViewset(viewsets.ModelViewSet):
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
