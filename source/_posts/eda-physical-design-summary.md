---
title: EDA物理设计总体概览
date: 2023-08-10 14:24:46
updated: 2023-08-10 14:24:46
cover:
tags:
    - EDA
    - 物理设计
categories:
    - 经验总结
---

在粗略阅读《数字集成电路物理设计》这本书之后，与其说花费很多时间精力去研读其中的细节，倒不如先进行一次复习，将自己所理解的 EDA 物理设计的流程以及关键技术总结成图。

## 各部分组成

{% plantuml %}

@startwbs

<style>
node {
    BackgroundColor white
}
</style>

* 物理设计
** 布图规划和布局
*** 布图规划（floorplan）
*** 电源规划（powerplan）
*** 布局
**** 结群布局（clustering）
**** 全局布局（global placement）
**** 详细布局（detail placement）
** 时钟树综合
** 布线
*** 全局布线
*** 详细布线
*** 布线修正
** 静态时序分析
*** 延迟计算与布线参数提取
*** 静态时序分析
*** 时序优化
** 功耗分析

@endwbs

{% endplantuml %}

## 状态图


