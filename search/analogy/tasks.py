from auth.celery import app
from .models import SearchLog, CustomUser as User
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

# @app.task(name='auth.users.tasks.create_user')
# def create_user(user_data):
#     print('produce_user_created', user_data)
#     return user_data

# @app.task(name='search.analogy.tasks.generate_search_log')
# def generate_search_log(search_log):
#     logger.info('produce_search_log', search_log)
#     # store data into database
#     user = User.objects.get(username=search_log['username'])
#     ser_log = SearchLog(
#         user=user,
#         created_at=search_log['created_at'],
#         query=search_log['query'],
#         analogies=search_log['analogies']
#     )
#     ser_log.save()
#     return search_log

