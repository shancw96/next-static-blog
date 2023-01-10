---
title: 网络基础
categories: [网络]
tags: [database, mysql]
toc: true
date: 2022/10/21
---

这篇文章介绍了网络基础知识

<!-- more -->

## IP 与子网掩码

![image-20221025143230493](https://pic.limiaomiao.site:8443/public/uploads/image-20221025143230493.png)

### IP 的构成：

IP 地址是一串 32 比特的数字,按照 8 比特 (1 字节) 为一组分成 4 组,分别用十进制表示然后再用圆点隔开

主机号部分的比特全部为 0 或者全部为 1 时代表两种特殊的含义

1. 全部为 0 代表整个子网

   ![image-20221025144143942](https://pic.limiaomiao.site:8443/public/uploads/image-20221025144143942.png)

2. 全部为 1 代表向子网上所有设备发送包,即广播

   ![image-20221025144215971](https://pic.limiaomiao.site:8443/public/uploads/image-20221025144215971.png)

### 子网掩码

IP 地址规则中，网络号和主机号连起来总共 32bit，但这两部分的具体结构是不固定的，所以还 需要额外的附加信息来表示 IP 地址的内部结构。这部分附加内容被称为子网掩码

子网掩码格式如上图所示，子网掩码为 1 的部分表示网络号,子网掩码为 0 的部分表示主机号。

子网掩码的表示方式：

1. 2 进制表示 1 的部分：ip/255.255.255.0
2. 10 进制表示 1 的部分：ip/24

## DNS 服务器

DNS 的作用：域名 -> IP 的解析

### 域名的层次结构

DNS 服务器中的所有信息都是按照域名以分层次的结构来保存。在域名中,越靠右的位置表示其层级越高。

比如 www.lab.glasscom.com，com 域的下一层是 glasscom 域,再下一层是 lab 域,再下面才是 www 这个名字

### 域名对应 IP 的查找过程

首先,将负责管理下级域的 DNS 服务器的 IP 地址注册到它们的上级 DNS 服务器中,然后上级 DNS 服务器的 IP 地址再注册到更上一级的 DNS 服务器中,以此类推

这样,我们就可以通过上级 DNS 服务器查询出下级 DNS 服务器的 IP 地址,也就可以向下级 DNS 服务器发送查询请求了

![image-20221025144806417](https://pic.limiaomiao.site:8443/public/uploads/image-20221025144806417.png)

假设我们要查询 www.lab.glasscom.com 这台 Web 服务器的相关信息

1. 客户端首先会访问最近的一台 DNS 服务器
2. 由于最近的 DNS 服务器中没有存放 www.lab.glasscom.com 这一域名对应的信息,所以我们需要从顶层开始向下查找
3. 根域服务器中也没有 www.lab.glasscom.com 这个域名,但根据域名结构可以判断这个域名属于 com 域,因此根域 DNS 服务器会返回它所管理的 com 域中的 DNS 服务器的 IP 地址
4. 接下来,最近的 DNS 服务器又会向 com 域的 DNS 服务器发送查询消息
5. com 域中也没有 www.lab.glasscom.com 这个域名的信息,和刚才一样,com 域服务器会返回它下面的 glasscom.com 域的 DNS 服务器的 IP 地址
6. 以此类推,只要重复前面的步骤,就可以顺藤摸瓜找到目标 DNS 服务器

## 协议栈收发消息

Socket 中文为套接字，通过协议栈收发数据的流程如图所示：

![image-20221025145406107](https://pic.limiaomiao.site:8443/public/uploads/image-20221025145406107.png)

1. 创建 Socket 套接字 （准备）
2. 将管道连接到服务端的套接字上（连接）
3. 收发数据（收发）
4. 断开管道并删除套接字（断开）

![image-20221025145637355](https://pic.limiaomiao.site:8443/public/uploads/image-20221025145637355.png)
