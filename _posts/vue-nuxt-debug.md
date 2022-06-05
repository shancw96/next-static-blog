---
title: nuxt client debug
categories: [前端]
tags: [debug, nuxt, vue]
toc: true
date: 2021/5/19
---

nuxt 项目 debug 的简单方式。client 端 debug 的方式，对原项目的侵入性最小，只需要开启 source-map 即可

<!-- more -->

## Step1 开启 webpack 的 sourcemap

nuxt.config.js

```js

extend(config, ctx) {
      // Added Line
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      // ...
}
```

## Step2

点击 "Add Configuration" ，并进行如下配置
![](/images/nuxt/debug.png)

## Step3 选择配置项目，并运行

第一步：npm run dev 正常运行项目 (此项目的地址为 http://localhost)
第二步：选择前一步的配置项，并以 debug 模式运行
![](/images/nuxt/run-debug.jpg)

## 验证

因为此方法还是借助 chrome://inspect，因此如果成功浏览器会自动开启一个独立的 http://localhost(配置的项目地址)页面。

webstorm 的 debugger 控制台显示如下
![](/images/nuxt/result.jpg)

## 使用

![](/images/nuxt/log.png)

在期望的某一行，设置如下断点，即可实现 debugger 语句的效果。
