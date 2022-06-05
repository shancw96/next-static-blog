---
title: nginx http proxy 相关API 介绍
categories: [运维]
tags: [nginx]
toc: true
date: 2021/2/26
---

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
