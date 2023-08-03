---
title: 开源EDA软件iEDA初探 - 基本架构及代码框架
date: 2023-08-03 11:17:11
updated: 2023-08-03 11:17:11
cover: iEDA-structure.jpg
tags:
    - EDA
    - C++
    - 开源项目
categories:
    - 学习笔记
---

上大学的时候，教集成电路的老师就跟我们讲：“中国的芯片制造，除了光刻机，另一个被卡脖子的技术就是 EDA 软件。”
这个课的课程设计，按照以往来说是老师布置一些题目，使用 EDA 软件绘制一个运算放大器，或者一个电源模块的版图之类的。
但老师手上正好有一个项目，是一个微能源的项目，使用 MEMS 工艺在晶圆上制作出微小悬臂，然后在悬壁上覆盖好压电陶瓷，这样当芯片受到微小震动时压电陶瓷上就会产生微弱的电荷。我们的任务就是在芯片上制作出一个电荷收集和存储的模块，将这个微弱的能量累积起来。当到达一定程度之后，让射频模块发射一次信号，就可以让一个传感器在自供电的情况下运行数年之久。
这便是我跟 EDA 软件最初的渊源，为现在的学习，以及接下来将要进入到的工作埋下了伏笔。

## 开源 EDA 软件

{% note warning flat %}
TODO 介绍
{% endnote %}

### 我总结出来的架构图

{% plantuml %}
@startuml

skinparam linetype ortho
left to right direction

package iEDA {
    package 用户交互 {
        component apps

        package interface {
            component config
            component gui
            component python
            component shell
            component tcl
        }
    }

    package 业务模块 {
        component analysis
        component evaluation

        package 辅助模块 {
            component third_party

            package utility {
                component json
                component log
                component report
                component stdBase
                component string
                component tcl
                component test
                component time
                component usage
            }
        }

        package operation {
            component iCTS
            component iDRC
            component iECO
            component iFP
            component iIR
            component iLO
            component iNO
            component iPDN
            component iPL
            component iPW
            component iRT
            component iSTA
            component iTM
            component iTO
        }

        package solver {
            component clustering
            component partition
            component qudratic_programming
            component steiner_forest
            component two_pin_routing
        }
    }

    package 数据访存 {
        package platform {
            component data_manager
            component evaluator
            component file_manager
            component flow
            component report
            component service
            component tool_manager
        }
    }

    package 数据源 {
        component database
        component scripts
    }
}

apps -[hidden]- interface
third_party -[hidden]- utility

analysis -[hidden]- evaluation

database -[hidden]- scripts

用户交互 -> 业务模块
业务模块 -> 数据访存
数据访存 -> 数据源

@enduml
{% endplantuml %}

### 我所理解的目录说明

{% plantuml %}
@startmindmap

