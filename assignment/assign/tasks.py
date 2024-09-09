from assignment.celery import app
import json
from .mongo_models import Analogy, User

@app.task(name='auth.users.tasks.create_user', autoretry_for=(Exception,), retry_kwargs={'max_retries': 5, 'countdown': 60})
def create_user(user_data):
    print('produce_user_created', user_data)
    try:
        user = User(
            username=user_data['username'],
            collected_analogies=[],
        )
        user.save()
        return {
            'status': 200,
            'message': 'User stored',
            'data': {'id': user.id}
        }
    except Exception as e:
        return {
            'status': 400,
            'message': 'Storing users into MongoDB failed',
            'data': {
                'Storing user error': str(e)
            }
        }

@app.task(name='search.analogy.tasks.assign_analogy', autoretry_for=(Exception,), retry_kwargs={'max_retries': 5, 'countdown': 60})
def generate_analogy(gen_analogy):
    print('Analogy generated:', gen_analogy)
    try:
        if isinstance(gen_analogy, str):
            gen_analogy = json.loads(gen_analogy)
        mongo_analogy = Analogy(
                target = str(gen_analogy['target']),
                prompt = str(gen_analogy['prompt']),
                analogy = str(gen_analogy['analogy']),
                id = str(gen_analogy['pid']),
                temp = str(gen_analogy['temp']),
                src = str(gen_analogy['src']),
                model = str(gen_analogy['model']),
                generatorRole = str(gen_analogy['generatorRole'])
            )
        print('Analogy:', mongo_analogy)
        mongo_analogy.save()
        return {
            'status': 200,
            'message': 'Analogy stored successfully',
            'data': {'id': mongo_analogy.id}
        }
    except Exception as e:
        return {
            'status': 400,
            'message': 'Storing analogies into MongoDB failed',
            'data': {
                'Storing analogy error': str(e)
            }
        }
