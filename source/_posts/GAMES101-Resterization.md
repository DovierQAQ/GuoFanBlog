---
title: GAMES101笔记 - Resterization（光栅化）
date: 2023-04-17 17:07:50
updated: 2023-04-17 17:07:50
katex: true
sticky: 9
cover: 
tags:
    - 图形学
    - GAMES101
    - 光栅化
categories:
    - 计算机图形学
    - GAMES101
---

20年的时候，好朋友推荐了这个课程给我，简直是神仙课程！当时每天下班后就再花一个多小时来听一节课，陆陆续续听完了。最近打算重温一下这系列课程，顺便补上笔记。

GAMES101总共分为四篇，这篇是第一篇“光栅化”。（特别期待后续的光追篇）

----------------------------

## 线代知识点回顾

### 向量

$$\vec{a} = (x_a, y_a, z_a)^T \\
\vec{b} = (x_b, y_b, z_b)^T$$
- 点乘：$\vec{a}·\vec{b} = |\vec{a}||\vec{b}|cosθ = x_a x_b + y_a y_b + z_a z_b$
- 叉乘：$\vec{a}×\vec{b} = (y_a z_b - y_b z_a, z_a x_b - x_a z_b, x_a y_b - y_a x_b)^T$
  $|\vec{a}×\vec{b}| = |\vec{a}||\vec{b}|sinθ$，方向垂直于$\vec{a}$和$\vec{b}$所在的平面，符合右手螺旋定则

点乘作用：

- 得到两个向量之间的夹角，特别是两个单位向量
- 找到一个向量对另一个向量的投影
- 符号表示“前”与“后”的信息
- 大小表示两个向量有多“接近”

叉乘作用：

- 判断点是否在三角形内（点P同时在三条边左边或右边）
- 获得坐标系

### 矩阵

- $M×N$的矩阵只能和$N×P$的矩阵相乘
- 矩阵相乘$AB=C$，其中$C$的$i$行$j$列元素是$A$的第$i$个行向量和$B$的第$j$个列向量点乘的值
- $AB = BA$通常不成立
- $(AB)^T = B^T A^T$（穿脱原则）
- $AA^{-1} = I$（矩阵的逆）
- $\vec{a}·\vec{b} = \vec{a}^T\vec{b}$
- $\vec{a}×\vec{b} = A^*\vec{b}$

### 变换

缩放：
$$
\begin{pmatrix}
    x' \cr
    y'
\end{pmatrix}
=
\begin{pmatrix}
    s_x & 0 \cr
    0 & s_y
\end{pmatrix}
\begin{pmatrix}
    x \cr
    y
\end{pmatrix}
$$
$x$轴以$s_x$比例缩放，$y$轴以$s_y$比例缩放。$s_x$和$s_y$可以取负数，图像会翻转。

切变：
$$
\begin{pmatrix}
    x' \cr
    y'
\end{pmatrix}
=
\begin{pmatrix}
    1 & a \cr
    0 & 1
\end{pmatrix}
\begin{pmatrix}
    x \cr
    y
\end{pmatrix}
$$

旋转（默认逆时针旋转）：
$$
\begin{pmatrix}
    x' \cr
    y'
\end{pmatrix}
=
\begin{pmatrix}
    cosθ & -sinθ \cr
    sinθ & cosθ
\end{pmatrix}
\begin{pmatrix}
    x \cr
    y
\end{pmatrix}
$$

线性变换
$$
x' = ax + by \\
y' = cx + dy \\
\begin{pmatrix}
    x' \cr
    y'
\end{pmatrix}
=
\begin{pmatrix}
    a & b \cr
    c & d
\end{pmatrix}
\begin{pmatrix}
    x \cr
    y
\end{pmatrix} \\
x' = Mx
$$

### 齐次坐标

平移变换：
$$
\begin{pmatrix}
    x' \cr
    y'
\end{pmatrix}
=
\begin{pmatrix}
    a & b \cr
    c & d
\end{pmatrix}
\begin{pmatrix}
    x \cr
    y
\end{pmatrix}
+
\begin{pmatrix}
    t_x \cr
    t_y
