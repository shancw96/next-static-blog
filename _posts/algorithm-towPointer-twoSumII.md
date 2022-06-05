---
title: 算法 - 双指针 - twoSum
categories: [算法]
tags: []
toc: true
date: 2021/6/15
---

twoSum 问题 除了使用 哈希表时间换空间外,<span class="text-red">对于有序递增的 twoSum 集合, 比如[1,3,4,6,7]</span> 还可以使用双指针的方式实现，时间复杂度为 O(n)，可优化为 O(logn)。

<!-- more -->

O(n) 时间复杂度

```js
function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const tempSum = nums[left] + nums[right];
    if (tempSum == target) return [left + 1, right + 1];
    else if (tempSum < target) {
      left += 1;
    } else if (tempSum > target) {
      right -= 1;
    }
  }
  return false;
}
```

O(logn) 时间复杂度

使用二分搜索，降低指针移动的次数，从 O(n) -> O(logn)

```js
function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const tempSum = nums[left] + nums[right];
    if (tempSum == target) return [left + 1, right + 1];
    else if (tempSum < target) {
      left = binary_search(nums, target - nums[right], "right");
    } else if (tempSum > target) {
      right = binary_search(nums, target - nums[left], "left");
    }
  }
  return false;
}
function binary_search(nums, target, mode) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = parseInt(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] < target) {
      left = mid + 1;
    }
  }
  return mode === "left" ? right : left;
}
```
