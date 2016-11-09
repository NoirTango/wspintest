from rest_framework import viewsets, filters

from . import models
from . import serializers


class ClimbRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    model = models.ClimbRecord
    base_name = 'Climb Records'
    serializer_class = serializers.ClimbRecordSerializer

    def get_queryset(self):
            user = self.request.user
            return models.ClimbRecord.objects.filter(user=user).order_by('-route__grade')


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
