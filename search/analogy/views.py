from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch import Elasticsearch
from rest_framework import status
import nltk
import os
import json
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
nltk.download('stopwords')
nltk.download('punkt')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
index = 'sci_ranked'


class SearchView(APIView):
    def get(self, request):
        # Initialize Elasticsearch client
        es = Elasticsearch("http://localhost:9200")

        # Get all search results from the Elasticsearch index "sci_ranked"
        response = es.search(index="sci_ranked", body={"query": {"match_all": {}}})

        # Extract relevant information from the Elasticsearch response
        docs = []
        for doc in response['hits']['hits']:
            docs.append(doc['_source'])

        # return Response({"docs": docs})
        return Response({"response":response})
    def post(self, request):
        # Initialize Elasticsearch client
        es = Elasticsearch("http://localhost:9200")

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
            es = Elasticsearch("http://localhost:9200")
            es.update(index=index, id=id, body={
                "doc": {
                    likeType: likeTimes + increase
                }
            })
            return Response({"success": True})
        except Exception as e:
            return Response({"success": False, "error": str(e)})

# class SearchView(APIView):
#     def get(self, request, format=None):
#         # Elasticsearch instance hosted on a remote server
#         client = Elasticsearch("http://localhost:9200")

#         # response = client.info()
#         # print('response =>',response)
#         # return Response(response, status=status.HTTP_200_OK)
#         # Document to be inserted
#         # doc = {
#         #     "user": "kc62",
#         #     "created_at": "February 15, 2024",
#         #     "query": "force",
#         #     "analogies": "Force is like a sudden blow in a particular direction, just like a water flows in downward direction from the dam due to gravitational force"
#         # }

#         # Index name
#         index_name = "sci_ranked"

#         # Insert document into Elasticsearch
#         try:
#             client.info()
#             client.indices.create(index=index_name)
#             # client.index(index=index_name, id="1", document=doc)
#             return Response({"message": "Index created successfully."})
#         except Exception as e:
#             return Response({"error": str(e)}, status=500)
        
#     def post(self, request, format=None):
#         data = pd.read_excel('/Users/phanidatta673/Downloads/analogy_search_gen_web/search/analogy/sci_ranked.xlsx')

#         # Initialize Elasticsearch client
#         es = Elasticsearch("http://localhost:9200")

#         # Define the Elasticsearch index name
#         index_name = "sci_ranked"

#         # Function to index data into Elasticsearch
#         def index_data(row):
#             doc = row.to_dict()
#             es.index(index=index_name, body=doc)

#         # Apply the indexing function to each row of the DataFrame
#         data.apply(index_data, axis=1)

#         return Response({"message": "Data indexed into Elasticsearch successfully."})