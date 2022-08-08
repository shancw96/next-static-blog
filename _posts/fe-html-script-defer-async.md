---
title: script - async, defer 区别
categories: [前端]
tags: []
toc: true
date: 2021/3/30
---

浏览器加载 html 时候，如果遇到 script 脚本标签，默认情况下会立即执行该脚本。对于外部脚本如 `<script src=""></script>`也是一样，会等到下载完，并执行完才会继续加载剩余的 html
这篇文章介绍了 上述情况的两种解决办法 async， defer

<!-- more -->

## defer

**defer 特性只适用于外部脚本，如果 script 标签没有 src 那么会忽略 defer 特性**

- 具有 defer 特性的脚本不会阻塞页面。
- 具有 defer 特性的脚本总是要等到 DOM 解析完毕，但在 DOMContentLoaded 事件之前执行。

* 如果有多个 defer script 标签，那么会按顺序执行，如下代码:
  ```html
  <script
    defer
    src="https://javascript.info/article/script-async-defer/long.js"
  /></script>
  <script
    defer
    src="https://javascript.info/article/script-async-defer/small.js"
  ></script>
  ```
  在上面的示例中，两个脚本是并行下载的。small.js 可能会先下载完成。但是，defer 特性会保证 long.js 执行完成后才会去执行 small.js

## async

**async 特性意味着脚本是完全独立的。多个 async script 之间不存在顺序执行**

- 浏览器不会因 async 脚本而阻塞（与 defer 类似）。
- 其他脚本不会等待 async 脚本加载完成，同样，async 脚本也不会等待其他脚本。
- DOMContentLoaded 和异步脚本不会彼此等待：

async 常用于独立脚本，例如计数器或广告，这些脚本的相对执行顺序无关紧要
