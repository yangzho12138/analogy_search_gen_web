import pandas as pd
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

print(f"Connected to ES: {es.info().body['cluster_name']}")

file_path = './static/analogies_with_source_concept.xlsx'
df = pd.read_excel(file_path)

for index, row in df.iterrows():
    record = row.to_dict()
    print(record)
    document = {
        "analogy": record['Text Analogy'],
        "target": record['Target Concept'],
        "src": record['Source Concept'],
        "image": record['Image path'],
        "prompt": record['Text Prompt'],
        "model": 'gpt-4',
        "temp": "0.0",
        "generatorRole": "STUDENT",
        "like": [0, 0, 0],
        "dislike": [0, 0, 0]
    }
    es.index(index="sci_ranked", id=index, body=document)