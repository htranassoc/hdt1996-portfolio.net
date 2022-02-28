# Generated by Django 3.2.7 on 2021-12-27 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0009_profile'),
    ]

    operations = [
        migrations.CreateModel(
            name='React_Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(blank=True, null=True)),
                ('body', models.TextField(blank=True, null=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
