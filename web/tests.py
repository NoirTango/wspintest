from django.test import TestCase
from django.contrib.auth.models import User


class TestHomeView(TestCase):
    def setUp(self):
        self.test_user_name = 'testuser'
        self.test_user_password = 'testpass'
        self.test_user_email = ''
        self.post_login_data = {'username': self.test_user_name, 'password': self.test_user_password}
        self.user = User.objects.create_user(self.test_user_name,
                                             self.test_user_email,
                                             self.test_user_password)

    def do_valid_login(self):
        self.client.login(username=self.test_user_name, password=self.test_user_password)

    def do_logout(self):
        self.client.logout()

    def test_home_denied_without_login(self):
        resp = self.client.get('/', follow=False)
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.url, '/login/?next=/')

    def test_home_shows_after_login(self):
        self.do_valid_login()
        resp = self.client.get('/')
        self.assertEqual(resp.status_code, 200)

    def test_login_page_shows(self):
        resp = self.client.get('/login/')
        self.assertEqual(resp.status_code, 200)

    def test_login_page_logins_on_post(self):
        resp = self.client.post('/login/', self.post_login_data, follow=False)
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.url, '/')

    def test_login_page_follows_on_login(self):
        self.post_login_data['next'] = '/somewhere'
        resp = self.client.post('/login/', self.post_login_data, follow=False)
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(resp.url, '/somewhere')

    def test_login_logout_cycle(self):
        resp = self.client.get('/', follow=False)
        self.assertEqual(resp.status_code, 302)

        resp = self.client.post('/login/', self.post_login_data)

        resp = self.client.get('/', follow=False)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get('/logout/')

        resp = self.client.get('/', follow=False)
        self.assertEqual(resp.status_code, 302)
