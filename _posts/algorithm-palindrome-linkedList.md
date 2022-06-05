---
title: 算法 - 回文链表
categories: [算法]
tags: [algorithm, linkedList]
toc: true
date: 2020/6/18
---

# 请判断一个链表是否为回文链表

> 要求为时间复杂度 O(n) 空间复杂度 O(1)

[关联 leetcode234](https://leetcode-cn.com/problems/palindrome-linked-list/)
例子 1:

```js
输入：1->2
输出：false
```

例子 2:

```js
输入：1->2->2->1
输出：true
```

## 解决方法 1:半栈法

时间复杂度:O(n) 空间复杂度 O(n/2)

> 快慢指针遍历链表时间复杂度 O(n/2)，在此期间，使用栈保存慢指针的引用。遍历结束后，慢指针指向中间点
> 慢指针接着遍历剩余链表，并逐个将栈中保存的指针引用进行出栈与慢指针对应的值进行比较 时间复杂度 O(n/2) 空间复杂度 O(1)
> 时间复杂度：O(n) 空间复杂度 O(n/2)

```js
const isPalindrome = (head) => {
  // 快慢指针遍历链表
  let fast = head;
  let slow = head;
  let stack = [];
  while (fast && fast.next) {
    stack.push(slow);
    fast = fast.next.next;
    slow = slow.next;
  }
  // 栈弹出
  if (fast) slow = slow.next; //当fast存在的情况下，为奇数， slow 进入下半段。否则slow 已为下半段
  while (slow) {
    const last = stack.pop();
    if (slow.val !== last.val) return false;
    slow = slow.next;
  }
  return true;
};
```

## 解决方法 2: 原地修改法

时间复杂度:O(n) 空间复杂度 O(1)
参考：[Palindrome Linked List](https://github.com/andavid/leetcode-java/blob/master/note/234/README.md)

> 使用快慢两个指针找到链表中点，慢指针每次前进一步，快指针每次前进两步。在慢指针前进的过程中，同时修改其 next 指针，使得链表前半部分反序。最后比较中点两侧的链表是否相等。
> 这个解法主要关注原地修改链表指针，并能够保持关联的方式

```js
const isPalindrome = (head) => {
  let prev = null;
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    let next = slow.next;
    slow.next = prev;
    prev = slow;
    slow = next;
  }
  //如果是奇数个，则slow 手动进入下半段
  if (fast) {
    slow = slow.next;
  }
  // 比较前后两段
  while (slow) {
    if (slow.val !== prev.val) return false;
    slow = slow.next;
    prev = prev.next;
  }
  return true;
};
```

# 小结

- 原地修改链表指向，并不丢失整个链表，可以通过 prev 前置指针来进行操作
- 快慢指针判断链表奇偶，在遍历结束后可以通过 fast 是否为 null 判断
