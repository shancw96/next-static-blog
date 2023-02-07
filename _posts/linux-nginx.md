---
title: nginx 使用手册
categories: [运维]
tags: [nginx]
toc: true
date: 2021/3/1
---

nginx 相关配置

<!-- more -->

## Table of Content

## 启动，停止，重载 配置文件

- stop -- 强制关闭
- quit -- 关闭服务（在当前存在的请求结束后）
- reload -- 重载配置文件
- reopen -- 重新打开 log 文件

命令：`nginx -s [signal]` 如 `nginx -s stop`强制停掉配置文件

## 可配置项目

### 托管静态资源(如 SPA) （Serving Static Content）

比如：将 image 和 HTML 两种类型的文件进行托管在 /data/www 和 /data/images

修改配置文件如下:

```bash
http {
  server {
  }
}
```

server_name 输入的 url 的 host，可以用判断执行哪个 server 代码块

```conf
http {
  server {
    listen 80;
    server_name www.example.com
    # ... other config A
  }
  server {
    listen 80;
    server_name example.com
    # ... other config B
  }
}
```

如上配置，如果输入 www.example.com 走的是 configA 。输入 example.com 走的是 configB

## [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)

```bash
Syntax:	proxy_pass URL;
Default:	—
Context:	location, if in location, limit_except
```

### 请求 URI 的转发规则：

- 绝对路径：如果 proxy_pass 的 URL **指定了一个 URI**，此时这个 URI 会替换 请求(request)的 URI.
  例 1:

  ```conf
    location /name/ {
      proxy_pass http://127.0.0.1/remote/;
    }

    /name/shancw -> http://127.0.0.1/remote/shancw
  ```

  例 2:

  ```conf
  location /name/ {
    proxy_pass http://127.0.0.1/;
  }

  /name/test.html -> http://127.0.0.1/test.html
  ```

  例 3：

  ```conf
  location /name/ {
    proxy_pass http://127.0.0.1/extra;
  }

  /name/test.html -> http://127.0.0.1/extratest.html
  ```

* 相对路径： 如果 proxy_pass 的 URL **没有指定 URI**, 此时请求(request)的 URI 会被拼接到 proxy_pass 的 URL 上

  ```conf
  location /name/ {
    proxy_pass http://127.0.0.1;
  }

  /name/shancw -> http://127.0.0.1/name/shancw
  ```

应用：[nginx 根据不同 prefix 转接 请求, 实现一个服务器 + 域名托管多个应用服务](https://github.com/shancw96/tech-basis/tree/master/nginx)

### 关于 nginx location 的更多使用

[一文弄懂 Nginx 的 location 匹配](https://segmentfault.com/a/1190000013267839)

## nginx 下 cache-control 配置

[相关配置介绍](https://www.cnblogs.com/sfnz/p/5383647.html)

使用例子：[blog 下配置指定路径的 cache - 3. 2d live 看板娘设置 -3.4 优化](http://blog.limiaomiao.site/2021/03/14/next-usage/)

## nginx 配置 https

http 转发

```conf
server {
    listen 80;
    server_name blog.shancw.net;
    return 301 https://$server_name$request_uri;
}
```

https 配置

```conf
server {
    # ****** start 配置443端口 + 证书 ********
    listen 443 ssl;
    server_name blog.shancw.net;
	  ssl_certificate    /etc/nginx/https_cert/1_blog.shancw.net_bundle.crt;
    ssl_certificate_key /etc/nginx/https_cert/2_blog.shancw.net.key;
    # ******** end *********
    root /home/shancw/Project/blogs/public;   #资源文件目录
    index index.html index.htm index.nginx-debian.html;

    location ~ \.(gif|jpg|jpeg|png|bmp|ico)$ {
        expires 30d;
    }

    location ~* live2dw.* {
      add_header    Cache-Control  "max-age=31536000, public";
    }
}
```

## resolver 解决 Nginx DNS 缓存导致转发失败

```bash
Syntax:	resolver address ... [valid=time] [ipv6=on|off] [status_zone=zone];
Default:	—
Context:	http, server, location
```

买了阿里云作为中转，利用 Ngnix 作 TCP Proxy 结合 DDNS，可以实现域名直接访问家庭服务。由于 Nginx 转发会缓存 DNS 解析，但电信家庭宽带的公网 ip 是不固定的，导致转发失败。

原因：

- Nginx 在启动/重载的时候会去解析转发的域名
- 如果域名无法解析 Nginx 就无法启动
- 只有下次重启/重载的时候才会重新去解析，启动后无视 TTL

解决方法：
指定 DNS 解析服务器并设置 DNS 刷新频率。

```bash
http {
  resolver 8.8.8.8 valid=1m;
  server{
    ...
  }
}
```

## Refused to display 'https://xxx' in a frame because it set 'X-Frame-Options' to 'deny'

设置 X-Frame-Options HTTP 头部为 "SAMEORIGIN"，允许同源网页在 frame 中加载。

```diff
server {
  listen 443 ssl;
  server_name your.domain.com;

  client_max_body_size 2048M;

  location / {
+   add_header X-Frame-Options "SAMEORIGIN";
    proxy_pass http://localhost:8886;
  }
}

```

X-Frame-Options HTTP 头部有三个可能的值：

- DENY：浏览器将不允许在任何情况下在 frame 中加载网页。
- SAMEORIGIN：浏览器将只允许同源网页在 frame 中加载。
- ALLOW-FROM uri：浏览器将只允许来自特定域名的网页在 frame 中加载。

如果你想让你的网页在其他域名的 frame 中显示,可以使用 ALLOW-FROM,指定允许的域名。

`add_header X-Frame-Options "ALLOW-FROM https://example.com"`
