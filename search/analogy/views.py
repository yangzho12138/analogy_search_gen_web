from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch import Elasticsearch
from rest_framework import status
import os
class SearchView(APIView):
    def get(self, request, format=None):
        # Elasticsearch instance hosted on a remote server
        client = Elasticsearch("http://localhost:9200"
                               
                               )

        # response = client.info()
        # print('response =>',response)
        # return Response(response, status=status.HTTP_200_OK)
        # Document to be inserted
        doc = {
            "user": "kc62",
            "created_at": "February 15, 2024",
            "query": "force",
            "analogies": "Force is like a sudden blow in a particular direction, just like a water flows in downward direction from the dam due to gravitational force"
        }

        # Index name
        index_name = "analogies"

        # Insert document into Elasticsearch
        try:
            client.info()
            client.indices.create(index=index_name)
            client.index(index=index_name, id="1", document=doc)
            return Response({"message": "Document inserted successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)