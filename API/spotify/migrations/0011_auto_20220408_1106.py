# Generated by Django 3.1.2 on 2022-04-08 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0010_alter_hostsongdata_id_alter_spotifytoken_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hostsongdata',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]