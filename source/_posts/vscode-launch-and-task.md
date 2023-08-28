---
title: 远程调试C++程序 - 配置vscode的launch.json和task.json
date: 2023-08-28 10:11:20
updated: 2023-08-28 10:11:20
cover: debug.webp
tags:
    - vscode
    - C++
    - CMake
categories:
    - 经验总结
---

参考[vscode 官方文档](https://code.visualstudio.com/docs)

## 插件安装列表

- C/C++
- C/C++ Extension Pack
- Clang-Format
- CMake
- CMake Tools
- Remote - SSH
- Remote - SSH: Editing Configuration Files
- Remote Explorer

## 编辑代码

### 远程编辑

参考：{% post_link vscode-ssh-gtest-cmake %}

### 格式化代码

找到`Clang-Format`插件设置，将其中如下选项设置为`Google`：
- Clang-format: Fallback Style
- Clang-format › Language › C: Style
- Clang-format › Language › Cpp: Style
- Clang-format: Style

在设置中搜索`Format On Save`，打上勾

## 构建工程

### CMake

点击 vscode 底部状态栏，选择编译器
![](cmake_choose1.webp)

选择一个比较新版本的编译器
![](cmake_choose2.webp)

之后 CMake 会自动运行
![](cmake_run.webp)

点击下面的`[all]`可以选择生成项目中某个可执行文件，默认生成所有；点击`生成`可以开始编译
![](cmake_target.webp)

## .vscode中的文件

### 创建配置文件

找到 vscode 边栏的`运行和调试`按钮，点击其中的`创建 launch.json 文件`
![](vscode_create_json.webp)

打开生成的`launch.json`，编辑框右下角会出现`添加配置`按钮，点击它，会自动填充一个默认配置
![](launch_add_config.webp)

修改如下路径，则可以使用 F5 键开始运行
![](launch_edit.webp)

从 vscode 菜单 - 终端 - 配置默认生成任务，选择“CMake: 生成”
![](task_add_cmake.webp)

修改`tasks.json`，并在`launch.json`中关于该可执行文件的调试中增加一行`"preLaunchTask": "iPLTest",`，于是每次 F5 调试时都会编译一遍
![](task_json.webp)

### 断点失效的解决办法

现在直接运行，发现程序不会停在断点位置，断点在按下 F5 时由红色实心变成了黑色空心，鼠标放上去会提示：”Module containing this breakpoint has not yet loaded or the breakpoint address could not be obtained.“
![](breakpoint_unavailable.webp)

原因是使用 CMake 生成时没有指定 Debug，导致没有调试信息，需要在生成目标对应的 CMakeLists.txt 中加上如下语句：
`set(CMAKE_BUILD_TYPE "Debug")`
