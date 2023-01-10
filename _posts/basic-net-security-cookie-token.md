---
title: cookie,token及相关网络内容
categories: [网络]
tags: [cookie, token, interview]
toc: true
date: 2022/8/25
---

这篇文章介绍了 cookie 与 token 的相关知识。关于 cookie 和 token 如何安全存储，以及常见的攻击方式（xss,csrf）

<!--more-->

## Table of Content

## cookie 与 token

cookie 与 token 都是在 web 服务中用于用户认证的方式。从实现上来说，cookie 是有状态的，而 token（通常指 jwt）是无状态的。

### cookie

cookie 内容由服务端设置，以 key,value 方式存储, 只有同源的网页才能共享。但是，两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置`document.domain`(已废弃，推荐在后端进行设置 cookie 的 domain)共享 Cookie。

![20201024110529647](https://pic.limiaomiao.site:8443/public/uploads/20201024110529647.png)

通过 cookie 方式进行的认证，通常和 Session 配合使用。

Session 是后端（java servlet）记录客户状态的机制。 后端将 sessionId 存放在 cookie 中，返回给前端。前端拿着 cookie，进行其他的请求。

![2020102411055026](https://pic.limiaomiao.site:8443/public/uploads/2020102411055026.png)

### Token（jwt）

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```json
{
  "name": "张三",
  "role": "POWER_CODE123",
  "expire": "2022/11/01"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止 token 被篡改，还可以加上签名。

服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了。

JWT 的组成

- Header：描述 jwt 的元数据，签名算法，令牌类型
- Payload：JSON 对象，实际的传输数据
- Signature：将 header，payload 通过密钥（只有服务端知道）进行加密，最终生成 Signature 字符串

`Header.Payload.Signature`

阅读参考：

- [单点登录（SSO）看这一篇就够了](https://developer.aliyun.com/article/636281)
- [阮一峰-JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

### 引申出来的安全性问题

#### 跨站脚本攻击（XSS）

一般来说，跨站脚本攻击（XSS）最常见的攻击方式就是通过在交互式网站（例如论坛、微博等）中嵌入 javascript 脚本，当其他用户访问嵌有脚本的网页时，攻击者就能通过 document.cookie 窃取到用户 cookie 信息。

解决方案：

- js 脚本窃取：设置 Cookie 的 HttpOnly 属性为 true, 浏览器客户端就不允许嵌在网页中的 javascript 脚本去读取用户的 cookie 信息

- 抓包方式窃取：**设置 cookie 的 secure 属性为 true。**需要配合 https 使用,否则 cookie 会失效

  设置了 secure=true 时，那么 cookie 就只能在 https 协议下装载到请求数据包中，在 http 协议下就不会发送给服务器端

#### 跨站请求伪造（CSRF）

当上述情况拿到了 cookie 后，攻击者会从第三方网站发起攻击。

解决方案：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie：**设置 cookie 的 samesite 属性为 strict 或 lax。**
- **设置 cookie 的 expires 属性值：给 cookie 设置 expires 值为-1，那么该 cookie 就仅仅保存在客户端内存中，当浏览器客户端被关闭时，cookie 就会失效了**

深入学习: [前端安全系列（二）：如何防止 CSRF 攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

## 同源策略

参考文章：[浏览器同源政策及其规避方法](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)

### 什么是同源

协议，域名，端口三个相同

http://serial.limiaomiao.site:8088

- 协议：http
- 域名：serial.limiaomiao.site
- 端口：8088

### 非同源交互方式

1. postMessage
2. JSONP
3. WebSocket
4. CORS: 跨域资源共享