\end{pmatrix}
$$
与上面的$x' = Mx$形式不一样了，导致平移变换变得需要特殊处理，所以引入齐次坐标。

齐次坐标下：
二维的点：$(x, y, 1)^T$
二维向量：$(x, y, 0)^T$

平移变换变成了：
$$
\begin{pmatrix}
    x' \cr
    y' \cr
    w'
\end{pmatrix}
=
\begin{pmatrix}
    1 & 0 & t_x \cr
    0 & 1 & t_y \cr
    0 & 0 & 1
\end{pmatrix}
·
\begin{pmatrix}
    x \cr
    y \cr
    1
\end{pmatrix}
=
\begin{pmatrix}
    x + t_x \cr
    y + t_y \cr
    1
\end{pmatrix}
$$
回到了$x' = Mx$的形式。

向量的齐次坐标为$0$，是因为向量具有平移不变性：
$$
\begin{pmatrix}
    x' \cr
    y' \cr
    w'
\end{pmatrix}
=
\begin{pmatrix}
    1 & 0 & t_x \cr
    0 & 1 & t_y \cr
    0 & 0 & 1
\end{pmatrix}
·
\begin{pmatrix}
    x \cr
    y \cr
    0
\end{pmatrix}
=
\begin{pmatrix}
    x \cr
    y \cr
    0
\end{pmatrix}
$$

齐次坐标下，以下有意义的运算天然成立：
向量 + 向量 = 向量
点 - 点 = 向量
点 + 向量 = 点

而对于点+点，我们定义：
$$
\begin{pmatrix}
    x \cr
    y \cr
    w
\end{pmatrix}
\iff
\begin{pmatrix}
    x/w \cr
    y/w \cr
    1
\end{pmatrix}
, (w ≠ 0)
$$
这个定义下，点+点变成了两个点的中点。

有了齐次坐标，我们所有的变换都可以写为如下的仿射变换了：
$$
\begin{pmatrix}
    x' \cr
    y' \cr
    1
\end{pmatrix}
=
\begin{pmatrix}
    a & b & t_x \cr
    c & d & t_y \cr
    0 & 0 & 1
\end{pmatrix}
·
\begin{pmatrix}
    x \cr
    y \cr
    1
\end{pmatrix}
$$

### 变换组合

- 逆变换：$x = M^{-1}Mx$
- 不以原点为中心旋转：组合平移和旋转
- 变换的顺序很重要
- 先线性变换，再平移

### 三维变换
$$
\begin{pmatrix}
    x' \cr
    y' \cr
    z' \cr
    1
\end{pmatrix}
=
\begin{pmatrix}
    a & b & c & t_x \cr
    d & e & f & t_y \cr
    g & h & i & t_z \cr
    0 & 0 & 0 & 1
\end{pmatrix}
·
\begin{pmatrix}
    x \cr
    y \cr
    z \cr
    1
\end{pmatrix}
$$

## 作业0

### 作业内容：

1. 配置环境
2. 给定一个点 P=(2,1), 将该点绕原点先逆时针旋转 45◦，再平移 (1,2), 计算出变换后点的坐标（要求用齐次坐标进行计算）。

### 配置环境

我使用WSL2-Kali来编译运行代码框架，所给的代码框架使用了eigen库，故安装该库：
`sudo apt install libeigen3-dev`

### 题解

添加代码：
```C++
std::cout << "\nAssignment 0: " << std::endl;
Eigen::Vector3f p(2.0f, 1.0f, 1.0f);
Eigen::Matrix3f rotate, move;
float cos45 = std::cos(45.0/180.0*acos(-1));
float sin45 = std::sin(45.0/180.0*acos(-1));
rotate <<   cos45,  -sin45, 0.0, 
            sin45,  cos45,  0.0,
            0.0,    0.0,    1.0;
move << 1.0, 0.0, 1.0, 
        0.0, 1.0, 2.0, 
        0.0, 0.0, 1.0;
std::cout << move * rotate * p << std::endl;
```

### 结果

获得输出：
```
Assignment 0:
1.70711
4.12132
      1
```

----------------------------

