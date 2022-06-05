---
title: vue组件-拖拽，放大缩小，旋转 图片
categories: [前端]
tags: [implement]
toc: true
date: 2021/1/5
---

[codepen link](https://codesandbox.io/s/tupianfangdasuoxiaotuozhuaixuanzhuanzujian-8rymy)

## 介绍

设置图片容器的宽高，在这个范围内，可自由**拖拽**，**旋转**，**放大缩小**

### 拖拽：

#### 实现原理

根据三个鼠标事件（mousemove, mouseup, mouvedown）实现对拖拽动作的监听。
拖拽偏移量获取：通过 requestAnimationFrame + (pageX, pageY)获取毎帧的移动距离，实时的更改偏移数据。
更新被拖拽的元素的位置：将偏移量设置给 margin-left, margin-top。

#### 代码实现:

```js
// 通过pageX, paegY 差值来获取鼠标移动偏移量
// 帧同步 拖拽动画
function rafThrottle(fn) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(this, args);
      locked = false;
    });
  };
}
handleMouseDown(e) {
  if (e.button !== 0) return;
  e.preventDefault();
  const { offsetX, offsetY } = this.transform;
  const startX = e.pageX;
  const startY = e.pageY;
  this._dragHandler = rafThrottle((ev) => {
    this.transform.offsetX = offsetX + ev.pageX - startX;
    this.transform.offsetY = offsetY + ev.pageY - startY;
  });
  document.addEventListener("mousemove", this._dragHandler);
  document.addEventListener("mouseup", (ev) => {
    document.removeEventListener("mousemove", this._dragHandler);
  });
},
```

## 参考

- element-ui 2.x.x
