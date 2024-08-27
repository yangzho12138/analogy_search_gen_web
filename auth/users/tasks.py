from auth.celery import app
from .models import GenLog, CustomUser as User, Issue, SearchLog
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
        analogy=generation_log['analogy'],
        grade=generation_log['grade']
    )
    gen_log.save()
    return generation_log

@app.task(name='search.analogy.tasks.search_log')
def search_log(search_log):
    logger.info('produce_search_log', search_log)
    user = User.objects.get(username=search_log['username'])
    search_log = SearchLog(
        user=user,
        created_at=search_log['created_at'],
        query=search_log['query'],
        prompt=search_log['prompt'],
        temp=search_log['temp'],
        ip=search_log['ip']
    )
    search_log.save()
    return search_log

@app.task(name='auth.users.tasks.analogy_issue')
def analogy_issue(issue):
    logger.info('produce_analogy_issue', issue)
    issue = Issue.objects.get(id=issue['id'])
    issue.solved = True
    issue.save()
    return issue
    

