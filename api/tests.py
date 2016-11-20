from django.test import TestCase
from django.contrib.auth.models import User

from . import models
from rest_framework.reverse import reverse
import json
from api.admin import consolidate_crag, consolidate_sector, consolidate_route


class WithLoggedUserMixin(object):
    def setUpLogin(self):
        self.test_user_email = 'someuser@wherever.com'
        self.test_user_name = self.test_user_email
        self.test_user_password = 'password'
        self.user = User.objects.create_user(self.test_user_name,
                                             self.test_user_email,
                                             self.test_user_password)
        self.client.login(username=self.test_user_name, password=self.test_user_password)


class WithOneRouteMixin(object):
    def setUpRoute(self):
        self.crag = models.Crag.objects.create(name='crag', country='country')
        self.sector = models.Sector.objects.create(name='sector', crag=self.crag)
        self.route = models.Route.objects.create(name='route', grade='grade', sector=self.sector)


class TestPostClimbingRecord(WithLoggedUserMixin, WithOneRouteMixin, TestCase):
    def setUp(self):
        self.setUpLogin()
        self.setUpRoute()

    def test_user_can_upload_with_himself(self):
        self.assertEqual(models.ClimbRecord.objects.count(), 0)
        resp = self.client.post(reverse('climb-records-list'),
                                {
                                    'route': self.route.id,
                                    'date': '2010-01-01',
                                    'user': self.user.id
                                })
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(models.ClimbRecord.objects.count(), 1)

    def test_user_can_upload(self):
        self.assertEqual(models.ClimbRecord.objects.count(), 0)
        resp = self.client.post(reverse('climb-records-list'),
                                {
                                    'route': self.route.id,
                                    'date': '2010-01-01',
                                })
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(models.ClimbRecord.objects.count(), 1)

    def test_user_cannot_upload_another_account(self):
        another_user = User.objects.create_user('username', 'email', 'password')
        resp = self.client.post(reverse('climb-records-list'),
                                {
                                    'route': self.route.id,
                                    'date': '2010-01-01',
                                    'user': another_user.id
                                })
        self.assertEqual(resp.status_code, 403)
        self.assertEqual(models.ClimbRecord.objects.count(), 0)

    def test_superuser_can_upload_another_account(self):
        self.user.is_staff = True
        self.user.save()
        another_user = User.objects.create_user('username', 'email', 'password')
        resp = self.client.post(reverse('climb-records-list'),
                                {
                                    'route': self.route.id,
                                    'date': '2010-01-01',
                                    'user': another_user.id
                                })
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(models.ClimbRecord.objects.count(), 1)


class TestClimbRecordWithAjax(WithLoggedUserMixin, TestCase):
    def setUp(self):
        self.setUpLogin()

    def test_ajax_does_not_accept_get(self):
        resp = self.client.get(reverse('climb-records-ajax'))
        self.assertEqual(resp.status_code, 405)

    def test_ajax_only_accepts_logged_user(self):
        self.client.logout()
        resp = self.client.get(reverse('climb-records-ajax'))
        self.assertEqual(resp.status_code, 403)

    def test_ajax_with_new_route_sector_crag(self):
        data = {
            "route": None,
            "sector": None,
            "crag": None,
            "route_name": "ROUTE",
            "route_grade": "7a",
            "sector_name": "SECTOR",
            "crag_name": "CRAG",
            "crag_country": "COUNTRY",
            "date": "2016-11-19"
        }
        resp = self.client.post(reverse('climb-records-ajax'),
                                json.dumps(data),
                                content_type="application/json")
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(models.Crag.objects.count(), 1)
        self.assertEqual(models.Sector.objects.count(), 1)
        self.assertEqual(models.Route.objects.count(), 1)
        self.assertEqual(models.ClimbRecord.objects.count(), 1)


class TestConsolidationActions(WithOneRouteMixin, TestCase):
    def duplicate_route(self):
        self.routes = []
        self.sectors = []
        self.crags = []
        for _ in range(2):
            self.setUpRoute()
            self.routes.append(self.route)
            self.sectors.append(self.sector)
            self.crags.append(self.crag)

    def test_consolidate_crag(self):
        self.duplicate_route()

        consolidate_crag(None, None, self.crags)

        self.assertEqual(models.Crag.objects.count(), 1)
        sector1, sector2 = list(models.Sector.objects.all())
        self.assertEqual(sector1.crag, sector2.crag)
        route1, route2 = list(models.Route.objects.all())
        self.assertNotEqual(route1.sector, route2.sector)

    def test_consolidate_sector(self):
        self.duplicate_route()

        consolidate_sector(None, None, self.sectors)

        self.assertEqual(models.Sector.objects.count(), 1)
        route1, route2 = list(models.Route.objects.all())
        self.assertEqual(route1.sector, route2.sector)

    def test_consolidate_route(self):
        self.duplicate_route()

        consolidate_route(None, None, self.routes)

        self.assertEqual(models.Route.objects.count(), 1)
