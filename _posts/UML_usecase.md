---
title: UML 用例图
categories: [UML]
tags: [usecase]
toc: true
date: 2022/10/13
---

这篇文章通过具体例子，介绍了 UML 用例图的相关知识。包括 System, Actors, Use Cases, Relationships

<!-- more -->

通过银行 App 示例解释 UML 用例图

### System

银行 App 应用，天蓝色外框表示。

![image-20221013133939754](http://serial.limiaomiao.site:8089/public/uploads/image-20221013133939754.png)

所有银行系统涉及到的交互，都应该发生在 System 框内部

### Actors

Actors 是外部对象，需要放在 System 的外部，Actors 指人员，组织或者其他交互系统

![image-20221013134430278](http://serial.limiaomiao.site:8089/public/uploads/image-20221013134430278.png)

此处用黄色表示，在银行 App 中，Actors 分为 客户和银行两类，客户为主要 Actor，银行为被动反应 Actor

![image-20221013133957312](http://serial.limiaomiao.site:8089/public/uploads/image-20221013133957312.png)

### Use Cases

用例使用椭圆表示，代表了在系统内部完成某些任务的行为。比如银行有登陆，查看余额，转钱，支付。用例的排放一般按照逻辑从上到下排列

![image-20221013134901165](http://serial.limiaomiao.site:8089/public/uploads/image-20221013134901165.png)

### Relationships

定义不同的 Use Case 是如何关联的

比如用户需要登陆，那么用户和 Login 用例之间，需要进行关联，这是一种 Relationship，名称为 Association.

#### Association 表示基本的交流或者互动

![image-20221013135108048](http://serial.limiaomiao.site:8089/public/uploads/image-20221013135108048.png)

用户除了登陆外，还可以查看余额，转钱，支付，相对应的银行会做出响应，所以得到了如下 relationships

![image-20221013135353112](http://serial.limiaomiao.site:8089/public/uploads/image-20221013135353112.png)

除了普通的 Association 之外，Relationship 还有 Include，Extend，Generalization 三种

#### include

用户的登陆操作，需要验证密码, 每次执行 Login 操作都会触发 Verify Password ，

因此我们将 Log in 用例定义为 Base Use Case(基本用例)，将 Verify Password 定义为 Included Use Case (包含用例)

![image-20221013165448821](http://serial.limiaomiao.site:8089/public/uploads/image-20221013165448821.png)

对于此类关系，使用 include 表示，具体如下

![image-20221013165203906](http://serial.limiaomiao.site:8089/public/uploads/image-20221013165203906.png)

#### Extend

用户的登陆操作，当登陆失败后，需要展示失败页面，但是用户并不是每次都失败，对于这种情况。

我们将 Display Login Error 定义为 Extend Use Case。Extend Use Case 箭头关系与 Include 相反

![image-20221013165728208](http://serial.limiaomiao.site:8089/public/uploads/image-20221013165728208.png)

体现在具体场景为：

![image-20221013165806860](http://serial.limiaomiao.site:8089/public/uploads/image-20221013165806860.png)

#### Generalization

用户支付操作，可能存在两种情况，从当前账户余额付款或者从储蓄账户付款

Make Payment 属于 General Use Case，是一个抽象的用例，而余额付款和储蓄账户付款属于具体实现命名为 Specialized Use Cases

对于上述情况的 UML 表达方式如下：

![image-20221013170137241](http://serial.limiaomiao.site:8089/public/uploads/image-20221013170137241.png)
