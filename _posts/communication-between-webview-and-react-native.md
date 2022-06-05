---
title: webview 和 react native 通信
categories: [前端]
tags: [jsx, react]
toc: true
date: 2022/5/30
---

# webview 和 react native 通信

场景：react native 使用 webview，webview 作为独立应用和 react native 需要相互通信

原理：借助 web api：`postMessage`，react native api `injectJavaScript` 实现通信

<!-- more -->

**react native 使用的 package**

`react-native-webview`。安装请参考对应的 github 文档

## Web --------> react native

web

```js
window.ReactNativeWebView.postMessage(msg);
```

App

```diff
// 接收来自webview端的信息
+  const receiveMsgFromWeb = e => {
+    const msg = e.nativeEvent.data;
+  };

<WebView
   // 此处在开发的时候，应该填写你自己的web端服务的ip地址或者是线上地址
   source={{ uri: 'http://192.168.1.193:8088/mobile-map.html' }}
+  onMessage={receiveMsgFromWeb}
/>
```

## react- native ----> Web

- web 定义好 被调用的全局函数，例如 receiveLocation

  ```js
  const [initLocation, setInitLocation] = useState();
  useEffect(() => {
    window.receiveLocation = (msg) => {
      console.log(msg);
    };
  }, []);
  ```

- react-native 注入代码到 webview 中，执行 web 端定义好的 receiveLocation 函数

  ```diff
  + const webRef = useRef();
    // 发送位置信息给webview
    const sendLocationToWeb = () => {
  +    webRef.current?.injectJavaScript(
  +      script(`${pos.latitude},${pos.longitude}`),
  +    );

  +    function script(payload: string) {
  +      return `
  +      receiveLocation("${payload}");true;
  +      `;
  +    }
    };
   	<WebView
  +   ref={webRef}
    	// 此处在开发的时候，应该填写你自己的web端服务的ip地址或者是线上地址
    	source={{ uri: 'http://192.168.1.193:8088/mobile-map.html' }}
    	onMessage={receiveMsgFromWeb}
   />
  ```
