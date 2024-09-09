from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gen.settings')

app = Celery('tasks',
             broker='pyamqp://admin:admin@localhost:5672//',
             backend='rpc://')
app.conf.update(
    task_serializer="pickle",
    result_serializer="pickle",
    accept_content=["pickle"]
)
app.conf.task_routes = {
    # 'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
    'gen.generation.tasks.generate_log': {'queue': 'generate_log_queue'},
    'gen.generation.tasks.generate_analogy': {'queue': 'generate_analogy_queue'},
}

app.autodiscover_tasks()
