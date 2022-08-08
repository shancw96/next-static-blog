---
title: 多叉树常用api实现
categories: [前端]
tags: [tree]
toc: true
date: 2022/7/19
---



这篇文章介绍了，多叉树的常用api实现（精确搜索，模糊搜索等。。。），虽然写成了class的形式，但可以很方便的抽离出来作为util使用

源码:

[sourceCode](https://github.com/shancw96/tech-basis/blob/master/dataStructure/normalTree/index.ts)

[tests](https://github.com/shancw96/tech-basis/blob/master/test/normalTree.test.ts)

<!-- more -->

## Table of Content



## 类型定义



TreeNode

```typescript
export interface TreeNode {
  key: string;
  label: string;
  children: TreeNode[];
}
```



CommonTree

```typescript
class NormalTree {
  root: TreeNode | null = null
  constructor(root?: TreeNode) {
    if (root) {
      this.root = root;
    }
  }
}
```



## Search

默认通过key，进行查询，返回查询出来的Node。

支持的参数：

+ target: 目标节点
+ matchFn：可选，自定义搜索规则，返回boolean，为true表示查询成功。默认情况下，根据key进行判断



实现：

先序遍历，当匹配成功后，直接返回

```typescript
search(parent: TreeNode, matchFn = (target: TreeNode, node: TreeNode) => target.key === node.key) {
  return !this.root ? undefined : travel(this.root);

  function travel(root: TreeNode): TreeNode | undefined {
    if (matchFn(parent, root)) return root;
    for(let child of root?.children) {
      const ans = travel(child);
      if (ans) return ans;
    }
  }
}
```





## 模糊搜索

传入一个matchFn，按照原有树结构返回匹配成功的节点。

规则：

1. 对于单个节点而且，如果其成功匹配，应该返回从root到当前节点的完整路径
2. 多个节点，共同构成最终的模糊搜索树

![IMG_D2664AD702EC-1](http://serial.limiaomiao.site:8089/public/uploads/IMG_D2664AD702EC-1.jpeg)

支持的参数：

+ matchFn：自定义搜索规则，返回boolean，为true表示查询成功
  + node: 被遍历的节点



分析过程：

1. 骨架

   因为**任意一个子节点匹配成功，其父节点也需要递归返回**。所以，我们需要**先对子节点进行判断**，只有**后序遍历**满足上述条件。因此写出骨架如下

   ```typescript
   travel: root
   	root.children.map(travel)
   	// code here
   ```

   定义好骨架，剩下就是对边界情况，以及一般情况编码

2. 边界：root 为undefiend，返回undefined

   我们对其优化，借助多叉树的数组特性，边界情况优化为

   ```typescript
   travel: root
   	root?.children.map(travel)
   ```

3. 通用情况：

   1. 节点自身：当节点匹配成功后，返回这个节点，否则返回undefined。

      ```typescript
      travel: root
      	root?.children.map(travel)
      	return matchFn(root) ? root : undefined
      ```

   2. 其子节点列表：当前节点的children，在经过同样的递归后，数据结构应该为 `<TreeNode | undefined>[]`，将子节点列表进行有效性过滤后(得到`TreeNode[]`)，增加到当前节点的返回值中

      ```typescript
      travel: root
      	children = getValidList(root?.children.map(travel))
      	return matchFn(root) ? {...root, children} : undefined
      ```



代码实现：

```typescript
treeFilter(matchFn: (node: TreeNode) => boolean): TreeNode | undefined {

    return this.root ? travel(this.root) : undefined
    
    function travel(root: TreeNode): TreeNode | undefined {
      const children = root?.children.map(child => travel(child)).filter(child => !!child) as TreeNode[];
      return matchFn(root) || children.length ? {...root, children} : undefined
    }
  }
```



使用示例(class 形式)：

```typescript
const keyword = '温州'
const mockTree: TreeNode = {
  key: 'root',
  label: 'r',
  children: [
    {
      key: 'r-c-1',
      label: '中国',
      children: [
        {
          key: 'rc1-c1',
          label: '中国江苏',
          children: []
        },
        {
          key: 'rc1-c2',
          label: '中国-浙江',
          children: [
            {
              key: 'rc1c2-c1',
              label: '浙江温州',
              children: []
            }
          ]
        }
      ]
    },
    {
      key: 'r-c-2',
      label: '美国',
      children: [
        {
          key: 'rc2-c1',
          label: '美国纽约',
          children: []
        },
      ]
    },
    {
      key: 'r-c-3',
      label: '日本',
      children: []
    }
  ],
}
globalTree = new NormalTree(mockTree)
const ans = tree.treeFilter(node => node.label.includes(keyword))
```

