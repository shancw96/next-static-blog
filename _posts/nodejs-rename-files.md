---
title: Node.js rename files
categories: [杂项]
tags: [nodejs, emby, chinese_subfinder]
toc: true
date: 2022/4/6
---

最近按照 网上的 高阶追剧流程搞了一套 emby + sonarr + radarr + jacket 的私有家庭媒体库。对于美剧字幕的搜索使用 chinese_subfinder，但是偶尔会出现整季字幕查询不到，或者某一集字幕缺失的情况。

对于上述问题，手动重命名显然不符合我们程序员的脾气，因此就有了如下文章，写个 js 脚本自动替换[字幕库](http://zimuku.org/)的文件命名，使他符合 emby 的字幕规范

<!-- more -->

## 先上代码

```js
// Import filesystem module
const fs = require("fs");

// List all the filenames before renaming
getCurrentFilenames();

function getCurrentFilenames() {
  const dirName = readSyncByfs();
  console.log(dirName, __dirname);
  fs.readdirSync(dirName).forEach((file) => {
    replaceName(file, dirName);
    // console.log(file);
  });
}

function replaceName(originName, staticPath) {
  fs.rename(
    `${staticPath}\\${originName}`,
    `${staticPath}\\${regExpReplace(originName)}`,
    (err) => {
      if (err) throw err;
      console.log(
        `${staticPath}\\${originName}------------>${staticPath}\\${regExpReplace(
          originName
        )}`
      );
    }
  );
  // ---- utils -----
  function regExpReplace(str) {
    return str.replace(
      /(.*)\.(S\d+E\d+)\.(\w+)(.*)/,
      (match, group1, group2, group3) => {
        return `${group1.replace(
          /\./g,
          " "
        )} - ${group2} - ${group3}.chinese(简体).ass`;
      }
    );
  }
}

function readSyncByfs(tips) {
  tips = tips || "> ";
  process.stdout.write(tips);
  process.stdin.pause();

  const buf = Buffer.allocUnsafe(10000);
  const response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
  process.stdin.end();
  return buf.toString("utf8", 0, response).trim();
}
```

使用方式：

> 需要先安装 nodejs

1. 找到字幕库的字幕文件夹路径，比如：`C:\Users\shancw\Downloads\[zmk.pw]绝命律师.第3季.全10集[8.7]Better.Call.Saul.S03.1080p.WEB-DL.DD5.1.H264-RARBG.ChsEng`
2. 在命令行中输入：`node rename-files.js` 这里的文件名就是上述代码的名称
3. 按照提示输入文件夹路径
4. 完成

涉及到的知识点

- nodejs 读取用户输入

  ```js
  function readSyncByfs(tips) {
    tips = tips || "> ";
    process.stdout.write(tips);
    process.stdin.pause();

    const buf = Buffer.allocUnsafe(10000);
    const response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
    process.stdin.end();
    return buf.toString("utf8", 0, response).trim();
  }
  ```

* 根据用户输入的路径，获取当前路径下的所有文件

```js
function getCurrentFilenames() {
  const dirName = readSyncByfs();
  fs.readdirSync(dirName).forEach((file) => replaceName(file, dirName));
}
```

- 正则替换字幕库的命名格式
  - 文件夹重命名：fs.rename
  - 正则替换: str.replace(/regexp/g, replacement)
  ```js
  function replaceName(originName, staticPath) {
    fs.rename(
      `${staticPath}\\${originName}`,
      `${staticPath}\\${regExpReplace(originName)}`,
      (err) => {
        if (err) throw err;
        console.log(
          `${staticPath}\\${originName}------------>${staticPath}\\${regExpReplace(
            originName
          )}`
        );
      }
    );
    // ---- utils -----
    function regExpReplace(str) {
      return str.replace(
        /(.*)\.(S\d+E\d+)\.(\w+)(.*)/,
        (match, group1, group2, group3) => {
          return `${group1.replace(
            /\./g,
            " "
          )} - ${group2} - ${group3}.chinese(简体).ass`;
        }
      );
    }
  }
  ```
