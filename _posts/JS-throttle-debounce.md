---
title: debounce & throttle
categories: [前端]
tags: [implement]
toc: true
date: 2022/8/31
---

## 请实现一下防抖和节流

### 防抖函数

debounce 函数返回一个可执行函数。这个可执行函数的作用域链上保存了定时器变量。当重复执行的时候，会先清空掉上次生成的定时器，从而实现延迟执行的效果

#### 代码实现

```js
function debounce(func, wait) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
```

### 节流函数

原理与 防抖函数相同，通过 closure 存储上次执行的时间戳，当前时间戳和之前的时间戳相比较，如果超过约定时间，则执行一次函数。

#### 代码实现

##### 时间戳实现

```js
// 只有当上一次调用的时间 与 现在时间的差值 超过了设定的时间 才会再次调用
function throttle(func, interval) {
  let lastTimeStamp = 0;
  let timer = null
  return function (...args) {
    clearTimeout(timer);
    let curDate = Date.now();
    const diff = curDate - lastTimeStamp;
    if (curDate - lastTimeStamp > interval) {
      func.apply(this, args);
      lastTimeStamp = curDate;
    } else {
      timer = setTimeout(() => {
        func.apply(this, args)
      }, interval)
    }
  };
}

```

##### requestAnimationFrame 实现

> 参考了 ElementUI 图片拖拽部分的源码

实现原理和时间戳实现方法相同，只不过吧延迟 interval 替换为一帧。在屏幕刷新率为 60HZ 的情况下约为 16.7ms 执行一次（1000ms / 60 = 16.666...ms）

```js
function rafThrottle(func) {
  let lock = false;
  return function (...args) {
    if (lock) return;
    lock = true;
    window.requestAnimationFrame(() => {
      func.apply(this, args);
      lock = false;
    });
  };
}
```
