---
title: 使用useReducer + useContext 代替 redux
categories: [前端]
tags: [react, redux, react-hooks]
toc: true
date: 2022/5/30
---

在 react 应用的规模不那么大的情况下，使用 useReducer 代替 redux，可以一定程度上，减小开发负担，提升开发效率。但个人不建议，在大型项目中，完全使用 useReducer 替换 redux。

这篇文章，介绍了在 typescript 下 使用 useReducer 替换 redux 的方式

<!--more-->

## 创建 Store 入口文件

最终实现的效果应该如下

`_app.tsx`

```diff
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={Theme}>
+      <Store>
         <Component {...pageProps} />
+      </Store>
    </ChakraProvider>
  );
}
```

`xxxComponent.tsx`

```diff
export function xxxComponent() {
+  const [store, dispatch] = useContext(StoreContext);
}
```

Implement:

- 通过 useReducer 来管理 store

- 通过 createContext 来提升 store，实现任意层级对 store 的访问和调用

```tsx
import { createContext, Dispatch, useReducer } from "react";

export type Store = {
  posts: PostType[];
};

export type StoreAction = { [key: string]: any };

function reducer(state: Store, { type, payload }: StoreAction): Store {
  return state;
}

export const initialState: Store = {
  posts: [],
};

export function Store({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={[store, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export const StoreContext = createContext<[Store, Dispatch<StoreAction>]>([
  initialState,
  () => {},
]);
```

## 实现 reducer

reducer 是对 store 的具体操作，参数为：

- state: 维护的 Store 对象
- action: 定义如何调用，一般为如下格式
  - type: 约定好的操作方式类型
  - payload：将要更新的数据

implement:

```diff
import { createContext, Dispatch, useReducer } from "react";

export type Store = {
  posts: PostType[];
};

export const initialState: Store = {
  posts: [],
};

+ export enum StoreActionType {
+   SET_POSTS = "SET_POSTS",
+ }


export type StoreAction = {
+  type: StoreActionType;
+  payload?: any;
}


+ export function reducer(state: Store, {type, payload}: StoreAction): Store {
+   switch (type) {
+     case StoreActionType.SET_POSTS:
+       return {
+         ...state,
+         posts: payload,
+       }
+     default:
+       return state;
+  }
+ }

export function Store({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={[store, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export const StoreContext = createContext<[Store, Dispatch<StoreAction>]>([initialState, () => {}]);
```

## 数据读写

```tsx
import { useContext } from "react";
import { StoreContext, StoreActionType } from "./store";

export function xxxComponent() {
  const [store, dispatch] = useContext(StoreContext);
  // 读取
  const tags = useMemo(() => {
    return store.posts.map((post) => post.tags);
  }, [store]);
  // 写入
  useEffect(() => {
    dispatch({ type: StoreActionType.SET_POSTS, payload: allPosts });
  }, []);
}
```

## useSelector （实现数据的访问）

对于数据的获取，可以通过`useContext(StoreContext)`；来实现，但是这种方式有个缺陷，如果我们需要对 store 进行某些聚合或过滤操作，需要写个 useMemo 在当前组件，来进行访问，如果其他组件也需要用到，就需要 cv 一份代码过去。

```tsx
import { useContext } from "react";
import { StoreContext } from "./store";
export function xxxComponent() {
  const [store, dispatch] = useContext(StoreContext);
  const tags = useMemo(() => {
    return store.posts.map((post) => post.tags);
  }, [store]);
}
```

对于上述的情况，我们可以将数据聚合或过滤等操作，预先定义好，和 store 维护在一起,

```diff
// ... more code above
export function Store({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={[store, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export const StoreContext = createContext<[Store, Dispatch<StoreAction>]>([initialState, () => {}]);


+ export const selectPosts = (state: Store) => state.posts;
+ export const selectTags = (state: Store) => state.posts.map(post => post.tags);
```

并通过自定义 hook useSelector，来实现访问的简化

`useSelector.ts`

```tsx
import { useContext } from "react";
import { StoreContext } from ".";

export function useSelector<TState, Selected>(
  selector: (state: TState) => Selected
): Selected {
  const [store, dispatch] = useContext(StoreContext);
  return selector(store as TState);
}
```

经过如上优化，页面调用可修改为

```diff
import { useContext } from "react";
import { StoreContext } from "./store";
export function xxxComponent() {
-  const [store, dispatch] = useContext(StoreContext);
-	 const tags = useMemo(() => {
-    return store.posts.map(post => post.tags)
-  }, [store])
+	 const tags = useSelector(selectTags)
}
```

> 注：上述 useSelector 应该可以使用 useMemo 进行缓存优化，待尝试

## Reference

[github 源码: next-static-blog](https://github.com/shancw96/next-static-blog/tree/master/lib/store)
