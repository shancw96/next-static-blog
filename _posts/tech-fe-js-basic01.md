---
title: 前端教程 - JS基础part1
categories: [前端教程]
tags: []
toc: true
date: 2022/7/21
---

这篇文章是JS基础的第一部分，介绍了let const 和6种基本类型。

js基础一共分为三部分，其他两部分为 

+ 逻辑操作 （未更新）

+ 引用类型 （未更新）

<!-- more --> 

## Table of Content



## 变量

在js中，变量可以存储任意类型的数据。



可选的关键字有如下几种：

+ var：不推荐使用，过时
+ let：可变变量声明
+ const：不可变常量声明

注意，let和const 声明的变量，只在对应的代码块（块级作用域）内生效。



声明变量的const 和 let 声明变量，有如下几种特性，需要关注

### 块级作用域

比如，有个for循环，我们使用let 声明了i变量，那么i就只在for循环的块级作用域生效。

如下不会报错：

```js
for(let i = 0; i < 10; i++) {
  console.log(i)
}
```

但如果我们尝试在for循环外部进行调用i，会报错

```js
console.log(i) // -> ReferenceError: i is not defined
for(let i = 0; i < 10; i++) {
  
}
console.log(i) // -> ReferenceError: i is not defined
```

报错的内容翻译为：引用错误：i没有定义

作用域一般由花括号`{}`生成，花括号内部的就是独立的块级作用域

### 暂时性死区

JS 代码从上到下解析执行，这就意味着，在变量申明之前，没有办法被直接调用，举个例子如下

```js
console.log(i) // ReferenceError:i 没有定义
console.log(j) // ReferenceError:j 没有定义
const i = 0;
let j = 1; 
```

我们在i j 申明之前，调用了i，j，因为js从上到下依次执行，所以会抛出i j不存在的报错



### 数据类型

JS数据类型分为，基础类型和引用类型两类，这个章节只讲基础类型

+ Undefined：表示未定义
+ Null：和Undefined 表达的语义类似，属于 语言设计缺陷，细化的区别后序讲到了引用类型
+ Boolean：布尔值，只有true或者false，
+ String：字符串
+ Number：数值类型
+ Symbol：一般不会使用，使用频率很低，但是有的面试会故意提问，看你知不知道这个存在



### 借助typeof 判断当前变量是什么类型

typeof 可以准确返回除了null以外的基础类型， 

。对一个值使用 typeof 操作符会返回下列字符串之一: 

+  "undefined"表示值未定义; 
+ "boolean"表示值为布尔值; 
+ "string"表示值为字符串; 
+  "number"表示值为数值; 
+ "symbol"表示值为符号。
+  "object"表示值为对象(而不是函数)或 null; 
+ "function"表示值为函数;

typeof 的使用方式如下：

```js
const anything = ''
const ans = typeof anything 
console.log(ans) // -> 'string'
```



为什么null，会被认为是object？

个人觉得是设计缺陷，如果面试问道，这么回答：这是因为特殊值 null 被认为是一个对空对象的引用。



## 重点数据类型的额外介绍

这个章节介绍了 boolean，Number，string 需要注意的点



### boolean

在js中，不同的类型，会自动的进行转换，比如如下场景

```js
const a = 1;
if (a) {
  console.log(a)
}
```

这段代码的if 代码块，是可以被正常执行的。

为什么？明明if 只能接收boolean 值，true的话就正常执行，false就跳过。

原因：

当js 识别到你给if 传了错误的类型，它会尝试将其转换成正确的类型。

所以，上述代码，背后的操作如下：

js 根据预先定义好的规则，将 a存储的number值1，转换成boolean值 true

所以，if条件判断为true





那么，预先定义好的规则有哪些？

### boolean 转换的规则

![image-20220721135035467](http://serial.limiaomiao.site:8089/public/uploads/image-20220721135035467.png)

我们在记的时候，只需要记住转换成false的几种特殊情况就行，

比如空字符串，0，null， undefined，NaN



等等，什么是NaN？基础类型一共就6种，怎么多出来一个NaN



### NaN

NaN表示非数，上一个小章节说了，如果我们传了错误的类型，js会尝试自动转换。

当js没办法将特定类型转换成number类型，就会转换成NaN，NaN也是number类型。表示非数。

+ 布尔值 -> 1

  + false -> 0

  + null -> 0

+ undefined -> NaN

+ 字符串

  + ‘数字’ -> 数字：'123' -> 123

  + ‘非数字’ -> NaN ： 'blue' -> NaN

### 字符串

+ 不同的字符串可以用 + 号进行拼接

  

  ```js
  const text1 = 'hello'
  const text2 = 'world'
  console.log(text1 + text2 + '!') // -> helloworld!
  ```

+ 模版字符串：新版的js觉得使用 + 进行拼接不太好，于是有了模版字符串

  ```js
  let value = 5;
  let exponent = 'second';
  let interpolatedString = value + ' to the ' + exponent + ' power is ' + (value * value);  // 现在,可以用模板字面量这样实现: 
  let interpolatedTemplateLiteral =   `${ value } to the ${ exponent } power is ${ value * value }`;
  ```

  