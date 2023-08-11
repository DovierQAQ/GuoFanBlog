---
title: 《集成电路静态时序分析与建模》学习笔记
date: 2023-08-10 16:25:45
updated: 2023-08-10 16:25:45
cover: cover.jpg
katex: true
tags:
    - EDA
    - STA
categories:
    - 学习笔记
---

## 第一章 - 引论

### 静态时序分析

静态时序分析（static timing analysis, STA）是分析、调试并确认一个门级系统设计时序性能的比较彻底的方法。静态时序分析既要检验门级电路的最大延迟、以保证电路在指定的频率下能够满足建立时间的要求，同时又要检验门级电路的最小延迟、以满足保持时间的要求。

静态时序分析的优点：
- 静态时序分析执行速度快
- 静态时序分析不需要测试向量
- 静态时序分析对于有时序路径的时序，测试覆盖率可以近乎达到 100%
- 静态时序分析能够完成动态仿真所不能实现的复杂分析

静态时序分析的缺点：
- 静态时序分析不能验证设计的功能
- 静态时序分析只能验证同步时序电路的时序特性
- 静态时序分析不能自动识别设计中的特殊路径

## 第二章 - 静态时序分析的基础知识

信号线延时的定义为：逻辑信号从逻辑门单元的输出端口考试在互连线上传播到下一级逻辑输入端口的延时。

### 建立时间和保持时间

{% plantuml %}

@startuml

concise "Input" as con
binary "CLK" as bin

@0
con is Idle
bin is low

@100
con is Input

@150
bin is high

@200
con is Idle

@300
bin is low

bin@100 <-> @150 : setup
bin@150 <-> @200 : hold

@enduml

{% endplantuml %}

### 恢复时间和移除时间

{% plantuml %}

@startuml

binary "set/reset" as signal
binary "CLK" as clk

@0
clk is low
signal is low

@100
signal is high

@150
clk is high

@300
clk is low

@350
signal is low

clk@100 <-> @150 : 恢复时间

clk@300 <-> @350 : 移除时间

@enduml

{% endplantuml %}

时序单元的时序分析必须满足输入信号脉宽大于最小脉冲宽度的要求，否则时序分析结果就可能与实际情况不一致，主要原因之一就是无法保证时序单元实现正常的逻辑功能。

### 时序路径

- 触发器到触发器：表示始发点为时序单元的时钟输入端和终止点为数据输入端之间的时序路径。由于其始发点和终止点在设计内部都是可见的，所以也称为内部时序路径。
- 触发器到输出端：表示从始发点为时序单元时钟输入端口到终止点为组合逻辑单元的输出端口之间的时序路径。由于组合逻辑单元的输出端口可能连接到设计之外的其他模块的输入端口，所以称为外部时序路径。
- 输入端到触发器：表示从始发点为组合逻辑单元的输入端口到终止点为时序单元数据输入端之间的时序路径。由于组合逻辑单元的输入端口来自设计之外的其他输出端口，所以也称为外部时序路径。
- 输入端到输出端：表示从始发点为组合逻辑单元输入端口到终止点为组合逻辑单元输出端口之间的时序路径。因为没有经过任何时序单元，所以该种类型的时序路径比较特殊，其时序分析方法也不同。

时钟的时序特性主要分为时钟周期（clock period）、时钟占空比（clock duty cycle）、时钟转换时间（clock transition time）、时钟延迟（clock latency）、时钟偏斜（clock skew）和时钟抖动（clock jitter）。

静态时序分析是基于时序弧（timing arc）数据的时序分析。时序弧是用来描述两个节点延时信息的数据，时序弧的信息一般分为连线延时和单元延时。连线延时是单元输出端口和扇出网络负载之间的延时信息；单元延时是单元输入端口到输出端口到延时信息。
单元延时中的时序弧分为基本时序弧和约束时序弧两类，其中约束时序弧用来表示输入端口之间存在的时序约束信息。
基本时序弧包括组合时序弧（combinational arc）、边沿时序弧（edge arc）、复位清零时序弧（preset and clear arc）、三态使能时序弧（three state enable and disable arc）等。
约束时序弧包括建立时序弧（setup arc）、保持时序弧（hold arc）、恢复时序弧（recovery arc）、移除时序弧（removal arc）和脉宽时序弧（width arc）等。

### PVT 环境

- TYP (Typical)
- BCF (Best-Case Fast)
- WCS (Worst-Case Slow)
- ML (maximal leakage)
- TL (typical leakage)

## 第三章 - 单元库时序模型

- 快速时序模型（quick time model）
- 接口逻辑模型（interface logic model）
- 抽取时序模型（extracted timing model）
- Stamp 模型
- Synopsys 工艺库模型：时序信息文件 (.lib)，主要分为以下三种：线性延时模型（linear delay model）、非线性延时模型（non-linear delay model）和复合电流源延时模型（composite current source delay model, CCS 延时模型）。

### 延时计算模型

- CMOS 通用延时计算模型：$D_{total} = D_I + D_S + D_C + D_T$
- CMOS 非线性延时计算模型：$D_{total} = D_{cell} + D_C$

### 互连线计算模型

- 集总 C 模型
- 集总 RC 模型
- 分布 RC 模型：L 模型、$\pi$ 模型、T 模型
- 传输线模型

在 RTL 代码综合阶段进行静态时序分析时，由于互连线还没有物理信息，因此可以通过调用线负载模型来估算实际物理实现后的线负载大小，用于静态时序分析时计算互连线延时。

### 时序信息建模基本方法

时序信息建模的简化操作：
- 时序弧串联合并
- 时序弧并联合并

时序信息建模基本方法：
- 基于独立的时序提取方法
- 基于独立与相关混合的时序信息提取方法
- 基于完全相关的时序信息提取方法

## 第四章 - 时序信息库文件


