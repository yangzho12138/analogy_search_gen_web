from search.celery import app
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=1)
es = Elasticsearch("http://localhost:9200")
index = 'sci_ranked'

@app.task
def get_data_from_redis():
    # check generated analogy
    try:
        gen_analogies =  r.lrange('generationAnalogy', 0, -1)
        gen_analogies = [json.loads(analogy) for analogy in gen_analogies]
        bulk_actions = []
        for gen_analogy in gen_analogies:
            # store analogy into es
                default_values = {
                    "analogy": "",
                    "target": "",
                    "prompt": "",
                    "temp": "", #temp is float
                    "src": "",
                    "pid": "",
                    "pid_esc": "",
                    "len": 0,
                    "topp": 0.0,
                    "freq": 0.0,
                    "pres": 0.0,
                    "bo": 0,
                    "like": 0,
                    "dislike": 0
                }
                gen_analogy = {**default_values, **gen_analogy}

                bulk_actions.append({
                    "_op_type": "index",
                    "_index": index,
                    "_source": gen_analogy
                })

        if bulk_actions:
                bulk(es, bulk_actions)

        
    except Exception as e:
         return {
            'status': 400,
            'message': 'Storing analogies failed',
            'data': {
                'Storing analogy error': str(e)
            }
        }

    try:
        # check delete analogy
        del_analogies =  r.lrange('deleteAnalogy', 0, -1)
        del_analogies = [json.loads(analogy) for analogy in del_analogies]

        for del_analogy in del_analogies:
            es.delete(index=index, id=del_analogy["_id"])
    except Exception as e:
        return {
            'status': 400,
            'message': 'Deleting analogies failed',
            'data': {
                'Deleting analogy error': str(e)
            }
        }


    try:
        # check update analogy
        update_analogies =  r.lrange('updateAnalogy', 0, -1)
        update_analogies = [json.loads(analogy) for analogy in update_analogies]
        for update_analogy in update_analogies:
            id = update_analogy["_id"]
            update_fields = update_analogy["analogy"]

            if id and update_fields:
                es.update(index=index, id=id, body={"doc": {"analogy": update_fields}})
        return 'Data fetched from redis'
    except Exception as e:
        return {
            'status': 400,
            'message': 'Updating analogies failed',
            'data': {
                'Updating analogy error': str(e)
            }
        }

@app.task(name='search.analogy.tasks.search_log')
def search_log(log_data):
    print('Log generated:', log_data)
    return log_data