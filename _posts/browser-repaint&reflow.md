---
title: DOM 重绘 重流
categories: [前端]
tags: [dom, repaint, reflow]
toc: true
date: 2022/9/7
---

这篇文章是[dom_performance_reflow_repaint](https://gist.github.com/faressoft/36cdd64faae21ed22948b458e6bf04d5)的部分翻译，介绍了重绘与重流的相关知识。

![Rendering](https://pic.limiaomiao.site:8443/public/uploads/68747470733a2f2f692e696d6775722e636f6d2f64384b785a53772e706e67.png)

重绘：某些元素的外观被改变，例如：元素的填充颜色

重排：重新生成布局，重新排列元素。

<!--more-->

## 浏览器是如何渲染 document 的

- 从服务端接收到数据（字节）
- 解析并转换成 token (<, TagName, Attribute, AttributeValue, >).
- 将 token 转换成 node 节点
- 将 node 转换成 DOM 树
- 根据 CSS 规则 构建 CSSOM 树
- 将 CSSOM 树和 DOM 树结合成 渲染树（RenderTree）
  - 计算哪些元素是可见的，以及它们的计算样式。
  - 从上到下遍历 DOM 树
  - 非可见的元素，比如`meta`，`script`，`link`以及`display:none`将会从渲染树中剔除
  - 对于可见元素，找到 CSSOM 树上匹配的 css 规则应用在元素上
- 重排 Reflow：计算所有可见元素的布局（position, size）
- 重绘 Repaint: 将 像素（pixels）渲染在屏幕上

## 重排与重绘

- 重绘 repaint

  - 当元素的 visible 发生改变的时候
  - 触发例子：opacity, color, background-color, visibility

- 重排 reflow

  - 页面初始渲染，这是开销最大的一次重排

  - 添加/删除可见的 DOM 元素

  - 元素改变

    - 改变元素位置

    - 改变元素尺寸，比如边距、填充、边框、宽度和高度等

    - 改变元素内容，比如文字数量，图片大小等

    - 改变元素字体大小

  - 改变浏览器窗口尺寸，比如 resize 事件发生时

  - 激活 CSS 伪类（例如：`:hover`）

  - 设置 style 属性的值，因为通过设置 style 属性改变结点样式的话，每一次设置都会触发一次 reflow

  - 查询某些属性或调用某些计算方法：offsetWidth, offsetHeight

### 重排优化方案

https://juejin.cn/post/6844904083212468238#heading-10

- 样式集中改变
- 读写操作分离
- 将 DOM 离线（display: none,创建 dom 碎片）
- 使用 absolute 或 fixed 脱离文档流
- 优化动画
