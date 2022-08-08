---
title: webpack - 文件---指纹，压缩
categories: [前端]
tags: [webpack, files, webpack-chunk]
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

### 图片压缩

在 webpack 中对于图片压缩推荐使用 plugin 而不是 loader，loader 属于 build 时对 chunk 进行操作，而 plugin 是对构建完之后的结果进行二次操作。

对于现有的项目，比如基于 vue-cli 或者 CRA(create-react-app)，都对文件资源进行了定制化处理。在这种情况下，随意的添加 loader，可能破坏现有的 loader chain，导致 build 出现问题。

因此，使用 plugin 在构建结束后，再进行图片的优化操作，相对来说是比较合适的。

Vue-cli 下的配置方法，考虑到多项目下的通用性质，未使用 webpack chain 进行管理。

1. 安装 ImageminPlugin

   npm i imagemin-webpack-plugin --save-dev

2. 项目中使用

   vue.config.js

   ```diff
   const { defineConfig } = require("@vue/cli-service");
   + const ImageminPlugin = require("imagemin-webpack-plugin").default;
   module.exports = defineConfig({
     transpileDependencies: true,
     lintOnSave: false,
     devServer: {
       proxy: {
         "/photovoltaic": {
           target: process.env.VUE_API_BASE,
           // pathRewrite: {
           //   "^/photovoltaic": process.env.VUE_API_BASE,
           // },
         },
       },
     },
     chainWebpack: config => {
       config.module
         .rule("vue")
         .use("vue-loader")
         .tap(options => {
           options.compiler = require("vue-template-babel-compiler");
           return options;
         });
     },
   + configureWebpack: {
   +   plugins: [
   +     new ImageminPlugin({
   +       test: /\.(jpe?g|png|gif|svg)$/i,
   +       disable: process.env.NODE_ENV !== "production", // Disable during development
   +       mozjpeg: {
   +         progressive: true,
   +       },
   +       // optipng.enabled: false will disable optipng
   +       optipng: {
   +         enabled: false,
   +       },
   +       pngquant: {
   +         quality: "65-85",
   +         speed: 4,
   +       },
   +       gifsicle: {
   +         interlaced: false,
   +       },
   +       // the webp option will enable WEBP
   +       webp: {
   +         quality: 75,
   +       },
   +     }),
   +   ],
   + },
   });

   ```

   地址

   - github: [Klathmon/imagemin-webpack-plugin](https://github.com/Klathmon/imagemin-webpack-plugin)

   - github: [imagemin](https://github.com/imagemin/imagemin)

​
