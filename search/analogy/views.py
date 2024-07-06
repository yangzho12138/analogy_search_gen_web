from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch import Elasticsearch
from rest_framework import status
import nltk
import os
import json
nltk.download('stopwords')
nltk.download('punkt')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
from django.utils import timezone
from .tasks import search_log
import logging
from logging.handlers import SocketHandler

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


file_handler = logging.FileHandler('/Users/yang/Downloads/filebeat-8.13.4-darwin-x86_64/logs/test.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

def get_client_ip(request):
    # x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    # if x_forwarded_for:
    #     ip = x_forwarded_for.split(',')[0]
    # else:
    #     ip = request.META.get('REMOTE_ADDR')
    ip = request.META.get('HTTP_CLIENTIP')
    return ip

index = 'sci_ranked'
class SearchView(APIView):
    def get(self, request):
        # Initialize Elasticsearch client
        # es = Elasticsearch("http://128.174.136.29:9200")

        ip = get_client_ip(request)
        logger.info(f'IP logged: {ip}')

        es = Elasticsearch("http://localhost:9200")

        # Get all search results from the Elasticsearch index "sci_ranked"
        response = es.search(index="sci_ranked", body={"query": {"match_all": {}}}, size=100)

        # Extract relevant information from the Elasticsearch response
        docs = []
        for doc in response['hits']['hits']:
            doc['_source']['pid'] = doc['_id']
            docs.append(doc['_source'])

        # return Response({"docs": docs})
        return Response({"docs": docs})
    def post(self, request):
        # Initialize Elasticsearch client
        # es = Elasticsearch("http://128.174.136.29:9200")
        es = Elasticsearch("http://localhost:9200")

        # Get the search query from the request data
        data = request.data
        query = data.get('query', '')
        prompt = data.get('prompt', '')
        temp = data.get('temp', '')
        username = data.get('username', '')
        topic = data.get('topic', '')
        imgFilter = data.get('imgFilter', False)

        query_filter = []
        if(prompt != ''):
            query_filter.append({ "wildcard": { "pid.keyword": f"*{prompt}*" } })
        if(temp != ''):
             query_filter.append({ "terms": { "temp.keyword": [temp] } })
        

        if query != '':
            # Preprocess the query by removing stop words
            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(query)
            filtered_query = [w for w in word_tokens if not w in stop_words]

            body = {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "function_score": {
                                    "query": {
                                        "multi_match": {
                                            "query": text,
                                            "fields": ["target"],
                                            "type": "phrase_prefix"
                                        }
                                    },
                                    "boost": 4,
                                    "weight": 2  # Set weight to prioritize results in the target field
                                }
                            }for text in filtered_query
                        ] + [
                            {
                                "function_score": {
                                    "query": {
                                        "multi_match": {
                                            "query": text,
                                            "fields": ["prompt", "analogy"],
                                            "type": "phrase_prefix"
                                        }
                                    },
                                    "boost": 4
                                }
                            }for text in filtered_query
                        ]
                        + ([{
                            "multi_match": {
                                "query": topic,
                                "fields": ["topic"],
                                "type": "phrase_prefix",
                                "boost": 1
                            }
                        }] if topic or topic != '' else []),
                        "filter": query_filter,
                        "minimum_should_match": 1
                    }
                },
                "size": 100
            }
        else:
            body = {
                "query": {
                    "bool": {
                        "filter": query_filter,
                    }
                },
                "size": 100
            }

        # Search Elasticsearch index "sci_ranked" with the filtered query
        response = es.search(index="sci_ranked", body=body)

        # search log
        ip = get_client_ip(request)
        searchLog = {
            "username": username,
            "ip": ip,
            "query": query,
            "created_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": prompt,
            "temp": temp
        }

        # # send search log to auth system
        # search_log.delay(searchLog)

        # Extract relevant information from the Elasticsearch response
        docs = []
        for doc in response['hits']['hits']:
            doc['_source']['pid'] = doc['_id']
            if imgFilter:
                if 'image' in doc['_source'] and doc['_source']['image'] is not None and doc['_source']['image'] != '':
                    docs.append(doc['_source'])
            else:
                docs.append(doc['_source'])

        return Response({"docs": docs})
