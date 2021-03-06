本项目灵感来源[next.js - example - react-blog](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript)

技术栈：

- Next：基于 React 的 web framework，对于本项目来说，SEO 友好支持非常重要
- React(Hook version)
- Typescript
- react-markdown：markdown 渲染
- flexSearch：静态搜索 library
- ChakraUI

目标：实现 hexo-next 主题的风格，简单化，可配置。

已完成：

- 兼容 hexo 的写法，markdown 的 metadata 渲染

* 增加 阅读更多`<!--more-->`写法支持

- 替换 tailwindcss 为 chakraUI
- 替换核心渲染工具为 react-markdown
- 增加搜索功能 - flexSearch

* 使用 useReducer 代替 redux 实现状态管理

- 增加目录归档页面
- dockerilze
- 列表分页功能
- 侧边栏增加 tag 列表
- 文章增加目录，增加锚点定位
- SEO support optimize
- [图片压缩: 在图床项目中实现](https://github.com/shancw96/pic-server/blob/1532f64ea0ef6f4818bd06761881eb77a3dc13b1/src/controller/file.ts#L24)

未完成：

- 文章增加第三方评论功能
- nodejs 发送邮箱功能
- docker 热更新- https://dev.to/kumareth/next-js-docker-made-easy-2bok
- 增加文章权重，排序置顶
- 主题换色
