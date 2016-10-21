from django.db import models

# Create your models here.
class Crag(models.Model):
    name = models.TextField()
    country = models.TextField()

class Sector(models.Model):
    name = models.TextField()
    crag = models.ForeignKey(Crag)

class Route(models.Model):
    name = models.TextField()
    sector = models.ForeignKey(Sector)
