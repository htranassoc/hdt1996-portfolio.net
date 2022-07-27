#!/bin/sh
set -e
python manage.py collectstatic --noinput --clear
python manage.py makemigrations --noinput
python manage.py migrate
uwsgi --socket :8000 --master -b 32768 --enable-threads --module backend.wsgi