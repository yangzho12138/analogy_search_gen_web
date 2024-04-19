1. Create a virtual environment in /auth, /gen and /search folders  
`python3 -m venv <venv name>`  
# Search:  
Path: “/analogy_search_gen_web/search/“  
`pip install -r requirements.txt`  
`pip install numpy==1.24.4`  
`pip install django-cors-headers`  
`pip install django-redis`  
# Gen:  
Path: “/analogy_search_gen_web/gen/“  
`pip install -r requirements.txt`  
# Auth:  
Path: “/analogy_search_gen_web/auth/“  
`pip install -r requirements.txt`  
# Commands to run the applications:  
Auth: Go to auth folder and run ./script.sh  
Gen: Go to gen folder and run ./script.sh  
Search: Go to search folder and run ./script.sh  
Redis:  
Path: “/analogy_search_gen_web/auth/redis-7.2.4“  
Command to start the redis server:  
redis-server  
MySQL db:  
Path: gen/Dockerfile  
docker build -t mydb . (After navigating to the /gen folder)  
docker run -d -p 3306:3306 --name mydb -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_USER=myuser -e MYSQL_PASSWORD=mypassword mysql:latest  
