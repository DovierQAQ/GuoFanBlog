---
title: 在Mac上使用运行远程GUI程序 - XQuartz + vscode
date: 2023-08-28 15:18:25
updated: 2023-08-28 15:18:25
cover: xclock.webp
tags:
    - vscode
    - X11
categories:
    - 经验总结
---

## 本地

### 安装xquartz

终端中使用如下命令
`brew install --cask xquartz`

因为需要从 github 上面 clone 一些东西，所以有可能卡很长时间而且失败，换源，或者多试几次。

接着从`启动`中打开`XQuartz`，并设置环境变量：
将`export DISPLAY=:0`加到`.zshrc`中并`source`之。

{% note info flat %}
此处省略了服务器端的环境搭建。
{% endnote %}

使用 ssh 命令连接到远程服务器（记得加上`-X`参数），并输入`xclock`指令，如果一切正常会弹出如下窗口
![](xclock.webp)

## vscode

1. Remote X11 (SSH)
2. Remote X11

其中，前者运行在本地的 vscode，后者运行于服务器。

## 遇到问题

### DISPLAY设置失败

Remote X11 扩展报错：
`Failed to get DISPLAY: Error: Error while signing data with privateKey: error:06000066:public key routines:OPENSSL_internal:DECODE_ERROR`

解决办法：将本地私钥改成 PEM 格式
`ssh-keygen -p -m PEM -f ~/.ssh/id_rsa`

### 无法连接显示

运行 GUI 程序报错：
```
qt.qpa.xcb: could not connect to display localhost:14.0
qt.qpa.plugin: Could not load the Qt platform plugin "xcb" in "" even though it was found.
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.

Available platform plugins are: eglfs, linuxfb, minimal, minimalegl, offscreen, vnc, xcb.
```

重启电脑就好了，猜测原因是 vscode 终端没有重新载入 .zshrc，导致没有 DISPLAY 变量。
