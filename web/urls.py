from django.conf.urls import url

from web.views import home_view, login_view, logout_view
urlpatterns = [
               url(r'^$', home_view, name='home'),
               url(r'^login/', login_view, name='login'),
               url(r'^logout/', logout_view, name='logout')
]
