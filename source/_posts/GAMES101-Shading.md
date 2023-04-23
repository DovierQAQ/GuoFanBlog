---
title: GAMES101笔记 - Shading（着色）
date: 2023-04-22 21:47:15
updated: 2023-04-22 21:47:15
katex: true
cover: 
tags:
    - 图形学
    - GAMES101
    - 着色
categories:
    - 计算机图形学
    - GAMES101
---

## Blinn-Phong Reflectance Model

分为三部分：
- Specular highlights
- Diffuse reflection
- Ambient lighting

$$
\it{L = L_a + L_d + L_s}
$$

定义如下量（都是单位向量）：
- $\mathbf{l}$: shading point指向光源的方向
- $\mathbf{n}$: 法线方向
- $\mathbf{v}$: shading point指向观测点方向

### Diffuse Reflection

- 考虑一个shading point接收到了多少能量，与法线和光照方向的夹角大小（$\mathbf{n · l}$）有关
- 光线能量有衰减：$I' = {I \over r^2}$
- 不同表面吸收不同颜色的光线能力不同：$k_d$ (color)

$$
\it{L_d} = \it{k_d(I/r^2)}max(0, \mathbf{n · l})
$$

### Specular Term

- 出射方向与$\mathbf{v}$接近时更容易观测到高光$\iff$半程向量方向接近于法线方向（半程向量即$\mathbf{l}$和$\mathbf{v}$的角平分线方向）
- 使用半程向量是因为它好算
- 指数$p$是因为$cos\alpha$容忍度太高，会显得高光区域很大，正常情况下用(100,200)范围内的值

$$
\it{L_s} = \it{k_s(I/r^2)}max(0, cos\alpha)^p = \it{k_s(I/r^2)}max(0, \mathbf{n · h})^p
$$

$$
\text{where } \mathbf{h} = bisector(\mathbf{v, l}) = {\mathbf{v+l} \over ||\mathbf{v+l}||}
$$

### Ambient Term

是一个常数，假设物体所有地方有一个常数的颜色，用来保证没有一个地方完全是黑的。

$$
\it{L_a = K_a I_a}
$$

## Shading Frequencies

- flat shading: 每个三角形内部的点用一样的法线
- gouraud shading: 每个顶点有其法线，三角形内部颜色通过插值求出
- Phong shading: 每个像素利用顶点法线插值出其法线

顶点的法线求法是相邻所有面的法线做平均（如果考虑三角形面积，效果会更好）：
$$
\it{N_v}={\sum_i \it{N_i} \over ||\sum_i \it{N_i}||}
$$

使用重心坐标插值出三角形内不同点的法线。

## (Real-time Rendering) Pipeline

{% plantuml %}
@startuml
state Application : Input: vertives in 3D space
state "Vertex Stream" as VS : Vertices positioned in screed space
state "Triangle Stream" as TS : Trangles positioned in screen space
state "Fragment Stream" as FS : Fragments (ont per coverd sample)
state "Shaded Fragments" as SF : Shaded fragments
state Display : Output: image (pixels)

[*] -down-> Application
Application -down-> VS : Vertex Processing
note left on link
    Model, View, Projection transforms
    Shading, Texture mapping
end note
VS -down-> TS : Triangle Processing
TS -down-> FS : Rasterization
note left on link
    Sampling trangle coverage
end note
FS -down-> SF : Fragment Processing
note left on link
    Z-Buffer Visibility Tests
    Shading, Texture mapping
end note
SF -down-> Display : Framebuffer Operations
Display -down-> [*]
@enduml
{% endplantuml %}

### Shader Programs

