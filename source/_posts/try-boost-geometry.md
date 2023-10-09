---
title: Boost C++ Libraries学习 - Geometry
date: 2023-09-20 09:45:26
updated: 2023-09-20 09:45:26
cover: query_test_1.webp
tags:
  - C++
  - Boost
  - Geometry
categories:
  - 经验总结
---

参考 [Boost 官方手册](https://www.boost.org/doc/libs/1_83_0/libs/geometry/doc/html/index.html)

> Boost.Geometry contains a dimension-agnostic, coordinate-system-agnostic and scalable kernel, based on concepts, meta-function and tag dispatching. On top of that kernel, algorithms are built: area, length, perimeter, centroid, convex hull, intersection (clipping), within (point in polygon), distance, envelope (bounding box), simplify, transform, and much more. The library supports high precision arithmetic numbers, such as ttmath.

## 设计原理

Boost 库作为 C++ 中非常常用的库，学习其中的设计原理是对自身的设计能力提高非常有用的。

### 计算距离的例子

看一个使用自定义点结构计算两点之间的距离的例子，最简单的实现方式如下：

```C++
struct mypoint {
  double x, y;
};

double distance(mypoint const& a, mypoint const& b) {
  double dx = a.x - b.x;
  double dy = a.y - b.y;
  return sqrt(dx * dx + dy * dy);
}
```

计算距离这个需求其实是通用的，如果从库开发者的角度来说，这段代码有如下的问题：

1. 应该支持任意的“点”概念的结构或类。
2. 应该不局限于二维。
3. 应该不局限于笛卡尔坐标系（Cartesian coordinate system）。
4. 距离概念不止存在于两个点之间，传入任意几何图形的组合也应能计算距离。
5. `double`的精度有时不够。
6. 计算平方根代价相对较大，而且如果是距离比较，绝对的距离不是很重要。

详细修改步骤在[这里](https://www.boost.org/doc/libs/1_83_0/libs/geometry/doc/html/geometry/design.html)

解决以上问题的方法：
1. 使用模板，就可以支持其他“点”了。
2. 使用 Traits 扩展为维度无关以及坐标类型无关。
3. 使用 Traits 扩展不同坐标系。
4. 不同几何之间计算距离，使用 tag dispatching 技术。

## 使用Boost.Geometry

### 安装

MacOS 下，使用 homebrew 安装：`brew install boost`

建立 CMake 工程，并在 CMakeLists.txt 文件中加入以下内容：
```CMake
find_package(Boost COMPONENTS system filesystem REQUIRED)
find_package(Boost COMPONENTS thread REQUIRED)
if(NOT Boost_FOUND)
    message(FATAL_ERROR "Could not find boost!")
endif()
include_directories(${Boost_INCLUDE_DIRS})
```

### 使用

```C++
#include <boost/geometry.hpp>
#include <iostream>

int main(int, char **) {
  boost::geometry::model::d2::point_xy<int> p1(1, 1), p2(2, 2);

  std::cout << "Distance p1-p2 is: " << boost::geometry::distance(p1, p2)
            << std::endl;

  return 0;
}
```

## 空间索引（R-Tree）

目前来说，Boost.Geometry 库唯一实现的数据结构是 R-Tree。

{% note warning flat %}
TODO: R-Tree 可视化
{% endnote %}

### 元素操作

R-Tree 类长这样：
```C++
rtree<Value,
      Parameters,
      IndexableGetter = index::indexable<Value>,
      EqualTo = index::equal_to<Value>,
      Allocator = std::allocator<Value> >
```

其中：
- Value: 被存储在容器中的数据类型。
- Parameters: 参数类型，指明使用的插入/划分算法。
- IndexableGetter: 函数对象，让 R-Tree 能够理解如何将 Value 转换成 Indexable 对象。
- EqualTo: 用来比较 Value 的函数对象。
- Allocator: 创建节点时的申请内存方法。

Indexable 对象是符合 Point, Box 或者 Segment 观念的几何对象。
Value 也可以是 pair 或者 tuple，但需要把 Indexable 对象放在这些数据的第一个。

支持三种算法：
- Linear: `index::rtree< Value, index::linear<16> > rt;`
- Quadratic: `index::rtree< Value, index::quadratic<16> > rt;`
- R\*-tree: `index::rtree< Value, index::rstar<16> > rt;`

想要将算法参数在运行时传入 R-Tree，使用下面的写法：
```C++
index::rtree<Value, index::dynamic_linear> rt(index::dynamic_linear(16));
index::rtree<Value, index::dynamic_quadratic> rt(index::dynamic_quadratic(16));
index::rtree<Value, index::dynamic_rstar> rt(index::dynamic_rstar(16));
```

可以使用 R-Tree 中的方法来插入、删除，也可以使用 index:: 中的函数插入、删除。可以插入、删除一个元素，也可以范围操作，具体参考[这里](https://www.boost.org/doc/libs/1_83_0/libs/geometry/doc/html/geometry/spatial_indexes/creation_and_modification.html)。

### 查询

查询结果要符合一些谓词（predicates）描述，有三种谓词：
- 空间谓词（spatial predicates）
- 距离谓词（distance predicates）
- 自定义谓词（user-defined unary predicate）

查询的写法如下：
```C++
std::vector<Value> returned_values;
Box box_region(...);
rt.query(bgi::intersects(box_region), std::back_inserter(returned_values));
```

由于查询结果一般是用来遍历的，有一种方便的写法（使用`|`）：
```C++
Box box_region(...);
BOOST_FOREACH(Value & v, rt | bgi::adaptors::queried(bgi::intersects(box_region)))
  ; // do something with v
```

### 空间查询

不同谓词的效果如下：
|   intersects(Box)   | covered_by(Box) |   disjoint(Box)   |   overlaps(Box)   |    within(Box)    |
| :-----------------: | :-------------: | :---------------: | :---------------: | :---------------: |
| ![](intersects.png) | ![](within.png) | ![](disjoint.png) | ![](overlaps.png) | ![](within-1.png) |

|     intersects(Segment)     |         intersects(Box)          |         disjoint(Box)          |          intersects(Box)          |          disjoint(Box)          |
| :-------------------------: | :------------------------------: | :----------------------------: | :-------------------------------: | :-----------------------------: |
| ![](intersects_segment.png) | ![](rtree_pt_intersects_box.png) | ![](rtree_pt_disjoint_box.png) | ![](rtree_seg_intersects_box.png) | ![](rtree_seg_disjoint_box.png) |

使用如下代码：
```C++
#include <boost/foreach.hpp>
#include <boost/geometry.hpp>
#include <boost/geometry/geometries/box.hpp>
#include <boost/geometry/geometries/point.hpp>
#include <boost/geometry/index/rtree.hpp>
#include <iostream>
#include <string>
#include <vector>

namespace bg = boost::geometry;
namespace bgi = boost::geometry::index;

typedef bg::model::point<float, 2, bg::cs::cartesian> point;
typedef bg::model::box<point> box;
typedef std::pair<box, unsigned> value;

template <typename T>
void outputQueryResult(const std::string &method, const T &obj,
                       const std::vector<value> &result) {
  std::cout << "---" << std::endl;
  std::cout << "query object:" << std::endl;
  std::cout << bg::wkt<T>(obj) << std::endl;
  std::cout << method << " query result:" << std::endl;
  BOOST_FOREACH (value const &v, result)
    std::cout << bg::wkt<box>(v.first) << " - " << v.second << std::endl;
}

int main(int, char **) {
  bgi::rtree<value, bgi::quadratic<16>> rtree;
  std::vector<value> original_boxes;
  box query_box(point(2.4, 2.4), point(5, 5));
  point query_point(0, 0);

  std::vector<value> result;

  for (unsigned i = 0; i < 10; ++i) {
    box b(point(i + 0.0f, i + 0.0f), point(i + 0.5f, i + 0.5f));
    value v = std::make_pair(b, i);
    rtree.insert(v);
    original_boxes.push_back(v);
  }

  outputQueryResult("original", query_point, original_boxes);

  result.clear();
  rtree.query(bgi::covered_by(query_box), std::back_inserter(result));
  outputQueryResult("covered_by", query_box, result);

  result.clear();
  rtree.query(bgi::covers(query_box), std::back_inserter(result));
  outputQueryResult("covers", query_box, result);

  result.clear();
  rtree.query(bgi::disjoint(query_box), std::back_inserter(result));
  outputQueryResult("disjoint", query_box, result);

  result.clear();
  rtree.query(bgi::intersects(query_box), std::back_inserter(result));
  outputQueryResult("intersects", query_box, result);

  result.clear();
  rtree.query(bgi::overlaps(query_box), std::back_inserter(result));
  outputQueryResult("overlaps", query_box, result);

  result.clear();
  rtree.query(bgi::within(query_box), std::back_inserter(result));
  outputQueryResult("within", query_box, result);

  result.clear();
  rtree.query(bgi::nearest(query_point, 3), std::back_inserter(result));
  outputQueryResult("knn", query_point, result);

  return 0;
}
```

得到输出：
```shell
---
query object:
POINT(0 0)
original query result:
POLYGON((0 0,0 0.5,0.5 0.5,0.5 0,0 0)) - 0
POLYGON((1 1,1 1.5,1.5 1.5,1.5 1,1 1)) - 1
POLYGON((2 2,2 2.5,2.5 2.5,2.5 2,2 2)) - 2
POLYGON((3 3,3 3.5,3.5 3.5,3.5 3,3 3)) - 3
POLYGON((4 4,4 4.5,4.5 4.5,4.5 4,4 4)) - 4
POLYGON((5 5,5 5.5,5.5 5.5,5.5 5,5 5)) - 5
POLYGON((6 6,6 6.5,6.5 6.5,6.5 6,6 6)) - 6
POLYGON((7 7,7 7.5,7.5 7.5,7.5 7,7 7)) - 7
POLYGON((8 8,8 8.5,8.5 8.5,8.5 8,8 8)) - 8
POLYGON((9 9,9 9.5,9.5 9.5,9.5 9,9 9)) - 9
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
covered_by query result:
POLYGON((3 3,3 3.5,3.5 3.5,3.5 3,3 3)) - 3
POLYGON((4 4,4 4.5,4.5 4.5,4.5 4,4 4)) - 4
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
covers query result:
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
disjoint query result:
POLYGON((0 0,0 0.5,0.5 0.5,0.5 0,0 0)) - 0
POLYGON((1 1,1 1.5,1.5 1.5,1.5 1,1 1)) - 1
POLYGON((6 6,6 6.5,6.5 6.5,6.5 6,6 6)) - 6
POLYGON((7 7,7 7.5,7.5 7.5,7.5 7,7 7)) - 7
POLYGON((8 8,8 8.5,8.5 8.5,8.5 8,8 8)) - 8
POLYGON((9 9,9 9.5,9.5 9.5,9.5 9,9 9)) - 9
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
intersects query result:
POLYGON((2 2,2 2.5,2.5 2.5,2.5 2,2 2)) - 2
POLYGON((3 3,3 3.5,3.5 3.5,3.5 3,3 3)) - 3
POLYGON((4 4,4 4.5,4.5 4.5,4.5 4,4 4)) - 4
POLYGON((5 5,5 5.5,5.5 5.5,5.5 5,5 5)) - 5
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
overlaps query result:
POLYGON((2 2,2 2.5,2.5 2.5,2.5 2,2 2)) - 2
---
query object:
POLYGON((2.4 2.4,2.4 5,5 5,5 2.4,2.4 2.4))
within query result:
POLYGON((3 3,3 3.5,3.5 3.5,3.5 3,3 3)) - 3
POLYGON((4 4,4 4.5,4.5 4.5,4.5 4,4 4)) - 4
---
query object:
POINT(0 0)
knn query result:
POLYGON((2 2,2 2.5,2.5 2.5,2.5 2,2 2)) - 2
POLYGON((1 1,1 1.5,1.5 1.5,1.5 1,1 1)) - 1
POLYGON((0 0,0 0.5,0.5 0.5,0.5 0,0 0)) - 0
```

可视化：
![](query_test_1.webp)

调小查询矩形后的可视化结果：
![](query_test_2.webp)

附上可视化使用的 python 代码：
```python
# -*- coding: utf-8 -*-
# author: GuoFan
# time: 2023-9-21

import matplotlib.pyplot as plt
import re

names = ["covered_by", "covers", "disjoint", "intersect", "overlaps", "within"]


def drawPolygons(polygons, color, ax):
    for polygon in polygons:
        print(polygon)
        ax.add_patch(plt.Polygon(xy=polygon, edgecolor=color, fill=False))

    plt.autoscale(True)


def extractPolygon(line):
    result = []
    m = re.match(r"POLYGON\(\((.+)\)\)", line)
    if m:
        coords = m.group(1)
        coord_list = coords.split(",")
        for coord in coord_list:
            xy = coord.split(" ")
            result.append([float(xy[0]), float(xy[1])])

    return result


def main():
    with open("query.txt", "r") as f:
        data = f.read()

    tests_polygons = []

    tests = data.split("---")
    for test in tests:
        lines = test.split("\n")
        polygons = []
        for line in lines:
            polygon = extractPolygon(line)
            if len(polygon) > 0:
                polygons.append(polygon)
        if len(polygons) > 0:
            tests_polygons.append(polygons)

    fig = plt.figure()

    for i in range(6):
        ax = fig.add_subplot(231 + i)
        ax.set_title(names[i])
        drawPolygons(tests_polygons[0], "lightblue", ax)
        drawPolygons(tests_polygons[i + 1], "pink", ax)

    plt.savefig("query.png")
    plt.show()


if __name__ == "__main__":
    main()

```

如果要使用自定义的谓词，用下面的写法：
```C++
rt.query(index::intersects(box) && index::satisfies([](Value const& v) { return v.is_red(); }),
         std::back_inserter(result));
```

## 参考手册

[目录](https://www.boost.org/doc/libs/1_83_0/libs/geometry/doc/html/geometry/reference.html)
