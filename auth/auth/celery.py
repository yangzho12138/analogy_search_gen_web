from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth.settings')

app = Celery('tasks',
             broker='pyamqp://admin:admin@localhost:5672//',
             backend='rpc://')
app.conf.update(
    task_serializer="pickle",
    result_serializer="pickle",
    accept_content=["pickle"]
)

app.conf.task_routes = {
    # send create user message to assignment system for MongoDB
    'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
    'gen.generation.tasks.generate_log': {'queue': 'generate_log_queue'},
    'search.analogy.tasks.search_log': {'queue': 'search_log_queue'},
    # 'auth.users.tasks.analogy_issue': {'queue': 'analogy_issue_queue'},
}

app.autodiscover_tasks()
