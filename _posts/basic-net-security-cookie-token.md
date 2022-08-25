---
title: 网络安全 - cookie 与 token的防窃取
categories: [网络]
tags: [cookie,token, interview]
toc: true
date: 2022/8/25
---

这篇文章介绍了cookie 与 token的相关知识。关于cookie 和 token如何安全存储，以及常见的攻击方式（xss,csrf）

<!--more-->

## cookie 与 token

cookie 与token都是在web服务中用于用户认证的方式。从实现上来说，cookie是有状态的，而token（通常指jwt）是无状态的。

### cookie

cookie 内容由服务端设置，以key,value方式存储。

![20201024110529647](http://serial.limiaomiao.site:8089/public/uploads/20201024110529647.png)

通过cookie方式进行的认证，通常和Session配合使用。

Session是后端（java servlet）记录客户状态的机制。 后端将sessionId 存放在cookie中，返回给前端。前端拿着cookie，进行其他的请求。

![2020102411055026](http://serial.limiaomiao.site:8089/public/uploads/2020102411055026.png)



### Token（jwt）



JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```json
{
  "name": "张三",
  "role": "POWER_CODE123",
  "expire": "2022/11/01"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止token被篡改，还可以加上签名。

服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了。



JWT 的组成

+ Header：描述jwt 的元数据，签名算法，令牌类型
+ Payload：JSON对象，实际的传输数据
+ Signature：将header，payload 通过密钥（只有服务端知道）进行加密，最终生成Signature字符串

`Header.Payload.Signature`

阅读参考：

+ [单点登录（SSO）看这一篇就够了](https://developer.aliyun.com/article/636281)
+ [阮一峰-JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)



### 引申出来的安全性问题

#### 跨站脚本攻击（XSS）

一般来说，跨站脚本攻击（XSS）最常见的攻击方式就是通过在交互式网站（例如论坛、微博等）中嵌入javascript脚本，当其他用户访问嵌有脚本的网页时，攻击者就能通过document.cookie窃取到用户cookie信息。

解决方案：

+ js脚本窃取：设置Cookie的HttpOnly属性为true, 浏览器客户端就不允许嵌在网页中的javascript脚本去读取用户的cookie信息

+ 抓包方式窃取：**设置cookie的secure属性为true。**需要配合https使用,否则cookie 会失效

  设置了secure=true时，那么cookie就只能在https协议下装载到请求数据包中，在http协议下就不会发送给服务器端

#### 跨站请求伪造（CSRF）

当上述情况拿到了cookie后，攻击者会从第三方网站发起攻击。

解决方案：

+ 阻止不明外域的访问
  + 同源检测
  + Samesite Cookie：**设置cookie的samesite属性为strict或lax。**
+ **设置cookie的expires属性值：给cookie设置expires值为-1，那么该cookie就仅仅保存在客户端内存中，当浏览器客户端被关闭时，cookie就会失效了**

深入学习: [前端安全系列（二）：如何防止CSRF攻击？](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)