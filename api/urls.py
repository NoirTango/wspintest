from django.conf.urls import url, include
from rest_framework import routers

from .views import ClimbRecordViewSet, RouteViewSet, SectorViewSet, CragViewSet

router = routers.DefaultRouter()
router.register(r'climb-records', ClimbRecordViewSet, base_name='climb-records')
router.register(r'routes', RouteViewSet, base_name='routes')
router.register(r'sectors', SectorViewSet, base_name='sectors')
router.register(r'crags', CragViewSet, base_name='crags')

urlpatterns = [url(r'^', include(router.urls))
               ]
