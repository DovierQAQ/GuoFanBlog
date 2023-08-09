---
title: 《数字集成电路物理设计》学习笔记
date: 2023-08-07 14:52:48
updated: 2023-08-07 14:52:48
cover: cover.jpg
katex: true
tags:
    - EDA
    - 物理设计
    - 集成电路
    - 数字电路
categories:
    - 学习笔记
---

缩写：
- 电子设计自动化：EDA, electronic design automation
- 技术节点：technology node
- 极紫外：EUV, extreme UV, 波长 13nm
- 逻辑综合：logic synthesis
- 分配：partition
- 模块化：module
- 自底向上的堆砌法：buttom-up
- 自上向下：top-down
- 指令窗：CIW, command in window
- 点工具：point tools
- 图形界面：GUI, griphic user interface
- 设计流程：flows
- 设计平台：platforms
- 片上系统芯片：SoC, system-on-chip
- 设计公司：fabless
- 晶圆代工厂：foundry
- 设计生产链：design chain
- 深亚微米：DSM, deep sub-micron
- 时序驱动设计：TDD, timing-driven design
- 天线效应：PAE, process antenna effect
- 信号完整性：SI, signal integrity
- 光学近似检查：OPC, optical proximity correction
- 移项掩膜：PSM phase shifting masks
- 设计产额：DFY
- 可制造性设计：DFM
- 统计静态时序分析：SSTA
- 多模式“多端角”分析：MMMC
- 光刻分辨率增强技术：RET, resolution enhancement technology
- 时序驱动布线：timing-driven
- 布图：floorplan
- 电源网格：power grid
- 零偏差：zero skew
- 静态时序分析：STA, static timing analysis
- “签核”：sign-off
- 最差：WC, worst-case
- 建立时间：setup time
- 保持时间：hold time
- 原地优化：IPO, in-place optimization
- 设计规则违反检查：DRV, design rule violation
- 电压降：IR drop
- 噪声分析：IR
- 最佳：BC, best-case
- 线负载模型：WLM, wire load model
- 定制线负载模型：CWLM, custom WLM
- 迭代：iteration
- 物理综合：physical systhesis
- 再处理：restructuring
- 逻辑等价验证：logic equivalence checking
- 多电源电压：MSMV, multiple-supply mutiple-voltage
- 有用偏差：useful skew
- 化学机械打磨：CMP, chemical mechanical polishing
- 数百万门：MG, million gates
- 硅虚拟原型：SVP, silicon virtual prototype
- 层次化的物理设计方法：hierarchical partition
- 电压区域：power domain
- 掩膜：mask
- 全局物理综合：GPS, global physical synthesis
- 物理布图参数：PLE, physical layout estimator
- 片上误差：OCV, on-chip variation
- 电源关断：PSO, power shut off
- 电源门控：SRPG, state retention power gating
- 多模式“多端角”：MMMC, multi-mode multi-corner
- 多芯片封装：SiP, silicon in package
- 标准时序约束：SDC, standard design constraints
- 动态电压频率调节：DVFS, dynamic voltage frequency scaling
- 统计静态时序分析方法：SSTA, statitical STAs
- 物理库：LEF
- 网表：门级 netlist 和 DEF
- 时序库：.lib
- 接口逻辑模型：ILM, interface logic model
- 基于设计驱动时序图：CDTV, context-driven timing view
- “项目评审技术”：PERT, program evaluation and review technique
- “关键路径方法”：CPM, cirtical path method
- 转换时间：transition time
- 组合逻辑电路：combinational logic circuit
- 时序逻辑电路：sequential logic circuit
- 电迁移：EM, electromigration
- VCD文件：value change format
- 时钟反转计数格式文件：TCF, toggle count format
- 通用功耗格式文件：CPF, common power format
- 可制造性设计：DFM, design for manufacturing, design for manufacturibility
- 光刻预知：lithography aware
- 反置光刻工艺：ILT, inverse lithography technology
- LEF：library exchange format
- DEF：design exchange format
- SDF：standard delay format
- 工艺设计包：PDK, process design kit
- 器件模型：device model
- 参数化单元：Pcell, parameterized cell
- 影射：mapping
- GDSII：Graphic Design SystemII
- 电路规则检查：LVS, layout versus shematic
- 电学规则检查：ERC, electrical rule check
- 寄生参数提取：LPE, layout parasitic extraction
- 寄生电阻提取：PRE, parasitic resistance extraction
- 上拉网络：PUN, pull-up network
- 下拉网络：PDN, pull-down network
- 反向器：INV, inverter
- 与非门：NAND gate
- 或非门：NOR gate
- 缓冲器：BUF, buffer
- 与门：AND gate
- 或门：OR gate
- 数据选择门：MUX, multiplexer
- 异或门：XOR, exclusive or gate
- 数据传输门：TBUF, transmission buffer gate
- 复合门：AOI、AND-OR-INV gate 和 OR-AND-INV gate
- 输入输出单元：I/O Pad cell
- 静电放电：ESD, electrostatic discharge
- 人体模型：HBM, human body model
- 机器模型：MM, machine model
- 带电器件模型：CDM, charged device model
- 电场感应模型：FIM, field induced model
- 填充单元：filler cell
- 电源线和地线轨道：power rails
- 钳高单元：tie-high
- 钳低单元：tie-low
- 形式验证：formal verification
- 去耦单元：decap cell
- 时钟缓冲单元：clock buffer
- 时钟反向器单元：clock inverter
- 延时缓冲单元：delay buffer
- 阱连接单元：well-tap cell
- 电压转换单元：level shifter
- 隔离单元：isolation
- 开关单元：switch cell
- 电路仿真程序：SPICE, simulation program with integrated circuit emphasis
- 有效电流源模型：ECSM, effective current source model
- 复合电流源模型：CCSM, composite current source model
- 部分天线比率：PAR, partially antenna ratio
- 积累天线比率：CAR, cumulative antenna ratio
- 离轴照明：OAI, off-axis illumination
- 光学临近校正：OPC, optical proximity correction
- 移相掩膜：PSM, phase shifted mask
- 次分辨率辅助图形：sub-resolution assistance feature
- 布局布线：P&R, place-and-route
- 零线负载模型：zero WLM, wire-load model

