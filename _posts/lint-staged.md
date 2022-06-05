---
title: 使用lint-staged 优化团队开发体验
categories: [前端]
tags: [工程化]
toc: true
date: 2021/2/24
---

## 用处

lint-staged 借助 git hook 实现在 git commit 前自动进行代码 prettier + eslint 检测。如果存在 eslint error 则会 commit 失败。

## 原理

[lint-staged](https://www.npmjs.com/package/lint-staged) 基于 husky，[husky](https://typicode.github.io/husky/#/)能够让开发者更加便捷的操作 git hook.

借助 husky 提供的 pre-commit hook，在每次 commit 前可以触发特定的操作，比如执行 lint-staged 对提交的 code 进行 prettier 和 eslint 检测。

> husky: You can use it to lint your commit messages, run tests, lint code, etc... when you commit or push. Husky supports all Git hooks.

## 安装使用

**安装**

```bash
npx mrm lint-staged
```

**使用**
在执行了上面的命令后，package.json 中会添加相关的依赖和配置项,如下

```json
{
  "name": "My project",
  "version": "0.1.0",
  "scripts": {
    "my-custom-script": "linter --arg1 --arg2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "**/*": ["eslint --cache --fix"]
  }
}
```

**添加 prettier 代码美化工具**

1. npm 安装：`npm i prettier -D`
2. 修改 package.json 中的配置项：

```json
{
  "name": "My project",
  "version": "0.1.0",
  "scripts": {
    "my-custom-script": "linter --arg1 --arg2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
+   "**/*": ["prettier --write --single-quote --ignore-unknown", "eslint --cache --fix"]
  }
}
```

> --single-quote 为 prettier 的配置项：默认使用单引号，自定义配置参考此处[Prettier Options](https://prettier.io/docs/en/options.html)

**指定 lint-staged 的生效目录**

2. 修改 package.json 中的配置项：

```json
{
  "name": "My project",
  "version": "0.1.0",
  "scripts": {
    "my-custom-script": "linter --arg1 --arg2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
+   "src/**/*.{js,vue}": [
      "prettier --write --single-quote --ignore-unknown",
      "eslint --cache --fix"
    ]
  }
}
```

说明:

- `src/**/*.{js,vue}`：匹配 src 目录下所有的 js 和 vue 文件
- 匹配规则为 glob-pattern:
  - \*\* 表示递归匹配目录
  - `/*.{js,vue}`会展开为 `/*.js /*.vue`

* glob-pattern 文章参考：
  - [A Beginner's Guide: Glob Patterns](https://www.malikbrowne.com/blog/a-beginners-guide-glob-patterns)
  - [返回主页流浪猫の窝: node-glob 学习](https://www.cnblogs.com/liulangmao/p/4552339.html)

## 注意

如果项目中配置了 eslint-loader 进行 eslint-on-save, 会和 lint-staged 冲突，需要关闭。

因为 eslint-loader 是保存的时候进行检测，如果项目 lint 没通过，无法正常开发，此时开启 lint-staged 没有什么意义。

所以二选一, 保存时候检测 OR commit 前自动格式化+检测
