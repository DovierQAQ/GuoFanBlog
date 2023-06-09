---
title: 高德地图API使用 - 定位以及路径（安卓版本）
date: 2023-05-31 22:27:49
updated: 2023-05-31 22:27:49
cover: route.jpg
tags:
    - JAVA
    - 安卓
    - 高德地图
categories:
    - 经验总结
---

大四的时候，主要是两个项目在并行：
- 毕业设计，需要制作一台自动配送快递的小车
如何自动配送呢，我们设计的系统是有一个 APP，快递员在存放快递到小车的储物箱时，可以通过APP设置小车的终点。APP 会自动计算出路径，并上传至服务器。高德地图 API 有足够的能力完成这个工作。
- CPS 碳排放监控项目，需要制作一整套施工工地碳排放监控系统
其中有一个功能是需要实时监控运输车的位置，记录其运行路径并换算出碳排放数值。我们设计的系统是制作一款手机 APP，司机将其安装至手机上，手机随着司机和运输车的运动通过高德地图 API 记录好路径数值。

{% note warning flat %}
TODO 由于 CPS 项目交付时只交付了源码，没有留下图片，并且 CPS 项目所使用的服务器现在已经没有续费了。等有时间搭起安卓开发环境再完善这篇文章。
{% endnote %}

---------------------------------------

## API Key

## 定位

## 路径规划

![](route.jpg)

## 在地图上放置图标

![](pos.jpg)

## 在地图上绘制线条
