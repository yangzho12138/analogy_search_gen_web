#!/bin/bash
celery -A assignment worker --loglevel=info --queues=user_created_queue --concurrency=3 -n  assignmentworker1@%h  &
celery -A assignment worker --loglevel=info --queues=assign_analogy_queue --concurrency=3 -n  assignmentworker1@%h  &
python manage.py runserver 0.0.0.0:8003