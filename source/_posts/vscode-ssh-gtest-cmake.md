---
title: vscode环境搭建 - SSH、Google Test 和 CMake
date: 2023-07-24 10:09:49
updated: 2023-07-24 10:09:49
cover: remote.png
tags:
    - vscode
    - Google Test
    - CMake
categories:
    - 经验总结
---

## vscode远程连接服务器

- 安装插件`Remote - SSH`
- vscode左边工具栏会出现一个“电脑屏幕右下角有><符号”的图标，点进去配置远程主机
- 编辑`config`文件，输入以下内容（注意根据实际情况修改）
```
Host pcl
  HostName 192.168.224.xxx
  User guofan
```
- vscode会询问是否继续，会提示输入密码

### 配置密钥

- 在本地使用如下命令生成一个非对称密钥（文件名和描述照实际情况修改）：
`ssh-keygen -t rsa -f ~/.ssh/id_rsa -C "PCL"`
- 在本地使用如下命令将公钥拷贝到远程服务器：
`ssh-copy-id -i id_rsa guofan@192.168.224.xxx`
- 终端会提示输入密码，然后尝试使用生成的密钥登陆远程服务器
- 再次设置vscode的远程服务器，增加密钥路径，最终配置文件为：
```
Host pcl
  HostName 192.168.224.xxx
  User guofan
  IdentityFile /Users/guofan/.ssh/id_rsa
```

### 修改远程服务器用户密码

- 通过ssh连接服务器
- 执行命令`passwd`
- 终端会提示输入旧密码，再输入两次新密码

## CMake

- 安装`C/C++`插件
- 安装`CMake`和`CMake Tools`插件
- 安装`Doxygen Documentation Generator`插件

### 命令行方式

在某个项目的路径下创建文件`CMakeLists.txt`，输入以下内容（注意针对性修改，更高级的`CMakeLists`文件等系统学习了再来写）：
```CMake
# 声明要求的cmake最低版本
cmake_minimum_required(VERSION 3.15)

# 声明一个cmake工程
project(assignment1)

# 打印相关消息
MESSAGE(STATUS "my first cmake project")

# 设置路径
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/build)

# 设置头文件路径
include_directories(${PROJECT_SOURCE_DIR}/include)

# 编译静态库
add_library(graph STATIC ${PROJECT_SOURCE_DIR}/src/graph.cpp)

# 编译可执行文件
add_executable(${PROJECT_NAME} main.cpp)

# 链接需要的库
target_link_libraries(${PROJECT_NAME} graph)

# compile_commands.json中包含所有编译单元执行的指令
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 打包功能
set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
```

- 创建`build`文件夹：`mkdir build; cd build`
- 执行编译指令：`cmake ..; make`

`build`文件夹中即会出现可执行文件。

### vscode插件方式

- 在需要建立 CMake 工程的地方按快捷键`F1`
- 会有弹窗提示需要输入工程名、选择 C 还是 C++、选择库或者可执行文件
- 程序自动在目录下生成`build`文件夹和`CMakeLists.txt`文件

自动生成的文件内容如下：
```CMake
cmake_minimum_required(VERSION 3.0.0)
project(dag VERSION 0.1.0 LANGUAGES C CXX)

include(CTest)
enable_testing()

add_executable(dag main.cpp)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
```

修改此文件称为符合当前工程的版本，再使用快捷键`F7`编译，则`build`文件夹中会出现可执行文件。

### CMake 基本使用

