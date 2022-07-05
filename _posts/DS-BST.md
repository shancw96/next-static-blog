---
title: binary-search-tree
categories: [算法]
tags: [tree, binary-tree, binary-search-tree, AVL-tree, DFS, BFS]
toc: true
date: 2022/7/5
---

这篇文章介绍了数据结构 二叉搜索树及常用 api 的实现

<!-- more -->

## Table of Content

## 介绍

二叉搜索树又称为排序二叉树/有序二叉树。二叉搜索树的每个节点大于左侧子节点，并且小于右侧子节点

> [wikipedia](https://en.wikipedia.org/wiki/Binary_search_tree): In computer science, a binary search tree (BST), also called an ordered or sorted binary tree, is a rooted binary tree data structure with the key of each internal node being greater than all the keys in the respective node's left subtree and less than the ones in its right subtree. The time complexity of operations on the binary search tree is directly proportional to the height of the tree.

## 实现

- [查看源码 github](https://github.com/shancw96/tech-basis/blob/master/dataStructure/binary-search-tree.ts)
- [查看测试用例 github](https://github.com/shancw96/tech-basis/blob/master/test/bst.test.ts)

### 数据结构

BST 的数据结构可以拆分成两部分，TreeNode 描述 Node 节点，BinarySearchTree 描述最终的数据结构

#### TreeNode

简化的 TreeNode 格式如下，left 表示左子节点，right 表示右子节点。我们在这篇文章中，使用 val 来表示 TreeNode 的存储值。
这棵树 val 为数值型，方便演示常用 api 操作。

```typescript
export class TreeNode {
  left?: TreeNode;
  right?: TreeNode;
  val?: any;
  constructor(val: any) {
    this.val = val;
  }
}
```

#### BinarySearchTree

二叉搜索树，拥有 root 变量表示根节点，拥有 min getter 表示当前的最小值，拥有 max getter 表示当前的最大值

常用的 API 有：

- insert
- search
- delete

```typescript
class BinarySearchTree {
  root?: TreeNode;
  constructor() {}
  insert(val: number) {}
  search(val: number) {}
  delete(val: number) {}
}
```

### API - insert

二叉搜索树的插入，需要遵循二叉搜索树的规范 `left.val < root.val < right.val`，插入新值后，依旧是一颗 BST

我们约定 root 为当前访问的节点，node 为需要插入的节点

- 如果 node.val < root.val

  1. root 为最小值：将 root.left 指向 node
  2. root 非最小值，访问 root.left，递归进行上述操作

- 如果 node.val > root.val
  1. root 为最大值：将 root.right 指向 node
  2. root 非最大值：访问 root.right，递归进行上述操作

```typescript
function insertNode(root: TreeNode, node: TreeNode) {
  // if node.val < root.val
  // travel left
  if (node.val < root.val) {
    // before travel, if left is null, insert
    if (!root.left) {
      root.left = node;
    }
    // recursive travel left
    else {
      insertNode(root.left, node);
    }
  } else {
    if (!root.right) {
      root.right = node;
    } else {
      insertNode(root.right, node);
    }
  }
}
```

### API - search

二叉搜索树的搜索，借助其特性，可以很简单直观的实现。
传入一个值，我们约定他为 target，

1. 如果 target 和 root.val 相同，搜索结束。
2. 如果 target 比当前 root 小，那么我们去 root 的左侧子树进行相同的比较操作。
3. 如果 target 比当前 root 大，那么去 root 的右侧树进行相同的比较操作
4. 递归的去进行上述操作，直到找出最终结果

```typescript
function searchNode(
  root?: TreeNode,
  parent?: TreeNode
): [TreeNode?, TreeNode?] {
  if (!root || root.val === val) return [root, parent];
  else if (root?.val < val) return searchNode(root.right, root);
  else return searchNode(root.left, root);
}
```

> tips: 此处返回了一个数组，表示当前搜索的结果 node 和它对应的 parent

#### API - 删除

二叉树的删除操作，需要根据被删除节点的状态进行区分

1. 被删除节点是没有 children (leaf node): 直接将其 parent 的对应 child（left/right）指针置空

   ![image-20220705155937375](http://serial.limiaomiao.site:8089/public/uploads/image-20220705155937375.png)

2. 被删除节点只有一个 child: 将 parent 和 child 进行连接

   ![image-20220705160452917](http://serial.limiaomiao.site:8089/public/uploads/image-20220705160452917.png)

3. 被删除的节点有两个 child：

   1. 找到 Node 右子树 的最小值，将其 val 设置为当前值，并删掉右子树的最小值，我们称之为 minNode，minNode 的删除需要考虑如下两种场景

      ![IMG_9B410E00C7E5-1](http://serial.limiaomiao.site:8089/public/uploads/IMG_9B410E00C7E5-1.jpeg)

      - minNode 如果是 leaf Node (33.5)，那么直接删除

        ![IMG_4D15AB7B7A5F-1](http://serial.limiaomiao.site:8089/public/uploads/IMG_4D15AB7B7A5F-1.jpeg)

        ​

      - minNode(33.5) 如果存在 right child (33.7) , 那么参考第二点，将其 parent 和 其 child 进行连接

        ![IMG_655811650F64-1](http://serial.limiaomiao.site:8089/public/uploads/IMG_655811650F64-1.jpeg)

   2. 或者 找到 Node 左子树 的最大值，将其 val 设置为当前值，并删掉左子树的最大值

```typescript

  delete(val: any) {
    const [node, parent] = this.search(val);

    // special case1
    if (!node) return;
    // special case2
    else if (!parent) {
      this.root = undefined;
    }
    // case1: 被删除节点是没有 children (leaf node): 直接将其 parent 的对应 child（left/right）指针置空
    else if (isLeafNode(node)) {
      // whether root
      const childKey = getChildKeyFlag(node, parent as TreeNode);

      if (!childKey) throw new Error('should never happen');

      parent[childKey] = undefined
    }
    // case3: 被删除的节点有两个 child
    else if (isBothChildNode(node)) {
      // find min node in right sub tree
      const minNode = BinarySearchTree.min(node as TreeNode);
      // replace val
      node.val = minNode.val;
      // remove minNode in right sub tree
      // minNode has right child
      if (minNode.right) {
        node.right = minNode.right;
      }
      const minNodeParent = minNode.parent as TreeNode;
      // minNode is Leaf Node
      if (minNodeParent && isLeafNode(minNode)) {
        minNodeParent.left = undefined;
      }
    }
    // single child node
    else {
      const childKey = getChildKeyFlag(node, parent as TreeNode);
      if (!childKey) throw new Error('should never happen');
      const nodeKey = node.left ? 'left' : 'right'
      parent[childKey] = node[nodeKey]
    }


    function isLeafNode(node: TreeNode) {
      return !node.left && !node.right
    }

    function isBothChildNode(node: TreeNode) {
      return !!node.left && !!node.right
    }

    function getChildKeyFlag(node: TreeNode, parent: TreeNode): 'left' | 'right' | '' {
      return parent.left?.val === node.val
        ? 'left'
        : parent.right?.val === node.val
        ? 'right'
        : ''
    }
  }
```

## lc-1038:二叉搜索树 -> 累加树

Given the root of a binary search tree with distinct values, modify it so that every node has a new value equal to the sum of the values of the original tree that are greater than or equal to node.val.

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

## lc-236 二叉树的最近公共祖先

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

###
