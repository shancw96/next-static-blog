---
title: 算法-5 个链表常见操作
categories: [算法]
tags: [linked-list]
toc: true
date: 2020/6/22
---

## 单链表反转

关联 leetcode:[206](https://leetcode-cn.com/problems/reverse-linked-list/) [92](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

1. 迭代原地修改法
   时间复杂度：O(n),空间复杂度：O(1)

```js
function reverseList_iterate_in_place(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
```

2. 迭代,额外空间
   时间复杂度：O(n),空间复杂度：O(n)

```js
function Node(val) {
  return {
    val,
    next: null,
  };
}
function reverseList_iterate_copy(head) {
  let newHead = null;
  while (head) {
    // 创建新节点
    let newNode = new Node(head.val);
    // 在已存在的head 之前插入
    newNode.next = newHead;
    // 移动head
    newHead = newNode;
    // 原版head 向后移动
    head = head.next;
    console.log(newHead);
  }
  return newHead;
}
```

3. 递归法
   时间复杂度：O(n),空间复杂度：O(n)

```js
function reverseList_recursion(head, newHead = null) {
  if (!head) return newHead;
  const curNode = new Node(head.val);
  curNode.next = newHead;
  return reverseList_recursion(head.next, curNode);
}
```

## 链表中环的检测

关联 leetcode:

- [判断链表是否有环 811](https://leetcode-cn.com/problems/linked-list-cycle/)
- [判断链表是否有环，如果有则返回入口 142](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

### 判断方法

- 快慢指针
- 通过额外空间存储 Set / Map

快慢指针
时间复杂度：O(n/2),空间复杂度：O(1)

```js
function isCircle_point(head) {
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    if (slow === fast) return true;
    slow = slow.next;
    fast = fast.next.next;
  }
  return false;
}
```

额外空间(set 方法)
时间复杂度：O(n),空间复杂度：O(n)

```js
function isCircle_set(head) {
  let dir = new Set();
  let move_head = head;
  while (move_head) {
    let prev_len = dir.size;
    dir.add(move_head);
    if (dir.size === prev_len) return true;
    move_head = move_head.next;
  }
  return false;
}
```

### 获取入口

时间复杂度：快慢指针 O(n/2) + 遍历 O(n)
空间复杂度：O(1)
分析:

- 设慢指针的路径为 s ，那么快指针路径为 2s
- 将慢指针走过的路径分为 进入环前-a 和 进入环与快指针相遇-b 两端 则有：s = a + b
- 将环的路径设置为 c ，那么有 之前绕整个环跑的 n 圈的路程 nc，加上最后这一次遇见 Slower 的路程 s： 2s = s + nc

```js
2s = s + nc
s = a + b
即：
a + b = nc

a = nc - b
  = kc + (c-b)
```

所以 入口距离为 环长度 - 相遇前已经走过的路径 。 也就等于从相遇的地方走回入口处 c-b

```js
// a = c - b
function circle_entry(head) {
  // 返回h相遇点
  function isCircle(head) {
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
      if (slow === fast) {
        return fast;
      }
      slow = slow.next;
      fast = fast.next.next;
    }
    return null;
  }
  // 返回环入口
  function findCircle(start, meet) {
    return !!meet
      ? start === meet
        ? start
        : findCircle(start.next, meet.next)
      : -1;
  }
  return findCircle(head, isCircle(head));
}
```

## 两个有序链表的合并

### 原地修改

### 额外 O(n+m)空间

关联 leetcode [21](https://leetcode-cn.com/problems/merge-two-sorted-lists/) [23](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

## 删除链表中倒数第 n 个节点

> 倒数第几个：快指针比慢指针快了几次 -> 让快指针优先行动 n 次,再遍历直到快指针到结束，此时的慢指针就是要删除的位置

关联 leetcode [19](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
