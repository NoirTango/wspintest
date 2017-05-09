import csv
from io import StringIO

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from api import models
from api.tests import mixins


class TestExportCSV(mixins.WithLoggedUserMixin, mixins.WithOneRouteMixin, TestCase):
    EXPECTED_COLUMNS = ['Date', 'Route', 'Style', 'Grade', 'Sector', 'Crag', 'Country']

    def setUp(self):
        self.setUpLogin()
        self.setUpRoute()

    def get_exported_csv_reader(self):
        response = self.client.get(reverse('csv-export'))
        self.assertEqual(response.status_code, 200)
        inp = StringIO(response.content.decode())
        return csv.DictReader(inp)

    def test_export_header(self):
        reader = self.get_exported_csv_reader()
        self.assertEqual(reader.fieldnames, self.EXPECTED_COLUMNS)

    def test_export_one_route(self):
        models.ClimbRecord.objects.create(route=self.route, user=self.user, style='STYLE')
        reader = self.get_exported_csv_reader()
        row = reader.__next__()
        self.assertEqual(row['Style'], 'STYLE')
        self.assertEqual(row['Grade'], self.route.grade)
        self.assertEqual(row['Sector'], self.route.sector.name)
        self.assertEqual(row['Crag'], self.route.sector.crag.name)
        self.assertEqual(row['Country'], self.route.sector.crag.country)
        with self.assertRaises(StopIteration):
            reader.__next__()

    def test_export_number_routes(self):
        for _ in range(7):
            models.ClimbRecord.objects.create(route=self.route, user=self.user, style='STYLE')
        reader = self.get_exported_csv_reader()
        num_lines = sum([1 for _ in reader])
        self.assertEqual(num_lines, 7)


class TestImportCSV(mixins.WithLoggedUserMixin, APITestCase):
    def setUp(self):
        self.setUpLogin()
        columns = ['Date', 'Route', 'Style', 'Grade', 'Sector', 'Crag', 'Country']
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        for i in range(5):
            writer.writerow({k: '{}{}'.format(k, i) for k in columns})
        self.csv = output

    def test_import(self):
        response = self.client.post(reverse('csv-import'), {'file': self.csv}, format='multipart',
                                    HTTP_CONTENT_DISPOSITION='attachment; filename="testfile.csv"')
        print(response.content)
        self.assertEqual(response.status_code, 200)
