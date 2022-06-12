# webpack HandBook - Basic

此文章为[webpack 官方文档](https://webpack.js.org/guides/getting-started/)的学习笔记，从初学者的角度，加了个人理解内容。

学习资源推荐：

- [webpack the confusing parts](https://rajaraodv.medium.com/webpack-the-confusing-parts-58712f8fcad9)
- [webpack 官方文档](https://webpack.js.org/guides/getting-started/)

<!--more-->

entry: 入口文件

output: 输出文件

```js
webpack-demo
 |- package.json
 |- package-lock.json
 |- webpack.config.js
 |- /dist
    |- index.html
 |- /src
    |- index.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

## Pulgin vs Loader

Loader: 在**bundle** 生成之前或期间 调用，对文件进行操作

plugin: 在**bundle**生成之后，操作**chunk**或 **bundle**，对其进行进一步的组织，优化。plugin 可以注册 hook 到 webpack 的构建过程中，甚至可以修改 compiler，决定最终的编译内容。

plugin and Loader workflow:

![Plugin and Loader WorkFlow](http://serial.limiaomiao.site:8089/public/uploads/P7hTM.png)

## Asset Management (loaders)

**[Modules 的执行顺序](https://stackoverflow.com/a/32234468/11418690)**: 从下往上， 从右往左

### [Loading Css](https://webpack.js.org/guides/asset-management/#loading-css)

在 js 中引入 css，需要在 module [configuration](https://webpack.js.org/configuration/module):中 使用 `style-loader` 和 `css-loader`

> - style-loader: Inject CSS into the DOM.
> - `css-loader` : interprets `@import` and `url()` like `import/require()` and will resolve them.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

`module loader` 的加载顺序是从前往后的，第一个加载的 loader 会将它的结果（经过它转换的）传递给下一个 loader。类似于 `Ramda.pipe`

上述 loader 的执行顺序为 `style-loader` -> `css-loader`

> webpack 使用正则表达式，来决定哪些文件应该被加载到对应的 loader 中

### [Loading Images & Fonts](https://webpack.js.org/guides/asset-management/#loading-images)

实现 js,css 文件中导入背景图，icon 等图片资源。使用内置的 [Asset Modules](https://webpack.js.org/guides/asset-modules/) 即可

实现 css 文件中导入字体资源。使用内置的 [Asset Modules](https://webpack.js.org/guides/asset-modules/) 即可

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // 图片资源
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // 字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

注意此处的顺序，image loader 加载完图片资源，css-loader 加载 css（此处可能会出现 css 中定义背景图 `url('./my-image.png'）`)，style-loader 将最终的 css 资源加载到 dom

[html-loader](https://webpack.js.org/loaders/html-loader) 对 `<img src="./my-image.png" />` 标签的加载过程，和 style-loader 类似。

### [Load Json like Data(xml,csv)](https://webpack.js.org/guides/asset-management/#loading-data)

`csv-loader`, `xml-loader`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
    ],
  },
};
```

## [Output Management(plugins)](https://webpack.js.org/guides/output-management/)

available plugins:

- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin): 自动创建 HTML files 入口文件为 `webpack` bundles 服务

### HtmlWebpackPlugin 配置

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    print: "./src/print.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    // Cleaning up the /dist folder
    clean: true,
  },
};
```

## Development

### SourceMap

webpack bundle 开发源码后，对于报错很难定位准确位置。为了解决这个问题，更好的定位 error，JS 提供了 source Map。sourceMap 可以让我们从 compiled code 找到源码所在位置。

> sourceMap 的深入了解：[introduction-source-map](https://blog.teamtreehouse.com/introduction-source-maps)

Webpack 的配置方式 `webpack.config.js`

```js
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {...},
   devtool: 'inline-source-map',
   plugins: [...],
   output: {...},
 };
