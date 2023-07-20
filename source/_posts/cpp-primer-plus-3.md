---
title: 《C++ Primer Plus 第六版》学习笔记3 - 对象和类
date: 2023-07-20 11:19:56
updated: 2023-07-20 11:19:56
cover:
tags:
    - C++
categories:
    - 学习笔记
---

# 第十章 - 对象和类

OOP特性：
- 抽象
- 封装和数据隐藏
- 多台
- 继承
- 代码的可重用性

## 过程性编程和面向对象编程

这里课本讲的比较抽象，大象书上讲的统一过程给了我非常大的启发：利用统一过程的思想，逐步提取出分析模型，提炼出对象和类。

## 抽象和类

结构的默认访问类型是`public`，而类为`private`。

其定义位于类声明中的函数都将自动成为内联函数。当然在类声明之外使用`inline`关键字也可以。

典型的类声明的格式如下：
```C++
class className {
private:
    data member declarations
public:
    member function prototypes
};
```

## 类的构造函数和析构函数

两种使用构造函数来初始化对象的方式：
- 显式地调用构造函数：`Stock food = Stock("World Cabbage", 250, 1.25);`
- 隐式地调用构造函数：`Stock garment("Furry Mason", 50, 2.5);`

使用`new`：`Stock *pstock = new Stock("Electroshock Games", 18, 19.0);`

`Stock fluffy_the_cat;`语句调用了默认构造函数。如果没有提供任何构造函数，则C++将自动提供默认构造函数。注意，当且仅当没有定义任何构造函数，编译器才提供默认构造函数。为类定义了构造函数后，程序员就必须为它提供默认构造函数，否则开头的这条语句将报错。
但如果还是想要编译器生成默认构造函数，可以使用以下写法定义默认构造函数：`Stock() = default;`

两种方式定义默认构造函数：
- 给已有构造函数的所有参数提供默认值：`Stock(const string & co = "Error", int n = 0, double pr = 0.0);`
- 定义一个没有参数的构造函数：`Stock();`

隐式调用默认构造函数时，不需要使用圆括号，因为会跟函数定义混淆：
```C++
Stock second(); // declares a function
Stock third;    // calls default constructor
```

析构函数没有参数，因此`Stock`析构函数的原型必须是这样的：`~Stock();`

析构函数调用的几种场景：
- 如果创建的是静态存储类对象，则其析构函数将在程序执行结束时自动被调用。
- 如果创建的是自动存储类对象，则其析构函数将在程序执行完代码块时被自动调用。
- 如果对象是通过`new`创建的，则它将驻留在栈内存或自由存储区中，当使用`delete`来释放内存时，其析构函数将自动被调用。
- 程序可以创建临时对象来完成特定的操作，这种情况下程序将在结束对该对象的使用时自动调用其析构函数。

使用`const`来保证方法不会修改对象，即定义`const`成员函数：`void Stock::show() const;`

如果构造函数只有一个参数，则将对象初始化为一个与参数的类型相同的值时，该构造函数将被调用。

## `this`指针

每个成员函数（包括构造函数和析构函数）都有一个`this`指针。`this`指针指向调用对象。如果方法需要引用整个对象，则可以使用表达式`*this`。之前说的定义`const`尘缘函数，即是将`this`指针限定为了`const`，就不能修改调用对象了。

例如要返回对象本身的一个方法：
```C++
const Stock & Stock::topval(const Stock & s) const {
    if (s.total_val > total_val) {
        return s;
    } else {
        return *this;
    }
}
```

## 对象数组

`Stock mystuff[4];`会为每个对象调用其默认构造函数。

或者使用以下写法，为每个元素调用构造函数，未显式调用构造函数的元素会使用默认构造函数：
```C++
Stock stocks[4] = {
    Stock("NanoSmart", 12.5, 20), 
    Stock(),
    Stock("Monolithic Obelisks", 130, 3.25),
};
```

## 类作用域

使用`static`来定义作用域为类的符号常量：`static const int Months = 12;`

