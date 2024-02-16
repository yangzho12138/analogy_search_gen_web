from search.celery import app
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=1)

@app.task
def get_data_from_redis():
    # check generated analogy
    gen_analogies =  r.lrange('generationAnalogy', 0, -1)
    gen_analogies = [json.loads(analogy) for analogy in gen_analogies]
    for gen_analogy in gen_analogies:
        # store analogy into es
        pass

    # check delete analogy
    del_analogies =  r.lrange('deleteAnalogy', 0, -1)
    del_analogies = [json.loads(analogy) for analogy in del_analogies]
    for del_analogy in del_analogies:
        # delete analogy from es
        pass

    # check update analogy
    update_analogies =  r.lrange('updateAnalogy', 0, -1)
    update_analogies = [json.loads(analogy) for analogy in update_analogies]
    for update_analogy in update_analogies:
        # update analogy into es
        pass

    return 'Data fetched from redis'
