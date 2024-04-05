from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gen.settings')

app = Celery('tasks',
             broker='amqps://lhcyjupx:rKqBe890tVvjUWkMdnCwmUl0szi8FL-F@shark.rmq.cloudamqp.com/lhcyjupx',
             backend='rpc://')

app.conf.task_routes = {
    # 'auth.users.tasks.create_user': {'queue': 'user_created_queue'},
    'gen.generation.tasks.generate_log': {'queue': 'generate_log_queue'},
    }

app.autodiscover_tasks()
