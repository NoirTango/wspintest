from rest_framework import viewsets, filters, exceptions
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

from . import models
from . import serializers


class ClimbRecordViewSet(viewsets.ModelViewSet):
    model = models.ClimbRecord
    base_name = 'Climb Records'
    serializer_class = serializers.ClimbRecordSerializer

    def create(self, request, *args, **kwargs):
        if 'user' not in request.data:
            request.data['user'] = request.user.id

        if int(request.data.get('user')) == request.user.id or request.user.is_staff:
            return viewsets.ModelViewSet.create(self, request, *args, **kwargs)
        else:
            raise exceptions.PermissionDenied('Not allowed to add for another user')

    def list(self, request, *args, **kwargs):
        self.current_scores = models.GradeScore.objects.all()
        return viewsets.ModelViewSet.list(self, request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        return models.ClimbRecord.objects.filter(user=user).order_by('-date')

    @list_route(methods=['post'])
    def ajax(self, request):
        if request.data.get('route') is None:
            route = self.create_route_from_ajax_request(request.data)
        else:
            route = models.Route.objects.get(id=request.data.get('route'))

        cr = models.ClimbRecord.objects.create(user=request.user, route=route, date=request.data['date'])
        return Response('{}'.format(cr), status=HTTP_201_CREATED)

    def create_route_from_ajax_request(self, data):
        if data.get('sector') is None:
            sector = self.create_sector_from_ajax_request(data)
        else:
            sector = models.Sector.objects.get(id=data.get('sector'))
        return models.Route.objects.create(sector=sector, name=data['route_name'], grade=data['route_grade'])

    def create_sector_from_ajax_request(self, data):
        if data.get('crag') is None:
            crag = self.create_crag_from_ajax_request(data)
        else:
            crag = models.Crag.objects.get(id=data.get('crag'))
        return models.Sector.objects.create(crag=crag, name=data['sector_name'])

    def create_crag_from_ajax_request(self, data):
        return models.Crag.objects.create(name=data['crag_name'], country=data['crag_country'])


class RouteViewSet(viewsets.ModelViewSet):
    model = models.Route
    base_name = 'Routes'
    queryset = models.Route.objects.all()
    serializer_class = serializers.RouteSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class SectorViewSet(viewsets.ModelViewSet):
    model = models.Sector
    base_name = 'Sectors'
    queryset = models.Sector.objects.all()
    serializer_class = serializers.SectorSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CragViewSet(viewsets.ModelViewSet):
    model = models.Crag
    base_name = 'Crags'
    queryset = models.Crag.objects.all()
    serializer_class = serializers.CragSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class GradeScoreViewset(viewsets.ModelViewSet):
    model = models.GradeScore
    serializer_class = serializers.ClimbScoreSerializer

    plus_minus = ['-', '', '+']
    plus_only = ['', '+']

    @classmethod
    def generate_with_modifiers(cls, grade_list, modifiers, up_to=None):
        for grade in grade_list:
            for m in modifiers:
                g = '{}{}'.format(grade, m)
                yield g
                if g == up_to:
                    return

    @classmethod
    def uiaa_grades(cls, up_to=None):
        for g in cls.generate_with_modifiers(['III', 'IV', 'V', 'VI'], modifiers=cls.plus_only, up_to=up_to):
            yield g

        if g == up_to:
            return

        for g in cls.generate_with_modifiers(['VII', 'VIII', 'XIX', 'X', 'XI', 'XII', 'XIII'],
                                             modifiers=cls.plus_minus, up_to=up_to):
            yield g

    @classmethod
    def french_grades(cls):
        for g in cls.uiaa_grades(up_to='V+'):
            yield g

        for gn in range(6, 10):
            for gl in 'abc':
                grade = '{}{}'.format(gn, gl)
                for g in cls.generate_with_modifiers([grade], modifiers=cls.plus_only):
                    yield g

    @classmethod
    def polish_grades(cls):
        for g in cls.uiaa_grades(up_to='VI+'):
            yield g

        for gn in range(1, 9):
            grade = 'VI.{}'.format(gn)
            for g in cls.generate_with_modifiers([grade], modifiers=cls.plus_only):
                yield g

    def get_queryset(self):
        user = self.request.user
        return models.GradeScore.objects.filter(user=user).order_by('-score')

    @classmethod
    def grade_scores_by_type(cls, grade_type):
        type_dict = {
            None: cls.french_grades,
            'polish': cls.polish_grades,
            'french': cls.french_grades,
            'uiaa': cls.uiaa_grades
        }
        func = type_dict[grade_type]

        score = 0.5
        result = []
        for grade in func():
            result.append(dict(grade=grade, score=score))
            score += 0.5
        return result

    @list_route(methods=['get'])
    def static_scores(self, request):
        return Response(self.grade_scores_by_type(request.GET.get('type')))

    @list_route(methods=['post'])
    def import_static(self, request):
        grade_type = request.data.get('type')
        if grade_type is None:
            raise exceptions.ValidationError('Type must be specified')

        try:
            gs_dict = self.grade_scores_by_type(grade_type)
        except KeyError:
            raise exceptions.ValidationError('Unknown grading type: {}'.format(grade_type))

        for gs in gs_dict:
            row, created = models.GradeScore.objects.get_or_create(grade=gs['grade'], user=request.user,
                                                                   defaults={'score': gs['score']})
            if not created:
                row.score = gs['score']
                row.save()

        return Response({'message': 'Imported static grade {}'.format(grade_type)}, status=201)
