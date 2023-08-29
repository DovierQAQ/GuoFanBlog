---
title: 让我的vscode更好用 - 插件和快捷键
date: 2023-08-28 10:24:04
updated: 2023-08-28 10:24:04
cover: cover.webp
tags:
    - vscode
    - Git
categories:
    - 经验总结
---

# 插件

- Git Graph
- Git History
- GitLens
- Better Comments
- Night Owl
- Markdown All in One
- Markdown Preview Github Styling
- PlantUML
- TODO Highlight
- Waka Time
- GitHub Copilot

## Git相关

### Git Graph

（像乐谱一样）

![](gitgraph.webp)

### Git History

右键菜单中能找到`File History`，就能方便地回退到特定的版本了。
![](githistory.webp)
![](githistory2.webp)

### GitLens

光标所在的行会显示提交人以及时间。
![](gitlens1.webp)

被增删改的代码旁边会出现提示，点击就可以查看版本对比内容，方便回退。
![](gitlens2.webp)

这个插件功能强大，还有付费功能。

## 界面

### Better Comments

在设置中搜索到扩展，然后在`settings.json`中添加预设。
![](better_comments.webp)

### TODO Highlight



### Night Owl

漂亮的蓝黑色主题。
![](cover.webp)

## Markdown编写

### Markdown All in One

使用快捷键`Cmd + Shift + P`可以调出命令输入框，输入`markdown`即可找到该扩展对应的命令。
![](markdown.webp)

另外，书写过程中可以使用如下快捷键。

| Key                    | Command                        |
| ---------------------- | ------------------------------ |
| Ctrl / Cmd + B         | Toggle bold                    |
| Ctrl / Cmd + I         | Toggle italic                  |
| Alt + S (on Windows)   | Toggle strikethrough           |
| Ctrl + Shift + ]       | Toggle heading (uplevel)       |
| Ctrl + Shift + [       | Toggle heading (downlevel)     |
| Ctrl / Cmd + M         | Toggle math environment        |
| Alt + C                | Check / Uncheck task list item |
| Ctrl / Cmd + Shift + V | Toggle preview                 |
| Ctrl / Cmd + K V       | Toggle preview to side         |

### Markdown Preview Github Styling

（也可以分屏查看，实时预览）

![](markdown_github_style.webp)

## 画图

### PlantUML

PlantUML 语法参考[官方文档](https://plantuml.com/zh/)

光标在编写的绘图代码上，按快捷键`Alt/Opt + D`就可以预览。
![](plantuml.webp)

环境搭建（Mac）
- 安装 Java：`brew cask install java`
- 安装 graphviz：`brew install graphviz`

## 统计编码时间

###  Waka Time

需要去官网注册账号（可直接使用 Github 登录），并找到 API Key 复制下来，在 vscode 中使用`Cmd + Shift + P`打开命令输入框，输入`wakatime`，设置 API Key。
![](wakatime.webp)

底下状态栏会显示今天编码多久了，点击它也可以去官网看到更详细的图表。
![](wakatime2.webp)

## AI

### GitHub Copilot

编码神器，可惜还没有搞定 Student Pack。

# 快捷键

列出常用且实用的快捷键，其余快捷键可以查询手册：
- [Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [MacOS](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)

{% note info flat %}
先写 Mac 的版本，因为最近干活主要用它。
{% endnote %}

## 普通

- **⇧⌘P, F1**：打开命令输入框。
- **⇧⌘N**：新窗口。

## 编辑

- **⌘X**：未选择的情况下，会剪切一整行。
- **⌘C**：未选择的情况下，会复制一整行。
- **⌥↓ / ⌥↑**：将当前行往上/往下移动。
- **⇧⌥↓ / ⇧⌥↑**：将当前行网上/往下复制。
- **⌘Enter / ⇧⌘Enter**：往上、往下插入一行。
- **⌘← / ⌘→**：跳到行开头/结尾。
- **⌘↑ / ⌘↓**：跳到文件开头/结尾。
- **⌘/**：切换行注释（当前行/选定行）。
- **⇧⌥A**：切换块注释。
- **⌥Z**：切换代码换行。

## 多光标编辑

- **⌘D**：每按一次就会往下多选中一个相同的单词，并在其后插入光标。
![](cmd_d.webp)

- **⌥ + click**：长按 Opt，左键每点击一个地方就会创建一个光标，再点击一次则会取消。
- **⌥⌘↑/↓**：向上、向下增加光标，但注意这个快捷键可能跟网易云音乐全局调整音量的快捷键冲突，需在那边设置中删除。
- **⌘U**：取消上一个增/减光标的动作。
- **⇧⌥I**：在选中的每一行末尾添加光标。

## 选择

- **⌘L**：选择当前行。

## 搜索

- **⌘F**：搜索，如果选择了内容则搜索这些内容。
- **⌥⌘F**：替换。
- **⌘⇧F**：全局搜索。

## 导航

- 点击窗口顶部的搜索框，会出现提示。
![](navigation1.webp)
![](navigation2.webp)

对应的快捷键：
- **⌃G**：跳转到行。
- **⌘P**：跳转到文件。
- **⇧⌘O**：跳转到符号。

## 显示

- **⌘- / ⌘+**：缩放。

## 跳转、返回

- **⌘ + click**：跳转到定义。
- **⌃-**：返回。
- **⌃⇧-**：前进。
- **⇧F12**：显示所有引用。

## 终端

- **⌃\`**：打开、关闭集成终端。
