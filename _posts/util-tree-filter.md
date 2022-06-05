---
title: 树结构节点过滤
categories: [前端]
tags: [implement]
toc: true
date: 2021/10/15
---

树节点过滤，将不符合条件的过滤掉。使用场景：导航栏隐藏部分内容。
`treeFilter(tree, node => {/*how to hide the tree node*/})`

<!-- more -->

```js
const treeFilter = (root, hideFn) => {
  if (!root || !root.children) return null;
  if (hideFn(root)) return null;

  const children = root.children
    .filter((child) => !hideFn(child))
    .map((item) => treeFilter(item, hideFn));
  return {
    ...root,
    children,
  };
};
const mockData = [
  {
    name: "1",
    show: true,
    children: [
      {
        name: "2",
        show: true,
        children: [
          {
            show: false,
            name: "3",
          },
        ],
      },
      {
        name: "1-2",
        show: true,
        children: [
          {
            show: true,
            name: "1-3",
          },
          {
            show: false,
            name: "1-4",
          },
        ],
      },
    ],
  },
  {
    name: "a",
    show: true,
    children: [
      {
        name: "b",
        show: false,
        children: [
          {
            show: true,
            name: "c",
          },
        ],
      },
    ],
  },
  {
    name: "i",
    show: false,
  },
];

const travelFn = (node, operation) => {
  if (!node) return;
  operation(node);
  node.children.forEach((child) => travelFn(child, operation));
};

const dummyTree = {
  show: true,
  children: mockData,
};

travelFn(
  treeFilter(dummyTree, (node) => !node.show),
  (item) => console.log(item)
);
```
