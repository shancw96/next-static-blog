---
title: React multiple entry points
categories: [前端]
tags: [react, webpack]
toc: true
date: 2022/8/11
---

如题，本文介绍了 create-react-app 生成的 react 项目，如何在不 eject webpack 的情况下，配置多入口页面。

使用场景：在原有项目结构基础上，以较小的改动，增加新的独立应用。并且此应用的依赖完全独立。

<!-- more -->

## 需要使用到的 package

- [customize-cra](https://github.com/arackaf/customize-cra): Override webpack configurations for create-react-app 2.0
- [react-app-rewire-multiple-entry](https://github.com/Derek-Hu/react-app-rewire-multiple-entry): Support Multiple Entries in Create-React-App

## 实现

[codesandbox demo](https://codesandbox.io/s/jrbsc?file=/config-overrides.js)

`config-overwrides.js`

```diff
const {
+  override,
} = require('customize-cra');
+ const multipleEntry = require('react-app-rewire-multiple-entry')([
+   // default entry
+   {
+     entry: 'src/index.tsx',
+     template: 'public/index.html',
+     outPath: '/index.html'
+   },
+   // third part entry below
+   {
+     entry: 'src/entry-points/map.tsx',
+     template: 'public/mobile-map.html',
+     outPath: '/mobile-map.html'
+   }
+ ]);


module.exports = {
   // The Webpack config to use when compiling your react app for development or production.
   webpack: override(
+    multipleEntry.addMultiEntry,
   ),
   devtool: 'eval-source-map',
};

```

配置说明：

- entry: 入口文件，默认为`src/index[.ts/tsx/js]`
- template: html 模版，默认为 public 目录下的 index.html
- outPath：通过 url 访问的方式，比如 `/mobile-map.html`，通过 url 访问方式为：`localhost:你的端口号/mobile-map.html`
