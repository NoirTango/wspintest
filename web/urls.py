from django.conf.urls import url

from web import views

urlpatterns = [
               url(r'^$', views.home_view, name='home'),
               url(r'^stats/$', views.stats_view, name='stats'),
               url(r'^grades/$', views.grades_view, name='grades'),
               url(r'^import/$', views.import_view, name='import'),
               url(r'^login/', views.login_view, name='login'),
               url(r'^logout/', views.logout_view, name='logout'),
               url(r'^register/', views.register_view, name='register'),
]
