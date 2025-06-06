from search.celery import app
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import json

es = Elasticsearch("http://localhost:9200")
index = 'sci_ranked'

# @app.task
# def get_data_from_redis():
#     # check generated analogy
#     gen_analogy =  r.lpop('generationAnalogy')
#     if gen_analogy is not None:
#         try:
#             gen_analogy = json.loads(gen_analogy)
#             bulk_actions = []
#             # store analogy into es
#             default_values = {
#                 "analogy": "",
#                 "target": "",
#                 "prompt": "",
#                 "model": "gpt-3",
#                 "temp": "", #temp is float
#                 "src": "",
#                 "pid": "",
#                 "pid_esc": "",
#                 "max_length": 0,
#                 "top_p": 0.0,
#                 "freq_penalty": 0.0,
#                 "pres_penalty": 0.0,
#                 "best_of": 0,
#                 "like": [0, 0, 0],
#                 "dislike": [0, 0, 0],
#                 "generatorRole": ""
#             }
            
#             analogy = {**default_values, **gen_analogy}
#             bulk_actions.append({
#                 "_op_type": "index",
#                 "_index": index,
#                 "_source": analogy
#             })
#             if bulk_actions:
#                     bulk(es, bulk_actions)
#         except Exception as e:
#             r.rpush('generationAnalogy', gen_analogy)
#             return {
#                 'status': 400,
#                 'message': 'Storing analogies failed',
#                 'data': {
#                     'Storing analogy error': str(e)
#                 }
#             }

#     del_analogy =  r.lpop('deleteAnalogy')
#     if del_analogy is not None:
#         try:
#             # check delete analogy
#             del_analogy =  json.load(del_analogy)
#             es.delete(index=index, id=del_analogy["_id"])
#         except Exception as e:
#             r.rpush('deleteAnalogy', del_analogy)
#             return {
#                 'status': 400,
#                 'message': 'Deleting analogies failed',
#                 'data': {
#                     'Deleting analogy error': str(e)
#                 }
#             }


#     update_analogy = r.lpop('updateAnalogy')
#     if update_analogy is not None:
#         try:
#             # check update analogy
#             update_analogy =  json.load(update_analogy)
#             id = update_analogy["_id"]
#             update_fields = update_analogy["analogy"]

#             if id and update_fields:
#                 es.update(index=index, id=id, body={"doc": {"analogy": update_fields}})
#             return 'Data fetched from redis'
#         except Exception as e:
#             r.rpush('updateAnalogy', update_analogy)
#             return {
#                 'status': 400,
#                 'message': 'Updating analogies failed',
#                 'data': {
#                     'Updating analogy error': str(e)
#                 }
#             }

@app.task(name='search.analogy.tasks.search_log')
def search_log(log_data):
    print('Log generated:', log_data)
    return log_data

@app.task(name='search.analogy.tasks.assign_analogy')
def assign_analogy(analogy_data):
    print('Analogy generated:', analogy_data)
    return analogy_data

@app.task(name='gen.generation.tasks.generate_analogy', autoretry_for=(Exception,), retry_kwargs={'max_retries': 5, 'countdown': 60})
def generate_analogy(gen_analogy):
    print('Analogy generated:', gen_analogy)
    try:    
        response = es.index(index=index, body=gen_analogy)

        saved_data = {**gen_analogy, 'pid': response['_id']}
        assign_analogy.delay(json.dumps(saved_data))
        return {
            'status': 200,
            'message': 'Analogy stored successfully',
            'data': {
                'id': response['_id'],
                'analogy': gen_analogy
            }
        }
    except Exception as e:
        return {
            'status': 400,
            'message': 'Storing analogies failed',
            'data': {
                'Storing analogy error': str(e)
            }
        }
