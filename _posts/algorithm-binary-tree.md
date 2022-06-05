---
title: 算法-二叉树-刷题
categories: [算法]
tags: [二叉树]
toc: true
date: 2021/6/23
---

leetcode 二叉树题目刷题，解题

<!-- more -->

# 116

给定一个完美二叉树，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下:

```js
function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.next = null;
}
```

题目链接：[116. Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

题目的意思是，把二叉树的每一层节点都用 next 指针连接起来。

![](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

```js
var connect = function (root) {
  if (!root) return null;

  // 函数定义：传入两个相邻节点，将其关联起来
  connectCore(root.left, root.right);

  return root;

  function connectCore(left, right) {
    if (!left || !right) return;

    left.next = right;

    connectCore(left.left, left.right);
    connectCore(right.left, right.right);
    connectCore(left.right, right.left);
  }
};
```

# 114

这道题目需要深刻意识到后续遍历压栈的重要性
每次 flatten 都会保存当时的 root 变量 快照。
前一次 flatten 和 后一次 flatten 之间 通过 root.right 联系在一起。不需要通过 返回值来实现关联不同栈

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  if (!root) return null;

  flatten(root.left);
  flatten(root.right);

  const leftChild = root.left;
  const rightChild = root.right;

  root.right = leftChild;
  root.left = null;

  while (root.right) {
    root = root.right;
  }

  root.right = rightChild;
};
```

# 297 二叉树的序列化和反序列化

[leetcode: 297](https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/)

tips: 前序遍历的形式多种多样，不能局限于传统的形式。

这道题目的难点在于如何对前序遍历得到的字符串进行 deSerialize。

```py
def preOrder(TreeNode root):
  if !root:
    return
  preOrder(root.left)
  preOrder(root.right)
```

通过后序遍历得到序列化后的字符串，格式为前序遍历。

比如对于如下二叉树，返回的结果为 `[5,4,3,2,#,#,#,#,#]`

```js
               5
         4           3
     2         null   null
null  null
```

得到了序列化后的字符串，就得到了前序遍历的顺序，我们只需要对着字符串的顺序重新进行一次前序遍历就可以重建这颗树。代码如下

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  return serializeCore(root);
  function serializeCore(root) {
    if (!root) return "#";
    const left = serializeCore(root.left);
    const right = serializeCore(root.right);
    return `${root.val},${left},${right}`;
  }
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  const nodeList = data.split(",");
  return deserializeCore(nodeList);
  function deserializeCore(nodeList) {
    if (!nodeList.length) return null;
    if (nodeList[0] === "#") {
      nodeList.shift();
      return null;
    }
    const root = new TreeNode(nodeList.shift());
    root.left = deserializeCore(nodeList);
    root.right = deserializeCore(nodeList);
    return root;
  }
};
```

# 652 寻找重复子树

[leetcode 652](https://leetcode-cn.com/problems/find-duplicate-subtrees/)

这道题目可以简化为，在一堆物品中寻找存在重复的物品。寻找重复项，必定需要遍历所有物品，将所有查看过的记录下来，方便下一个物体比较。
伪代码如下：

```py
# 维护一个table 来记录已经访问过的，每种类别只需要记录一次
table = hashTable
def findCommon(list):
  # 遍历这一堆物品
  for item in list:
    # 记录访问过的物品
    if hashTable[item]: hashTable[item] += 1
    else hashTable[item] = 1
  return table中计数大于1的item
```

对应到这道题目，物品就是**节点对应的子树**，框架稍微改变下如下：

```py
table = hashTable
ansList = hashSet
def findCommon(root):
  if !root: return null
  # 记录访问过的
  if table.get(root 对应的子树):
    ansList.add(table.get(root 对应的子树))
  else:
    table.set(root 对应的子树): root
  # 通过前序遍历整颗树
  findCommon(root.left)
  findCommon(root.right)
```

那么如果获取到 root 的子树呢？leetcode 297，也就是上一题，提供了一个思路：序列化。

```py
def serialize(root):
  if !root: return '#'
  leftString = serialize(root.left)
  rightString = serialize(root.right)

  return root.val + leftString + ',' + rightString + ','
```

因此完整代码如下:

```js
var findDuplicateSubtrees = function (root) {
  const map = {};
  const result = new Set();

  travel(root);
  function travel(root) {
    if (!root) return;
    if (map[serialize(root)]) {
      result.add(map[serialize(root)]);
    } else {
      map[serialize(root)] = root;
    }
    travel(root.left);
    travel(root.right);
  }
  return [...result];
};

// 后序遍历得到序列化结果
function serialize(node) {
  if (!node) return "#";
  const leftChild = serialize(node.left);
  const rightChild = serialize(node.right);
  return `${node.val},${leftChild},${rightChild}`;
}
```
