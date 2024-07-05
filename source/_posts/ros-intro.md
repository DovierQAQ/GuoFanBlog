---
title: ROS 入门 - 环境搭建和概念介绍
date: 2024-07-04 10:24:12
updated: 2024-07-04 10:24:12
cover: noetic.webp
tags:
  - ROS
  - C++
categories:
  - 学习笔记
---

本篇是对 [ROS 官方 Tutorials](https://wiki.ros.org/cn/ROS/Tutorials) “初级教程 1-7”部分的学习笔记。

## 安装和配置 ROS 环境

- OS: Ubuntu 20.04.6 LTS
- ROS: Noetic Ninjemys

### 安装

```bash
# 添加源
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'

# 添加密钥
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654

# 安装 ros
sudo apt update
sudo apt install ros-noetic-desktop-full
```

### 配置

```bash
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

## 管理环境

ROS 依赖于使用 shell 环境组合空间的概念，所以如果遇到查找和使用 ROS 软件包方面的问题，检查一下`ROS_ROOT`和`ROS_PACKAGE_PATH`两个环境变量。

```bash
printenv | grep ROS
```

若环境变量未被设置，则需`source /opt/ros/noetic/setup.bash`

## 创建 ROS 工作空间

```bash
mkdir -p ~/catkin_ws/src
cd ~/catkin_ws/
catkin_make
```

执行完以上步骤后，可以看到`src`文件夹中出现了`CMakeLists.txt`，`devel`文件夹下出现了一些脚本。

<img src="catkin-init.webp" height="350px"/>

执行`source devel/setup.bash`可以将当前工作空间设置在环境的最顶层，效果如下：

```text
root@workspace:~/catkin_ws# printenv | grep ROS
ROS_VERSION=1
ROS_PYTHON_VERSION=3
ROS_PACKAGE_PATH=/opt/ros/noetic/share
ROSLISP_PACKAGE_DIRECTORIES=
ROS_ETC_DIR=/opt/ros/noetic/etc/ros
ROS_MASTER_URI=http://localhost:11311
ROS_ROOT=/opt/ros/noetic/share/ros
ROS_DISTRO=noetic
root@workspace:~/catkin_ws# source devel/setup.bash 
root@workspace:~/catkin_ws# printenv | grep ROS
ROS_VERSION=1
ROS_PYTHON_VERSION=3
ROS_PACKAGE_PATH=/root/catkin_ws/src:/opt/ros/noetic/share
ROSLISP_PACKAGE_DIRECTORIES=/root/catkin_ws/devel/share/common-lisp
ROS_ETC_DIR=/opt/ros/noetic/etc/ros
ROS_MASTER_URI=http://localhost:11311
ROS_ROOT=/opt/ros/noetic/share/ros
ROS_DISTRO=noetic
```

----------------------------------------------------------------------------------------

## ROS 文件系统导览

### 概念

- 软件包（Package）: 包是 ROS 代码的组织单元，每个软件包都可以包含程序库、可执行文件、脚本或其他构件。
- Manifests (package.xml): 清单（Manifest）是对软件包的描述。它用于定义软件包之间的依赖关系，并记录有关软件包的元信息，如版本、维护者、许可证等。

### rospack

程序代码散落在许多 ROS 包中，使用`rospack find [package_name]`来找到它们。

```text
root@workspace:~/catkin_ws# rospack find roscpp
/opt/ros/noetic/share/roscpp
```

### roscd

使用`roscd [locationname[/subdir]]`可以直接切换目录到某个软件包或者软件包集当中。

```text
root@workspace:~# roscd roscpp
root@workspace:/opt/ros/noetic/share/roscpp# pwd
/opt/ros/noetic/share/roscpp
```

使用`roscd log`可以进入日志目录。

### rosls

使用`rosls [locationname[/subdir]]`可以直接按软件包的名称执行`ls`命令。

```text
root@workspace:/opt/ros/noetic/share/roscpp# rosls roscpp_tutorials
cmake  launch  package.xml  srv
```

### tab 补全

使用 ROS 工具时，大部分情况下 tab 补全也是生效的，这对于名字较长的包能提高工作效率。

----------------------------------------------------------------------------------------

## 创建 ROS 软件包

一个合格的 catkin 软件包，必须有自己的目录，而且目录中有如下文件：
- 符合 catkin 规范的`package.xml`
- catkin 版本的`CMakeLists.txt`

或者使用前文中的方法初始化工作空间，自动生成必要文件。

### 创建 catkin 软件包

```bash
# 前往工作空间
cd ~/catkin_ws/src

# 创建一个依赖于 std_msgs、roscpp 和 rospy 的软件包，名字叫 beginner_tutorials
catkin_create_pkg beginner_tutorials std_msgs rospy roscpp

# 构建
cd ..
catkin_make

# 将工作空间加入 ROS 环境
. ~/catkin_ws/devel/setup.bash

# 查看依赖
rospack depends1 beginner_tutorials
```

依赖显示如下：

```text
root@workspace:~/catkin_ws# rospack depends1 beginner_tutorials
roscpp
std_msgs
rospy
```

期间遇到`rosdep`没有安装的问题，安装即可；遇到 tab 补全时路径找不到的问题，重新`source``setup.bash`即可；遇到包找不到的问题，安装缺失的依赖库`rosdep install --from-paths src --ignore-src -r -y`。

当然，依赖也可以在`package.xml`里面看到。这样看到的是直接依赖，依赖也存在嵌套，如果想看到所有依赖的包，执行`rospack depends beginner_tutorials`。

```text
root@workspace:~/catkin_ws# rospack depends beginner_tutorials
cpp_common
rostime
roscpp_traits
roscpp_serialization
catkin
genmsg
genpy
message_runtime
gencpp
geneus
gennodejs
genlisp
message_generation
rosbuild
rosconsole
std_msgs
rosgraph_msgs
xmlrpcpp
roscpp
rosgraph
ros_environment
rospack
roslib
rospy
```

### 自定义软件包

一些基本信息被填写在`package.xml`文件中，我们创建好软件包之后，可以先填写`description`、`maintainer`、`license`以及`depend`：

```xml
<?xml version="1.0"?>
<package format="2">
  <name>beginner_tutorials</name>
  <version>0.0.0</version>
  <description>my first ros package</description>

  <!-- One maintainer tag required, multiple allowed, one person per tag -->
  <!-- Example:  -->
  <!-- <maintainer email="jane.doe@example.com">Jane Doe</maintainer> -->
  <maintainer email="guofan@ustc.edu">root</maintainer>


  <!-- One license tag required, multiple allowed, one license per tag -->
  <!-- Commonly used license strings: -->
  <!--   BSD, MIT, Boost Software License, GPLv2, GPLv3, LGPLv2.1, LGPLv3 -->
  <license>MULAN2</license>


  <!-- Url tags are optional, but multiple are allowed, one per tag -->
  <!-- Optional attribute type can be: website, bugtracker, or repository -->
  <!-- Example: -->
  <!-- <url type="website">http://wiki.ros.org/beginner_tutorials</url> -->


  <!-- Author tags are optional, multiple are allowed, one per tag -->
  <!-- Authors do not have to be maintainers, but could be -->
  <!-- Example: -->
  <!-- <author email="jane.doe@example.com">Jane Doe</author> -->


  <!-- The *depend tags are used to specify dependencies -->
  <!-- Dependencies can be catkin packages or system dependencies -->
  <!-- Examples: -->
  <!-- Use depend as a shortcut for packages that are both build and exec dependencies -->
  <!--   <depend>roscpp</depend> -->
  <!--   Note that this is equivalent to the following: -->
  <!--   <build_depend>roscpp</build_depend> -->
  <!--   <exec_depend>roscpp</exec_depend> -->
  <!-- Use build_depend for packages you need at compile time: -->
  <!--   <build_depend>message_generation</build_depend> -->
  <!-- Use build_export_depend for packages you need in order to build against this package: -->
  <!--   <build_export_depend>message_generation</build_export_depend> -->
  <!-- Use buildtool_depend for build tool packages: -->
  <!--   <buildtool_depend>catkin</buildtool_depend> -->
  <!-- Use exec_depend for packages you need at runtime: -->
  <!--   <exec_depend>message_runtime</exec_depend> -->
  <!-- Use test_depend for packages you need only for testing: -->
  <!--   <test_depend>gtest</test_depend> -->
  <!-- Use doc_depend for packages you need only for building documentation: -->
  <!--   <doc_depend>doxygen</doc_depend> -->
  <buildtool_depend>catkin</buildtool_depend>
  <build_depend>roscpp</build_depend>
  <build_depend>std_msgs</build_depend>
  <build_depend>rospy</build_depend>
  <build_export_depend>roscpp</build_export_depend>
  <build_export_depend>std_msgs</build_export_depend>
  <build_export_depend>rospy</build_export_depend>
  <exec_depend>roscpp</exec_depend>
  <exec_depend>std_msgs</exec_depend>
  <exec_depend>rospy</exec_depend>


  <!-- The export tag contains other, unspecified, tags -->
  <export>
    <!-- Other tools can request additional information be placed here -->

  </export>
</package>

```

配置完成后，注释可以删除，保留清爽的`package.xml`。

----------------------------------------------------------------------------------------

## 构建 ROS 软件包

如下指令会构建`src`目录下的所有 catkin 项目。

```bash
# 在 catkin 工作空间下
catkin_make
catkin_make install # 可选
```

若源码在其他路径下，则使用如下指令：

```bash
# 假设代码在 my_src 路径下
catkin_make --source my_src
catkin_make install --source my_src # 可选
```

`build`目录是构建空间的默认位置，`devel`目录是开发空间的默认位置。

----------------------------------------------------------------------------------------

## 理解 ROS 节点

计算图（Computation Graph）是一个由 ROS 进程组成的点对点网络，它们能够共同处理数据，包括以下概念：
- 节点（Nodes）：节点是一个可执行文件，它可以通过 ROS 来与其他节点进行通信。
- 消息（Message）：订阅或发布话题时所使用的 ROS 数据类型。
- 话题（Topic）：节点可以将消息发布到话题，或通过订阅话题来接收消息。
- 主节点（Master）：ROS 的命名服务，例如帮助节点发现彼此。
- rosout：在 ROS 中相当于 stdout/stderr。
- roscore：主节点 + rosout + 参数服务器。

ROS 节点使用 ROS 客户端库与其他节点通信。节点可以发布或订阅话题，也可以提供或使用服务。

ROS 客户端库可以让用不同编程语言编写的节点进行相互通信：
- rospy = Python 客户端库
- roscpp = C++ 客户端库

### roscore

在运行所有 ROS 程序前，应运行`roscore`命令。

### rosnode

用`rosnode list`来列出当前活动的节点：

```text
root@workspace:~/catkin_ws# rosnode list
/rosout
```

用`rosnode info /rosout`来查看节点信息：


```text
root@workspace:~/catkin_ws# rosnode info /rosout
--------------------------------------------------------------------------------
Node [/rosout]
Publications: 
 * /rosout_agg [rosgraph_msgs/Log]

Subscriptions: 
 * /rosout [unknown type]

Services: 
 * /rosout/get_loggers
 * /rosout/set_logger_level


contacting node http://workspace:43581/ ...
Pid: 141
```

### rosrun

用包名直接运行软件包内的节点（不需要知道包的路径）

```bash
rosrun [package_name] [node_name]
```

例如运行`rosrun turtlesim turtlesim_node`会得到如下窗口：

<img src="turtlesim.webp" height="300px"/>

使用重映射参数可以运行节点并指定名称：

```bash
rosrun turtlesim turtlesim_node __name:=my_turtle
```

使用`rosnode ping /turtlesim`可以检查节点是否正常运行：

```text
root@workspace:~/catkin_ws# rosnode ping /turtlesim
rosnode: node is [/turtlesim]
pinging /turtlesim with a timeout of 3.0s
xmlrpc reply from http://workspace:40521/       time=0.950575ms
xmlrpc reply from http://workspace:40521/       time=1.490116ms
xmlrpc reply from http://workspace:40521/       time=0.718355ms
xmlrpc reply from http://workspace:40521/       time=1.216412ms
xmlrpc reply from http://workspace:40521/       time=1.176596ms
xmlrpc reply from http://workspace:40521/       time=1.249313ms
^Cping average: 1.133561ms
```

----------------------------------------------------------------------------------------

## 理解 ROS 话题

我们运行两个节点：一个用来显示乌龟，接收输入信息并移动乌龟；另一个用来接收输入，并将输入发送给第一个节点。

```bash
# 在第一个终端中
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun turtlesim turtlesim_node
```

```bash
# 在第二个终端中
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun turtlesim turtle_teleop_key
```

在第二个终端中使用方向键控制乌龟，乌龟行进会绘制处轨迹，如下图（我已经很努力画一个标准的“F”字母啦）。

<img src="turtle-f.webp" height="300px"/>

### ROS 话题

上面运行的两个节点之间，是通过一个 ROS 话题来相互通信的。`turtule_teleop_key`再话题上**发布**键盘按下的消息，`turtlesim`则**订阅**话题以接收消息。

#### rqt_graph

使用`rqt_graph`来动态显示系统中正在发生的事情。

```bash
# 在第三个终端中
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun turtlesim turtle_teleop_key
```

<img src="rqt_graph.webp" height="300px"/>

如果把鼠标放到 topic 上，topic 和 node 就会被高亮显示。下图意味着两个节点（`/teleop_turtle`和`/turtlesim`）正通过一个话题（`/turtle1/cmd_vel`）进行通信。

<img src="rqt_graph-color.webp" height="300px"/>

#### rostopic

使用`rostopic`工具，我们能很方便地查看 topic 内容或者统计信息。

```text
root@workspace:~# rostopic -h
rostopic is a command-line tool for printing information about ROS Topics.

Commands:
        rostopic bw     display bandwidth used by topic
        rostopic delay  display delay of topic from timestamp in header
        rostopic echo   print messages to screen
        rostopic find   find topics by type
        rostopic hz     display publishing rate of topic
        rostopic info   print information about active topic
        rostopic list   list active topics
        rostopic pub    publish data to topic
        rostopic type   print topic or field type

Type rostopic <command> -h for more detailed usage, e.g. 'rostopic echo -h'

```

首先用`rostopic list`指令找到控制命令对应的 topic name，接着使用`rostopic echo /turtle1/cmd_vel`命令观察其内容。此时再回到第二个终端输入命令，可以看到第三个终端有数据输出：

```text
root@workspace:~/catkin_ws# rostopic list
/rosout
/rosout_agg
/statistics
/turtle1/cmd_vel
/turtle1/color_sensor
/turtle1/pose
root@workspace:~/catkin_ws# rostopic echo /turtle1/cmd_vel
linear:
  x: 2.0
  y: 0.0
  z: 0.0
angular:
  x: 0.0
  y: 0.0
  z: 0.0
---
linear:
  x: 0.0
  y: 0.0
  z: 0.0
angular:
  x: 0.0
  y: 0.0
  z: 2.0
---
```

回到`rqt_graph`的窗口，点击刷新，可以看到`rostopic echo`也订阅了刚才的 topic。

<img src="rostopic-echo.webp" height="300px"/>

使用`rostopic list -v`也可以看到这个 topic 已经有了两个订阅者：

```text
root@workspace:~/catkin_ws# rostopic list -v

Published topics:
 * /turtle1/color_sensor [turtlesim/Color] 1 publisher
 * /turtle1/cmd_vel [geometry_msgs/Twist] 1 publisher
 * /rosout [rosgraph_msgs/Log] 4 publishers
 * /rosout_agg [rosgraph_msgs/Log] 1 publisher
 * /turtle1/pose [turtlesim/Pose] 1 publisher

Subscribed topics:
 * /turtle1/cmd_vel [geometry_msgs/Twist] 2 subscribers
 * /rosout [rosgraph_msgs/Log] 1 subscriber
 * /statistics [rosgraph_msgs/TopicStatistics] 1 subscriber

```

### ROS 消息

话题的通信是通过节点间发送 ROS 消息实现的。为了使发布者和订阅者进行通信，发布者和订阅者必须发送和接收相同类型的消息。这意味着话题的类型是由发布在它上面的消息的类型决定的。

使用`rostopic type [topic]`命令可以查看发布在话题上的消息的类型；使用`rosmsg show [message]`可以看到消息的详细信息。

```text
root@workspace:~/catkin_ws# rostopic type /turtle1/cmd_vel
geometry_msgs/Twist
root@workspace:~/catkin_ws# rosmsg show geometry_msgs/Twist
geometry_msgs/Vector3 linear
  float64 x
  float64 y
  float64 z
geometry_msgs/Vector3 angular
  float64 x
  float64 y
  float64 z

```

或者执行`rostopic type /turtle1/cmd_vel | rosmsg show`。

#### rostopic pub

使用`rostopic pub`可以把数据发布到当前某个正在广播的话题上。

例如：

```bash
rostopic pub -1 /turtle1/cmd_vel geometry_msgs/Twist -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, 1.8]'
```

可以让乌龟画一条弧线，运行三次效果如下：

<img src="rostopic-pub1.webp" height="300px"/>

指令各个部分的作用如下：
- `rostopic pub`: 将消息发布出去；
- `-1`: 只发布一条消息，然后退出；
- `/turtle1/cmd_vel`: 话题名称；
- `geometry_msgs/Twist`: 消息类型；
- `--`: 告知解析器，之后的参数都不是选项；
- `'[2.0, 0.0, 0.0]' '[0.0, 0.0, 1.8]'`: 消息中 linear 和 angular 字段的值。

使用`-r 1`参数可以让`rostopic pub`以 1hz 的频率发送消息。

```bash
rostopic pub /turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, -1.8]'
```

<img src="rostopic-pub2.webp" height="300px"/>

此时再回到`rqt_graph`，发现这个 topic 多了一个 publisher，也就是我们的`rostopic pub`。

<img src="rostopic-pub3.webp" height="300px"/>

使用`rostopic hz [topic]`可以查看 topic 的发送频率。

```text
root@workspace:~/catkin_ws# rostopic hz /turtle1/pose
subscribed to [/turtle1/pose]
average rate: 23.398
        min: 0.015s max: 0.332s std dev: 0.06955s window: 24
