---
title: EDA后端总体概览
date: 2023-08-10 14:24:46
updated: 2023-08-10 14:24:46
cover: http://www.plantuml.com/plantuml/svg/TP7TJi8m08Nl-nIzviON88Reauojuc9ToLP2Z36PVsGOuYOgqnX5eq6zSEg5XB25lGnjnnMlODdc337sgZtdEwT_e69HnQJDgWL0sQ8x6Aq2WsW8xW8envgYRjLCqZ2qTOA92PkREaLW3vHNSXQKe6Y_2g-L19CaU02b4cIZGtOpIPwFcDDbtSvY-MbBOzcPHyu69iIiOyMOH-tK5nTVVEmLVfqqqPB_MoNPy5nCdZ95iYfkM1IPkb7BOKaVlqYl86gOL1KCPP-Ajf512ovv7uYmLN0Qeeh-XuFS7ywwVNv_9iA8UKv-KJ6EmT9UFq9HMX3fT1e7_Ern4PxTNdDxNxQoiSkS5h_pCYmS9d5VlgG8_EdeD4inzu1VVd3NOsulfVu9Py8qkcATNdh0atvY-pa0AiZG5l_y3G00
tags:
    - EDA
categories:
    - 经验总结
---

在粗略阅读《数字集成电路物理设计》这本书之后，与其说花费很多时间精力去研读其中的细节，倒不如先进行一次复习，将自己所理解的 EDA 物理设计的流程以及关键技术总结成图。

## 各部分组成


### 物理设计

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

{% plantuml %}

@startuml

skinparam State {
    BackgroundColor White
}

hide empty description

state "Chip Parameters" as cp
cp : Target market
cp : Desired performance
cp : Power targets
cp : Interface IP requirments
cp : Use cases

state "System Specifications" as ss
ss : Functional Requirements
ss : Performance Metrics
ss : Interface Definitions
ss : Hardware Resource Allocation
ss : Reliability and Security Requirements
ss : Constraints
ss : Verification Methods

state "Architecture" as arc
arc : Module Hierarchy
arc : Interface Definition
arc : Results of System-level Simulation

state c_fd <<choice>>

state "RTL" as rtl
rtl : HDL

state "Constraint File" as cf
cf : HDL or TCL

state "Standard Cell Library" as scl
scl : Basic logic gate
scl : Sequential element
scl : Storage unit
scl : Digital module
scl : Other commonly used functional units

state "Technology Library and Constraints" as tlc

state c_ls <<choice>>

state "Target Technology Library" as ttl
ttl : Physical Design Rules
ttl : Cell Library
ttl : Timing Libraries
ttl : Power Libraries
ttl : Model Libraries

state "Gate-level Netlist" as gn
gn : Logic gates
gn : Input and output ports
gn : Interconnections

state c_tm <<choice>>

state "Physical Constraints" as pc
pc : Placement Constraints
pc : Clock Constraints
pc : Routing Constraints
pc : Power Constraints
pc : Physical Verification Constraints

state "Timing Information" as ti
ti : Clock Frequency
ti : Maximum Delay
ti : Constraints
ti : Constraint Paths
ti : Constraint Boundaries
ti : Timing Analysis Reports

state "DRC Rule" as drcrule
drcrule : Spacing Rule
drcrule : Tolerance Offset
drcrule : Abnormal Areas
drcrule : Metal Layer Rule
drcrule : Device Placement Rule
drcrule : Power and Ground Rule

state "Physical Netlist" as pn
pn : Gate-Level Circuit Information
pn : Physical Location Information
pn : Timing Information
pn : Power and Ground Information
pn : Physical Constraint Information

state "Floorplanning Constraints" as floorplanning_constraints
floorplanning_constraints : Chip Size and Boundary
floorplanning_constraints : Partitioning
floorplanning_constraints : Placement and Orientation of Macros
floorplanning_constraints : Routing of Communication and Signal Lines
floorplanning_constraints : Placement of Power and Ground
floorplanning_constraints : Pin Placement Constraints

state "Timing Constraints" as timing_constraints
timing_constraints : Clock definition
timing_constraints : Setup time
timing_constraints : Hold time
timing_constraints : Delay time
timing_constraints : Maximum frequency
timing_constraints : Minimum period
timing_constraints : Constraint path
timing_constraints : Timing analysis

state "Physical Design Rule Libraries" as rule_libraries
rule_libraries : Line width and spacing rules
rule_libraries : Layout rules
rule_libraries : Pin access rules
rule_libraries : Pad rules
rule_libraries : Via rules
rule_libraries : Power and ground rules
rule_libraries : Guard ring rules
rule_libraries : Contact rules

state c_pd <<choice>>

state "Place & Route Infomation" as pr
pr : Physical Design Database
pr : Layout
pr : Routing
pr : Timing Information

state "Verification Reports" as vr
vr : DRC
vr : LVS
vr : ERC
vr : Antenna Check

state c_so <<choice>>

state "Final Design" as fd
fd : GDS

state "Complete Design Verification Report" as complete_report
complete_report : Design Specification
complete_report : Verification Plan
complete_report : Test Environment Setup
complete_report : Test Cases
complete_report : Verification Results
complete_report : Issue Tracking
complete_report : Coverage Analysis
complete_report : Verification Summary

state "Production Specification Document" as production_document
production_document : Design Overview
production_document : Chip Functional Description
production_document : Power and Timing Requirements
production_document : Physical Characteristics
production_document : Package and Test Requirements
production_document : Manufacturability Requirements
production_document : Reliability Requirements
production_document : Integration Test Plan
production_document : Quality Control Plan
production_document : Manufacturing Process
production_document : Environmental, Health, and Safety Requirements
production_document : Project Schedule

state "Mask Data" as md

state "Bare Die" as bd

state "Chip" as chip

[*] -> cp

cp -> ss : System Specifications

ss -> arc : Architectural Design

ss -> c_fd
arc --> c_fd
c_fd --> rtl : Functional Design

cf --> c_ls
scl --> c_ls
tlc --> c_ls
rtl --> c_ls
c_ls --> gn : Logic Synthesis

ttl --> c_tm : Tech Mapping
gn --> c_tm : Tech Mapping
c_tm --> pn
c_tm --> pc
c_tm --> ti
c_tm --> drcrule

pn --> c_pd
floorplanning_constraints --> c_pd
timing_constraints --> c_pd
rule_libraries --> c_pd

c_pd --> pr : Physical Design

pr --> vr : Physical Verification

vr --> c_so : Sign Off

c_so --> fd
c_so --> complete_report
c_so --> production_document

fd --> md : Layout Processing

md -> bd : Fabrication

bd -> chip : Package and Test

chip -> [*]

tlc -right[hidden]-> rtl
cf -right[hidden]-> tlc
scl -right[hidden]-> cf

pc -[hidden]-> floorplanning_constraints
ti -[hidden]-> timing_constraints
drcrule -[hidden]-> rule_libraries

@enduml

{% endplantuml %}

## 活动图


