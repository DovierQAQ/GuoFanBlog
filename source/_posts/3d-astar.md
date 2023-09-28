---
title: A*算法扩展 - 三维A*
date: 2023-09-26 11:13:44
updated: 2023-09-26 11:13:44
cover: path.webp
tags:
  - C++
  - A*
categories:
  - 算法研究
---

{% note info flat %}
**系列文章**
{% post_link snake-astar %}
{% post_link cpp-qt-astar %}
-> {% post_link 3d-astar %}
{% endnote %}

--------------------------------

## 基本思路

本项目是基于这篇文章里面的代码修改的：{% post_link cpp-qt-astar %}

先将 A\* 相关的类修改为维度无关的（Dimension Agnosticism），再实现一份存储三维地图数据的地图结构。由于之前的工作，A\* 算法已经与地图类解耦了，所以可以实现用同一份 A\* 算法，寻路的维度由地图类决定。

### 使用模板扩展Node的维度

```C++
namespace astar {

namespace bg = boost::geometry;
namespace bgm = boost::geometry::model;

enum class NodeStatus
{
  wild,
  open,
  closed
};

template <std::size_t DimensionCount>
class Node : public gridmap::Node<DimensionCount>
{
 public:
  Node() : _parent(this) {}

  int get_g_cost() const { return _g_cost; }
  int get_h_cost() const { return _h_cost; }
  int get_f_cost() const { return _f_cost; }
  void set_g_cost(int g_cost)
  {
    _g_cost = g_cost;
    _f_cost = _g_cost + _h_cost;
  }
  void set_h_cost(int h_cost)
  {
    _h_cost = h_cost;
    _f_cost = _g_cost + _h_cost;
  }
  Node* get_parent() const { return _parent; }
  void set_parent(Node* parent) { _parent = parent; }
  NodeStatus get_status() { return _status; }
  void set_status(NodeStatus s) { _status = s; }

  void refresh() override
  {
    gridmap::Node<DimensionCount>::refresh();
    _g_cost = 0;
    _h_cost = 0;
    _f_cost = 0;
    _status = NodeStatus::wild;
  }

  int distance(Node& n) { return bg::comparable_distance(this->get_position(), n.get_position()); }

  bool operator>(const Node& n) const { return _f_cost > n._f_cost; }

 private:
  int _g_cost = 0;
  int _h_cost = 0;
  int _f_cost = 0;

  NodeStatus _status = NodeStatus::wild;

  Node* _parent;
};

}  // namespace astar
```

```C++
namespace gridmap {

namespace bg = boost::geometry;
namespace bgm = boost::geometry::model;

template <std::size_t DimensionCount>
class Node
{
  typedef bgm::point<int, DimensionCount, bg::cs::cartesian> point;

 public:
  Node() : _walk_cost(0), _position() {}
  Node(point position, double walk_cost = 0) : _walk_cost(walk_cost), _position(position) {}

  double get_walk_cost() { return _walk_cost; }
  void set_walk_cost(double cost) { _walk_cost = cost; }
  const point& get_position() const { return _position; }
  point& set_position() { return _position; }

  bool isWalkable() const { return !std::isinf(_walk_cost); }

  virtual void refresh(){};

  virtual bool operator==(const Node& n) const
  {
    if (this == &n)
      return true;
    return bg::equals(_position, n.get_position());
  }

  bool operator!=(const Node& n) const { return !(*this == n); }

 private:
  double _walk_cost;  // inf means unwalkable
  point _position;
  // demand
  // supply
};

}  // namespace gridmap
```

### 去除Pathfinder类中对于二维点的依赖

```C++
namespace astar {

namespace bg = boost::geometry;
namespace bgm = boost::geometry::model;

template <std::size_t DimensionCount>
class PathFinder
{
  typedef bgm::point<int, DimensionCount, bg::cs::cartesian> point;
  typedef gridmap::Map<Node<DimensionCount>> map_t;
  typedef Node<DimensionCount> node_t;

 public:
  PathFinder() : _map(nullptr) {}
  PathFinder(map_t& map, const point& starting_position, const point& ending_position)
      : _map(&map), _starting_position(starting_position), _ending_position(ending_position)
  {
  }

  void set_starting_position(const point starting_position) { _starting_position = starting_position; }
  void set_ending_position(const point ending_position) { _ending_position = ending_position; }
  void set_map(map_t& map) { _map = &map; }

  std::vector<node_t*> findPath() { return findPath(*_map, _starting_position, _ending_position); };
  void showPath(const std::vector<node_t*>& path) { return showPath(*_map, path); }

  static std::vector<node_t*> findPath(map_t& map, node_t* start_node, node_t* target_node)
  {
    iterableHeap<node_t*> open_set;

    map.refreshMap();

    start_node->set_status(NodeStatus::open);
    open_set.push(start_node);
    while (!open_set.empty()) {
      node_t* current_node = open_set.top();
      open_set.pop();

      current_node->set_status(NodeStatus::closed);

      if (*current_node == *target_node) {
        std::deque<node_t*> path;
        node_t* current_node = target_node;
        while (*current_node != *start_node) {
          path.push_front(current_node);
          current_node = current_node->get_parent();
        }
        path.push_front(current_node);
        return std::vector<node_t*>{path.begin(), path.end()};
      }

      auto ns = map.getNeighbours(*current_node);
      for (auto neighbour : map.getNeighbours(*current_node)) {
        if (!neighbour->isWalkable() || neighbour->get_status() == NodeStatus::closed) {
          continue;
        }

        int new_cost_to_neighbour = current_node->get_g_cost() + current_node->distance(*neighbour) * (1.0 + current_node->get_walk_cost());
        bool is_neighbour_in_open_set = neighbour->get_status() == NodeStatus::open;
        if (new_cost_to_neighbour < neighbour->get_g_cost() || !is_neighbour_in_open_set) {
          neighbour->set_g_cost(new_cost_to_neighbour);
          neighbour->set_h_cost(neighbour->distance(*target_node));
          neighbour->set_parent(current_node);

          if (!is_neighbour_in_open_set) {
            neighbour->set_status(NodeStatus::open);
            open_set.push(neighbour);
          } else {
            std::make_heap(open_set.begin(), open_set.end());
          }
        }
      }
    }

    return {};
  }
  static std::vector<node_t*> findPath(map_t& map, point start_position, point end_position)
  {
    return findPath(map, &map[start_position], &map[end_position]);
  }

 private:
  point _starting_position;
  point _ending_position;
  map_t* _map;
};

}  // namespace astar
```

