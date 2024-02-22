---
title: Boost C++ Libraries学习 - Boost.Polygon (GTL)
date: 2024-02-21 11:00:09
updated: 2024-02-21 11:00:09
cover: layout.webp
tags: 
  - C++
  - Boost
categories:
  - 经验总结
---


{% note info flat %}
**系列文章**
{% post_link computational-geometry-algorithms-and-applications %}
{% post_link computational-geometry-algorithms-and-applications-1 %}
**番外篇**
{% post_link computational-geometry-libraries %}
{% post_link try-boost-geometry %}
-> {% post_link try-boost-polygon %}
{% endnote %}

参考 [Boost 官方手册](https://www.boost.org/doc/libs/1_84_0/libs/polygon/doc/index.htm)

> The Boost.Polygon library provides algorithms focused on manipulating planar polygon geometry data.  Specific algorithms provided are the polygon set operations (intersection, union, difference, disjoint-union) and related algorithms such as polygon connectivity graph extraction, offsetting and map-overlay.  An example of the disjoint-union (XOR) of figure a and figure b is shown below in figure c.  These so-called Boolean algorithms are of significant interest in GIS (Geospatial Information Systems), VLSI CAD as well all other fields of CAD, and many more application areas, and providing them is the primary focus of this library.

使用 vscode 插件 Graphical Debugging 来可视化调试。具体见{% post_link computational-geometry-libraries %}。

## 布尔运算

使用教程中的例子：[Boost 官方教程](https://www.boost.org/doc/libs/1_84_0/libs/polygon/doc/gtl_tutorial.htm)

`nand.layout`对应的几何图形如图：

<img src="layout.webp" height="300px"/>

查看读入的`layout_database`，是一个从`std::string`类型到`gtl::polygon_90_set_data<int>`类型的`std::map`，有这些成员：

<img src="layout-elements.webp" height="150px"/>

分别是如下形状：

- GATE: {% inlineImg gate.webp 150px %} 
- METAL1: {% inlineImg metal1.webp 150px %} 
- NDIFF: {% inlineImg ndiff.webp 50px %} 
- NWELL: {% inlineImg nwell.webp 60px %} 
- PDIFF {% inlineImg pdiff.webp 50px %} 
- POLY: {% inlineImg poly.webp 150px %} 
- VIA0: {% inlineImg via0.webp 150px %}

我们把 POLY 和 METAL1 层拿出来做研究，忽略它们的层次信息，单纯为了实验两组多边形的布尔运算。考虑如下代码：

```C++
auto bloat_metal1 = layout["METAL1"] + 1;
auto and_result = bloat_metal1 & layout["POLY"];
auto xor_result = and_result ^ layout["METAL1"];
auto not_result = bloat_metal1 - xor_result;
auto or_result = not_result | layout["POLY"];
```

首先，如下图中，POLY 层用红色表示，METAL1 层用绿色表示。

<img src="poly-metal1.webp" height="300px"/>

执行`auto bloat_metal1 = layout["METAL1"] + 1;`，该语句的作用是将 METAL1 层对应的 polygon set 膨胀一个单位（如果`+`作用的对象不是整数，而是几何性质的对象，则为布尔运算`or`），效果如下图蓝色区域：

<img src="bloat.webp" height="300px"/>

执行`auto and_result = bloat_metal1 & layout["POLY"];`，该语句的作用是用膨胀后的 polygon set 跟 POLY 层做布尔`and`运算，得到它们的公共区域，效果如下图黄色区域：

<img src="and.webp" height="300px"/>

执行`auto xor_result = and_result ^ layout["METAL1"];`，该语句的作用是把刚才求得的公共区域跟 METAL1 层做布尔`xor`运算，得到它们互异的区域，效果如下图青色区域：

<img src="xor.webp" height="300px"/>

执行`auto not_result = bloat_metal1 - xor_result;`，该语句的作用是以 METAL1 膨胀后的多边形为基准，去掉 xor_result 与之重叠的部分，效果如下图紫色区域：

<img src="not.webp" height="300px"/>

执行`auto or_result = not_result | layout["POLY"];`，该语句的作用是将刚才剪出来的结果根 POLY 层做布尔`or`运算，得到它们的并集，效果如下图橙色区域：

<img src="or.webp" height="300px"/>

将最终结果单独拿出来观察：

<img src="boolean-result.webp" height="300px"/>

引用官方例子 [Property Merge Usage](https://www.boost.org/doc/libs/1_84_0/libs/polygon/doc/gtl_property_merge_usage.htm) 中的注释可以知道，我们这种布尔运算的组合其实到最后才会计算一次。

```C++
//Notice that we have to do O(2^n) booleans to compose the same
//result that is produced in one pass of property merge
//given n input layers (8 = 2^3 in this example)
```

中间产生的运算结果不会直接成为 polygon set，而是 polygon set view。从下图可知，`xor_result`是由两个 polygon set 做`BinaryAnd`，再跟另一个 polygon set 做`BinaryXor`。

<img src="xor-result-type.webp" height="100px"/>

## 获得 set 中的几何图形

前面的实验中，我们可以看到在多边形的孔洞周围会有一些不自然的切割线条，再来看如下例子：

<img src="boolean-result-with-holes.webp" height="300px"/>

这是`polygon_data`和`polygon_with_holes_data`的区别。

使用如下代码来将 polygon set 中的数据变成不同的几何表示：

```C++
gtl::polygon_90_set_data<int> or_polyset(or_result);  // 将布尔运算的最终结果转换为 polygon set

std::vector<gtl::polygon_with_holes_data<int>> or_polygons_with_holes;
std::vector<gtl::polygon_data<int>> or_polygons;
std::vector<gtl::rectangle_data<int>> or_rects_vertical;
std::vector<gtl::rectangle_data<int>> or_rects_horizontal;
std::vector<gtl::rectangle_data<int>> or_rects_max;
or_polyset.get(or_polygons_with_holes);                           // 获得带孔洞的多边形
or_polyset.get(or_polygons);                                      // 获得不带孔洞的多边形，孔洞处会有切割
or_polyset.get_rectangles(or_rects_vertical, gtl::VERTICAL);      // 获得垂直方向的矩形
or_polyset.get_rectangles(or_rects_horizontal, gtl::HORIZONTAL);  // 获得水平方向的矩形
gtl::get_max_rectangles(or_rects_max, or_polyset);                // 获得最大矩形
```

{% gallery %}
![](boolean-result-with-holes.webp)
![](boolean-result.webp)
![](rects-vertical.webp)
![](rects-horizontal.webp)
![](rects-max.webp)
{% endgallery %}
