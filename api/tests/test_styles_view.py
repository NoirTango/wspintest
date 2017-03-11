from django.test import TestCase
from rest_framework.reverse import reverse
from django.contrib.auth.models import User

from api.tests import mixins
from api import models


class TestSumHistory(mixins.WithLoggedUserMixin, TestCase):
    def setUp(self):
        self.setUpLogin()

    def test_styles_endpoint_with_no_styles(self):
        response = self.client.get(reverse('styles-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_can_post_style(self):
        response = self.client.post(reverse('styles-list'), {'style': 'FLASH', 'multiplier': 1.3, 'user': self.user.id})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(models.ClimbStyle.objects.count(), 1)

    def test_cannot_post_style_to_other_user(self):
        another_user = User.objects.create_user('anotherusername', 'another_user@here.com', 'password')
        response = self.client.post(reverse('styles-list'), {'style': 'F', 'multiplier': 1, 'user': another_user.id})
        self.assertEqual(response.status_code, 403)

    def test_view_is_sorted(self):
        for i, letter in enumerate('abcde'):
            models.ClimbStyle.objects.create(style=letter, multiplier=i, user=self.user)
        response = self.client.get(reverse('styles-list'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual([d['multiplier'] for d in data], [4., 3., 2., 1., 0.])
            