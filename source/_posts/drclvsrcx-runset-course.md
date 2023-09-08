---
title: EDA流程学习 - DRC/LVS/RCX Runset开发培训课程（DRC部分）
date: 2023-09-05 11:40:23
updated: 2023-09-05 11:40:23
cover: cover.jpeg
tags:
    - EDA
    - DRC
categories:
    - 学习笔记
---

可以结合这篇文章看：{% post_link design-rules-for-drc %}

--------------------------------------

有一个工具：scout，用来检查 DRC Code 是否书写正确。

## 最小宽度及最大宽度检查

根据单层与双层命令，可分为 5 类检查：
- 单层 INT：查单层图形的宽度
- 单层 EXT：查单层图形的间距
- 双层 INT：查一层图形伸入另一层图形的距离
- 双层 EXT：查两层图形的间距
- 双层 ENC：查一层图形被另一层图形包围的间距

A cut B：表示 A 有一部分和 B 重合，但不全部与 B 重合。
这个表示并不对称，下图中打勾的部分符合`B cut A`：
![](bcuta.webp)

Enclosed Area：空心的洞或者环的面积。

Parallel Run Length：两个图形相互投影，得到的重合长度。{% inlineImg PRL.webp 100px %}

两个例子：
- `ENCLOSURE TO GT <0.18 ABUT >0<90`，写了`>0`那么刚好是`0`的时候不会报错。
- `EXTERNAL TB DN <3.5 MEASURE ALL`，如果不写`MEASURE ALL`会导致被包含在`TB`中的`DN`不被检查。

规则有一些隐含含义：
| 规则描述                 | 值    | 隐含含义                                                                                                                                          | 对应规则中的写法                                                  |
| ------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Min width of a SN region | 0.310 | 1. 如果图形中有锐角图形要报错 <br> 2. 如果图形中有点对点的奇异图形要报错 <br> 3. 在 SRAM 的区域 SN 的宽度可以比 0.31 微米小，因此要忽略 SRAM 区域 | 1. 加`ABUT<90` <br> 2. 加`SINGULAR` <br> 3. 加`X not inside EXCL` |

## 最大间距检测及measure_all选项

Layer 定义的解释：
- TO：Active 区域
- TB：Nwell 区域
- Pwell 区域：Pwell = Bulk not TB
- SP：P 型 Implant 区域
- P+ Active：SP 与 TO 重叠的区域 pdiff = SP and TO
- P 型 SD：P+ Active 位于 Nwell 区域内的图形，psd = pdiff and TB
- P 型 TAP：P+ Active 位于 Pwell 区域内的图形，ptap = pdiff not psd
- pdiff = psd + ptap

| 规则描述                                                            | 值    | 隐含含义                                                                                                                                         |
| ------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Min clearance from a SN region to a P+ active TO region (inside TB) | 0.180 | 1. 如果图形中有锐角图形要报错 <br> 2. 如果图形中有点对点的奇异图形要报错 <br> 3. 如果距离=0，不报错 <br> 4. 在 SRAM 的区域距离可以比 0.18 微米小 |

常识：SN 与 SP 可以相互 touch 在一起。

```
rule {
    x = SIZE contact by 9 STEP 0.02 INSIDE of poly
    y = AND poly x
    ENCLOSE poly y > 1
}
```

上述代码的含义是：
- 将 contact 放大 9um。
- 把扩大后的 contact 变成一层。
- 如果 poly 包围的 contact 大于 1，则报错。

等价理解就是 contact 的密度要足够大，大到每 18um 至少有一个，才能在这种放大后练成一片。
使用`INSIDE of poly`是为了不让一个检验影响到另一个 poly。
使用`STEP 0.02`是因为该值要小于 poly 的间距 0.05 的一半。

一般情况下，所有的间距检查选项都不需要 Measure all 的选项，但是 DN 和 TB 在工艺上比较特殊，所以要写。

## Enclosure和EndOfLine及Extension检查

一般情况下，Enclosure 命令不需要加 Outside Also 的选项，但是针对 Metal 与 Via 的 Enclosure 需要添加。

金属线末端的 Via 会被要求其 Enclosure 更大一些。
检测方法是找到所有 Via 离 Metal 最近的边，这些边中如果有某个 Via 选出的边存在交点，则说明这个 Via 在 Metal 的 EndOfLine。

三种距离：
- 欧几里得距离
- 矩形距离
- 对边距离

<img src="distance.webp" height="300px" />

`ABUT >0<90`的含义：不能 touch，不能斜着伸出。
- touch: {% inlineImg abut_greater_than_0.webp 100px %}
- 斜着：{% inlineImg abut_less_than_90.webp 100px %}

## RectEnc及宽金属间距检查

Hierarchical 处理可以让同样的 cell 只被检查一遍。有两种方法：
- 提升法：只把有可能产生违例的图形提升到顶层，再进行检测。（例如距离某个层多少以内的图形）
  - 优点：实现简单，容易理解
  - 缺点：可能出现很多重复运算
- 投影法：把顶层单元的图形往下压。
  - 优点：最大程度减少复杂运算，效率高
  - 缺点：实现复杂，需要用到特殊结构来记录上下层关系（ILT, Inverse Layout Tree）

## RunlengthSpacing和ConenctedSpacing检查

Line End 的判断：相邻角等于 90°，且两个角的对边长大于一定值，且两个角的另一条边小于一定值。

## Density和Antenna检查

检测密度，使用窗口，以一定步长检测局部密度。

检测天线效应时，Poly 和 Contact 都是使用顶面积，金属是使用侧面积。
需要检测的内容是检查与 Gate 相连的某个 Layer 的面积与 Gate 的面积比值是否超过某个最大值。
有两种模式：
- Cumulative：需要将有连接关系的层面积累加再计算。
- Single Layer：只管检查指定的层。

## 复杂器件和先进工艺检查

Scout

## DRCRunset图形化调试和分析

Xcal

## DRC如何检查条件参数


