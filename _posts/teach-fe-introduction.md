---
title: 前端教程 - 前端介绍
categories: [前端教程]
tags: []
toc: true
date: 2022/7/20
---



这篇文章介绍了什么是前端，html css js 是啥，分别在前端中扮演什么样的角色。



<!--more-->



## Table of Content



## 什么是前端？

浏览器打开的网页，都是前端开发者写的。所以，简单来说前端就是写网页。



## 学前端需要具体学哪些基础内容？

学前端，需要学习3门语言，HTML, CSS, JS。HTML，CSS 用来画页面



### HTML & CSS

咱们看到的网页，就是一个HTML 文件。HTML是载体，是页面的骨架。而css则是对丑陋的HTML页面进行美化。

如下是一个HTML文件，有效的部分为body标签里面

```html
<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
```

![image-20220720102743631](http://serial.limiaomiao.site:8089/public/uploads/image-20220720102743631.png)



此处的h1 标签语意(heading 1)是：将被此标签包裹的内容，显示为一级标题

p标签的语义（paragraph）: 表示段落，被此标签包裹的内容，为普通段落



下面我们再介绍下CSS

我们上述html 代码相对来说比较简陋，如果我们想让h1 标签变成红色，就需要借助css增加额外的样式



```html
<!DOCTYPE html>
<html>
<head>
<style>
body {background-color: powderblue;}
h1   {color: blue;}
p    {color: red;}
</style>
</head>
<body>

<h1>This is a heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
```

![image-20220720103912525](http://serial.limiaomiao.site:8089/public/uploads/image-20220720103912525.png)



简单总结：

+ html 是页面载体，告诉浏览器怎么组织页面
+ css 可以给html 化妆，让其变得好看点



### JS

随着互联网行业的发展，最初存粹的html css 已经不能满足用户的需求。用户迫切需要能够和页面交互起来，于是便有了js。

js 用于在html中增加交互。

比如有个按钮，每次点击后，我们需要记录当前一共点击了多少次。

```js
// 定义一个参数，起名为count，我们给他初始值设为 0，表示没有被点击过
let count = 0;

// 定义一个方法，起名为 handleClick， 意为处理点击，我们每次点击按钮，都会触发这个方法
// 这个方法需要做的事情：每次点击，触发这个方法，让count + 1
function handleClick() {
  // 将count + 1 的值，赋值给count
  count = count + 1;
}
```



上述的代码，是脱离了html 页面的js，属于纯逻辑，为什么我要单独拎出来？因为现代化的开发，会借助于框架，就类似于会计算账不会手算，而是借助金蝶等软件。



现代化的开发框架有 Vue（中国人写的，在国内很流行），React（外国人写的，在国外比较流行）。使用框架后，原有的html 和js 之间交互将会变得非常简单。





上述点击记录的需求，借助Vue 框架后，参考此处：

https://codesandbox.io/s/delicate-microservice-2ctk1n?file=/src/App.vue

总结： JS用于给html 页面增加交互，现代化开发，不需要从无到有手写繁琐的html js 交互。脏活累活有Vue，React 之类的框架帮忙处理



后记： 

Vue 框架相关的知识，需要等学完HMTL & CSS & JS 基础后学习