import json
import datetime
from django.test import TestCase
from rest_framework.reverse import reverse

from api import models
from api.admin import consolidate_crag, consolidate_sector, consolidate_route

from api.tests import mixins


class TestScoreSumView(mixins.WithLoggedUserMixin, mixins.WithOneRouteMixin, TestCase):
    def setUp(self):
        self.setUpLogin()
        self.setUpRoute()

    def test_view_exists(self):
        resp = self.client.get(reverse('scores-total'))
        self.assertEqual(resp.status_code, 200)

    def assert_single_route_N_count(self, result, count):
        stat_list = result.json()
        self.assertEqual(len(stat_list), 1)
        stat = stat_list[0]
        self.assertEqual(stat['grade'], self.route.grade)
        self.assertEqual(stat['count'], count)

    def assert_N_routes_single(self, result, count):
        stat_list = result.json()
        self.assertEqual(len(stat_list), count)
        for stat in stat_list:
            self.assertEqual(stat['count'], 1)

    def test_view_reports_single_route(self):
        for _ in range(5):
            models.ClimbRecord.objects.create(route=self.route, date=datetime.date.today(), user=self.user)
        resp = self.client.get(reverse('scores-total'))
        self.assert_single_route_N_count(resp, 5)

    def test_view_reports_route_by_year(self):
        for year in range(2010, 2015):
            models.ClimbRecord.objects.create(route=self.route, date=datetime.date(year, 1, 1), user=self.user)
        resp = self.client.get(reverse('scores-total'))
        self.assert_single_route_N_count(resp, 5)

        for year in range(2010, 2015):
            resp = self.client.get(reverse('scores-total'), {'year': year})
            self.assert_single_route_N_count(resp, 1)

        resp = self.client.get(reverse('scores-total'), {'year': 2016})
        self.assertEqual(resp.json(), [])

    def test_view_reports_multiple_routes(self):
        for i in range(5):
            r = models.Route.objects.create(name='n{}'.format(i), grade='g{}'.format(i), sector=self.route.sector)
            models.ClimbRecord.objects.create(route=r, date=datetime.date.today(), user=self.user)

        resp = self.client.get(reverse('scores-total'))
        self.assert_N_routes_single(resp, 5)

