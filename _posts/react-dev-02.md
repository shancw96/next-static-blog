---
title: React 开发 - useEffect,useState
categories: [前端]
tags: [react]
toc: true
date: 2020/9/11
---

## useState

```js
// 声明一个叫 “count” 的 state 变量
const [count, setCount] = useState(0);
console.log(count); // -> 0
setCount(count + 1);
console.log(count); // -> 1
```

## useEffect

`useEffect(fn, [dependence, .., dependence ])`

- **useEffect 接收两个参数，第一个为副作用函数，第二个为 hook 的依赖**，只有当依赖发生改变的时候，才会触发执行
- **useEffect 在初始化的时候会执行一次**，如果依赖为空，便不会再次执行，这实现了类似 mounted 的效果

* **useEffect 返回值必须是一个 cleanup 函数**，用于清除 Effect，这意味着下面的代码结构是错误的

  ```js
  useEffect(async () => {
    await fetchSomething();
  });
  ```

  <u>每一个带有 async 标注的函数，都会返回一个 Promise</u>，如果代码结构写成上面的这种将会抛出错误

  ```js
  Warning: useEffect function must return a cleanup function or nothing.
  Promises and useEffect(async () => ...) are not supported,
  but you can call an async function inside an effect
  ```

* 什么是 useEffect 的 cleanup
  cleanUp 设计来 Undo 一些 Effect 如订阅

```js
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

- Render 的某一刻的状态是固定的，相当于快照
  **原理**

  ```js
  function sayHi(person) {
    const name = person.name;
    setTimeout(() => {
      alert("Hello, " + name);
    }, 3000);
  }

  let someone = { name: "Dan" };
  sayHi(someone);

  someone = { name: "Yuzhi" };
  sayHi(someone);

  someone = { name: "Dominic" };
  sayHi(someone);
  ```
