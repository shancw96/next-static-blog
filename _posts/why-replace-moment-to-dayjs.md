新项目中，不推荐使用moment 作为时间格式化工具，应该使用类似[dayjs](https://dayjs.gitee.io/docs/zh-CN/display/format) 的新library代替day。原因如下
1. moment 项目不再更新，出现问题没有保障

  ![image-20220712135243831](http://serial.limiaomiao.site:8089/public/uploads/image-20220712135243831.png)

2. moment gzipped 后的体积为72kb，而dayjs gzipped 后的体积为2.8kb
  ![image-20220712135304379](http://serial.limiaomiao.site:8089/public/uploads/image-20220712135304379.png)
  ![image-20220712135312870](http://serial.limiaomiao.site:8089/public/uploads/image-20220712135312870.png)
  这是个什么概念呢，未经过[tree shaking](https://webpack.js.org/guides/tree-shaking/)的 [lodash](https://bundlephobia.com/package/lodash@4.17.21)压缩后的体积为24.5kb，一个moment是lodash的近3倍

![image-20220712142516987](http://serial.limiaomiao.site:8089/public/uploads/image-20220712142516987.png)

