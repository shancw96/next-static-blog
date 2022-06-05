---
title: styled-component cheat sheet
categories: [前端]
tags: [react, styled-component]
toc: true
date: 2021/10/11
---

通过 styled-component，当你在定义 style 的时候，就已经在创建一个常规的 React 组件，这个组件管理了定义的样式。

<!-- more -->

## 基本使用

```jsx
// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// Use Title and Wrapper like any other React component – except they're styled!
render(
  <Wrapper>
    <Title>Hello World!</Title>
  </Wrapper>
);
```

效果图：
![](/images/styled-components/01.png)

## 通过 props 控制组件 style/attrs

### style

通过 JS 提供的模板语法，`${props => {/*props操作*/}}`即可实现对具体样式进行控制

```jsx
const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? "palevioletred" : "white")};
  color: ${(props) => (props.primary ? "white" : "palevioletred")};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

render(
  <div>
    <Button>Normal</Button>
    <Button primary>Primary</Button>
  </div>
);
```

### attrs

通过 attrs 构造器，我们可以给组件增加额外的 props（或者说 attributes）

```js
const Input = styled.input.attrs((props) => ({
  // we can define static props
  type: "text",

  // or we can define dynamic ones
  size: props.size || "1em",
}))`
  color: palevioletred;
  font-size: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  /* here we use the dynamically computed prop */
  margin: ${(props) => props.size};
  padding: ${(props) => props.size};
`;

render(
  <div>
    <Input placeholder="A small text input" />
    <br />
    <Input placeholder="A bigger text input" size="2em" />
  </div>
);
```

![](/images/styled-components/03.png)

## 组件样式扩展与覆写 - extending styles

### 对 styled.xxx 组件的扩展

有时候我们需要对组件样式进行一些小的修改，比如字体，颜色等。或者在此基础上，增加额外的效果。

语法：styled(...)
将定义好的组件，直接传入 styled 构造函数中

```jsx
// 基础组件
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// 拓展组件
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

render(
  <div>
    <Button>Normal Button</Button>
    <TomatoButton>Tomato Button</TomatoButton>
  </div>
);
```

![](/images/styled-components/02.png)

### 对任意组件的扩展

styled 方法支持任何组件的扩展，**只要他们的 className 被传递到组件上**

```jsx
// This could be react-router-dom's Link for example
const Link = ({ className, children }) => (
  <a className={`some-global-class ${className}`}>{children}</a>
);

const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`;

render(
  <div>
    <Link>Unstyled, boring Link</Link>
    <br />
    <StyledLink>Styled, exciting Link</StyledLink>
  </div>
);
```

![](/images/styled-components/03.png)

## 组件样式的嵌套设置（类 scss）

[传送门](https://styled-components.com/docs/basics#pseudoelements-pseudoselectors-and-nesting)

```jsx
const Thing = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  color: blue;

  &:hover {
    color: red; // <Thing> when hovered
  }

  & ~ & {
    background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
  }

  & + & {
    background: lime; // <Thing> next to <Thing>
  }

  &.something {
    background: orange; // <Thing> tagged with an additional CSS class ".something"
  }

  .something-else & {
    border: 1px solid; // <Thing> inside another element labeled ".something-else"
  }
`;
render(
  <React.Fragment>
    <Thing>Hello world!</Thing>
    <Thing>How ya doing?</Thing>
    <Thing className="something">The sun is shining...</Thing>
    <div>Pretty nice day today.</div>
    <Thing>Don't you think?</Thing>
    <div className="something-else">
      <Thing>Splendid.</Thing>
    </div>
  </React.Fragment>
);
```

![](/images/styled-components/05.png)
