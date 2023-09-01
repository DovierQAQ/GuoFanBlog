---
title: EDA流程学习 - DRC中各种设计规则
date: 2023-08-29 11:24:24
updated: 2023-08-29 11:24:24
cover:
hide: true
tags:
    - EDA
    - DRC
    - 设计规则检查
categories:
    - 学习笔记
---

参考：[VLSI Voncepts](https://www.vlsi-expert.com/2014/12/design-rule-check.html)

## 一些DRC中用到的几何术语

![](Layout8.webp)

## DRC的一些规则距离

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


