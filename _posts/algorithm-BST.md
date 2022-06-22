---
title: 算法-二叉树
categories: [算法]
tags: [tree，binary-tree, binary-search-tree]
toc: true
date: 2020/8/6
---

# 什么是 BST

一句话概括：有序的二叉树

- 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
- 若任意节点的右子树不空，则右子树上所有节点的值均大于或等于它的根节点的值；
- 任意节点的左、右子树也分别为二叉查找树；
  > BST 通常采用 linkedList 作为存储结构。
  > 通过中序遍历能够得到 BST 的从小到大的有序排列（累加相关问题的解决办法）

BST 的时间复杂度最坏为 O(n),此时 BST 表现为线性表形式（只有右/左 单个节点树），为了解决这个问题，衍生出了[AVL](https://zh.wikipedia.org/wiki/AVL%E6%A0%91)，和[红黑树](https://zh.wikipedia.org/wiki/%E7%BA%A2%E9%BB%91%E6%A0%91)

# leetcode

## 1038:二叉搜索树 -> 累加树

Given the root of a binary search tree with distinct values, modify it so that every node has a new value equal to the sum of the values of the original tree that are greater than or equal to node.val.
<img src="1038.png" style="zoom:50%" alt="二叉搜索树 -> 累加树">

**分析**
对于中序遍历的二叉搜索树[1,2,3,4]

- 根据图中可得到的信息为：从右往左累加， 这是一个累加模型， [4,3+4,2+3+4,1+2+3+4]
  ```js
  root.val = accSum(root.right) + root.val;
  ```
- 对于二叉搜索树，中序遍历出来的结果即为递增有序数列[1,2,3,4]，而逆中序遍历出来的为递减有序数列 [4,3,2,1]
  ```js
  中序遍历 伪代码：
  inorder: node
    inorder(node.left)
    operate(node)
    inorder(node.right)
  逆中序遍历 伪代码：
  reverseinorder: node
    inorder(node.right)
    operate(node)
    inorder(node.left)
  ```

由上面两点可得到解决方法：逆中序遍历节点 + 记录累加值并在遍历的时候进行修改 = 题目要求的累加树

```js
var bstToGst = function (root) {
  let accSum = 0;
  function reverseInorder(root) {
    if (!root) return;
    reverseInorder(root.right);
    // operation
    root.val += accSum;
    accSum = root.val;

    reverseInorder(root.left);
  }
};
```

### 题目小结

二叉搜索树本质上还是有序列表，通过中序遍历能够得到从小到大的排列

## 236 二叉树的最近公共祖先

<img src="236.png" style="zoom:50%" alt="二叉树的最近公共祖先">
这道题目 主要是通过后序遍历进行状态传递，如果同时满足要求的条件，则证明它是最近公共祖先。

条件 1：如果 p q 分别在当前节点的左右子树上，那么该节点是最近公共祖先

```js
isInLeftChild && isInRightChild;
```

条件 2：如果当前节点是他自己的祖先，并且另外一个节点在左右子树的任一个上，那么该节点是最近公共祖先

```js
isInCur && (isInLeftChild || isInRightChild);
```

状态传递：后序遍历从下往上传递是否存在的状态（在左右子树或当前节点），只要有一个满足条件，则向上传递 true

```js
// 节点不存在 传递状态 false
return false;
// 节点存在 根据情况传递
return isInRightChild || isInLeftChild || isInCur;
```

结束条件：

1. 当前节点不存在 return false（状态传递）
2. 满足公共祖先节点要求 return node （结果输出）

```js
var lowestCommonAncestor = function (root, p, q) {
  if (!root) return false;
  // 递 - 记录层级信息 归 - 回溯层级信息
  const isInLeftChild = lowestCommonAncestor(root.left, p, q);
  const isInRightChild = lowestCommonAncestor(root.right, p, q);
  const isInCur = root.val === p.val || root.val === q.val;
  if (
    (isInLeftChild && isInRightChild) ||
    (isInCur && (isInLeftChild || isInRightChild))
  ) {
    return root;
  }
  return isInRightChild || isInLeftChild || isInCur;
};
```

### 小结

此题最重要的是，理解状态传递的思想，弄明白后序遍历的过程（递 - 记录层级信息 归 - 回溯层级信息）
