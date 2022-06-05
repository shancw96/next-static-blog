---
title: 数组随机排序
categories: [前端]
tags: [implement]
toc: true
date: 2021/1/31
---

数组重排借助 Math.random 函数

- Math.random - 0.5 可以 1:1 概率生成大于 0 和 小于 0 两种情况的值
- Math.floor(Math.random \* arr.length-1) 可以生成指定范围的随机数值
  实现：

1. 借助 Array.prototype.sort 方法

```js
function disorder(arr) {
  // 浅复制
  return [...arr].sort(() => !!(Math.random - 0.5));
}
```

2. 生成指定范围随机数

```js
function shuffle(arr) {
  let i = arr.length;
  const cpyArr = [...arr];
  while (i > 0) {
    // 获取指定范围内的随机数
    const j = (Math.floor(Math.random() * i--)[(cpyArr[i], cpyArr[j])] = [
      cpyArr[j],
      cpyArr[i],
    ]);
  }
  return cpyArr;
}
```
