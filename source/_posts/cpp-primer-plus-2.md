---
title: 《C++ Primer Plus 第六版》学习笔记2 - 内存模型和名称空间
date: 2023-07-19 20:58:50
updated: 2023-07-19 20:58:50
cover: cover.jpg
tags:
    - C++
categories:
    - 学习笔记
---

{% note info flat %}
### 目录：
{% post_link cpp-primer-plus-1 %}
-> {% post_link cpp-primer-plus-2 %}
{% post_link cpp-primer-plus-3 %}
{% endnote %}

# 第九章

## 单独编译

头文件中常包含的内容：
- 函数原型
- 使用`#define`或`const`定义的符号常量
- 结构声明
- 类声明
- 模板声明
- 内联函数

使用如下结构防止头文件被多次编译：
```C++
#ifndef COORDIN_H_
#define COORDIN_H_

// place include file content here

#endif // COORDIN_H_
```

不同的编译器，名称修饰可能不一样，所以不同编译器编译的二进制模块可能无法相互链接。

## 存储持续性、作用域和连接性

- 自动存储持续性
- 静态存储持续性
- 线程存储持续性
- 动态存储持续性

新的定义隐藏了(hide)以前的定义，新定义可见，旧定义暂时不可见。在程序离开该代码块时，原来的定义又重新可见。

自动变量存储在栈中。

C++11之后`register`关键字只是显式地指出变量时自动的。

静态存储持续性变量有三种链接性：
- 外部链接性
- 内部链接性
- 无链接性

所有静态持续变量都有下述初始化特征：未被初始化的静态变量的所有位都被设置为0。这种变量被称为零初始化的(zero-initialized)。

由于单定义规则(One Deginition Rule, ODR)的存在，在引用的地方使用关键字`extern`。

存储说明符：
- `auto`
- `register`
- `static`
- `extern`
- `thread_local`
- `mutable`

cv-限定符：
- `const`
- `volatile`

`mutable`用来指出即使结构（或类）变量为`const`，其某个成员也可以被修改。

常量类型可以放在头文件中，即使多个文件包含了该头文件，也不会出现重复定义错误，这是因为C++对这种情况做了处理。因为默认情况下全局变量的链接性为外部的，但`const`全局变量的链接性为内部的。所以实际上每个文件都有自己的一套常量，而不是所有文件共享这套常量。

可以在函数原型中使用关键字`extern`来指出函数是在另一个文件中定义的。

包含头文件`new`可以使用定位`new`。使用方法例如`p2 = new (buffer1) chaff;`

定位`new`运算符的另一种用法是，将其与初始化结合使用，从而将信息放在特定的硬件地址处。

## 名称空间

用关键字`namespace`来创建名称空间。

名称空间可以是全局的，也可以位于另一个名称空间中，但不能位于代码块中。

全局名称空间(global namespace)，对英语文件级声明区域，因此全局变量被描述为位于全局名称空间中。

未被装饰的名称称为未限定的名称(unqualified name)；包含名称空间的名称称为限定的名称(qualified name)。

`using`声明将特定的名称添加到它所属的声明区域中。如：`using Jill::fetch;`使用`using`声明后，该声明区域中若再需要使用`fetch`，则不需要加`Jill::`。同时`using`声明也一样会隐藏同名的全局变量。
`using`编译使名称空间中的所有名称都可用，而不需要使用作用域解析运算符：`using namespace Jack;`。

一般说来，使用`using`声明比使用`using`编译指令更安全，这是由于它只导入指定的名称。如果该名称与局部名称发生冲突，编译器将发出指示。`using`编译指令导入所有名称，包括可能并不需要的名称。如果与局部名称发生冲突，则局部名称将後盖名称空间版本，而编译器并不会发出警告。

通过省略名称空间的名称来创建未命名的名称空间，作用是控制名称的作用域。

