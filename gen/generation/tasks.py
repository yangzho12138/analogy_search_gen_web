from gen.celery import app
# from django.contrib.auth.models import User
from celery import shared_task
import redis
import json

# @app.task(name='auth.users.tasks.create_user')
# def sync_user(user_data):
#     print('Received user data for syncing:', user_data)
#     username = user_data['username']
#     email = user_data['email']
#     user, created = User.objects.get_or_create(username=username, defaults={'email': email})
#     if not created:
#         user.email = email
#         user.save()
#     print('User synced:', username)
#     return username

@app.task(name='gen.generation.tasks.generate_log')
def generate_log(log_data):
    print('Log generated:', log_data)
    return log_data


# Setting up Redis
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=1)

# @shared_task(bind=True, name='gen.generation.tasks.send_analogy')
# def send_analogy(self):
#     key, data = redis_client.blpop('generationLog')

#     if data:
#         generation_log = json.loads(data)
#         app.send_task('gen.generation.tasks.send_analogy', args=[generation_log])
#         print('Data processed and sent for consumption:', generation_log)