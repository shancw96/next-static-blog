---
title: 算法-二分搜索
categories: [算法]
tags: [two-pointers]
toc: true
date: 2023/1/31
---

二分搜索模版：

模版 1:

```python
def search_left_bound(arr, target):
  left = 0
  right = len(arr)
  while left < right:
    mid = (left + right) // 2
    if arr[mid] >= target:
      right = mid
    else:
      left = mid+1
  return left
```

模版 2

```python
def search_right_bound(arr, target):
  left = 0
  right = len(arr)
  while left < right:
    mid = (left + right + 1) // 2
    if arr[mid] <= target:
      left = mid
    else:
      right = mid - 1
  return left

```

<!--more-->

问题 1: 在排序数组中查找元素的第一个和最后一个位置

```
# 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

# 如果数组中不存在目标值 target，返回 [-1, -1]。

# 你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

# 输入：nums = [5,7,7,8,8,10], target = 8
# 输出：[3,4]
```

思路，先使用左边界模版找到第一个位置， 右侧位置查找 target + 1 得到右侧位置，然后减一即可。

```python
def search_left_bound(arr, target):
  left = 0
  right = len(arr)
  while left < right:
    mid = (left + right) // 2
    if arr[mid] >= target:
      right = mid
    else:
      left = mid + 1
  return mid

left = search_left_bound(arr, target)
right_next = search_left_bound(arr, target + 1)

return left == right_next ? [-1, -1] : [left, right_next - 1]
```
