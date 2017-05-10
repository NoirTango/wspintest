import csv
import datetime
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
        
    def get_csv(self, rows):
        columns = ['Date', 'Route', 'Style', 'Grade', 'Sector', 'Crag', 'Country']
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        for row in rows:
            row = {k: v for k, v in zip(columns, row)}
            writer.writerow(row)
        
        return output.getvalue()

    def assert_record_equal_tuple(self, record, values):
        self.assertEqual(record.date, datetime.datetime.strptime(values.pop(0), '%Y-%m-%d').date())
        self.assertEqual(record.route.name, values.pop(0))
        self.assertEqual(record.style, values.pop(0))
        self.assertEqual(record.route.grade, values.pop(0))
        self.assertEqual(record.route.sector.name, values.pop(0))
        self.assertEqual(record.route.sector.crag.name, values.pop(0))
        self.assertEqual(record.route.sector.crag.country, values.pop(0))
    
    def assert_successful_post(self, rows):
        csv_data = self.get_csv(rows)
        response = self.client.post(reverse('csv-import'), data=csv_data, content_type='text/csv', 
                                    HTTP_CONTENT_DISPOSITION='attachment; filename="testfile.csv"')
        self.assertEqual(response.status_code, 201)
        
    def test_import_single_line(self):
        row = ['2017-01-01', 'Route', 'RP', '6a', 'Sect', 'Crg', 'Country']
        self.assert_successful_post([row])
        self.assertEqual(models.ClimbRecord.objects.count(), 1)
        self.assert_record_equal_tuple(models.ClimbRecord.objects.first(), row)
        
    def test_import_multiple_routes(self):
        rows = [['2017-01-01', 'R1', 'RP', '6a', 'S1', 'C1', 'C1'],
                ['2017-01-01', 'R2', 'RP', '6b', 'S2', 'C2', 'C1']]
        self.assert_successful_post(rows)
        self.assert_record_equal_tuple(models.ClimbRecord.objects.first(), rows[0])
        self.assert_record_equal_tuple(models.ClimbRecord.objects.last(), rows[1])
        
        self.assertEqual(models.ClimbRecord.objects.count(), 2)
        self.assertEqual(models.Route.objects.count(), 2)
        self.assertEqual(models.Sector.objects.count(), 2)
        self.assertEqual(models.Crag.objects.count(), 2)

    def test_import_multiple_orutes_same_crag(self):
        rows = [['2017-01-01', 'R1', 'RP', '6a', 'S1', 'C1', 'C1'],
                ['2017-01-01', 'R2', 'RP', '6b', 'S2', 'C1', 'C1']]
        self.assert_successful_post(rows)
        self.assertEqual(models.ClimbRecord.objects.count(), 2)
        self.assertEqual(models.Route.objects.count(), 2)
        self.assertEqual(models.Sector.objects.count(), 2)
        self.assertEqual(models.Crag.objects.count(), 1)

    def test_import_multiple_orutes_same_sector(self):
        rows = [['2017-01-01', 'R1', 'RP', '6a', 'S1', 'C1', 'C1'],
                ['2017-01-01', 'R2', 'RP', '6b', 'S1', 'C1', 'C1']]
        self.assert_successful_post(rows)
        self.assertEqual(models.ClimbRecord.objects.count(), 2)
        self.assertEqual(models.Route.objects.count(), 2)
        self.assertEqual(models.Sector.objects.count(), 1)
        self.assertEqual(models.Crag.objects.count(), 1)

    def test_import_multiple_orutes_same_route(self):
        rows = [['2017-01-01', 'R1', 'RP', '6a', 'S1', 'C1', 'C1'],
                ['2017-01-01', 'R1', 'F', '6a', 'S1', 'C1', 'C1']]
        self.assert_successful_post(rows)
        self.assertEqual(models.ClimbRecord.objects.count(), 2)
        self.assertEqual(models.Route.objects.count(), 1)
        self.assertEqual(models.Sector.objects.count(), 1)
        self.assertEqual(models.Crag.objects.count(), 1)