## 第一章 - 集成电路物理设计方法

## 第二章 - 物理设计建库与验证

寄生电阻的存在使得可能让两个晶体管相互耦合组成一个正反馈放大电路，某些情况下正反馈产生，形成大电流，有很强破坏性，称为闩锁效应。防止有以下方法：
- 增加 well tap 或保护环，在 NMOS 管周围形成接地的 p+ 区，PMOS 管周围形成接电源的 n+ 区。
- 采用 SOI 材料代替硅材料。

### 设计规则检查

DRC 通过通过图形运算生成的图形一般称为衍生层。图形运算包括逻辑运算、拓扑运算、分割运算、几何运算等。逻辑运算包括与、或、非、同或、异或等。拓扑运算包括重叠（overlap）、包含（enclose）、相切（butting）等。集合运算包括求解面积，周长，间距等。

DRC 中，A NOT B 类似于 A-B。

### 电路规则检查

LVS 检查的内容可以概括为两点：
- 所有信号的电气连接关系是否一致
- 器件类型尺寸是否一致

### 逻辑单元库的建立

目前普遍使用的物理库是由 Cadence 公司开发的 LEF（library exchange format）文件格式，它已成为业界标准。LEF 采用 ASCII 格式描述，易于阅读和维护。文件可以很大，为便于管理和应用一般将它分为技术 LEF 文件（technology LEF）和单元 LEF 文件（cell LEF）两部分。
- 技术 LEF 主要定义的是布局布线的设计规则和晶圆厂的工艺信息，包括互连线的最小间距、最小宽度、厚度、典型电阻、电容、电流密度大小，布线轨道宽度，通孔种类等。
- 单元 LEF 文件主要用于定义标准单元、模块单元、I/O 单元和各种特殊单元的物理信息。在单元 LEF 文件中，它定义单元的放置区域，对称性、面积大小供布局时使用，它还定义单元输入输出端口的布线层、几何形状、不可布线区域以及工艺天线效应参数供布线用。

用于 DSM 设计的器件延时模型包括：
- 由线性电阻和阶跃函数电压源组成的开关线性 RC 模型；
- 以输入斜率和输出负载为变量的经验推导公式（K-Factor 方程）；
- 非线性延时模型（NLDM, non-linear delay model）；
- 可伸缩多项式模型（SPDM, scalable polynomial delay model）。

