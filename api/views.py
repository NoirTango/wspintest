from .generic_viewsets import ClimbRecordViewSet, RouteViewSet, SectorViewSet, CragViewSet, GradeScoreViewset, StyleViewSet
from .aggregate_views import SumHistoryView, AggregatePlacesView
from .csv_views import CSVImportView, CSVExportView

_ = (ClimbRecordViewSet, RouteViewSet, SectorViewSet, CragViewSet, GradeScoreViewset, StyleViewSet,
     SumHistoryView, AggregatePlacesView,
     CSVImportView, CSVExportView)
