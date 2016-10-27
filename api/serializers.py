from rest_framework import serializers

from .models import ClimbRecord, Route


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route

        fields = ('name',)

class ClimbRecordSerializer(serializers.ModelSerializer):
    #route = RouteSerializer()

    class Meta:
        model = ClimbRecord
        fields = ('route', 'date')
        depth = 3
