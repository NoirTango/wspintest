from django.conf.urls import url

from web.views import home_view, login_view
urlpatterns = [
               url(r'^$', home_view),
               url(r'^login/', login_view)
]