名称空间使用的一些指导原则：
- 使用在已命名的名称空间中声明的变量，而不是使用外部全局变量。
- 使用在己命名的名称空间中声明的变量，而不是使用静态全局变量。
- 如果开发了一个函数库或类库，将其放在一个名称空间中。事实上，C++当前提倡将标准函数库放在名称空间`std`中，这种做法扩展到了来自C语言中的函数。例如，头文件`math.h`是与C语言兼容的，没有使用名称空间，但C++头文件`cmath`应将各种数学库函数放在名称空间`std`中。实际上，并非所有的编译器都完成了这种过渡。
- 仅将编译指令`using`作为一种将旧代码转换为使用名称空间的权宜之计。
- 不要在头文件中使用`using`编译指令。首先，这样做掩盖了要让哪些名称可用；另外，包含头文件的顺序可能影响程序的行为。如果非要使用编译指令`using`，应将其放在所有预处理器编译指令`#include`之后。
- 导入名称时，首选使用作用域解析运算符或`using`声明的方法。
- 对于`using`声明，首选将其作用域设置为局部而不是全局。

# 编程练习

## 第九章编程练习

### 1

`golf.h`
```C++
// golf.h -- for pe9-1.cpp

const int Len = 40;
struct golf
{
    char fullname[Len];
    int handicap;
};

// non-interactive version:
// function sets golf structure to provided name, handicap
// using values passed as arguments to the function
void setgolf(golf & g, const char * name, int hc);

// interactive version:
// function solicits name and handicap from user
// and sets the members of g to the values entered
// returns 1 if name is entered, 0 if name is empty string
int setgolf(golf & g);
// function resets handicap to new value
void handicap(golf & g, int hc);

// function displays contents of golf structure
void showgolf(const golf & g);

```

`golf.cpp`
```C++
#include <iostream>
#include <string>
#include "golf.h"

void setgolf(golf & g, const char * name, int hc) {
    strcpy(g.fullname, name);
    g.handicap = hc;
}

int setgolf(golf & g) {
    std::cout << "Enter a name: ";
    std::cin.getline(g.fullname, Len);
    
    if (strlen(g.fullname) == 0) return 0;
    
    std::cout << "Enter handicap: ";
    std::cin >> g.handicap;
    std::cin.get();
    
    return 1;
}

void handicap(golf & g, int hc) {
    g.handicap = hc;
}

void showgolf(const golf & g) {
    std::cout << "name: " << g.fullname << ", handicap: " << g.handicap << std::endl;
}

```

`main.cpp`
```C++
#include <iostream>
#include "golf.h"

const int MAX_LEN = 5;

int main() {
    golf v[MAX_LEN];
    golf ann;
    setgolf(ann, "Ann Birdfree", 24);

    v[0] = ann;

    int i;
    for (i = 1; i < MAX_LEN && setgolf(v[i]); i++);

    for (int j = 0; j < i; j++) {
        std::cout << "original: ";
        showgolf(v[j]);
        handicap(v[j], j-1);
        std::cout << "change handicap: ";
        showgolf(v[j]);
    }

    return 0;
}

```

### 2

`main.cpp`
```C++
#include <iostream>
#include <string>

using namespace std;

const int ArSize = 10;

void strcount(const string &s);

int main() {
    string input;
    
    cout << "Enter a line:" << endl;
    getline(cin, input);
    while (cin) {
        strcount(input);
        cout << "Enter next line (empty line to quit):" << endl;
        getline(cin, input);
        if (input == "") break;
    }
    cout << "Bye" << endl;
    
    return 0;
}

void strcount(const string &s) {
    static int total = 0;
    cout << "\"" << s << "\" contains " << s.size() << " characters" << endl;
    total += s.size();
    cout << total << " characters total\n";
}

```

### 3

