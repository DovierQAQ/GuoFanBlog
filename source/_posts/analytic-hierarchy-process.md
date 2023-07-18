---
title: 运筹学 - AHP层次分析法
date: 2023-07-18 19:37:06
updated: 2023-07-18 19:37:06
cover: scoretable.png
tags:
    - 运筹学
    - AHP
categories:
    - 算法研究
---

> 层次分析法（The analytic hierarchy process）简称AHP，在20世纪70年代中期由美国运筹学家托马斯·塞蒂（T.L.saaty）正式提出。它是一种定性和定量相结合的、系统化、层次化的分析方法。由于它在处理复杂的决策问题上的实用性和有效性，很快在世界范围得到重视。它的应用已遍及经济计划和管理、能源政策和分配、行为科学、军事指挥、运输、农业、教育、人才、医疗和环境等领域。——层次分析法 - MBA智库百科

对于一个复杂的系统来说，直接对比每一套方案的优劣是一件很困难的事情。定性尚且困难，更不用说定量确定“方案一比方案二优秀百分之多少”这样的命题了。
这种场景下层次分析法就能很好派上用场了，它的原理是将对于方案的评价分层分解为不同的指标，再利用经验或者求助专家对各个指标进行评分，最终通过计算可以得出不同方案的权重，利用该权重就能对方案有定量的比较了。

于是问题就变成了以下几点：
- “分层分解为不同的指标”是怎么回事？
- “对各个指标进行评分”，一旦指标数量过多，指标与指标之间如何定夺其重要性？是否会导致结果过于主观？
- “通过计算得到权重”，如何操作？是什么原理？

阅读完毕这篇文章，相信这些问题就能迎刃而解了。

## 建立层次结构模型

考虑选用供应商的场景，不同供应商有不同的优势，如果只关注供应商的供货价格而不考虑供应商的供货稳定性，可能导致实际生产过程中出现供货风险，从而不能及时交付产品。

一种可能的层次结构模型如下：

{% plantuml %}
@startuml
left to right direction

skinparam rectangle<<behavior>> {
	roundCorner 25
}
sprite $bProcess jar:archimate/business-process
sprite $aService jar:archimate/application-service
sprite $aComponent jar:archimate/application-component

rectangle "供应商选择" as choose <<$bProcess>><<behavior>>

rectangle "成本 s1" as s1 <<$aService>><<behavior>>
rectangle "能力 s2" as s2 <<$aService>><<behavior>>
rectangle "服务 s3" as s3 <<$aService>><<behavior>>
rectangle "仓储 s4" as s4 <<$aService>><<behavior>>
rectangle "采购 s5" as s5 <<$aService>><<behavior>>

rectangle "产品价格 s11" as s11 <<$aComponent>><<behavior>>
rectangle "运输费用 s12" as s12 <<$aComponent>><<behavior>>

rectangle "项目管理能力 s21" as s21 <<$aComponent>><<behavior>>
rectangle "在大众中的口碑 s22" as s22 <<$aComponent>><<behavior>>
rectangle "在甲方中的口碑 s23" as s23 <<$aComponent>><<behavior>>
rectangle "工作人员的水平和能力 s24" as s24 <<$aComponent>><<behavior>>

rectangle "售后处理速度 s31" as s31 <<$aComponent>><<behavior>>
rectangle "售后处理方案 s32" as s32 <<$aComponent>><<behavior>>

rectangle "现货数量 s41" as s41 <<$aComponent>><<behavior>>
rectangle "交付及时性 s42" as s42 <<$aComponent>><<behavior>>
rectangle "供货稳定性 s43" as s43 <<$aComponent>><<behavior>>

rectangle "对接多少采购方 s51" as s51 <<$aComponent>><<behavior>>
rectangle "在采购方中的优先级 s52" as s52 <<$aComponent>><<behavior>>
rectangle "其他采购方采购数量 s53" as s53 <<$aComponent>><<behavior>>

choose -- s1
choose -- s2
choose -- s3
choose -- s4
choose -- s5

s1 -- s11
s1 -- s12

s2 -- s21
s2 -- s22
s2 -- s23
s2 -- s24

s3 -- s31
s3 -- s32

s4 -- s41
s4 -- s42
s4 -- s43

s5 -- s51
s5 -- s52
s5 -- s53

@enduml
{% endplantuml %}

由此可见一般的层次结构模型应当包含三层：
- 最高层（解决问题的目的）
- 中间层（策略层、约束层、准则层）
- 最低层（用于解决问题的各种措施、方案等）

最高层是我们的目标，即“供应商选择”。对于每个供应商，我们考察其五个方面：
1. 成本：即我作为采购方需要付给供应商的金额
2. 能力：即乙方作为供应商的整体实力
3. 服务：即供应商的服务水平
4. 仓储：指示供应商供货能力
5. 采购：考虑到可能有多个采购方同时对接一个供应商，需考虑其他采购方对我们造成的供货风险

## 构造对比较矩阵

由上一节举的例子可以感受出，对于供应商的选择，我们最底层需要考虑14个不同因素。为了计算出它们对上一层的贡献，我们需要对每一个参数进行“评分”。
可问题是我们应该如何确定评分标准？这么多因素一起考虑，需要对每一个因素打出分数的“绝对值”，这无疑是非常困难的。

AHP中，我们使用比较矩阵，每次只考虑两个因素，两两比较时我们只需要考虑其相对重要性就好了，大大降低了评分的难度。
例如，对于“能力 s2”指标的四个因素，我们构造如下的比较矩阵：

|s2|项目管理能力 t21|在大众中的口碑 t22|在甲方中的口碑 t23|工作人员的水平和能力 t24|
|:-:|:-:|:-:|:-:|:-:|
|项目管理能力 t21|1||||
|在大众中的口碑 t22||1|||
|在甲方中的口碑 t23|||1||
|工作人员的水平和能力 t24||||1|

由其中对角线已经填好的“1”我们可以窥见这个表格应该怎么填：左上角的“1”表示“项目管理能力 t21 和 项目管理能力 t21 具有同样的重要性”，这是显而易见的，因为两个相同的因素，没有优劣之分。对于其他格子，我们可以按照下表所写的标准进行填写：

|标度|含义|
|:-:|:-:|
|1|表示两个元素相比，具有同样的重要性|
|3|表示两个元素相比，前者比后者稍重要|
|5|表示两个元素相比，前者比后者明显重要|
|7|表示两个元素相比，前者比后者极其重要|
|9|表示两个元素相比，前者比后者强烈重要|
|2,4,6,8|表示上述相邻判断的中间值|
|1~9的倒数|表示相应量因素交换次序比较的重要性|

对于其他位于中间层的指标，我们也需要建立其比较矩阵。同时，对于最高层，我们也需要建立其相对于中间层指标的比较矩阵：

|r|成本 s1|能力 s2|服务 s3|仓储 s4|采购 s5|
|:-:|:-:|:-:|:-:|:-:|:-:|
|成本 s1|1|||||
|能力 s2||1||||
|服务 s3|||1|||
|仓储 s4||||1||
|采购 s5|||||1|

## 作一致性检验

我们最终的目的，是利用比较矩阵中的数值，计算出各个因素对于上一级因素的影响权重，最终利用这些权重，

## 层次总排序及决策