average rate: 26.734
        min: 0.015s max: 0.332s std dev: 0.05910s window: 54
average rate: 28.204
        min: 0.015s max: 0.332s std dev: 0.05452s window: 85
average rate: 28.802
        min: 0.015s max: 0.332s std dev: 0.05629s window: 109
average rate: 27.862
        min: 0.015s max: 0.332s std dev: 0.05897s window: 140
average rate: 28.382
        min: 0.015s max: 0.332s std dev: 0.05803s window: 171
average rate: 28.941
        min: 0.015s max: 0.332s std dev: 0.05729s window: 203

```

由以上信息可知`turtlesim_node`在以大约 30hz 的频率往外发送乌龟的位置信息。

#### rqt_plot

如果要以可视化的形式观察发布到某个话题上的数据，可以使用`rqt_plot`。

```
# 在第四个终端中
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun rqt_plot rqt_plot
```

<img src="rqt_plot.webp" height="400px"/>

----------------------------------------------------------------------------------------

## 理解 ROS 服务和参数

**服务（Services）**是节点之间通讯的另一种方式。服务允许节点发送一个**请求（request）**并获得一个**响应（response）**。

### rosservice

- `rosservice list`: 输出活跃服务的信息
- `rosservice call`: 用给定的参数调用服务
- `rosservice type`: 输出服务的类型
- `rosservice find`: 按服务的类型查找服务
- `rosservice uri`: 输出服务的 ROSRPC uri

```text
root@workspace:~# cd catkin_ws/
root@workspace:~/catkin_ws# source ./devel/setup.bash
root@workspace:~/catkin_ws# rosservice list
/clear
/kill
/reset
/rosout/get_loggers
/rosout/set_logger_level
/spawn
/turtle1/set_pen
/turtle1/teleport_absolute
/turtle1/teleport_relative
/turtlesim/get_loggers
/turtlesim/set_logger_level
```

调用`/clear` service 可以清除`turtlesim_node`上绘制的轨迹。

```text
root@workspace:~/catkin_ws# rosservice type /clear
std_srvs/Empty
root@workspace:~/catkin_ws# rosservice call /clear

