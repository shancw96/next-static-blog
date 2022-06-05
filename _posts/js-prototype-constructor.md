---
title: 理清`constructor`，`[[prototype]]`, `prototype` 之间的区别
categories: [前端]
tags: [js]
toc: true
date: 2021/1/13
---

## 引入问题：下面两段代码输出结果为啥不同

```js
function MyConstructor() {}
const myObject = new MyConstructor();
myObject.constructor == MyConstructor; // true
```

```js
function MyConstructor() {}
MyConstructor.prototype = {};
const myObject = new MyConstructor();
myObject.constructor == MyConstructor; // false
```

## 前置知识

### Objects 和 methods

js 中的对象就是一堆可以读写的具名属性，**js 中没有 class**，函数（function）在 JS 中是一等公民（和普通变量等价），JS 中的方法（method）仅仅是一个指定了上下文的函数。

### Prototypes

- 对象的内置的属性`Prototype`，下文使用`[[Prototype]]`作为替代。
- 注意`obj.prototype`和对象的`[[Prototype]]`是两个不同的概念。
- js 本身并没有提供直接获取`[[Prototype]]`的方法，但绝大多数的现代浏览器支持通过 `__proto__`对`[[Prototype]]`进行获取和修改。

### `[[Get]]`

当获取对象的某个属性，比如 obj.a 会触发`[[Get]]`操作。对于默认情况下的 `[[Get]]`(没有被 Proxy 代理)会进行如下步骤：

- 检查对象本身是否有这个属性，如果有就使用
- 如果 a 不再 obj 中，那么就会检查 obj 的`[[Prototype]]`上是否存在 a 属性
  - 如果存在则返回
  - 不存在,继续检查 obj 的`[[Prototype]]`的`[[Prototype]]`,递归执行
- `[[Prototype]]`的尽头是 `Object.prototype`，如果还是没有找到则会返回 undefined，值得一提的是，很多全局的方法就是通过这种方式获取的，如 `valueOf, toString, hasOwnProperty`

### `[[Set]]`

对于`myObject.foo = 'bar'`

- foo 存在于 myObject.foo，那么只会进行修改。
- **myObject 上不存在 foo**, 就会在[[Prototype]]链上进行查找，类似[[Get]]操作。
  - [[Prototype]]链上没有找到 foo，则新添加一个 foo 属性
  - [[Prototype]]链上存在 foo
    - [[Prototype]]**链上的 foo writable 为 true：在 myObject 中添加一个新的属性 foo**
    - [[Prototype]]**链上的 foo writable 为 false：严格模式报错，非严格模式忽略**
    - [[Prototype]]链上的 foo 为 setter，直接调用这个 setter

## 进入正题，逐行分析文初提出的问题的代码

> 图示：椭圆形代表对象，箭头代表引用了其他对象的属性。[[Prototype]]链用绿色标出

### #1: 定义构造函数

```js
function MyConstructor() {}
```

<img src="define-constructor.png" alt="define-constructor">

- `MyConstructor.prototype`是一个自动创建的对象，这个对象又有一个 constructor 属性指回 MyConstructor。需要注意的是，**只有函数对象才拥有 prototype 属性**,因此，只有函数对象才拥有 constructor 属性
- 上图的 MyConstructor 的[[Prototype]]指向 Function.prototype, 而不是 MyConstructor.prototype。
- Object.prototype 是[[Prototype]]链的终点，而 Object.prototype 的[[Prototype]]则是 null
  参考：

* [Constructors Considered Mildly Confusing](https://zeekat.nl/articles/constructors-considered-mildly-confusing.html#sec-8-3)
* [you-dont-know-js](https://github.com/getify/You-Dont-Know-JS) 第五章 Prototype

### #2: 为 MyConstructor 分配新的 prototype 属性

```js
MyConstructor.prototype = {};
```

<img src="assign-new-prototype.png" alt="assign-new-prototype.png">

将 MyConstructor 的 prototype 设置为空对象`{}`，这个对象没有 constructor 属性

### #3: 调用构造函数生成新的对象

```js
const myObject = new MyConstructor();
```

由于 new 操作会将 myObj 的[[Prototype]]设置为 MyConstructor.prototype，而 MyConstructor.prototype 为一个普通空对象，因此 MyConstructor 的[[Prototype]]就和 Object.prototype 关联了起来

<img src="create-obj.png" alt="调用构造函数生成新的对象">

因此`myObj.constructor`调用的时候，会按照图中绿色的原型链进行查找，最终找到了`Object.prototype.constructor`
