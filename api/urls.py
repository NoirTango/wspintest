from django.conf.urls import url, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'climb-records', views.ClimbRecordViewSet, base_name='climb-records')
router.register(r'routes', views.RouteViewSet, base_name='routes')
router.register(r'sectors', views.SectorViewSet, base_name='sectors')
router.register(r'crags', views.CragViewSet, base_name='crags')
router.register(r'scores', views.GradeScoreViewset, base_name='scores')
router.register(r'styles', views.StyleViewSet, base_name='styles')


urlpatterns = [url(r'^', include(router.urls)),
               url(r'^csv-export/$', views.CSVExportView.as_view(), name='csv-export'),
               url(r'^csv-import/$', views.CSVImportView.as_view(), name='csv-import'),
               url(r'^sum-history/$', views.SumHistoryView.as_view(), name='sum-history'),
               ]
