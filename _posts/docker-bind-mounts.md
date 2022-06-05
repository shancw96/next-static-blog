---
title: docker 挂载主机目录
categories: [运维]
tags: [Docker]
toc: true
date: 2022/4/16
---

nodejs搭建的图床服务，使用docker 进行部署。需要对文件进行存储，默认文件存放在容器目录，容易丢失，不方便维护。因此需要将主机的某个目录映射到容器中，作为存放文件的地方。

这篇文章介绍了 

<!-- more -->

## bind mounts

首先，有如下Dockerfile，生成nodejs图床服务，/app 是home目录，`/app/uploads` 为文件存放位置

```dockerfile
FROM node:10-alpine

WORKDIR /app

COPY . .

RUN npm config set registry http://registry.npm.taobao.org/ \
&& npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ \
&& npm install

CMD ["npm", "start"]

```

我们要吧 /home/shancw/donwloads 映射到/app/uploads下，对应的写法如下

### --mount

```bash
...
docker run -d -t -p 8089:8089 \
  --name=blog-pic-server \
  --mount type=bind,source=/home/shancw/donwloads,target=/app/uploads \
  --restart=always 127.0.0.1:5000/blog-pic-server:v1
```

### -v

```bash
docker run -d -t -p 8089:8089 \
  --name=blog-pic-server \
  -v /home/shancw/donwloads:/app/uploads \
	--restart=always 127.0.0.1:5000/blog-pic-server:v1
```

 ## docker compose with bind mount

```
version: "3.9"
services:
  frontend:
    image: node:lts
    volumes:
      - type: bind
        source: ./static
        target: /opt/app/staticvolumes:
  myapp:
```