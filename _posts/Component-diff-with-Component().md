---
title: Component-tag和Component function的区别
categories: [前端]
tags: [jsx, react]
toc: true
date: 2022/5/13
---

在组件中使用 JSX 标签 和 直接调用函数有什么区别？这个视频解释了具体原因

<iframe src="https://egghead.io/lessons/egghead-fix-react-error-rendered-fewer-hooks-than-expected/embed?pl=kent-s-blog-posts-as-screencasts-eefa540c&amp;preload=false&amp;af=5236ad" allowfullscreen="" width="100%" height="400px"></iframe>

<!-- more -->

下文为具体内容描述

[CodeSandBox 复现参考此处](https://codesandbox.io/s/epic-bose-2u2f18?file=/src/App.js)

```jsx
import * as React from "react";

function Counter() {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>{count}</button>;
}

function App() {
  const [items, setItems] = React.useState([]);
  const addItem = () => setItems((i) => [...i, { id: i.length }]);
  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <div>{items.map(Counter)}</div>
      <div>
        {items.map(() => (
          <Counter />
        ))}
      </div>
    </div>
  );
}
```

## `<div>{items.map(() => <Counter />)}</div>`

理解 JSX: [React 文档：JSX IN Depth](https://reactjs.org/docs/jsx-in-depth.html)

当写 `<Component />` 等价于调用`React.createElement`，创建一个新的组件，Counter 内部的 hook 归他自己管理

## ` <div>{items.map(Counter)}</div>`

就是纯代码块，等价于如下

```jsx
<div>
  {items.map(() => {
    const [count, setCount] = React.useState(0);
    const increment = () => setCount((c) => c + 1);
    return <button onClick={increment}>{count}</button>;
  })}
</div>
```

这块代码违背了 hook 写法规范: [Only Call Hooks at the Top Level](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level)

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls. (If you’re curious, we’ll explain this in depth [below](https://reactjs.org/docs/hooks-rules.html#explanation).)
