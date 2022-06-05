---
title: React 开发 - redux hook
categories: [前端]
tags: [react]
toc: true
date: 2020/9/12
---

此文章只涉及入门，不涉及高阶用法，等框架熟悉后再学习高阶

## 使用 redux 提供的 hook 来替代繁琐的 connect 包裹

### [useSelector()](https://react-redux.js.org/api/hooks#useselector) 获取 state

> useSelector 等价于 mapStateToProps + connect

example: 导入子模块的 state

```js
import { useSelector } from "react-redux";
import { IProductState, IStateType } from "~/store/models/root.interface";

const Home: React.FC = () => {
  const products: IProductState = useSelector((state: IStateType) => state.products);
  return (...)
}
```

### [useDispatch()](https://react-redux.js.org/api/hooks#usedispatch) 更改值

example

```js
// 1.导入将要修改的state 对应的action
import { updateCurrentPath } from "~/store/actions/root.actions";
// 2. 导入dispatch hook
import { useDispatch } from "react-redux";
// 3. 使用dispatch hook 执行对应的action

dispatch(updateCurrentPath("home", ""));
```

tips: root.actions

```js
export const UPDATE_CURRENT_PATH: string = "UPDATE_CURRENT_PATH";

export function updateCurrentPath(
  area: string,
  subArea: string
): IUpdateCurrentPathActionType {
  return { type: UPDATE_CURRENT_PATH, area: area, subArea: subArea };
}
```

### useStore() 获取整个 redux store 的 reference 引用，不推荐直接再组件中使用

```js
import React from "react";
import { useStore } from "react-redux";

export const CounterComponent = ({ value }) => {
  const store = useStore();

  // EXAMPLE ONLY! Do not do this in a real app.
  // The component will not automatically update if the store state changes
  return <div>{store.getState()}</div>;
};
```

## 总结

- redux hooks 是在 connect 之后发布的，属于较新的版本，可以简化代码
- redux hooks 提供了读写两种对应的 hooks
- useSelector 用于读 state， 可以读取某一个模块下的 state
- useDispatch 用于写 state，一般通过调用定义的 actions 来进行写
- useStore 也是读 state，它权限最大，获取的是整个 state 的 ref，不推荐直接使用
