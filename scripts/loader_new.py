import pandas as pd
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

print(f"Connected to ES: {es.info().body['cluster_name']}")

file_path = './static/Analogies and prompts.xlsx'
df = pd.read_excel(file_path)

for index, row in df.iterrows():
    record = row.to_dict()
    document = {
        "analogy": record['analogy'],
        "target": record['target'],
        "prompt": record['prompt'],
        "temp": 0.3,
        "model": 'gpt-4',
        "generatorRole": "STUDENT",
        "pid": "Using an analogy, explain <target>.",
        "like": [0, 0, 0],
        "dislike": [0, 0, 0]
    }
    es.index(index="sci_ranked", id=index, body=document)