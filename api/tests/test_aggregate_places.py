import datetime

from django.test import TestCase
from rest_framework.reverse import reverse

from api.tests import mixins
from api import models


class TestAggregatePlaces(mixins.WithLoggedUserMixin, mixins.WithOneRouteMixin, TestCase):
    def setUp(self):
        self.setUpLogin()

    def add_crag(self, cragname, countryname):
        return models.Crag.objects.create(name=cragname, country=countryname)

    def add_route(self, score, crag, date=None):
        grade_name = 'G{}'.format(score)
        sector = models.Sector.objects.create(name='sector', crag=crag)
        route = models.Route.objects.create(name='route', grade=grade_name, sector=sector)
        models.GradeScore.objects.create(grade=grade_name, score=score, user=self.user)
        return models.ClimbRecord.objects.create(route=route, user=self.user, style='', date=date or datetime.date.today())

    def test_endpoint_exists(self):
        response = self.client.get(reverse('aggregate-places'))
        self.assertEqual(response.status_code, 200)

    def test_returns_dictionary(self):
        response = self.client.get(reverse('aggregate-places'))
        data = response.json()
        self.assertIsInstance(data, dict)
        self.assertEqual(set(data.keys()), {'country', 'crag'})

    def test_single_route_total(self):
        crag = self.add_crag('cragname', 'countryname')
        self.add_route(10, crag)
        response = self.client.get(reverse('aggregate-places'))
        data = response.json()
        self.assertEqual(data['crag'], [{'name': 'cragname', 'value': 10}])
        self.assertEqual(data['country'], [{'name': 'countryname', 'value': 10}])

    def test_multiple_routes_same_crag(self):
        crag = self.add_crag('cragname', 'countryname')
        self.add_route(10, crag)
        self.add_route(15, crag)
        response = self.client.get(reverse('aggregate-places'))
        data = response.json()
        self.assertEqual(data['crag'], [{'name': 'cragname', 'value': 25}])
        self.assertEqual(data['country'], [{'name': 'countryname', 'value': 25}])

    def test_multiple_routes_same_country(self):
        crag1 = self.add_crag('cragname1', 'countryname')
        self.add_route(10, crag1)
        crag2 = self.add_crag('cragname2', 'countryname')
        self.add_route(15, crag2)
        response = self.client.get(reverse('aggregate-places'))
        data = response.json()
        self.assertEqual(data['crag'], [{'name': 'cragname1', 'value': 10},
                                        {'name': 'cragname2', 'value': 15}])
        self.assertEqual(data['country'], [{'name': 'countryname', 'value': 25}])

    def test_multiple_routes_different_country(self):
        crag1 = self.add_crag('cragname1', 'countryname1')
        self.add_route(10, crag1)
        crag2 = self.add_crag('cragname2', 'countryname2')
        self.add_route(15, crag2)
        response = self.client.get(reverse('aggregate-places'))
        data = response.json()
        self.assertEqual(data['crag'], [{'name': 'cragname1', 'value': 10},
                                        {'name': 'cragname2', 'value': 15}])
        self.assertEqual(data['country'], [{'name': 'countryname1', 'value': 10},
                                           {'name': 'countryname2', 'value': 15}])

    def test_limit_by_year(self):
        crag = self.add_crag('cragname', 'countryname')
        self.add_route(10, crag, date=datetime.date(2006, 10, 10))
        self.add_route(15, crag, date=datetime.date(2007, 10, 10))

        response = self.client.get(reverse('aggregate-places'), {'year_start': 2007, 'year_end': 2007})
        data = response.json()
        self.assertEqual(data['crag'], [{'name': 'cragname', 'value': 15}])
        self.assertEqual(data['country'], [{'name': 'countryname', 'value': 15}])
