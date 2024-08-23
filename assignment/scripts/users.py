import requests
from mongoengine import connect
import os
import django
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

# print(sys.path)

from assign.mongo_models import User

def setup_mongo_app():
    connect(
        db='assignment',
        host='localhost',
        port=27017
    )

def fetch_users_from_api():
    response = requests.get('http://localhost:8000/api/users/signup')
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()

def migrate_users():
    setup_mongo_app()
    
    # Fetch users from API
    users = fetch_users_from_api().get('users', [])

    for user in users:
        try:
            mongo_user = User(
                username=user["username"],
                collected_analogies=[], 
                generated_questions=[], 
                generated_questionnaires=[]
            )
            mongo_user.save()
            print(f'Migrated {user["username"]} to MongoDB')
        except Exception as e:       
            print(f'Error migrating {user["username"]}: {e}')

if __name__ == "__main__":
    migrate_users()