---
title: Vue初级教程
categories: [前端]
tags: [Vue, 教程]
toc: true
date: 2022/7/27
---

###### 

这篇文章面向基础不牢固的人，主要讲解怎么用，至于为什么这么用，有空会另起文章说明。

下面所有例子可以在[此处点击](https://codesandbox.io/s/demo-8vtjk9?file=/src/components/demo1.vue)查看

<!--more-->



## Table of Content



一个Vue文件，由下面三块内容构成，分别是HTML JS CSS

![image-20220727104600616](http://serial.limiaomiao.site:8089/public/uploads/image-20220727104600616.png)





## Template

HTML在Vue中的名字为template，意为模版。一个模版只能有一个父元素，参考上图的div。模版有如下语法需要记忆

### 数据绑定

数据绑定最常见的形式就是使用 (双大括号) 语法的文本插值：

```html
<span>Message: {{ msg }}</span>
```

### 属性绑定 v-bind

双大括号 语法不能作用在 HTML attribute 上，遇到这种情况应该使用 [`v-bind` 指令](https://cn.vuejs.org/v2/api/#v-bind)：

```html
<a v-bind:href="url">...</a>
```

这样我们url，就可以通过data进行控制

v-bind 指令可以被简化为

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

```

一般项目中，会使用简化写法，了解v-bind是啥即可

![image-20220727110158705](http://serial.limiaomiao.site:8089/public/uploads/image-20220727110158705.png)

### 事件绑定 v-on

什么是事件？

一些事件是由用户触发的，例如鼠标或键盘事件；而其他事件常由 API 生成，例如指示动画已经完成运行的事件，视频已被暂停等等。

在项目开发中，常用的事件有点击事件，鼠标移入移出事件,....具体使用到的时候再去找，也不迟，面相google 编程。这里主要是介绍用法，我们以点击事件为例

点击事件`v-on:click`，顾名思义，就是用户点击页面某个位置后，会触发的事件。

和 v-bind一样，v-on也有简写，

```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>
```

![image-20220727112702457](http://serial.limiaomiao.site:8089/public/uploads/image-20220727112702457.png)

### Class 绑定



#### 对象语法

我们可以传给 `v-bind:class` 一个对象，以动态地切换 class：

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>

data: {
  isActive: true,
  hasError: false
}
```

结果渲染为：

```html
<div class="static active"></div>
```

当 `isActive` 或者 `hasError` 变化时，class 列表将相应地更新。例如，如果 `hasError` 的值为 `true`，class 列表将变为 `"static active text-danger"`。

#### 数组语法

我们可以把一个数组传给 `v-bind:class`，以应用一个 class 列表：

```html
<div v-bind:class="[activeClass, errorClass]"></div>



data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

渲染为：

```html
<div class="active text-danger"></div>
```

如果你也想根据条件切换列表中的 class，可以用三元表达式：

```html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```



![image-20220727120204378](http://serial.limiaomiao.site:8089/public/uploads/image-20220727120204378.png)

### Style 语法

#### 对象语法

v-bind:style 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名：

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div
  
data: {
  activeColor: 'red',
  fontSize: 30
}
```



#### 数组语法

`v-bind:style` 的数组语法可以将多个样式对象应用到同一个元素上：

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

### 条件渲染

条件渲染就是 在template 里使用if 判断，决定是否显示

![image-20220727130609867](http://serial.limiaomiao.site:8089/public/uploads/image-20220727130609867.png)

条件判断有两个 v-if v-show

v-show：https://cn.vuejs.org/v2/guide/conditional.html#v-show

v-if 与 v-show 的区别：https://cn.vuejs.org/v2/guide/conditional.html#v-if-vs-v-show

### v-for 批量生成列表

我们可以用 `v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组，而 `item` 则是被迭代的数组元素的**别名**。

```js
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>


items: [
  { message: 'Foo' },
  { message: 'Bar' }
]
```

![image-20220727131633331](http://serial.limiaomiao.site:8089/public/uploads/image-20220727131633331.png)

## JS

Vue文件中，JS部分，所有的逻辑操作都放在此处。这里介绍了最基本的内容。

### data

在Vue文件中，data的写法比较特殊

```js
data() {
  return {
 		msg: 'Hello World!'   
  }
}
```

注意此处的return返回了一个对象，我们所有数据都放在此处

> 为何使用return 方式，涉及到vue的原理实现，现在不做讨论，这篇文章开头就介绍了怎么用，而不是为什么

### methods

method意为方法，一般配合模版中的事件使用。

![image-20220727132201504](http://serial.limiaomiao.site:8089/public/uploads/image-20220727132201504.png)

### computed

computed 在vue 文档中，意为 自动计算。但我觉得翻译为  自动转换更贴切一些。顾名思义，computed 可以实现将一个 变量转换成另外一个变量

![image-20220727132358613](http://serial.limiaomiao.site:8089/public/uploads/image-20220727132358613.png)

比如我们例子中，将一个count转换成了一个字符串。除此之外，我们还可以实现自动求和等等等操作。



### 生命周期

相关内容会放在第二篇中讲解