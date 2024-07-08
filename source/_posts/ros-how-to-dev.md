---
title: ROS 入门 - 调试及开发
date: 2024-07-05 16:52:50
updated: 2024-07-05 16:52:50
cover: noetic.webp
tags:
  - ROS
  - C++
  - python
categories:
  - 学习笔记
---

本篇是对 [ROS 官方 Tutorials](https://wiki.ros.org/cn/ROS/Tutorials) “初级教程 8-16”部分的学习笔记。

## 使用 rqt_console 和 roslaunch

在两个终端里面分别运行：
```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun rqt_console rqt_console
```

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun rqt_logger_level rqt_logger_level
```

会有如下窗口显示：

<img src="rqt_console.webp" height="500px"/>

<img src="rqt_logger_level.webp" height="400px"/>

此时打开第三个终端，运行`turtlesim`：
```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun turtlesim turtlesim_node
```

在`rqt_logger_level`里面设置日志等级为`warn`，再运行如下代码让乌龟撞墙，会看到`rqt_console`里面有日志打印。

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rostopic pub /turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '{linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0,y: 0.0,z: 0.0}}'
```

<img src="rqt_logger_level_warn.webp" height="400px"/>

<img src="logger_level_warn.webp" height="500px"/>

### 日志级别

- Fatal （致命）
- Error （错误）
- Warn  （警告）
- Info  （信息）
- Debug （调试）

打开位于上表下面的日志等级，其上的所有日志等级对应的日志都会被打印。

### 使用 roslaunch

现在先关掉刚才打开的`turtlesim`，我们来使用`roslaunch`创建两个`turtlesim`节点，并且让一个乌龟模仿另一个。

去到我们上一篇教程中创建的软件包，我们来创建`launch`文件。

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
roscd beginner_tutorials
mkdir launch
cd launch
touch turtlemimic.launch
```

将以下内容贴到刚创建的文件中：

```launch
<launch>

  <group ns="turtlesim1">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
  </group>

  <group ns="turtlesim2">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
  </group>

  <node pkg="turtlesim" name="mimic" type="mimic">
    <remap from="input" to="turtlesim1/turtle1"/>
    <remap from="output" to="turtlesim2/turtle1"/>
  </node>

</launch>
```

该文件利用 ns (namespace) 区分出两个 group，以同时启动两个 turtlesim 而不产生命名冲突。接着启动模仿节点，让 turtlesim2 模仿 turtlesim1。

使用`roslaunch`来运行 launch 文件。

```bash
roslaunch beginner_tutorials turtlemimic.launch
```

发布话题来让乌龟运动。

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rostopic pub /turtlesim1/turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, -1.8]'
```

效果是：

<img src="turtlemimic.webp" height="300px"/>

此时用`rqt_graph`查看，如下：

<img src="rqt_graph-turtlemimic.webp" height="300px"/>

------------------------------------------------------------------------------------

## 使用 rosed 在 ROS 中编辑文件

`rosed [package_name] [filename]`允许直接使用软件包名来编辑其中的文件，而无需输入完整路径。

例如，运行`rosed roscpp Logger.msg`会启动 vim 并打开 roscpp 软件包的 Logger.msg 文件。支持 tab 补全。

如果需要修改编辑器，则设置环境变量`EDITOR`。例如`export EDITOR='code '`。也可以将指令写到`.bashrc`中，设置默认编辑器。

------------------------------------------------------------------------------------

## 创建 ROS 消息和服务

- msg 文件：是一个文本文件，用于描述 ROS 消息的字段，方便不同编程语言编写的消息生成源代码。
- srv 文件：描述一个服务。由两部分组成：请求（request）和响应（response）。

msg 文件放在软件包的 msg 目录下，srv 文件存放在 srv 目录下。

msg 文件中可以使用的类型：
- int8, int16, int32, int64 (以及 uint*)
- float32, float64
- string
- time, duration
- 其他msg文件
- variable-length array[] 和 fixed-length array[C]
- Header

`Header`含有时间戳和 ROS 中广泛使用的坐标帧信息。

msg 文件举例：

```msg
  Header header
  string child_frame_id
  geometry_msgs/PoseWithCovariance pose
  geometry_msgs/TwistWithCovariance twist
```

srv 文件举例（A 和 B 是请求，Sum 是响应）：

```srv
int64 A
int64 B
---
int64 Sum
```

### 使用 msg

我们来创建一个 msg 文件。

```bash
cd catkin_ws/
source ./devel/setup.bash
roscd beginner_tutorials/
mkdir msg
echo "int64 num" > msg/Num.msg
```

为了将 msg 文件转换成对应的源代码，我们需在`package.xml`文件中将如下两行解注释，或者加入以下两行：

```xml
  <build_depend>message_generation</build_depend>
  <exec_depend>message_runtime</exec_depend>
```

使用`rosed beginner_tutorials CMakeLists.txt`打开 cmake 文件，做以下操作：
1. 在`find_package(catkin REQUIRED COMPONENTS`的块中加入`message_generation`；
2. 找到`add_message_files(`块并解注释它，将其中的 msg 文件替换成刚才创建的；
3. 找到`genetate_messages(`块并解注释它。

现在，运行`rosmsg show beginner_tutorials/Num`，就能看到 ROS 已经识别了这个消息。

```text
root@workspace:~/catkin_ws/src/beginner_tutorials# rosmsg show beginner_tutorials/Num
int64 num

root@workspace:~/catkin_ws/src/beginner_tutorials# rosmsg show Num
[beginner_tutorials/Num]:
int64 num

```

### 使用 srv

让我们继续来创建服务，这次我们从别处复制一份服务过来。

```bash
root@workspace:~/catkin_ws/src/beginner_tutorials# roscd beginner_tutorials/
root@workspace:~/catkin_ws/src/beginner_tutorials# mkdir srv
root@workspace:~/catkin_ws/src/beginner_tutorials# roscp rospy_tutorials AddTwoInts.srv srv/AddTwoInts.srv
```

运行`rosed beginner_tutorials AddTwoInts.srv`，查看服务内容。

```srv
int64 a
int64 b
---
int64 sum
```

同样的，我们也需在 cmake 文件中做一定修改，运行`rosed beginner_tutorials CMakeLists.txt`，并做如下操作： 
1. 找到`add_service_files(`块，解注释，并修改其中的 srv 文件为刚才复制的。

使用`rossrv show`可以看到服务已经被 ROS 识别：

```text
root@workspace:~/catkin_ws/src/beginner_tutorials# rossrv show beginner_tutorials/AddTwoInts
int64 a
int64 b
---
int64 sum

root@workspace:~/catkin_ws/src/beginner_tutorials# rossrv show AddTwoInts
[rospy_tutorials/AddTwoInts]:
int64 a
int64 b
---
int64 sum

[beginner_tutorials/AddTwoInts]:
int64 a
int64 b
---
int64 sum

```

------------------------------------------------------------------------------------

## 编写简单的发布者和订阅者（C++）

### 发布者节点

创建一个`talker.cpp`。

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
roscd beginner_tutorials/
mkdir src
cd src
touch talker.cpp
rosed beginner_tutorials talker.cpp
```

将如下内容粘贴至新建的文件中：

```cpp
/*
 * Copyright (C) 2008, Morgan Quigley and Willow Garage, Inc.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the names of Stanford University or Willow Garage, Inc. nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
// %Tag(FULLTEXT)%
// %Tag(ROS_HEADER)%
#include "ros/ros.h" // 包括 ROS 中常用的头文件
// %EndTag(ROS_HEADER)%
// %Tag(MSG_HEADER)%
#include "std_msgs/String.h" // 是 std_msgs 包里的 String.msg 自动生成的头文件
// %EndTag(MSG_HEADER)%

#include <sstream>

/**
 * This tutorial demonstrates simple sending of messages over the ROS system.
 */
int main(int argc, char **argv)
{
  /**
   * The ros::init() function needs to see argc and argv so that it can perform
   * any ROS arguments and name remapping that were provided at the command line.
   * For programmatic remappings you can use a different version of init() which takes
   * remappings directly, but for most command-line programs, passing argc and argv is
   * the easiest way to do it.  The third argument to init() is the name of the node.
   *
   * You must call one of the versions of ros::init() before using any other
   * part of the ROS system.
   */
// %Tag(INIT)%
  ros::init(argc, argv, "talker"); // 初始化 ROS，指定了节点名称（不能包含'/'）
// %EndTag(INIT)%

  /**
   * NodeHandle is the main access point to communications with the ROS system.
   * The first NodeHandle constructed will fully initialize this node, and the last
   * NodeHandle destructed will close down the node.
   */
// %Tag(NODEHANDLE)%
  ros::NodeHandle n; // 创建这个进程的节点句柄，创建时会初始化 node，销毁时会清除资源
// %EndTag(NODEHANDLE)%

  /**
   * The advertise() function is how you tell ROS that you want to
   * publish on a given topic name. This invokes a call to the ROS
   * master node, which keeps a registry of who is publishing and who
   * is subscribing. After this advertise() call is made, the master
   * node will notify anyone who is trying to subscribe to this topic name,
   * and they will in turn negotiate a peer-to-peer connection with this
   * node.  advertise() returns a Publisher object which allows you to
   * publish messages on that topic through a call to publish().  Once
   * all copies of the returned Publisher object are destroyed, the topic
   * will be automatically unadvertised.
   *
   * The second parameter to advertise() is the size of the message queue
   * used for publishing messages.  If messages are published more quickly
   * than we can send them, the number here specifies how many messages to
   * buffer up before throwing some away.
   */
// %Tag(PUBLISHER)%
  ros::Publisher chatter_pub = n.advertise<std_msgs::String>("chatter", 1000); // 告诉主节点我们将要发布的话题类型为 std_msgs/String，话题名为 chatter，1000 指代发布队列的大小。
// %EndTag(PUBLISHER)%

// %Tag(LOOP_RATE)%
  ros::Rate loop_rate(10); // 我们希望以 10hz 的频率运行
// %EndTag(LOOP_RATE)%

  /**
   * A count of how many messages we have sent. This is used to create
   * a unique string for each message.
   */
// %Tag(ROS_OK)%
  int count = 0;
  while (ros::ok()) // roscpp 将安装一个 SIGINT 处理程序，当接收到 ctrl+C 时 ros::ok() 返回 false
  {
// %EndTag(ROS_OK)%
    /**
     * This is a message object. You stuff it with data, and then publish it.
     */
// %Tag(FILL_MESSAGE)%
    std_msgs::String msg; // 该类型通常由 msg 文件生成，String 消息有一个成员：data

    std::stringstream ss;
    ss << "hello world " << count;
    msg.data = ss.str();
// %EndTag(FILL_MESSAGE)%

// %Tag(ROSCONSOLE)%
    ROS_INFO("%s", msg.data.c_str()); // 日志打印接口
// %EndTag(ROSCONSOLE)%

    /**
     * The publish() function is how you send messages. The parameter
     * is the message object. The type of this object must agree with the type
     * given as a template parameter to the advertise<>() call, as was done
     * in the constructor above.
     */
// %Tag(PUBLISH)%
    chatter_pub.publish(msg); // 将信息广播给所有已连接的节点
// %EndTag(PUBLISH)%

// %Tag(SPINONCE)%
    ros::spinOnce(); // 为了能够触发回调
// %EndTag(SPINONCE)%

// %Tag(RATE_SLEEP)%
    loop_rate.sleep(); // 剩下的时间用作睡眠，保证 10hz 的运行频率
// %EndTag(RATE_SLEEP)%
    ++count;
  }


  return 0;
}
// %EndTag(FULLTEXT)%
```

以上程序做了如下的事情（详细解释可以看其中的注释）：
1. 初始化 ROS 系统
2. 向主节点宣告我们将要在 chatter 话题上发布 std_msgs/String 类型的消息
3. 以每秒 10 次的频率向 chatter 循环发布消息

ros::ok()在以下情况会返回false：
- 收到SIGINT信号（Ctrl+C）
- 被另一个同名的节点踢出了网络
- ros::shutdown()被程序的另一部分调用
- 所有的ros::NodeHandles都已被销毁

一旦ros::ok()返回false, 所有的ROS调用都会失败。

### 订阅者节点

创建`listener.cpp`：
```bash
touch listener.cpp
rosed beginner_tutorials listener.cpp
```

将如下内容粘贴到刚建立的文件中：

```cpp
/*
 * Copyright (C) 2008, Morgan Quigley and Willow Garage, Inc.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the names of Stanford University or Willow Garage, Inc. nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

// %Tag(FULLTEXT)%
#include "ros/ros.h"
#include "std_msgs/String.h"

/**
 * This tutorial demonstrates simple receipt of messages over the ROS system.
 */
// %Tag(CALLBACK)%
void chatterCallback(const std_msgs::String::ConstPtr& msg) // 回调函数，通过 shared_ptr 来传递消息
{
  ROS_INFO("I heard: [%s]", msg->data.c_str());
}
// %EndTag(CALLBACK)%

int main(int argc, char **argv)
{
  /**
   * The ros::init() function needs to see argc and argv so that it can perform
   * any ROS arguments and name remapping that were provided at the command line.
   * For programmatic remappings you can use a different version of init() which takes
   * remappings directly, but for most command-line programs, passing argc and argv is
   * the easiest way to do it.  The third argument to init() is the name of the node.
   *
   * You must call one of the versions of ros::init() before using any other
   * part of the ROS system.
   */
  ros::init(argc, argv, "listener");

  /**
   * NodeHandle is the main access point to communications with the ROS system.
   * The first NodeHandle constructed will fully initialize this node, and the last
   * NodeHandle destructed will close down the node.
   */
  ros::NodeHandle n;

  /**
   * The subscribe() call is how you tell ROS that you want to receive messages
   * on a given topic.  This invokes a call to the ROS
   * master node, which keeps a registry of who is publishing and who
   * is subscribing.  Messages are passed to a callback function, here
   * called chatterCallback.  subscribe() returns a Subscriber object that you
   * must hold on to until you want to unsubscribe.  When all copies of the Subscriber
   * object go out of scope, this callback will automatically be unsubscribed from
   * this topic.
   *
   * The second parameter to the subscribe() function is the size of the message
   * queue.  If messages are arriving faster than they are being processed, this
   * is the number of messages that will be buffered up before beginning to throw
   * away the oldest ones.
   */
// %Tag(SUBSCRIBER)%
  ros::Subscriber sub = n.subscribe("chatter", 1000, chatterCallback); // 将 topic 和回调绑定，1000 指明队列大小
// %EndTag(SUBSCRIBER)%

  /**
   * ros::spin() will enter a loop, pumping callbacks.  With this version, all
   * callbacks will be called from within this thread (the main one).  ros::spin()
   * will exit when Ctrl-C is pressed, or the node is shutdown by the master.
   */
// %Tag(SPIN)%
  ros::spin(); // 启动一个自循环，尽可能快地调用消息回调函数，会自动处理 ros::ok()
// %EndTag(SPIN)%

  return 0;
}
// %EndTag(FULLTEXT)%
```

以上程序做了如下的事情（详细解释看注释）：
1. 初始化ROS系统
2. 订阅chatter话题
3. 开始spin自循环，等待消息的到达
4. 当消息到达后，调用chatterCallback()函数

### 构建节点

将如下代码加入到`CMakeLists.txt`中：

```cmake
add_executable(talker src/talker.cpp)
target_link_libraries(talker ${catkin_LIBRARIES})
add_dependencies(talker beginner_tutorials_generate_messages_cpp)

add_executable(listener src/listener.cpp)
target_link_libraries(listener ${catkin_LIBRARIES})
add_dependencies(listener beginner_tutorials_generate_messages_cpp)
```

现在开始构建。

```bash
cd ~/catkin_ws/
catking_make
```

python 版本的查看[教程](https://wiki.ros.org/cn/ROS/Tutorials/WritingPublisherSubscriber%28python%29)。大概思路是在`scripts`文件夹下放好脚本，在`CMakeLists.txt`中用如下写法安装：

```cmake
catkin_install_python(PROGRAMS scripts/talker.py
  DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)
```

------------------------------------------------------------------------------------

## 检验简单的发布者和订阅者

使用如下指令运行发布者，可以看到日志输出：

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun beginner_tutorials talker
```

```text
[ INFO] [1720424116.368870881]: hello world 0
[ INFO] [1720424116.468966483]: hello world 1
[ INFO] [1720424116.568886333]: hello world 2
[ INFO] [1720424116.668911213]: hello world 3
[ INFO] [1720424116.768897595]: hello world 4
[ INFO] [1720424116.868967864]: hello world 5
[ INFO] [1720424116.968911329]: hello world 6
[ INFO] [1720424117.068918117]: hello world 7
```

如果是 python 版本，则用`rosrun beginner_tutorials talker.py`。

使用如下指令运行订阅者，可以看到日志输出。

```bash
cd ~/catkin_ws/
source ./devel/setup.bash
rosrun beginner_tutorials listener
```

```text
[ INFO] [1720424275.169713314]: I heard: [hello world 1588]
[ INFO] [1720424275.269446815]: I heard: [hello world 1589]
[ INFO] [1720424275.369373090]: I heard: [hello world 1590]
[ INFO] [1720424275.469374169]: I heard: [hello world 1591]
[ INFO] [1720424275.569499517]: I heard: [hello world 1592]
[ INFO] [1720424275.669370214]: I heard: [hello world 1593]
```

------------------------------------------------------------------------------------

## 编写简单的服务和客户端（C++）

### 服务节点

在软件包的`src`目录下创建`add_two_ints_server.cpp`，并将如下内容粘贴进去：

```cpp
#include "ros/ros.h"
#include "beginner_tutorials/AddTwoInts.h" // 从之前创建的 srv 文件生成的头文件

bool add(beginner_tutorials::AddTwoInts::Request  &req,
         beginner_tutorials::AddTwoInts::Response &res) // 提供了 AddTwoInts 服务的具体实现
{
  res.sum = req.a + req.b;
  ROS_INFO("request: x=%ld, y=%ld", (long int)req.a, (long int)req.b);
  ROS_INFO("sending back response: [%ld]", (long int)res.sum);
  return true;
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "add_two_ints_server");
  ros::NodeHandle n;

  ros::ServiceServer service = n.advertiseService("add_two_ints", add); // 服务被创建，并在 ROS 中宣告
  ROS_INFO("Ready to add two ints.");
  ros::spin();

  return 0;
}
```

### 客户端节点

在软件包的`src`目录下创建`add_two_ints_client.cpp`，并将如下内容粘贴进去：

```cpp
#include "ros/ros.h"
#include "beginner_tutorials/AddTwoInts.h"
#include <cstdlib>

int main(int argc, char **argv)
{
  ros::init(argc, argv, "add_two_ints_client");
  if (argc != 3)
  {
    ROS_INFO("usage: add_two_ints_client X Y");
    return 1;
  }

  ros::NodeHandle n;
  ros::ServiceClient client = n.serviceClient<beginner_tutorials::AddTwoInts>("add_two_ints"); // 为 add_two_ints 服务创建一个客户端
  beginner_tutorials::AddTwoInts srv;
  srv.request.a = atoll(argv[1]); // 服务 request 成员赋值
  srv.request.b = atoll(argv[2]);
  if (client.call(srv)) // 阻塞调用服务
  {
    ROS_INFO("Sum: %ld", (long int)srv.response.sum); // 使用服务的 response
  }
  else
  {
    ROS_ERROR("Failed to call service add_two_ints");
    return 1;
  }

  return 0;
}
```

编辑软件包中的 cmake 文件，在末尾加入如下行：

```cmake
add_executable(add_two_ints_server src/add_two_ints_server.cpp)
target_link_libraries(add_two_ints_server ${catkin_LIBRARIES})
add_dependencies(add_two_ints_server beginner_tutorials_gencpp)

add_executable(add_two_ints_client src/add_two_ints_client.cpp)
target_link_libraries(add_two_ints_client ${catkin_LIBRARIES})
add_dependencies(add_two_ints_client beginner_tutorials_gencpp)
```

python 版本查看[教程](https://wiki.ros.org/cn/ROS/Tutorials/WritingServiceClient%28python%29)。

### 构建节点

```bash
cd ~/catkin_ws/
catkin_make
```

------------------------------------------------------------------------------------

## 检验简单的服务和客户端

运行服务：

```text
root@workspace:~/catkin_ws# source ./devel/setup.bash
root@workspace:~/catkin_ws# rosrun beginner_tutorials add_two_ints_server
[ INFO] [1720425593.980292643]: Ready to add two ints.

```

运行客户端：

```text
root@workspace:~/catkin_ws# source ./devel/setup.bash
root@workspace:~/catkin_ws# rosrun beginner_tutorials add_two_ints_client 2 4
[ INFO] [1720425685.756920908]: Sum: 6

```

服务端的输出如下：

```text
[ INFO] [1720425593.980292643]: Ready to add two ints.
[ INFO] [1720425685.756663129]: request: x=2, y=4
[ INFO] [1720425685.756706281]: sending back response: [6]

```





















