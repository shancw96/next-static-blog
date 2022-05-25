本项目基础模版基于[next.js - example - react-blog](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript)

技术栈：

- Next：基于 React 的 web framework，对于本项目来说，SEO 友好支持非常重要
- react-markdown：markdown 渲染
- lunr.js：基于浏览器环境的静态搜索工具
- tailwindcss: 后续将替换成 chakraUI

目标：实现 hexo-next 主题的风格，简单化，可配置。

已完成：

- 兼容 hexo 的写法，markdown 的 metadata 渲染

* 增加 阅读更多`<!--more-->`写法支持
- 替换 tailwindcss 为 chakraUI
- 替换核心渲染工具为 react-markdown
- 增加搜索功能 - flexSearch


未完成：

- 增加文章权重，排序置顶
- 首页重构，增加分页功能
- 增加目录归档页面