*: iEDA 
<back:lightgreen>（梦开始的地方）</back>;
**: cmake 
<back:lightgreen>（项目中用到的一些 cmake 文件）</back>;
**: docs 
<back:lightgreen>（文档）</back>;
***: api 
<back:lightgreen>（有关各个点工具的 API 说明文档）</back>;
***: paper 
<back:lightgreen>（iEDA 项目的 paper）</back>;
***: ppt 
<back:lightgreen>（iEDA 介绍以及培训的 PPT）</back>;
***: resources 
<back:lightgreen>（iEDA 文档中用到的图片文件）</back>;
***: tbd 
<back:lightgreen>（一些未完成文档）</back>;
***: tcl 
<back:lightgreen>（tcl 编写指南）</back>;
***: user_guide 
<back:lightgreen>（iEDA 用户手册）</back>;
**: scripts 
<back:lightgreen>（放置工艺库的地方，也是最终 iEDA 程序需要运行的地方）</back>;
**: src 
<back:lightgreen>（源代码文件夹）</back>;
***: analysis 
<back:lightgreen>（无代码文件，留作重构用）</back>;
***: apps 
<back:lightgreen>（main 函数所在的地方）</back>;
***: database 
<back:lightgreen>（实现 C++ 与文件中数据互通）</back>;
****: basic 
<back:lightgreen>（定义了一些基本的数据结构）</back>;
*****: geometry 
<back:lightgreen>（定义了诸如点、矩形、树这样的图形结构）</back>;
*****: graph 
<back:lightgreen>（无代码文件，猜测用来定义一些图数据结构）</back>;
*****: std 
<back:lightgreen>（无代码文件）</back>;
****: data 
<back:lightgreen>（idb 要用到的数据类集合）</back>;
*****: circuit 
<back:lightgreen>（无代码文件，猜测用来读写电路数据）</back>;
*****: constraint 
<back:lightgreen>（无代码文件，猜测用来读写约束数据）</back>;
*****: design 
<back:lightgreen>（定义一些 idb 中需要使用的，与工艺有关的类，例如 lef 单元的结构等）</back>;
*****: liberty 
<back:orange>（无代码文件，不清楚用来做什么）</back>;
*****: parasitic 
<back:orange>（无代码文件，不清楚用来做什么）</back>;
*****: tech 
<back:lightgreen>（一堆 check 文件，例如 IdbMinWidthCheck.h）</back>;
****: interaction 
<back:lightgreen>（声明一些 idb 要用到的，其他模块的类）</back>;
****: manager 
<back:lightgreen>（idb 作为数据访存的部分）</back>;
*****: builder 
<back:lightgreen>（读写 def, layout, gds, lef, verilog 等文件）</back>;
*****: memory 
<back:lightgreen>（无代码文件，猜测用来做内存管理）</back>;
*****: parser 
<back:lightgreen>（针对于各种格式文件的 parser）</back>;
*****: service 
<back:lightgreen>（idb 向外提供的接口）</back>;
****: procedure_data 
<back:lightgreen>（无代码文件，猜测是后续用来序列化中间结果）</back>;
*****: base_data 
<back:orange>（）</back>;
*****: feature 
<back:orange>（）</back>;
*****: update_data 
<back:orange>（）</back>;
***: evaluation 
<back:lightgreen>（评估相关）</back>;
***: interface 
<back:lightgreen>（用户交互）</back>;
****: default_config 
<back:lightgreen>（默认配置文件）</back>;
****: gui 
<back:lightgreen>（GUI 版本）</back>;
****: python 
<back:lightgreen>（Python 版本）</back>;
****: shell 
<back:lightgreen>（Shell 版本）</back>;
****: tcl 
<back:lightgreen>（tcl 脚本版本）</back>;
***: operation 
<back:lightgreen>（各式点工具）</back>;
****: iCTS 
<back:lightgreen>（）</back>;
****: iDRC 
<back:lightgreen>（）</back>;
****: iECO 
<back:lightgreen>（）</back>;
****: iFP 
<back:lightgreen>（）</back>;
****: iIR 
<back:lightgreen>（）</back>;
****: iLO 
<back:lightgreen>（）</back>;
****: iMP 
<back:lightgreen>（）</back>;
****: iNO 
<back:lightgreen>（）</back>;
****: iPDN 
<back:lightgreen>（）</back>;
****: iPL 
<back:lightgreen>（）</back>;
****: iPW 
<back:lightgreen>（）</back>;
****: iRT 
<back:lightgreen>（）</back>;
****: iSTA 
<back:lightgreen>（）</back>;
****: iTM 
<back:lightgreen>（）</back>;
****: iTO 
<back:lightgreen>（）</back>;
***: platform 
<back:lightgreen>（）</back>;
****: data_manager 
<back:lightgreen>（）</back>;
****: evaluation 
<back:lightgreen>（）</back>;
****: file_manager 
<back:lightgreen>（）</back>;
****: flow 
<back:lightgreen>（）</back>;
****: report 
<back:lightgreen>（）</back>;
****: service 
<back:lightgreen>（）</back>;
****: tool_manager 
<back:lightgreen>（）</back>;
***: solver 
<back:lightgreen>（）</back>;
****: clustering 
<back:lightgreen>（）</back>;
****: partition 
<back:lightgreen>（）</back>;
****: qudratic_programming 
<back:lightgreen>（）</back>;
****: steiner_porest 
<back:lightgreen>（）</back>;
****: two_pin_routing 
<back:lightgreen>（）</back>;
***: third_party 
<back:lightgreen>（一些第三方依赖）</back>;
***: utility 
<back:lightgreen>（一些通用小工具）</back>;
****: json 
<back:lightgreen>（json 解析器）</back>;
****: log 
<back:lightgreen>（日志组件）</back>;
****: report 
<back:lightgreen>（报告生成组件）</back>;
****: stdBase 
<back:lightgreen>（）</back>;
****: string 
<back:lightgreen>（给 c-style 字符串增加一些 API）</back>;
****: tcl 
<back:lightgreen>（tcl 脚本引擎）</back>;
****: test 
<back:lightgreen>（utility 模块的单元测试）</back>;
****: time 
<back:lightgreen>（与系统时间有关的工具）</back>;
****: usage 
<back:lightgreen>（用以展示时间和内存使用情况）</back>;

@endmindmap
{% endplantuml %}
