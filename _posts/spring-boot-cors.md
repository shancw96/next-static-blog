---
title: 跨域请求 与 前后端设置
categories: [后端]
tags: [Spring Boot, CORS]
toc: true
date: 2021/3/29
---

跨域 与 同源属于 两个相对的概念。不满足同源的请求就是跨域请求。

<!-- more -->

## 同源

同源策略：协议://域名:端口号 全部相同就是同源策略。

最初，它的含义是指，A 网页设置的 Cookie，B 网页不能打开，除非这两个网页"同源"。目前，如果非同源，下面三种行为会收到限制

1. Cookie,LocalStorage 和 IndexDB 无法获取
2. DOM 无法获得
3. AJAX 请求不能发送

## 跨域请求的实现方法

### CORS

CORS 需要浏览器和服务器的同时支持，但是在整个通信过程中，都是浏览器自动完成的。
浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求。
对于开发者说，CORS 通信与同源 AJAX 通信没有区别。

**因此，99%的跨域问题都是后端的问题**

服务端设置的 跨域相关 Response Header

#### 简单请求

- 请求方法是以下三种方法之一：
  - HEAD
  - GET
  - POST

* HTTP 的头信息不超出以下几种字段：
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

**简单请求相关的 header**

```http
  Access-Control-Allow-Origin: http://api.bob.com
  Access-Control-Allow-Credentials: true
  Access-Control-Expose-Headers: FooBar
  Content-Type: text/html; charset=utf-8
```

Access-Control-Allow-Origin: 允许访问的白名单, 可设置为 \* 或者 指定的域名

Access-Control-Allow-Credentials：服务器是否接受客户端的 cookie 此字段需要前端配置设置

```js
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

**如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名。**

#### 非简单请求

非简单请求比简单请求多了个 Option 请求

**浏览器先询问服务器**，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。**只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错。**

预检请求相关 header 设置

- Access-Control-Allow-Methods: 服务器支持的方法
- Access-Control-Allow-Credentials: cookie 设置，参考上面简单请求
- Access-Control-Max-Age: 预检请求的有效期

### 其他跨域实现方式

#### WebSocket

WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

websocket 请求头：

```js
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

websocket 的请求头中有一个 Origin 字段，表示该请求的请求源，服务器根据这个字段，判断是否允许通讯

#### JSONP

略

## spring boot 对 cors 的设置

方案一和方案二，本质是相同的方案，只是配置方式不同。

### @CrossCors 独立配置每个 API

@CrossCors 注解，添加在类或方法上，标记该类/方法对应接口的 Cors 信息。

@CrossCors 注解的常用属性，如下：

- origins 属性，设置允许的请求来源。[] 数组，可以填写多个请求来源。默认值为 \* 。
  value 属性，和 origins 属性相同，是它的别名。
- allowCredentials 属性，是否允许客户端请求发送 Cookie 。默认为 false ，不允许请求发送 Cookie 。
- maxAge 属性，本次预检请求的有效期，单位为秒。默认值为 1800 秒。

### [使用 CorsRegistry 注册表，配置每个 API 接口](https://github.com/YunaiV/SpringBoot-Labs/blob/master/lab-23/lab-springmvc-23-02/src/main/java/cn/iocoder/springboot/lab23/springmvc/config/SpringMVCConfiguration.java)

```java
// SpringMVCConfiguration.java

@Override
public void addCorsMappings(CorsRegistry registry) {
    // 添加全局的 CORS 配置
    registry.addMapping("/**") // 匹配所有 URL ，相当于全局配置
            .allowedOrigins("*") // 允许所有请求来源
            .allowCredentials(true) // 允许发送 Cookie
            .allowedMethods("*") // 允许所有请求 Method
            .allowedHeaders("*") // 允许所有请求 Header
//                .exposedHeaders("*") // 允许所有响应 Header
            .maxAge(1800L); // 有效期 1800 秒，2 小时
}
```

### 使用 COrsFilter 过滤器，处理跨域请求

在 Spring Web 中，内置提供 CorsFilter 过滤器，实现对 CORS 的处理。

```java
// SpringMVCConfiguration.java

@Bean
public FilterRegistrationBean<CorsFilter> corsFilter() {
    // 创建 UrlBasedCorsConfigurationSource 配置源，类似 CorsRegistry 注册表
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    // 创建 CorsConfiguration 配置，相当于 CorsRegistration 注册信息
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Collections.singletonList("*")); // 允许所有请求来源
    config.setAllowCredentials(true); // 允许发送 Cookie
    config.addAllowedMethod("*"); // 允许所有请求 Method
    config.setAllowedHeaders(Collections.singletonList("*")); // 允许所有请求 Header
    // config.setExposedHeaders(Collections.singletonList("*")); // 允许所有响应 Header
    config.setMaxAge(1800L); // 有效期 1800 秒，2 小时
    source.registerCorsConfiguration("/**", config);
    // 创建 FilterRegistrationBean 对象
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(
            new CorsFilter(source)); // 创建 CorsFilter 过滤器
    bean.setOrder(0); // 设置 order 排序。这个顺序很重要哦，为避免麻烦请设置在最前
    return bean;
}
```

## 参考

- [芋道 Spring Boot SpringMVC 入门](https://www.iocoder.cn/Spring-Boot/SpringMVC/?self)
