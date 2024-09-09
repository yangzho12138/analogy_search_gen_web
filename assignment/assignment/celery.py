from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')

app = Celery('tasks',
             broker='pyamqp://admin:admin@localhost:5672//',
             backend='rpc://')
app.conf.update(
    task_serializer="pickle",
    result_serializer="pickle",
    accept_content=["pickle"]
)
app.conf.task_routes = {
   'search.analogy.tasks.assign_analogy': {'queue': 'assign_analogy_queue'},
   'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
}

app.autodiscover_tasks()
