#!/bin/bash
celery -A auth worker --loglevel=info --queues=generate_log_queue &
celery -A auth worker --loglevel=info --queues=search_log_queue &
python manage.py runserver 0.0.0.0:8000