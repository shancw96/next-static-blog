---
title: 前端面试
categories: [前端]
tags: [interview]
toc: true
date: 2022/3/11
top: 1
---

上次更新时间：2022/4/13

# 资源

## 算法

- [Fucking Algorithm](https://github.com/labuladong/fucking-algorithm) 105k star

## 基础

- [千古前端](https://web.qianguyihao.com/)

  19.2k star，注重基础知识点

- [hit-alibaba](https://hit-alibaba.github.io/interview/basic/) 4.9k star

  计算机网络了解个大概

## 框架学习

- [【vue-family-mindmap】 vue2 的 源码思维导图](https://github.com/biaochenxuying/vue-family-mindmap)

## 前端面试

- [【推荐】yck：前端面试之道](https://juejin.cn/book/6844733763675488269?scrollMenuIndex=1) 17.5k star
- [木易杨前端进阶](https://muyiy.cn/question/)

<!-- more -->

## JS

### 原始(Primitive)类型有哪些

string, number, boolean, **null**，**undefined**， **symbol**

#### **简单介绍下 symbol？**

- 中文-符号，es6 新增
- 用途：确保对象属性使用唯一标识符，不会发生属性冲突的危险

#### **null 和 undefined 的区别？**

- undefined 介绍
  - undefined：当使用 var 或者 let 声明变量但没有初始化时，就相当于给变量赋予了 undefined 【红宝书】
  - **永远不要故意给某个变量设置为 undefined，undefined 主要用于比较**。
  - 增加 undefined 值的目的就是正式明确空对象指针（null）和未初始化变量的区别
- null 介绍
  - 从逻辑上讲，null 值表示一个空对象指针，所以`typeof null === object`
  - 在定义将来要保存对象值的变量时，建议使用 null 来初始化。

### 对象 (Object)

#### 什么是对象？

- 一组数据和功能的集合
- Object 是派生其他对象的基类
- 每一个 Object 都有如下几个属性和方法
  - constructor 用于创造当前对象的构造函数
  - method：hasOwnProperity(properityName) 判断当前对象，不包括原型链，是否存在指定的属性名称
  - method：isPrototypeof（object）是否是某个对象的原型
  - method：properityIsEnumerable（properityName）判断对象上的某个属性是否可以遍历
  - method：toLocalString（）
  - method：toString（）
  - valueOf：返回对象的字符串，数值或者布尔值标识，通常与 toString 返回值相同

#### array function Map Set 属于对象吗？

- 属于，从 Object 基类派生而来

### 什么是原型

#### .prototype 属性

每个函数都会创建一个 prototype 属性，这个属性是一个对象。定义在它上面的属性或者方法可以被共享。比如：

```js
function Person() {} // 自动创建Person.prototype属性
Person.prototype.color = "yellow";
Person.prototype.food = "rice";
const shancw = new Person();
shancw.color === "yellow"; // -> true
```

- 我们创建 Person 构造函数，他自动创建 prototype 属性。

- 我们对 Person 的 prototype 增加一些属性，它的实例 shancw 可以获取到 prototype 的共享。因此 shancw.color === 'yellow'

  > 为什么 shancw 实例能够获取到 prototype 原型对象？背后是怎么工作的？
  >
  > 参考文章：[理清`constructor`，`【【prototype】】`, `prototype` 之间的区别](https://blog.shancw.net/2021/01/13/js-prototype-constructor/)
  >
  > `[[Get]]`
  >
  > 当获取对象的某个属性，比如 obj.a 会触发`[[Get]]`操作。对于默认情况下的 `[[Get]]`(没有被 Proxy 代理)会进行如下步骤：
  >
  > - 检查对象本身是否有这个属性，如果有就使用
  >
  > - 如果 a 不再 obj 中，那么就会检查 obj 的 [[prototype]]
  >
  >   上是否存在 a 属性
  >
  >   - 如果存在则返回
  >   - 不存在,继续检查 obj 的`[[Prototype]]`的`[[Prototype]]`,递归执行
  >
  > - `[[Prototype]]`的尽头是 `Object.prototype`，如果还是没有找到则会返回 undefined，值得一提的是，很多全局的方法就是通过这种方式获取的，如 `valueOf, toString, hasOwnProperty`

此时如果我们对 Person 的 prototype 进行修改，shancw.color 也会实时发生变化，因此不能将 js 构造函数的 new 实例和 java 中 class 生成的实例相提并论

```js
function Person() {} // 自动创建Person.prototype属性
Person.prototype.color = "yellow";
Person.prototype.food = "rice";
const shancw = new Person();
shancw.color === "yellow"; // -> true
Person.prototype.color = "black";
shancw.color === "black"; // -> true
```

默认情况下，.prototype 原型对象会自动获得 constructor，指向构造函数。如上述例子，Person.prototype.constructor === Person。

<img src="http://serial.limiaomiao.site:8089/public/uploads/image-20220420193933397.png" alt="image-20220420193933397"  />

#### [[prototype]] 属性

每次调用构造函数创建一个新的实例，这个实例内部的[[prototype]]指针就会被赋值给构造函数的原型对象。这个属性是内置属性，外部无法获取。但是 Firefox,Safari,Chrome 会在每个对象上暴露 `__proto__`，通过这个属性，可以访问到对象的原型

![image-20220420200850513](https://pic.limiaomiao.site:8443/public/uploads/image-20220420200850513.png)

### 执行上下文和作用域

> 执行上下文，后续简称为上下文

#### 什么是 执行上下文（Evaluation Context） ：

用来评估和执行 js 代码的环境（an execution context is an abstract concept of an environment where the Javascript code is evaluated and executed. ）；

包括了所有的可访问数据，以及描述了可执行的行为

#### 执行上下文的分类：

- 全局上下文：根据宿主环境的不同，表示全局上下文的对象也不一样，比如在浏览器中是 window
- 函数上下文：每个函数调用都有自己的上下文。
- Eval Function 上下文：开发者几乎用不到，暂不讨论

#### 详细说说函数上下文

当代码执行流进入函数时，函数的上下文被推到一个上下文栈上，当执行完毕后，再从这个上下文栈中弹出，讲控制权交给执行上下文。上下文中的代码在执行的时候，会创建一个**作用域链（scope chain）**。以代码为例：

```JS
function firstLevel() {
    const prop = 1;
    const a = 1;
    function secondLevel() {
        const prop = 2;
        const b = 2;
        function thirdLevel() {
            const prop = 3;
            const c = 3;
            console.log(a);
        }
    }
}
```

当我们代码执行到 thirdLevel 时候，创建的作用域链如下：

```JS
context（third level）- context(second level) - context(first level)
```

此时，当执行到`console.log(a)`,对 a 变量的查找，会沿作用域链逐层搜索，最终在 context（first level）找到。

#### 闭包是什么？

那么什么是闭包呢？还是以上面例子进行改造

```JS
function firstLevel() {
    const prop = 1;
    const a = 1;
    function secondLevel() {
        const prop = 2;
        const b = 2;
        function thirdLevel() {
            const prop = 3;
            const c = 3;
            console.log(a);
            return function fourthLevel() {
                console.log(a, b, c);
            }
        }
    }
}

const closureExample = firstLevel();
```

看代码，直白解释：

如果有个函数 A，他的 return 结果是另外一个函数 B，此时我们通过一个变量，接收函数 A 的执行结果，函数 B。那么这就生成了一个闭包。

对闭包深入理解：

```JS
function A() {
    ....
    const a = xx;
    const b = xx;
    const c = xx;
    return function B() {
        // 访问a，b，c
    }
}

const closure = A(); // 带着特定作用域链的函数B
```

闭包保存了原本函数 A 在执行完毕后，应该销毁的作用域链。使得即使在 A 结束后，依然可以通过函数 B 对它的内部变量进行访问。

文章参考：

- 红宝书 - 第三章
- [Understanding Execution Context and Execution Stack in Javascript](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)

### 什么是代理和反射

ECMAScript 6 新增的代理和反射为开发者提供了拦截并向基本操作嵌入额外行为的能力。

#### proxy

```js
const handler = {
  get(trapTarget, property, receiver) {
    console.log(trapTarget === target);
    console.log(property);
    console.log(receiver === proxy);
    return trapTarget[property];
  },
};
const proxy = new Proxy(target, handler);
```

#### Reflect

所有捕获器都可以基于自己的参数重建原始操作, 但并非所有捕获器行为都像 get()那么简单,因此，通过手写代码入法炮制不现实。全局 Reflect 对象就是用来解决这个痛病，上述 handler 通过 Reflect 实现如下

```js
const proxy = new Proxy(target, {
  get: Reflect.get,
});
```

如果我们只是想要创建一个可以捕获所有方法的空代理，通过 Reflect，也可以轻松实现

```js
const proxy = new Proxy(target, Reflect);
```

### Iteration & Generation

#### 请介绍下 Generator 函数

Generator 函数可以在内部暂停和恢复代码的执行

##### 声明方式

```js
function* generator() {}
const generator = function* () {};
let foo = {
  *generator() {},
};
class Foo {
  *generator() {}
  static *genrator2() {}
}
```

##### 生成器对象

调用生成器函数，会生成一个**生成器对象**。生成器对象一开始处于暂停执行状态（suspended)。生成器对象实现了 Iterator 接口，因此具有 next 方法。

```js
function* generatorExample() {}

const generatorObj = generatorExample(); // generatorFn(<suspended>)
console.log(generatorObj.next); // f next() {}
```

- next

  迭代器 API 使用 next()方法在可迭代对象中遍历数据。每次成功调用 next(),都会返回一个 IteratorResult 对象,其中包含迭代器返回的下一个值。若不调用 next(),则无法知道迭代器的当前位置

  - IteratorResult 对象

    此对象包括两个属性：done 和 value

    - done：boolean 值，表示是否还可以再次调用 next
    - value：可迭代对象的下一个值

- 函数体为空的生成器函数中间不会停留,调用一次 next()就会让生成器到达 done: true 状态

##### yield 中断执行

通过 return 关键字退出的生成器函数会处于 done: true 状态。

```js
function* generator() {
  yield "foo";
  yield "bar";
  return "baz";
}

const generatorObj = generator();
generatorObj.next(); // {done: false, value: 'foo'}
geneatorObj.next(); // {done: false, value: 'bar'}
generatorObj.enxt(); // {ddone: true, value: 'baz'}
```

生成器函数内部的执行流程会针对每个生成器对象区分作用域。在一个生成器对象上调用 next() 不会影响其他生成器

```js
function* generator() {
  yield "foo";
  yield "bar";
  return "baz";
}

const generatorObj = generator();
const generatorObj2 = generator();
generatorObj.next(); // {done: false, value: 'foo'}
geneatorObj2.next(); // {done: false, value: 'foo'}
```

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
//

console.log(it.next()); // -> x =5, 5 +1 = 6
console.log(it.next(12)); // -> input 12， y = 12,  12*2/3 = 8
console.log(it.next(13)); // -> input 13, z = 13, x+y+z = 13 + 8 +6
// 错误
console.log(it.next()); // -> 12
console.log(it.next(12)); // -> 4
console.log(it.next(13)); // -> 5 + 12 + 4
```

- 首先 `Generator` 函数调用和普通函数不同，它会返回一个迭代器
- 当执行第一次 `next` 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
- 当执行第二次 `next` 时，传入的参数等于上一个 `yield` 的返回值，如果你不传参，`yield` 永远返回 `undefined`。此时 `let y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`
- 当执行第三次 `next` 时，传入的参数会传递给 `z`，所以 `z = 13, x = 5, y = 24`，相加等于 `42`

generator 实现 async await 效果

```js
function* fetch() {
  yield ajax(url, () => {});
  yield ajax(url1, () => {});
  yield ajax(url2, () => {});
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

### 【基础】Promise 相关

- Promise 是什么，用来解决什么问题

  解决异步操作的一个方案

- 有哪些状态
  - pending
  - fulfilled
  - rejected

## 【基础】Array 的常用方法

- 归类

  - pop

  - shift

  - unshift

  - indexOf

  - splice

  - slice

  - reduce

  - map

- map 和 reduce 的使用场景？简单概括 reduce 和 map 的用处

## 【进阶】EventLoop

- Promise.resolve().then 和 setTimout(xx, 0) delay 为 0 哪个快？为什么？

  - Promise 属于 microTask, setTimeout 属于 macroTask。

  - 执行顺序为：`microTask` > `UI render` > `macroTask`
  - **两个 setTimeout 的最小间隔约为 4ms**，

- 假设有个函数，需要大量计算，比如从 1 数到 100000000，JS 如果直接执行一个 for loop 或者 while loop 那么很大可能会直接显示：当前页面未响应。我们要怎么样去优化用户的体验

  - setTimeout 切分
  - web workers: 给 JS 创造多线程运行环境，允许主线程创建 worker 线程，分配任务给后者，主线程运行的同时 worker 线程也在运行，相互不干扰，在 worker 线程运行结束后把结果返回给主线程。

## Vue

- key

  1. key 的作用主要是为了高效的更新虚拟 DOM，其原理是 vue 在 patch 过程中通过 key 可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，减少 DOM 操作量，提高性能。
  2. 所以用 index 来做 key 会出现复用错的问题，还可以在列表更新时引发一些隐蔽的 bug。key 的作用很简单，就是为了复用。正是因为会复用，比如[10,11,12]，对应 key 是 0,1,2，如果我把 11 这项删了，就是[10,12]，key 是 0,1，这是发现 11 对应的 key 和 12 对应的 key 都是 1

- v-model

  - v-model 一句话概括：实现数据的双向绑定

  - 和 v-bind 区别？基于 v-bind 实现

  - 如何实现一个 v-model 语法糖： 使用 v-bind 获取 value v-on 绑定 input 触发事件

- v-if 和 v-show

  - **v-if** 也是惰性的：如果在初始渲染时条件为假，则什么也不做——在条件第一次变为真时才开始局部编译（编译会被缓存起来）。

  - 相比之下，**v-show** 简单得多——元素始终被编译并保留，只是简单地基于 CSS 切换。

- 通信方式

  - $emit
  - props
  - provide inject 父->子 非响应式
  - vuex
  - eventBus 无约束，混乱，不推荐使用

- vue2 和 vue3 在响应式实现上的区别

  - Object.defineProperity VS proxy

## TS

- TS 中有哪些类型（基础）

  - 内置：包括数字(number)，字符串(string)，布尔值(boolean)，无效(void)，空值(null)和未定义(undefined)。

  - 用户定义的：它包括枚举(enums)，类(classes)，接口(interfaces)，数组(arrays)和元组(tuple)。

- **对 TypeScript 类中成员的 public、private、protected、readonly 修饰符的理解？**（基础）

  `public`: 成员都默认为`public`，被此限定符修饰的成员是可以被外部访问；
  `private`: 被此限定符修饰的成员是只可以被类的内部访问；
  `protected`: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;
  `readonly`: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

- 什么是范性，可以用来做什么

  - 范性一般用于抽象接口，抽象类上，抽象函数上，可以实现复用的效果。

  - 在前端实际项目中，比如 React 项目，我们可以抽象通用的组件，比如 list 列表抽象为范型组件，在外部控制 list 的元素类型，比如`List<Pserson>`，`List<Article>`

## CSS

- Flex 布局有哪些常用属性

## 工具

### Axios

- Axios 的拦截器是否有了解过？有哪些应用场景？
