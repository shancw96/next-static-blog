---
title: 【前端】使用useCallback 和 React.memo 优化性能
categories: [前端]
tags: [react]
toc: true
date: 2021/10/29
---

[blog ref](<https://blog.shancw.net/2021/10/29/react-UseCallback%20%E5%92%8C%20React.memo()%20%E4%BD%BF%E7%94%A8%E4%BB%8B%E7%BB%8D/>)
useCallback 和 React.memo 都是用空间换时间的缓存优化方式。这篇文章介绍了 useCallback 和 React.memo 的使用场景和简单入门介绍

<!-- more -->

## useCallback

### 理解函数相等检查

在深入了解 useCallback 的使用之前，让我们一起深入了解 useCallback 解决的问题 - 函数相等性检测

函数在 Javascript 中作为 一等公民存在，这意味着函数就是一个普通对象。函数对象可以被其他的函数返回，比较。

对于如下函数 `factory`，返回了一个累加函数

```js
function factory() {
  return (a, b) => a + b;
}
const sum1 = factory();
const sum2 = factory();
sum1(1, 2); // => 3
sum2(1, 2); // => 3
sum1 === sum2; // => false
sum1 === sum1; // => true
```

**函数和其他的对象一样，当比较的时候，通过判断指针是否指向同一个内存地址来决定是否相等。**

换句话说，函数只等于他自身，因此上述代码 `sum1 === sum2`输出 false

### 为什么要使用 useCallback

对于如下 MyComponent 组件，handleClick 函数在每次 MyComponent 组件渲染的时候，都会重新创建。

```js
function MyComponent() {
  // handleClick 函数在每次MyComponent 重新render的时候都会重新创建
  const handleClick = () => {
    console.log("Clicked!");
  };
  // ...
}
```

inline-function 的创建，对性能消耗是很小的。因此在 MyComponent 重新渲染的时候，handleClick 方法重新创建并没有什么大的影响。

_A few inline functions per component are acceptable._

但是有些情况，则需要保证 inline- function 在不同的 render 阶段始终是同一个，比如：

- 使用 React.memo()组件包裹的组件，接受了此 inline-function 作为参数
- **当使用 此 inline-function 作为其他 hook 的依赖，比如 `useEffect(..., [callback])`**
- 当使用 debounce 或者 throttle 的时候

对于这些情况，当我们传入相同的依赖，在组件重新 render 后，返回的函数是之前的那个（记忆化）

### 正确的使用案例

假设你有个组件，渲染了长列表,因为 MyBigList 的 list 列表可能上万，因此需要使用 React.memo 对 MyBigList 进行优化处理。

```js
import useSearch from "./fetch-items";
function MyBigList({ term, onItemClick }) {
  const items = useSearch(term);
  const map = (item) => <div onClick={onItemClick}>{item}</div>;
  return <div>{items.map(map)}</div>;
}
export default React.memo(MyBigList);
```

现在 MyBigList 的父组件 MyParent 提供了一个点击监听事件，用于处理 MyBigList 的点击

```js
import { useCallback } from "react";
export function MyParent({ term }) {
  const onItemClick = (event) => {
    console.log("You clicked ", event.currentTarget);
  };
  return <MyBigList term={term} onItemClick={onItemClick} />;
}
```

这是我们没有使用 useCallback 时候的状态，现在分析下存在的问题：

MyParent 每次 render，都会生成新的 onItemClick，这个 onItemClick 作为 prop 传入了 React.memo(MyBigList)。React.memo 因为 onItemClick 每次都是全新的，因此会重新渲染，并进行缓存。这会导致严重的性能问题及内存消耗

这时候 useCallback 就出场了 onItemClick 使用 useCallback 进行记忆化，只有 term 改变才会生成新的 onItemClick

```js
import { useCallback } from "react";
export function MyParent({ term }) {
  const onItemClick = useCallback(
    (event) => {
      console.log("You clicked ", event.currentTarget);
    },
    [term]
  );
  return <MyBigList term={term} onItemClick={onItemClick} />;
}
```

## React.memo

当决定更新 DOM，React 首先会 render 你的组件，然后对前后对比 render 结果差异，如果不同，那么 React 就会更新 DOM

render 结果的比较是很快的。但是你在某些情况下，还可以优化这个过程。

当组件被 React.memo()包裹，react render 并缓存解决。在下次 render 前，如果传入的 props 相同，那么 React 则会复用缓存的结果，并直接跳过下次 render。

如下组件 Movie 被`React.memo()`包裹

```js
export function Movie({ title, releaseDate }) {
  return (
    <div>
      <div>Movie title: {title}</div>
      <div>Release date: {releaseDate}</div>
    </div>
  );
}
export const MemoizedMovie = React.memo(Movie);
```

React.memo(Movie) 返回一个新的记忆化组件 MemoizedMovie

这个组件输出和 Movie 组件相同，但是它的 render 结果会被缓存。当传入的 title 和 releaseDate 参数相同，那么 React 就会复用已有的 render 结果

```js
// First render - MemoizedMovie IS INVOKED.
<MemoizedMovie
  title="Heat"
  releaseDate="December 15, 1995"
/>
// Second render - MemoizedMovie IS NOT INVOKED.
<MemoizedMovie
  title="Heat"
  releaseDate="December 15, 1995"
/>
```

[在线 Demo 演示](https://codesandbox.io/s/react-memo-demo-c9dx1)

### 自定义 props 相等性检查

默认情况下，React.memo 对 props 进行浅比较，如果 props 是 object，那么会对 object 的第一层 key 进行相等性检查。

[React props 比较的默认方式代码](https://github.com/facebook/react/blob/v16.8.6/packages/shared/shallowEqual.js)

如果我们想自定义它的监测方式，可以对 memo 传入第二个参数

```js
React.memo(Component, [areEqual(prevProps, nextProps)]);
```

`areEqual(prevProps, nextProps)`返回一个 boolean

```js
function moviePropsAreEqual(prevMovie, nextMovie) {
  return (
    prevMovie.title === nextMovie.title &&
    prevMovie.releaseDate === nextMovie.releaseDate
  );
}
const MemoizedMovie2 = React.memo(Movie, moviePropsAreEqual);
```
