---
title: React 开发 - react router
categories: [前端]
tags: [react]
toc: true
date: 2020/9/12
---

## 在 React Router 使用同一套 Layout，只渲染一次 Layout

对应知识点

- Route 的 path 属性 可以传入数组，进行模糊匹配
- exact 属性用于精确匹配

  | path | location.pathname | exact | matches? |
  | ---- | ----------------- | ----- | -------- |
  | /one | /one/two          | true  | no       |
  | /one | /one/two          | false | yes      |

* component 当路由匹配成功时候，渲染的组件

examples

```jsx
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

<Router>
  <Switch>
    <Route exact path={["/", "/timeLine"]}>
      <Layout>
        <Route exact path="/" component={FileLists} />
        <Route exact path="/timeLine" component={TimeLine} />
      </Layout>
    </Route>
  </Switch>
</Router>;
```

### [route 的 component 和 render 属性的区别](https://medium.com/@migcoder/difference-between-render-and-component-prop-on-react-router-v4-368ca7fedbec)

> if you provide an inline function to the component prop, you would create a new component every render. --- React Router Document

结论：

1. component={AppComponent} 和 render 形式没有区别
2. 当想要进行条件渲染的时候，使用 render 属性
   `render={() => judgement ? <AppComponent {...props}/> : <Other /> }`
   而不是 `component={() => judgement ? <AppComponent {...props}/> : <Other /> }`

example:
每当我们点击 section 标签触发 render 的时候，childComponent 都会被当做全新组件重新渲染，而不会走 diff patch 算法

```jsx
const father = () => {
  const [count, useState] = useState(0)
  return (
    <section onClick={useState(count+1)}>{count}</section>
    ...
      <Route Path componet={() =>  judgement ? <AppComponent {...props}/> : <Other />} />
    ...
  )
}
```