- 顶点着色器、片段着色器
- 只要写一个顶点或者片段的处理方式就好了
- 对于OpenGL，使用GLSL来描述
- [老师推荐的Shader网站shadertoy](https://www.shadertoy.com/)
- 现在还有其他着色器可以被定义

## Texture Mapping

- 物体表面有不同颜色，反映到公式里面可以是$\it{L_d}$中的$\it{k_d}$在不同点有不同取值
- 物体表面可以展开成平面，放一张图在上面，叫做“纹理” (**texture**)
- 纹理坐标$(u,v)$，$u$和$v$都在$[0,1]$范围内，三角形每一个顶点都对应一个纹理坐标
- tileable map 可以左右无缝衔接
- 使用插值获得三角形内部像素的纹理坐标

## 重心坐标 (Barycentric Coordinates)

为了做三角形内部的插值引入的，需要插值的原因：
- 很多操作是在顶点上完成的
- 三角形内部需要平滑过渡（纹理坐标、颜色、法线）

重心坐标三角形内任意一个点$(x, y)$可以表示成三角形三个顶点的组合：
$$
(x, y) = \alpha A + \beta B + \gamma C \text{ where } \alpha + \beta + \gamma = 1
$$
此时坐标$(\alpha, \beta, \gamma)$即为点$(x, y)$的重心坐标，如果点在三角形内，则$\alpha, \beta, \gamma$均非负。

- 知道$\alpha, \beta$之后可以这样求$\gamma$：$\gamma = 1 - \alpha - \beta$
- 从几何来看，$\alpha$等于$A$点对面的三角形面积与整个三角形面积的比值，$\beta, \gamma$以此类推。
- 三角形重心的重心坐标即为$({1 \over 3}, {1 \over 3}, {1 \over 3})$
- 对于一般的点：
$$
\begin{aligned}
    \alpha = {-(x - x_B)(y_C - y_B) + (y - y_B)(x_C - x_B) \over -(x_A - x_B)(y_C - y_B) + (y_A - y_B)(x_C - x_B)} \\
    \beta = {-(x - x_C)(y_A - y_C) + (y - y_C)(x_A - x_C) \over -(x_B - x_C)(y_A - y_C) + (y_B - y_C)(x_A - x_C)}
\end{aligned}
$$

知道重心坐标$(\alpha, \beta, \gamma)$之后，三角形内各个点属性的插值为：
$$
V = \alpha V_A + \beta V_B + \gamma V_C
$$
但有一个问题：投影变换之后不满足。所以计算三维空间中的三角形，需要用三维坐标来计算插值。

## Applying Texture

对于屏幕上每一个采样点$(x, y)$，我们知道其纹理坐标$(u, v)$，查询纹理贴图，设置为$\it{L_d}$中的$\it{k_d}$。

## Texture Magnification

### 纹理小了

会出现颗粒，做模糊：

- Nearest
- Bilinear
- Bicubic

Bilinear Interpolation:

- 找到临近的四个像素
- 计算其与四个像素的水平与垂直距离
- 使用线性插值函数$lerp(x, v_0, v_1) = v_0 + x(v_1 - v_0)$做两次水平插值，用得到的结果做一次垂直插值，得到插值结果

Bicubic Interpolation:

- 使用周围16个像素做插值

### 纹理大了

会出现摩尔纹，反走样（范围查询）：

- 超采样: 计算量太大
- mipmap: 一个像素点内信号变化过快，我们就用mipmap来降低信号变化频率。近似的范围查询，但只能做正方形的范围查询。

mipmap（图来自维基百科）:

![Wikipedia](https://upload.wikimedia.org/wikipedia/commons/5/5c/MipMap_Example_STS101.jpg)

- 将纹理分辨率缩小一半，生成一个新纹理，反复缩小直到不能缩小。多了${1 \over 3}$的存储空间
- 求像素与其相邻的两个像素（比如上、右）的纹理坐标，看两个像素的纹理坐标之间的距离，取两个距离的较大值$\it{L}$
- 所需要查询的mipmap层数即为$\it{D} = log_2\it{L}$
- 但会发现所查的层数不连续，可以用相邻两层查询到的颜色值做插值，叫做三线性插值 (Trilinear Interpolation)

三线性插值mipmap会出现overblur，使用各向异性过滤 (Anisotropic Filtering) 来解决（图来自维基百科）：
![Wikipedia](https://upload.wikimedia.org/wikipedia/commons/d/dc/MipMap_Example_STS101_Anisotropic.png)
- 可以查询矩形范围，仍然没法解决斜着的矩形区域，总共开销变成了原本的三倍
- 游戏中只要显存足够，各向异性过滤可以开高，几乎不会对运算有影响

其他过滤方法：

- EWA过滤：拆成多次的圆形查询

## Applicatons of Textures

- 环境贴图，会假设环境非常大，光线来自无限远，只存光线的方向
  * Spherical Environment Map
  * Cube Map
- 凹凸贴图/法线贴图 (Bump / Normal mapping)
  * 通过定义凹凸的相对变化，改变法线，从而影响着色
  * 原本的法线$n = (0, 0, 1)$
  * 用相邻两个像素求切线，再将其逆时针旋转90°得到法线：$n' = (-dp/du, -dp/dv, 1).normalized()$
  * 将得到的$n'$转换回世界坐标中
- 位移贴图 (Displacement mapping)
  * 作用于顶点，实际改变几何
  * 要求三角形足够细
  * 可以用动态曲面细分来让模型三角形足够细
- 3D Procedural Noise
  * 定义噪声解析式，用三维空间中的坐标可以求出噪声值
- 用来记录已经算好的信息
  * 环境光遮蔽纹理

------------------------------------------

## 作业3

在这次编程任务中，我们会进一步模拟现代图形技术。我们在代码中添加了 Object Loader(用于加载三维模型), Vertex Shader 与 Fragment Shader，并且支持了纹理映射。

而在本次实验中，你需要完成的任务是:

1. 修改函数 rasterize_triangle(const Triangle& t) in rasterizer.cpp: 在此处实现与作业 2 类似的插值算法，实现法向量、颜色、纹理颜色的插值。
2. 修改函数 get_projection_matrix() in main.cpp: 将你自己在之前的实验中实现的投影矩阵填到此处，此时你可以运行 ./Rasterizer output.png normal来观察法向量实现结果。
3. 修改函数 phong_fragment_shader() in main.cpp: 实现 Blinn-Phong 模型计算 Fragment Color.
4. 修改函数 texture_fragment_shader() in main.cpp: 在实现 Blinn-Phong的基础上，将纹理颜色视为公式中的 kd，实现 Texture Shading Fragment Shader.
5. 修改函数 bump_fragment_shader() in main.cpp: 在实现 Blinn-Phong 的基础上，仔细阅读该函数中的注释，实现 Bump mapping.
6. 修改函数 displacement_fragment_shader() in main.cpp: 在实现 Bump mapping 的基础上，实现 displacement mapping.

### 题解


### 结果



### 提高部分
