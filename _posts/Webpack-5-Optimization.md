---
title: Webpack 5 Optimization
categories: [前端]
tags: [webpack, webpack-chunk]
toc: true
date: 2022/7/18
---



这篇文章介绍了webpack optimization属性常用的配置，翻译自[webpackDoc: splitchunks](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkscachegroups)



## Table of Content



## chunk 生成规则

webpack的 chunk 通过 webpack graph 的 父子关系关联。

> commonsChunkPlugin 被用来管理公共chunk，规避重复生成相同chunk，从webpack v4 开始，CommonChunkPlugin 被删除，使用optimization.splitChunks 代替



在以下条件下webpack 会自动切分chunk

+ 新的chunk可以被复用，或者是来自node_modules 下的模块
+ 新的chunk应该 >=20kb（在进行 min+gz 之前的体积）
+ 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
+ 当加载初始化页面时，并发请求的最大数量小于或等于 30

深入阅读：[webpack4 splitchunk  的规则解释](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)

## 常用配置介绍：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // 这表明将选择哪些 chunk 进行优
      // 有效值为 all，async 和 initial。
      // 设置为 all 意味着 chunk 可以在异步和非异步 chunk 之间共享
      chunks: 'async',
      // 生成的chunk的最小体积：20kb
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      // 强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
      enforceSizeThreshold: 50000,
			// cacheGroup缓存组: 可以继承和/或覆盖来自 splitChunks.* 的任何选项。
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          // 当前缓存组的优先级，默认为负
          // 自定义组的默认值为0
          priority: -10,
          // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
          reuseExistingChunk: true,
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

## 使用例子：

### [合并node_modules](https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-2)下所有module

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### 拆分node_modules 下常用module （react, react-dom 为例）

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
```



