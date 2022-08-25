---
title: JS 深拷贝的几种方式
categories: [前端]
tags: [WeakSet, basic, interview]
toc: true
date: 2022/8/25
---

递归，JSON.stringify, 第三方库

<!-- more -->

1. 递归（环引用，边界判断）

Date，RegExp，Function, Array

TODO：Symbol

```js
// core loop
function deepClone(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = deepClone(obj[key]);
    return newObj;
  }, {});
}

// 添加边界条件   Date，RegExp，Function。
function deepClone(obj) {
  // null
  if (obj === null) return obj;
  // function，基本类型
  if (typeof obj !== "object") return obj;
  // date regexp
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  return Object.keys(obj).reduce(
    (newObj, key) => {
      newObj[key] = deepClone(obj[key]);
      return newObj;
    },
    Array.isArray(obj) ? [] : {}
  ); // 对数组情况进行判断。
}

// 增加数组情况处理 Array

// 解决环引用
function deepClone(obj, set = new WeakSet()) {
  // null
  if (obj === null) return obj;
  // function，基本类型
  if (typeof obj !== "object") return obj;
  // date regexp
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  set.add(obj);

  return Object.keys(obj).reduce(
    (newObj, key) => {
      if (set.has(obj[key])) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deepClone(obj[key], set);
      }
      return newObj;
    },
    Array.isArray(obj) ? [] : {}
  );
}
```

2. JSON.stringify (无法处理环引用，无法处理边界情况)

```js
const obj = {
  name: 123,
};
JSON.parse(JSON.stringify(obj));
```

3. lodash 等第三方库提供的深拷贝：略

备注：

V8 垃圾回收： 标记清除

![3374609593-607f6d095870d](http://serial.limiaomiao.site:8089/public/uploads/3374609593-607f6d095870d.gif)

在递归的方式中，使用 WeakSet 是为了 GC。 `WeakMap` , `WeakSet` 对于值的引用都是不计入垃圾回收机制的。

具体参考 [WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？](https://segmentfault.com/a/1190000039862872)
