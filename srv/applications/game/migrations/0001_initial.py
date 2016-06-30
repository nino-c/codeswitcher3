# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-05-21 02:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_thumbs.db.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=1000)),
                ('description', models.TextField(blank=True, null=True)),
                ('image', django_thumbs.db.models.ImageWithThumbsField(blank=True, null=True, upload_to=b'')),
                ('enabled', models.BooleanField(default=True)),
                ('popularity', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='CodeModule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('language', models.CharField(choices=[('javascript', 'text/javascript'), ('coffeescript', 'text/coffeescript'), ('paperscript', 'text/paperscript')], default='javascript', max_length=20)),
                ('source', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CodeSwitchingPhrase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phrase', models.TextField()),
                ('popularity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='GameInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('seed', models.TextField()),
                ('popularity', models.IntegerField(default=1)),
                ('vector', models.CharField(max_length=5000, null=True, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GameInstanceSnapshot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('image', django_thumbs.db.models.ImageWithThumbsField(upload_to=b'')),
                ('time', models.FloatField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='JSLibrary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('scriptPath', models.CharField(max_length=200)),
            ],
            options={
                'verbose_name_plural': 'JS libraries',
            },
        ),
        migrations.CreateModel(
            name='SavedFunction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('language', models.CharField(choices=[('javascript', 'text/javascript'), ('coffeescript', 'text/coffeescript'), ('paperscript', 'text/paperscript')], default='javascript', max_length=20)),
                ('source', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SeedVectorParam',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=255)),
                ('val', models.CharField(blank=True, default='', max_length=5000, null=True)),
                ('int_val', models.IntegerField(blank=True, null=True)),
                ('valtype', models.CharField(default='string', max_length=25)),
                ('jsonval', models.TextField(default='')),
                ('ordering', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ('ordering',),
            },
        ),
        migrations.CreateModel(
            name='ZeroPlayerGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=500)),
                ('subtitle', models.CharField(blank=True, max_length=500, null=True)),
                ('description', models.TextField(blank=True)),
                ('scriptType', models.CharField(max_length=100, null=True)),
                ('source', models.TextField(blank=True)),
                ('seedStructure', models.TextField(blank=True)),
                ('mainImage', models.CharField(blank=True, max_length=255, null=True)),
                ('popularity', models.IntegerField(default=1)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='apps', to='game.Category')),
                ('extraIncludes', models.ManyToManyField(to='game.JSLibrary')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]