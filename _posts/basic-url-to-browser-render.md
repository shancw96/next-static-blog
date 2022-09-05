---
title: 从输入URL到浏览器渲染
categories: [网络]
tags: [dns, tcp]
toc: true
date: 2022/9/5
---

这篇文章介绍了从输入 URL 到 浏览器渲染的过程。主要集中介绍了网络交互相关知识。

1. URL 输入
2. DNS 解析
3. 建立 TCP 连接
4. 发送 HTTP / HTTPS 请求（建立 TLS 连接）
5. 服务器响应请求
6. 浏览器解析渲染页面
7. HTTP 请求结束，断开 TCP 连接

<!-- more -->

## Table of Content

## DNS 解析

​ 域名解析成公网 IP 地址

![preload](http://serial.limiaomiao.site:8089/public/uploads/eb1b6b726e6cbe7c04beb6b7885202e4.png)

## 建立 TCP 连接

参考文章：https://blog.csdn.net/m0_47988201/article/details/122308667

### 分层模型

```js
    ----------------------------------
  7|   应用层   |           |   HTTP  |

  6|   表示层   |   应用层   |

  5|   会话层   |           |         |
    ---------------------------------
  4|   传输层   |   传输层   | TCP TLS |
    ---------------------------------
  3|   网络层   |   网络层   |   IP    |
    ---------------------------------
  2|  数据链路层
               |   链路层
  1|   物理层
    --------------------------------
       [OSI]   |   [TCP/IP]
```

### 三次握手

![4609ddfac3194cf88f1d6809de06ea33](http://serial.limiaomiao.site:8089/public/uploads/4609ddfac3194cf88f1d6809de06ea33.png)

## 发送 HTTP / HTTPS 请求（建立 TLS 连接）服务器响应请求

- 1xx：指示信息——表示请求已接收，继续处理
- 2xx：成功——表示请求已被成功接收、理解、接受
- 3xx：重定向——要完成请求必须进行更进一步的操作
- 4xx：客户端错误——请求有语法错误或请求无法实现
- 5xx：服务器端错误——服务器未能实现合法的请求

## **浏览器**解析**渲染**页面

![img](http://serial.limiaomiao.site:8089/public/uploads/1620-20220905161044511.png)

1. 处理 HTML 标记并构建 DOM 树。
2. 处理 CSS 标记并构建 CSSOM 树。
3. 将 DOM 与 CSSOM 合并成一个渲染树。
4. 根据渲染树来布局，以计算每个节点的几何信息。
5. 将各个节点绘制到屏幕上。

## HTTP 请求结束，断开 TCP 连接

### 四次挥手

![6d632984cfb0496f9e65eb8ab21ccc8c](http://serial.limiaomiao.site:8089/public/uploads/6d632984cfb0496f9e65eb8ab21ccc8c.png)
