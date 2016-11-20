from django.contrib import admin
from .models import Crag, Sector, Route, ClimbRecord


def consolidate_related_field(queryset, attribute, reverse_attribute):
    reference_object = None
    for object in queryset:
        if reference_object is None:
            reference_object = object
            continue
        for related in getattr(object, attribute).all():
            setattr(related, reverse_attribute, reference_object)
            related.save()
        object.delete()


def consolidate_crag(modeladmin, request, queryset):
    consolidate_related_field(queryset, 'sector_set', 'crag')

consolidate_crag.short_description = 'Consolidate selected crags'


def consolidate_sector(modeladmin, request, queryset):
    consolidate_related_field(queryset, 'route_set', 'sector')

consolidate_sector.short_description = 'Consolidate selected sectors'


def consolidate_route(modeladmin, request, queryset):
    consolidate_related_field(queryset, 'climbrecord_set', 'route')

consolidate_sector.short_description = 'Consolidate selected sectors'


class CragAdmin(admin.ModelAdmin):
    actions = [consolidate_crag]


class SectorAdmin(admin.ModelAdmin):
    actions = [consolidate_sector]


class RouteAdmin(admin.ModelAdmin):
    actions = [consolidate_route]

admin.site.register(Crag, CragAdmin)
admin.site.register(Sector, SectorAdmin)
admin.site.register(Route, RouteAdmin)
admin.site.register(ClimbRecord)