class LikeView(APIView):
    def post(self, request, format=None):
        # Parse the request data
        data = request.data
        id = data.get('id')
        likeType = data.get('likeType')
        cancel = data.get('cancel')
        role = data.get('role')
        print(id, likeType, cancel, role)

        num = 1
        if cancel:
            num = -1

        try:
            # Perform the update operation in Elasticsearch
            es = Elasticsearch("http://localhost:9200")
            response = es.get(index=index, id=id)
            array = response['_source'].get(likeType, [0, 0, 0])
            if role == "STUDENT":
                array[0] = max(array[0] + num, 0)
            elif role == "TEACHER":
                array[1] = max(array[1] + num, 0)
            elif role == "EXPERT":
                array[2] = max(array[2] + num, 0)
            print(array)
            es.update(index=index, id=id, body={
                "doc": {
                    likeType: array
                }
            })
            return Response(
                status=status.HTTP_200_OK,
                data={
                    'message': 'success'
                }
            )
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={
                    'message': 'failed',
                    'errors': [str(e)]
                }
            )

class InitView(APIView):
    def get(self, request, format=None):
        # Elasticsearch instance hosted on a remote server
        client = Elasticsearch("http://128.174.136.29:9200")

        # Index name
        index_name = "sci_ranked"

        # Insert document into Elasticsearch
        try:
            client.info()
            client.indices.create(index=index_name)
            return Response({"message": "Index created successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def post(self, request, format=None):
        data = pd.read_excel('/Users/phanidatta673/Downloads/analogy_search_gen_web/search/analogy/sci_ranked.xlsx')

        # Initialize Elasticsearch client
        es = Elasticsearch("http://128.174.136.29:9200")

        # Define the Elasticsearch index name
        index_name = "sci_ranked"

        # Function to index data into Elasticsearch
        def index_data(row):
            # Calculate length of the analogy
            analogy_len = len(row['analogy'])

            # Additional fields
            additional_fields = {
                "len": analogy_len,
                "topp": 0.0,
                "freq": 0.0,
                "pres": 0.0,
                "bo": 0,
                "like": 0,
                "dislike": 0
            }

            # Combine additional fields with the row data
            doc = {**row.to_dict(), **additional_fields}

            # Index the document into Elasticsearch
            es.index(index=index_name, body=doc)

        # Apply the indexing function to each row of the DataFrame
        data.apply(index_data, axis=1)

        return Response({"message": "Data indexed into Elasticsearch successfully."})
    
    def delete(self, request, format=None):
        es = Elasticsearch("http://128.174.136.29:9200")
        index_name = "sci_ranked"

        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)
            return Response({"message": "Index deleted successfully."})
        else:
            return Response({"message": "Index does not exist."}, status=404)

class TestView(APIView):
    def get(self, request, format=None):
        # Get analogy from request parameters
        es = Elasticsearch("http://128.174.136.29:9200")
        analogy = "New analogy"

        # Search for the document in Elasticsearch
        try:
            search_results = es.search(index=index, body={"query": {"match": {"analogy": analogy}}})
            hits = search_results['hits']['hits']
            return Response(hits)
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def post(self, request):
        es = Elasticsearch("http://128.174.136.29:9200")
        
        try:
            # Extract ID and updated analogy field from the request data
            analogy_id = request.data.get("id")
            updated_analogy = request.data.get("analogy")

            # Check if both ID and updated analogy field are present
            if analogy_id and updated_analogy:
                # Update the document in Elasticsearch with the new analogy field
                es.update(index=index, id=analogy_id, body={"doc": {"analogy": updated_analogy}})
                return Response({"message": "Analogies updated successfully."})
            else:
                return Response({"message": "ID or updated analogy field missing."}, status=400)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def delete(self, request, format=None):
        es = Elasticsearch("http://128.174.136.29:9200")
        try:
            # Extract document ID from request body
            document_id = request.data.get('id')

            # Delete document from Elasticsearch
            es.delete(index=index, id=document_id)

            return Response({"message": "Document deleted successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

