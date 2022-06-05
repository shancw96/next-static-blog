---
title: svgStr To Image (based on konva)
categories: [前端]
tags: [implement]
toc: true
date: 2020/6/19
---

## 需求：

将 svg 字符串 作为 konva-image 插入 konva 中
流程如下 svgString -> svgEl -> base64 -> image -> konva Image

## svgStr-> svgEl -> base64

svgStr -> svgEl 思路： 创建一个 div，在其内部使用 innerHTML 的方式插入 svgStr 来生成 svgEl

```js
/**
 * @description svg 生成 base64
 * @param {Element} svgEl
 */
const svg2Base64 = (svgEl) => {
  const svgEl = document.createElement("div");
  svgEl.innerHTML = svgStr;
  const s = new XMLSerializer().serializeToString(svgEl.firstElementChild);
  return `data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(s))
  )}`;
};
```

1. btoa() 从 String 对象中创建一个 base-64 编码的 ASCII 字符串，其中字符串中的每个字符都被视为一个二进制数据字节
2. encodeURIComponent 能够转译特殊字符，如`%$/中文等`
3. unescape() 方法计算生成一个新的字符串，其中的十六进制转义序列将被其表示的字符替换.
   > [Encoding / decoding UTF8 in javascript](http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html)
4. unescape + encodeURIComponent 组合能够生成 utf-8 格式的字符串
5. [在多数浏览器中，使用 btoa() 对 Unicode 字符串进行编码都会触发 InvalidCharacterError 异常。 ](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/btoa)
6. `window.btoa(unescape(encodeURIComponent(s)))` string -> utf-8 编码的 string -> base-64 编码的 ASCII 字符串

## base64 -> image

```js
const base64ToImageEl = (base64Str) => {
  const image = new window.Image();
  image.src = base64Str;
  image.onload = () => {
    // image -> konva Image
  };
};
```

## Image download(基于 konva(vue canvas 框架))

```js
function handleImageDownload() {
  const stage = _getNodeRef("stage");
  const dataURL = stage.toDataURL({ pixelRatio: 3 });
  downloadURI(dataURL, "stage.png");
}
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```
