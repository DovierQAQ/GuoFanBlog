---
title: GAMES101笔记 - Resterization（光栅化）
date: 2023-04-17 17:07:50
updated: 2023-04-17 17:07:50
katex: true
sticky: 9
cover: assignment1_result.jpg
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

$$
\begin{aligned}
\vec{a} &= (x_a, y_a, z_a)^T \\
\vec{b} &= (x_b, y_b, z_b)^T
\end{aligned}
$$
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
\begin{aligned}
x' = ax + by \\
y' = cx + dy
\end{aligned}
$$
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
$$
$$
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

旋转：
$$
R_x(α)
=
\begin{pmatrix}
    1 & 0 & 0 & 0 \cr
    0 & cosα & -sinα & 0 \cr
    0 & sinα & cosα & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$
$$
R_y(α)
=
\begin{pmatrix}
    cosα & 0 & sinα & 0 \cr
    0 & 1 & 0 & 0 \cr
    -sinα & 0 & cosα & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$
$$
R_z(α)
=
\begin{pmatrix}
    cosα & -sinα & 0 & 0 \cr
    sinα & cosα & 0 & 0 \cr
    0 & 0 & 1 & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$

Rodrigues' Rotation Formula: 
（$\mathbf{n}$为旋转轴）
$$
R(\mathbf{n}, α) = cos(α)\mathbf{I} + (1-cos(α))\mathbf{nn^T} + sin(α)
\underset{\mathbf{N}}{
    \underbrace{
        \begin{pmatrix}
            0 & -n_z & n_y \cr
            n_z & 0 & -n_x \cr
            -n_y & n_x & 0
        \end{pmatrix}
    }
}
$$

### 四元数

为了解决旋转与旋转之间的插值而引入的。

----------------------------

## 观测变换（Viewing Transformation）

- model transformation
- view transformation
- projection transformation

### 视图变换（View / Camera Transformation）

定义相机：
- Position: $\vec{e}$
- Look-at / gaze direction: $\hat{g}$
- Up direction: $\hat{t}$

实际上是将相机放在原点，朝$-z$方向看（右手系），向上方向是$y$，将其他所有物体移动到相机的相对位置然后渲染。将移动和旋转分为两个矩阵来写，注意先移动后旋转：$M_{view} = R_{view} T_{view}$
- 移动到原点：
$$
T_{view} = 
\begin{pmatrix}
    1 & 0 & 0 & -x_e \cr
    0 & 1 & 0 & -y_e \cr
    0 & 0 & 1 & -z_e \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$
- 将$\hat{g}$旋转到$-Z$，$\hat{t}$旋转到$Y$，$(\hat{g}×\hat{t})$旋转到$X$。可是直接写该旋转矩阵有些困难，所以先写出其逆矩阵，也就是将$X$旋转到$(\hat{g}×\hat{t})$，其他轴同理。
$$
R^{-1}_{view} = 
\begin{pmatrix}
    x_{\hat{g}×\hat{t}} & x_t & x_{-g} & 0 \cr
    y_{\hat{g}×\hat{t}} & y_t & y_{-g} & 0 \cr
    z_{\hat{g}×\hat{t}} & z_t & z_{-g} & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
⇒
R_{view} = 
\begin{pmatrix}
    x_{\hat{g}×\hat{t}} & y_{\hat{g}×\hat{t}} & z_{\hat{g}×\hat{t}} & 0 \cr
    x_t & y_t & y_t& 0 \cr
    x_{-g} & y_{-g} & z_{-g} & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$
（正交矩阵符合公式$A^{-1}=A^T$）

### 投影变换（Projection transformation）

正交投影（定义一个立方体$[l, r]×[b, t]×[f, n]$，将其中心平移到原点，再三轴缩放到$[-1, 1]$）：
$$
M_{ortho} = 
\begin{pmatrix}
    {2 \over r-l} & 0 & 0 & 0 \cr
    0 & {2 \over t-b} & 0 & 0 \cr
    0 & 0 & {2 \over n-f} & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
    1 & 0 & 0 & -{r+l \over 2} \cr
    0 & 1 & 0 & -{t+b \over 2} \cr
    0 & 0 & 1 & -{n+f \over 2} \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$

透视投影（近平面比远平面小，所以把远平面挤压到跟近平面一样大就可以使用正交投影了）：
（使用相似三角形推导，推导略）
$$
M_{persp} = M_{ortho}M_{persp→ortho} = M_{ortho}
\begin{pmatrix}
    n & 0 & 0 & 0 \cr
    0 & n & 0 & 0 \cr
    0 & 0 & n+f & -nf \cr
    0 & 0 & 1 & 0
\end{pmatrix}
$$

使用field-of-view(fovY)和宽高比(aspect ratio)来定义一个视锥。

