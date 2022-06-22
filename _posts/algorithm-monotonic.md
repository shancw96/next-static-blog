---
title: 单调栈，单调队列思想的接触与使用
categories: [算法]
tags: [monotonic-stack]
toc: true
date: 2021/6/21
---

单调栈，每次新元素入栈后，栈内的元素都保持有序。和二叉堆维护有序不同在与，<span class="text-red">单调栈实现更简单，不保留所有的栈元素</span>。
![单调栈](/images/algorithm/monotonic-describe.png)

<!-- more -->

# 模版题目: [链接-496.next greater element](https://leetcode.com/problems/next-greater-element-i/)

```js
function nextGreaterElement(numList) {
  const ans = [];
  const stack = [];
  for (let i = numList.length - 1; i >= 0; i--) {
    while (stack.length && top(stack) < numList[i]) {
      stack.pop();
    }
    ans[i] = stack.length ? top(stack) : -1;
    stack.push(numList[i]);
  }
  return ans;
}

function top(arr) {
  if (!(arr instanceof Array)) throw new TypeError("stack type must be array");
  return arr[arr.length - 1];
}
```

# 滑动窗口的最大值 [239: Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

```js
class monotonicQueue {
  constructor() {
    this.queue = [];
  }

  push(item) {
    while (this.peek() <= item) {
      this.queue.pop();
    }
    this.queue.push(item);
  }

  peek() {
    return this.queue[this.queue.length - 1];
  }

  pop(num) {
    if (num == this.max()) {
      this.queue.shift();
    }
  }

  max() {
    return this.queue[0];
  }
}

function maxSlidingWindow(nums, size) {
  const queue = new monotonicQueue();
  let ans = [];
  let left = 0;
  let right = size - 1;

  for (let i = left; i <= right; i++) {
    queue.push(nums[i]);
  }
  ans.push(queue.max());

  while (right < nums.length) {
    queue.pop(nums[left]);
    left += 1;
    right += 1;
    if (typeof nums[right] == "number") {
      queue.push(nums[right]);
      ans.push(queue.max());
    }
  }

  return ans;
}

console.log(maxSlidingWindow([9, 11], 2));
```
