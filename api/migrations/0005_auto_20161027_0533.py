# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-27 05:33
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_climbrecord_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='climbrecord',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]
