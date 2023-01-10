---
title: FP in Java
categories: [后端]
tags: [fp]
toc: true
date: 2021/4/11
updated: 2021/4/12
---

一直有争论到底是函数式好还是面向对象好。

作为一个精通 js，并且正在学习 java 的开发者来说，js 的混合开发体验异常的美好。

> 我这里讲的混合开发，是指在 class 的 method 中使用函数式的思想。java8 的出现，让我在 java 中也能够使用同样的开发模式。

这篇文章介绍了常用的函数式 API，如 compose, monad, curry,以及如何在 java 中使用常用的函数式的思想进行开发。

这篇文章受限于个人后端的开发水平以及对函数式编程的理解，将会长期更新。

<!-- more -->

# 如何在 java 中使用函数式？

直接上代码，假设有个功能需要依次用到 methodA, methodB, methodC，三个方法才能算出结果

OOP 格式

```java
public class FPDemo {
  public static void main(String args[]) {
    var input = "example input for oop"
    var tempval1 = methodA(input);
    var tempval2 = methodA(tempval1);
    var ans = methodA(tempval2);
  }
  public String methodA(String val) {
    /*code here*/
    return temp1
  }
  public String methodB(String val) {
    /*code here*/
    return temp2
  }
  public String methodC(String val) {
    /*code here*/
    return temp3
  }
}
```

FP in OOP

```java
public class FPDemo {
  public static void main(String args[]) {
    Function<String, String> fun1 = val -> temp1
    Function<String, String> fun2 = val -> temp2
    Function<String, String> fun3 = val -> temp3

    var input = "example input for FP"
    fun3.compose(fun2).compose(fun1).apply("example input for FP")
  }
}
```

上述的例子个人觉得是在 class 中整合函数式的最佳实践，减少了无用代码，增加了可读性

# lambda 表达式

λ(lambda)-expressions 在函数式编程中是创建匿名**函数**的一种方式，一般用来作为一个参数传递给高阶函数(higher-order-function)，比如 Map，reduce，filter。

> 在 Java8 以前是没有 lambda 表达式的概念的，在这之前会使用一种名为内部匿名类的方式来实现

个人认为虽然 Java 是 oop，但是**一个合格的 lambda 表达式应该符合函数式编程的纯函数的概念**。

## 那么什么是纯函数？

- 不变性：如果传入的值相同，那么返回的值一定相同
- 无副作用：该函数不能有语义上可观察的函数副作用
  - 全局修改变量，属性，或者是数据结构
  - I/O 操作
  - 抛出错误
  - Log
  - 查询操作：数据库操作，本地数据修改

# 常用流操作

> 常见的几种流操作都是**惰性求值**，比如 map, filter, flatMap,这么设计是为了让 java 去管理背后的操作, 可以在集合类上级联多种操作,但**迭代只需一次**

## map

map 可以实现 List 的类型转换, 如`[1, 2, 3]` -> `["1", "2", "3"]`
![image-20220808160900489](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160900489.png)

```java
List.of(1, 2, 3).stream()
  .map(String::valueOf)
  .collect(toList());
```

> String:: valueOf 等价于 val -> String.valueOf(val);

## flatMap

将几个小 List 整合成一个大的 List, 可以理解为展平（flat）操作

![image-20220808160818460](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160818460.png)

```java
Stream.of(asList(1, 2, 3), asList(4, 5, 6))
  .flatMap(list -> list.stream())
  .collect(toList())

```

## filter

![image-20220808160844217](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160844217.png)

过滤操作，将 list 中无用的元素过滤掉

```java
List<String> beginningWithNumbers = Stream.of("a", "1abc", "abc1")
      .filter(value -> isDigit(value.charAt(0)))
      .collect(toList());
```

## reduce（及早求值）

这里主要介绍三参数 reduce，两参数和一参数没有太大意义

三参数的 reduce，可以实现类型转换 + 聚合，比如 将 `[1, 2, 3]`转换成 "123"

```java
String tempRet = List.of(1, 2, 3)
  .stream()
  .reduce(
    "",
    (acc, val) -> acc + val,
    (left, right) -> left + right
  );
```

三参数 reduce 的函数签名

```java
<U> U reduce(U identity,
                 BiFunction<U, ? super T, U> accumulator,
                 BinaryOperator<U> combiner);
```

- 第一个参数是初始值, reduce 最后的结果类型和它相同
- 第二个参数是累加函数，可以转换类型，我们简单看下它的函数签名
  - BiFunction 接受两个传入参数, 类型为 U, 和 T，U 为累加值，T 为当前传入值
  - BiFunction 的返回参数和累加值相同 U

* 第三个参数是结合函数，负责前后两个容器的累加方式。

容器这个概念，你可能不明白我在说什么，下面介绍下 reduce 的创建过程，看完你就知道什么是容器了

此场景主要出现在 parallel 流操作中

1. 第一个参数，创建容器
   ![image-20220808160142369](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160142369.png)
2. 第二个参数，负责累加
   ![image-20220808160212126](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160212126.png)

3. 第三个参数，负责容器间的组合方式
   ![image-20220808160229607](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160229607.png)

# 高阶函数使用

高阶函数说的简单点就是函数作为参数传入另外一个函数，实现函数组合，从而完成更加复杂的功能

