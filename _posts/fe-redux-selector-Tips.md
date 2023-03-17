---
title: redux-selector 使用Tips
categories: [前端]
tags: [react, redux, selector]
toc: true
date: 2023/3/17
---

## Table of Content


## Tip1: 当使用`useSelector`与mapState时要注意性能问题。

当使用useSelector 时候，每次dispatch 让state发生改变，都会导致 useSelector 重新计算。

如果使用了map, filter 返回全新的引用，
```jsx
function TodoList() {
  // ❌ WARNING: this _always_ returns a new reference, so it will _always_ re-render!
  const completedTodos = useSelector(state =>
    state.todos.map(todo => todo.completed)
  )
}
```

或者当前的计算量特别大的时候
```jsx
function ExampleComplexComponent() {
  const data = useSelector(state => {
    const initialData = state.data
    const filteredData = expensiveFiltering(initialData)
    const sortedData = expensiveSorting(filteredData)
    const transformedData = expensiveTransformation(sortedData)

    return transformedData
  })
}
```

最好使用createSelector 进行二次处理


## Tip2： `createSelector` 只会缓存上次的计算结果
createSelector 只记住最后的计算结果。如果输入改变，选择器将重新计算输出。createSelector 通过 `===`判断是否改变

## Tip3:  给selector 传递变量，动态计算

```jsx
const selectItemsByCategory = createSelector(
  [
    // Usual first input - extract value from `state`
    state => state.items,
    // Take the second arg, `category`, and forward to the output selector
    (state, category) => category
  ],
  // Output selector gets (`items, category)` as args
  (items, category) => items.filter(item => item.category === category)
)
```

此处有坑，如果多个组件同时引用了 selectItemByCategory 实例，那么其中一个组件传入任意一个category，其他组件的缓存值也会发生改变。因为是同一个示例。

因此，一定要注意，createSelector 的初始化时机