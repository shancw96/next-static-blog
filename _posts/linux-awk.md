---
title: 如何在linux 上使用awk 命令
categories: [运维]
tags: []
toc: true
date: 2021/8/5
---

翻译自 [how to use the awk Command on Linux](https://www.howtogeek.com/562941/how-to-use-the-awk-command-on-linux/)
查找指定端口 8080，并 kill：
kill -9 $(netstat -nlp | grep 8080 | awk '{print $7}' | awk -F"/" '{ print $1 }');

<!-- more -->

## Rules, Patterns, and Actions

awk 程序使用 单引号 标记，其中 pattern 在 `{}` 申明。如下是一个 awk 使用的简单例子

```bash
> who
cyber    :0           2021-07-23 10:01 (:0)
cyber    pts/3        2021-08-03 17:15 (192.168.1.92)
cyber    pts/4        2021-08-06 09:21 (192.168.1.167)
cyber    pts/5        2021-08-06 10:07 (192.168.1.92)

> who | awk '{print $1}'
cyber
cyber
cyber
cyber
```

默认情况下，awk 认为 空格 + 字符串 + 空格 这种形式为一个 field，awk 通过 美元符 `$` + 数字进行标记。
因此，$1 表示 第一个 field。print $1 表示只打印第一个 field，抛弃剩余 field。

如果我们还想打印出用户的登陆时间：

```bash
> who | awk '{print $1,$3,$4}'
cyber 2021-07-23 10:01
cyber 2021-08-03 17:15
cyber 2021-08-06 09:21
cyber 2021-08-06 10:07
```

因此 field 相关语法如下：

$0: 表示整行.
$1: 表示当前行的第1个field.
$2: 表示当前行的第2个field.
$7: 表示当前行的第7个field.
$NF: 表示当前行的最后一个 field.

## 添加输出分隔符 OFS

我们使用 OFS 变量在不同的 field 间添加连接符号

```bash
> date | awk 'OFS="-" {print $1,$2,$3, $5}'
2021年-08月-09日-10:15:23
```

## BEGIN 和 END 规则

我们可以通过 BEGIN 和 END 为输出字符添加前缀，后缀字符串

```bash
awk 'BEGIN {print "Dennis Ritchie"} {print $0}' dennis_ritchie.txt
```

## 输入分隔符

通过 -F 可以实现对 field 进行切分，比如对于"2021/11/03"

```bash
> awk -F"/" '{print $1}' xxxFile
2021
```

## 在 awk 中使用 正则表达式进行查找

例子：在/etc/fstab 文件中查找存在 UUID 关键字的 string。

```bash
awk '/^UUID/ {print $0} /etc/fstab'
```
