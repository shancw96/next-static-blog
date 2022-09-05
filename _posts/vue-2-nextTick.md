---
title: 从 eventLoop 到 nextTick
categories: [前端]
tags: [vue, vue-nextTick， eventLoop]
toc: true
date: 2022/9/5
---

这篇文章介绍了 eventLoop 及 nextTick 的原理

<!-- more -->

## Table of Content

## nextTick 在项目中的使用？

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它

```jsx
...
'<div>{{ message }}</div>'
...
import { createApp, nextTick } from "vue";
const app = createApp({
  setup() {
    const message = ref("Hello!");
    const changeMessage = async (newMessage) => {
      message.value = newMessage;
      await nextTick();
      console.log("Now DOM is updated");
    };
    return {
      message,
    };
  },
});
```

## EventLoop

**浏览器只会在一个 task 结束的最后进行一次渲染**

浏览器的 eventloop 如下图所示:
![eventloop.jpeg](http://serial.limiaomiao.site:8089/public/uploads/eventloop-20220905101300156.jpeg)

有如下代码，请分析执行顺序

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
}, 0);

new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then((data) => {
  console.log(data);
});

setTimeout(() => {
  console.log(6);
}, 0);

console.log(7);
```

答案：1 4 7 5 2 3 6

分析：

![img](http://serial.limiaomiao.site:8089/public/uploads/408483-20190913122454767-2038890726-20220905155941199.png)

- **macrotask（宏任务）** 在浏览器端，其可以理解为该任务执行完后，在下一个 macrotask 执行开始前，浏览器可以进行页面渲染。触发 macrotask 任务的操作包括：
  - **script(整体代码)**
  - **setTimeout**、**setInterval**、**setImmediate**
  - **I/O**、**UI 交互事件**
  - **postMessage**、**MessageChannel**
- **microtask（微任务）**可以理解为在 macrotask 任务执行后，页面渲染前立即执行的任务。触发 microtask 任务的操作包括：
  - **Promise.then**
  - **MutationObserver**
  - **process.nextTick(Node 环境)**

## nextTick 的原理

如下代码为 nextTick(cb) ，cb 具体调用的过程

![img](http://serial.limiaomiao.site:8089/public/uploads/1620.png)

上述代码尝试使用原生的`Promise.then`、`MutationObserver`和`setImmediate`，如果上述三个都不支持，那么最后使用 setTimeout；

降级处理的目的都是将待执行函数放入微任务(判断 1 和判断 2)或者宏任务(判断 3 和判断 4)中，等待下一次事件循环时来执行。

## 参考：

- [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- [全面解析 Vue.nextTick 实现原理](https://juejin.cn/post/6844903590293684231#heading-3)

* [面试题：Vue 中$nextTick 原理](https://cloud.tencent.com/developer/article/1633546)

* [聊聊 JavaScript 异步中的 macrotask 和 microtask](https://www.cnblogs.com/wonyun/p/11510848.html)
