---
title: 【前端】Redux Slice 开发模式快速入门
categories: [前端]
tags: [redux]
toc: true
date: 2021/10/24
---

文章目的在于让读者快速了解基于 Redux ToolKit 的 主流 workflow 的基本使用，看完后能够知道如何在 React 中正确使用 Slice 模式进行开发。

> 文章主要翻译自 [react-boilerplate-cra-template](https://cansahin.gitbook.io/react-boilerplate-cra-template/) 官网

**下述的 slice 基本结构可通过 `yarn generate slice`自动生成！！！**

<!-- more -->

## Slice 模块的创建

### 1. 创建具体的 slice 文件夹

让我们创建一个 Slice 来管理 HomePage 的数据并命名为 HomePageSlice

空文件夹位置: `../HomePage/slice/`

### 2. 申明 state 的类型

redux 管理你的 state，所以我们必须告诉 redux，state 长什么样子，我们可以在 slice 的同级目录创建 types.ts 文件来定义类型。

`../HomePage/slice/types.ts`

### 3. 更新 State 状态

当添加新的 slice 到 App State 中，我们必须先在`types/RootState.ts`文件中声明这个 slice 类型。

由于我们使用了 `Redux-injectors`来异步加载 Redux slices，因此在构建阶段 Redux State 是没办法确定 Slice 的所有种类的。所以我们主动去在 types/RootState.ts 文件中申明

`types/RootState.ts`

```ts
import { HomepageState } from "app/.../Homepage/slice/types";

// 这里属性值必须是 optional，因为异步插入Redux state，所以slice在项目运行的时候并不是一直存在的
export interface RootState {
  homepage?: HomepageState;
}
```

### 4. 创建你自己的 slice

对于创建 slice，redux-toolkit 做了绝大部分的工作，我们只需要创建`index.ts`文件在对应的 slice 文件夹。index.ts 的主要负责如下工作

- 初始 state 数据
- Actions
- Reducers

```ts
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit"; // Importing from `utils` makes them more type-safe ✅
import { HomepageState } from "./types";

// HomePage 的初始状态
export const initialState: HomepageState = {
  username: "Initial username for my state",
};

const slice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    changeUsername(state, action: PayloadAction<string>) {
      // 在toolkit中不需要手动return，此处的修改为一个副本，toolkit会自动return 修改后的副本
      state.username = action.payload;
    },
  },
});

/**
 * `actions` 可以在任意地方触发你的状态修改
 */
export const { actions: homepageActions } = slice;
```

### 5. 将定义好的 slice 加入到 Redux Store

到目前为止，我们写了一个完整的 slice，但是如果想要使用，需要将其导入到 Root Store 中（异步）。

我们可以通过自定义一个简单的 hook，实现在任意组件中动态导入特定模块的 slice

```ts
// ... 接上述代码

/**
 *  1. 调用这个hook，会将HomePageSlice 导入到 Redux Store中
 *  2. 这个Hook 会返回一个Actions 用于在组件内部动态设置HomePageSlice的State状态
 */
export const useHomepageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
```

### 6. 使用`yarn generate slice`自动生成 slice 模块

上述模版代码，可以通过 yarn generate slice 自动生成一整套的代码

比如 login 模块的 slice 生成效果如下

```bash
Shancw~MBP > yarn generate slice

? What should it be called (automatically adds ...Slice postfix)
Shancw~MBP > login

? Where do you want it to be created?
Shancw~MBP > pages/LoginPage

? Do you want sagas for asynchronous flows? (e.g. fetching data)
Shancw~MBP > Yes

## LOG INFO
✔  ++ /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/app/pages/LoginPage/slice/index.ts
✔  ++ /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/app/pages/LoginPage/slice/selectors.ts
✔  ++ /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/app/pages/LoginPage/slice/types.ts
✔  +- /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/types/RootState.ts
✔  +- /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/types/RootState.ts
✔  ++ /Users/wushangcheng/work/photovoltaic/photovoltaic-web/src/app/pages/LoginPage/slice/saga.ts
✔  prettify
✨  Done in 18.70s.

```

## 通过 ReSelect 获取 Redux Store 的数据

一个创建 缓存 selector 函数的工具库，为 redux 深度定制，但是可以独立 redux，作为一种计算缓存使用

- Selector：计算派生属性，让 Redux 存储最小状态
- Selector 的计算效率非常高，Selector 是 pure function，无副作用，因此在传入的参数不变的情况下，不会重复计算即可返回值。
- Selector 可组合使用，他们可以作为传入参数，提供给其他的 Selector 进行派生计算

### 使用

Selector 分为简易 Selector 和复杂 Selector

#### 简易 Selector

```js
export const mySelector = (state: MyRootState) => state.someState;
```

#### 复杂 Selector

通过 reselect 的 createSelector 方法，我们可以将 多个简易 Selector 组合起来，构建出一个更加复杂的 Selector

```js
import { createSelector } from "@reduxjs/toolkit";

export const mySelector = (state: MyRootState) => state.someState;

// Here type of `someState` will be inferred ✅
const myComplexSelector = createSelector(
  mySelector,
  (someState) => someState.someNestedState
);

export { myComplexSelector };
```

#### 在组件中通过 useSelector 使用

```js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUsername } from "./slice/selectors";

export function HomePage() {
  // Type of the `username` will be inferred  ✅
  const username = useSelector(selectUsername);
  // ...
}
```

## Redux-Saga

Redux-Saga 是 Redux 中处理副作用（比如数据异步获取）的库，和 Redux-thunk 的区别在于 Redux-Saga 是声明式(Declarative)的，而 Redux-thunk 是指令式(Imperative)的。

> Declarative 和 Imperative 的区别可参考 Stackoverflow 的这篇文章
>
> [What is the difference between declarative and imperative paradigm in programming?](https://stackoverflow.com/questions/1784664/what-is-the-difference-between-declarative-and-imperative-paradigm-in-programmin)
>
> Declarative 注重做什么（宏观），而 Imperative 注重 怎么做（控制流的细节）

简而言之，Redux-Saga 更符合函数式编程的理念，无论是与 Redux 还是 React 都是非常契合的。

### 使用

Saga 通常和 Slice 一起使用。

`../slice/saga.ts`

```js
import { takeLatest, call, put, select } from "redux-saga/effects";
import { homepageActions } from ".";

// Root saga
export default function* homepageSaga() {
  // if necessary, start multiple sagas at once with `all`
  yield [
    takeLatest(actions.someAction.type, getSomething),
    takeLatest(actions.someOtherAction.type, getOtherThing),
  ];
}
```

#### 在组件中使用 saga

`redux-injectors` 提供的 `useInjectSaga` 会将上面定义好的 slice 注入到 rootSaga 中。

```js
// ... code from above

export const useHomepageSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: sliceKey, saga: homepageSaga });
  return { actions: slice.actions };
};
```

Saga 的注入提供以下几种模式

- `DAEMON` (default value) — 在组件初次 mount 的时候，执行注入。此后 rootSaga 中会一直存在

- `RESTART_ON_REMOUNT` — 当组件 mounted 之后，执行注入。当组件 unmounted 的时候执行销毁。从而实现性能优化

- `ONCE_TILL_UNMOUNT` — behaves like `RESTART_ON_REMOUNT` but never runs the saga again.

## Redux Injector

Redux Injector 可以让你动态的加载 reducers 和 saga，而不是一次性加载完。动态加载最大的优点就是性能优化，其次还有利于 Webpack 的 Code Spliting（类似于 Vue 的组件动态加载效果）

### 使用

在组件中通过 useInjectReducer 和 useInjectSaga 来动态导入特定的 reducer 和 saga

```js
import {
  useInjectSaga,
  useInjectReducer,
  SagaInjectionModes,
} from "utils/redux-injectors";
import { saga } from "./saga";
import { reducer } from ".";

export function SomeComponent() {
  useInjectReducer({ key: "SomeComponent", reducer });
  useInjectSaga({
    key: "SomeComponent",
    saga,
    mode: SagaInjectionModes.DAEMON,
  });
  // ...
}
```
