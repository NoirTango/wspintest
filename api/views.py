from rest_framework import viewsets

from .models import ClimbRecord
from .serializers import ClimbRecordSerializer


class ClimbRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    model = ClimbRecord
    base_name = 'Climb Records'
    serializer_class = ClimbRecordSerializer

    def get_queryset(self):
            user = self.request.user
            return ClimbRecord.objects.filter(user=user).order_by('-route__grade')
