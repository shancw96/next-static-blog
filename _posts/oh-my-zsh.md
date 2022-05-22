---
title: Oh My Zsh 常用plugin
categories: []
tags: []
toc: true
date: 2022/3/22
---

- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) 语法高亮
- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 自动补全

<!-- more -->

## 插件的添加方式

- 安装插件
  ```bash
  cd ~/.oh-my-zsh/plugins
  # git clone plugins
  ```

* .zshrc 中配置
  ```bash
  vim ~/.zshrc
  # 找到plugins
  plugins=(
        git
        zsh-autosuggestions
        zsh-syntax-highlighting
        想要新添加的插件添加在此处
  )
  ```
