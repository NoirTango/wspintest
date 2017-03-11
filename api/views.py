from .generic_viewsets import ClimbRecordViewSet, RouteViewSet, SectorViewSet, CragViewSet, GradeScoreViewset, StyleViewSet
from .aggregate_views import ScoreSumView, HistorySumView, SumHistoryView
from .csv_views import CSVImportView, CSVExportView

_ = (ClimbRecordViewSet, RouteViewSet, SectorViewSet, CragViewSet, GradeScoreViewset, StyleViewSet,
     ScoreSumView, HistorySumView, SumHistoryView,
     CSVImportView, CSVExportView)
