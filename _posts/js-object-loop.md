---
title: js 对象遍历的几种方式
categories: [前端]
tags: [basic, interview]
toc: true
date: 2022/8/24
---

这篇文章介绍了 js 中遍历简单对象的几种方式。

`for..in`, `Object.keys`, `Object.values`, `Object.defineProperty`

<!-- more -->

```js
let obj = {
  name: 1,
};

Object.prototype.name2 = 2;

Object.defineProperty(obj, "name3", {
  enumerable: false,
  value: 123,
});
```

- for ... in: 遍历对象本身及原型 enumerable 为 true 的 key

```js
for (let i in obj) {
  console.log(i); // name name2
}
```

- Object.keys: 遍历对象本身 enumerable 为 true 的 key

```js
Object.keys(obj).forEach((key) => console.log(key)); // name
```

- Object.values: 遍历对象本身 enumerable 为 true 的 值

```js
Object.values(obj).forEach((key) => console.log(key)); // 1
```

- Object.defineProperty: 遍历对象本身所有 key

```js
Object.getOwnPropertyNames(obj).forEach((key) => console.log(key)); // name  name3
```
