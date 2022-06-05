---
title: apt-get 命令
categories: [运维]
tags: [linux]
toc: true
date: 2021/1/6
---

## apt-get 是什么？

执行 apt-get --help 可以得到以下的信息

```bash
apt-get is a command line interface for retrieval of packages
and information about them from authenticated sources and
for installation, upgrade and removal of packages together
with their dependencies.

Most used commands:
  update - Retrieve new lists of packages
  upgrade - Perform an upgrade
  install - Install new packages (pkg is libc6 not libc6.deb)
  remove - Remove packages
  purge - Remove packages and config files
  autoremove - Remove automatically all unused packages
  dist-upgrade - Distribution upgrade, see apt-get(8)
  dselect-upgrade - Follow dselect selections
  build-dep - Configure build-dependencies for source packages
  clean - Erase downloaded archive files
  autoclean - Erase old downloaded archive files
  check - Verify that there are no broken dependencies
  source - Download source archives
  download - Download the binary package into the current directory
  changelog - Download and display the changelog for the given package
```

简而言之，apt-get 是一个命令行交互工具，用来管理软件包。

### 常用的命令

- update: 更新当前 apt 的版本
- upgrade: 升级包
- install: 新安装一个包
  - `apt-get install <package_1> <package_2> <package_3>`
  - 安装指定版本 `sudo apt-get install <package_name>=<version_number>`
- remove: 删除一个包，保留配置文件
- purge: 删除包和相关的配置文件
- autoremove: 自动清除所有冗余（没有使用）的包
- apt-cache:
  - 搜索指定包 完全匹配：`apt-cache search <search term>` 模糊匹配： `apt-cache pkgnames <search_term>`
  - 获取跟多信息:`apt-cache showpkg <package_name>`
