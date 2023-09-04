---
title: EDA流程学习 - DRC中各种设计规则
date: 2023-08-29 11:24:24
updated: 2023-08-29 11:24:24
cover: Layout9.png
hide: 
tags:
    - EDA
    - DRC
    - 设计规则检查
categories:
    - 学习笔记
---

> 以下参考：[VLSI Voncepts](https://www.vlsi-expert.com/2014/12/design-rule-check.html)

## 一些DRC中用到的几何术语

![](Layout8.webp)

## 一张图总览

如下图：

![](Layout9.png)

| 符号 | 层        | 说明                                            | 规则    |
| ---- | --------- | ----------------------------------------------- | ------- |
| A    | Diffusion | Min Width                                       | >=W.D   |
| B    | Diffusion | Min Space                                       | >=S.D   |
| E    | N-Well    | Min Width                                       | >=W.NW  |
| G    | N-Well    | Min Space to N+ Diffusion/Active                | >=S1.NW |
| H    | N-Well    | Min Enclosure of P+ Diffusion/Active            | <=E.NW  |
| J    | N-Well    | Min Enclosure of N select                       | >=E1.NW |
| K    | Poly      | Min Width                                       | >=W.PC  |
| M    | Poly      | Min Poly Extnsion On Diffusion                  | >=E.PC  |
| N    | Poly      | Min Diffusion Extension On Poly                 | <=E1.PC |
| P    | Contact   | Width (Minimum = Maximum)                       | =W.C    |
| R    | Contact   | Min Space (When Contacts are on different Nets) | >=S1.C  |
| S    | Contact   | (Contact over Diff) minimum Space to Poly       | >=S2.C  |
| U    | Contact   | Enclosure by Diff                               | >=E.C   |
| W    | Metal1    | Min Width                                       | >=W.M   |
| Y    | Metal1    | Enclosure of Contact                            | >=E.M   |

每层的一些要求：
- Diffusion: DIFF must be fully covered by N/P select
- Poly: Poly over Diff must Divide Diff into at least 2 Diff regions

-------------------------------------------

以下参考：
> A. B. Kahng, L. Wang and B. Xu, "TritonRoute-WXL: The Open-Source Router With Integrated DRC Engine," in IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems, vol. 41, no. 4, pp. 1076-1089, April 2022, doi: 10.1109/TCAD.2021.3079268.

```LEF
// metal layer
WIDTH defaultWidth ;
[MINWIDTH minWidth ;]
SPACINGTABLE
 PARALLELRUNLENGTH {length} ...
  {WIDTH width {spacing} ...}... ;
[SPACING minSpacing SAMENET [PGONLY] ;]
[MINSTEP minStepLength [MAXEDGES maxEdges] ;]
[SPACING eolSpacing ENDOFLINE eolWidth WITHIN eolWithin
 [PARALLELEDGE parSpace WITHIN parWithin [TWOEDGES] ;]] ...
[CORNERSPACING
  {CONVEXCORNER | CONCAVECORNER} [EXEPTEOL eolWidth]
  {WIDTH width SPACING spacing ;} ... ] ... ;
// cut layer
{SPACING cutSpacing [CENTERTOCENTER]
 [  ADJACENTCUTS numCuts WITHIN cutWithin [EXCEPTSAMEPGNET]
  | PARALLELOVERLAP
  | AREA cutArea] ;}...
[SPACING cutSpacingSN [CENTERTOCENTER] SAMENET ;]
```

## Minimum width

利用一些线条来分割图形（水平、垂直方向上都需要），让图形只存在矩形，那么每个矩形在分割线方向上的尺寸必须满足 minimum width 的约束。

例如（注意左右是同一个图形）：
![](minimum_width.webp)

## Metal short

如果两个最大矩形重叠，金属短接规则指定了两个不同网之间的最大矩形之间的短接违规。

最大矩形是指能够完全包围住连线或元件的最大面积矩形，它的边界与连线或元件的边界相切或重合。

## Non-sufficient-metal overlap

同一网的两个最大矩形发生重叠，那么交叉部分的对角线长度必须大于或等于最小宽度。

![](non-sufficient-metal_overlap.webp)

## Parallel run length (PRL) spacing

如果两个最大矩形满足如下条件：
- 宽度大于 width
- 平行运行长度（PRL）大于 length

那么两个最大矩形之间的间距必须大于或等于 spacing。

![](PRL_spacing.webp)

另外，通过制定 SAMENET spacing 或 PGONLY，可以指明 PRL spacing 生效的场景。

## Minimum step

最小步长规则制定了多边形边的最短长度。
多边形边的长度必须大于或等于 minStepLength。
如果指定了 MAXEDGES，则允许最多 maxEdges 个连续的边长度小于 minStepLength。
maxEdges 值为 0 等同于不指定 MAXEDGES。

## End-of-line (EOL) spacing

指定了 EOL 边到多边形外部的间距。
其中：
- eolWidth：用来规定什么样的边能称作 EOL 边。
- eolWithin：用来规定检测范围需要扩展多少距离。
- eolSpacing：用来规定 EOL 边与外部边需要满足的间距规则。
- parSpace：用来规定满足 RPL 边规则时 EOL 边与外部边需要满足的间距规则。
- parWithin：用来规定平行运行长度多少才需要检测 parSpace。

![](EOL_spacing.webp)

## Corner spacing

指定了从一个角到多边形外部的距离。

有一些配置：
- CONVEXCORNER：表示该规则仅适用于凸角。
- CONCAVECORNER：表示该规则仅适用于凹角。
- EXCEPTEOL：指定如果该角连接到一个短于 eolWidth 的 EOL 边缘，该规则不生效。

对于间距查找，Corner spacing 的工作方式与 PRL spacing 类似，除了：
- 该规则仅适用于非正 PRL 值。
- 宽度仅考虑多边形的外部。

## Cut short

如果两个 cut 重叠，则发生短路。

## Cut spacing

指定两个 cut 的最小宽度。

有一些配置：
- CENTERTOCENTER：从 cut 中心开始计算 spacing
- ADJACENTCUTS：只有当存在小于 cutWithin 距离的 numCut 个切割时，规则才适用。
- EXCEPTSAMEPGNET：只有两个 cut 不再同一电源或地线上时，规则才适用。
- PARALLELOVERLAP：只有两个 cut 的 PRL 大于 0 时，规则才适用。
- AREA：只有两个 cut 中的任何一个大于或等于 cutArea 时，规则才适用。
- SAMENET：两个 cut 之间的间距必须大于或等于 cutSpacing 和 cutSpacingSN 的最小值。

-------------------------------------------

> 以下参考：[Dr. CU 2.0: A Scalable Detailed Routing Framework with Correct-by-Construction Design Rule Satisfaction∗](https://chengengjie.github.io/papers/C12-ICCAD19-DrCU2-slides.pdf)

## Parallel Run Length Spacing

![](PRL_spacing2.webp)

## End-of-line Spacing

![](EOL_spacing2.webp)

