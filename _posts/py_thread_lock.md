---
title: python 多线程 锁
categories: [python]
tags: [多线程, 线程锁]
toc: true
date: 2023/1/14
---







这篇文章介绍了python多线程的简单使用，及变量共享的方式

<!--more-->

## Table of Content

## python 多进程和多线程的区别?

多进程和多线程是计算机并发编程的两种基本模型。

多进程指的是在同一时间内，有多个程序在不同的内存空间中运行。因为每个进程有自己独立的内存空间，所以进程之间相互独立，互不干扰。

多线程指的是在同一时间内，有多个线程在同一个进程的内存空间中运行。线程之间共享进程的内存空间，所以线程之间相互共享数据。

总结：多进程是指同时运行多个不同程序，多线程是指同时运行多个同一程序中的不同部分。**如果需要在同一进程中共享数据并且有更高的调用效率，使用多线程更合适。如果需要独立运行两个程序并且有更好的隔离性，使用多进程更合适。**



## 如何在不同线程间写入并共享数据?

```python
import threading

# 创建一个共享变量
shared_variable = Value('i', 0)

# 创建一个线程锁
lock = threading.Lock()

def thread_a():
    while True:
        # 获取锁
        lock.acquire()
        shared_variable.value += 1
        print("Thread A:", shared_variable.value)
        # 释放锁
        lock.release()

def thread_b():
    while True:
        # 获取锁
        lock.acquire()
        shared_variable.value -= 1
        print("Thread B:", shared_variable.value)
        # 释放锁
        lock.release()
 

# 创建并启动两个线程
thread_a = threading.Thread(target=thread_A)
thread_a.start()

thread_b = threading.Thread(target=thread_A)
thread_b.start()
```



## 在两个线程间共享数据有哪些方式？

- 全局变量：多线程可以直接访问全局变量，但是这种方式不能避免多线程冲突导致的数据不一致。所以这种方式不推荐使用

- 使用Queue：Queue是Python中的线程安全队列，可以用来在多线程之间传递变量。Queue中的数据会被自动加锁，避免了多线程冲突。

  ```python
  from queue import Queue
  
  # 创建一个队列
  queue = Queue()
  
  # 在线程A中往队列里放数据
  queue.put(data)
  
  # 在线程B中从队列里取数据
  data = queue.get()
  ```

  

+ 使用Lock：Lock是线程锁，可以用来保护共享数据，避免多线程冲突。

  ```python
  import threading
  
  # 创建锁
  lock = threading.Lock()
  
  # 线程A要更新共享变量
  lock.acquire()
  shared_variable = new_value
  lock.release()
  
  # 线程B要读取共享变量
  lock.acquire()
  print(shared_variable)
  lock.release()
  ```

  

## 使用线程锁，如果线程A在更新期间线程B读取数据会发生什么？

阻塞

如果线程A正在更新共享变量时，线程B试图读取这个变量，那么线程B将会被阻塞直到线程A释放锁。这是因为线程A已经获取了锁，线程B在等待线程A释放锁之前无法获取锁。

解决方案：`threading.RLock`，需要注意的是，使用可重入锁时，需要确保每次获取锁都有对应的释放锁操作。



## 如何为线程锁的创建共享变量？

使用Value或者Array，这是一种特殊的共享变量

```python
from multiprocessing import Value, Array

# 创建一个共享变量
shared_variable = Value('i', 0)

# 创建一个共享数组
shared_array = Array('i', range(10))
# 写入
shared_array[0] = 1
# 读取
print(shared_array[0])
```

第一个参数是一个类型代码，用来表示共享变量的类型。在上面的代码中，`i` 代表整型，其他可选项还有：

- `b`：布尔型

- `i`：整型

- `f`：浮点型

- `d`：双精度浮点型

- `c`：字符型

  将字符赋值给共享变量时，需要使用 `.encode()` 方法将字符串类型转换为字节类型。在读取共享变量时，我们需要使用 `.decode()` 方法将字节类型转换为字符串类型。

  ```python
  shared_variable.value = char.encode()
  print(shared_variable.value.decode())
  ```


