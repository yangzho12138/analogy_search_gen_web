from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'search.settings')

app = Celery('tasks',
             broker='amqps://tldvxkdd:Ip77pJGCzVH0b0LOyuJCLz5YToOn1Zaq@gull.rmq.cloudamqp.com/tldvxkdd',
             backend='rpc://')

app.conf.task_routes = {
    # 'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
    }

# schedule tasks
app.conf.beat_schedule = {
    'get-data-from-redis-every-second': {
        'task': 'analogy.tasks.get_data_from_redis',
        'schedule': timedelta(seconds=1),
    },
}

app.autodiscover_tasks()
