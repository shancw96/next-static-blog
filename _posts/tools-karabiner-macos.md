---
title: 通过karabiner实现macos键盘映射
categories: [life]
tags: [karabiner]
toc: true
date: 2023/1/13
---

Karabiner-Elements
A powerful and stable keyboard customizer for macOS.

> karabiner 是 macos 上用于键盘映射的软件

<!-- more -->

流程：增加自定义的配置文件，导入到 karabiner 中，配置文件的存放位置:`~/.config/karabiner/assets/complex_modifications`

## 将任意鼠标侧键映射为 macos 切屏

在上述位置，创建名为 demo.json 文件，写入如下内容

```json
{
  "title": "user custom",
  "rules": [
    {
      "description": "btn5: ctrl + <-, btn4:ctrl+->",
      "manipulators": [
        {
          "from": {
            "pointing_button": "button5"
          },
          "to": [
            {
              "key_code": "left_arrow",
              "modifiers": ["left_control"]
            }
          ],
          "type": "basic"
        },
        {
          "from": {
            "pointing_button": "button4"
          },
          "to": [
            {
              "key_code": "right_arrow",
              "modifiers": ["left_control"]
            }
          ],
          "type": "basic"
        }
      ]
    }
  ]
}
```

![image-20230113102253946](https://pic.limiaomiao.site:8443/public/uploads/image-20230113102253946.png)

![image-20230113102322867](https://pic.limiaomiao.site:8443/public/uploads/image-20230113102322867.png)

自定义配置启用后，还需要查看 Device 下 对应的鼠标 Modify events 选项有没有打开：

![image-20230113102417705](https://pic.limiaomiao.site:8443/public/uploads/image-20230113102417705.png)
