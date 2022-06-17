---
title: SPA - webpack config multiple html entry 
categories: [前端]
tags: [webpack, multiple entry]
toc: true
date: 2022/6/17
---

## Table of Content

webpack 在前端项目中使用多入口的配置方式

<!-- more -->

[源码参考](https://github.com/shancw96/webpack-cli-by-hand/blob/master/webpack.config.js)

[对应commit](https://github.com/shancw96/webpack-cli-by-hand/commit/2d046726ef28ce904980dbc14e39c21fe0f6162a)

## Webpack Output介绍

> output 告诉webpack 如何将编译后的文件写入disk, entry points 可以配置多个，但output只能配置一个

### Output.filename

output 最少需要配置 filename，用于指定输出的文件名

*webpack.config.js*

```js
module.exports = {
    output: {
        filename: 'bundle.js'
    }
}
```

上述功能将生成bundle.js 到dist目录

filename 详细配置参考此处: [webpackDoc: output.filename](https://webpack.js.org/configuration/output/#outputfilename)

当使用multiple entry points或者commonChunkPlugin，需要对filename进行如下配置，以便于给每个bundle生成唯一的名称



**方法1：使用对应entry point 的名称**

```js

module.exports = {
  //...
  output: {
    filename: '[name].bundle.js',
  },
};
```

**方法2：使用chunk id**

```js
module.exports = {
  //...
  output: {
    filename: '[id].bundle.js',
  },
};
```

**方法3：使用生成内容的hash值**

```javascript
module.exports = {
  //...
  output: {
    filename: '[contenthash].bundle.js',
  },
};
```

**方法4： 上述三个方法可以组合**

```javascript
module.exports = {
  //...
  output: {
    filename: '[name].[contenthash].bundle.js',
  },
};
```

**方法5： 使用函数动态配置**

```js
module.exports = {
  //...
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
    },
  },
};
```



### Output.path

自定义输出路径

```js
const path = require('path');

module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
  },
};
```



## HtmlWebpackPlugin

- [Generating multiple html files](https://github.com/ampedandwired/html-webpack-plugin#generating-multiple-html-files)
- [Filtering chunks](https://github.com/ampedandwired/html-webpack-plugin#filtering-chunks)

### 生成多个Html File

```js
module.exports = {
  entry: {
    main: './src/app.js',
    exampleEntry: './src/search.js',
  }
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
  },
  plugins: [
  	new HtmlWebpackPlugin({
    	filename: 'index.html',
    	template: 'src/index.html',
    	chunks: ['main']
  	}),
  	new HtmlWebpackPlugin({
    	filename: 'example.html',
    	template: 'src/example.html',
    	chunks: ['exampleEntry']
  	})
  ]
};
```

template 需要自己预先定义好

