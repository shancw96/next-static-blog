---
title: 图片批量压缩下载
categories: [前端]
tags: [implement]
toc: true
date: 2020/9/8
---

## source code

```js
function downloadImgList(urlList, fileName) {
  const getFile = (url) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      // unique sign 解决 read from disk
      url = url + `?r=${Math.random()}`;
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () =>
        xhr.status === 200 ? resolve(xhr.response) : resolve();
      xhr.send();
    });
  const zipFile = (urlList) => (fileDataList) => {
    const getFileName = (url) => {
      const arrName = url.split("/");
      return arrName[arrName.length - 1];
    };
    const decodeName = (fileName) => {
      const endIndex = fileName.lastIndexOf(".");
      // 转码文件名, 上传的文件用decodeURIComponent转汉字
      return (
        decodeURIComponent(fileName.slice(0, endIndex)) +
        fileName.slice(endIndex)
      );
    };
    return fileDataList.reduce((zipHandler, file, index) => {
      zipHandler.file(decodeName(getFileName(urlList[index])), file, {
        binary: true,
      }); // 逐个添加文件
      return zipHandler;
    }, new JSZip());
  };
  const downloadCore = async (imgList, zipName) => {
    Promise.all(imgList.map(getFile))
      .then(zipFile(imgList))
      .then((zip) =>
        zip
          .generateAsync({ type: "blob" })
          .then(async (content) => FileSaver.saveAs(content, zipName))
      );
  };
  return downloadCore(urlList, fileName);
}
```

## 细节

### 流程

imgList -> 并发请求 -> fileList -> zip all File[JSZip] -> download file[`File saver`]

### 原理

- 依赖的 npm package: `JSZip, FileSaver`
- getFile：封装 xhr 请求为 Promise，设置返回值类型为`blob`
- zipFile：使用`JSZip：zip.file()` 挨个添加图片到 zip 实例
- 调用`JSZip: generateAsync`生成 blob 类型数据，并使用 FileSaver 进行保存
