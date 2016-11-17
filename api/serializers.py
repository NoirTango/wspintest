from rest_framework import serializers

from . import models


class ClimbRecordSerializer(serializers.ModelSerializer):
    route_name = serializers.SerializerMethodField()
    route_grade = serializers.SerializerMethodField()
    sector_name = serializers.SerializerMethodField()
    crag_name = serializers.SerializerMethodField()
    crag_country = serializers.SerializerMethodField()

    def get_route_name(self, obj):
        return obj.route.name

    def get_route_grade(self, obj):
        return obj.route.grade

    def get_sector_name(self, obj):
        return obj.route.sector.name

    def get_crag_name(self, obj):
        return obj.route.sector.crag.name

    def get_crag_country(self, obj):
        return obj.route.sector.crag.country

    class Meta:
        model = models.ClimbRecord
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    sector_name = serializers.SerializerMethodField()
    crag = serializers.SerializerMethodField()
    crag_name = serializers.SerializerMethodField()
    crag_country = serializers.SerializerMethodField()

    def get_sector_name(self, obj):
        return obj.sector.name

    def get_crag(self, obj):
        return obj.sector.crag.id

    def get_crag_name(self, obj):
        return obj.sector.crag.name

    def get_crag_country(self, obj):
        return obj.sector.crag.country

    class Meta:
        model = models.Route
        fields = '__all__'


class SectorSerializer(serializers.ModelSerializer):
    crag_name = serializers.SerializerMethodField()
    crag_country = serializers.SerializerMethodField()

    def get_crag_name(self, obj):
        return obj.crag.name

    def get_crag_country(self, obj):
        return obj.crag.country

    class Meta:
        model = models.Sector
        fields = '__all__'


class CragSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Crag
        fields = '__all__'
