from django.conf.urls import url, include
from rest_framework import routers

from .views import ClimbRecordViewSet

router = routers.DefaultRouter()
router.register(r'routes', ClimbRecordViewSet, base_name='Climb Records')

urlpatterns = [url(r'^', include(router.urls))
               ]
