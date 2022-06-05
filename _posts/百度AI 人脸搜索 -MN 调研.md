---
title: 百度AI 人脸搜索 -M:N 调研
categories: [杂项]
tags: []
toc: true
date: 2022/4/21
---

无情分隔符

<!-- more -->

## 介绍

### 人脸搜索 M：N 识别介绍

- 人脸搜索 M：N 也称为 M：N 识别，待识别图片中含有多个人脸时，在指定人脸集合中，找到这多个人脸分别最相似的人脸
- 一张图片最大识别人数上限为 10 人

### 人脸库结构介绍

```js

|- 人脸库(appid)
   |- 用户组一（group_id）
      |- 用户01（uid）
         |- 人脸（faceid）
      |- 用户02（uid）
         |- 人脸（faceid）
         |- 人脸（faceid）
         ....
       ....
   |- 用户组二（group_id）
   |- 用户组三（group_id）
   ....
```

- 每个用户（user_id）所能注册的最大人脸数量**20**。

- **每个 appid 对应一个人脸库，且不同 appid 之间，人脸库互不相通**。

- `access_token`的有效期为 30 天，**切记需要每 30 天进行定期更换，或者每次请求都拉取新 token**

  建议每次请求拉取新的 token，然后再进行正式请求

  ```js
  fetchAccessToken.then((access_token) => doRealFetchWithAccessToken);
  ```

* 每个人脸库对应一个 appid，一定确保不要轻易删除后台应用列表中的 appid，删除后则此人脸库将失效，无法进行任何查找！

收费方式：

https://cloud.baidu.com/doc/FACE/s/Uk37c1m9b#1%E3%80%81%E5%85%AC%E6%9C%89%E4%BA%91-api

![image-20220421155208443](https://blog.shancw.net/public/uploads/image-20220421155208443.png)

## 步骤

![image-20220421154942659](https://blog.shancw.net/public/uploads/image-20220421154942659.png)

https://console.bce.baidu.com/ai/?fromai=1#/ai/face/overview/index

### 1. 创建应用

![image-20220421134001091](https://blog.shancw.net/public/uploads/image-20220421134001091.png)

创建成功后，应用列表显示如下

<img src="https://blog.shancw.net/public/uploads/image-20220421134058407.png" alt="image-20220421134058407" style="zoom: 200%;" />

### 2. 创建人脸库

人脸注册，有两种方式：

1. 控制台手动上传

   ![image-20220421134340576](https://blog.shancw.net/public/uploads/image-20220421134340576.png)

2. 调用接口上传

https://ai.baidu.com/ai-doc/FACE/ak3co86dk#%E4%BA%BA%E8%84%B8%E6%B3%A8%E5%86%8C

### 3. 具体接口调用

#### access_token 获取

> 通过 API Key 和 Secret Key 获取的 access_token,参考“[Access Token 获取](http://ai.baidu.com/docs#/Auth)”

```bash
url: https://aip.baidubce.com/oauth/2.0/token
method: get
urlParameters:
	grant_type: 必须参数，固定为 'client_credentials'
	client_id:  必须参数，应用的api key
	client_secret: 必须参数，应用的Secret key
```

示例代码：

```bash
curl -i -k 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=【百度云应用的AK】&client_secret=【百度云应用的SK】'
```

![image-20220421140709752](https://blog.shancw.net/public/uploads/image-20220421140709752.png)

#### 人脸注册接口调用

接口的约束如下：

- **人脸识别接口分为 V2 和 V3 两个版本，本文档为 V3 版本接口的说明文档**

  确认方式：查看创建的应用详情

  ![image-20220421150322834](https://blog.shancw.net/public/uploads/image-20220421150322834.png)

​

URL：https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add

URL 参数：

| 参数         | 值                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| access_token | 通过 API Key 和 Secret Key 获取的 access_token,参考“[Access Token 获取](http://ai.baidu.com/docs#/Auth)” |

Header 如下：

| 参数         | 值               |
| ------------ | ---------------- |
| Content-Type | application/json |

Body 中放置请求参数，参数详情如下：

**请求参数**

| 参数             | 必选 | 类型   | 说明                                                                                                                                                                                                                                                                                            |
| ---------------- | ---- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| image            | 是   | string | 图片信息(**总数据大小应小于 10M**)，图片上传方式根据 image_type 来判断。 注：组内每个 uid 下的人脸图片数目上限为 20 张                                                                                                                                                                          |
| image_type       | 是   | string | 图片类型 **BASE64**:图片的 base64 值，base64 编码后的图片数据，编码后的图片大小不超过 2M； **URL**:图片的 URL 地址( 可能由于网络等原因导致下载图片时间过长)；                                                                                                                                   |
| group_id         | 是   | string | 用户组 id，标识一组用户（由数字、字母、下划线组成），长度限制 48B。**产品建议**：根据您的业务需求，可以将需要注册的用户，按照业务划分，分配到不同的 group 下，例如按照会员手机尾号作为 groupid，用于刷脸支付、会员计费消费等，这样可以尽可能控制每个 group 下的用户数与人脸数，提升检索的准确率 |
| user_id          | 是   | string | 用户 id（由数字、字母、下划线组成），长度限制 128B                                                                                                                                                                                                                                              |
| scene_type       | 是   | string | 场景类型选择，**SEC**: 视频监控场景                                                                                                                                                                                                                                                             |
| user_info        | 否   | string | 用户资料，长度限制 256B 默认空                                                                                                                                                                                                                                                                  |
| quality_control  | 否   | string | 图片质量控制 **NONE**: 不进行控制 **LOW**:较低的质量要求 **NORMAL**: 一般的质量要求 **HIGH**: 较高的质量要求 **默认 NONE** 若图片质量不满足要求，则返回结果中会提示质量检测失败                                                                                                                 |
| liveness_control | 否   | string | 活体检测控制 **NONE**: 不进行控制 **LOW**:较低的活体要求(高通过率 低攻击拒绝率) **NORMAL**: 一般的活体要求(平衡的攻击拒绝率, 通过率) **HIGH**: 较高的活体要求(高攻击拒绝率 低通过率) **默认 NONE** 若活体检测结果不满足要求，则返回结果中会提示活体检测失败                                     |
| action_type      | 否   | string | **操作方式** APPEND: 当 user_id 在库中已经存在时，对此 user_id 重复注册时，新注册的图片默认会追加到该 user_id 下 REPLACE : 当对此 user_id 重复注册时,则会用新图替换库中该 user_id 下所有图片 默认使用 APPEND                                                                                    |
| face_sort_type   | 否   | int    | 人脸检测排序类型 **0**:代表检测出的人脸按照人脸面积从大到小排列 **1**:代表检测出的人脸按照距离图片中心从近到远排列 **默认为 0**                                                                                                                                                                 |

示例：

![image-20220421152600808](https://blog.shancw.net/public/uploads/image-20220421152600808.png)

### 人脸 M:N 搜索

https://ai.baidu.com/ai-doc/FACE/Gk37c1uzc#%E4%BA%BA%E8%84%B8%E6%90%9C%E7%B4%A2-mn-%E8%AF%86%E5%88%AB

![image-20220421154735868](https://blog.shancw.net/public/uploads/image-20220421154735868.png)
