---
title: nextTick深入理解
categories: [前端]
tags: [vue, vue-nextTick]
toc: true
date: 2021/2/22
---

## nextTick 在项目中的使用？

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它

```jsx
...
'<div>{{ message }}</div>'
...
import { createApp, nextTick } from "vue";
const app = createApp({
  setup() {
    const message = ref("Hello!");
    const changeMessage = async (newMessage) => {
      message.value = newMessage;
      await nextTick();
      console.log("Now DOM is updated");
    };
    return {
      message,
    };
  },
});
```

## nextTick 的原理

**浏览器只会在一个 task 结束的最后进行一次渲染**, 浏览器的 eventloop 如下图所示:
<img src="eventloop.jpeg">

图中可知，执行顺序为：`microTask` > `UI render` > `macroTask`

nextTick 获取到的是 更新后的 DOM, **使用 setTimeout(function) 能实现 nextTick 的效果**。但是 setTimeout 实现 nextTick 有个问题，**两个 setTimeout 的最小间隔约为 4ms**，这就强行限制了两次渲染之间的最小时间差。

**Vue 的 nextTick 通过 Promise(microTask)实现**: 因为有虚拟 DOM，所以即使在 UI 渲染前，也能够实现同样的效果，且不会限制两次渲染时间

在 Vue2.5 以后的源码中, **Vue nextTick 的降级策略为: microTask(Promise) > macroTask(setImmediate) > macroTask(MessageChannel) > macroTask(setTimeout)**

## 模拟实现 nextTick

`setTimeout(f)`

### setTimeout(f) 还有个更加广泛的用途：切分 cpu 密集型任务.

假设有个任务，从 1 数到 100000000，JS 如果直接执行一个 for loop 或者 while loop 那么很大可能会直接显示：当前页面未响应。

```js
let i = 0;

let start = Date.now();

function count() {
  // do a piece of the heavy job (*)
  do {
    i++;
  } while (i % 1e6 != 0);

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + "ms");
  } else {
    setTimeout(count); // schedule the new call (**)
  }
}

count();
```

## 参考：

- [Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
- [全面解析 Vue.nextTick 实现原理](https://juejin.cn/post/6844903590293684231#heading-3)