### Viewport transform matrix
用来将$[-1, 1]$范围内的内容拉伸到宽为width，高为height的显示区域内。
$$
M_{viewport} = 
\begin{pmatrix}
    {width \over 2} & 0 & 0 & {width \over 2} \cr
    0 & {height \over 2} & 0 & {height \over 2} \cr
    0 & 0 & 1 & 0 \cr
    0 & 0 & 0 & 1
\end{pmatrix}
$$

## 光栅化

- 像素是一个个小方块，左下角坐标为$(0, 0)$，像素点中心坐标为$(x+0.5, y+0.5)$
- 通过采样获得像素点颜色
- 使用叉乘来判断是否像素点中心在三角形内部
- 只有在三角形包围盒内的像素才需要判断是否在三角形内

----------------------------

## 作业0

1. 配置环境
2. 给定一个点 P=(2,1), 将该点绕原点先逆时针旋转 45◦，再平移 (1,2), 计算出变换后点的坐标（要求用齐次坐标进行计算）。

### 配置环境

安装C++编译环境：
`sudo apt-get install build-essential gdb make git`

安装cmake: 
`sudo apt-get install cmake`

我使用Ubuntu-22.04来编译运行代码框架，所给的代码框架使用了eigen库，故安装该库：
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

## 作业1
本次作业的任务是填写一个旋转矩阵和一个透视投影矩阵。给定三维下三个点 v0(2.0, 0.0, −2.0), v1(0.0, 2.0, −2.0), v2(−2.0, 0.0, −2.0), 你需要将这三个点的坐标变换为屏幕坐标并在屏幕上绘制出对应的线框三角形 (在代码框架中，我们已经提供了 draw_triangle 函数，所以你只需要去构建变换矩阵即可)。

### 环境配置

安装opencv：
`sudo apt-get install libopencv-dev python3-opencv`

### 题解

`get_model_matrix`只有一个`float`类型的旋转角度参数，所以只需返回一个关于$z$轴旋转的旋转矩阵即可：
```C++
Eigen::Matrix4f get_model_matrix(float rotation_angle)
{
    Eigen::Matrix4f model = Eigen::Matrix4f::Identity();

    // TODO: Implement this function
    // Create the model matrix for rotating the triangle around the Z axis.
    // Then return it.
    float cos_angle = std::cos(rotation_angle * MY_PI / 180.0);
    float sin_angle = std::sin(rotation_angle * MY_PI / 180.0);
    Eigen::Matrix4f rotation;
    rotation << cos_angle,  -sin_angle, 0,  0,
                sin_angle,  cos_angle,  0,  0,
                0,          0,          1,  0,
                0,          0,          0,  1;

    return rotation * model;
}
```

`get_projection_matrix`给了视角、宽高比以及远近平面的$z$坐标，我们可以用虎书中给的矩阵：
$$
M_{proj} = 
\begin{pmatrix}
    -{1 \over [ktan({α \over 2})]} & 0 & 0 & 0 \cr
    0 & -{1 \over tan({α \over 2})} & 0 & 0 \cr
    0 & 0 & {n+f \over n-f} & {2nf \over n-f} \cr
    0 & 0 & 1 & 0
\end{pmatrix}
$$
不过我这里想跟着老师的推导思路，将视锥先挤压成矩形，然后利用正交投影：
```C++
Eigen::Matrix4f get_projection_matrix(float eye_fov, float aspect_ratio,
                                      float zNear, float zFar)
{
    // Students will implement this function

    Eigen::Matrix4f projection = Eigen::Matrix4f::Identity();

    // TODO: Implement this function
    // Create the projection matrix for the given parameters.
    // Then return it.
    // [l, r]×[b, t]×[f, n]
    float angle = eye_fov * MY_PI / 180.0;
    float t = std::tan(angle / 2.0) * (-zNear);
    float b = -t;
    float r = t * aspect_ratio;
    float l = -r;

    Eigen::Matrix4f M_ortho_move, M_ortho_scale;
    M_ortho_move << 1,  0,  0,  -(r+l)/2.0,
                    0,  1,  0,  -(t+b)/2.0,
                    0,  0,  1,  -(zNear+zFar)/2.0,
                    0,  0,  0,  1;
    M_ortho_scale <<2.0/(r-l),  0,          0,                  0,
                    0,          2.0/(t-b),  0,                  0,
                    0,          0,          2.0/(zNear-zFar),   0,
                    0,          0,          0,                  1;
    Eigen::Matrix4f M_persp2ortho;
    M_persp2ortho <<zNear,  0,      0,          0,
                    0,      zNear,  0,          0,
                    0,      0,      zNear+zFar, -zNear*zFar,
                    0,      0,      1,          0;

    return M_ortho_move * M_ortho_scale * M_persp2ortho * projection;
}
```

### 结果

![](assignment1_result.jpg)

按下A或者D键会分别左右旋转一定角度。
