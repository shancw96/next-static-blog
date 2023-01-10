---
title: 设计模式 - 观察者
categories: [基础]
tags: [design-pattern, observer]
toc: true
date: 2022/9/1
---

观察者模式：一个名叫 subject（主题）的对象，维护了很多属于它的依赖，这些依赖叫 observer。当 subject 改变的时候，会自动通知 oberserver 告诉他们 subject 值发生了改变。

![W3sDesign_Observer_Design_Pattern_UML](https://pic.limiaomiao.site:8443/public/uploads/W3sDesign_Observer_Design_Pattern_UML.jpeg)

UML 时序图介绍：Observer1 和 Observer2 在 Subject 上调用 attach(this)来注册他们自身。如果 Subject1 的数据发生改变，Subject1 会调用自身的 notify()方法。notify 方法调用了 Observer1 和 Observer2 上的 update()方法

<!--more-->

Subject

- notify 方法会在 setState 时候自动触发，调用 Observer 的 update
- attach 方法会在 observer 创建的时候，传入当前 subject 实例，并调用 subject.attach(this)，从而实现关联

```ts
class Subject {
  deps: Observer[];
  state: string;

  constructor() {
    this.deps = [];
    this.state = "";
  }

  notify() {
    this.deps.forEach((dep) => dep.update(this.state));
  }

  setState(payload: string) {
    this.state = payload;
    this.notify();
  }

  attach(ob: Observer) {
    this.deps.push(ob);
  }
}
```

Observer

```ts
class Observer {
  subject: Subject;
  constructor(sub: Subject) {
    sub.attach(this);
    this.subject = sub;
  }

  update(val: any) {
    console.log(this.id);
    console.log(val);
  }
}
```

使用：

```ts
const subject = new Subject();

const ob1 = new Observer(subject);
const ob2 = new Observer(subject);
const ob3 = new Observer(subject);
const ob4 = new Observer(subject);
```
