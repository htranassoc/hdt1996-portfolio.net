#!/bin/sh
set -e
ls -l
python3 manage.py collectstatic --noinput --clear
python3 manage.py makemigrations --noinput
python3 manage.py migrate

uwsgi --socket :8000 --master -b 32768 --enable-threads --module django_server.wsgi