## compose & andThen

假如函数是水管，那么 组合函数 就是连接水管与水管的胶水，而数据便是水流。functionA, functionB, functionC 通过 组合函数 形成了一个新的函数，实现数据的流动，比如：
**dataflow->functionA ----compose----> functionB ----compose---->functionC->result**

compose 和 andThen 都能够 实现将多个函数组合。只是顺序是相反的

对于如下两个函数，我们通过 compose 可以实现先乘后加或者先加后乘，**compose 的顺序是从右往左的，而 andThen 是从左往右的**

```java
Function<Integer, Integer> multiple2 = num -> num * 2;
Function<Integer, Integer> add5 = num -> num + 5;

multiple2.compose(add5).apply(3) // -> 16
multiple2.andThen(add5).apply(3) // -> 11

add5.compose(multiple2).apply(3) // -> 11
multiple2.compose(add5).apply(3) // -> 16
```

## curry

就我查阅了很多文章，java 中并没有好的方式去是实现 curry。

### curry 的概念

curry 是高阶函数的典范，传入一个参数，会返回一个新的函数，只有参数完全传递，才会得出最后的结果。

比如，一个函数有三个参数 a,b,c。将其 curry 后，那么它的函数签名将会变成这样

```java
Function<String,
    Function<Integer,
      Function<Integer, String>>> curried = curry();
```

我们执行这个函数会得到如下结果

```java
System.out.println(curried); // -> Currier0$$Lambda$1/0x0000000800060840@64b8f8f4
System.out.println(curried.apply("e")); // -> Currier0$$Lambda$2/0x0000000800062840@1996cd68
System.out.println(curried.apply("e").apply(27)); // -> Currier0$$Lambda$3/0x0000000800062c40@555590
System.out.println(curried.apply("e").apply(27).apply(18)); // -> e2718
```

由于 java 每个函数都要声明其签名，所以并没有便捷的方式去将一个函数 curry 化。因此不推荐在 java 中使用

> 在 haskell 中，所有的函数是默认 curry 化的，而在 js 中由于弱类型的原因，也可以通过 curry(normalFunction) 的方式，将一个普通函数转变为 curry 函数。

# monad in Java

## 什么是 monad？

monad 的完全定义对我来说是个哲学话题。。。。说的简单点，monad 可以实现将你传入的类型，包裹起来，然后返回给你一个新的容器类型，
![image-20220808160707570](https://pic.limiaomiao.site:8443/public/uploads/image-20220808160707570.png)

## Optional monad 处理 nullPointerException

由于我们操作的是 monad 的 container，因此著名的 nullPointerException 就可以通过 Optional monad 轻而易举的解决

下面代码传入一个可能为 null 的值，通过一系列操作后，如果传入的值是 null，就返回 默认值 3

```java
Integer result = Optional.ofNullable(somethingMightNull)
  .stream()
  /*more operation*/
  .orElse(3)

```

更多细节阅读：[Guide To Java 8 Optional](https://www.baeldung.com/java-optional)

## CompletableFuture<T> 处理异步

CompletableFuture 接受一个异步函数，使用与 js 的 Promise 类似

以获取股票价格为例，看看如何使用 CompletableFuture：

```java
public class Main {
    public static void main(String[] args) throws Exception {
        // 创建异步执行任务:
        CompletableFuture<Double> cf = CompletableFuture.supplyAsync(Main::fetchPrice);
        // 如果执行成功:
        cf.thenAccept((result) -> {
            System.out.println("price: " + result);
        });
        // 如果执行异常:
        cf.exceptionally((e) -> {
            e.printStackTrace();
            return null;
        });
        // 主线程不要立刻结束，否则CompletableFuture默认使用的线程池会立刻关闭:
        Thread.sleep(200);
    }

    static Double fetchPrice() {
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
        }
        if (Math.random() < 0.3) {
            throw new RuntimeException("fetch price failed!");
        }
        return 5 + Math.random() * 20;
    }
}

```

# 参考

## 书

- [Functional Programming in JavaScript](https://www.amazon.com/Functional-Programming-JavaScript-functional-techniques/dp/1617292826)

* [Java 8 Lambdas: Pragmatic Functional Programming](https://www.amazon.com/Java-Lambdas-Pragmatic-Functional-Programming-ebook/dp/B00J3B3J3C)

## 文章

- [haskell: Lambda expression](https://www.cs.bham.ac.uk/~vxs/teaching/Haskell/handouts/lambda.pdf)

* [stackOverflow: Can a java lambda have more than 1 parameter?](https://stackoverflow.com/questions/27872387/can-a-java-lambda-have-more-than-1-parameter)

- [oracle doc: java.util.function.Function](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/Function.html)

* [Java Curry](https://medium.com/galileo-onwards/java-curry-997fb357b47e)

- [Adding currying to Java 8](https://adorow.github.io/blog/2017/06/04/currying-in-java)

* [Java 8: Composing functions using compose and andThen](https://www.deadcoderising.com/2015-09-07-java-8-functional-composition-using-compose-and-andthen/)

- [Java Functional Composition](http://tutorials.jenkov.com/java-functional-programming/functional-composition.html)

* [Write a monad, in Java, seriously?](
