---
title: JS-异步函数-Promise 实现
categories: [前端]
tags: [implement, 异步, js]
toc: true
date: 2020/7/2
---

[Promise/A+ 规范 原文](https://promisesaplus.com/)
[Promise/A+ 规范 译文](https://www.ituring.com.cn/article/66566)

# Promise 介绍及相关必要知识

Promise 对象表示了异步函数的最终结果（可能是成功，也可能是失败的）。

> MDN:The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value

## 宏观任务与微观任务的认识

Promise 属于微观任务。那么什么是微观任务，与之相对的宏观任务又是什么？

- JS 宿主发起的任务为宏观任务，JS 引擎发起的任务为微观任务。如`window.setTimeou`由浏览器（JS 宿主）提供的 API，所以属于宏观任务。
- 宏观任务的队列就相当于事件循环。事件循环：`MacroTask1, ... , MacroTaskN`。
- 一个宏观任务包含了微观任务队列。MacroTask1: MicroTask1, ... , MicroTaskN
  <!-- ![JS 宏观任务与微观任务](promise.png) -->
  ![image-20220824170139482](https://pic.limiaomiao.site:8443/public/uploads/image-20220824170139482.png)

## Promise 要求

三个状态：等待 Pending, 执行 Fulfilled, 拒绝 Rejected，**pending 状态可以转移**至 fulfilled 和 rejected。**fulfilled 与 rejected 不能转移**

### then 方法

then 方法可以访问其当前值、终值和据因。`promise.then(onFulfilled, onRejected)`

onFulfilled 与 onRejected 都是可选参数，并且需要是函数，如果不是函数则直接忽略

**onFulfilled 与 onRejected 必须在当前宏任务执行完之后（setTimeout, setInterval）才能够执行**

#### 参数-onFulfilled（可选）

异步正确执行的回调函数，接受参数为正确执行返回的结果
只能执行一次

#### 参数-onRejected（可选）

异步错误执行的回调函数，接受参数为错误执行返回的拒绝原因
只能执行一次

- onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）

#### then 可以被多次调用

then 方法可以被同一个 promise 调用多次

- 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
- 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

#### then 返回一个新的 promise

then 方法返回一个 promise 对象

```
promise2 = promise1.then(onFulfilled, onRejected)
```

- 如果 onFulfilled 或者 onRejected 返回的是一个值 x，那么执行标准 Promise 解决流程`[[Resolve]](promise, x)`（下面会详细说明）
- 如果 onFulfilled 或者 onRejected 抛出错误，那么 promise2 也直接抛出错误
- 如果 onFulfilled 或者 onRejected 不是函数，则 promise2 返回与 promise1 相同的结果状态

#### `[[Resolve]](promise, x)`执行过程

如果返回值 x 也是 Promise，那么当前的 promise 应该等 x 执行完毕后，将新的返回值作为它的传入参数。
否则 执行使用 x 作为它的返回参数

具体过程如下：

1. 如果`promise`与`x`指向同一个对象，那么 promise 抛出类型错误
2. 如果 x 是一个 promise
3. 如果 x 还处于 pending，则 promise 必须等 x 改变状态后才能继续执行
4. 如果 x 处于执行态，用相同的值执行 promise
5. 如果 x 处于拒绝态，用相同的据因拒绝 promise
6. 如果 x 是一个函数或者对象

# Promise 的简单 pollyfill

```js
// Object.prototype.toString Get the [[Class]] property of this object.
const isFunc = (fn) =>
  Object.prototype.toString.call(fn) === "[object Function]";
const PENDING = Symbol("0");
const FULFILLED = Symbol("1");
const REJECTED = Symbol("2"); // Symbol 内部的字符串只作为描述 Symbol.for(key) 会查找是否有名为key的symbol 如果没有则创建一个
class MyPromise {
  constructor(fn) {
    if (!isFunc(fn)) throw new TypeError("参数只能为函数");
    this._status = PENDING;
    this._value = null;
    this._fullfilledStack = []; //当status 为PENDING，then每次被调用都需要存入对应的stack
    this._rejectedStack = []; //当status 为PENDING，then每次被调用都需要存入对应的stack
    // 执行传入的函数
    try {
      // fn为在异步前调用的用户代码,参数固定为resolve reject 两个函数
      // 通过bind 限定当前的context
      fn(this._resolve.bind(this), this._rejectedStack.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }

  _resolve(val) {
    const run = () => {
      // 如果当前状态不是结束态，那么不会执行stack 中的内容
      if (this._status !== PENDING) return;
      const runFullfilledStack = (val) => {
        this._value = val;
        this._status = FULFILLED;
        this._fullfilledStack.forEach((fn) => fn(val));
        this._fullfilledStack = [];
      };
      const runRejectedStack = (err) => {
        this._value = err;
        this._status = REJECTED;
        this._rejectedStack.forEach((fn) => fn(val));
        this._rejectedStack = [];
      };
      // 如果reoslve 的val为Promise 则需要等待当前val 变为结束态才会继续执行
      if (val instanceof MyPromise) {
        val.then(runFullfilledStack, runRejectedStack);
      } else {
        runFullfilledStack(val);
      }
    };
    // 只有当前的macroTask 队列 执行完毕，才能够轮到Promise执行。模拟Promise延迟执行
    setTimeout(run, 0);
  }
  _reject(err) {
    const run = () => {
      this._status = REJECTED;
      this._value = err;
      this._rejectedStack.forEach((fn) => fn(val));
      this._rejectedStack = [];
    };
    setTimeout(run, 0);
  }

  then(onFulfilled, onRejected) {
    onFulfilled = isFunc(onFulfilled) ? onFulfilled : (_) => _;
    onRejected = isFunc(onRejected) ? onRejected : (_) => _;
    const { _value, _status } = this;
    // 返回一个新的Promise对象
    return new Promise((onFulfilledNext, onRejectedNext) => {
      // 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
      const fulfilled = (val) => {
        try {
          let res = onFulfilled(val);
          res instanceof MyPromise
            ? res.then(onFulfilledNext, onRejectedNext)
            : onFulfilledNext(res);
        } catch (e) {
          onRejectedNext(e);
        }
      };
      // 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调
      const rejected = (err) => {
        let res = onRejected(error);
        res instanceof MyPromise
          ? res.then(onFulfilledNext, onRejectedNext)
          : onFulfilledNext(res);
      };
      // 当then被调用的时候，根据当前Promise 的状态来决定是加入缓存栈中还是直接执行
      switch (_status) {
        // 因为当前的状态未知，所以两个执行栈都需要加入
        case PENDING:
          this._fullfilledStack.push(fulfilled);
          this._rejectedStack.push(rejected);
          break;
        case FULFILLED:
          fulfilled(this._value);
          break;
        case REJECTED:
          rejected(this._value);
          break;
      }
    });
  }
}
```
