import datetime

from django.test import TestCase
from rest_framework.reverse import reverse

from api.tests import mixins
from api import models


class TestSumHistory(mixins.WithLoggedUserMixin, mixins.WithOneRouteMixin, TestCase):
    def setUp(self):
        self.setUpLogin()
        self.setUpRoute()

    def test_sum_endpoint_exists(self):
        response = self.client.get(reverse('sum-history'))
        self.assertEqual(response.status_code, 200)

    def get_years_from_response(self, data):
        return [d['year'] for d in data]

    def test_sum_endpoint_returns_year_list(self):
        start_year = 2005
        end_year = 2011
        response = self.client.get(reverse('sum-history'), {'start_year': start_year, 'end_year': end_year})
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(list(range(start_year, end_year + 1)), self.get_years_from_response(data))

    def test_sum_endpoint_returns_default_year_list(self):
        response = self.client.get(reverse('sum-history'))
        data = response.json()
        this_year = datetime.date.today().year
        self.assertEqual(list(range(this_year - 10, this_year + 1)), self.get_years_from_response(data))

    def add_n_route_records(self, date, n, style):
        for _ in range(n):
            models.ClimbRecord.objects.create(route=self.route, style=style, date=date, user=self.user)

    def add_grade_score(self, grade, score):
        models.GradeScore.objects.create(grade=grade, score=score, user=self.user)

    def test_sum_endpoint_sums_records(self):
        today = datetime.date.today()
        num_routes = 7
        self.add_n_route_records(today, num_routes, '')

        base_score = 1.1
        self.add_grade_score(self.route.grade, base_score)

        response = self.client.get(reverse('sum-history'))
        data = response.json()
        self.assertDictAlmostEqual(data[-1], {'year': today.year, 'other': num_routes * base_score})

    def test_sum_endpoint_sums_records_with_style(self):
        style_name = 'OO'
        style_score = 1.3
        models.ClimbStyle.objects.create(style=style_name, multiplier=style_score, user=self.user)

        today = datetime.date.today()
        num_routes = 9
        self.add_n_route_records(today, num_routes, style_name)

        base_score = 3.8
        self.add_grade_score(self.route.grade, base_score)

        response = self.client.get(reverse('sum-history'))
        data = response.json()
        self.assertDictAlmostEqual(data[-1],
                                   {'year': today.year, style_name: num_routes * base_score * style_score, 'other': 0})

    def assertDictAlmostEqual(self, dict1, dict2):
        keys = list(dict1.keys())
        for k in keys:
            if isinstance(dict1[k], float):
                self.assertAlmostEqual(dict1[k], dict2[k])
            else:
                self.assertEqual(dict1[k], dict2[k])
            dict1.pop(k)
            dict2.pop(k)
        self.assertEqual(dict2, {})

    def test_sum_endpoint_various_data(self):
        style_name = 'OO'
        style_score = 1.3
        models.ClimbStyle.objects.create(style=style_name, multiplier=style_score, user=self.user)

        base_score = 2.7
        self.add_grade_score(self.route.grade, base_score)

        num_routes = 11
        today = datetime.date(2006, 10, 11)
        self.add_n_route_records(today, num_routes, style_name)
        today = datetime.date(2007, 10, 11)
        self.add_n_route_records(today, num_routes, '')

        response = self.client.get(reverse('sum-history'), {'start_year': 2006, 'end_year': 2007})

        data = response.json()
        self.assertDictAlmostEqual(data[0],
                                   {'year': 2006, 'other': 0, style_name: num_routes * base_score * style_score})
        self.assertDictAlmostEqual(data[1],
                                   {'year': 2007, 'other': num_routes * base_score, style_name: 0})
