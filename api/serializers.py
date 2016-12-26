from rest_framework import serializers

from . import models


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
        return self.Meta.sector_serializer.get_crag_name(obj.sector)

    def get_crag_country(self, obj):
        return self.Meta.sector_serializer.get_crag_country(obj.sector)

    class Meta:
        model = models.Route
        sector_serializer = SectorSerializer()
        fields = '__all__'


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
        return self.Meta.route_serializer.get_sector_name(obj.route)

    def get_crag_name(self, obj):
        return self.Meta.route_serializer.get_crag_name(obj.route)

    def get_crag_country(self, obj):
        return self.Meta.route_serializer.get_crag_country(obj.route)

    class Meta:
        model = models.ClimbRecord
        route_serializer = RouteSerializer()
        fields = '__all__'


class CragSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Crag
        fields = '__all__'


class ClimbScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GradeScore
        fields = '__all__'