传统的枚举定义中，枚举量发生冲突会导致无法编译，如：
```C++
enum egg {Small, Medium, Large, Jumbo};
enum t_shirt {Small, Medium, Large, Xlarge};
```
C++11提供了一种新枚举，其枚举作用域为类，如：
```C++
enum class egg {Small, Medium, Large, Jumbo};
enum class t_shirt {Small, Medium, Large, Xlarge};
```
也可以使用`struct`代替`class`。
使用时，需使用枚举名来限定枚举变量：
```C++
egg choice = egg::Large;
t_shirt Floyd = t_shirt::Large;
```

作用域内的枚举不能隐式地转换为整形。必要时，可进行显式类型转换：`int Frodo = int(t_shirt::Small);`

默认情况下，C++11作用域内枚举的底层类型为`int`。如果要使用其他类型，使用这种写法：`enum class : short pizza {Small, Medium, Large, Xlarge};`

## 抽象数据类型

使用`stack`的例子来说明ADT思想。课本中给出的是使用`typedef`来支持不同类型的方式，我修改成了使用模板的版本：
```C++
#ifndef stack_hpp
#define stack_hpp

template <typename T>
class Stack {
private:
    enum {MAX = 10};
    T items[MAX];
    int top;
public:
    Stack() : top(0) {}
    
    bool isempty() const { return top == 0; }
    
    bool isfull() const { return top == MAX; }
    
    bool push(const T & item) {
        if (top < MAX) {
            items[top++] = item;
            return true;
        } else {
            return false;
        }
    }
    
    bool pop(T & item) {
        if (top > 0) {
            item = items[--top];
            return true;
        } else {
            return false;
        }
    }
};

#endif /* stack_hpp */

```

# 编程练习

## 第十章编程练习

### 1

```C++
//
//  main.cpp
//  10-1
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "account.hpp"

using namespace std;

int main(int argc, const char * argv[]) {
    Account temp("GuoFan", "1002", 666);

    cout << "Information of depositors:" << endl;
    temp.show();
    cout << "\nDeposit -1 dollar:" << endl;
    temp.deposit(-1);
    cout << "\nDeposit 100 dollars:" << endl;
    temp.deposit(100);
    cout << "\nWithdraw 6666 dollars:" << endl;
    temp.withdraw(6666);
    cout << "\nWithdraw 99 dollars:" << endl;
    temp.withdraw(99);
    cout << "\nNow information of depositors:" << endl;
    temp.show();
    cout << "Bye." << endl;
    
    return 0;
}
```

```C++
//
//  account.hpp
//  10-1
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef account_hpp
#define account_hpp

#include <string>

class Account {
private:
    std::string name;
    std::string account;
    double balance;
public:
    Account() = default;
    Account(const std::string &n, const std::string &a, double b = 0.0) : name(n), account(a), balance(b) {};
    void show() const;
    void deposit(double cash);
    void withdraw(double cash);
};

#endif /* account_hpp */

```

```C++
//
//  account.cpp
//  10-1
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "account.hpp"

void Account::show() const {
    std::cout << "name: " << name << std::endl;
    std::cout << "account: " << account << std::endl;
    std::cout << "balance: " << balance << std::endl;
}

void Account::deposit(double cash) {
    if (cash <= 0) {
        std::cout << "invalid value! deposit fail." << std::endl;
        return;
    }
    balance += cash;
}

void Account::withdraw(double cash) {
    if (cash <= 0 || cash > balance) {
        std::cout << "invalid value! withdraw fail." << std::endl;
        return;
    }
    balance -= cash;
}

```

### 2

```C++
//
//  main.cpp
//  10-2
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "person.hpp"

int main(int argc, const char * argv[]) {
    using std::cout;
    using std::endl;

    Person one;
    Person two("Smythecraft");
    Person three("Dimwiddy", "Sam");
    
    one.Show();
    cout << endl;
    one.FormalShow();
    
    two.Show();
    cout << endl;
    two.FormalShow();
    
    three.Show();
    cout << endl;
    three.FormalShow();
    
    return 0;
}

```

