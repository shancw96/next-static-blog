---
title: Docker Bridge Network 与 Container 配置
categories: [运维]
tags: [docker, bridge_network, container]
toc: true
date: 2022/10/10
---

这篇文章介绍了 Docker 容器网络相关的基础知识。
涉及容器本身如何配置网络，docker 常用的 Bridge Network 常规配置

<!--more-->

## Table of Content

## Container networking

容器用了哪种网络，不管是 bridge，overlay，macvlan，或者是自定义的 network plugin，从容器内部来说都是透明的。从容器的角度看，一个网络接口有 IP 地址，网关，路由表，DNS 服务器等。此章节从容器的角度，去理解网络

### published ports - 容器对外暴露的端口

默认情况下，当你使用`docker create`或者`docker run`创建/运行一个容器，它并没有对外暴露任何可访问的端口。如果想要让其他服务（Docker 环境外或者没有加入容器所处 network 的）去访问当前容器，需要用`--publish` 或者`-p`标识。这个指令将容器内端口映射到外部端口

| Flag value                      | Description                                                                          |
| :------------------------------ | :----------------------------------------------------------------------------------- |
| `-p 8080:80`                    | 将内部的 TCP 80 端口，暴露到宿主机的 8080 端口                                       |
| `-p 192.168.1.100:8080:80`      | 将容器中的 TCP 端口 80 映射到 Docker 主机上的端口 8080 以连接到主机 IP 192.168.1.100 |
| `-p 8080:80/udp`                | 将内部的 UDP 80 端口，暴露到宿主机的 8080 端口                                       |
| `-p 8080:80/tcp -p 8080:80/udp` | 1 3 的集合                                                                           |

### IP Address and hostname - IP 地址和主机名

默认情况下，容器连接到的 network 会为容器分配一个 IP 地址。

**IP 分配**

比如 my-net 网络的 ip pool 为 172.19.5.1 ~ 172.19.5.254，容器连接到此网络后，会被随机分配一个可用的 ip，比如 172.19.5.3。

Docker daemon 扮演了 DHCP 服务器的角色。每个网络都有一个默认的子网掩码和网关

**容器的网络配置**

当容器启动阶段，使用`--network`标识, 它只能被连接到一个网络。

在容器运行阶段，使用 `docker netowrk connect`可以将一个正在运行的容器连接到多个 network 上

**自定义容器的 hostname**

同理，容器的 hostname 主机名默认为容器的 id，但是可以通过--hostname 修改。通过 `docker netowrk connect`将容器连接到现有的 network 上时候，可以指定--alias 在当前 network 上自定义容器的 hostname

### DNS 服务

默认情况下，容器继承了 host 的 dns 配置，配置文件位于 /etc/resolv.conf/。

没有自定义 network 的容器，会复制一份上述配置。而使用自定义网络的容器，使用 Docker 的嵌入式 DNS 服务器（将外部的 DNS 查询操作 转发到宿主机配置的 DNS 服务器）

| Flag           | Description                                                                                                                              |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `--dns`        | 配置 dns 服务. 如果想要指定多个 dns，那就使用多个--dns 标识. 如果配置的 dns 服务都查找失败,会调用 Google’s public DNS 服务器 8.8.8.8     |
| `--dns-search` | 用于搜索非完全限定主机名的 DNS 搜索域。 To specify multiple DNS search prefixes, use multiple `--dns-search` flags.                      |
| `--dns-opt`    | A key-value pair representing a DNS option and its value. See your operating system’s documentation for `resolv.conf` for valid options. |
| `--hostname`   | 容器自身的主机名                                                                                                                         |

## Docker Bridge Networking

docker 的网络驱动有几种模式可选：

