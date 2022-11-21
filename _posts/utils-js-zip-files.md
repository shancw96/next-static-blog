---
title: js文件压缩
categories: [算法]
tags: [tree, binary-tree, binary-search-tree, AVL-tree, DFS, BFS]
toc: true
date: 2022/7/5
---


```js
import JSZip from 'jszip';
import FileSaver from 'file-saver';
// 对应项目中封装的axios实例
import request from '@/utils/request';

const getFile = (url) => {
  return new Promise((resolve, reject) => {
    request(url, {
      method: 'GET',
      responseType: 'blob'
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * 打包压缩下载
 * @param data  源文件数组
 * @param fileName  压缩文件的名称
 */
export const compressAndDownload = (data, fileName) => {
  const zip = new JSZip();
  const promises = [];  //用于存储多个promise
  data.forEach((item) => {
    const promise = getFile(item.fileUrl).then((res) => {
      const fileName = item.fileName
      zip.file(fileName, res ,{binary: true});
    })
    promises.push(promise)
  })

  Promise.all(promises).then(() => {
    zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',  // STORE：默认不压缩 DEFLATE：需要压缩
      compressionOptions: {
        level: 9               // 压缩等级1~9    1压缩速度最快，9最优压缩方式
      }
    }).then((res) => {
      FileSaver.saveAs(res, fileName ? fileName : '压缩包.zip') // 利用file-saver保存文件
    })
  })
}
```

