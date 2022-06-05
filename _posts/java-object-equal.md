---
title: HashCode 和 equals 之间的关系
categories: [后端]
tags: [java]
toc: true
date: 2021/11/9
---

在看 Java Persistence With Hibernate 这本书的时候，看到有这么段代码

```java
// implementing the custom equality with equals() and hashCode()
@Embeddable
public class Image {
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Image other = (Image) o;
    if (!title.equals(other.title)) return false;
    if (!filename.equals(other.filename)) return false;
    if (!width.equals(other.width)) return false;
    if (!height.equals(other.height)) return false;
    return true;
  }

  @Override
  public int hashCode() {
    int result = title.hashCode();
    result = 31 * result + filename.hashCode();
    result = 31 * result + width.hashCode();
    result = 31 * result + height.hashCode();
    return result;
  }
}
```

提出问题： 为什么重写 equals 需要重写 hashCode？

<!-- more -->

## hashCode 是什么？

hash 一般翻译做“散列”，也有直接音译为“哈希”的，**就是把任意长度的输入，通过散列算法，变换成固定长度的输出**，该输出就是**散列值**

相同对象（通过 equals 判断）必须返回相同的 hash code，但是不同对象不一定返回不同的 hashcode。
![hash function](/images/java/hash-function.png)
如上图所示，John Smith 和 Sandra Dee 算出来的 hash 值相同，这就产生了碰撞

## hashCode 和 equals 之间的关系

当两个对象进行比较的时候，首先会进行 hashCode 比较，如果 hashCode 不相同，那么说明两个对象不相同，直接返回 false，如果 hashCode 相同，则需要进行 equals 的比较了，equals 比较整体上比 hashCode 更复杂，因此如果 hashCode 写的好，碰撞发生的概率小的话，那么可以节省很多时间。

## 一些 hashCode 的 implementations

### “standard” implementation

```java
@Override
public int hashCode() {
    int hash = 7;
    hash = 31 * hash + (int) id;
    hash = 31 * hash + (name == null ? 0 : name.hashCode());
    hash = 31 * hash + (email == null ? 0 : email.hashCode());
    return hash;
}
```

### Intellij IDEA implementation

```java
@Override
public int hashCode() {
    int result = (int) (id ^ (id >>> 32));
    result = 31 * result + name.hashCode();
    result = 31 * result + email.hashCode();
    return result;
}
```

### 为什么选择 31 作为乘子

31 是一个不大不小的质数，是作为 hashCode 乘子的优选质数之一。另外一些相近的质数，比如 37、41、43 等等，也都是不错的选择。那么为啥偏偏选中了 31 呢？请看第二个原因。
31 可以被 JVM 优化，31 \* i = (i << 5) - i。