`main.cpp`
```C++
#include <iostream>
#include <new>

using namespace std;

struct chaff {
    char dross[20];
    int slag;
};

char buffer[1024];

int main() {
    chaff *pcha = new (buffer) chaff[2];
    char *pc = new char[1024];
    chaff *pcha2 = new (pc) chaff[2];
    char dross[20] = { 0 };
    int slag = 0;
 
    for (int i = 0; i < 2; i++)
    {
        cout << "Enter dross of #" << i << " chaff: " << endl;
        cin.getline(dross, 20);
        cout << "Enter slag of #" << i << " chaff: " << endl;
        cin >> slag;
        cin.get();
 
        strcpy(pcha[i].dross, dross);
        strcpy(pcha2[i].dross, dross);
        pcha[i].slag = pcha2[i].slag = slag;
    }
 
    for (int i = 0; i < 2; i++)
    {
        cout << "staff #" << (i + 1) << ":" << endl;
        cout << "pcha.dross: " << pcha[i].dross << ". pcha.slag: " << pcha[i].slag << endl;
        cout << "pcha2.dross: " << pcha2[i].dross << ". pcha2.slag: " << pcha2[i].slag << endl;
    }
 
    cout << "address of buffer: " << (void *)buffer << endl;
    cout << "address of pcha: " << pcha << ". address of pcha[0]: " << &pcha[0] << ". address of pcha[1]: " << &pcha[1] << endl;
    cout << "address of pc: " << (void *)pc << endl;
    cout << "address of pcha2:" << pcha2 << ". address of pcha2[0]: " << &pcha2[0] << ". address of pcha2[1]: " << &pcha2[1] << endl;;
 
    delete[] pc;
    
    return 0;
}

```

### 4

`sales.hpp`
```C++
//
//  sales.hpp
//  9-4
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef sales_hpp
#define sales_hpp

namespace SALES {

const int QUARTERS = 4;
struct Sales {
    double sales[QUARTERS];
    double average;
    double max;
    double min;
};

void setSales(Sales & s, const double ar[], int n);
void setSales(Sales & s);
void showSales(const Sales & s);

}

#endif /* sales_hpp */

```

`sales.cpp`
```C++
//
//  sales.cpp
//  9-4
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "sales.hpp"

namespace SALES {

void setSales(Sales &s, const double ar[], int n)
{
    double total = ar[0], maxv = ar[0], minv = ar[0];
    for (int i = 1; i < n; i++)
    {
        s.sales[i] = ar[i];
        total += ar[i];
        maxv = ar[i] > maxv ? ar[i] : maxv;
        minv = ar[i] < minv ? ar[i] : minv;
    }
    s.min = minv;
    s.max = maxv;
    s.average = total / n;
}

void setSales(Sales &s)
{
    using namespace std;
    int len;
    cout << "Enter the length of sales(<= 4 and > 0): ";
    while (!(cin >> len) || len > 4 || len <= 0)
    {
        cin.clear();
        while (cin.get() != '\n')
            continue;
        cout << "Please enter a number(<= 4 and > 0): ";
    }
    double *temp = new double[len];
    cout << "Please enter the sales:" << endl;
    for (int i = 0; i < len; i++)
    {
        cout << "Please enter the content #" << i + 1 << ": ";
        while (!(cin >> temp[i]))
        {
            cin.clear();
            while (cin.get() != '\n')
                continue;
            cout << "Please enter a number: ";
        }
    }
    setSales(s, temp, len);
    delete[] temp;
}

void showSales(const Sales &s)
{
    std::cout << "Sales average: " << s.average << std::endl;
    std::cout << "Sales max: " << s.max << std::endl;
    std::cout << "Sales min: " << s.min << std::endl;
}

}

```

`main.cpp`
```C++
#include <iostream>
#include "sales.hpp"

int main() {
    SALES::Sales objects[2];
    const double temp[4] = {1.0, 2.0, 3.0, 4.0};

    SALES::setSales(objects[0]);
    SALES::setSales(objects[1], temp, 4);
    SALES::showSales(objects[0]);
    SALES::showSales(objects[1]);
    std::cout << "Bye." << std::endl;

    return 0;
}

```
