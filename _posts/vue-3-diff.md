---
title: vue3 diff 浅析
categories: [前端]
tags: [implement, vue]
toc: true
date: 2022/9/20
---

为了尽可能小的对 dom 进行操作，vue 引入了 diff 算法对虚拟 dom 的对比进行优化。

通常两棵树的比较更新，时间复杂度为 O(n^3)

- 遍历老的虚拟 DOM
- 遍历新的虚拟 DOM
- 然后根据变化，比如上面的改变和新增，再重新排序

Vue 是浏览器环境，WebUI 中的 DOM 节点跨层级的移动操作少到可以忽略不计，所以 Vue 的 diff 算法只对同层进行比较，这样时间复杂度降低为 O(n)

![TreeDiff](https://pic.limiaomiao.site:8443/public/uploads/tree_diff_1.2079672f.jpg)

Vue 的 diff 算法，需要借助 key 来标识不同元素，在 diff 时，根据元素有没有 key，会进行不同的 diff 策略

<!--more-->

- 有 key 情况：`patchKeyedChildren`

- 无 key 情况：`patchUnkeyedChildren`

## _patchKeyedChildren_

当存在 key 时，可以对元素精确复用。

### 流程简介如下

1. 头部判断是否有相同节点

   ` (a, b, c, d), g`

   `(a, b, c, d), e, f, g `

2. 尾部判断是否有相同节点

   ` (a, b, c, d), (g)`

   `(a, b, c, d), e, f, (g) `

3. 在经过 1，2 步骤后，处理新增，删除两种特殊情况

   比如新增，对于上述 1，2 步骤后，可以直接判断出 e,f 需要新增。删除也是类似

4. 在经过预处理后，还剩余的节点，需要判断是否可通过移动节点的方式进行复用

   old: `(a, b, c, d, e, f, g)`

   new `(c,  g, a, d,e, b, f)`

   我们假定经过 123 步骤处理后，剩余如上元素集合，我们需要尽可能小的去移动发生改变的节点

   1. 获取到新集合中的**最长递增子序列** c, d, e, f。
   2. 经过上述操作后，需要移动的元素最少，为 g,a,b。
   3. 对 g，a，b 三个元素进行 patch 移动更新

### 大体流程图参考

![Vue3 Diff算法之patchKeyedChildren方法.png](https://pic.limiaomiao.site:8443/public/uploads/79ff1ba9439141eda0ffdca218519fc4~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 可执行的简化源码参考（带 getSequence 最长递增子序列算法使用）

```js
const patchKeyedChildren = (c1, c2) => {
  let i = 0;
  let l1 = c1.length,
    l2 = c2.length;
  let e1 = l1 - 1; // 旧的最后一个index
  let e2 = l2 - 1; // 新的最后一个index

  // 1 和 2 预处理相同的前后节点

  // 1. 从头开始
  while (i <= e1 && i <= e2) {
    const n1 = c1[i];
    const n2 = c2[i];
    if (isSameVNodeType(n1, n2)) {
      // 判断为相同节点
      console.log("从头开始，patch: ", n1);
    } else {
      break;
    }
    i++;
  }

  // 2. 从尾部开始
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1];
    const n2 = c2[e2];
    if (isSameVNodeType(n1, n2)) {
      // 判断为相同节点
      console.log("从尾部开始，patch: ", n1);
    } else {
      break;
    }
    e1--;
    e2--;
  }

  /**
   * 预处理之后：
   * (a, b, c, d), (g)      e1 === 3
   * (a, b, c, d), e, f, (g)   e2 === 4
   * i === 4
   */

  /**
   * 3. 新增节点
   * 如果i > e1 && i <= e2，说明新arr有新增的节点
   */
  if (i > e1) {
    if (i <= e2) {
      while (i <= e2) {
        console.log("新增的节点patch: " + c2[i]);
        i++;
      }
    }
  }

  // 4. 减少节点 --- 直接删除旧的节点
  else if (i > e2) {
    while (i <= e1) {
      console.log("删除旧节点：", c1[i]);
      i++;
    }
  }

  // 5. 有节点移动、新增或删除
  else {
    const s1 = i; // 旧的初始index
    const s2 = i; // 新的初始index

    // 5.1 建立新序列的Map
    const keyToNewIndexMap = new Map();
    for (let idx = s2; idx <= e2; idx++) {
      const nextChild = c2[idx];
      if (nextChild.key !== null) {
        keyToNewIndexMap.set(nextChild.key, idx);
      }
    }
    console.log(keyToNewIndexMap);

    // 5.2 循环旧序列
    let j;
    const toBePatched = e2 - s2 + 1; // 总的需要patch的数量
    let patched = 0; // 已patch的数量
    let moved = false; // 移动标记
    let maxNewIndexSoFar = 0; // 已遍历的待处理的 c1 节点在 c2 中对应的索引最大值
    const newIndexToOldIndexMap = new Array(toBePatched); // 代表新节点在旧序列中的位置，用于后面求最长递增子序列
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0; // 默认全部为新增节点，用0表示

    // 遍历 c1 中待处理的节点，判断否 c2 中是有相同 key 的节点存在。
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      if (patched >= toBePatched) {
        // 已patch的数量比未patch的多，说明多余，删掉节点
        console.log("已patch的数量比未patch的多，说明多余，删掉节点");
        continue;
      }
      // 否则，调用 patch 函数，并记录节点在 c1 中的索引。
      // 同时，记录节点在 c2 中的最大索引
      let newIndex;
      newIndex = keyToNewIndexMap.get(prevChild.key); // 取旧节点在新序列里的索引
      console.log(
        `旧节点${prevChild.key}, 在新序列里面对应索引的：${
          newIndex !== undefined ? newIndex : "找不到"
        }`
      );
      if (newIndex === undefined) {
        // 在旧的里面找不到了，说明没用，删掉
        console.log(prevChild, "在新序列中没有了，删除节点");
      } else {
        // 把0当成特殊值（代表新增的节点），所以其他位置用i + 1代替
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          // 假如节点在 c2 中的索引位置小于这个最大索引，那么说明是有元素需要进行移动。
          moved = true;
        }
        console.log("patch - 复用节点：", prevChild);
        patched++;
      }
    }

    console.log("新节点在旧序列中的位置:", newIndexToOldIndexMap);
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : EMPTY_ARR;
    console.log("sequence", increasingNewIndexSequence);
    j = increasingNewIndexSequence.length - 1;
    // 5.3
    for (i = toBePatched - 1; i >= 0; i--) {
      if (newIndexToOldIndexMap[i] === 0) {
        console.log("新创建：", c2[i + s2]);
      } else if (moved) {
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          console.log("移动旧节点：", c2[i + s2]);
        } else {
          j--;
        }
      }
    }
  }
};

function isSameVNodeType(n1, n2) {
  return n1.key === n2.key && n1.label === n2.label;
}

function getSequence(arr) {
  const p = arr.slice(); //  保存原始数据
  const result = [0]; //  存储最长增长子序列的索引数组
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1]; //  j是子序列索引最后一项
      if (arr[j] < arrI) {
        //  如果arr[i] > arr[j], 当前值比最后一项还大，可以直接push到索引数组(result)中去
        p[i] = j; //  p记录第i个位置的索引变为j
        result.push(i);
        continue;
      }
      u = 0; //  数组的第一项
      v = result.length - 1; //  数组的最后一项
      while (u < v) {
        //  如果arrI <= arr[j] 通过二分查找，将i插入到result对应位置；u和v相等时循环停止
        c = ((u + v) / 2) | 0; //  二分查找
        if (arr[result[c]] < arrI) {
          u = c + 1; //  移动u
        } else {
          v = c; //  中间的位置大于等于i,v=c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]; //  记录修改的索引
        }
        result[u] = i; //  更新索引数组(result)
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  //把u值赋给result
  while (u-- > 0) {
    //  最后通过p数组对result数组进行进行修订，取得正确的索引
    result[u] = v;
    v = p[v];
  }
  return result;
}

const c1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((key) => ({
  key,
  label: key,
}));
const c2 = ["a", "u", "v", "b", "f", "d", "g", "e", "i", "j"].map((key) => ({
  key,
  label: key,
}));
```

## patchedUnkeyedChildren 对无 key 情况的处理

如果 v-for 循环没有写 key，那么会进行简单的比较，但这种算法效率并不高

- `C` 和 `D` 其实并不需要有任何改动；
- 但由于 `C` 被 `F` 使用了，**导致后面所有的内容都要进行一次改动**，并且最后再新增 `D`。

![image-20210809185456449.png](https://pic.limiaomiao.site:8443/public/uploads/45d374114b5147c9970800ee496d40d3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

```js
  const patchUnkeyedChildren = (
    c1: VNode[], // 旧VNodes [A, B, C, D]
    c2: VNodeArrayChildren, // 新VNodes [A, B, F, C, D]
  ) => {
    c1 = c1 || EMPTY_ARR
    c2 = c2 || EMPTY_ARR
    // 1. 获取旧节点的长度
    const oldLength = c1.length
    // 获取新节点的长度
    const newLength = c2.length
    // 3. 获取较小的长度（保证遍历过程中，取数组元素时不会发生数组越界）
    const commonLength = Math.min(oldLength, newLength)
    let i
    // 4. 从位置0开始依次比较修改（patch， 可以理解为更新）
    for (i = 0; i < commonLength; i++) {
      patch(...)
    }
    // 如果旧vnodes 的数量大于新vnodes 的数量
    if (oldLength > newLength) {
      // 移除剩余的vnodes
      unmountChildren(...)
    } else {
      // 创建新的vnodes
      mountChildren(...)
    }
  }
```

##### 实际场景：v-if 渲染，或者拖拽，删除

##### 结论：新增在同级节点非尾部位置新增或删除，都会导致新增位置以及后面的全部节点无法复用，vue2 的双端比较大体也是如此

**文章参考**

- [Vue3.0 Diff 算法之 patchKeyedChildren 方法流程图](https://juejin.cn/post/6959473709065175053)

- [React Guidebook #Tree Diff](https://tsejx.github.io/react-guidebook/infrastructure/old/diffing-algorithm/#tree-diff)

- [Vue3 源码之 diff 算法的核心 patchKeyedChildren](https://juejin.cn/post/7039963997923180551)