```

sourceMap 的常用可选项：

- inline-source-map: 不创建独立的 sourceMap 文件

- eval-source-map：为每个 module 创建一个 sourceMap，推荐在开发中使用
- hidden-source-map: 一般用于错误收集

> **不同的 sourceMap 选项会影响编译速度**， sourceMap 全部可选项参考: [webpack doc - devtool](https://webpack.js.org/configuration/devtool/)

### Using Webpack-dev-server(host your web file)

> 提供 web 服务以及热更新

配置方式:

```js
npm install --save-dev webpack-dev-server
```

webpack.config.js

```js
module.exports = {
  mode: "development",
  devServer: {
    static: "./dist",
  },
  // The optimization.runtimeChunk: 'single' was added
  // because in this example we have more than one entrypoint on a single HTML page.
  // Without this, we could get into trouble described here.
  // Read the Code Splitting chapter for more details.
  optimization: {
    runtimeChunk: "single",
  },
};
```

package.json

```json
{
  ...
  scripts: [
    'start': 'webpack serve'
  ]
}
```

### webpack-dev-middleware

webpack-dev-middleware 可以将 webpack 打包后的文件，发送给 web 服务。webpack-dev-server 内部就是调用了这个工具。

这个工具可以独立于 webpack-dev-server 使用，比如 nodejs web 静态服务中使用例子如下：

```js
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   ...
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   },
   output: {
     	filename: '[name].bundle.js',
     	path: path.resolve(__dirname, 'dist'),
     	clean: true,
      // The publicPath will be used within our server script as well in order to make sure files are served correctly on http://localhost:3000
    	publicPath: '/',
   },
   ...
 };
```

`server.js`

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config.js");
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});
```

## Code Splitting（代码分离）

代码分离的三种常用方式

- entry point: 使用 entry 配置手动分离代码
- prevent duplicate： 使用[Entry dependencies](https://webpack.js.org/configuration/entry-context/#dependencies) 或者 SplitChunksPlugin 去重并分离 chunk
- 动态导入：在 js 模块中，通过 inline function import 动态导入

### entry point

```diff
 module.exports = {
-  entry: './src/index.js',
+  mode: 'development',
+  entry: {
+    index: './src/index.js',
+    another: './src/another-module.js',
+  },
   output: {
-    filename: 'main.js',
+    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

entry 的缺点：

- 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中
- 不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。

### 预防重复

#### 优化 entry point 的依赖

通过 depnedOn 选项，不同 chunks 之间可以共享 modules，属于对 entry point 的优化

```diff
 const path = require('path');

 module.exports = {
   mode: 'development',
   entry: {
-    index: './src/index.js',
-    another: './src/another-module.js',
+    index: {
+      import: './src/index.js',
+      dependOn: 'shared',
+    },
+    another: {
+      import: './src/another-module.js',
+      dependOn: 'shared',
+    },
+    shared: 'lodash',
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
// 如果是单页应用，那么还需配置如下配置
// 防止公用module被多次初始化
+  optimization: {
+    runtimeChunk: 'single',
+  },
 };
```

#### splitChunksPlugin: 处理 chunk 解决重复

splitChunksPlugin 可以将公共依赖提取到已有的入口 chunk 或者全新的 chunk 中。

```diff
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
+   optimization: {
+     splitChunks: {
+       chunks: 'all',
+     },
+   },
  };
```

### Dynamic Import

https://github.com/tc39/proposal-dynamic-import

```diff
-function getComponent() {
+async function getComponent() {
   const element = document.createElement('div');
+  const { default: _ } = await import('lodash');

-  return import('lodash')
-    .then(({ default: _ }) => {
-      const element = document.createElement('div');
+  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

-      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-      return element;
-    })
-    .catch((error) => 'An error occurred while loading the component');
+  return element;
 }

 getComponent().then((component) => {
   document.body.appendChild(component);
 });
```

### 预获取/预加载模块(prefetch/preload module)

- **prefetch**(预获取)：将来某些导航下可能需要的资源
- **preload**(预加载)：当前导航下可能需要资源

prefetch 的简单示例中，有一个 `HomePage` 组件，其内部渲染一个 `LoginButton` 组件，点击后按需加载 `LoginModal` 组件。

**LoginButton.js**

```js
//...
import(/* webpackPrefetch: true */ "./path/to/LoginModal.js");
```

这会生成 `<link rel="prefetch" href="login-modal-chunk.js">` 并追加到页面头部，指示着浏览器在**闲置时间预取** `login-modal-chunk.js` 文件。

- [<link rel="prefetch/preload /> in webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)

- [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
- [Preloading content with ](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)

### [bundle 分析(bundle analysis)](https://webpack.docschina.org/guides/code-splitting/#bundle-analysis)

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack stats 可交互饼图。
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)：一个 plugin 和 CLI 工具，它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式。
- [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize)：这个工具会分析你的 bundle，并提供可操作的改进措施，以减少 bundle 的大小。
- [bundle-stats](https://github.com/bundle-stats/bundle-stats)：生成一个 bundle 报告（bundle 大小、资源、模块），并比较不同构建之间的结果。
