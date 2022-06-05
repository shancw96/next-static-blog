---
title: 正则表达式
categories: [前端]
tags: [implement]
toc: true
date: 2020/12/15
---

## 写一个方法将下划线命名替换为大驼峰命名

```ts
function toCamel(str: string): string {
  return str.replace(/(_)(\w)/g, (match, $1, $2) => $2.toUpperCase());
}
```

explain:

`str.replace(regexp|substr, newSubStr|function)`

replace 参数：

- regexp（pattern）正则
- substr(pattern) 字符串
- newSubStr 匹配部分将要被匹配的值
- function(replacement) 一个用来创建新子字符串的函数，该函数的返回值将替换掉第一个参数匹配到的结果
  - match：匹配的子串。（对应于上述的$&。）
  - p1,p2, ...：假如 replace()方法的第一个参数是一个 RegExp 对象，则代表第 n 个括号匹配的字符串。（对应于上述的$1，$2 等。）例如，如果是用 /(\a+)(\b+)/ 这个来匹配，p1 就是匹配的 \a+，p2 就是匹配的 \b+。

replace 可以使用字符串作为参数:
$$: 插入一个"$",
$&: 插入匹配的字符串
$`:插入当前匹配的子串左侧的内容 `$: 插入当前匹配的子串的右侧的内容
`$<Name>`: 分组名称

⚠️：为什么不用 str.replace(/(_)(\w)/g, ‘$2’.toUpperCase())?
eager evaluation， $2.toUpperCase() 优先于 str.replace 之前执行，相当于 str.replace(/(_)(\w)/g, ‘$2’)
