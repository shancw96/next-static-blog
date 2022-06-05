---
title: 自定义博客
categories: [杂项]
tags: []
toc: true
date: 2021/3/14
---

next 主题的使用 Tips

 <!--more-->

## 在首页的时候显示 Read More

`<!--more-->`

## 在文章中插入图片

Hexo 博客搭建之在文章中插入图片

绝对路径本地引用
当 Hexo 项目中只用到少量图片时，可以将图片统一放在 source/images 文件夹中，通过 markdown 语法访问它们。

`![](/images/image.jpg)`

图片既可以在首页内容中访问到，也可以在文章正文中访问到。

## 2d live 看板娘设置

[可选的人物模型](https://huaji8.top/post/live2d-plugin-2.0/)

### install

- 安装辅助插件

  ```bash
  npm install --save hexo-helper-live2d
  ```

- 安装对应的模型

  `npm install --save live2d-widget-model-<mode-name>`

  `<mode-name>`就是对应的模型名称， 如我选择的模型为 shizuku

  ```bash
    npm install --save live2d-widget-model-shizuku
  ```

### 配置

在 blog root 目录 的 \_config.yml 文件最后一行，添加如下代码

```yml
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: live2d-widget-model-shizuku # 选择的model
  display:
    position: right # 右下角
    width: 200
    height: 400
    hOffset: 60 # 水平位置
    vOffset: -20 # 垂直位置
  mobile:
    show: false # 手机显示
```

### 启动项目

```bash
hexo clean && hexo g && hexo s
```

### 优化

#### hexo 托管在个人服务器上 live2d 每次打开新的页面都会重新向服务器发送请求，导致模型加载太慢

解决方法：nginx 配置 cache-control

```conf
server {
    listen 80;
    server_name blog.limiaomiao.site;
    root /home/shancw/Project/blogs/public;   #//这是我们的资源文件目录
    index index.html index.htm index.nginx-debian.html;
    #return 301 https://$server_name$request_uri;

# 新添加的代码如下
# 对blog 域名下的 图片进行缓存处理
	location ~ \.(gif|jpg|jpeg|png|bmp|ico)$ {
   		expires 30d;
	}
# 对带有 live2dw 字段的uri request 设置缓存
	location ~* live2dw.* {
		add_header    Cache-Control  max-age=3600;
	}
}
```

> ~\* 表示 后面的启用正则匹配, 关于 nginx location 更多参考 https://segmentfault.com/a/1190000013267839

> 其实只需要对 live2dw 进行匹配就能达到目标效果。但是为 blog 下的图片进行缓存处理也是必要的。

关于 hexo 个人服务器托管 + 自动化部署的教程可以参考这篇文章

[使用 github webhook 自动部署 hexo](http://blog.limiaomiao.site/2021/03/01/auto-deploy/)
