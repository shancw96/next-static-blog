---
title: Webpack 项目体积打包优化
categories: [前端]
tags: [webpack]
toc: true
date: 2022/7/18
---

这篇文章介绍了webpack 打包时，针对项目提及的优化方案

<!-- more -->

## Webpack Tree Shaking

1. Using babel-plugin-lodash

   使用前

   ![image-20220712133123569](/Users/wushangcheng/Pictures/Typora/image-20220712133123569.png)

   使用后

   ![image-20220712133308185](/Users/wushangcheng/Pictures/Typora/image-20220712133308185.png)

   使用方式：

   在babel.config.js

   ```diff
   module.exports = {
     presets: ["@vue/cli-plugin-babel/preset", "@vue/babel-preset-jsx"],
     plugins: [
   +    "lodash",
       "@babel/plugin-proposal-optional-chaining", //可选链 ?.
       "@babel/plugin-proposal-nullish-coalescing-operator", //空值合并 ??
     ],
   };
   ```

   其他方式参考: [lodash/babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash#usage)

2. babel-plugin-import

   对react 支持好些，这个库需要自己指定需要优化的包名, 对Vue项目中全局引入的组件，如elementUI，无效

   ```js
   [
     {
       "libraryName": "antd",
       "libraryDirectory": "lib",   // default: lib
       "style": true
     },
     {
       "libraryName": "antd-mobile"
     },
   ]
   ```

   

## Compress Bundles

对于前端的静态文件，不会经常发生变化。默认使用的nginx gzip on 会对每个request 进行gzip，不会进行任何缓存，缺点如下：

1. 进行gzip的时候 服务端CPU 负载变高
2. 传输数据压缩可能花费较长时间，可能导致web响应延迟（比如白屏，数据一直loading等）
3. 长时间的等待可能会使用户重新刷新页面，变相增加CPU的负载

因此更好的方式是，在打包的时候，预先打包好gz文件。

[compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin)： 本地生成.gz 文件，配合使用nginx 的 gzip_static 命令，让nginx直接读取gz文件，不用实时编译。

配置方式：

1. 前端webpack配置

   ```js
   new CompressionWebpackPlugin({
     //gzip compression
     filename:'[path].gz[query]',
     test: new RegExp(
       '\\.(js|css)$'//Compress js and css
     ),
     threshold: 10240,
     minRatio: 0.8
   }),
   ```

2. [nginx conf 文件配置](http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html)

   ```diff
   location ~ .*\.(jpg|png|gif)$ {
          gzip on;
   +      gzip_static on;
          gzip_min_length 1k;
          gzip_http_version 1.1;
          gzip_comp_level 3;
          gzip_types image/jpeg image/png image/gif;
          root/home/dist;
   }
   
   ```

+ Image Compression 

  + imagemin-webpack-plugin

+ Enable code minification

  set the `mode` flag to production inside your webpack config. The production mode uses UglifyJS to minify your code but it also does some other optimizations like removing development-only code in libraries. 

+ Lazy Loading routes

  https://router.vuejs.org/guide/advanced/lazy-loading.html#with-webpack

  webpackChunkName 可以指定 动态加载的组件被分配到哪个chunk下

  ```js
  const routes = [
    {
      path: "/theme-setting",
      children: [
        {
          path: "dashboard",
          component: () =>
            import(/* webpackChunkName: "theme-setting" */ "@/views/project/comprehensive/project-settings.vue"),
        },
      ],
    },
    {
      path: "/bg-setting",
      children: [
        {
          path: "dashboard",
          component: () =>
            import(/* webpackChunkName: "bg-setting" */ "@/views/project/comprehensive/reproduction.vue"),
        },
        {
          path: "tag",
          component: () => import(/* webpackChunkName: "bg-setting" */ "@/views/project/comprehensive/tag.vue"),
        },
      ],
    },
  ];
  ```

  如上代码，将theme-setting 下所有的组件，放到theme-setting chunk下，下图是打包后的依赖图

  ![image-20220712143043458](/Users/wushangcheng/Pictures/Typora/image-20220712143043458.png)

+ Lazy loading plugins and global components

  ```js
  export default {
    name: "CompanyLayout",
    created() {
      Vue.use(VueFuse);
      Vue.use(VueCarousel);
      Vue.component("VueShowdown", VueShowdown);
    }
  };
  ```

+ script

  async, defer

  http://serial.limiaomiao.site:8088/posts/html-script-defer-async

https://blog.42mate.com/vue-js-bundle-size-and-performance-optimizations-%F0%9F%8F%8E%EF%B8%8F/

