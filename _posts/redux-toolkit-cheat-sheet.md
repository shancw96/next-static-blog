---
title: Redux-toolkit cheat-sheet
categories: [前端]
tags: [redux]
toc: true
date: 2021/10/19
---

redux toolkit 简化了 配置 Redux Store 的步骤，配置方法如下

`features/counter/counterSlice.js`

```js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // redux toolkit 允许我们 直接在state上做修改逻辑。它没有真正的去修改state，因为toolkit 的内部使用Immer Library冻结了state，我们所做的操作，其实是对state的depp clone 进行的操作，最后帮我们 return
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

<!-- more -->

# Add Slice Reducers to Store(模块化)

features/counter/counterSlice.js

```js
export const counterSlice = createSlice({
  name: "xxx",
  initialState: { xxx },
  reducer: { xxx },
});
```

app/store.js

```js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

# React 组件中使用 Redux state

1. useSelector 读数据
2. useDispatch 写数据（通过 dispatch action）

操作流程（以 counterSlice 为例）：

1. 导入 counterSlice 下的 action

```js
import { decrement, increment } from "./counterSlice";
```

2. 读数据

```js
// 此处state.counter 的counter 在App/store.js中的configureStore中配置
const count = useSelector((state: RootState) => state.counter.value);
```

3. 写数据

```jsx
const dispatch = useDispatch()
// ...
<button onClick={() => dispatch(increment())}>
  Increment
</button>
<button onClick={() => dispatch(decrement())}>
  Decrement
</button>
```

# RTK Query

`RTKQuery` is a powerful data fetching and caching tool. So we using it for **asynchronous api calls**.

`Redux-Toolkit` is intended to be the standard way to write Redux logic. So we using it for **synchronous operations.**

## APIs

- createApi：全局配置，定义如何获取和转换数据，以及如果失败，该怎么解决
- fetchBaseQuery: 对 fetch API 进行了封装，以便于简化操作。一般和 createApi 搭配使用
- ApiProvider: 如果想要独立于 Redux store 使用，可以使用 ApiProvider
- setupListeners: 一个工具函数，使用后可以支持 refetchOnMount, refetchOnReconnect 功能

## 基本使用

src/Service/api.js：定义全局配置

```js
import { Config } from "@/Config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: Config.API_URL });

// 拦截器
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // here you can deal with 401 error
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
```

然后再对应的模块下，进行具体配置，并且 注入到 全局 api 的 endpoints 中
src/Service/modules/users/index.js

```js
import { api } from "../../api";
import fetchOne from "./fetchOne";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    fetchOne: fetchOne(build), // Code split of the service api call
    // You can add endpoints here
  }),
  overrideExisting: false,
});

export const { useLazyFetchOneQuery } = userApi; // generated query which will be used in Containers
```
