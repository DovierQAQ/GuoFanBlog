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

### 非线性延时模型

- 库组
    - 工艺属性（technology attribute）
    - 延时模型属性（delay_model attribute）
    - 延时和转换斜率属性（Delay and Slew Attributes）
- 因子
- 输入电压组
- 输出电压组
- 功耗查找表模板组
- 操作条件组
- 线负载组
- 延时查找表模板组
- 单元组
    - 面积属性（area attribute）
    - 单元标记属性（cell_footprint attribute）
    - 集成时钟门单元属性（clock_gating_integrated_cell attribute）
    - 不触碰属性（dont_touch attribute）
    - 不使用属性（dont_use attribute）
    - 时钟门单元属性（is_clock_gating_cell attribute）
- 引脚组
    - 电容属性
    - 带时钟门的时钟引脚属性（clock_gate_clock_pin attribute）
    - 时钟门使能引脚属性（clock_gate_enable_pin attribute）
    - 时钟门观察引脚属性（clock_gate_obs_pin attribute）
- 触发器组
    - 时钟有效属性（clocked_on attribute）
    - 下个状态属性（next_state attribute）
    - 清零属性（clear attribute）
    - 位置属性（preset attribute）
- 逻辑状态表组
- 电源引脚组
    - 电源地类型属性（pg_type attribute）
    - 电源名称属性（voltage_name attribute）
- 延时组
    - 相关引脚属性（related_pin attribute）
    - 延时逻辑状态属性（timing_sense attribute）
    - 延时类型属性（timing_type attribute）
- 单元上拉延时组
- 单元下拉延时组
- 上拉转换组
- 下拉转换组
- 上拉约束组
- 下拉约束组
- 内部功耗组
- 哑阈漏流功耗组
    - 模式属性（mode attribute）
    - 时刻属性（when attribute）
    - 值属性（value attribute）

### 复合电流源延时模型

- 输出电流查找表模板组
- 输出上拉电流组
- 输出下拉电流组
- 向量组
- 接收电容组
    - 模式属性（mode attribute）
    - 时刻属性（when attribute）

## 第五章 - 静态时序分析的基本方法

![](sta_method_timing_graph.jpg)

![](sta_method_timing_graph1.jpg)

- 基于路径的时序分析策略
- 基于模块的时序分析策略

### 时序路径延时计算方法

- 组合逻辑之间路径延时计算方法
- 时序逻辑之间路径延时计算方法

### 时序路径的分析方法

- 建立时间分析（setup timing check）
- 保持时间分析（hold timing check）

### 时序路径分析模式

最快路径（early path）指在信号传播延时计算中调用最快工艺参数的路径，根据信号的分类可以分为最快时钟路径和最快数据路径。
最慢路径（late path）指在信号传播延时计算中调用最慢工艺参数的路径，分为最慢时钟路径和最慢数据路径。

- 单一分析模式（single mode）
- 最好 - 最坏分析模式（BC-WC mode）
- 全芯片变化分析模式（OCV mode）

### 时序减免

时序减免（timing derate）的作用是根据减免（derating）系数，静态时序分析工具会在时序路径的每级逻辑门、连线和端口上都加上或减去一个原来延时值乘以减免系数值的延时作为最终的延时结果。设置时序减免值的目的是使时序分析结果更加符合实际情况。

### 时钟路径悲观移除

通过设置时钟路径悲观移除（clock path pessimism removal, CPPR）来移除时钟公共路径上信号延时计算带来的误差。

### 时序优化

- 基本方法
    - 改变单元位置
    - 改变单元大小
    - 插入缓冲单元
    - 删除缓冲单元
    - 重分配负载
    - 时钟有用偏斜
- 优化保持时间的基本方法
    - 插入延时单元（delay cell）

## 第六章 - 时序约束


