from django.contrib import admin
from .models import Crag, Sector, Route

# Register your models here.

admin.site.register(Crag)
admin.site.register(Sector)
admin.site.register(Route)
