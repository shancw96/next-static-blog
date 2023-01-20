---
title: opencv实现 图片模板匹配
categories: [python]
tags: [python, opencv, matchTemplate]
toc: true
date: 2022/1/16
---







这篇文章介绍了使用opencv matchTemplate 实现图像匹配的方式

<!-- more -->



## Table of Content



## opencv matchTemplate 实现图像匹配的优点和缺点是什么？

OpenCV 的 matchTemplate 函数可以用来实现图像匹配。它的优点是：

- 简单易用，可以方便地在图像中查找模板。
- 可以使用多种不同的匹配方式，如相关性匹配、卷积匹配等。

缺点是：

- 对于旋转和尺度变换的图像，效果不佳。
- 匹配的精度取决于模板的大小和图像的分辨率，选择不当可能导致误识别。



## 单个模板图片的识别代码参考

```python
import cv2

# 读取图像和模板
img = cv2.imread('image.jpg')
template = cv2.imread('template.jpg')

# 获取模板的尺寸
h, w = template.shape[:-1]

# 使用 matchTemplate 函数进行匹配
res = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)

# 找到最佳匹配位置
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

# 在图像上画出矩形
top_left = max_loc

# 设置阈值
threshold = 0.8

if max_val > threshold:
    # 在图像上画出矩形
    top_left = max_loc
    bottom_right = (top_left[0] + w, top_left[1] + h)
    cv2.rectangle(img, top_left, bottom_right, (0, 0, 255), 2)
    print("Found the template in the image.")
else:
    print("Can not found the template in the image.")

# 显示图像
cv2.imshow('image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```



这段代码的作用是找到图像中与模板匹配度最高的位置并在图像上画出矩形。

- minMaxLoc 函数会在结果图像中找到最大值和最小值的位置。在这个例子中，我们用 matchTemplate 函数计算出了一个相关性结果图像，其中匹配度最高的位置对应着图像中与模板最相似的部分。minMaxLoc 函数会返回最大值和最小值的值和位置。
- top_left 变量存储了最佳匹配位置的坐标，是一个二元组 (x, y)。
- bottom_right 变量计算出了矩形右下角的坐标，是一个二元组 (x+w, y+h)。w, h 分别是模板图像的宽度和高度。
- cv2.rectangle 函数用来在图像上画出矩形。它需要四个参数：第一个是输入图像，第二个是矩形左上角的坐标，第三个是矩形右下角的坐标，第四个是颜色，第五个是线条粗细。

这段代码的总体流程是: 先使用matchTemplate找到与模板匹配度最高的位置，然后计算出矩形的左上角和右下角的坐标，最后在原图上画出矩形来表示匹配到的位置



## 需要识别图片中多个模板的位置（一张识别图片中有多个相同模板图片），代码参考

如果需要识别图片中多个模板的位置，可以在 matchTemplate 函数之后使用 cv2.threshold() 函数将结果图像二值化，并使用 cv2.findContours() 函数来寻找连通域，来找到多个模板的位置。

```python
import cv2
import numpy as np

# 读取图像和模板
img = cv2.imread('image.jpg')
template = cv2.imread('template.jpg')

# 使用 matchTemplate 函数进行匹配
res = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)

# 二值化结果图像
threshold = 0.8
_, binary_image = cv2.threshold(res, threshold, 1.0, cv2.THRESH_BINARY)

# 找到连通域
contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
# 获取模板的尺寸
w, h = template.shape[:-1]

# 遍历每一个连通域，在图像上画出矩形
for cnt in contours:
x, y, w, h = cv2.boundingRect(cnt)
cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)

# 显示图像
cv2.imshow('image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

```

## 多个模板图片，一张识别图片

遍历循环

```python
import cv2
import numpy as np

# 读取图像
img = cv2.imread('image.jpg')

# 读取模板图片
template1 = cv2.imread('template1.jpg')
template2 = cv2.imread('template2.jpg')
templates = [template1, template2]

# 设置阈值
threshold = 0.8

# 遍历每一个模板图片
for template in templates:
    # 使用 matchTemplate 函数进行匹配
    res = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)

    # 找到最佳匹配位置
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    if max_val > threshold:
        # 获取模板的尺寸
        w, h = template.shape[:-1]
        # 在图像上画出矩形
        top_left = max_loc
        bottom_right = (top_left[0] + w, top_left[1] + h)
        cv2.rectangle(img, top_left, bottom_right, (0, 0, 255), 2)
        print("Found the template in the image.")
    else:
        print("Can not found the template in the image.")

# 显示图像
cv2.imshow('image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

```

