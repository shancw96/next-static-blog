---
title: 多叉树路径查找
categories: [前端]
tags: [implement]
toc: true
date: 2021/4/25
---

使用方式

```js
const mockTree = [
  {
    label: "一级 1",
    id: "一级 1",
    children: [
      {
        label: "二级 1-1",
        id: "二级 1-1",
        children: [
          {
            label: "三级 1-1-1三级",
            id: "三级 1-1-1",
          },
        ],
      },
    ],
  },
  {
    label: "一级 2",
    id: "一级 2",
    children: [
      {
        label: "二级 2-1",
        id: "二级 2-1",
        children: [
          {
            label: "三级 2-1-1",
            id: "三级 2-1-1",
          },
        ],
      },
      {
        label: "二级 2-2",
        id: "二级 2-2",
        children: [
          {
            label: "三级 2-2-1",
            id: "三级 2-2-1",
          },
        ],
      },
    ],
  },
  {
    label: "一级 3",
    id: "一级 3",
    children: [
      {
        label: "二级 3-1",
        id: "二级 3-1",
        children: [
          {
            label: "三级 3-1-1",
            id: "三级 3-1-1",
          },
        ],
      },
      {
        label: "二级 3-2",
        id: "二级 3-2",
        children: [
          {
            label: "三级 3-2-1",
            id: "三级 3-2-1",
          },
        ],
      },
    ],
  },
];
const defaultProps = { key: "id", children: "children" };
const matchFn = (matchFn = (a, target) => a[defaultProps.key] === target);
findPath(mockTree, "二级 3-2", matchFn, defaultProps);

// --------- 结果
[
  {
    label: "一级 3",
    id: "一级 3",
    children: [...],
  },
  {
    label: "二级 3-2",
    id: "二级 3-2",
    children: [...],
  },
]


```

<!-- more -->

```js
const mockTree = [
  {
    label: "一级 1",
    id: "一级 1",
    children: [
      {
        label: "二级 1-1",
        id: "二级 1-1",
        children: [
          {
            label: "三级 1-1-1三级",
            id: "三级 1-1-1",
          },
        ],
      },
    ],
  },
  {
    label: "一级 2",
    id: "一级 2",
    children: [
      {
        label: "二级 2-1",
        id: "二级 2-1",
        children: [
          {
            label: "三级 2-1-1",
            id: "三级 2-1-1",
          },
        ],
      },
      {
        label: "二级 2-2",
        id: "二级 2-2",
        children: [
          {
            label: "三级 2-2-1",
            id: "三级 2-2-1",
          },
        ],
      },
    ],
  },
  {
    label: "一级 3",
    id: "一级 3",
    children: [
      {
        label: "二级 3-1",
        id: "二级 3-1",
        children: [
          {
            label: "三级 3-1-1",
            id: "三级 3-1-1",
          },
        ],
      },
      {
        label: "二级 3-2",
        id: "二级 3-2",
        children: [
          {
            label: "三级 3-2-1",
            id: "三级 3-2-1",
          },
        ],
      },
    ],
  },
];
/**
 *
 * @description 树节点路径查找
 * @param {Array} treeList [{id, children: [tree, ..., tree]}, tree]
 * @param {*} target 目标匹配对象
 * @param {*} compareFn 比较函数
 * @return {Array<tree>} 路径树节点列表
 */
export function findPath(
  treeList,
  target,
  compareFn,
  defaultProps = { key: "id", children: "children" }
) {
  if (!isFn(compareFn)) {
    throw new TypeError("比较函数不能为空");
  }
  if (!Array.isArray(treeList) || !treeList.length) {
    throw new TypeError("请输入正确的树结构[ [], [], ..., []]", treeList);
  }

  return findCore({
    [defaultProps.key]: null,
    [defaultProps.children]: treeList,
  });

  // 核心路径查找
  function findCore(tree, accPayload = []) {
    if (compareFn(tree, target)) return accPayload;
    if (isEmpty(tree[defaultProps.children])) return false; // 中断查找
    for (const childTree of tree.children) {
      const childValidPath = findCore(childTree, joinFn(accPayload, childTree));
      if (childValidPath) return childValidPath;
    }
  }
  // util：判断是否为函数
  function isFn(compareFn) {
    return Object.prototype.toString.call(compareFn) === "[object Function]";
  }
  // util：累加方法
  function joinFn(acc, cur) {
    return [...acc, cur];
  }
  // util：只对array做了判断，偷懒，为了可迁移写作这种格式
  function isEmpty(payload) {
    const type = Object.prototype.toString
      .call(payload)
      .replace(/(\[\w*)(\s)(\w*)\]/, "$3");
    return /undefined|null/i.test(type)
      ? true
      : type === "Array"
      ? !payload.length
      : true;
  }
}
```
