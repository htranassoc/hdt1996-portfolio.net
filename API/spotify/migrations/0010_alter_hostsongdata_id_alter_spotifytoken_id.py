# Generated by Django 4.0.3 on 2022-04-08 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0009_auto_20220407_0700'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hostsongdata',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]