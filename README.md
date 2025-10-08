# Our Team

Analego is being developed mainly by a team of CS researchers and developers at the University of Illinois, Urbana-Champaign.

*Bhavya:* Project lead -- Analego is mainly the culimation of her PhD thesis work   
*Yang Zhou:* Lead Website Developer & Architect -- Current website is mostly architected and developed by him  
*Shradha Sehgal:* Researcher -- Proposed & studied multi-modal analogies as part of her Master's thesis    
*Krishna Phani:* Website Developer (Backend) & Researcher   
*Chris Palaguachi:* Researcher (Education Psychology)  
*Suma Bhat:* Project Supervisor  
*ChengXiang Zhai:* Project Supervisor & Bhavya's Thesis Advisor -- He has been instrumental in shaping the vision of Analego 

*Past Contributors:* Aditi Mallavarapu (Researcher, NC State), Jinjun Xiong (Project Supervisor, University at Buffalo)  
# Structure of the project
![TIMAN drawio](https://github.com/user-attachments/assets/e06983cc-6f5e-4f76-8a7e-13d2248bc45e)

# Installation instructions
Create a virtual environment in /auth, /gen and /search folders  
`python3 -m venv <venv name>`  
## Search:  
Path: “/analogy_search_gen_web/search/“  
`pip install -r requirements.txt`  
`pip install numpy==1.24.4`  
`pip install django-cors-headers`  
`pip install django-redis`  
## Gen:  
Path: “/analogy_search_gen_web/gen/“  
`pip install -r requirements.txt`  
## Auth:  
Path: “/analogy_search_gen_web/auth/“  
`pip install -r requirements.txt`  
## Commands to run the applications:  
RabbitMQ:  
pull the docker container: `docker pull rabbitmq:3.8.17-management`  
run the container: `docker run -d --restart always --name rabbitmq -p 5672:5672 -p 15672:15672 -v `pwd`/data:/home/rabbitmq --hostname myRabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin rabbitmq:3.8.17-management`  

Redis:  
  Path: “/analogy_search_gen_web/auth/redis-7.2.4“  
  Command to start the redis server:  
  `redis-server`  
    
MySQL db:  
  Path: gen/Dockerfile  
  `docker build -t mydb .` (After navigating to the /gen folder)  
  `docker run -d --restart always -p 3306:3306 --name mydb -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_USER=myuser -e MYSQL_PASSWORD=mypassword mysql:latest`  
    
  After running docker, set priviliges and create database:  
    `docker exec -it mydb bash`  
    `mysql -u root -p`  
      `GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%';`  
      `FLUSH PRIVILEGES;`  
      `CREATE DATABASE mydb;`  
      `SHOW DATABASES;`  

MongoDB:

`docker run -d   --name anamongodb -p 27018:27018   --restart unless-stopped mongo:latest mongod  --replSet rs0 --port 27018`

`docker exec -it anamongodb mongosh --port 27018`

Within the docker shell, run the following then exit
`
rs.initiate({
 _id: "rs0",
 members: [
   {_id: 0, host: "localhost:27018"},
 ]
})
`

Auth: Go to auth folder and run `source auth/bin/activate`, `python manage.py migrate`, then `nohup sh ./script.sh &`  
Gen: Go to gen folder and run `source gen/bin/activate`, `nohup sh ./script.sh &`   
Search: Go to search folder and run `source search/bin/activate`, `nohup sh ./script.sh &`    
Assignment: Go to assignment folder and run `source assign/bin/activate`, `nohup sh ./script.sh &`   
Web:
`screen -R analego`,
`cd web`,
`npm run start`
