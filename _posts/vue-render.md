---
title: vue 渲染器
categories: []
tags: []
toc: true
date: 2021/7/24
---

这篇文章介绍了 vue VNode 相关的事项方式。

<!--  more -->

# 概览

vnode

普通 VNode

```js
const elementVnode = {
  tag: "div",
};
```

组件 VNode

```js
class MyComponent {
  render() {
    // render 函数产出 VNode
    return {
      tag: "div",
    };
  }
}

const componentVNode = {
  tag: MyComponent,
};
```

render

```js
render(elementVnode, document.getElementById("app"));
function render(vnode, container) {
  mountElement(vnode, container);

  function mountElement(vnode, container) {
    const el = document.createElement(vnode.tag);
    container.appendChild(el);
  }

  function mountComponent(vnode, container) {
    const instance = new vnode.tag();

    instance.$vnode = instance.render();

    mountElement(instance.$vnode, container);
  }
}
```

# VNode

```js
export interface VNode {
  // _isVNode 属性在上文中没有提到，它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // el 属性在上文中也没有提到，当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}
```

## VNode 描述 DOM

### elementVNode

```js
const elementVNode = {
  tag: 'div',
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  },
  children: [
    {
      tag: 'h1',
      ...
    }
  ]
}
```

- tag：存储标签名称
- data：存储标签的附加信息
  - style
  - class
  - 事件
    ...
- children: 当前标签的子节点

### textVNode

```js
const textVNode = {
  tag: null,
  data: null,
  children: "文本内容",
};
```

## 使用 VNode 来描述抽象内容

抽象内容：组件，Fragment,Portal

### 组件

对于如下代码，我们并不想渲染 MyComponent 标签，而是想渲染出 MyComponent 组件

```html
<div>
  <MyComponent />
</div>
```

我们使用 VNode 来对其进行描述

```js
const elementVNode = {
  tag: "div",
  data: null,
  children: {
    tag: MyComponent,
    data: null,
  },
};
```

### Fragment 无父节点 元素 集合

```html
<template>
  <table>
    <tr>
      <Columns />
    </tr>
  </table>
</template>

转换成

<template>
  <td></td>
  <td></td>
  <td></td>
</template>
```

我们使用 VNode 对其进行描述

```js
const Fragment = Symbol();

const fragmentVNode = {
  tag: Fragment, // 过 Symbol 创建的唯一标识，但实际上我们更倾向于给 VNode 对象添加一个 flags 属性，用来代表该 VNode 的类型
  data: null,
  children: [
    {
      tag: "td",
      data: null,
    },
    {
      tag: "td",
      data: null,
    },
    {
      tag: "td",
      data: null,
    },
  ],
};
```

如上，我们把所有 td 标签都作为 fragmentVNode 的子节点，根元素并不是一个实实在在的真实 DOM，而是一个抽象的标识，即 Fragment。

当渲染器在渲染 VNode 时，如果发现该 VNode 的类型是 Fragment，就只需要把该 VNode 的子节点渲染到页面。

### Portal 允许将内容渲染在任何地方

其应用场景是，假设你要实现一个蒙层组件 <Overlay/>，要求是该组件的 z-index 的层级最高，这样无论在哪里使用都希望它能够遮住全部内容，你可能会将其用在任何你需要蒙层的地方

```html
<template>
  <Portal target="#app-root">
    <div class="overlay"></div>
  </Portal>
</template>
```

```js
const Portal = Symbol();
const portalVNode = {
  tag: Portal,
  data: {
    target: "#app-root",
  },
  children: {
    tag: "div",
    data: {
      class: "overlay",
    },
  },
};
```

## 使用 flags 作为 VNode 标识

我们可以把 VNode 分成五类，分别是：html/svg 元素、组件、纯文本、Fragment 以及 Portal：

```js
const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: "ELEMENT_HTML",
  // SVG 标签
  ELEMENT_SVG: "ELEMENT_SVG",

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL: "COMPONENT_STATEFUL_NORMAL",
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: "COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE",
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: "COMPONENT_STATEFUL_KEPT_ALIVE",
  // 函数式组件
  COMPONENT_FUNCTIONAL: "COMPONENT_FUNCTIONAL",

  // 纯文本
  TEXT: "TEXT",
  // Fragment
  FRAGMENT: "FRAGMENT",
  // Portal
  PORTAL: "PORTAL",
};

// html 元素节点
const htmlVnode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: "div",
  data: null,
};

// svg 元素节点
const svgVnode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: "svg",
  data: null,
};

// 函数式组件
const functionalComponentVnode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent,
};

// 普通的有状态组件
const normalComponentVnode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent,
};

// Fragment
const fragmentVnode = {
  flags: VNodeFlags.FRAGMENT,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识
  tag: null,
};

// Portal
const portalVnode = {
  flags: VNodeFlags.PORTAL,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target
  tag: target,
};
```

## childrenFlags

children 的几种情况

- 没有子节点
- 只有一个子节点
- 多个子节点
  - 有 key
  - 无 key
- 不知道子节点的情况

> TIP
> 为什么 children 也需要标识呢？原因只有一个：为了优化。在后面讲解 diff 算法的章节中你将会意识到，这些信息是至关重要的。

```js
const ChildrenFlags = {
  // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3,
};
// 没有子节点的 div 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: "div",
  data: null,
  children: null,
  childFlags: ChildrenFlags.NO_CHILDREN,
};
```

## h 函数：生成 VNode 对象

#### 定义 flags

```js
function h(tag, data = null, children = null) {
  return {
    flags: defineFlags(tag),
    children: defineChildren(children)
  }


  function defineFlags(tag) {
    let flags = null;
      if (typeof tag === 'string') {
      flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
    } else if (tag === Fragment) {
      flags = VNodeFlags.Fragment
    } else if (tag === PORTAL) {
      flags = VNodeFlags.PORTAL
      tag = data && data.target
    } else {
      // 兼容 Vue2 的对象式组件
      if (tag !== null && typeof tag === 'object') {
        flags = tag.functional
          ? VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
          : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
      } else if (typeof tag === 'function') {
        // Vue3 的类组件
        flags = tag.prototype && tag.prototype.render
          ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
          : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
      }
      return flags;
  }
}
```

### 确定 children 类型

- children 是一个数组
  ```js
  h('ul', null, [
    h('li'),
    h('li'),
    ...
  ])
  ```
- children 是一个 VNode 对象

  ```js
  h("ul", null, h("li"));
  ```

- 没有 children

  ```js
  h("ul", null, null);
  ```

- children 是一个普通文本
  ```js
  h("ul", null, "text");
  ```

```js
function defineChildren(children) {
  let childFlags = null;
  if (Array.isArray(children)) {
    const { length } = children;
    if (length === 0) {
      // 没有 children
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) {
      // 单个子节点
      childFlags = ChildrenFlags.SINGLE_VNODE;
      children = children[0];
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES;
      children = normalizeVNodes(children);
    }
  } else if (children == null) {
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN;
  } else if (children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE;
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE;
    children = createTextVNode(children + "");
  }
  return childFlags;
}
```