开关线性 RC 模型，将晶体管等效为一个开关，断开时它具有无穷大电阻，关闭时等效为一个常数的线性电阻$R_{eq}$。

liberty 是目前业界广泛使用的时序库文件格式，最早由 Synopsys 公司开发定义，通常以 lib 作为扩展名。

TLF（Timing Library Format）是 Cadence 公司开发的时序库文件，由 ASCII 格式表示。

ALF（Advanced Library Format）先进库格式是一种提供了库元件、技术规则和互连模型的建模语言。

PTV（process, 工艺；temperature, 温度；voltage, 电压）。

工艺天线效应（PAE, process antenna effect）是指刻蚀过程中，金属层会不断累积电荷，当静电电荷超过一定数量，形成的电势超过它所连接门栅所能承受的击穿电压时，晶体管就会被击穿，导致器件损坏的现象。
EDA 工具通常采用两种模型计算天线比率：
- 部分检查模型（partially checking model）
- 积累检查模型（cumulative checking model）

目前布线工具解决天线效应是采用插入天线二极管和中断金属连线跳换布线层（layer hopping）两种方法实现。

## 第三章 - 布图规划和布局

### 布图规划

内容：
- 对芯片大小（die size）的规划
- 芯片设计输入输出（I/O）单元的规划
- 大量硬核或模块（hard core, block）的规划

目标：
- 确定芯片面积
- 确保时序的收敛
- 保证芯片的稳定
- 满足布线的要求

在布图规划和布局工具中，对采用倒置封装对面积 I/O（area I/O）的摆放通过以下步骤完成：
- 在 LEF 技术文件中，需要用 CLASS PAD 和 PAD SITE 将 I/O 单元定义为特定的类型。
- 将 flip-chip 的 I/O 单元库导入设计。
- 加载版图规划文件和 I/O 单元设置文件。
- 放置 flip-chip 的 I/O 单元。

### 电源规划

供电网络设计主要内容有以下几个部分：
- 电源连接关系的定义，又称为 global net connect。
- 芯片核内（core）部分的电源环设计，又称为 power ring。
- 芯片内所包含的硬核（如 RAM、ROM 以及 IP、COT 模块等）的电源环设计。
- 芯片核内纵横交错的电源网格的设计，又称为 power stripe。
- 芯片的供电单元与电源环的连接，又称为 I/O 单元 power。
- 芯片内部电源网格和硬核电源环连接部分的设计，又称为 ring pins。
- 将标准单元的供电网格与核电源网格总连接的设计，又称为 followpins。
- I/O 供电单元电源环的设计，又称为 I/O 单元 power ring。

数字与模拟混合供电芯片中，在布局前一般需作如下几点考虑和处理：
- 模拟模块的工作区域一般放置于芯片的某个角落。
- 模拟区域需要单独供电，给模拟信号供电的 I/O 单元应放在模拟模块边上，尽量缩短供电线路的长度。
- 在模拟模块的周围布置保护隔离环（guarding ring），从而实现数字信号和模拟信号电源之间的隔离。

多电源供电中，为每一个电压域指定一个合适的模板来进行设计步骤：
- 创建芯片核心电源环。
- 为每一个电压域和硬宏单元模块创建一个模块的电源环。
- 为宏单元（硬核）模块创建模块电源环。

多个电源供电时，不同的工作电压之间需要插入电平转换单元（VLS, voltage level shifter），其步骤如下：
- 读入相应的电平转换单元表。
- 在内部电压域网络上插入电平转换单元。

### 布局

在布局完成后需要评估的目标主要有：拥（congestion）程度的评估、延迟和时序预估、供电预估。

从步骤上布局可以分成三个阶段：
- 结群布局（clustering）
- 全局布局（global placement）
- 详细布局（detail placement）

结群需要用的算法：
- Breuer's algorithm
- 模拟退火（simulated annealing）
- K-L 算法（Kernigham-Lin algorithm）
- F-M 算法（Fiduccia-Mattheyses algorithm）
- 比率分割算法（Ratio-Cut algorithm）

全局布局（包括布图规划过程）中主要采用的算法有：
- 最小切割法算法（他是 Breuer 的算法的直接应用）
- 模拟退火算法（它是 Kirkpatrick 的算法的直接应用）
- 贪婪算法（greedy algorithm）
- 力向量算法（force directed algorithm）
- NRG 算法
- HALO 算法

