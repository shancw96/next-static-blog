---
title: 树结构 字段映射与丰富
categories: [前端]
tags: [implement]
toc: true
date: 2021/12/17
---

前端目录树非常通用，一般结构为

```ts
type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  [key: string]: any;
};
type TreeList = TreeNode<unknown>[];
```

这篇文章提供了两个 util 处理 TreeNode 特定 key 的映射与额外 key 丰富，从而实现前端展现树与后端存储树的桥接。

<!-- more -->

### dfs

tree 的遍历，需要使用基本的深度优先遍历，基本结构如下:

```ts
const treeLoop = (treeNode: TreeNode) => {
  const { children } = treeNode;
  // do something here
  if (children) {
    children.forEach(treeLoop);
  }
};
```

### key 映射

```ts
const treeDataMock = [
  {
    title: "parent 0",
    key: "0-0",
    children: [
      { title: "leaf 0-0", key: "0-0-0", isLeaf: true },
      { title: "leaf 0-1", key: "0-0-1", isLeaf: true },
    ],
  },
  {
    title: "parent 1",
    key: "0-1",
    children: [
      { title: "leaf 1-0", key: "0-1-0", isLeaf: true },
      { title: "leaf 1-1", key: "0-1-1", isLeaf: true },
    ],
  },
];

type TreeNodeProps = {
  title: string;
  key: string;
  children: any;
  [key: string]: any;
};
// 替换 原有树结构的key 和 value 为特定 key value
const treeDataMapping = (
  originDef: TreeNodeProps,
  mappedDef: TreeNodeProps,
  treeData: TreeNodeProps[]
) => {
  const {
    title: originTitle,
    key: originKey,
    children: originChildren,
  } = originDef;
  const {
    title: mappedTitle,
    key: mappedKey,
    children: mappedChildren,
  } = mappedDef;
  return treeData?.map(mapCore);

  function mapCore(item: TreeNodeProps) {
    const newNode = {
      [mappedTitle]: item[originTitle],
      [mappedKey]: item[originKey],
    };
    return item?.[originChildren] instanceof Array
      ? {
          ...newNode,
          [mappedChildren]: item[originChildren].map(mapCore),
        }
      : { ...newNode, [mappedChildren]: [] };
  }
};

console.log(
  treeDataMapping(
    { title: "title", key: "key", children: "children" },
    { title: "areaName", key: "id", children: "children" },
    treeDataMock
  )
);
```

### TreeNode key 丰富

```ts
/**
 * 将特定的key value 添加到树结构中
 */
export const decorateTreeData = curry(
  (
    childrenKey: string,
    decoratorFn: (item: TreeNodeProps) => object,
    treeData: TreeNodeProps[]
  ) => {
    return treeData?.map(decorateCore);
    function decorateCore(item: TreeNodeProps) {
      return {
        ...item,
        ...decoratorFn(item),
        [childrenKey]:
          item?.[childrenKey] instanceof Array
            ? item?.[childrenKey].map(decorateCore)
            : [],
      };
    }
  }
);
```

### wrap up !

借助 ramda 提供的 pipe 方法，可以实现以上两个函数的组合，实现树结构的映射与丰富。

> 此处的 pipe 是 ramda 的函数组合，可以查看 [ramda 文档](https://ramdajs.com/docs/#pipe)
> 此处的 curry 是 ramda 的函数柯里化，可以查看 [ramda 文档](https://ramdajs.com/docs/#curry)
> 此处算法的复杂度可以认为是 O(n)，因为每个节点都会被遍历一次，但是每个节点的子节点只会被遍历一次，因为是递归，所以复杂度是 O(n),
> mapTreeProps O(n), decorateTreeData O(n) -> 2O(n) -> O(n)
> 此处的 mapTreeProps 和 decorateTreeData 可以放在一起做，但如果对性能要求不是很高，拆开更方便作为 util 使用。

```ts
const markNodeAsLeaf = (node) =>
  /*some judgement*/ validator(node) ? { isLeaf: true } : {};
const constructTree = pipe(
  mapTreeProps(
    { title: "areaName", key: "id", children: "children" },
    { title: "title", key: "key", children: "children" }
  ),
  decorateTreeData("children", markNodeAsLeaf)
);
```

```js
const originTree = {
  areaName: "1",
  id: "1-id",
  children: [
    {
      areaName: "1-1",
      id: "1-1-id",
    },
  ],
};
// ------- transfer to -------
const originTree = {
  title: "1",
  key: "1-id",
  isLeaf: false,
  children: [
    {
      title: "1-1",
      key: "1-1-id",
      isLeaf: true,
    },
  ],
};
```
