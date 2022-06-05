---
title: Vue3 reactivity 解析
categories: [前端]
tags: [implement, vue]
toc: true
date: 2021/2/20
---

## Vue3 响应式流程

1. 将待响应式的对象传入 reactive 函数，进行 proxy 代理，主要为 get 和 set
2. 为 effect 函数传入对应的回调方法，effect 函数会在初始化的时候执行一次，触发 proxy 的 get 操作，触发 track 操作，对当前依赖进行收集

3. 对响应式数据进行 set 操作触发 trigger 操作，执行对应的 effect 列表

数据结构：
<img src="data-structure.jpeg" />

## 代码实现

### reactive 功能

> reactive 主要是代理对象，实现响应式
> reactive: 使用 proxy 代理传入的对象

```js
function reactive(target) {
  // 1. 判断是否为对象，proxy 只能代理对象
  if (!isObject(target)) return target;
  const proxy = new Proxy(target, {
    get,
    set,
  });
  return proxy;
}
```

get 操作：主要为依赖收集，触发 track 功能

```js
let targetMap = new WeakMap();
function get(target, key, receiver) {
  const res = Reflect.get(target, key, receiver);
  // 依赖收集
  track(target, key);
  // proxy 只代理了当前层的key，如果key 对应的value 是嵌套的，那么需要进行对应的依赖收集
  if (isObject(res)) {
    reactive(res);
  }
  return res;
}
function track(object, key) {
  // 如果没有d副作用函数，则不进行依赖收集
  if (!activeEffect) {
    return;
  }
  // 有副作用函数需要将副作用函数和当前对象的具体key相互关联
  // 1.按照对象初始化分组
  let depsMap = targetMap.get(object);
  if (!depsMap) {
    targetMap.set(object, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  //2. key <-> Array<Effect>
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
```

set 操作：触发副作用函数列表

```js
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  trigger(target, key);
  return result;
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap.get(key)) {
    // 从没有被track
    return;
  }
  const effects = new Set();
  // 将所有的非 activeEffect 加入到等待执行队列中
  const add = (effectsToAdd) => {
    if (!effectsToAdd) return;
    effectsToAdd.forEach((effect) => {
      if (effect !== activeEffect) {
        // question 为什么不能是activeEffect. ans: 参考例1情况，如果不排除activeEffect，就会循环执行trigger
        effects.add(effect);
      }
    });
  };

  // 将depsMap中 key 对应的effect 复制一份，放到等待执行队列中
  if (key !== void 0) {
    add(depsMap.get(key));
  }
  //执行队列
  effects.forEach((effect) => effect());
}
```

## effect 功能

> effect 是副作用函数，与 vue2 的 Watcher 功能相同，主要为双向绑定触发后执行的函数

```js
activeEffect = undefined;
function effect(fn) {
  const effect = createReactiveEffect(fn);
  effect();
  return effect;
  function createReactiveEffect(fn) {
    const effect = function reactiveEffect() {
      try {
        activeEffect = effect;
        return fn();
      } finally {
        activeEffect = undefined;
      }
    };
    effect.deps = [];
    return effect;
  }
}
```

完整代码:[✈️ 传送门](https://github.com/shancw96/tech-basis/blob/master/sourceCode_implement/Vue3/reactivity/index.js)