```C++
//
//  person.hpp
//  10-2
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef person_hpp
#define person_hpp

#include <string>

class Person {
private:
    static const int LIMIT = 25;
    std::string lname;
    char fname[LIMIT];
public:
    Person() {lname = ""; fname[0] = '\0';}
    Person(const std::string & ln, const char * fn = "Heyyou");
    void Show() const;
    void FormalShow() const;
};

#endif /* person_hpp */

```

```C++
//
//  person.cpp
//  10-2
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include <cstring>
#include "person.hpp"

using namespace std;

Person::Person(const string &ln, const char *fn)
{
    lname = ln;
    strcpy(fname, fn);
}

void Person::Show() const
{
    std::cout << "The name format is:" << endl;
    std::cout << fname << "(firstname), ";
    std::cout << lname << "(lastname).";
}

void Person::FormalShow() const
{
    std::cout << "The name format is:" << endl;
    std::cout << lname << "(lastname), ";
    std::cout << fname << "(firstname)." << endl;
}

```

### 3

```C++
#include <iostream>
#include "golf.h"

const int MAX_LEN = 5;

int main() {
    Golf v[MAX_LEN];
    Golf ann("Ann Birdfree", 24);

    v[0] = ann;

    for (int j = 0; j < MAX_LEN; j++) {
        std::cout << "original: ";
        v[j].show();
        v[j].set_handicap(j-1);
        
        std::cout << "change handicap: ";
        v[j].show();
    }

    return 0;
}

```

```C++
// golf.h -- for pe9-1.cpp

const int Len = 40;
class Golf
{
private:
    char fullname[Len];
    int handicap;
public:
    Golf(const char * name, int hc);
    Golf();
    void set_handicap(int hc);
    void show() const;
};

```

```C++
#include <iostream>
#include <string>
#include "golf.h"

Golf::Golf(const char * name, int hc) {
    strcpy(fullname, name);
    handicap = hc;
}

Golf::Golf() {
    char in_name[Len];
    int in_handicap;
    
    std::cout << "Enter a name: ";
    std::cin.getline(in_name, Len);
    
    std::cout << "Enter handicap: ";
    std::cin >> in_handicap;
    std::cin.get();
    
    *this = Golf(in_name, in_handicap);
}

void Golf::set_handicap(int hc) {
    handicap = hc;
}

void Golf::show() const {
    std::cout << "name: " << fullname << ", handicap: " << handicap << std::endl;
}

```

### 4

```C++
#include <iostream>
#include "sales.hpp"

int main() {
    const double temp[4] = {1.0, 2.0, 3.0, 4.0};
    SALES::Sales objects[2] = {
        SALES::Sales(),
        SALES::Sales(temp, 4)
    };

    objects[0].show();
    objects[1].show();
    std::cout << "Bye." << std::endl;

    return 0;
}

```

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
class Sales {
private:
    double sales[QUARTERS];
    double average;
    double max;
    double min;
public:
    Sales(const double ar[], int n);
    Sales();
    void show() const;
};

void setSales(Sales & s, const double ar[], int n);
void setSales(Sales & s);
void showSales(const Sales & s);

}

#endif /* sales_hpp */

```

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


Sales::Sales(const double ar[], int n) {
    double total = ar[0], maxv = ar[0], minv = ar[0];
    for (int i = 1; i < n; i++)
    {
        sales[i] = ar[i];
        total += ar[i];
        maxv = ar[i] > maxv ? ar[i] : maxv;
        minv = ar[i] < minv ? ar[i] : minv;
    }
    min = minv;
    max = maxv;
    average = total / n;
}

Sales::Sales() {
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
    *this = Sales(temp, len);
    delete[] temp;
}

void Sales::show() const {
    std::cout << "Sales average: " << average << std::endl;
    std::cout << "Sales max: " << max << std::endl;
    std::cout << "Sales min: " << min << std::endl;
}

}

```

### 5

```C++
//
//  main.cpp
//  10-5
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include <string>
#include "stack.hpp"

using namespace std;

struct customer {
    char fullname[35];
    double payment;
    customer(string s = "", double n = 0.0);
};

customer::customer(string s, double n) {
    strcpy(fullname, s.c_str());
    payment = n;
}

int main(int argc, const char * argv[]) {
    Stack<customer> s;
    double total = 0.0;
    
    for (int i = 0; i < 5; i++) {
        s.push(customer(to_string(i), i));
    }
    
    customer c;
    for (int i = 0; i < 5; i++) {
        s.pop(c);
        total += c.payment;
        cout << "total: " << total << endl;
    }
    
    return 0;
}

```

