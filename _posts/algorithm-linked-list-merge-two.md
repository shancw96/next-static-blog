---
title: 算法-合并有序链表
categories: [算法]
tags: [linkedList]
toc: true
date: 2020/6/22
---

https://leetcode-cn.com/problems/merge-two-sorted-lists/

![image-20211213085535759](https://tva1.sinaimg.cn/large/008i3skNgy1gxbx9fcs5tj30dn0mymy9.jpg)

题目解读：合并两个有序递增链表，未强调空间复杂度。

这个算法的逻辑类似于「拉拉链」，l1, l2 类似于拉链两侧的锯齿，指针 p 就好像拉链的拉索，将两个有序链表合并。

代码中还用到一个链表的算法题中是很常见的「虚拟头结点」技巧，也就是 dummy 节点。你可以试试，如果不使用 dummy 虚拟节点，代码会复杂很多，而有了 dummy 节点这个占位符，可以避免处理空指针的情况，降低代码的复杂性。

<!-- more -->

# iteration

思路：维护一个新的链表 ans 作为最终结果，通过两个指针 p1, p2，记录对应链表的起始位置。循环比较两个指针指向的节点的值，将最小值加入链表 ans 中，并移动较小的指针。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  let dummyHead = new ListNode(null);
  let move = dummyHead;
  while (list1 && list2) {
    if (list1.val > list2.val) {
      move.next = new ListNode(list2.val);
      list2 = list2.next;
    } else {
      move.next = new ListNode(list1.val);
      list1 = list1.next;
    }
    // move.next = list1.val > list2.val ? new ListNode(list2.val) : new ListNode(list1.val);
    move = move.next;
  }
  if (list1) {
    move.next = list1;
  }
  if (list2) {
    move.next = list2;
  }
  return dummyHead.next;
};
```

# recursive

l1 表示链表 1，l2 表示链表 2

思路：分析基本情况和一般情况。

**base case**: 其中一个链表为 null，需要返回另外一个链表

```js
mergeTowLinkedList:
	if l1 == null return l2
	if l2 == null return l1
```

**normal case:** 两个链表都不为 0, 需要比较大小，并将较小的和已经合并好的链表链接

```js
mergeTwoLinkedList: if (l1.val < l2.val)
  l1.next = mergeTwoLinedList(l1.next, l2);
else l2.next = mergeTwoLinkedList(l1, l2.next);
```

**疑问：**

- 为什么 l1.next = mergeTwoLinedList(l1.next, l2); 而不是 l1.next = mergeTwoLinedList(l1, l2.next);

  l1 表示当前节点，那么已经合并好的链表就应该是 l1.next 和 l2,因此函数调用 mergeTwoLinedList(l1.next, l2)。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  if (l1 == null) {
    return l2;
  } else if (l2 == null) {
    return l1;
  }

  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
```
