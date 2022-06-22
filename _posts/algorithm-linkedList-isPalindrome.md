---
title: 算法-链表-回文链表判断
categories: [算法]
tags: [recursion, linkedList, singly-linked-list]
toc: true
date: 2021/6/13
---

> 参考**[labuladong 如何高效判断回文单链表？](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247484822&idx=1&sn=44742c9a3557038c8da7150100d94db9&chksm=9bd7fb9eaca0728876e1146306a09f5453bcd5c35c4a264304ea6189faa83ec12a00322f0246&scene=21#wechat_redirect)** > [leetcode: 234 Palindrome LinkedList](https://leetcode.com/problems/palindrome-linked-list/)

1. 借助递归的性质，巧妙解决回文链表问题

链表兼具递归结构，树结构不过是链表的衍生。那么，<span class="text-red text-bold"> 链表其实也可以有前序遍历和后序遍历：</span>

```js
void traverse(ListNode head) {
    // 前序遍历代码
    traverse(head.next);
    // 后序遍历代码
}
```

2. 使用快慢指针，迭代的方式解决

```js
let slow = head;
let fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
}
```

<!-- more -->

# 递归

对于链表 `linkedList([1,2,3,4,5,6])`，后序遍历的结果为 `6 5 4 3 2 1`。

```java
void traverse(ListNode head) {
    // 前序遍历代码
    traverse(head.next);
    // 后序遍历代码
    print(head.val);
}
```

<span class="text-red">借助链表的后序遍历，我们可以倒着获取链表节点，此时如果我们保留了原始的 head，就能够实现首尾节点的比较。</span>

```js
function isPalindrome(head) {
  const left = head;
  function traverse(right) {
    if (!right) return true; // 只有left一个节点，符合回文要求
    const ans = traverse(right.next);
    ans = ans && left.val === right.val;
    left = left.next; // left 右移动，而right 在这个快照结束后，就变成了 它的前面节点
  }
}
```

![图1](/images/algorithm/linkedList-isPalindrome.jpeg)

# 迭代

思路：将链表分为两块，然后遍历这两块是否完全一致。

## 使用快慢指针，得到分界点。

```js
function getRightHalf(head) {
  const slow = head;
  const fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
}
```

链表有可能为奇数个，也有可能为偶数个。它的快慢指针分布如图:
![图 2](/images/algorithm/linkedList-isPalindrome2.jpeg)
奇数情况下，需要手动移动慢指针，让其和偶数情况保持一致。

```js
if (fast) slow = slow.next;
```

## 将右侧链表的反转

```js
function reverse(head) {
  if (!head || !head.next) return head;
  const newHead = reverse(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

## 遍历

```js
function isPalindrome(head) {
  const rightOriginHalf = getRightHalf(head);
  const rightHead = reverse(rightOriginHalf);
  while (right) {
    if (right.val !== head.val) return false;
    head = head.next;
    right = right.next;
  }
  return true;
}
```
