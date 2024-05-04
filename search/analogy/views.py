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

index = 'sci_ranked'
class SearchView(APIView):
    def get(self, request):
        # Initialize Elasticsearch client
        es = Elasticsearch("http://128.174.136.29:9200")

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
        es = Elasticsearch("http://128.174.136.29:9200")

        # Get the search query from the request data
        data = request.data
        query = data.get('query', '')
        prompt = data.get('prompt', '')
        temp = data.get('temp', '')
        username = data.get('username', '')

        query_filter = []
        if(prompt != ''):
            query_filter.append({ "terms": { "pid.keyword": [prompt] } })
        if(temp != ''):
             query_filter.append({ "terms": { "temp.keyword": [temp] } })
        

        # Preprocess the query by removing stop words
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(query)
        filtered_query = [w for w in word_tokens if not w in stop_words]

        # Prepare Elasticsearch query using the filtered query
        body = {
            "query": {
                "bool": {
                    "should": [
                        {
                            "multi_match": {
                                "query": text,
                                "fields": ["analogy"],
                                "type": "phrase_prefix"
                            }
                        } for text in filtered_query
                    ],
                    "filter": query_filter,
                    "minimum_should_match": 1
                }
            }
        }

        # Search Elasticsearch index "sci_ranked" with the filtered query
        response = es.search(index="sci_ranked", body=body)

        # search log
        searchLog = {
            "username": username,
            "query": query,
            "created_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            "prompt": prompt,
            "temp": temp
        }

        # send search log to auth system
        search_log.delay(searchLog)

        # Extract relevant information from the Elasticsearch response
        docs = []
        for doc in response['hits']['hits']:
            doc['_source']['pid'] = doc['_id']
            docs.append(doc['_source'])

        return Response({"docs": docs})
class LikeView(APIView):
    def post(self, request, format=None):
        # Parse the request data
        data = request.data
        id = data.get('id')
        likeType = data.get('likeType')
        updateVal = data.get('updateVal')

        

        try:
            # Perform the update operation in Elasticsearch
            es = Elasticsearch("http://128.174.136.29:9200")
            es.update(index=index, id=id, body={
                "doc": {
                    likeType: updateVal
                }
            })
            return Response({"success": True})
        except Exception as e:
            return Response({"success": False, "error": str(e)})

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
