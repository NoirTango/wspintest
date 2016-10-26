from rest_framework import serializers

from .models import ClimbRecord


class ClimbRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimbRecord
        fields = ('user', 'route', 'date')
