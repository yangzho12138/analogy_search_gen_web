from auth.celery import app
from .models import GenLog, CustomUser as User
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

# @app.task(name='auth.users.tasks.create_user')
# def create_user(user_data):
#     print('produce_user_created', user_data)
#     return user_data

@app.task(name='gen.generation.tasks.generate_log')
def generate_log(generation_log):
    logger.info('produce_generate_log', generation_log)
    # store data into database
    user = User.objects.get(username=generation_log['username'])
    gen_log = GenLog(
        user=user,
        created_at=generation_log['created_at'],
        prompt=generation_log['prompt'],
        target=generation_log['target'],
        src=generation_log['src'],
        temp=generation_log['temp'],
        freq_penalty=generation_log['freq_penalty'],
        pres_penalty=generation_log['pres_penalty'],
        max_length=generation_log['max_length'],
        top_p=generation_log['top_p'],
        best_of=generation_log['best_of'],
        analogy=generation_log['analogy']
    )
    gen_log.save()
    return generation_log

