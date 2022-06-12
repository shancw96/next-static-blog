---
title: 数组转树
categories: [前端]
tags: [implement]
toc: true
date: 2021/1/11
---

```js
let input = [
  {id: 1, value: '学校', parentId: null},
  {id: 2, value: '班级1', parentId: 1},
  {id: 3, value: '班级2', parentId: 1},
  {id: 4, value: '学生1', parentId: 2},
  {id: 5, value: '学生2', parentId: 3},
  {id: 6, value: '学生3', parentId: 3},
]

let output = {
  {
    id: 1,
    value: '学校',
    parentId: null,
    children: [
      {
        id: 2,
        value: '班级1',
        parentId: 1,
        children: [
            {id: 4, value: '学生1', parentId: 2, children: []},
        ]
      },
      {
        id: 3,
        value: '班级2',
        parentId: 1,
        children: [
          {id: 5, value: '学生2', parentId: 3},
          {id: 6, value: '学生3', parentId: 3}
        ]
      },
    ]
  },
}
```

TOPIC:

1. 找到 parentId 为 null 设置为 root
2. 分离数组，id === parentId, 得到两个数组 A, B
3. 将 A 整合到 root
4. 将 B 遍历并递归执行 2.3 两步操作

```js
function transformTree(input = []) {
  if (input.length === 0) return {};
  const root = input.find((item) => !Number(item.parentId));
  transformCore(root, input);
  function transformCore(root, newInput = input) {
    if (!newInput.length) return;
    const [matchedItems, restItems] = newInput.reduce(
      (acc, cur) => {
        const index = cur.parentId === root.id ? 0 : 1;
        acc[index].push(cur);
        return acc;
      },
      [[], []]
    );
    root.children = matchedItems.map((item) => ({ ...item, children: [] }));
    root.children.forEach((child) => transformCore(child, restItems));
  }
  return root;
}
```
