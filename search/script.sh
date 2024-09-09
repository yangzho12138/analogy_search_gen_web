celery -A search worker --loglevel=info --queues=generate_analogy_queue --concurrency=3 -n searchworker1@%h &
python manage.py runserver 0.0.0.0:8001
