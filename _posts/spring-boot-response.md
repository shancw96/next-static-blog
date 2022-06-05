---
title: 【TODO】Spring-boot 项目全局状态返回
categories: [后端]
tags: [Spring Boot]
toc: true
date: 2020/4/19
---

正常请求使用@ResponseBody(RestController 注解自动设置) 或者 ResponseEntity 详细设置响应头和状态码

错误请求，按照业务模块进行封装，开发经验不足，后面继续更新

<!-- more -->

# 全局状态封装

## 正常返回使用 Spring 提供的 ResponseEntity

常用的几种方式

### 对不同的情况返回不同的 http 状态

```java
@GetMapping("/age")
ResponseEntity<String> age(
  @RequestParam("yearOfBirth") int yearOfBirth) {

    if (isInFuture(yearOfBirth)) {
        return new ResponseEntity<>(
          "Year of birth cannot be in the future",
          HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(
      "Your age is " + calculateAge(yearOfBirth),
      HttpStatus.OK);
}

```

### 手动设置 Http Header

```java
ResponseEntity<String> customHeader() {
  HttpHeaders headers = new HttpHeaders();
    headers.add("Custom-Header", "foo");

    return new ResponseEntity<>(
      "Custom header set", headers, HttpStatus.OK);
}

```

### ResponseEntity 提供了两个 builder 接口： HeadersBuilder 和它的子接口, BodyBuilder 我们可以通过 ResponseEntity 静态方法进行调用

使用静态方法返回一个 状态码为 200 的响应

```java
@GetMapping("/hello")
ResponseEntity<String> hello() {
  return ResponseEntity.ok("Hello World");
}
```

除此之外，常用的静态方法（HTTP 状态码封装）如下

```java
BodyBuilder accepted();
BodyBuilder badRequest();
BodyBuilder created(java.net.URI location);
HeadersBuilder<?> noContent();
HeadersBuilder<?> notFound();
BodyBuilder ok();
```

我们还可以使用`ResponseEntity<T> BodyBuilder.body(T Body)`来 返回 HTTP 响应

```java
@GetMapping("age")
ResponseEntity<String> age(@RequestParam("yearOfBirth") int yearOfBirth) {
  if(isInFuture(yearOfBirth)) {
    return ResponseEntity.badRequest()
      .body("Year of Birth cannot be in the future")
  }

  return ResponseEntity.status(HttpStatus.ok)
    .body("Your age is"+ calculateAge(yearOfBirth))
}

```

自定义 Header

```java
@GetMapping("/customerHeader")
ResponseEntity<String> customerHeader() {
  return ResponseEntity.ok()
    .header("Custom-Header", "foo")
    .body("Custome Header set")
}
```

### @ResponseBody

ResponseBody 将方法的值作为 Http 响应的 Body，并进行返回

### ResponseEntity 和 @ResponseBody 的区别

1. ResponseEntity 的优先级高于@ResponseBody。在不是 ResponseEntity 的情况下才去检查有没有@ResponseBody 注解。如果响应类型是 ResponseEntity 可以不写@ResponseBody 注解，写了也没有关系。
2. ResponseEntity 是在 org.springframework.http.HttpEntity 的基础上添加了 http status code(http 状态码)，用于 RestTemplate 以及@Controller 的 HandlerMethod。它在 Controoler 中或者用于服务端响应时，作用是和@ResponseStatus 与@ResponseBody 结合起来的功能一样的。用于 RestTemplate 时，它是接收服务端返回的 http status code 和 reason 的。

总结： 简单粗暴的讲 @ResponseBody 可以直接返回 Json 结果， @ResponseEntity 不仅可以返回 json 结果，还可以定义返回的 HttpHeaders 和 HttpStatus

# 错误状态处理

错误处理需要根据业务去封装, 如果一个请求错误，需要后端返回信息给前端，那么就需要封装一个通用的类用来管理相关的业务错误类型，这个只能说遇到了之后再去做
