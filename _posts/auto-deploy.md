---
title: 使用github webhook自动部署hexo & docker 部署
categories: [杂项]
tags: []
toc: true
date: 2021/4/25
---

需要使用到的工具：nginx, nodejs, pm2(npm package), koa(npm package), github webhook.

流程：

1. pm2 维护一个 nodejs web 服务
2. 用户提交 commit 后触发 webhook，向 nodejs web 服务发送请求。
3. web 服务接收到请求，执行自动执行脚本
<!-- more -->

## 1. 写自动部署脚本 + web 服务

### 创建自动构建脚本目录

```bash
> mkdir git-webhooks && cd git-webhooks
```

### 创建 hook：blog-hook.js

> 我这里的博客地址为 /home/shancw/Project/blogs

- git pull origin master
- npm run build # 生成 hexo 静态文件

```js
const util = require("util");
const exec = util.promisify(require("child_process").exec);
async function main() {
  await exec("cd /home/shancw/Project/blogs && git pull origin master");
  await exec("cd /home/shancw/Project/blogs && npm run build");
}

module.exports = {
  main,
};
```

### 创建 web 服务(开启端口为 4001): index.js

```js
const Koa = require("koa");

const app = new Koa();
const exec = require("./blog-hook.js").main;
app.use(async (ctx) => {
  console.log("blog webhook trigger! start deploy");
  exec();
});

app.listen(4001);
```

### 目录结构：

- git-webhooks
  - index.js
  - blog-hook.js

## 2. 配置 nginx 转发

> linux 的 nginx 位置：/etc/nginx
> 自定义配置位置 /etc/nginx/conf.d

### 在 conf.d 下添加 github webhook 的要触发的 web 服务地址

www.limiaomiao.site/auto-deploy/ -> http://localhost:4001/

```bash
# blog-deploy.conf
server {
  server_name www.limiaomiao.site limiaomiao.site;
  location /auto-deploy/ {
    proxy_pass http://localhost:4001/;
  }
}
```

### 在 conf.d 下添加 hexo 静态文件代理

```bash
# blog static.conf
server {
    listen 80;
    server_name blog.limiaomiao.site;
    root /home/shancw/Project/blogs/public;   #这是我们的资源文件目录...
    index index.html index.htm index.nginx-debian.html;
}
```

### 调整 hexo 博客的\_config.yml 文件的 URL

```yml
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://blog.limiaomiao.site/
root: /
```

## 在 github blog 项目下开启 github hook

payload url 为步骤二中 nginx 转发的 url
<img src="webhook.jpg" />
