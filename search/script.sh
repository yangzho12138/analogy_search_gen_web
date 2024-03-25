celery -A search beat --loglevel=info &
celery -A search worker --loglevel=info &
python manage.py runserver 0.0.0.0:8001