---
title: ascii 生成指定范围的number
categories: [前端]
tags: [implement]
toc: true
date: 2021/1/11
---

## 使用场景

设计一个组件，根据传入的文件后缀，设置不同主题颜色，如 word 为蓝色，pdf 为黄色，png 为红色。
思路：

1. 维护一个色域数组
2. 将文件后缀字符串，转换成 ascii 数字，再通过取余的方式获取 0 - 色域数组最大长度之间的数字

```js
/**
 *
 * @description string -> number string通过ascii 生成指定范围的number
 * @param {string} str 要被计算的值
 * @param {number} 最终返回的数值的范围区间
 */

export function getAsciiRangedNum(str: string, range: number) {
  return reduceByRange(getAsciiSum(str), range);
  // 获取string 对应的ascii 和
  function getAsciiSum(str: string): number {
    return str
      .split("")
      .map((char: string) => char.charCodeAt(0))
      .reduce((acc, curAsciiNum) => acc + curAsciiNum, 0);
  }
  // 根据传入的range 取余
  function reduceByRange(sum: number, range: number): number {
    return sum <= range ? sum : reduceByRange(sum % range, range);
  }
}
```
