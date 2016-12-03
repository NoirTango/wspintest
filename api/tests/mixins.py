from django.contrib.auth.models import User

from api import models


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
