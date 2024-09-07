import requests
from mongoengine import connect
import os
import django
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

from assign.mongo_models import Analogy

def setup_mongo_app():
    connect(
        db='assignment',
        host='mongodb://localhost:27017/?replicaSet=rs0'
    )

def fetch_analogies_from_api():
    response = requests.get('http://localhost:8001/api/search')
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()

def migrate_analogies():
    setup_mongo_app()
    
    # Fetch analogies from API
    analogies = fetch_analogies_from_api().get('docs', [])

    for analogy in analogies:
        try:
            mongo_analogy = Analogy(
                target = analogy['target'],
                prompt = analogy['prompt'],
                analogy = analogy['analogy'],
                id = analogy['pid'],
                temp = analogy['temp'],
                src = analogy['src'],
                model = analogy['model'],
                generatorRole = analogy['generatorRole']
            )
            mongo_analogy.save()
            print(f"Migrated {analogy['pid']} to MongoDB")
        except Exception as e:
            print(f"Error migrating {analogy['pid']}: {e}")

if __name__ == "__main__":
    migrate_analogies()