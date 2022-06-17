---
title: webpack - 文件---指纹，压缩
categories: [前端]
tags: [webpack]
toc: true
date: 2020/10/5
---

## Table of Content

## 文件指纹

- Hash: 和整个项目的构建有关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- ChunkHash: 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同 chunk
- ContentHash：根据文件内容来定义 hash，内容不变，则 contenthash 不变

### js 指纹设置

```js
module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js",
  },
  output: {
    // chunkhash:8 表示开启并使用生成的hash的前8位，hash一共32位
    filename: "[name]_[chunkhash:8]",
    path: __dirname + "/dist",
  },
};
```

### css 指纹设置

css 文件指纹需要先把 css 代码生成独立的文件，然后在对其设置 hash。

需要用到的包：

- MiniCssExtractPlugin: 把 css 代码生成独立的文件

**注意**
css 指纹设置 和 style-loader 冲突，不能同时使用。原因：style-loader 是将转换后的 css 直接插入 header。而 css 指纹则需要生成独立的文件

### webpack.config.js

```js
const path = require("path");
module.exports = {
  entry: "entry.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader", "less-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // less 解析
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader", "less-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      // sass 解析
      {
        test: /\.scss$/,
        // use: ["style-loader", "css-loader", "sass-loader"],
        use: [
          MiniCssExtractPlugin.loader,
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`,
    }),
  ],
};
```

### 字体，图片文件指纹

```js
module.exports = {
  entry: "entry.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      // url-loader： 大于10240的图片不做base64 转换，此时和file-loader base64转换
      {
        test: /\.(png|jpg|gif|jpeg)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
      // file-loader：处理字体文件
      {
        test: /\.(woff|woff2|eot|ttf)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
};
```

## 压缩

### JS 文件压缩

内置了 uglifyjs-webpack-plugin，默认开启

### CSS 压缩

- cssnano css 预处理器
- optimize-css-assets-webpack-plugin 压缩插件（基于 cssnano 预处理器）

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  ...
  plugins: [
    ...,
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ],
  ...
}
```

### HTML 压缩

- html-webpack-plugin

```js
module.exports = {
  ...
  plugins: [
    ...,
    new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.html'),//使用的模版
        filename: 'index.html',//生成的文件名称
        chunks: ['index'],// 多页应用会用到？对应index chunk
        inject: true, // 将所有的assets 注入到当前模版中
        // 压缩配置
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
        }
    })
  ],
  ...
}
```
