#!/bin/bash
celery -A auth worker --loglevel=info --queues=generate_log_queue --concurrency=3 -n  authworker1@%h  &
celery -A auth worker --loglevel=info --queues=search_log_queue --concurrency=3 -n authworker2@%h &
python manage.py runserver 0.0.0.0:8000
