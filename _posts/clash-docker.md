---
title: Docker 启动clash
categories: [杂项]
tags: []
toc: true
date: 2022/3/24
---

基于 docker-compose 在 linux 服务器上一键部署 clash + 对应的 Web UI 界面。

配置如下：

```bash
# docker-compose版本
version: '3.7'
# 服务列表
services:
    # clash后台服务
    clash:
        # 设置image
        image: dreamacro/clash
        # 停止了总是重启
        restart: always
        volumes:
            # 将配置文件挂载到容器中
            - <path to clash config dir>:/root/.config/clash
        container_name: clash
        ports:
            # 这些端口都在配置文件中配置过，容器外地址可随心情配置
            - [容器外http代理端口]:[容器内http代理端口，默认7890]
            - [容器外sock5代理端口]:[容器内sock5代理端口，默认7890]
            - [容器外REST API端口]:[容器内REST API端口，默认9090]
    clash_web:
        image: haishanh/yacd
        restart: always
        depends_on:
            # 依赖于上面的clash服务，在clash启动后，web才启动
            - clash
        ports:
            - [容器外web访问端口]:80
        container_name: clash_web
```

<!-- more -->

# tty 使用代理

zsh

```bash
# 进入zsh 的配置文件
vim ~/.zshrc
# 配置文件
# 配置http和https代理
# http://clash客户端IP:clash客户端端口
http_proxy=http://127.0.0.1:7890
https_proxy=http_proxy
# 对以下内容不使用代理
no_proxy=192.168..,172.16..,.local,localhost,127.0.0.1
# 导出环境变量
export http_proxy https_proxy no_proxy
```

# 其他容器使用 clash 代理 - docker compose

有部分服务不提供走代理的方式，可以通过如下方式配置

```yaml
# 下面略写，照常配置
version: "3.7"
services:
  xxxx:
    xxx: xxx

# 关键点： network
networks:
  default:
    # 声明该网络为外部已存在网络
    external:
      name: 张三_default
```

# 参考文章

- [Linux 通过 Clash 来网上冲浪](https://blog.vicat.top/archives/linux%E9%80%9A%E8%BF%87clash%E6%9D%A5%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91#toc-head-0)
