---
title: 使用 VSCode 进行 UML 建模 - PlantUML
date: 2024-04-16 11:10:52
updated: 2024-04-16 11:10:52
cover: plantuml.webp
tags:
  - vscode
  - PlantUML
categories:
  - 经验总结
---

## 准备工作

1. vscode：[官方网站](https://code.visualstudio.com/)
2. 插件：vscode 中搜索插件 PlantUML 并进行安装，需要注意的是，如果使用 ssh 远程编辑，则还需在 remote 端安装此插件
3. graphviz：由于 PlantUML 是在 graphviz 基础上运行的，所以需要下载并安装 graphviz（[下载页面](https://graphviz.org/download/)）。如果不想本地安装，也有[在线网页](https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000)进行图形输出。

## 开始编辑

PlantUML 语法见[官方手册](https://plantuml.com/zh/)

在任意一个文档（推荐新建后缀为`.puml`的文件）中输入 PlantUML 的代码，使用快捷键`Alt+D`（Macos 下可能是 `Opt+D`）即可实时预览自动排版的 UML 图。

效果如下（左边是代码，按了快捷键后自动分出右边窗口用来同步显示）：
![](plantuml.webp)
