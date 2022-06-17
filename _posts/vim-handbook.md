---
title: vim-vscode-cheat-sheet 
categories: [杂项]
tags: [vim, vscode, vim-vscode]
toc: true
date: 2022/6/17
---


## 插入：

i 光标前插入

a 光标后插入

I 行首插入

A 行尾插入

# 移动

## 基础移动：

h 左

j 下

k 上

l 右

>  一次移动多行
>
> {count}{motion}

## 跨word移动

w 移动到下个word开始处

e 移动到下个word 结束处

b 移动到前一个word 开始处

ge 移动到前一个word 结束处

## 移动到指定字符

`f{character}`: 向后定位字符,比如 f" 标识查找下个出现的双引号

`F{character}`: 向前定位字符

`t{character}`: 向后定位字符，光标定位在字符前一个位置

`T{character}`: 向前定位字符，光标定位在字符前一个位置

```js
t(   ==> v                       v
         const fireball = function(target){
f(   ==> ^                        ^
```

`; `  `,` 可以重复搜索之前的字符

```js
fdfdfd ==> v   v               v        v
           let damage = weapon.damage * d20();
           let damage = weapon.damage * d20();
fd;;   ==> ^   ^               ^        ^
```

## 首尾移动

0: 移动到行首  第一个字符

^: 移动到行首  第一个非空字符

$: 移动到行尾

g_: 移动到行尾 最后一个非空字符

## 段落移动

`{`: 移动光标到下一行空白区域，跳过整个段落 

`}`：移动光标到上一行空白区域，跳过整个段落

## 括号之间跳转

-  **`%`** jump to matching **`({[]})`**.

## 全局搜索,替换

+ 查找

  + `/{pattern}`： 向后搜索

  + `?{pattern}`: 向前搜索

  + n  查找下一个

  + N 查找上一个

+ 替换

​		`:s/zempty/hansome/g` 当前行 zempty   ->  handsome

​		`:%s/zempty/handsome/g` 全文   zempty   -> handsome 

## operations

`[干什么 operation][几次num][对什么]`

d2w -> delete 2 word  ：删除 2个 单词 



#### 撤销和恢复

u: 撤销

ctrl + r: 恢复

#### 大小写更换

+ ~ 将光标下的字母改变大小写
+ 3~ 将光标位置开始的3个字母改变其大小写
+ g~~ 改变当前行字母的大小写
+ gUU 将当前行的字母改成大写
+ guu 将当前行的字母全改成小写
+ 3gUU 将从光标开始到下面3行字母改成大写
+ gUw 将光标下的单词改成大写。
+ guw 将光标下的单词改成小写

#### 复制粘贴

y 复制

p 粘贴

复制全文 ggyG ：gg 回到行首 y复制 G回到行尾

+ `d^`删除光标之前的文本
+ `P`光标前复制,  `p` 光标后复制.

#### 缩进

`>>`: 

`<<`



### 文本进阶操作

`{operation}{i|a}{TEXT-OBJECT-ID}`

+ i: inner 只对内部的text object操作

  ```js
  const politeSalute = (I polite salute you good person.);
  					 ^	
  ```

  + di( -> `const politeSalute = ();`

+ a：around

  + da( -> `const politeSalute = ;`

可选的text-object如下

+ **`w`** for **w**ord
+ **`s`** for **s**entence
+ **`'`**, **`"`**, ` for quotes
+ **`p`** for **p**aragraph
+ **`b`** (or **`(`**, **`)`**) for block surrounded by **`()`,**
+ **`B`** (or **`{`**, **`}`**) for block surrounded by **`{}`**
+ **`<`**, **`>`** for a block surrounded by **`<>`**
+ **`[`**, **`]`** for a block surrounded by **`[]`**
+ **`t`** for tag.

常用的组合操作

- **`daw`** to **d**elete **a** **w**ord 删除一个单词
- **`ciw`** to **c**hange **i**nner **w**ord 删除一个单词并进入编辑模式
- **`das`** to **d**elete **a** **s**entence (**`dis`** to delete inner sentence) 删除一个句子
- **`da"`** 删除被双引号包裹的内容，包括双引号本省 (**`di"`** 只删除双引号内部的内容)
- **`ci"`** 同上，额外进入编辑模式
- **`dap`** 删除一个段落
- **`dab`** **`da(`** or **`da)`** 删除被**`(`**包裹的内容
- **`daB`** **`da{`** or **`da}`** 删除被 **`{`**包裹的内容
- **`dat`** 删除一个html标签，包括内部的内容
- **`cit`** 同上，额外进入编辑模式





常用操作：

+ 代码块移动

  Y + j/k移动选中区域 + d 删除 + p 复制

+ 分屏

  + 增加分屏

    + 【CTRL - W】 S  水平

    + 【CTRL - W】V 垂直

  + 分屏移动

    + ctrl + w   -   hjkl  上下左右移动

    + ctrl + number 跳转分屏

  + 关闭分屏：ctrl+w  --- c/q

+ gb： 多鼠标多选

+ 批量操作：ctrl + V 进入Visual Block 模式 hj 移动增加光标数量

+ 显示相对行号

  :set relativenumber 
  
+ 