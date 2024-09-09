from gen.celery import app

@app.task(name='gen.generation.tasks.generate_log')
def generate_log(log_data):
    print('Log generated:', log_data)
    return log_data


@app.task(name='gen.generation.tasks.generate_analogy')
def generate_analogy(analogy_data):
    print('Analogy generated:', analogy_data)
    return analogy_data