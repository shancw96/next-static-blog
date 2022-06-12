# Blog 开发日志

本项目基础模版基于[next.js - example - react-blog](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript)



主体流程如下：



![image-20220522140535508](https://blog.shancw.net/public/uploads/image-20220522140535508.png)



技术栈：

+ Next：基于React的web framework，对于本项目来说，SEO友好支持非常重要
+ react-markdown：markdown渲染
+ lunr.js：基于浏览器环境的静态搜索工具
+ tailwindcss: 后续将替换成chakraUI



目标：实现hexo-next 主题的风格，简单化，可配置。

已完成：

- 兼容hexo的写法，markdown 的 metadata渲染

未完成：

+ 增加 阅读更多`<!--more-->`写法支持
+ 增加文章权重，排序置顶
+ 替换tailwindcss 为 chakraUI
+ 替换核心渲染工具为 react-markdown
+ 首页重构，增加分页功能
+ 增加搜索功能 - lunr.js
+ 增加目录归档页面



## 兼容hexo的写法，markdown 的 metadata渲染

react-blog workflow如下所示：

![image-20220522141900955](https://blog.shancw.net/public/uploads/image-20220522141900955.png)

我们需要对getPostBySlug进行重构，增加hexo的metadata风格, hexo的常用metadata如下：

```yaml
---
title: xxx
categories: [xxx]
tags: [xxx]
date: 2021/6/23
---
```



pages/index.tsx



![image-20220522142744639](https://blog.shancw.net/public/uploads/image-20220522142744639.png)

getAllPosts 为HeroPost, PostPreview 提供了数据来源,我们需要对其进行修改

具体参考：commit a21de7c0ba1c9a7cd86d3150b8ff5d9b6294af5c

