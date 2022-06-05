---
title: 各种API 实现
categories: [前端]
tags: [implement]
toc: true
date: 2021/1/7
---

## lodash get 实现 01/06

```js
var object = { a: [{ b: { c: 3 } }] };

_.get(object, "a[0].b.c");
// => 3

_.get(object, ["a", "0", "b", "c"]);
// => 3

_.get(object, "a.b.c", "default");
// => 'default'
```

```js
function get(obj, path, defaultValue) {
  const arr = typeof path === "string" ? getPath(path).split(".") : path;
  return getCore(arr, obj);
  function getCore(pathArr, acc) {
    if (pathArr.length === 0) return acc;
    else if (!acc[pathArr[0]]) return defaultValue;
    else {
      return getCore(pathArr.slice(1), acc[pathArr[0]]);
    }
  }

  function getPath(str) {
    const newStr = str.replace(
      /(\[)([0-9]+)(\])/g,
      (match, $1, $2, $3) => `.${$2}`
    );
    return newStr;
  }
}
```

## lodash - curry 实现

example

```js
var abc = function (a, b, c) {
  return [a, b, c];
};

var curried = curry(abc);

curried(1)(2)(3);
// => [1, 2, 3]

curried(1, 2)(3);
// => [1, 2, 3]

curried(1, 2, 3);
// => [1, 2, 3]

function curry(fn: Function) {
  let args = [];
  return function curried(...tempArgs) {
    args.push(...tempArgs);
    if (args.length === fn.length) return fn.call(this, args);
    else return curried;
  };
}
```

## Proxy 实现循环数组下标如 arr[-1] === arr[arr.length - 1] arr[arr.length ] = arr[0] 01/07

```js
function proxyArr(originArr) {
  return new Proxy(originArr, {
    get(target, key) {
      return isInRange(Number(key), target)
        ? target[key]
        : getRangedKey(Number(key), target);
    },
  });

  function isInRange(index, target) {
    return 0 <= Number(index) && Number(index) <= target.length - 1;
  }
  function getRangedKey(key, target) {
    let rangedKey = key;
    const range = target.length;
    if (key >= 0) {
      while (rangedKey >= target.length) {
        rangedKey -= range;
      }
    } else {
      while (rangedKey < 0) {
        rangedKey += range;
      }
    }
    return target[rangedKey];
  }
}
```
