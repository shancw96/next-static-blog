---
title: 翻译 JavaScript Visualized Hoisting
categories: [前端]
tags: [js, hoisting]
toc: true
date: 2022/7/29
---

#

原文链接：https://dev.to/lydiahallie/javascript-visualized-hoisting-478h

Hoisting(提升)是每个 JS 开发人员都听说过的术语之一。

因为你可能因为代码中的错误去 google 搜索解决办法，最终来到了 stackoverflow 论坛，人家告诉你你的错误是因为 hoisting。

所以，什么是 hoisting

如果你是 Javascript 萌新，你可能经历过变量突然变成 `undefined`,或者直接抛出 `ReferenceError`报错

提升通常被解释为将变量和函数放在文件的顶部，这样的描述并不准确。所以这篇文章介绍了 Hoisting 的细节

<!--more-->

## Table of Content

## Step1 分配内存空间

当 JS 引擎获取到我们的 script 脚本，第一件事是**为数据分配内存空间**。在这个阶段任何代码都不会被执行，只是为执行做准备。变量和函数的存储是不同的，**函数存储的是它的地址引用，就和 Array，Object 存储方式一样**

> 关于 JS 中内存存储的具体方式，会另外开一篇文章讲解

![Stack heap pointers explained](https://pic.limiaomiao.site:8443/public/uploads/stack-heap-pointers.png)

![Functions are Stored with a reference to the entire function](https://res.cloudinary.com/practicaldev/image/fetch/s--lLfiCbTX--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif7.gif)

变量存储，和函数不同。ES6 规定了 let 和 const 两个关键字来声明变量，通过这两个关键字声明的变量是 uninitialized（未初始化）

此时如果尝试访问，会抛出错误

```js
console.log(info); // -> ReferenceError 抛出错误，引用错误

const info = {
  age: 21,
};
```

![](https://res.cloudinary.com/practicaldev/image/fetch/s--vRtKMspn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif8.gif)

通过 var 声明的变量，会设置一个默认值 undefined

![](https://res.cloudinary.com/practicaldev/image/fetch/s--zvlaEaAo--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif9.gif)

## 执行阶段 - 提前访问

现在创建阶段已经完成，我们可以实际执行代码了。让我们看看如果我们在文件顶部有 3 个 console.log 语句，在我们声明函数或任何变量之前会发生什么。

```js
console.log(sum(2, 3));
console.log(city);
console.log(name);

function sum(x, y) {
  return x + y;
}

const name = "Lydia Hallie";

let info = {
  age: 21,
  nationlity: "Dutch",
};

var city = "San Francisco";
```

第一个`console.log(sum(2,3 ))` 会输出 5，因为函数存储的是引用，所以不会抛出错误。

![](https://res.cloudinary.com/practicaldev/image/fetch/s--nk1taOke--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif16.gif)

第二个 console，会输出 undefined，因为 var 初始化存储了 undefinde

![](https://res.cloudinary.com/practicaldev/image/fetch/s--2nai6XPr--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif17.gif)

第三个 console，会直接抛出错误，因为，这个值没有被赋值过

![](https://res.cloudinary.com/practicaldev/image/fetch/s--VVPlWhGC--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif18.gif)

### 执行阶段 - 赋值操作

当 js 执行到对应的赋值操作后，会对内存中的变量进行赋值

![](https://res.cloudinary.com/practicaldev/image/fetch/s--LGEaCMkS--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://devtolydiahallie.s3-us-west-1.amazonaws.com/gif12.gif)
