---
order: 19
---

#### Run a docker container

```
docker run hello-world
```
Just prints out hello world (good for testing if Docker is working)

```
docker ps
```
See what is running
Add “-a” to include stopped containers

```
docker rm CONTAINER_NAME
```
Remove a docker container

```
docker run -it ubuntu
```
Run the ubuntu Linux operating system
Note: “-it” means to run it as an interactive terminal 

```
docker run -p 80:80 nginx
```
nginx is a popular static web server
Note: by default, a container is closed to traffic on all ports. 
- “-p 80:80” says: for traffic coming in on port 80, send it to port 80 inside the container


### Docker demo

```
FROM nginx
COPY . /usr/share/nginx/html
```

The “Dockerfile” is a definition for a docker container.
It consists of a set of steps, starting “FROM” a specific docker container, and then running additional steps (e.g., copying files) to set up the container the way you want it.


### demos

#### nginx/html

```
demo/
├── index.html
└── Dockerfile
```

Dockerfile
```
FROM nginx
COPY . /usr/share/nginx/html
```

```
docker build -t amelial9/dockerdemo .
docker run -d -p 80:80 amelial9/dockerdemo
```


#### nodedemo

```
demo/
├── one-of-the-prev-demos
└── Dockerfile
```

Dockerfile
```
FROM node

# equivalent to cd /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
```

```
docker build -t amelial9/node-app .
docker run -d -p 4000:3000 amelial9/node-app
```