- bridge: 桥接模式，默认。当应用程序运行在独立的容器中，并且要相互通信，可以使用 bridge 模式，Bridge 模式下容器与 docker host 的网络是相互隔离的。查看[bridge networks](https://docs.docker.com/network/bridge/)
- host：Host 模式下，独立的容器与 docker host 的网络隔离被移除， 容器直接使用 docker host 的 network.。查看[use the host network](https://docs.docker.com/network/host/).
- overlay：TODO
- ipvlan：TODO
- maclan：TODO
- none：TODO
- Network plugins：TODO

启动 Docker 时，会自动创建[默认桥接网络](https://docs.docker.com/network/bridge/#use-the-default-bridge-network)（也称为`bridge`），并且除非另行指定，否则新启动的容器将连接到该网络。您还可以创建用户定义的自定义桥接网络。用户定义的桥接网络 优于默认`bridge` 网络。

### [用户自定义的桥接网络与默认的桥接网络区别](https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge)

1. **用户自定义网络在容器间提供自动的 dns 解析**

   默认的桥接网络，容器间只能通过 ip 进行访问，或者使用废弃的--link 操作。而用户定义的桥接网络，容器间可以通过容器名直接访问

   ![image-20221009164409071](https://pic.limiaomiao.site:8443/public/uploads/image-20221009164409071.png)

2. 用户自定义的桥接网络提供了更好的隔离

   所有没有提供--network 标识生成的容器，被连接到同一个默认的网络，这样不想管的容器也能够互相通信。而用户自定义的网络，只能在特定的容器间访问

3. 每个用户定义的网络都会创建一个可配置的网桥

### 创建/删除用户自定义的桥接网络

使用`docker network create`命令可以创建自定义的桥接网络

```bash
docker network create my-net
```

您可以指定子网、IP 地址范围、网关和其他选项。具体参考[此处](https://docs.docker.com/engine/reference/commandline/network_create/#specify-advanced-options)

使用 `docker network rm` 可以删除特定网络

### 将容器加入到自定义网络

1. 新创建的容器:

   ```bash
   docker create --name my-nginx \
   --network my-net \
   --publish 8080:80 \
   nginx:latest
   ```

2. 已有的容器：

   将正在运行的 my-nginx 容器加入到 my-net 网络

   `docker network connect my-net my-nginx`

### 将容器从自定义网络中脱离

`docker network disconnect my-net my-nginx`

### 查看已有的 bridge network 信息

列出所有 bridge：`docker network ls`

检查名为 my-net 的 bridge 详细信息：`docker network inspect my-net`

## 引申知识

#### 单容器接入自定义 bridge 的教程：https://docs.docker.com/network/network-tutorial-standalone/

#### OSI 模型 - Data Link Layer

7. Application Layer

8. Presentation Layer

9. Session Layer

10. Transport Layer

11. Network Layer

12. Data Link Layer

    数据链路层定义了在单个链路上如何传输数据

    This layer is the protocol layer that transfers data between nodes on a [network segment](https://en.wikipedia.org/wiki/Network_segment) across the [physical layer](https://en.wikipedia.org/wiki/Physical_layer)

13. Physical Layer

#### 桥接器 network bridge

又称**网桥**，一種網路裝置，負責網路橋接（network bridging）。橋接器将[网络](https://zh.wikipedia.org/wiki/网络)的多个[网段](https://zh.wikipedia.org/wiki/网段)在[数据链路层](https://zh.wikipedia.org/wiki/数据链路层)（[OSI 模型](https://zh.wikipedia.org/wiki/OSI模型)第 2 层）连接起来（即桥接）。 -- wiki

![20210708112655899](https://pic.limiaomiao.site:8443/public/uploads/20210708112655899.png)

### Gateway

网关是**抽象概念**，指的是 IP 转发者这个**角色**，类似于“交通工具”这个词

路由器是**具体概念**，特指路由器这种**设备**，类似于“汽车”这个词。

> 路由器可以做网关，把家庭局域网和互联网相连。
>
> 手机可以做网关，手机开了热点，笔记本接进来，手机作为网关把笔记本和互联网相连。
>
> 防火墙可以做网关，局域网连到防火墙，防火墙把局域网和互联网相连，顺便还能抵抗各种攻击。
