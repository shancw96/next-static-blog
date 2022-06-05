---
title: Java Optional handbook
categories: [后端]
tags: [fp]
toc: true
date: 2021/4/28
---

Optional 是一个泛型容器对象，用于 nullPointerException 问题，它内部存的值可以是 null 或者 non-null 值。

`isPresent()`方法，可以判断 Optional 保存的值是否为空。`orElse`方法在内部值为 null 的时候，提供一个默认的值。

常用的 API 如下：

<!-- more -->

## Optional.of

接收一个 non-null 值，生成 Optional 容器对象

```java
public static <T> Optional<T> of(T value) {
  return new Optional<>(Objects.requireNonNull(value));
}
```

## Optional.ofNullable

接受一个值，生成一个 Optional 对象，如果是 null,则生成一个空的 Optional 对象。

```java
public static <T> Optional<T> ofNullable(T value) {
  return value == null ? (Optional<T>) EMPTY : new Optional<>(value);
}
```

## get

获取值，如果值为 null，直接抛出错误

## 判断是否存在

- isPresent 如果存在值返回 true

- isEmpty 如果为空返回 true

- ifPresent: 如果存在则执行 action

- ifPresentOrElse: 如果存在则执行 actionA，否则执行 actionB 处理 null 情况

## 链式操作

- filter:

  - 对 Optional 持有的对象进行 过滤操作
  - 如果返回 false，创建 empty Optional
  - 如果持有的值是 null，抛出错误

- map:
  - 对 Optional 持有对象进行转换操作
  - 如果内部为 null，则返回一个 empty Optional
  ```java
  public <U> Optional<U> map(Function<? super T, ? extends U> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent()) {
            return empty();
        } else {
            return Optional.ofNullable(mapper.apply(value));
        }
    }
  ```

* flatMap: flatmap 与 map 类似，但是 map 最终的结果会自动包裹成`Optional<T>` 而 flatMap 返回的是`T`

- stream：将 Optional 对象转换成 Stream 对象
  ```java
  public Stream<T> stream() {
        if (!isPresent()) {
            return Stream.empty();
        } else {
            return Stream.of(value);
        }
    }
  ```

## Or 相关操作

- or:

  - 传入一个 supplier 函数，如果 Optional 包含的值为 null，则调用 supplier 将其返回值包裹成`Optional<T>`
  - 一个 supplier 函数例子：`Supplier<Double> randomValue = () -> Math.random();`

  ```java
  public Optional<T> or(Supplier<? extends Optional<? extends T>> supplier) {
        Objects.requireNonNull(supplier);
        if (isPresent()) {
            return this;
        } else {
            @SuppressWarnings("unchecked")
            Optional<T> r = (Optional<T>) supplier.get();
            return Objects.requireNonNull(r);
        }
  ```

* orElse: 如果存在 T,则返回，不存在就返回提供的值
  ```java
  public T orElse(T other) {
          return value != null ? value : other;
      }
  ```

- orElseThrow: 如果存在 T，则返回，否则抛出错误，错误可自定义，通过 supplier 提供

  ```java
    public T orElseThrow() {
          if (value == null) {
              throw new NoSuchElementException("No value present");
          }
          return value;
      }
  ```

## 其他

- equals: 比较的双方必须都是 Optional 对象。比较其内部的值

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) {
        return true;
    }

    if (!(obj instanceof Optional)) {
        return false;
    }

    Optional<?> other = (Optional<?>) obj;
    return Objects.equals(value, other.value);
}
```
