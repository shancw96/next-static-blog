---
title: 算法 - 二叉堆
categories: [算法]
tags: [stack, heap]
toc: true
date: 2021/6/20
---

参考：[labuladong 图文详解二叉堆，实现优先级队列](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247484495&idx=1&sn=bbfeba9bb5cfd50598e2a4d08c839ee9&chksm=9bd7fa47aca073512e094110a7fe7d9bac052be114d1db72fe07b7efa6beb915f51b3f19291e&scene=21#wechat_redirect)
二叉堆，以数组的方式模拟二叉树，主要操作有两个, sink（下沉）和 swim(上浮)，用以维护二叉堆的性质。其主要应用有两个，首先是一种排序方法「堆排序」，第二是一种很有用的数据结构「优先级队列」。

这篇文章以二叉堆来实现优先级队列。以后会增加二叉堆的堆排序实现

<!-- more  -->

# 什么是二叉堆

二叉堆是用数组来实现的完全二叉树。通过数组索引实现节点间的关联,如果<span class="text-red text-bold"> 把 arr[1] 作为整棵树的根</span>，
每个节点的父节点和左右孩子的索引都可以通过简单的运算得到。，如下代码为索引实现父节点，子节点的方式：

```js
parent (index) {
  return parseInt(index / 2);
}

leftChild(index) {
  return index * 2;
}

rightChild(index) {
  return index * 2 + 1
}
```

二叉堆还分为最大堆和最小堆。<span class="text-red"> 最大堆的性质是：每个节点都大于等于它的两个子节点。类似的，最小堆的性质是：每个节点都小于等于它的子节点</span>。

# 最大堆实现优先级队列

优先级队列结构有一个很有用的功能，你插入或者删除元素的时候，元素会自动排序。主要 API 为 insert 和 delete，基本结构如下

```js
class MaxBinaryHeap {
  constructor(compareFn) {
    this.pq = ['__BLANK__'];
    this.size = 0;
    this.compareFn = compareFn || ((a, b) => a < b);
  },
  // **********核心功能**********
  // 上浮
  swim(index) {}
  // 下潜
  sink(index) {}
  // 插入新数据
  insert(num) {}
  // 删除最大值
  deleteMax() {}
  // **********utils**********
  delete(index) {}
  // 大小比较，Index a对应的值 是否比 Index b 对应的值小
  less(a, b) {
    return this.compareFn(this.pq[a], this.pq[b]);
  }
  // 交换
  exchange(index1, index2) {
    [this.pq[index1], this.pq[index2]] = [this.pq[index2], this.pq[index1]]
    return index2;
  }
  // 返回最大值
  get max() {
    return this.pq[1];
  }
  // 子节点 left
  childLeft(index) {
    return this.pq[index * 2];
  }
  childRight(index) {
    return this.pq[index * 2 + 1];
  }
  // 父节点
  parent(index) {
    return this.pq[parseInt(index / 2)];
  }
}
```

## 实现 swim 和 sink

维护堆结构，当插入和删除指定元素的时候，会破坏最大堆的性质。因此需要对破坏最大堆性质的节点进行位置调整。

- 如果某个节点 A 比它的子节点（中的一个）小，那么 A 就不配做父节点，应该下去，下面那个更大的节点上来做父节点，这就是对 A 进行下沉。

  ```js
  // 下潜
  sink(index) {
    let tempIndex = index;
    while(this.pq[tempIndex] < Math.max(this.childLeft(tempIndex), this.childRight(tempIndex))) {
      const biggerChildIndex = this.childLeft(tempIndex) < this.childRight(tempIndex) ? tempIndex * 2 + 1 : tempIndex * 2;
        this.exchange(tempIndex, biggerChildIndex)
        tempIndex = biggerChildIndex;
    }
  }
  ```

- 如果某个节点 A 比它的父节点大，那么 A 不应该做子节点，应该把父节点换下来，自己去做父节点，这就是对 A 的上浮。
  ```js
  swim(index) {
    let tempIndex = index;
    while(tempIndex > 1 && this.less(parseInt(tempIndex / 2), tempIndex)) {
      this.exchange(parseInt(tempIndex / 2), tempIndex);
      tempIndex = parseInt(tempIndex / 2);
    }
  }
  ```

## 实现 delMax 和 insert

insert 方法先把要插入的元素添加到堆底的最后，然后让其上浮到正确位置。

```js
// 插入新数据
insert(num) {
  this.size += 1;
  this.pq[this.size] = num;
  this.swim(this.size);
}
```

delMax 方法先把堆顶元素 A 和堆底最后的元素 B 对调，然后删除 A，最后让 B 下沉到正确位置。

```js
deleteMax() {
  this.delete(1);
  return this.max;
}

delete(index) {
  this.exchange(index, this.size);
  this.pq.splice(this.size);
  this.size -= 1;
  this.sink(index);
}
```

# 应用

## 实现合并 K 个有序链表的算法

[leetcode: 23](https://leetcode.com/problems/merge-k-sorted-lists/)

实现合并 k 个有序链表的算法需要用到优先级队列（Priority Queue），这种数据结构是「二叉堆」最重要的应用。

[原文](https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247484499&idx=1&sn=64f75d4bdbb4c5777ba199aae804d138&chksm=9bd7fa5baca0734dc51f588af913140560b994e3811dac6a7fa8ccfc2a31aca327f1faf964c2&scene=21#wechat_redirect)

### 最小堆实现合并 k 个链表

```js
function mergeKLists(lists) {
  const linkedListHeap = new BinaryHeap(
    (node1, node2) => node1 && node2 && node1.val < node2.val
  );
  let movePointer = new ListNode();
  const head = movePointer;
  for (let head of lists) {
    if (head) {
      linkedListHeap.insert(head);
    }
  }

  while (linkedListHeap.size > 0) {
    let tempNode = linkedListHeap.pop();
    movePointer.next = tempNode;
    movePointer = movePointer.next;
    if (tempNode.next) {
      linkedListHeap.insert(tempNode.next);
    }
  }
  return head.next;
}
```

### 实现二叉堆

```js
class MinBinaryHeap {
  constructor(compareFn) {
    this.size = 0;
    this.pq = ["_"];
    this.isLeftLessRight = compareFn || ((a, b) => !!a && !!b && a < b);
  }

  insert(val) {
    this.size += 1;
    this.pq[this.size] = val;
    this.swim(this.size);
  }

  delMin() {
    this.swap(1, this.size);
    const popped = this.pq.pop();
    this.sink(1);
    this.size -= 1;
    return popped;
  }

  pop() {
    if (this.size >= 1) {
      return this.delMin();
    }
  }

  swim(index) {
    let tmp = index;
    while (tmp > 1 && this.isLeftLessRight(this.pq[tmp], this.parent(tmp))) {
      this.swap(parseInt(tmp / 2), tmp);
      tmp = parseInt(tmp / 2);
    }
  }

  sink(index) {
    let tmp = index;
    while (
      this.isLeftLessRight(this.childLeft(tmp), this.pq[tmp]) ||
      this.isLeftLessRight(this.childRight(tmp), this.pq[tmp])
    ) {
      let childIndex = tmp;
      if (this.childLeft(tmp) && this.childRight(tmp)) {
        childIndex = this.isLeftLessRight(
          this.childLeft(tmp),
          this.childRight(tmp)
        )
          ? tmp * 2
          : tmp * 2 + 1;
      } else if (this.childLeft(tmp)) {
        childIndex = tmp * 2;
      } else if (this.childRight(tmp)) {
        childIndex = tmp * 2 + 1;
      }

      this.swap(childIndex, tmp);
      tmp = childIndex;
    }
  }

  swap(a, b) {
    [this.pq[a], this.pq[b]] = [this.pq[b], this.pq[a]];
  }

  childLeft(index) {
    return this.pq[index * 2];
  }

  childRight(index) {
    return this.pq[index * 2 + 1];
  }

  parent(index) {
    return this.pq[parseInt(index / 2)];
  }
}
```