### 重写gridmap，全部换成三层循环

思路是，A\* 不管寻路是几维的，只要 Node 实现的 distance 方法支持对应的维度，以及 Map 存储的节点是对应的维度，能够寻找到 neighbours，A\* 就可以正常工作。

```C++
namespace gridmap {

template <typename T>
requires std::is_base_of_v<Node<3>, T> class Map
{
  typedef std::vector<std::vector<std::vector<T>>> container;
  typedef std::vector<std::vector<T>> container_layer;
  typedef std::vector<T> container_line;
  typedef bgm::point<int, 3, bg::cs::cartesian> point;

 public:
  Map() : _map_size(0, 0, 0), _grid_size(1, 1, 1) {}

  Map(int x, int y, int z, int sx = 1, int sy = 1, int sz = 1)
      : _map_size(x, y, z), _grid_size(sx, sy, sz), _map(container(x, container_layer(y, container_line(z, T()))))
  {
    setNodeData();
  }

  Map(std::vector<std::vector<std::vector<double>>> map_data, const point& grid_size = point(1, 1, 1))
  {
    _grid_size = grid_size;

    int x = map_data.size();
    if (x > 0) {
      int y = map_data[0].size();
      if (y > 0) {
        int z = map_data[0][0].size();

        _map_size.set<0>(x);
        _map_size.set<1>(x);
        _map_size.set<2>(x);
        _map = container(x, container_layer(y, container_line(z, T())));

        setNodeData(map_data);
      }
    }
  }

  void setNodeData(std::vector<std::vector<std::vector<double>>> map_data = {})
  {
    for (int i = 0; i < _map_size.get<0>(); ++i) {
      for (int j = 0; j < _map_size.get<1>(); ++j) {
        for (int k = 0; k < _map_size.get<2>(); ++k) {
          bg::set<0>(_map[i][j][k].set_position(), i * (_grid_size.get<0>()));
          bg::set<1>(_map[i][j][k].set_position(), j * (_grid_size.get<1>()));
          bg::set<2>(_map[i][j][k].set_position(), k * (_grid_size.get<2>()));
          if (map_data.size() > 0) {
            _map[i][j][k].set_walk_cost(map_data[i][j][k]);
          }
        }
      }
    }
  }

  const point& get_map_size() { return _map_size; }

  T& operator[](const point& p) { return _map[p.get<0>()][p.get<1>()][p.get<2>()]; }

  std::vector<T*> getNeighbours(const point& p)
  {
    std::vector<T*> neighbours;

    for (int i = -1; i <= 1; ++i) {
      for (int j = -1; j <= 1; ++j) {
        for (int k = -1; k <= 1; ++k) {
          int x = p.get<0>() + i;
          int y = p.get<1>() + j;
          int z = p.get<2>() + k;
          if (((i == 0 && j == 0 && k != 0) || (i == 0 && j != 0 && k == 0) || (i != 0 && j == 0 && k == 0)) && x >= 0 && y >= 0 && z >= 0
              && x < _map_size.get<0>() && y < _map_size.get<1>() && z < _map_size.get<2>()) {
            neighbours.push_back(&_map[x][y][z]);
          }
        }
      }
    }

    return neighbours;
  }

  std::vector<T*> getNeighbours(const T& n) { return getNeighbours(n.get_position()); }

  void refreshMap()
  {
    for (auto& layer : _map) {
      for (auto& line : layer) {
        for (auto& item : line) {
          item.refresh();
        }
      }
    }
  }

 private:
  point _map_size;
  point _grid_size;
  container _map;
};

}  // namespace gridmap
```

### 可迭代的优先队列

为了杜绝寻路过程中堆结构被破坏，所以如果修改的节点已经在优先队列中，需要重新建堆，下面的类可以使用`std::make_heap`函数：

```C++
namespace astar {

template <typename T>
struct lowerFCost
{
  bool operator()(T n1, T n2)
  {
    if (n1->get_f_cost() == n2->get_f_cost()) {
      return n1->get_h_cost() > n2->get_h_cost();
    }
    return n1->get_f_cost() > n2->get_f_cost();
  }
};

template <class T, class Container = std::vector<T>, class Compare = lowerFCost<T>>
class iterableHeap : public std::priority_queue<T, Container, Compare>
{
 public:
  typedef typename std::priority_queue<T, Container, Compare>::container_type::const_iterator const_iterator;

  const_iterator find(const T& t) const
  {
    auto first = this->c.cbegin();
    auto last = this->c.cend();

    while (first != last) {
      if (*first == t)
        return first;
      ++first;
    }

    return last;
  }

  typename Container::iterator begin() { return this->c.begin(); }
  typename Container::iterator end() { return this->c.end(); }
};

}  // namespace astar
```
