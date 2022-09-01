---
title: Vue2 reactivity 解析
categories: [前端]
tags: [implement, vue]
toc: true
date: 2021/2/19
---

## Vue2 响应式流程

1. Observer 初始化响应式逻辑(Object.defineProperty)，对 get 和 set 操作进行代理
2. 字符串模版 compile 阶段，触发代理后的对应属性的 get 操作，进行依赖收集，将对应属性值的 Dep 和 Watcher 相互关联
3. 当模版中的属性值发生变化，触发代理 set 操作，执行 dep.notify 触发 watcher 的视图更新操作

## 代码实现：无 compiler,手动设置 Watcher 的核心双向绑定（发布订阅）

1. Observer 为 data 的每一个属性生成 Dep（发布订阅 - 事件名）
2. 手动设置 Watcher 进行订阅操作，订阅指定的 Dep（Dep 添加 Watcher 到他的订阅者队列中）
3. Dep 更新，触发 Watcher 的通知操作(Dep.notify -> Watcher.run)

### Dep 与 Watcher 之间的关系 数据结构

```js
data: {
  msg: {
    test: "xxx";
  }
}
```

### [code](https://github.com/shancw96/tech-basis/blob/master/sourceCode_implement/Vue2/reactivity.ts)

```js
class Vue {
  $options: any
  _data: any;
  constructor(options: any) {
    this.$options = options;
    this._data = this.$options.data
    this.proxyData()
    observe(this._data)
  }
  private proxyData() {
    const proxyCore = (key: string) => {
      Object.defineProperty(this, key, {// 代理this，vue实例,将data[key]映射到实例上
        get() {
          return this._data[key]
        },
        set(newVal) {
          this._data[key] = newVal
        }
      })
    }
    Object.keys(this._data).forEach(proxyCore)
  }

  $watch(exp: string, cb: Function) {
    new Watcher(this, exp, cb)
  }
}

class Watcher {
  depsId: {[s: string]: Dep} = {}
  getters: Function
  value: any
  cb: Function
  vm: Vue
  constructor(vm: Vue, exp: string, cb: Function) {
    this.cb = cb
    this.vm = vm
    this.getters = this.createGetter(exp)
    this.value = this.get()
  }

  createGetter(exp: string) {
    if (/[^\w.$]/.test(exp)) return (_: any) => _;

    var exps = exp.split('.');

    return function(obj: any) {
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj) return;
            obj = obj[exps[i]];
        }
        return obj;
    }
  }

  get() {
    Dep.target = this
    const value = this.getters.call(this.vm, this.vm);
    Dep.target = null
    return value
  }

  run() {
    const oldVal = this.value
    const newVal = this.get()
    if(oldVal !== newVal) {
      this.cb(newVal, oldVal, this.vm)
    }
  }

  addDep(dep: Dep) {
    if(!this.depsId.hasOwnProperty(dep.id)) {
      this.depsId[dep.id] = dep
      dep.addSub(this)
    }
  }
}


class Observer {
  dep: Dep = new Dep()
  constructor(obj: any) {
    this.walk(obj)
  }
  // 为每一个key，初始化响应式
  walk(obj: any) {
    const defineReactive = (key: string, value: any) => {
      const dep = new Dep()
      let child = observe(value);
      Object.defineProperty(obj, key, {
        get() {
          if(Dep.target) {
            dep.depend()
            if(child) {
              child.dep.depend()
            }
          }
          return value // 不使用obj[key], 因为会重复触发get操作
        },
        set(newVal) {
          if(newVal === value) return;
          value = observe(newVal)
          dep.notify()
        }
      })
    }
    Object.keys(obj).forEach(key => defineReactive(key, obj[key]))
  }
}

class Dep {
  static target: Watcher | null
  id: string
  subs: Array<Watcher> = []
  constructor() {
    this.id = Math.random() + ''
  }
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  depend() {
    Dep.target && Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach(sub => sub.run())
  }
}

function observe(obj: any) {
  if(!obj || typeof obj !== 'object') {
    return obj
  }
  return new Observer(obj)
}

const app2 = new Vue({
  data: {
    msg: {
      test: '111'
    }
  }
})
app2.$watch('msg.test', (newVal: any, oldVal: any) => {
  console.log(newVal, oldVal)
})

app2.$options.data.msg.test = '222'
```
