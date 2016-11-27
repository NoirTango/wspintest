from django.conf.urls import url, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'climb-records', views.ClimbRecordViewSet, base_name='climb-records')
router.register(r'routes', views.RouteViewSet, base_name='routes')
router.register(r'sectors', views.SectorViewSet, base_name='sectors')
router.register(r'crags', views.CragViewSet, base_name='crags')
router.register(r'scores', views.ClimbScoreViewset, base_name='scores')


urlpatterns = [url(r'^', include(router.urls)),
               url(r'^scores-total', views.ScoreSumView.as_view(), name='scores-total'),
               url(r'^scores-history', views.HistorySumView.as_view(), name='scores-history'),
               ]
