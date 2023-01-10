---
title: HTTP - 缓存
categories: [网络]
tags: [cache, http, interview]
toc: true
date: 2020/8/12
---

这篇文章介绍了 http 缓存的相关知识。涉及强缓存 协商缓存两种

<!--more-->

![mindSet](https://pic.limiaomiao.site:8443/public/uploads/mindSet.png)

## 强缓存

**不会向服务器发送请求**，直接从缓存中读取资源

### 如何判断强缓存是否失效

当浏览器向服务器请求数据的时候，服务器会将数据和缓存的规则返回，在**响应头的 header 中**，有两个字段 **Expires** 和 **Cache-Control**。

### Expires

```http
expires: Wed, 11 Sep 2019 16:12:18 GMT
```

存储资源过期时间戳，在浏览器请求数据的时候，会使用本地时间先和这个时间戳比较，判断是否过期。

### Cache- control （http1.1）：

对于 Expires 如果我手动改变了本地时间，那么 Expires 就没有意义了。为了解决这个问题，**HTTP1.1** 添加了 Cache-Control；

```http
Cache-Control:max-age=7200
```

> 服务器和客户端说，这个资源缓存只可以存在 7200 秒，在这个时间段之内，你就可以在缓存获取资源。

如果 Expire 和 Cache-control 两者同时出现，则以 Cache-control 为主

Cache-control 的额外字段

```http
cache-control: max-age=3600, s-maxage=31536000
```

- **Public**：只要为资源设置了 public，那么它既可以被浏览器缓存，也可以被代理服务器缓存；
- **Private(默认值)**：则该资源只能被浏览器缓存。
- **no-store：**不使用任何缓存，直接向服务器发起请求。
- **no-cache：**绕开浏览器缓存（每次发起请求不会询问浏览器缓存），而是直接向服务器确认该缓存是够过期。

利用 cache control 提供的字段可以实现一套完整的缓存策略
![cache-control-strategy](https://pic.limiaomiao.site:8443/public/uploads/cache-control-strategy.png)

## 协商缓存

协商缓存流程：

1. 从本地取出数据标识符，向服务器验证是否失效，
2. 没失效，则从本地取出数据
3. 失效，从服务器获取新的数据和标识符

### 如何判断协商缓存

协商缓存: 判断**服务端资源**是否有改动，如果有则更新缓存，如果没有则使用缓存

主要通过报文头部 header 中的**Last-Modified**，**If-Modified-Since** 以及**ETag**、**If-None-Match** 字段来进行识别

### Last-Modified & If-Modified-Since(存储时间戳)

浏览器**第一次访问**服务器资源：

- 因为是第一次访问该页面，客户端发请求时，请求头中没有 If-Modified-Since 标签。

- 服务器返回的 HTTP 头标签中有 Last-Modified，告诉客户端页面的最后修改时间。

(**资源没有改变**)浏览器第二次访问服务器资源：

- 客户端发 HTTP 请求时，使用 If-Modified-Since 标签，把上次服务器告诉它的文件最后修改时间返回到服务器端
- 因为文件没有发生改变,服务器返回 304

**(资源发生改变)**浏览器第三次访问服务器资源

- 客户端发 HTTP 请求时，使用 If-Modified-Since 标签，把上次服务器告诉它的文件最后修改时间返回到服务器端
- 因为文件发生改变，服务器做如下操作
  - 状态码：200
  - header 中带有 Last-modified 告诉客户端页面最新的资源修改时间
  - body 返回新的内容

缺陷：精度低，只能以秒计时

### Etag & If-None-Match （http1.1，资源唯一标识符）

ETag 代表的意思是**标识字符串**。对资源进行内容编码，只有内容被改变，这个编码才不同

请求原理和上面的 Last-Modified 相同

服务端返回

```http
ETag: W/"2a3b-1602480f459"
```

浏览器携带

```http
If-None-Match: W/"2a3b-1602480f459"
```

## 缓存位置

缓存位置从上到下：

1. Memory Cache：读取高效，持续时间短
2. Service Worker：PWA 的实现核心，可以自主控制缓存内容，如何匹配，如何读取
3. Disk Cache：磁盘缓存，读取速度慢，但是容量和存储时效性都更好
4. Push Cache：推送缓存，属于 HTTP2 的内容,国内资源太少。。。

## 总结

1. 强缓存优先于协商缓存
2. 协商缓存失效，返回 200，重新返回资源和缓存标识
3. 协商缓存生效则返回 304， 继续使用缓存
