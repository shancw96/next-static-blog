---
title: vue常见问题
categories: [前端]
tags: [vue]
date: 2022/06/20
---
这篇文章介绍了vue的常见问题

## Table of Content

<!-- more -->

## vue 父子组件下的生命周期是怎样的
[来源：vue 父子组件生命周期执行顺序](https://blog.csdn.net/qyl_0316/article/details/107505447)
父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

然后理解下这个顺序：

1.当父组件执行完beforeMount挂载开始后，会依次执行子组件中的钩子，直到全部子组件mounted挂载到实例上，父组件才会进入mounted钩子

2.子级触发事件，会先触发父级beforeUpdate钩子，再去触发子级beforeUpdate钩子，下面又是先执行子级updated钩子，后执行父级updated钩子

总结：

父组件先于子组件created，而子组件先于父组件mounted

子组件更新：父beforeUpdate->子beforeUpdate->子updated->父updated

销毁：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed