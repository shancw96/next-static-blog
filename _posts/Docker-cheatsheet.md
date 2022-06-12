---
title: docker 安装&使用手册
categories: [运维]
tags: [Docker]
toc: true
date: 2021/7/25
---

一个 **Docker Registry** 中可以包含多个 **仓库**（`Repository`）；每个仓库可以包含多个 **标签**（`Tag`）；每个标签对应一个镜像。

私有仓库：

除了使用公开服务外，用户还可以在本地搭建私有 Docker Registry。Docker 官方提供了 [Docker Registry](https://hub.docker.com/_/registry/) 镜像，可以直接使用做为私有 Registry 服务

<!-- more -->

# Docker 安装

## ubuntu

### 安装

#### 手动安装

- sudo apt-get update
- sudo apt-get install docker-ce docker-ce-cli containerd.io

#### 官方脚本安装

```bash
# $ curl -fsSL test.docker.com -o get-docker.sh
$ curl -fsSL get.docker.com -o get-docker.sh
$ sudo sh get-docker.sh --mirror Aliyun
# $ sudo sh get-docker.sh --mirror AzureChinaCloud
```

## macOS

### 安装

```bash
brew install --cask docker
```

## 启动

```bash
$ sudo systemctl enable docker
$ sudo systemctl start docker
```

### win10

建议使用 win10 内置的 linux 子系统进行安装，操作与 ubuntu 保持一致

**手动下载安装**

点击以下 [链接](https://desktop.docker.com/win/stable/amd64/Docker Desktop Installer.exe) 下载 Docker Desktop for Windows。

下载好之后双击 `Docker Desktop Installer.exe` 开始安装。

## 解决安装 docker 后每次都需要输入 sudo 的问题

```bash
$sudo groupadd docker    #添加docker用户组
$sudo gpasswd -a $USER docker    #将登陆用户加入到docker用户组中
$newgrp docker    #更新用户组
```

# 镜像

## 获取 docker pull

从 Docker 镜像仓库获取镜像的命令是 `docker pull`。其命令格式为：

```bash
docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
```

- 选项：通过 docker pull --help 可以看到详细选项列表

- 镜像的名称格式

  - docker 镜像仓库地址： `<域名/IP>[:端口号]`

    > 默认地址是 Docker Hub (docker.io)

  - 仓库名：两段式名称，即 `<用户名>/<软件名>`

    > 对于 Docker Hub，如果不给出用户名，则默认为 `library`，也就是官方镜像。

比如：

```bash
$ docker pull ubuntu:18.04
18.04: Pulling from library/ubuntu
92dc2a97ff99: Pull complete
be13a9d27eb8: Pull complete
c8299583700a: Pull complete
Digest: sha256:4bc3ae6596938cb0d9e5ac51a1152ec9dcac2a1c50829c74abd9c4361e321b26
Status: Downloaded newer image for ubuntu:18.04
docker.io/library/ubuntu:18.04
```

- 命令中没有给出 Docker 镜像仓库地址，因此将会从 Docker Hub （`docker.io`）获取镜像
- 。而镜像名称是 `ubuntu:18.04`，因此将会获取官方镜像 `library/ubuntu` 仓库中标签为 `18.04` 的镜像。
- 最后一行给出了镜像的完整名称 docker.io/library/ubuntu:18.04

## 使用镜像

### 镜像列表操作

- 列出所有 docker 镜像:docker image ls

  ```bash
  $ docker image ls
  REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
  redis                latest              5f515359c7f8        5 days ago          183 MB
  nginx                latest              05a60462f8ba        5 days ago          181 MB
  mongo                3.2                 fe9198c04d62        5 days ago          342 MB
  <none>               <none>              00285df0df87        5 days ago          342 MB
  ubuntu               18.04               329ed837d508        3 days ago          63.3MB
  ubuntu               bionic              329ed837d508        3 days ago          63.3MB
  ```

- 根据仓库名显示

  ```bash
  $ docker image ls ubuntu
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  ubuntu              18.04               329ed837d508        3 days ago          63.3MB
  ubuntu              bionic              329ed837d508        3 days ago          63.3MB
  ```

- 仓库名 + 标签

  ```bash
  $ docker image ls ubuntu:18.04
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  ubuntu              18.04               329ed837d508        3 days ago          63.3MB
  ```

- 列表过滤器 `--fiter`

  - 通过 label 过滤

    ```bash
    $ docker image ls -f label=com.example.version=0.1
    ...
    ```

- 过滤并传递

  > 当我们需要利用 `docker image ls` 把所有的虚悬镜像的 ID 列出来，然后才可以交给 `docker image rm` 命令作为参数来删除指定的这些镜像，可以用到 -q 参数

  ```bash
  $ docker image ls -q
  5f515359c7f8
  05a60462f8ba
  fe9198c04d62
  00285df0df87
  329ed837d508
  329ed837d508
  ```

- 镜像删除 docker image rm [image Id]

  删除所有名为 redis 的镜像

  ```bash
  $ docker image rm $(docker image ls -q redis)
  ```

- 关注 docker 占用的磁盘空间

  ```bash
  $ docker system df

  $ docker system df

  TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
  Images              24                  0                   1.992GB             1.992GB (100%)
  Containers          1                   0                   62.82MB             62.82MB (100%)
  Local Volumes       9                   0                   652.2MB             652.2MB (100%)
  Build Cache                                                 0B                  0B
  ```

- 无效镜像（dangling image）

  - 显示无效镜像列表

    ```bash
    docker image ls -f dangling=true
    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    <none>              <none>              00285df0df87        5 days ago          342 MB
    ```

  - 删除无效镜像：`sudo docker rmi $(docker images -f "dangling=true" -q)`

## 使用 Dockerfile 定制镜像

```bash
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```

### FROM 指定基础镜像

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。

我们运行了一个 `nginx` 镜像的容器，再进行修改一样，基础镜像是必须指定的。

一个 `Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令

### RUN 执行命令

`RUN` 指令在定制镜像时是最常用的指令之一。其格式有两种：

- _shell_ 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样。刚才写的 Dockerfile 中的 `RUN` 指令就是这种格式。

  ```bash
  RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
  ```

- _exec_ 格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。

  ```bash
  FROM debian:stretch

  RUN apt-get update
  RUN apt-get install -y gcc libc6-dev make wget
  RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
  RUN mkdir -p /usr/src/redis
  RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
  RUN make -C /usr/src/redis
  RUN make -C /usr/src/redis install
  ```

每一个 `RUN` 的行为，就和刚才我们手工建立镜像的过程一样：新建立一层，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。

上面的写法，构建了 7 层镜像。正确的写法如下

```bash
FROM debian:stretch

RUN set -x; buildDeps='gcc libc6-dev make wget' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && make -C /usr/src/redis \
    && make -C /usr/src/redis install \
    && rm -rf /var/lib/apt/lists/* \
    && rm redis.tar.gz \
    && rm -r /usr/src/redis \
    && apt-get purge -y --auto-remove $buildDeps
```

很多人初学 Docker 制作出了很臃肿的镜像的原因之一，就是忘记了每一层构建的最后一定要清理掉无关文件。

## 构建镜像

docker build [选项] <上下文路径/URL/->

```bash
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
Step 1 : FROM nginx
 ---> e43d811ce2f4
Step 2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 9cdc27646c7b
 ---> 44aa4490ce2c
Removing intermediate container 9cdc27646c7b
Successfully built 44aa4490ce2c
```

### 镜像构建上下文

Docker 在运行时分为**Docker 引擎（也就是服务端守护进程）和客户端工具**。

Docker 的引擎提供了一组 REST API，被称为 [Docker Remote API](https://docs.docker.com/develop/sdk/)，而如 `docker` 命令这样的客户端工具，则是通过这组 API 与 Docker 引擎交互，从而完成各种功能.

而 `docker build` 命令构建镜像，其实并非在本地构建，而是在服务端，也就是 Docker 引擎中构建的。那么在这种客户端/服务端的架构中，如何才能让服务端获得本地文件呢？

这就引入了上下文的概念。**当构建的时候，用户会指定构建镜像上下文的路径，`docker build` 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎**。

对于 如下命令

```bash
COPY ./package.json /app/
```

这并不是要复制执行 `docker build` 命令所在的目录下的 `package.json`，也不是复制 `Dockerfile` 所在目录下的 `package.json`，而是复制 **上下文（context）** 目录下的 `package.json`。

因此，`COPY ../package.json /app` 或者 `COPY /opt/xxxx /app` 无法工作

### .dockerignore 忽略上下文目录下的文件

上面说了，构建的时候会打包路径下的所有内容，但是会存在不需要打包的文件，比如前端的 node_modules 文件夹，这时候可以用 `.gitignore` 一样的语法写一个 `.dockerignore`，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。

# 容器

## 启动 docker run

启动容器有两种方式

- 基于镜像新建一个容器并启动
- 将在终止状态（`exited`）的容器重新启动。

执行 docker run 后，Docker 在后台运行的操作：

- 检查本地是否存在指定的镜像，不存在就从 [registry]() 下载

- 利用镜像创建并启动一个容器

- 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层

- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去

- 从地址池配置一个 ip 地址给容器

- 执行用户指定的应用程序

- 执行完毕后容器被终止

## 后台运行 -d

```bash
$ docker run -d ubuntu:18.04 /bin/sh -c "while true; do echo hello world; sleep 1; done"
77b2dc01fe0f3f1265df143181e7b9af5e05279a884f4776ee75350ea9d8017a
```

获取容器的输出信息：docker container logs

```bash
$ docker container logs [container ID or NAMES]
hello world
hello world
hello world
. . .
```

## 停止与恢复 stop/start/restart

- docker container stop [container ID] 停止
- docker container start [contaienr ID] 恢复
- docker container restart [container ID] 重启

### 机器重启，docker 容器恢复策略

`--restart`

| flag           | 描述                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| no             | 不重启容器 （默认值）                                                                          |
| on-failure     | 如果容器因为错误崩溃退出，那么重启                                                             |
| always         | 当容器停止时候，总是重启。如果是被手动停止，那么只有在 Docker 守护进程重启的时候才会自动重启。 |
| unless-stopped | 和 always 类似，如果被手动停止，即使是 Docker 守护进程重启，也不会被重启                       |

```bash
docker run -d --restart unless-stopped redis
```

## 指定外部访问端口

容器中可以运行一些网络应用，要让外部也可以访问这些应用，可以通过 -P 或 -p 参数来指定端口映射。

- -P 标记时，Docker 会随机映射一个端口到内部容器开放的网络端口。

  ```bash
  $ docker run -d -P nginx:alpine

  $ docker container ls -l
  CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                   NAMES
  fae320d08268        nginx:alpine        "/docker-entrypoint.…"   24 seconds ago      Up 20 seconds       0.0.0.0:32768->80/tcp   bold_mcnulty
  ```

  本地主机的 32768 被映射到了容器的 80 端口

- -p 指定要映射的端口

  ```bash
  $ docker run -d \
      -p 80:80 \
      -p 443:443 \
      nginx:alpine
  ```

## 进入容器

docker exec -it 69d1 bash

## 导出与导入容器

导出`docker export [container Id] > [file name]`

```bash
$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS               NAMES
7691a814370e        ubuntu:18.04        "/bin/bash"         36 hours ago        Exited (0) 21 hours ago                       test
$ docker export 7691a814370e > ubuntu.tar
```

导入 `docker import`

文件导入

```bash
$ cat ubuntu.tar | docker import - test/ubuntu:v1.0
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
test/ubuntu         v1.0                9d37a6082e97        About a minute ago   171.3 MB
```

url 导入

```bash
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```

## 删除容器

```bash
$ docker container rm trusting_newton
trusting_newton
```

如果要删除一个运行中的容器，可以添加 `-f` 参数。Docker 会发送 `SIGKILL` 信号给容器。

删除所有处于终止状态的容器

```bash
$ docker container prune
```

# 私有仓库

有时候使用 Docker Hub 这样的公共仓库可能不方便，用户可以创建一个本地仓库供私人使用。

## 安装并运行 docker-registry

```bash
$ docker run -d -p 5000:5000 --restart=always --name registry registry
```

默认情况下，仓库会被创建在容器的 `/var/lib/registry` 目录下。

**自定义存放路径：**你可以通过 `-v` 参数来将镜像文件存放在本地的指定路径

例子：将上传的镜像放到本地的 `/opt/data/registry` 目录。

```bash
$ docker run -d \
    -p 5000:5000 \
    -v /opt/data/registry:/var/lib/registry \
    registry
```

## 上传镜像到私有仓库

1. 找到想要的 image

```bash
$ docker image ls
REPOSITORY                        TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ubuntu                            latest              ba5877dc9bec        6 weeks ago         192.7 MB
```

2.  docker tag 进行标记

格式:`docker tag IMAGE[:TAG] [REGISTRY_HOST[:REGISTRY_PORT]/]REPOSITORY[:TAG]`

```bash
$ docker tag ubuntu:latest 127.0.0.1:5000/ubuntu:latest
$ docker image ls
REPOSITORY                        TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ubuntu                            latest              ba5877dc9bec        6 weeks ago         192.7 MB
127.0.0.1:5000/ubuntu:latest      latest              ba5877dc9bec        6 weeks ago         192.7 MB
```

3. docker push 上传标记的镜像

   ```bash
   docker push 127.0.0.1:5000/ubuntu:latest
   ```

4. 查看私有仓库已有的镜像

   ```bash
   $ curl 127.0.0.1:5000/v2/_catalog
   {"repositories":["ubuntu"]}
   ```

配置非 https 仓库地址

/etc/docker/daemon.json

对于 `192.168.199.100:5000` 这样的内网地址作为私有仓库地址，这时你会发现无法成功推送镜像。这是因为 Docker 默认不允许非 `HTTPS` 方式推送镜像。我们可以通过 Docker 的配置选项来取消这个限制

```bash
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ],
   "insecure-registries": [
    "192.168.193.72:5000",
    "192.168.1.193:5000",
    "192.168.193.124:5000"
  ]
}
```

```bash
// 服务重启
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

# 修改 Docker 镜像默认存储位置 - 软链接

默认情况下 Docker 容器的存放位置在 /var/lib/docker 目录下面，可以通过下面命令查看具体位置。

```bash
# 默认存放位置
sudo docker info | grep "Docker Root Dir"
```

```bash
# 停掉Docker服务
service docker stop
# 重启Docker服务
systemctl restart docker
```

移动整个 /var/lib/docker 目录到空间不较大的目的路径。这时候启动 Docker 时发现存储目录依旧是 /var/lib/docker 目录，但是实际上是存储在数据盘 /data/docker 上了。

```bash
# 移动原有的内容
mv /var/lib/docker /data/docker

# 进行链接
ln -sf /data/docker /var/lib/docker
```
