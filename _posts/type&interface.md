---
title: type 与 interface
categories: [前端]
tags: [ts]
toc: true
date: 2022/4/6
---

官方推荐用 `interface`，其他无法满足需求的情况下用 `type`。

<!-- more -->

## interface: 接口

接口是命名数据结构（例如对象）的另一种方式；与`type` 不同，`interface`仅限于描述对象类型。

### 描述 `Object`和`Function`

```tsx
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

## type: 类型别名

类型别名用来给一个类型起个新名字，使用 `type` 创建类型别名，类型别名不仅可以用来表示基本类型，还可以用来表示对象类型、联合类型、元组和交集

### 描述 `Object`和`Function`

```tsx
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

## 二者区别

### 1. 定义基本类型别名

`type`可以定义**基本类型别名**, 但是`interface`无法定义,如：

```tsx
type userName = string
type stuNo = number
...
```

### 2. 声明联合类型

`type`可以声明**联合类型**, 例如：

```tsx
type Student = { stuNo: number } | { classId: number };
```

### 3. 声明元组

```tsx
type Data = [number, string];
```

### 4. 声明合并

如果你多次声明一个同名的接口，TypeScript 会将它们合并到一个声明中，并将它们视为一个接口。这称为**声明合并**， 例如：

```tsx
interface Person {
  name: string;
}
interface Person {
  age: number;
}

let user: Person = {
  name: "Tolu",
  age: 0,
};
```

这种情况下，如果是`type`的话，重复使用`Person`是会报错的：

```tsx
type Person { name: string };

// Error: 标识符“Person”重复。ts(2300)
type Person { age: number }
```
