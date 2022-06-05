---
title: Nodejs-Koa-template
categories: [后端]
tags: [nodejs, koa, ts]
toc: true
date: 2022/4/17
---

github 模版地址：[Koa with Typescript](https://github.com/shancw96/koa-ts-template.git)

<!-- more -->

## Writing a Configuration File

tsconfig.json 用于配置 ts，比如覆盖哪些文件，要做哪些校验

```json
{
  "compilerOptions": {
    "outDir": "diST",
    "allowJs": true,
    "target": "ES6", // optional：es5, es6,es2020,esnext
    "module": "commonjs", // ts module输出的格式，koa基于nodejs，因此选择commonjs
    "moduleResolution": "node",
    "lib": [
      "es6"
    ] /* Specify library files to be included in the compilation. */,
    "allowSyntheticDefaultImports": true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
  },
  "include": ["src/**/*"]
}
```

> esnext: ES Next simply call the Next version or upcoming version of ES(ECMAScript / JavaScript ).
>
> module 的输出可选项:
>
>     +  https://www.typescriptlang.org/docs/handbook/modules.html#code-generation-for-modules
>     +  https://www.typescriptlang.org/tsconfig#module
>
> moduleResolution: module 输出策略的细化
>
> - https://www.typescriptlang.org/tsconfig#moduleResolution

## 增加 type support

```bash
yarn add @types/node @types/koa
```

## 编译

tsc

## 增加环境变量 [dotenv](https://www.npmjs.com/package/dotenv)

dotenv 可以将.env 文件加载到 process.env 中

```bash
yarn add dotenv
```

尽可能早的在项目中配置。

```js
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
```

## 增加自动重启

nodemon 用于 nodejs 服务自动重启，当监听到指定的文件夹下文件发生变动后触发

安装

```js
yarn add -D nodemon
```

使用

package.json 增加启动脚本

```js
{
  ...
  "scripts": {
    "watch-server": "nodemon --ignore tests/ --watch src -e ts,tsx --exec ts-node src/index.ts"
  }
}
```
