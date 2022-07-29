from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from .settings import CELERY_BROKER_URL

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atlas_api.settings')

app = Celery('atlas_api', broker=CELERY_BROKER_URL)
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()