参考 [Mastering CMake](https://cmake.org/cmake/help/book/mastering-cmake/)

- 声明最小 CMake 版本（基本框架）：`cmake_minimum_required(VERSION x.x)`
- 声明工程名（基本框架）：`project(xxx)`
- 声明可执行文件（基本框架）：`add_executable(name xxx.cpp)`

#### 使用配置文件

`CMakeLists`
```CMake
set (Tutorial_VERSION_MAJOR 1)
set (Tutorial_VERSION_MINOR 0)
configure_file({
    "${PROJECT_SOURCE_DIR}/TutorialConfig.h.in"
    "${PROJECT_BINARY_DIR}/TutorialConfig.h"
})
```

`TotorialConfig.h.in`
```C++
#define Tutorial_VERSION_MAJOR @Tutorial_VERSION_MAJOR@
#define Tutorial_VERSION_MINOR @Tutorial_VERSION_MINOR@
```

`main.cpp`
```C++
#include "TutorialConfig.h"
int main (int argc, char *argv[]) {
    fprintf(stdout,"%s Version %d.%d\n",
            argv[0],
            Tutorial_VERSION_MAJOR,
            Tutorial_VERSION_MINOR);
    return 0;
}
```

#### 库

- 为库创建文件夹，并在文件夹中添加`CMakeLists.txt`文件，写入编译库的语句：`add_library(xxx xxx,cpp)`
- 在顶层的`CMakeLists.txt`中添加库目录，这样其中的`CMakeLists.txt`文件就会得以执行：
```CMake
include_directories("${PROJECT_SOURCE_DIR}/MathFunctions")
add_subdirectory(xxx)
```
- 为新加的库添加链接：`target_link_libraries(${PROJECT_NAME} xxx)`

#### 可选项

- 在顶层`CMakeLists.txt`中加入选项：`option(USE_MY_LIB "use my optional library?" ON)`
- 修改包含库的部分，让它们受到选项控制使用一个`EXTRA_LIBS`来收集用到的库：
```CMake
if (USE_MY_LIB)
    include_directories("${PROJECT_SOURCE_DIR}/MathFunctions")
    add_subdirectory(xxx)
    set(EXTRA_LIBS ${EXTRA_LIBS} xxx)
endif (USE_MY_LIB)
```
- 修改链接语句为：`target_link_libraries(${PROJECT_NAME} ${EXTRA_LIBS})`
- 在配置文件`TotorialConfig.h.in`中增加宏定义：`#cmakedefine USE_MY_LIB`
- 源代码中检测是否有`USE_MY_LIB`宏定义就可以决定是否包含头文件：
```C++
#ifdef USE_MY_LIB
#include "xxx.h"
#endif
```

#### 安装与测试

{% note warning flat %}
TODO
{% endnote %}

#### 测试目标平台是否有某函数

```CMake
include(CheckFunctionExists.cmake)
check_function_exists(log HAVE_LOG)
```

同样通过配置文件将这个结果传递给代码：`#cmakedefine HAVE_LOG`

#### 生成文件及生成器

{% note warning flat %}
TODO
{% endnote %}

#### 安装器

{% note warning flat %}
TODO
{% endnote %}

#### Dashboard

{% note warning flat %}
TODO
{% endnote %}

## Google Test

- 安装`Google Test`插件
- 安装`C++ TestMate`插件
- 安装 gtest 库：`sudo apt-get install libgtest-dev`

### 集成 CMake

参考 [GoogleTest Documentation](https://google.github.io/googletest/quickstart-cmake.html)

在`CMakeLists.txt`中加上如下内容，即可使用 GTest：
```CMake
# gtest
target_link_libraries(${PROJECT_NAME} libgtest.a libgtest_main.a pthread)
```

加入 GTest 的测试代码：
```C++
TEST(testCase, test0) {
    Graph g(6);
    
    g.setEdge({
        {0, 1, 5},
        {0, 3, 4},
        {0, 2, 5},
        {1, 3, 1},
        {2, 4, 7},
        {3, 4, 2},
        {3, 5, 7},
        {4, 5, 1}
    });
    
    EXPECT_EQ(g.findPath(0, 5, {3}).size(), 4);
}

int main(int argc, char ** argv) {
    // google test
    testing::InitGoogleTest(&argc, argv);
    
    return RUN_ALL_TESTS();
}
```

运行结果如下：
```
[==========] Running 1 test from 1 test suite.
[----------] Global test environment set-up.
[----------] 1 test from testCase
[ RUN      ] testCase.test0
[       OK ] testCase.test0 (0 ms)
[----------] 1 test from testCase (0 ms total)

[----------] Global test environment tear-down
[==========] 1 test from 1 test suite ran. (0 ms total)
[  PASSED  ] 1 test.
```

### Google Test 基本使用

参考[官方文档](https://google.github.io/googletest/)

- `CMakeLists.txt`：`target_link_libraries(${PROJECT_NAME} libgtest.a libgtest_main.a pthread)`
- C++：`#include <gtest/gtest.h>`

{% note warning flat %}
TODO
{% endnote %}
