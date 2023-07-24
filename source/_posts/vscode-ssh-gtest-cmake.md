---
title: vscode环境搭建 - SSH、Google Test 和 Cmake
date: 2023-07-24 10:09:49
updated: 2023-07-24 10:09:49
cover:
tags:
    - vscode
    - Google Test
    - CmakeList
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
  HostName 192.168.224.130
  User guofan
  IdentityFile /Users/guofan/.ssh/id_rsa
```

### 修改远程服务器用户密码

- 通过ssh连接服务器
- 执行命令`passwd`
- 终端会提示输入旧密码，再输入两次新密码

## Cmake

- 安装`C/C++`插件

## Google Test