```C++
//
//  stack.hpp
//  10-5
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef stack_hpp
#define stack_hpp

template <typename T>
class Stack {
private:
    enum {MAX = 10};
    T items[MAX];
    int top;
public:
    Stack() : top(0) {}
    
    bool isempty() const { return top == 0; }
    
    bool isfull() const { return top == MAX; }
    
    bool push(const T & item) {
        if (top < MAX) {
            items[top++] = item;
            return true;
        } else {
            return false;
        }
    }
    
    bool pop(T & item) {
        if (top > 0) {
            item = items[--top];
            return true;
        } else {
            return false;
        }
    }
};

#endif /* stack_hpp */

```

### 6

```C++
//
//  main.cpp
//  10-6
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "move.hpp"

int main(int argc, const char * argv[]) {
    Move m;
    
    m.showmove();
    m = m.add(Move(10, 5));
    m.showmove();
    m = m.add(Move(-2, 3));
    m.showmove();
    m.reset();
    m.showmove();
    m.reset(1, 1);
    m.showmove();
    
    return 0;
}

```

```C++
//
//  move.hpp
//  10-6
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef move_hpp
#define move_hpp

#include <iostream>

class Move {
private:
    double x;
    double y;
public:
    Move(double a = 0, double b = 0) : x(a), y(b) {}
    void showmove() const { std::cout << "x: " << x << ", y: " << y << std::endl; }
    Move add(const Move & m) const { return Move(x + m.x, y + m.y); }
    void reset(double a = 0, double b = 0) { x = a; y = b; }
};

#endif /* move_hpp */

```

### 7

```C++
//
//  main.cpp
//  10-7
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "plorg.h"

int main(int argc, const char * argv[]) {
    Plorg one;
    Plorg two("hello");
    Plorg three("world", 1);
    
    one.show();
    two.show();
    three.show();
    
    one.setCI(20);
    one.show();
    
    return 0;
}

```

```C++
//
//  plorg.h
//  cpppp
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef plorg_h
#define plorg_h

#include <iostream>

class Plorg {
private:
    char name[20];
    int CI;
public:
    Plorg(const char *n, int c = 50) {
        strcpy(name, n);
        CI = c;
    }
    Plorg() {
        *this = Plorg("Plorga");
    }
    
    void setCI(int c) { CI = c; }
    void show() const { std::cout << "name: " << name << ", CI: " << CI << std::endl; }
};

#endif /* plorg_h */

```

### 8

```C++
//
//  main.cpp
//  10-8
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include "list.h"

using namespace std;

void print_int(int &n) {
    cout << n << endl;
}

int main(int argc, const char * argv[]) {
    List<int> l;
    
    cout << "empty? " << l.isempty() << endl;
    
    for (int i = 0; i < 5; i++) {
        l.push_back(i);
    }
    cout << "empty? " << l.isempty() << endl;
    
    l.visit(print_int);
    
    cout << "full? " << l.isfull() << endl;
    
    for (int i = 0; i < 100; i++) {
        l.push_back(i);
    }
    cout << "full? " << l.isfull() << endl;
    
    l.visit(print_int);
    
    return 0;
}

```

```C++
//
//  list.h
//  cpppp
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef list_h
#define list_h

template <typename T>
class List {
private:
    enum {MAX = 10};
    T items[MAX];
    int idx;
public:
    List() : idx(0) {}
    
    bool isempty() const { return idx == 0; }
    
    bool isfull() const { return idx == MAX; }
    
    bool push_back(const T & item) {
        if (idx < MAX) {
            items[idx++] = item;
            return true;
        } else {
            return false;
        }
    }
    
    void visit(void (*pf)(T &)) {
        for (int i = 0; i < idx; i++) {
            pf(items[i]);
        }
    }
};

#endif /* list_h */

```
