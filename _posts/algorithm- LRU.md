---
title: 算法 - LRU
categories: [算法]
tags: [algorithm, LRU]
toc: true
date: 2020/6/17
---

# 介绍

LRU（Least recently used，最近最少使用）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”

# 实现

## 链表实现

### 思路

LRU 操作有两种，读和写：

1. 读操作：将数据从原有的位置取出，放入头部
2. 写操作：

- 缓存位置已满：去链表最后的元素，将新的数据插入头部
- 缓存未满：将数据加入头部

### 实现

由上思路，可以整理出几种操作：查找`find`，截取`pick`，检查是否超过长度`check`，插入头部`insertHead`
由这几种操作可以组合成读和写
**构造函数**

```js
const LRUCache = function (capacity) {
  this.head = new Node(null, null);
  this.limit = capacity;
};
function Node(key, value) {
  this.key = key;
  this.val = value;
  this.next = null;
}
```

**读操作**

> 如果当前值存在，则从原来位置取出，并放入头怒

```js
LRU.prototype.get = function (key, value) {
  // 如果没有找到，则返回null
  if (this.find(this.key) === -1) return null;
  this.insertHead(this.pick(key));
};
```

**写操作**

> 如果当前的数据已经存在，则取出并放入头部。否则直接写入头部

```js
LRU.prototype.put = function (key, value) {
  let node = this.find(key) === -1 ? this.pick(key) : new Node(key, value);
  this.insertHead(node);
  this.check();
};
```

**辅助功能实现**

```js
LRUCache.prototype.find = function (key) {
  // 链表遍历
  let vaildHeadNode = this.head.next;
  while (vaildHeadNode) {
    if (vaildHeadNode.key === key) {
      return vaildHeadNode;
    }
    vaildHeadNode = vaildHeadNode.next;
  }
  return -1;
};
// 从链表中截取节点
LRUCache.prototype.pick = function (key) {
  let node = this.find(key);
  let node_val = node.val;
  let node_key = node.key;
  if (!node.next) {
    node.val = null;
    node.key = null;
    node.next = null;
  } else {
    node.val = node.next.val;
    node.key = node.next.key;
    node.next = node.next.next;
  }
  return new Node(node_key, node_val);
};
// 判断长度是否超过限制，如果超过则删除尾部数据
LRUCache.prototype.check = function () {
  let count = 0;
  let move_node = this.head;
  //  移动到限制的最后一个节点，并进行截取
  while (count < this.limit && move_node) {
    move_node = move_node.next;
    count += 1;
  }
  if (move_node && move_node.next) move_node.next = null;
};
LRUCache.prototype.insertHead = function (node) {
  node.next = this.head.next;
  this.head.next = node;
};
```
