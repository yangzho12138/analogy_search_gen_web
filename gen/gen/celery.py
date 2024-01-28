from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gen.settings')

app = Celery('tasks',
             broker='amqps://tldvxkdd:Ip77pJGCzVH0b0LOyuJCLz5YToOn1Zaq@gull.rmq.cloudamqp.com/tldvxkdd',
             backend='rpc://')

app.conf.task_routes = {
    # 'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
    'gen.generation.tasks.generate_log': {'queue': 'generate_log_queue'},
    }

app.conf.beat_schedule = {
    'add-analogy-5-seconds': {
        'task': 'gen.generation.tasks.send_analogy',
        'schedule': 5.0,
    },
}
app.autodiscover_tasks()
