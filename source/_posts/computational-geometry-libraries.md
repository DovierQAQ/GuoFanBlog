---
title: 计算几何 - C++ 库的调研
date: 2023-09-28 11:22:40
updated: 2023-09-28 11:22:40
cover: graphical_debugging.webp
tags:
  - Geometry
  - C++
categories:
  - 经验总结
---

{% note info flat %}
**系列文章**
{% post_link computational-geometry-algorithms-and-applications %}
{% post_link computational-geometry-algorithms-and-applications-1 %}
**番外篇**
-> {% post_link computational-geometry-libraries %}
{% post_link try-boost-geometry %}
{% post_link try-boost-polygon %}
{% endnote %}

## Boost.Geometry

- [官方网站](https://www.boost.org/doc/libs/1_83_0/libs/geometry/doc/html/index.html)

学习笔记：{% post_link try-boost-geometry %}

### License

> Distributed under the `Boost Software License, Version 1.0`.

### 特点

- 易于使用，资料多、文档齐全。
- 常见的几何操作都有，但更小众的需求可能不如 CGAL。

### 可视化调试

vscode 插件：Graphical Debugging

使用方法：在 Debug 界面会有 GRAPHICAL WATCH 栏（图中左下角），在里面点击“+”号，输入变量名即可，效果如下：

![](graphical_debugging.webp)

但由于 GDB 和 LLDB 不会输出变量的原始类型（例如使用了`typedef`关键字来定义类型名），所以需要告诉插件某个类型应该如何展示。方式就是在当前调试的项目根目录下建立`*.json`，文件名可以随意，然后填入如下格式的内容：

```json
{
  "name": "graphicaldebugging",
  "language": "cpp",
  "types": [
    {
      "type": "point",
      "kind": "point",
      "system": "cartesian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "box",
      "kind": "box",
      "points": {
        "min": "$this.m_min_corner",
        "max": "$this.m_max_corner"
      }
    },
    {
      "type": "value",
      "kind": "box",
      "points": {
        "min": "$this.m_min_corner",
        "max": "$this.m_max_corner"
      }
    }
  ]
}
```

那么我如下的类型定义就可以被识别：

```C++
namespace bg = boost::geometry;
namespace bgi = boost::geometry::index;

typedef bg::model::point<float, 2, bg::cs::cartesian> point;
typedef bg::model::box<point> box;
typedef box value;
```

关于 json 文件的详细内容可以参考[插件仓库下的 json 文件](https://github.com/awulkiew/graphical-debugging-vscode/blob/master/resources/boost.json)。

进一步来说 json 文件的放置位置也不一定是项目根目录，扩展设置里面可以设置 json 文件的寻找目录，以及可视化展示的投影方式，如下图：

<img src="graphical_debugging_settings.webp" height="500px"/>

这里附上使用 boost.geometry 时候用到的 json 文件，可以在扩展设置里面把路径设置成`./.vscode`，然后放到这个路径下。最底下的`aliases`字段可以定义自己用`typedef`定义的类型别名。

```json
{
  "name": "graphicaldebugging",
  "language": "cpp",
  "types": [
    {
      "type": "boost::array<.+>",
      "kind": "container",
      "array": {
        "start": "$this.elems",
        "size": "$T1"
      }
    },
    {
      "type": "boost::chrono::duration<.+>",
      "kind": "value",
      "name": "$this.rep_"
    },
    {
      "type": "boost::container::static_vector<.+>",
      "kind": "container",
      "array": {
        "start": "($T0*)$this.m_holder.storage.data",
        "size": "$this.m_holder.m_size"
      }
    },
    {
      "type": "boost::container::vector<.+>",
      "kind": "container",
      "array": {
        "start": "$this.m_holder.m_start",
        "size": "$this.m_holder.m_size"
      }
    },
    {
      "type": "boost::geometry::model::point<.+cartesian>",
      "kind": "point",
      "system": "cartesian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::point<.+spherical_equatorial.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::point<.+spherical_equatorial.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::point<.+geographic.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::point<.+geographic.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d2::point_xy<.+cartesian>",
      "kind": "point",
      "system": "cartesian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d2::point_xy<.+spherical_equatorial.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d2::point_xy<.+spherical_equatorial.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d2::point_xy<.+geographic.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d2::point_xy<.+geographic.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d3::point_xyz<.+cartesian>",
      "kind": "point",
      "system": "cartesian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d3::point_xyz<.+spherical_equatorial.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d3::point_xyz<.+spherical_equatorial.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d3::point_xyz<.+geographic.+degree.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "degree",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::d3::point_xyz<.+geographic.+radian.+>",
      "kind": "point",
      "system": "geographic",
      "unit": "radian",
      "coordinates": {
        "x": "$this.m_values[0]",
        "y": "$this.m_values[1]"
      }
    },
    {
      "type": "boost::geometry::model::segment<.+>",
      "kind": "segment",
      "points": {
        "p0": "$this.first",
        "p1": "$this.second"
      }
    },
    {
      "type": "boost::geometry::model::linestring<.+>",
      "kind": "linestring",
      "points": {
        "container": {
          "name": "$this",
          "type": "$T1<$T0,$T2<$T0>>"
        }
      }
    },
    {
      "type": "boost::geometry::model::box<.+>",
      "kind": "box",
      "points": {
        "min": "$this.m_min_corner",
        "max": "$this.m_max_corner"
      }
    },
    {
      "type": "boost::geometry::model::ring<.+>",
      "kind": "ring",
      "cw": "$T1",
      "points": {
        "container": {
          "name": "$this",
          "type": "$T3<$T0,$T4<$T0>>"
        }
      }
    },
    {
      "type": "boost::geometry::model::polygon<.+>",
      "kind": "polygon",
      "exteriorring": {
        "name": "$this.m_outer",
        "type": "boost::geometry::model::ring<$T0,$T1,$T2,$T3,$T5>"
      },
      "interiorrings": {
        "container": {
          "name": "$this.m_inners",
          "type": "$T4<boost::geometry::model::ring<$T0,$T1,$T2,$T3,$T5>,$T6<boost::geometry::model::ring<$T0,$T1,$T2,$T3,$T5>>>"
        }
      }
    },
    {
      "type": "boost::geometry::model::multi_point<.+>",
      "kind": "multipoint",
      "points": {
        "container": {
          "name": "$this",
          "type": "$T1<$T0,$T2<$T0>>"
        }
      }
    },
    {
      "type": "boost::geometry::model::multi_linestring<.+>",
      "kind": "multilinestring",
      "linestrings": {
        "container": {
          "name": "$this",
          "type": "$T1<$T0,$T2<$T0>>"
        }
      }
    },
    {
      "type": "boost::geometry::model::multi_polygon<.+>",
      "kind": "multipolygon",
      "polygons": {
        "container": {
          "name": "$this",
          "type": "$T1<$T0,$T2<$T0>>"
        }
      }
    },
    {
      "type": "boost::geometry::index::detail::varray<.+>",
      "kind": "container",
      "array": {
        "start": "($T0*)$this.m_storage.data_.buf",
        "size": "$this.m_size"
      }
    },
    {
      "type": "boost::polygon::point_data<.+>",
      "kind": "point",
      "system": "cartesian",
      "coordinates": {
        "x": "$this.coords_[0]",
        "y": "$this.coords_[1]"
      }
    },
    {
      "type": "boost::polygon::segment_data<.+>",
      "kind": "segment",
      "points": {
        "p0": "$this.points_[0]",
        "p1": "$this.points_[1]"
      }
    },
    {
      "type": "boost::polygon::rectangle_data<.+>",
      "kind": "box",
      "system": "cartesian",
      "coordinates": {
        "minx": "$this.ranges_[0].coords_[0]",
        "miny": "$this.ranges_[1].coords_[0]",
        "maxx": "$this.ranges_[0].coords_[1]",
        "maxy": "$this.ranges_[1].coords_[1]"
      }
    },
    {
      "type": "boost::polygon::polygon_data<.+>",
      "kind": "ring",
      "points": {
        "container": {
          "name": "$this.coords_"
        }
      }
    },
    {
      "type": "boost::polygon::polygon_with_holes_data<.+>",
      "kind": "polygon",
      "exteriorring": {
        "name": "$this.self_"
      },
      "interiorrings": {
        "container": {
          "name": "$this.holes_"
        }
      }
    },
    {
      "type": "boost::units::quantity<.+>",
      "kind": "value",
      "name": "$this.val_"
    }
  ],
  "aliases": [
    {
      "name": "box",
      "type": "boost::geometry::model::box<.+>"
    },
    {
      "name": "point",
      "type": "boost::geometry::model::d2::point_xy<.+cartesian>"
    }
  ]
}
```

----------------------------------------------

## GEOS

- [官方网站](https://libgeos.org/)

> GEOS is a C/C++ library for computational geometry with a focus on algorithms used in geographic information systems (GIS) software. It implements the OGC Simple Features geometry model and provides all the spatial functions in that standard as well as many others. GEOS is a core dependency of PostGIS, QGIS, GDAL, Shapely and many others.

> Spatial Model and Functions
> 
> - Geometry Model: Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection
> - Predicates: Intersects, Touches, Disjoint, Crosses, Within, Contains, Overlaps, Equals, Covers
> - Operations: Union, Distance, Intersection, Symmetric Difference, Convex Hull, Envelope, Buffer, Simplify, Polygon Assembly, Valid, Area, Length,
> - Prepared geometry (using internal spatial indexes)
> - Spatial Indexes: STR (Sort-Tile-Recursive) packed R-tree spatial index
> - Input/Output: OGC Well Known Text (WKT) and Well Known Binary (WKB) readers and writers.

### License

> GEOS is open source software available under the terms of GNU Lesser General Public License (`LGPL`).

### 特点

- 主要专注于地理空间数据。
- 提供的更多的是空间操作和算法，但基本的几何操作也都有。

----------------------------------------------

## CGAL

- [官方网站](https://www.cgal.org/)

> CGAL is a software project that provides easy access to efficient and reliable geometric algorithms in the form of a C++ library. CGAL is used in various areas needing geometric computation, such as geographic information systems, computer aided design, molecular biology, medical imaging, computer graphics, and robotics.
> 
> The library offers data structures and algorithms like triangulations, Voronoi diagrams, Boolean operations on polygons and polyhedra, point set processing, arrangements of curves, surface and volume mesh generation, geometry processing, alpha shapes, convex hull algorithms, shape reconstruction, AABB and KD trees...

### License

> CGAL is distributed under a dual license scheme, that is under the `GNU GPL/LGPL` open source licenses, as well as under `commercial licenses`.

### 特点

- 几何操作非常全面，功能强大。
- 学习成本相对较高。
- 有 License 的限制。

----------------------------------------------

## libigl

- [官方网站](https://libigl.github.io/)

> libigl is a simple C++ geometry processing library. We have a wide functionality including construction of sparse discrete differential geometry operators and finite-elements matrices such as the cotangent Laplacian and diagonalized mass matrix, simple facet and edge-based topology data structures, mesh-viewing utilities for OpenGL and GLSL, and many core functions for matrix manipulation which make Eigen feel a lot more like MATLAB.

### License

> libigl is primarily `MPL2` licensed (FAQ). Some files contain third-party code under other licenses. We’re currently in the processes of identifying these and marking appropriately.

### 特点

- 主要专注的是离散几何和计算机图形学领域。
- 更多的提供的是三维模型的 mesh 网格处理。

----------------------------------------------

## OpenMesh

- [官方网站](https://www.graphics.rwth-aachen.de/software/openmesh/)

> OpenMesh provides the following features:
> - Representation of arbitrary polygonal (the general case) and pure triangle meshes (providing more efficient, specialized algorithms)
> - Explicit representation of vertices, halfedges, edges and faces.
> - Fast neighborhood access, especially the one-ring neighborhood (see below).
> - Highly customizable :
>   - Choose your coordinate type (dimension and scalar type)
>   - Attach user-defined elements/functions to the mesh elements.
>   - Attach and check for attributes.
>   - Attach data at runtime using dynamic properties.

### License

> Latest Version (starting with 4.0) are Licensed under the `BSD 3 clause` license

### 特点

- 主要专注于多边形网格处理和拓扑编辑。

----------------------------------------------

## GEOMETRIC TOOLS

- [官方网站](https://www.geometrictools.com/index.html)

> Geometric Tools, a collection of source code for computing in the fields of mathematics, geometry, graphics, image analysis and physics. The engine is written in C++ 14 and, as such, has portable access to standard constructs for multithreading programming on cores. The engine also supports high-performance computing using general purpose GPU programming (GPGPU). Portions of the code are described in various books as well as in documents available at this site. The source code is freely downloadable, covered by the Boost License.

### License

> The GTL source code will be freely downloadable and subject to the `Boost License`.

### 计算几何相关

- [Boolean Operations on Intervals and Axis-Aligned Rectangles](https://www.geometrictools.com/Documentation/BooleanIntervalRectangle.pdf)
- [Clipping a Mesh Against a Plane](https://www.geometrictools.com/Documentation/ClipMesh.pdf)
- [Geodesics On Triangle Meshes](https://www.geometrictools.com/Documentation/GeodesicsOnTriangleMeshes.pdf)
- [Mesh Differential Geometry](https://www.geometrictools.com/Documentation/MeshDifferentialGeometry.pdf)
- [The Minimal Cycle Basis for a Planar Graph](https://www.geometrictools.com/Documentation/MinimalCycleBasis.pdf)
- [Polyline Reduction](https://www.geometrictools.com/Documentation/PolylineReduction.pdf)
- [Tessellation of a Unit Sphere Starting with an Inscribed Convex Triangular Mesh](https://www.geometrictools.com/Documentation/TessellateSphere.pdf)
- [Triangulation by Ear Clipping](https://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf)

### 特点

- 专注于计算机图形学。
- 易于使用。
- 相对来说功能可能更有限。