```

如果服务具有参数，可以使用`rossrv show`查看其参数，例如：

```text
root@workspace:~/catkin_ws# rosservice type /spawn | rossrv show
float32 x
float32 y
float32 theta
string name
---
string name
```

接下来调用该服务时传入参数，产生了一只新的乌龟，名字叫做`turtle2`。

```text
root@workspace:~/catkin_ws# rosservice call /spawn 2 2 0.2 ""
name: "turtle2"
```

<img src="spawn.webp" height="300px"/>

### rosparam

`rosparam`能让我们在 ROS 参数服务器（Parameter Server）上存储和操作数据。参数服务器支持的数据类型如下：
- 整形（integer）
- 浮点（float）
- 布尔（boolean）
- 字典（dictionaries）
- 列表（list）

`rosparam`使用 YAML 标记语言的语法，有很多命令可以用来操作参数：
- rosparam set: 设置参数
- rosparam get: 获取参数
- rosparam load: 从文件中加载参数
- rosparam dump: 向文件中转储参数
- rosparam delete: 删除参数
- rosparam list: 列出参数名

使用`rosparam list`可以看到`turtlesim`节点在参数服务器上的参数。

```text
root@workspace:~/catkin_ws# rosparam list
/rosdistro
/roslaunch/uris/host_workspace__34889
/rosversion
/run_id
/turtlesim/background_b
/turtlesim/background_g
/turtlesim/background_r
```

使用如下命令可以改变`turtlesim`的背景颜色。

```bash
rosparam set /turtlesim/background_r 150
rosservice call /clear
```

<img src="rosparam.webp" height="300px"/>

同样，也可以使用`rosparam get /turtlesim/background_g`来获取背景颜色中`g`通道的值。

```text
root@workspace:~/catkin_ws# rosparam get /turtlesim/background_g
86
```

或者使用`rosparam get /`获得所有参数内容。

```text
root@workspace:~/catkin_ws# rosparam get /
rosdistro: 'kinetic

  '
roslaunch:
  uris:
    host_workspace__34889: http://workspace:34889/
rosversion: '1.12.17

  '
run_id: 2fbb24f0-38ea-11ef-9a4b-0050568914b5
turtlesim:
  background_b: 255
  background_g: 86
  background_r: 150

```

使用`rosparam dump params.yaml`可以将所有参数写入`params.yaml`文件。使用`rosparam load params.yaml copy_turtle`可以将 yaml 文件载入新的命名空间。
















