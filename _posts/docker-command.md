---
title: docker - 运行一个container
categories: [运维]
tags: [Docker]
toc: true
date: 2020/9/18
updated: 2021/4/5
---

**此处 image 使用 alpine linux**

## 从 docker hub 获取 image

1. docker search [imageName] : 搜索 docker hub 上对应的 images
2. docker pull [imageName] ： 拉取 image
3. docker images : 查看 images 列表

## 运行 mysql

docker run [image] [command]

> docker run image，如果 image 在本地不存在，会自动执行 docker pull

```bash
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

–detach -d 在后台运行容器，并且打印容器 id。
–interactive -i 设置为可交互状态。
–tty -t 分配一个伪 tty(控制台)，一般与 -i 连用。
-p 3306:3306 映射容器服务的 3306 端口到宿主机的 3306 端口
-e 执行命令 MYSQL_ROOT_PASSWORD=123456：设置 MySQL 服务 root 用户的密码

### 运行 mongoDB

```bash
docker pull mongo
docker run -itd --name mongo -p 27017:27017 mongo --auth
# 建立认证权限
docker exec -it mongo mongo admin
# > mongo tty
db.createUser({user:"root",pwd:"root",roles:[{role:'root',db:'admin'}]}) #  //创建用户,此用户创建成功,则后续操作都需要用户认证
```

> spring boot 配置

```yml
data:
  mongodb:
    host: 192.168.193.124
    port: 27017
    username: root
    password: root
    database: your-database-name
```

## 查看运行的 container

- docker ps 查看正在运行的 container
- docker ps -a 查看所有运行过的 container

## 操作后台运行 container： **-d**

- docker run -d [images] : The -d flag 启用 detached mode，后台运行
- docker ps 查看正在运行的 container
- docker rm [containerId] 删除正在运行 container
