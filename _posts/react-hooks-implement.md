---
title: React 常用Hooks介绍与实现
categories: [前端]
tags: [react]
toc: true
date: 2021/11/1
---

这篇文章介绍了 useReducer, useState, useMemo, useCallback, useRef 的实现

<!-- more -->

## 数据操作 - useReducer & useState & useRef

useState 和 useReducer 都用于组件内的状态管理，useState 由 useReducer 实现

### useReducer

useReducer 传入一个 reducer 函数来描述怎么更新状态，传入一个初始状态来描述最初的 data 值

Usage

```js
const initialState = { count: 0 };
function reducer(state, action) {
  switch (action.type) {
    case "increment": {
      return { count: state.count + 1 };
    }
    case "decrement": {
      return { count: state.count - 1 };
    }
  }
}
// functional component
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}
```

useReducer 接受三个参数，第一个是 reducer，第二个是初始状态，第三个是可选的 context

```js
function useReducer(reducer, initializerArg, initializer) {
  const slot = [];
  // state
  slot[0] =
    typeof initializer === "function"
      ? initializer(initializerArg)
      : initializerArg;
  // dispatch
  slot[1] = (action) => {
    slot[0] = reducer(slot[0], action);
  };
  return slot;
}
```

### useState

useState 通过 useReducer 实现, 传入一个初始值来描述最初的 data 值

usage

```js
// version1
const [count, setCount] = useState(0);
setCount(count + 1);
// version2 lazy evaluate
const [count, setCount] = useState(() => /*expensive evaluation*/ "someThing"));
```

```js
const reducer = (state, nextState) => {
  return typeof state === "function" ? nextState(state()) : nextState;
};
function useState(initialState) {
  if (typeof initialState === "function") {
    return useReducer(reducer, undefined, initialState);
  } else {
    return useReducer(reducer, initialState);
  }
}
```

### useRef

useRef 通过 useState 实现

```js
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue });
  return ref;
}
```

## 性能优化 - useMemo & useCallback

记忆化函数是性能优化的一种方式。通过完全存储函数的执行结果，可以避免重复计算。

一个简单的记忆化数据结构如下：

```js
function memoize(fn) {
  const cache = {};
  return function (...args) {
    if (cache[args]) {
      return cache[args];
    }
    const result = fn.apply(this, args);
    cache[args] = result;
    return result;
  };
}
```

### useMemo

useMemo 和 Vue 的 Computed 功能类似，依赖不变的情况下，可以记忆化计算结果，以提高性能, 注意：与上述 memoize 函数不一样的是**useMemo 只记录上一次的结果，不会对已有的结果进行全部缓存**。

Usage:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

useMemo 接收两个参数，计算函数和依赖数组

```js
function depsChanged(deps1, deps2) {
  if (deps1 === undefined || deps2 === undefined) return true;
  if (deps1.length !== deps2.length) return true;
  for (let i in deps1) {
    if (!Object.is(deps1[i], deps2[i])) return true;
  }
  return false;
}
function useMemo(fn, deps) {
  const slot = [];
  if (depsChanged(slot[1], deps)) {
    slot[0] = fn();
  }
  slot[1] = deps;
  return slot[0];
}
```

### useCallback

useCallback 通过 useMemo 实现，他返回一个 callback 函数，当依赖发生变化时，callback 函数会被重新计算，以提高性能

```js
function useCallback(fn, deps) {
  return useMemo(() => fn, deps);
}
```
