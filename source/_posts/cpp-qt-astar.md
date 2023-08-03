---
title: A*算法深入探究 - 使用Qt和C++实现带权重版本的A*
date: 2023-08-02 15:25:01
updated: 2023-08-02 15:25:01
cover: astar.jpg
tags:
    - C++
    - A*
    - Qt
    - CMake
    - Google Test
categories:
    - 算法研究
---

{% note info flat %}
### 目录
{% post_link snake-astar %}
-> {% post_link cpp-qt-astar %}
{% endnote %}

<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;"><iframe 
src="//player.bilibili.com/player.html?aid=999319742&bvid=BV1544y1w7PR&cid=1220569414&page=1&autoplay=false" 
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" 
style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"> </iframe></div>

-----------------

已知如下图地图，黑色表示障碍物无法通行，要求实现避障算法寻找从红色起点出发达到绿色终点的最优路径。

![](problem.jpg)

要求：
1. 对图中的地图进行建模，抽象成类，对数据进行封装；
2. 思考寻路算法的实现，对问题进行拆解，对算法实现也要求抽象接口类；
3. 使用给定的 C++ 工程模板，按照模板编写 CMakeLists.txt，以及 Google Test 单元测试，DoxyGen 注释的使用。

[工程模板](https://github.com/filipdutescu/modern-cpp-template.git)

## 问题分析

### 由题可以得出的信息

- 题图中给出的并非最优路径。
- 想到 A\* 算法，之前研究该算法的文章：{% post_link snake-astar %}
- 可以进行斜向移动，所以每个结点的邻居有 8 个
- 使用一定的方法展示出所寻得的路径

### 想要达到的目标

- 将地图抽象成类，将 A\* 算法抽象成类
- A\* 算法依赖地图类，但地图类不应回头依赖 A\*类
- 地图类应该足够普适，换一种寻路算法也不需要修改地图类的实现
- A\* 类有其使用的结点类，地图类有其使用的结点类，而且两者是继承关系
- 实现带权重版本的 A\* 算法，让路径结果可以沿着“道路”行进
- 使用控制字符在终端绘制出路径
- 使用 GUI 在用户界面设置地图、绘制路径

### 编写项目过程中的心得

- 地图类使用模板，限制其内容必须是由`gridmap::Node`继承而来的类，实现地图类和算法类解耦
- A\* 算法结点中，使用一个标志位指示其所在位置，有三种位置：未遍历、在`open list`中、在`closed list`中，这样判断结点在不在两个列表中只需要访问其标志位即可。由于对于`closed list`我们只需要知道一个结点在不在其中，不需要对该列表中的元素做操作，所以无需真正地建立一个物理上的`closed list`。
- 由于会通过邻居结点访问到已经在`open list`中的结点，并且新计算的`g`值如果比原来的要小，需要更新之。这就导致原本已经被`priority_queue`建立好的堆结构，在这种不被`priority_queue`感知的情况下被破坏了。重新建堆的时间复杂度是 O(nlgn)，如果调整频率过高，则使用`priority_queue`是一种负优化。

寻路库最终使用方法类似于：
```C++
vector<vector<double>> obstacles {
    { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
    { 0, 0, 0, 0, 0, INFINITY, INFINITY, INFINITY },
    { INFINITY, INFINITY, 0, INFINITY, INFINITY, 0, 0, 0 },
    { INFINITY, 0, 0, 0, 0, 0, 0, 0 }
};

gridmap::Map<astar::Node> map(obstacles);
astar::PathFinder pathfinder(map, { 0, 0 }, { 3, 7 });
auto path = pathfinder.findPath();
pathfinder.showPath(path);
```

最终实现的效果（带有交互）：
- 结点上的颜色和数字代表该结点行走过程中产生的代价惩罚，颜色越深，数字越大则说明行走过该结点需要更大的代价，所以最短路径不一定就是两个点的直接连接，而是考虑走过路径结点考虑到代价惩罚的最终结果。
- 红色的“x”结点代表障碍，是寻路算法不会考虑的结点。
- 粉红色结点为起点，浅绿色结点为终点，淡蓝色线条为寻路算法运行的结果

![](astar.jpg)

命令行中效果：

![](shell.jpg)

## 程序设计

{% plantuml %}
@startuml

package astar {
    class PathFinder {
        -point::Point2i _starting_position
        -point::Point2i _ending_position
        -gridmap::Map<Node> * _map

        +PathFinder()
        +PathFinder(gridmap::Map<Node> &, const point::Point2i &, const point::Point2i &)

        +void set_starting_position(const point::Point2i)
        +void set_ending_position(const point::Point2i)
        +void set_map(gridmap::Map<Node> &)

        +std::vector<Node *> findPath()
        +void showPath(const std::vector<Node *> &)

        +static std::vector<Node *> findPath(gridmap::Map<Node> &, Node *, Node *)
        +static std::vector<Node *> findPath(gridmap::Map<Node> &, point::Point2i, point::Point2i)
        +static void showPath(gridmap::Map<Node> &, const std::bector<Node *> &)
    }

    class astar::Node {
        -int _g_cost
        -int _h_cost
        -int _f_cost

        -Nodestatus _status

        -Node * _parent

        +Node()

        +int get_g_cost()
        +int get_h_cost()
        +int get_f_cost()
        +void set_g_cost(int)
        +void set_h_cost(int)
        +Node * get_parent()
        +void set_parent(Node *)
        +NodeStatus get_status()
        +void set_status(NodeStatus)

        +void refresh()
        +int distance(Node &)

        +bool operator>(const Node &)
    }

    enum NodeStatus {
        wild
        open
        closed
    }

    class myheap {
        +const_iterator find(const T &)
        +const_iterator begin()
        +const_iterator end()
    }

    struct cmp {
        +bool operator()(Node *, Node *)
    }
}

package gridmap {
    class Map {
        -std::vector<std::vector<T>> _map
        -point::Point2i _map_size

        +Map(int, int)
        +Map(std::vector<std::vector<double>>)

        +const point::Point2i & get_map_size()

        +T & operator[](const point::Point2i &)
        +std::vector<T> & operator[](int)

        +std::vector<T *> getNeighbours(const point::Point2i &)
        +std::vector<T *> getNeighbours(const T &)
        +void refreshMap()

        +friend std::ostream & operator<<(std::ostream &, const Map &)
    }

    class gridmap::Node {
        -double walk_cost
        -point::Point2i _position

        -char _display_char

        +Node()
        +Node(point::Point2i, double walk_cost)
        
        +double get_walk_cost()
        +void set_walk_cost(double)
        +int x()
        +int y()
        +void x(int)
        +void y(int)
        +void set_display_char()

        +bool isWalkable()

        +virtual void refresh()
        +virtual bool operator==(const Node &)
        +bool operator!=(const Node &)

        +friend std::ostream & operator<<(std::ostream &, const Node &)
    }
}

package point {
    class Point {
        -std::array<T, N> _data

        +Point()
        +Point(const std::array<T, N> &)

        +virtual Point operator+(const Point &)
        +const T & operator[](const int)
        +bool operator==(const Point &)

        +friend std::ostream & operator<<(std::ostream &, const Point &)
    }

    class Point2i {
        +Point2i()
        +Point2i(int, int)

        +int x()
        +int y()
        +void x(int)
        +void y(int)

        +Point2i operator+(const Point2i &)
        +Point2i operator-()
        +Point2i operator-(const Point2i &)
    }
}

Point2i -|> Point
astar::Node -|> gridmap::Node

PathFinder ..> Point2i
PathFinder ..> Map
PathFinder ..> astar::Node
PathFinder ..> myheap

myheap ..> cmp

cmp ..> astar::Node

astar::Node "1" *-- "1" NodeStatus
astar::Node ..> Point2i

Map "1" *.. "1..n" gridmap::Node

Map ..> Point2i

gridmap::Node ..> Point2i

@enduml
{% endplantuml %}

### 点类

对于 A\* 来说，地图是网格化的，所以使用整形坐标来表示地图结点会非常方便。我需要创建这么一种点类：它可以用来表示二维平面中的点，但不局限于此，可以扩展成任意维度的点。
于是创建了一个`Point`模板类，可以表示任意维度的点，可以表示任意型别数据元素的点；同时创建一个`Point2i`类用在本题。

```C++
//
//  point.h
//  assignment3
//
//  Created by 郭帆 on 2023/7/26.
//
#ifndef POINT_H
#define POINT_H

#include <iostream>
#include <array>

namespace point {
template <typename T, std::size_t N>
class Point {
public:
    Point() = default;
    Point(const std::array<T, N> & init_data) : _data(init_data) {}
    
    virtual Point operator+(const Point & p) const {
        Point ans;
        for (int i = 0; i < N; ++i) {
            ans._data[i] = _data[i] + p._data[i];
        }
        return ans;
    }
    
    const T & operator[](const int index) const {
        return _data[index];
    }
    
    bool operator==(const Point & p) const {
        bool is_equal = true;
        for (int i = 0; i < N; ++i) {
            if (_data[i] != p._data[i]) is_equal = false;
        }
        return is_equal;
    }
    
    friend std::ostream & operator<<(std::ostream & os, const Point & p) {
        os << "(" << p._data[0];
        for (int i = 1; i < N; ++i) {
            os << ", ";
            os << p._data[i];
        }
        os << ")";
        return os;
    }
    
protected:
    std::array<T, N> _data;
};

class Point2i : public Point<int, 2> {
public:
    Point2i() {
        *this = Point2i(0, 0);
    }
    
    Point2i(int x, int y) {
        _data[0] = x;
        _data[1] = y;
    }
    
    int x() const { return _data[0]; }
    int y() const { return _data[1]; }
    void x(int in_x) { _data[0] = in_x; }
    void y(int in_y) { _data[1] = in_y; }
    
    Point2i operator+(const Point2i & p) const {
        return Point2i(_data[0] + p._data[0], _data[1] + p._data[1]);
    }
    
    Point2i operator-() const {
        return Point2i(-_data[0], -_data[1]);
    }
    
    Point2i operator-(const Point2i & p) const {
        return *this + (-p);
    }
};
} // point

#endif // POINT_H
```

### 地图类

地图类要求其中的元素具有一些通用的性质：
- 能够设置其坐标
- 能够设置其行走代价
- 拥有初始化结点状态的方法

所以要求地图类中的元素必须继承自某个类，这在 C++20 中的写法是：
`template <typename T> requires std::is_base_of_v<Node, T> // C++20`

结点基类如下：

```C++
//
//  mapnode.h
//  cppex
//
//  Created by 郭帆 on 2023/7/28.
//

#ifndef MAPNODE_H
#define MAPNODE_H

#include <iostream>
#include <string>
#include <cmath>

#include "point.h"

namespace gridmap {
class Node {
public:
    Node() : _walk_cost(0), _position({0, 0}) {}
    Node(point::Point2i position, double walk_cost = 0) : _walk_cost(walk_cost), _position(position) {}
    
    double get_walk_cost() { return _walk_cost; }
    void set_walk_cost(double cost) { _walk_cost = cost; }
    const point::Point2i & get_position() const { return _position; }
    int x() const { return _position.x(); }
    int y() const { return _position.y(); }
    void x(int in_x) { _position.x(in_x); }
    void y(int in_y) { _position.y(in_y); }
    void set_display_char(char c) { _display_char = c; }

    bool isWalkable() const { return !std::isinf(_walk_cost); }
    
    virtual void refresh() { _display_char = ' '; }
    
    virtual bool operator==(const Node & n) const { return this == &n ? true : _position.x() == n._position.x() && _position.y() == n._position.y(); }
    
    bool operator!=(const Node & n) const { return !(*this == n); }

    friend std::ostream & operator<<(std::ostream & os, const Node & n) {
        std::string color_control = "";
        char display = n._display_char;
        if (!n.isWalkable()) {
            color_control = "\e[40;37m";
            display = 'x';
        }
        else if (n._walk_cost < 0.1) color_control = "\e[47;30m";
        else if (n._walk_cost < 0.3) color_control = "\e[46;30m";
        else if (n._walk_cost < 0.5) color_control = "\e[44;30m";
        else if (n._walk_cost < 0.7) color_control = "\e[43;30m";
        else if (n._walk_cost < 0.9) color_control = "\e[45;30m";
        else color_control = "\e[41;30m";
        
        std::cout << color_control << display;
        std::cout << "\e[0m";
        return os;
    }
    
protected:
    double _walk_cost;              // range 0-1, inf means unwalkable
    point::Point2i _position;
    
    char _display_char = ' ';
};
}

#endif // MAPNODE_H
```

地图模板类如下：

```C++
//
//  gridmap.h
//  assignment3
//
//  Created by 郭帆 on 2023/7/26.
//
#ifndef GRIDMAP_H
#define GRIDMAP_H

#include <iostream>
#include <array>
#include <vector>

#include "point.h"
#include "mapnode.h"

namespace gridmap {
template <typename T> requires std::is_base_of_v<Node, T> // C++20
class Map {
public:
    Map(int x, int y) {
        _map_size.x(x);
        _map_size.y(y);
        _map = std::vector<std::vector<T>>(x, std::vector<T>(y, T()));
        for (int i = 0; i < x; ++i) {
            for (int j = 0; j < y; ++j) {
                _map[i][j].x(i);
                _map[i][j].y(j);
                _map[i][j].set_walk_cost(0);
            }
        }
    }

    Map(std::vector<std::vector<double>> map_data) {
        int x = map_data.size();
        int y = 0;
        if (x > 0) {
            _map_size.x(x);

            y = map_data[0].size();
            if (y > 0) {
                _map_size.y(y);
                _map = std::vector<std::vector<T>>(x, std::vector<T>(y, T()));
            }
        }

        for (int i = 0; i < x; ++i) {
            for (int j = 0; j < y; ++j) {
                _map[i][j].x(i);
                _map[i][j].y(j);
                if (j < map_data[i].size())
                    _map[i][j].set_walk_cost(map_data[i][j]);
            }
        }
    }
    
    const point::Point2i & get_map_size() { return _map_size; }

    T & operator[](const point::Point2i & p) {
        return _map[p.x()][p.y()];
    }
    
    std::vector<T> & operator[](int index) {
        return _map[index];
    }

    std::vector<T *> getNeighbours(const point::Point2i & p) {
        std::vector<T *> neighbours;
        for (int x = -1; x <= 1; ++x) {
            for (int y = -1; y <= 1; ++y) {
                point::Point2i coord = p + point::Point2i{ x, y };
                if (!(x == 0 && y == 0) &&
                    coord.x() >= 0 && coord.x() < _map_size.x() &&
                    coord.y() >= 0 && coord.y() < _map_size.y()) {
                    neighbours.emplace_back(&_map[coord.x()][coord.y()]);
                }
            }
        }
        return neighbours;
    }

    std::vector<T *> getNeighbours(const T & n) {
        return getNeighbours(n.get_position());
    }
    
    void refreshMap() {
        for (auto &line : _map) {
            for (auto &item : line) {
                item.refresh();
            }
        }
    }
    
    friend std::ostream & operator<<(std::ostream & os, const Map & m) {
        for (auto &line : m._map) {
            for (auto &item : line) {
                std::cout << item;
            }
            std::cout << std::endl;
        }
        return os;
    }
    
private:
    std::vector<std::vector<T>> _map;
    point::Point2i _map_size;
};
} // gridmap

#endif // GRIDMAP_H
```

### A\* 类

A\* 算法需要的结点相比于地图类的结点来说，需要存储更多的信息：
- f、g、h 值
- 结点所处列表位置
- 父结点指针，用来回溯路径

```C++
//
//  astarnode.h
//  assignment3
//
//  Created by 郭帆 on 2023/7/26.
//
#ifndef ASTARNODE_H
#define ASTARNODE_H

#include "point.h"
#include "mapnode.h"
#include "mapnode.h"

namespace astar {
enum class NodeStatus { wild, open, closed };

class Node : public gridmap::Node {
public:
    Node() : _parent(this) {}
    
    int get_g_cost() const { return _g_cost; }
    int get_h_cost() const { return _h_cost; }
    int get_f_cost() const { return _f_cost; }
    void set_g_cost(int g_cost) {
        _g_cost = g_cost;
        _f_cost = _g_cost + _h_cost;
    }
    void set_h_cost(int h_cost) {
        _h_cost = h_cost;
        _f_cost = _g_cost + _h_cost;
    }
    Node * get_parent() const { return _parent; }
    void set_parent(Node * parent) { _parent = parent; }
    NodeStatus get_status() { return _status; }
    void set_status(NodeStatus s) { _status = s; }
    
    void refresh() override {
        gridmap::Node::refresh();
        _g_cost = 0;
        _h_cost = 0;
        _f_cost = 0;
        _status = NodeStatus::wild;
    }
    
    int distance(Node & n) {
        int x_distance = std::abs(_position.x() - n._position.x());
        int y_distance = std::abs(_position.y() - n._position.y());
        
        return std::min(x_distance, y_distance)*14 + std::abs(x_distance - y_distance)*10;
    }

    bool operator>(const Node & n) const { return _f_cost > n._f_cost; }

private:
    int _g_cost = 0;
    int _h_cost = 0;
    int _f_cost = 0;
    
    NodeStatus _status = NodeStatus::wild;

    Node * _parent;
};
} // astar

#endif // ASTARNODE_H
```

对于 A\* 寻路算法类，我希望其有两种使用方式：
- 创建一个寻路对象，该对象持有地图的引用，使用该对象的方法来寻路
- 无需创建寻路对象，只要拥有地图和起点终点则可使用静态方法寻路

```C++
//
//  astar.h
//  assignment3
//
//  Created by 郭帆 on 2023/7/26.
//
#ifndef ASTAR_H
#define ASTAR_H

#include <vector>

#include "astarnode.h"
#include "gridmap.h"

namespace astar {
class PathFinder {
public:
    PathFinder() : _map(nullptr), _starting_position({ 0, 0 }), _ending_position({ 0, 0 }) {}
    PathFinder(gridmap::Map<Node> & map, const point::Point2i & starting_position, const point::Point2i & ending_position) : 
                _map(&map), _starting_position(starting_position), _ending_position(ending_position) {}

    void set_starting_position(const point::Point2i starting_position) { _starting_position = starting_position; }
    void set_ending_position(const point::Point2i ending_position) { _ending_position = ending_position; }
    void sed_map(gridmap::Map<Node> & map) { _map = &map; }

    std::vector<Node *> findPath() { return findPath(*_map, _starting_position, _ending_position); };
    void showPath(const std::vector<Node *> & path) { return showPath(*_map, path); }

    static std::vector<Node *> findPath(gridmap::Map<Node> & map, Node * start_node, Node * target_node);
    static std::vector<Node *> findPath(gridmap::Map<Node> & map, point::Point2i start_position, point::Point2i end_position);
    static void showPath(gridmap::Map<Node> & map, const std::vector<Node *> & path);
private:
    point::Point2i _starting_position;
    point::Point2i _ending_position;
    gridmap::Map<Node> * _map;
};
} // astar

#endif // ASTAR_H
```

A\* 算法的实现一如既往的简单，但是优先队列结构被破坏那个问题现在用了一种很勉强的方式解决：将被改变的元素再`push`一次进队列中，那么这个元素的位置会被更新。而因为有结点标志位的存在，如果一个结点的标志位指示出它已经在`closed list`中，则不会被再次处理，会直接丢掉。

```C++
//
//  astar.cpp
//  assignment3
//
//  Created by 郭帆 on 2023/7/26.
//
#include <unordered_set>
#include <queue>
#include <array>
#include <algorithm>
#include <cmath>

#include "astar.h"
#include "myheap.h"

namespace astar {
std::vector<Node *> PathFinder::findPath(gridmap::Map<Node> & map, Node * start_node, Node * target_node) {
    myheap<Node *> open_set;
    
    map.refreshMap();

    start_node->set_status(NodeStatus::open);
    open_set.push(start_node);
    while (!open_set.empty()) {
        Node * current_node = open_set.top();
        open_set.pop();
        
        current_node->set_status(NodeStatus::closed);

        if (*current_node == *target_node) {
            std::deque<Node *> path;
            Node * current_node = target_node;
            while (*current_node != *start_node) {
                path.push_front(current_node);
                current_node = current_node->get_parent();
            }
            path.push_front(current_node);
            return std::vector<Node *>{path.begin(), path.end()};
        }

        for (auto neighbour : map.getNeighbours(*current_node)) {
            if (!neighbour->isWalkable() ||
                neighbour->get_status() == NodeStatus::closed) {
                continue;
            }

            int new_cost_to_neighbour = current_node->get_g_cost() + 
                                        current_node->distance(*neighbour) *
                                        (1.0 + current_node->get_walk_cost());
            bool is_neighbour_in_open_set = neighbour->get_status() == NodeStatus::open;
            if (new_cost_to_neighbour < neighbour->get_g_cost() || !is_neighbour_in_open_set) {
                neighbour->set_g_cost(new_cost_to_neighbour);
                neighbour->set_h_cost(neighbour->distance(*target_node));
                neighbour->set_parent(current_node);
                
                // TODO find a solution about breaking heap structure
                neighbour->set_status(NodeStatus::open);
                open_set.push(neighbour);
                // if (!is_neighbour_in_open_set) {
                //     neighbour->set_status(NodeStatus::open);
                //     open_set.push(neighbour);
                // } else {
                //     std::make_heap(open_set.begin(), open_set.end());
                // }
            }
        }
    }
    
    return {};
}

std::vector<Node *> PathFinder::findPath(gridmap::Map<Node> & map, point::Point2i start_position, point::Point2i end_position) {
    return findPath(map, &map[start_position], &map[end_position]);
}

void PathFinder::showPath(gridmap::Map<Node> & map, const std::vector<Node *> & path) {
    for (int i = 1; i < path.size(); ++i) {
        point::Point2i position = path[i-1]->get_position();
        point::Point2i diff = path[i]->get_position() - position;
        
        if (diff.x() == 0) map[position].set_display_char('-');
        else if (diff.y() == 0) map[position].set_display_char('|');
        else if (diff.x() == diff.y()) map[position].set_display_char('\\');
        else if (diff.x() == -diff.y()) map[position].set_display_char('/');
        else map[position].set_display_char(' ');
        
        std::cout << position << "->";
    }

    auto start_node = path.begin();
    map[(*start_node)->get_position()].set_display_char('*');
    auto target_node = path.end()-1;
    map[(*target_node)->get_position()].set_display_char('#');
    std::cout << (*target_node)->get_position() << " cost: " << (*target_node)->get_g_cost() << std::endl;

    std::cout << map << std::endl;
}
} // astar
```

### 目录结构

```
.
├── astar
│   ├── astar.cpp
│   ├── astar.h
│   ├── astarnode.h
│   ├── CMakeLists.txt
│   └── myheap.h
├── CMakeLists.txt
├── gridmap
│   ├── gridmap.h
│   └── mapnode.h
├── main.cpp
└── point
    └── point.h
```

### CMake

```CMake
cmake_minimum_required(VERSION 3.0.0)
project(assignment3 VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)

include(CTest)
enable_testing()

include_directories(${PROJECT_SOURCE_DIR}/point)
include_directories(${PROJECT_SOURCE_DIR}/gridmap)

include_directories(${PROJECT_SOURCE_DIR}/astar)
add_subdirectory(${PROJECT_SOURCE_DIR}/astar)
set(EXTRA_LIBS ${EXTRA_LIBS} astar)

add_executable(${PROJECT_NAME} main.cpp)

set(EXTRA_LIBS ${EXTRA_LIBS} libgtest.a libgtest_main.a pthread)

target_link_libraries(${PROJECT_NAME} ${EXTRA_LIBS})

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
```

### Google Test

```C++
//
//  main.cpp
//  assignment3
//
//  Created by 郭帆 on 2023/7/25.
//

#include <iostream>

#include <gtest/gtest.h>

#include "point.h"
#include "gridmap.h"
#include "astar.h"

using namespace std;

TEST(gridmapTest, test0) {
    vector<vector<double>> obstacles {
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { 0, 0, 0, 0, 0, INFINITY, INFINITY, INFINITY },
        { INFINITY, INFINITY, 0, INFINITY, INFINITY, 0, 0, 0 },
        { INFINITY, 0, 0, 0, 0, 0, 0, 0 }
    };

    gridmap::Map<astar::Node> map(obstacles);

    // std::vector<T> & gridmap::Map::operator[](int index);
    // bool gridmap::Node::isWalkable() const;
    EXPECT_TRUE(map[0][0].isWalkable());
    EXPECT_FALSE(map[1][5].isWalkable());

    // T & gridmap::Map::operator[](const point::Point2i & p);
    // double gridmap::Node::get_walk_cost();
    point::Point2i testing_position{ 2, 2 };
    EXPECT_EQ(0, map[testing_position].get_walk_cost());
    double inf_walk_cost = map[{ 3, 0 }].get_walk_cost();
    EXPECT_LT(1000000, inf_walk_cost);

    // int gridmap::Node::x() const;
    // int gridmap::Node::y() const;
    EXPECT_EQ(map[2][3].x(), 2);
    EXPECT_EQ(map[2][3].y(), 3);

    // virtual bool gridmap::Node::operator==(const Node & n) const;
    EXPECT_TRUE(map[3][3] == gridmap::Node({ 3, 3 }));
    EXPECT_FALSE(map[3][3] == gridmap::Node({ 2, 3 }));

    // std::vector<T *> gridmap::Map::getNeighbours(const point::Point2i & p);
    auto neighbours = map.getNeighbours({ 2, 2 });
    ASSERT_EQ(neighbours.size(), 8);
    EXPECT_FALSE(neighbours[3]->isWalkable());

    // std::vector<T *> gridmap::Map::getNeighbours(const T & n);
    neighbours = map.getNeighbours(map[0][0]);
    EXPECT_EQ(neighbours.size(), 3);

    // void gridmap::Node::set_walk_cost(double cost);
    map[1][4].set_walk_cost(0.2);
    EXPECT_EQ(map[1][4].get_walk_cost(), 0.2);
}

TEST(astarTest, test0) {
    vector<vector<double>> obstacles {
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { INFINITY, INFINITY, 0, INFINITY, INFINITY, 0, 0, 0 },
        { INFINITY, 0, 0, 0, 0, 0, 0, 0 }
    };

    gridmap::Map<astar::Node> map(obstacles);
    point::Point2i starting_position{ 0, 0 };
    point::Point2i ending_position{ 3, 7 };
    astar::PathFinder pathfinder(map, starting_position, ending_position);

    // std::vector<Node *> astar::PathFinder::findPath(gridmap::Map<Node> & map, Node * start_node, Node * target_node);
    auto path = pathfinder.findPath();
    bool is_same_position = path[0]->get_position() == point::Point2i({ 0, 0 });
    EXPECT_TRUE(is_same_position);
    is_same_position = path[2]->get_position() == point::Point2i({ 2, 2 });
    EXPECT_TRUE(is_same_position);

    // void astar::PathFinder::set_starting_position(const point::Point2i starting_position);
    pathfinder.set_starting_position({ 1, 3 });
    path = pathfinder.findPath();
    is_same_position = path[0]->get_position() == point::Point2i({ 1, 3 });
    EXPECT_TRUE(is_same_position);

    // void astar::PathFinder::set_ending_position(const point::Point2i ending_position);
    pathfinder.set_ending_position({ 2, 5 });
    path = pathfinder.findPath();
    is_same_position = (*(path.end()-1))->get_position() == point::Point2i({ 2, 5 });
}

TEST(astarTest, timetest) {
    vector<vector<double>> obstacles {
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { INFINITY, INFINITY, 0, INFINITY, INFINITY, 0, 0, 0 },
        { INFINITY, 0, 0, 0, 0, 0, 0, 0 }
    };

    gridmap::Map<astar::Node> map(obstacles);
    astar::PathFinder pathfinder(map, { 0, 0 }, { 3, 7 });

    for (int i = 0; i < 1000; ++i) {
        pathfinder.findPath();
    }
}

int main(int argc, char ** argv) {
    vector<vector<double>> obstacles {
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY },
        { 0, 0, 0, 0, 0.2, INFINITY, INFINITY, INFINITY },
        { INFINITY, INFINITY, 0, INFINITY, INFINITY, 0, 0, 0 },
        { INFINITY, 0, 0, 0, 0, 0, 0, 0 }
    };
    
    gridmap::Map<astar::Node> m(obstacles);
    
    cout << m << endl;
    
    point::Point2i starting_position{ 0, 0 };
    point::Point2i ending_position{ 3, 7 };
    
    auto path = astar::PathFinder::findPath(m, starting_position, ending_position);
    astar::PathFinder::showPath(m, path);
    
    m[3][5].set_walk_cost(0.4);
    
    path = astar::PathFinder::findPath(m, starting_position, ending_position);
    astar::PathFinder::showPath(m, path);
    
    starting_position = {1, 0};
    ending_position = {2, 6};
    
    path = astar::PathFinder::findPath(m, starting_position, ending_position);
    astar::PathFinder::showPath(m, path);
    
    m[1][3].set_walk_cost(0.5);
    
    path = astar::PathFinder::findPath(m, starting_position, ending_position);
    astar::PathFinder::showPath(m, path);
    
    m[1][4].set_walk_cost(0.8);
    
    path = astar::PathFinder::findPath(m, starting_position, ending_position);
    astar::PathFinder::showPath(m, path);

    // big map
    vector<vector<double>> big_map_data {
        { 0, 0, 0, 0, INFINITY, INFINITY, INFINITY, INFINITY, 0, 0 },
        { 0, 0, 0, 0, 0.2, INFINITY, INFINITY, INFINITY, 0, 0 },
        { INFINITY, INFINITY, 0, INFINITY, INFINITY, INFINITY, 0, 0, 0, 0 },
        { INFINITY, 0.2, 0, 0, INFINITY, INFINITY, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.5, 0.9, 1, 1, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.5, 0.9, 1, 1, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.5, 0.9, 1, 1, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.5, 0.9, 1, 1, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.5, 0.9, 1, 1, INFINITY, 0, 0, 0 },
        { INFINITY, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0 }
    };
    gridmap::Map<astar::Node> big_map(big_map_data);

    cout << big_map << endl;

    astar::PathFinder pf1(big_map, { 1, 0 }, { 0, 9 });
    pf1.showPath(pf1.findPath());

    pf1.set_starting_position({ 4, 5 });
    pf1.set_ending_position({ 2, 6 });
    pf1.showPath(pf1.findPath());
    
    // google test
    testing::InitGoogleTest(&argc, argv);

    return RUN_ALL_TESTS();
}
```

## GUI

以前没有使用过 Qt，而且第一次使用 Qt 是在 mac 上，着实折腾了好一阵子。环境配置其实非常简单，使用 homebrew 安装 qt 和 qt-creator，再打开 qt-creator 进行配置即可。

{% note warning flat %}
注意不要忽略 qt-creator 底下的配置提示！不要盲目照着网上配置什么 kit！
{% endnote %}

思路如下：
- 使用按钮来展示结点，按钮有文本显示，有背景色，方便绑定点击操作
- 使用一个透明的`graphic view`来绘制路径，这个组件需要置于顶层，而且需要设置鼠标穿透防止按钮不会被点击到
- 每次有按钮被按下则进行一次寻路

代码写的很临时但是还是贴出来：

```C++
#include "mainwindow.h"
#include "./ui_mainwindow.h"

#include <qpainter.h>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow), grid_map(0, 0)
{
    ui->setupUi(this);
    ui->rb_obstacle->setChecked(1);

    ui->hs_penalty->setMaximum(1000);

    ui->w_path->installEventFilter(this);
    ui->w_path->setStyleSheet("background:transparent;border:0px");
    ui->w_path->setAttribute(Qt::WA_TransparentForMouseEvents, true);
}

MainWindow::~MainWindow()
{
    delete ui;
}

bool MainWindow::eventFilter(QObject *watched, QEvent *event) {
    if (watched == ui->w_path && event->type() == QEvent::Paint) {
        if (path.size() > 0) {
            QPainter painter(ui->w_path);
            painter.setPen(QPen(QColor(180, 180, 255), 4));

            int offset = grid_size / 2;

            for (int i = 1; i < path.size(); i++) {
                int start_x = path[i-1]->y() * grid_size + offset;
                int start_y = path[i-1]->x() * grid_size + offset;
                int end_x = path[i]->y() * grid_size + offset;
                int end_y = path[i]->x() * grid_size + offset;
                painter.drawLine(start_x, start_y, end_x, end_y);
            }

            qDebug() << "draw!";
            return true;
        }
        return false;
    } else {
        return QMainWindow::eventFilter(watched, event);
    }
}

//void MainWindow::paintEvent(QPaintEvent *e) {
//    if (path.size() > 0) {
//        QPainter painter(ui->w_path);
//        painter.setPen(QPen(Qt::blue, 4));

//        for (int i = 1; i < path.size(); i++) {
//            int start_x = path[i-1]->y() * grid_size;
//            int start_y = path[i-1]->x() * grid_size;
//            int end_x = path[i]->y() * grid_size;
//            int end_y = path[i]->x() * grid_size;
//            painter.drawLine(start_x, start_y, end_x, end_y);
//        }
//    }
//}

void MainWindow::init() {
    starting_position = { -1, -1 };
    ending_position = { -1, -1 };

    path = {};
}

void MainWindow::test_if_have_a_path() {
    if (starting_position.x() != -1 && ending_position.x() != -1) {
        path = astar::PathFinder::findPath(grid_map, starting_position, ending_position);
        qDebug() << "find a path! length:" << path.size();
        update();
    }
}

void MainWindow::set_button_style(int x, int y) {
    const QString obstacle_color = "brown";
    const QString starting_position_color = "pink";
    const QString ending_position_color = "lightgreen";

    QStringList style_list;

    int penalty = 0;
    double walk_cost = grid_map[x][y].get_walk_cost();
    if (walk_cost > 0) {
        penalty = walk_cost * 100.0;
    }

    if (starting_position == point::Point2i{ x, y }) {
        style_list.append("background-color:" + starting_position_color);
    } else if (ending_position == point::Point2i{ x, y }) {
        style_list.append("background-color:" + ending_position_color);
    } else if (grid_map[x][y].isWalkable()) {
        QString color = QString::number(255 - penalty / 1000.0 * 255);

        if (penalty < 200) {
            style_list.append("color:black");
        } else {
            style_list.append("color:white");
        }
        style_list.append("background-color:rgb("+ color + "," + color + "," + color + ")");
    } else {
        style_list.append("background-color:" + obstacle_color);
    }

    if (grid_map[x][y].isWalkable()) {
        map[x][y]->setText(QString::number(penalty));
    } else {
        map[x][y]->setText("x");
    }

    map[x][y]->setStyleSheet(style_list.join(";"));
}

void MainWindow::set_grid_map(int x, int y) {
    if (ui->rb_roadway->isChecked()) {
        int penalty = ui->hs_penalty->sliderPosition();
        grid_map[x][y].set_walk_cost(penalty / 100.0);
    } else if (ui->rb_obstacle->isChecked()) {
        grid_map[x][y].set_walk_cost(INFINITY);
    } else if (ui->rb_startingposition->isChecked()) {
        if (grid_map[x][y].isWalkable() &&
            !(ending_position.x() == x && ending_position.y() == y)) {
            point::Point2i original_starting_position = starting_position;
            starting_position = { x, y };
            if (original_starting_position.x() != -1) {
                set_button_style(original_starting_position.x(), original_starting_position.y());
            }
        }
    } else if (ui->rb_endingposition->isChecked()) {
        if (grid_map[x][y].isWalkable() &&
            !(starting_position.x() == x && starting_position.y() == y)) {
            point::Point2i original_ending_position = ending_position;
            ending_position = { x, y };
            if (original_ending_position.x() != -1) {
                set_button_style(original_ending_position.x(), original_ending_position.y());
            }
        }
    }
    set_button_style(x, y);

    test_if_have_a_path();
}

void MainWindow::on_pb_confirm_clicked()
{
    init();

    int map_row = ui->le_row->text().toInt();
    int map_column  = ui->le_column->text().toInt();
    qDebug() << map_row << map_column;
    int map_width = ui->gb_map->width();
    int map_height = ui->gb_map->height();
    qDebug() << map_width << map_height;

    int button_width = (map_width - 6) / map_column;
    int button_height = (map_height - 23) / map_row;

    grid_size = std::min(button_width, button_height);
    QStringList style_list;
    style_list.append("color:black");
    style_list.append("background-color:white");
    style_list.append("border-style:outset");
//    style_list.append("border-width:1px");

    grid_map = gridmap::Map<astar::Node>(map_row, map_column);
    for (auto &line : map) {
        for (auto &button : line) {
            button->deleteLater();
        }
    }
    map = {};

    if (map.size() == 0) {
        for (int i = 0; i < map_row; ++i) {
            map.push_back({});
            for (int j = 0; j < map_column; ++j) {
                QPushButton * button = new QPushButton(ui->gb_map);
                button->setStyleSheet(style_list.join(";"));
                button->resize(grid_size, grid_size);
                button->move(grid_size * j + 3, grid_size * i + 20);
                button->setText("0");

                connect(button, &QPushButton::pressed, [=]() {
                    set_grid_map(i, j);
                });

                button->show();
                map[i].push_back(button);
            }
        }
    }

    ui->w_path->raise();
}


void MainWindow::on_le_row_returnPressed()
{
    on_pb_confirm_clicked();
}


void MainWindow::on_le_column_returnPressed()
{
    on_pb_confirm_clicked();
}
```
