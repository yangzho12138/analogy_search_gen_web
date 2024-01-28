#!/bin/bash
celery -A auth worker --loglevel=info --queues=generate_log_queue
