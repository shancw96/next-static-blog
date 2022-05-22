---
title: 一分钟自建 zerotier-planet 行星服务器
categories: []
tags: []
toc: true
date: 2022/3/18
---

通过 docker 简单部署 zerotier-planet
[github 地址](https://github.com/Jonnyan404/zerotier-planet)

<!-- more -->

```bash
docker run --restart=on-failure:3 -d --name ztncui -e HTTP_PORT=4000 -e HTTP_ALL_INTERFACES=yes -e ZTNCUI_PASSWD=mrdoc.fun -p 4000:4000 keynetworks/ztncui
```

然后访问 http://ip:4000 访问 web 界面.

用户名:admin
密码:mrdoc.fun
