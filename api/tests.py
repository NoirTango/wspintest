from django.test import TestCase
from django.contrib.auth.models import User

from . import models
from rest_framework.reverse import reverse


class TestPostClimbingRecord(TestCase):
    def setUp(self):
        self.test_user_email = 'someuser@wherever.com'
        self.test_user_name = self.test_user_email
        self.test_user_password = 'password'
        self.user = User.objects.create_user(self.test_user_name,
                                             self.test_user_email,
                                             self.test_user_password)
        self.client.login(username=self.test_user_name, password=self.test_user_password)

        self.crag = models.Crag.objects.create(name='crag', country='country')
        self.sector = models.Sector.objects.create(name='sector', crag=self.crag)
        self.route = models.Route.objects.create(name='route', grade='grade', sector=self.sector)

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
