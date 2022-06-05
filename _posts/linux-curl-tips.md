---
title: linux curl handbook
categories: [运维]
tags: [linux]
toc: true
date: 2021/3/26
---

本文介绍了 curl 的常用指令

<!-- more -->

## 下载文件

- `-o or -O` 下载文件
  ```bash
  $ curl -O http://yourdomain.com/yourfile.tar.gz # 使用uri的名称作为文件名： yourfile.tar.gz
  $ curl -o newfile.tar.gz http://yourdomain.com/yourfile.tar.gz # 保存为newfile：  newfile.tar.gz
  ```
- `-C -` 恢复下载
  ```bash
  $ curl -C - -O http://yourdomain.com/yourfile.tar.gz
  ```
  ![](/images/curl-resume-download.png)

* 多文件下载
  ```bash
  $ curl -O http://yoursite.com/info.html -O http://mysite.com/about.html
  ```

- 限制下载速度
  ```bash
  $ curl --limit-rate 100K http://yourdomain.com/yourfile.tar.gz -O
  ```

## http request

`curl -X [method] [options] [URL]`

- post 请求
  `curl -X POST [options] [URL]`

  > -X 指定使用什么类型的 HTTP 请求，-X POST 使用 post 发送请求

  - `-d` application/x-www-form-urlencoded
    ```bash
      curl -X POST -d 'name=linuxize' -d 'email=linuxize@example.com' https://example.com/contact.php
    ```

  * `-F`: multipart/form-data.
    ```bash
    curl -X POST -F 'name=linuxize' -F 'email=linuxize@example.com' https://example.com/contact.php
    ```

  - `-F + @` 文件上传
    ```bash
    curl -X POST -F 'image=@/home/user/Pictures/wallpaper.jpg' http://example.com/upload
    ```

* delete 请求
  ```bash
    curl -X DELETE http://localhost:8080/user/100
  ```

- `-H`: 自定义 Content-Type

  ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "linuxize", "email": "linuxize@example.com"}' \
    https://example/contact
  ```

* cookie 操作
  - 保存 cookie
  ```bash
  curl --cookie-jar yourCookies.txt https://www.cnn.com/index.html -O
  ```
  - 携带 cookie
  ```
  curl --cookie cnncookies.txt https://www.cnn.com
  ```
