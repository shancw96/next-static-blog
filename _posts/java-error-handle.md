---
title: Spring中异常处理
categories: [后端]
tags: []
toc: true
date: 2021/6/7
---

Java 中的错误处理笔记

<!-- more -->

## 异常的层级结构

![java 中异常处理](/images/java/java-error.png)
<u>Java 中所有的异常类的基类是 Throwable 类，两大子类是 Exception 和 Error</u>，

Error 的发生与程序设计无关，超出了程序的控制范围。开发中需要处理的是 Exception 错误。

Exception 分为 RuntimeException（运行时异常） 和 CheckedException（检查时异常）

- RuntimeException：一般为代码的逻辑错误。如数组下标越界，类型转换错误，空指针异常
- CheckedException: 编译时可以检查到的异常，必须<span style="color: red">**显式的进行处理**</span>,例如：IOException，FileNotFoundException

+ EOFException： 你从文件中读取对象的时候，如何判断是否读取完毕。jvm会给抛出EOFException，表示的是，文件中对象读取完毕，捕获掉这个异常就可以，是捕获不是抛出。

## 异常处理

### try catch finally （略）

### throw （程序内部主动抛出异常）

大多数情况下，你所抛出的异常都是自己创建的异常类的实例，比如 Spring MVC 中自定义的 response 错误类型（BadRequestAlertException, TimeConflictException）

**重新抛出异常**

由 catch 语句捕获的异常可以重新抛出以使外部 catch 可以捕获。

```java
try {
  // code
}
catch (Exception exc) {
  throw exc
}
```

**多重捕获**

```java
try {
  // code
}
catch(NullPointerException | ClassNotFoundException exc2) {
  // handle it
}
```

### throws（声明一个方法可能抛出的异常）

<span>凡是 Error 或者 RuntimeException 的绝大部分子类都不需要在 throws 中指定，Java 假定一个方法可以抛出这样的异常</span>

> Java 程序隐式的引入了 java.lang，而 java.lang 的标准包内定义了几个异常类，绝大部分从 RuntimeException 派生出来的异常自动有效，不需要被引入任何方法的 throws 列表中

![java.lang 包定义的未检查异常](/images/java/java-lang-define-error.png)

**基本格式**

```java
retType methodName(paramList) throws customException1, customException2 {

}
```

## spring boot 全局错误处理

流程：程序中抛出自定义错误，通过定义的全局错误处理类进行捕获，格式化输出为 ResponseEntity 包裹的错误

### 1. 创建具体的错误类型类

```java
@Getter
public class BadRequestException extends RuntimeException{

    private Integer status = BAD_REQUEST.value();

    public BadRequestException(String msg){
        super(msg);
    }

    public BadRequestException(HttpStatus status,String msg){
        super(msg);
        this.status = status.value();
    }
}
```

### 2. 定义全局错误处理类

#### 创建 ApiError 类用于格式化错误信息

```java
@Data
public class ApiError {
    private Integer status = 400;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    private String message;

    private ApiError() {
        timestamp = LocalDateTime.now();
    }

    public static ApiError error(String message){
        ApiError apiError = new ApiError();
        apiError.setMessage(message);
        return apiError;
    }

    public static ApiError error(Integer status, String message){
        ApiError apiError = new ApiError();
        apiError.setStatus(status);
        apiError.setMessage(message);
        return apiError;
    }
}
```

#### 创建全局错误处理类管理全局错误信息

```java
@RestControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> BadRequestHandler(BadRequestException e) {
        ApiError apiError = ApiError.error(e.getMessage());
        return new ResponseEntity<>(apiError, HttpStatus.valueOf(apiError.getStatus()));
    }
}
```

#### 解析：

@RestControllerAdvice: @ControllerAdvice + @ResponseBody

- @ControllerAdvice:
  - <span style="color: red"> @ExceptionHandler</span>：用于捕获 Controller 中抛出的不同类型的异常，从而达到异常全局处理的目的；
  - @InitBinder 注解标注的方法：用于请求中注册自定义参数的解析，从而达到自定义请求参数格式的目的；
  - @ModelAttribute 注解标注的方法：表示此方法会在执行目标 Controller 方法之前执行 。
