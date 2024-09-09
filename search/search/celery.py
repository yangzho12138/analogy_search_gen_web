from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'search.settings')

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
    'search.analogy.tasks.search_log': {'queue': 'search_log_queue'},
    'gen.generation.tasks.generate_analogy': {'queue': 'generate_analogy_queue'},
    'search.analogy.tasks.assign_analogy': {'queue': 'assign_analogy_queue'},
}

# schedule tasks
# app.conf.beat_schedule = {
#     'get-data-from-redis-every-second': {
#         'task': 'analogy.tasks.get_data_from_redis',
#         'schedule': timedelta(seconds=1),
#     },
# }

app.autodiscover_tasks()
