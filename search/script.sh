#!/bin/bash
celery -A search worker --loglevel=info --queues=search_log_queue
