from datetime import timedelta, datetime
from django.utils import timezone


start = datetime.now()
change=timedelta(seconds=10)
print(start)
print(start+change)