import datetime

from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE


class Crag(models.Model):
    name = models.TextField()
    country = models.TextField()

    def __str__(self):
        return '{} - {}'.format(self.name, self.country)


class Sector(models.Model):
    name = models.TextField()
    crag = models.ForeignKey(Crag)

    def __str__(self):
        return '{} - {}'.format(self.name, self.crag.name)


class Route(models.Model):
    name = models.TextField()
    sector = models.ForeignKey(Sector)
    grade = models.CharField(max_length=20)

    def __str__(self):
        return '{} - {} - {}'.format(self.name, self.grade, self.sector)


class ClimbRecord(models.Model):
    route = models.ForeignKey(Route)
    date = models.DateField(default=datetime.date.today)
    user = models.ForeignKey(User, on_delete=CASCADE)

    def __str__(self):
        return '{}: {} - {} / {}'.format(self.user.username, self.route.name, self.route.grade, self.date)


class GradeScore(models.Model):
    grade = models.CharField(max_length=20)
    score = models.FloatField()
    user = models.ForeignKey(User, on_delete=CASCADE)

    class Meta:
        unique_together = ('user', 'grade',)