从以布局的对象为目标出发，布局优化算法可分为以下三种：
- 纯标准单元布局算法（standard-cell placement）
- 模块布局算法（macro-cell placement）
- 混合单元布局算法（mixed-size placement）

从优化的目标上优化算法可分为以下三类：
- 基于布线拥塞的布局优化算法（routability-driven placement）
- 基于时序的布局算法（timing-driven placement）
- 预防噪声的布局算法（crossstalk-aware placement）

### 扫描链重组

有两种方法实现：本地化重组（native reordering）和基于扫描 DEF 的重组。

能采用本地化重组方法的扫描链特征如下：
- 扫描链上连接的触发器属于单一时钟域，且由单一边沿触发。
- 扫描链上的触发器跨越多个时钟域，不同的时钟域由数据锁存器件分开。
- 共享功能输出信号链。
- 带有两端口逻辑单元的扫描链，该扫描链中串联了两端口的逻辑单元，一般为缓冲器。

### 物理设计网表文件

## 第四章 - 时钟树综合

在标准设计约束 SDC 文件中对时钟本身对定义共分为三部分内容：
- 时钟的定义
- 时钟延滞（latency）的定义
- 时钟不确定性（uncertainty）的定义

在时钟树的应用中，将最晚到达节点的时间定义为“最大插入延迟”（max insertion delay），将最早到达节点的时间定义为“最小插入延迟”（min insertion delay），两者之差定义为“最大偏差”（max skew）。

时钟树综合时，需要权衡功耗和时钟偏差的要求，从而选择一个合适的延迟。有时候对于一些特定的设计，两个时钟域之间还需要有一定的相位差，并通过这个参数来调节偏差。

芯片设计中的时钟分类两类：真实时钟（real clock）和虚拟时钟（virtual clock）。真实时钟又有两种模式，时钟树综合前没有延时的理想时钟（ideal clock）和时钟树综合后的传播时钟（propagated clock）。

时钟树根据其在芯片内的分布特征，可分为多种结构，主要有 H 树（H-tree）、X 树（X-tree）、平衡树（balanced tree），以及梳状或脊椎状时钟网（clock tree mesh: comb or spine）。

![](clock_tree.jpg)

降低时钟树上的功耗，需要将时钟树的长度与驱动的加权数降为最小。实现的方案可以有以下几种：
- 减小时钟信号转换时间
- 降低节点电容

降低时钟树上噪声的方法：
- 局部电源地保护
- 增加驱动
- 高层金属多倍间隔走线

## 第五章 - 布线

布线的内容是将分布在芯片核内的模块、标准单元核输入输出接口单元（I/O pad）按逻辑关系进行互连，其要求是百分之百完成它们之间的所有逻辑信号的互连，并满足各种约束条件进行优化。进行消除布线拥塞（congestion）、优化时序（timing）、减小耦合效应（coupling）、消除串扰（crosstalk）、降低功耗、保证信号完整性（signal integrity）、预防 DFM 问题和提高良品率登布线的优化工作则是衡量布线质量的重要指标。

在实施过程中，它被分为全局布线（global routing）和详细布线（detail routing）以及布线修正（search and repair）三个步骤来完成。

全局布线的主要目标有：
- 使总连接线最短
- 布线分散均匀不致引起局部拥塞
- 使关键路径延时最小，遵守时序规则
- 理解信号完整性的要求，避免串扰（cross talks）
- 保持将 BUS 总线聚集相连等

对详细布线的要求有：
- 必须理解所有设计规则
- 自动切换并综合利用多层金属作连线
- 遵守时序规则，优先使关键路径的延时满足要求
- 对总连线长度进行优化

用布线器对串扰问题进行预防和修复的方法包括：
- 增加走线间隔
- 将关键信号线屏蔽
- 缩短平行走线的长度
- 转换到另一层连线
- 加入缓冲器等

从布线等算法来分，有通道布线方法和面积布线方法，前者广泛地用在 FPGA 中，后者则用于 ASIC 的设计中。
通道布线方法有迷宫法（maze，也叫做李氏算法，Lee's algorithm）和线性探索算法（line-probe，也叫做 Hightower 法）。

## 第六章 - 静态时序分析


