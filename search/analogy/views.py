from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch import Elasticsearch
from rest_framework import status
from elasticsearch.helpers import scan
from django.http import HttpResponse
import io
import nltk
import os
import json
import math
nltk.download('stopwords')
nltk.download('punkt')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import numpy as np
import pandas as pd
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
            docs.append(doc['_source'])

        # return Response({"docs": docs})
        return Response({"response":response})
    def post(self, request):
        # Initialize Elasticsearch client
        es = Elasticsearch("http://128.174.136.29:9200")

        # Get the search query from the request data
        data = request.data
        query = data.get('query', '')

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
                    "minimum_should_match": 1
                }
            }
        }

        # Search Elasticsearch index "sci_ranked" with the filtered query
        response = es.search(index="sci_ranked", body=body)

        # Extract relevant information from the Elasticsearch response
        docs = []
        for doc in response['hits']['hits']:
            docs.append(doc['_source'])

        return Response({"docs": docs})
class LikeView(APIView):
    def post(self, request, format=None):
        # Parse the request data
        data = request.data
        id = data.get('id')
        likeType = data.get('likeType')
        likeTimes = int(data.get('likeTimes', 0))
        cancel = data.get('cancel', False)

        # Determine the increase value based on 'cancel' flag
        increase = -1 if cancel else 1

        try:
            # Perform the update operation in Elasticsearch
            es = Elasticsearch("http://128.174.136.29:9200")
            es.update(index=index, id=id, body={
                "doc": {
                    likeType: likeTimes + increase
                }
            })
            return Response({"success": True})
        except Exception as e:
            return Response({"success": False, "error": str(e)})

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

        # Get the ID from the request data
        data = request.data
        id = data.get('id')  # Assuming you pass the ID in the request data

        # Query Elasticsearch to get the document with the specified ID
        try:
            response = es.get(index="sci_ranked", id=id)
            # Extract relevant information from the Elasticsearch response
            doc = response['_source']
            return Response({"document": doc})
        except Exception as e:
            return Response({"error": f"Error retrieving document: {e}"}, status=400)
        
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
class ToexcelView(APIView):
    def get(self, request):
        # Connect to Elasticsearch
        client = Elasticsearch("http://128.174.136.29:9200")

        # Define index name
        index_name = "sci_ranked"

        # Query to retrieve all documents
        query = {"query": {"match_all": {}}}

        # Execute the search
        search_results = client.search(index=index_name, body=query, size=10000)  # Adjust size if needed

        # Extract source data from search results
        hits = search_results["hits"]["hits"]
        source_data = [hit["_source"] for hit in hits]

        # Convert source data to DataFrame
        df = pd.DataFrame(source_data)

        # Save DataFrame to Excel file
        excel_file_path = "/Users/phanidatta673/Downloads/analogy_search_gen_web/search/analogy/data.xlsx"  # File path for the Excel file
        df.to_excel(excel_file_path, index=False)

        return HttpResponse("Excel file has been saved to {}".format(excel_file_path))

class UploadataView(APIView):
    def post(self, request):
        # Initialize Elasticsearch client
        es = Elasticsearch("http://128.174.136.29:9200")

        # Load data from Excel file
        try:
            df = pd.read_excel('/home/kc62/analogy_search_gen_web/search/analogy/data.xlsx')
        except Exception as e:
            return Response({"error": f"Error loading Excel file: {e}"}, status=400)

        # Index each row as a document in Elasticsearch
        successful_docs = []
        failed_docs = []
        for index, row in df.iterrows():
            # Assign empty strings to critical fields if they are empty
            temp = row['temp'] if pd.notna(row['temp']) else ''
            src = row['src'] if pd.notna(row['src']) else ''
            pid = row['pid'] if pd.notna(row['pid']) else ''
            pid_esc = row['pid_esc'] if pd.notna(row['pid_esc']) else ''
            temp_short = row['temp_short'] if pd.notna(row['temp_short']) else ''

            # Prepare the document to be indexed
            doc = {
                "temp": temp,
                "pres": np.float64(row['pres']) if pd.notna(row['pres']) and not np.isinf(row['pres']) else 0.0,
                "src": src,
                "like": row['like'],
                "dislike": row['dislike'],
                "freq": np.float64(row['freq']) if pd.notna(row['freq']) and not np.isinf(row['freq']) else 0.0,
                "pid": pid,
                "topp": np.float64(row['topp']) if pd.notna(row['topp']) and not np.isinf(row['topp']) else 0.0,
                "bo": row['bo'],
                "target": row['target'],
                "analogy": row['analogy'],
                "len": row['len'],
                "pid_esc": pid_esc,
                "prompt": row['prompt'],
                "temp_short": temp_short
            }

            # Index the document in Elasticsearch
            try:
                result = es.index(index="sci_ranked", body=doc)
                successful_docs.append(result['_id'])
            except Exception as e:
                failed_docs.append({"doc": doc, "error": str(e)})

        # Construct the response
        response_data = {
            "success_count": len(successful_docs),
            "failed_count": len(failed_docs),
            "successful_docs": successful_docs,
            "failed_docs": failed_docs
        }

        return Response(response_data)