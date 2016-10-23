from django.contrib import admin
from .models import Crag, Sector, Route, ClimbRecord

# Register your models here.

admin.site.register(Crag)
admin.site.register(Sector)
admin.site.register(Route)
admin.site.register(ClimbRecord)
