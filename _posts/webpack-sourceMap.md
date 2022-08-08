---
title: webpack - sourceMap & 公共资源提取
categories: [前端]
tags: [webpack, sourceMap, chunk]
toc: true
date: 2020/10/7
---

## sourceMap

作用：定位源码，开发环境开启，线上环境关闭

### sourceMap 关键字

- eval: 使用 eval 包裹模块代码
- source map: 产生.map 文件
- cheap: 不包含列信息（报错只定为到行）
- inline: 将.map 作为 DataURI 嵌入，不单独生成.map（将 sourcemap 内联到对应 js 文件中）
- module: 包含 loader 的 sourcemap

```js
module.exports = {
  ...
  devtool: 'source-map'
  // devTool: 'inline-source-map'
  // devTool: 'cheap-inline-source-map'
}
```

## SplitChunksPlugin 分离公共脚本(react, react-dom, UI component)

chunks 参数说明:

- async 异步引入的库进行分离（默认）
  js 文件中 import 导入的库
- initial 同步引入的库进行分离
- all 所有引入的库进行分离（推荐）

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "~",
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

#### test: 匹配出要分离的包

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      ...
      cacheGroups: {
        commons: {// 打包出来的chunk 名称
          test: /(react|react-dom)/,
          name: 'vendors',// 分离出来的名称
          chunks: 'all'
        }
        ...
      }
    }
  }
};
```

#### minChunks: 设置最小的引用次数 & minSize：需要执行分离的包的最小体积

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      ...
      minSize: 0 // 分离包的最小体积
      ...
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2 //最小引用次数
        }
      },
    },
  },
};
```
