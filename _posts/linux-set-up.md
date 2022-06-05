---
title: ubuntu-setup
categories: []
tags: []
toc: true
date: 2021/6/13
---

ubuntu 新系统个性化配置

<!-- more -->

# 关闭自动锁屏

Setting - Privacy - Automatic Screen Lock 关闭

Lock screen on suspend 关闭

# ssh 相关

## ssh-server

```bash
sudo apt-get install openssh-server
# 开启ssh
sudo systemctl enable ssh
sudo systemctl start ssh
```

## ssh 密钥登录

`ssh-keygen` 生成密匙，`ssh-copy-id 用户名@ip地址`将公钥传送到远程主机

# git 安装

```bash
sudo apt install git-all

```

# curl 安装

```bash
apt-get install curl

```

# zerotier 相关配置

https://jiajunhuang.com/articles/2019_09_11-zerotier.md.html

# nginx 安装

`apt-get install nginx`

# NodeJS 安装

nvm 管理工具下载：

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash`

`source ~/.nvm/nvm.sh`

`nvm install node`

`nvm use node`

# clash

## 安装

https://einverne.github.io/post/2021/03/linux-use-clash.html

## 自启动配置

```bash
#!/bin/bash
gsettings set org.gnome.system.proxy mode 'manual' #ubuntu网络模式配置为手动
cd /home/shancw/project  #切换到Clash的目录
./clash . &  #在后台执行clash客户端
echo "start vpn successfully!"  #启动成功的提示
exit 0
```

# 配置自启动脚本

1. `gnome-session-properties` 打开 startup Application Preference 界面
2. 点击右侧的 add
3. 在 command 输入框 输入想要执行的 shell 脚本如 sh clash-start.sh
