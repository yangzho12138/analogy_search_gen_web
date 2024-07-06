import pandas as pd
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

print(f"Connected to ES: {es.info().body['cluster_name']}")

file_path = './static/sci_ranked.xlsx'
df = pd.read_excel(file_path)

for index, row in df.iterrows():
    record = row.to_dict()
    if record["temp"] == "High Temperature":
        record["temp"] = "0.8"
    elif record["temp"] == "Low Temperature":
        record["temp"] = "0.0"
    document = {
        "analogy": record['analogy'],
        "target": record['target'],
        "prompt": record['prompt'],
        "temp": record['temp'],
        "src": record['src'],
        "model": 'gpt-3',
        "generatorRole": "STUDENT",
        "pid": record['pid'],
        "pid_esc": record['pid_esc'],
        "temp_short": record['temp_short'],
        "like": [0, 0, 0],
        "dislike": [0, 0, 0]
    }
    es.index(index="sci_ranked", id=index, body=document)