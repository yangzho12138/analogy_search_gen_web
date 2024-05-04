celery -A search worker --loglevel=info --concurrency=3 -n searchworker1@%h &
celery -A search beat --loglevel=info &
python manage.py runserver 0.0.0.0:8001
