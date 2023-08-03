---
title: 《C++ Primer Plus 第六版》学习笔记3 - 对象和类
date: 2023-07-20 11:19:56
updated: 2023-07-20 11:19:56
cover: cover.jpg
tags:
    - C++
categories:
    - 学习笔记
---

{% note info flat %}
### 目录：
{% post_link cpp-primer-plus-1 %}
{% post_link cpp-primer-plus-2 %}
-> {% post_link cpp-primer-plus-3 %}
{% endnote %}

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

# 第十一章 - 使用类

## 运算符重载

要重载运算符，需要使用被称为运算符函数的特殊函数形式。运算符函数的格式为：`operatorop(argument-list)`
例如`operator+()`重载`+`运算符。

不能虚构一个新的符号用来作为运算符函数。

## 计算时间：一个运算符重载示例

C++对用户定义的运算符重载的限制：
1. 重载后的运算符必须至少有一个操作数是用户定义的类型。
2. 使用运算符时不能喂饭运算符原来的语法规则。例如运算符`%`本来有两个操作数，不能重载为只有一个。也不能修改运算符优先级。
3. 不能创建新运算符。
4. 不能重载下面的运算符：
    - sizeof
    - .：成员运算符
    - . *：成员指针运算符
    - ::：作用域运算符
    - ?:：条件运算符
    - typeid：一个RTTI运算符
    - const_cast
    - dynamic_cast
    - reinterpret_cast
    - static_cast
5. 下面的运算符只能通过成员函数进行重载：
    - =
    - ()
    - []
    - ->

## 友元

友元有三种：
- 友元函数
- 友元类
- 友元成员函数

通过让函数成为类的友元，可以赋予该函数与类的成员函数相同的访问权限。

将函数原型放在类声明中，并加上关键字`friend`来创建友元：`friend Time operator*(double m, const Time & t);`。它不是成员函数，不能使用成员运算符来调用。
它的函数定义不需要加`Time::`限定符：
```C++
Time operator*(double m, const Time &t) {
    // ...
}
```

一般来说，要重载`<<`运算符来显示`c_name`的对象，可使用一个友元函数，其定义如下：
```C++
ostream & operator<<(ostream & os, const c_name & obj) {
    os << ...;
    return os;
}
```

## 重载运算符：作为成员函数还是非成员函数

```C++
Time operator+(const Time & t) const; //member version
// nonmember version
friend Time operator+(const Time & t1, const Time & t2);
```
不能同时选择这两种格式，会被视为二义性错误。

## 再谈重载：一个矢量类

如果方法通过计算得到一个新的类对象，则应考虑是否可以使用类构造函数来完成这种工作。这样做不仅可以避免麻烦，而且可以确保新的对象是按照正确的方式创建的。

因为运算符重载是通过函数来实现的，所以只要运算符函数的特征标不同，使用的运算符数量与相应的内置C++运算符相同，九可以多次重载同一个运算符。

## 类的自动转换和强制类型转换

如果类有接受一个参数的构造函数，则具备了自动类型转换的条件，例如：
```C++
Stonewt(double lbs);    // template for double-to-Stonewt conversion

Stonewt myCat;
myCat = 19.6;
```
程序会使用构造函数`Stonewt(double)`来创建一个临时的`Stonewt`对象，并将`19.6`作为初始化值。随后，采用逐成员赋值方式将该临时对象的内容复制到`myCat`中。这一过程称为隐式转换，它是自动进行的。

如果不想编译器做这样的隐式转换，可以在声明构造函数时加上关键字`explicit`，如`explicit Stonewt(double lbs);`。

隐式转换可以发生在以下场景中：
- 将`Stonewt`对象初始化为`double`值时。
- 将`double`值赋给`Stonewt`对象时。
- 将`double`值传递给接受`Stonewt`参数的函数时。
- 返回值被声明为`Stonewt`的函数试图返回`double`类型时。
- 在上述任意一种情况下，使用可转换为`double`类型的内置类型时。

如果要将一个`Stonewt`类型的对象赋值给一个`double`类型的变量，此时转换函数就派上用场了。要转换为`typeName`类型，需要使用这种形式的转换函数：`operator typeName();`。
需注意的是：
- 转换函数必须是类方法
- 转换函数不能指定返回类型
- 转换函数不能有参数
例如，转换为`double`类型的函数的原型如下：`operator double();`

同样的，如果进行了二次转换，出现二义性问题的时候编译器将拒绝这样的语句。

有两种使用转换函数的方式：
- `double host = double(wolfe)`
- `double thinker = (double)wolfe`

C++11中，转换函数也可以使用`explicit`关键字修饰为显式的。

# 第十二章 - 类和动态内存分配

## 动态内存和类

C++ 自动提供了下面这些成员函数：
- 默认构造函数，如果没有定义构造函数；
- 默认析构函数，如果没有定义；
- 复制构造函数，如果没有定义；
- 赋值运算符，如果没有定义；
- 地址运算符，如果没有定义。

复制构造函数的原型：`Class_name(const Class_name &);`
新建一个对象并将其初始化为同类现有对象时，复制构造函数都将被调用。例如：
```C++
StringBad ditto(motto);
StringBad metoo = motto;
StringBad also = StringBad(motto);
StringBad * pStringBad = new StringBad(motto);
```
中间两种声明可能会使用复制构造函数直接创建`metoo`和`also`，也可能使用复制构造函数生成一个临时对象，然后将临时对象的内容赋给`metoo`和`also`，这取决于具体实现。
当程序生成了对象副本时，编译器都将使用复制构造函数。

默认的复制构造函数逐个复制非静态成员（成员复制也称为浅复制），复制的是成员的值。如果成员本身就是类对象，则将使用这个类的复制构造函数来复制成员对象。

如果类中包含了使用`new`初始化的指针成员，应当定义一个复制构造函数，以复制指向的数据，而不是指针，这被称为深度复制。

提供赋值运算符：
- 由于目标对象可能引用了以前分配的数据，所以函数应当使用`delete[]`来释放这些数据。
- 函数应当避免将对象赋给自身；否则，给对象重新赋值前，释放内存操作可能删除对象的内容。
- 函数返回一个指向调用对象的引用。

```C++
StringBad & StringBad::operator=(const StringBad & st) {
    if (this == &st) {
        return *this;
    }
    delete [] str;
    len = st.len;
    str = new char[len+1];
    std::strcpy(str, st.str);
    return *this;
}
```

## 改进后的新`String`类

C++11 引入了新关键字`nullptr`，用于表示空指针。

可以将成员函数声明为静态的，这样做有两个重要的后果：
- 不能通过对象调用静态成员函数，静态成员函数不能使用`this`指针。如果静态成员函数是在公有部分声明的，则可以使用类名和作用域解析运算符来调用它。
- 由于静态成员函数不与特定的对象关联，因此只能使用静态数据成员。

{% note warning %}

可是实践说明通过对象调用静态成员或者静态成员函数都是能够编译，而且表现正常的。

{% endnote %}

## 在构造函数中使用`new`时应注意的事项

- 如果在构造函数中使用`new`来初始化指针成员，则应在析构函数中使用`delete`。
- `new`和`delete`必须互相兼容。`new`对应于`delete`，`new[]`对应于`delete[]`。
- 如果有多个构造函数，则必须以同样的方式使用`new`，要么都带中括号，要么都不带。
- 应定义一个复制构造函数，通过深度复制将一个对象初始化为另一个对象。
- 应当定义一个赋值运算符，铜鼓深度复制将一个对象复制给另一个对象。

## 有关返回对象的说明

如果返回的对象是被调用函数中的局部变量，则不应按引用方式返回它。

## 使用指向对象的指针

在下述情况下析构函数将被调用：
- 如果对象是动态变量，则当执行完定义该对象的程序块时，将调用该对象的析构函数。
- 如果对象是静态变量，则在程序结束时将调用对象的析构函数。
- 如果对象是用`new`创建的，则仅当您显示使用`delete`删除对象时，其析构函数才会被调用。

`delete`可与常规`new`运算符配合使用，但不能与定位`new`运算符配合使用。所以使用定位`new`产生的对象，其析构函数有时候需要被显示的调用。

## 复习各种技术

- 要重载定义`<<`运算符，以便将它和`cout`一起用来显示对象的内容：
```C++
ostream & operator<<(ostream & os, const c_name &obj) {
    os << ...;
    return os;
}
```
- 转换函数`c_name(type_name value);`和`operator type_name();`
- 成员动态申请内存的类，需设计好内存管理

## 队列模拟

在类声明中声明的结构、类或枚举被称为是被嵌套在类中，其作用域为整个类。这种声明不会创建数据对象，而只是制定了可以在类中使用的类型。

C++11 允许您以更直观的方式进行初始化（类内初始化）：
```C++
class Classy {
    int mem1 = 10;
    const int mem2 = 20;
    // ...
}
```

# 第十三章 - 类继承

## 一个简单的基类

从一个类派生出另一个类时，原始类称为基类，继承类称为派生类。

派生一个类的语法类似于：
```C++
class RatedPlayer : public TableTennisPlayer {
    ...
};
```

- 派生类对象存储了基类的数据成员（派生类继承了基类的实现）。
- 派生类对象可以使用基类的方法（派生类继承了基类的接口）。
- 派生类需要自己的构造函数。
- 派生类可以根据需要添加额外的数据成员和成员函数。

派生类不能直接访问基类的私有成员，而必须通过基类方法进行访问。

创建派生类对象时，程序首先创建基类对象。

有关派生类构造函数的要点如下：
- 首先创建基类对象
- 派生类构造函数应通过成员初始化列表将基类信息传递给基类构造函数
- 派生类构造函数应初始化派生类新增的数据成员

释放对象的顺序与创建对象的顺序相反，即首先执行派生类的析构函数，然后自动调用基类的析构函数。

基类指针可以在不进行显式类型转换的情况下指向派生类对象；基类引用可以在不进行显式类型转换的情况下引用派生类对象。不可以将基类对象和地址赋给派生类引用和指针。

## 继承：is-a 关系

公有继承时最常用的方式，它建立一种 is-a 关系，即派生类对象也是一个基类对象，可以对基类对象执行的任何操作，也可以对派生类对象执行。

## 多态公有继承

两种重要的机制可用于实现多态公有继承：
- 在派生类中重新定义基类的方法
- 使用虚方法

如果析构函数不是虚的，则将只调用对应于指针类型的析构函数。

## 静态联编和动态联编

在编译过程中进行联编称为静态联编（static binding）。然而，虚函数使这项工作变得更困难。所以编译器必须生成能够在程序运行时选择正确的虚方法的代码，这称为动态联编（dynamic binding），又称为晚期联编（late binding）。

将派生类引用或指针转换为基类引用或指针被称为向上强制转换（upcasting），这使公有继承不需要进行显式类型转换。向下强制转换（downcasting），如果不使用显式类型转换，则是不允许的。

通常，编译器处理虚函数的方法是：给每个对象添加一个隐藏成员。隐藏成员中保存了一个指向函数地址数组的指针。这种数组称为虚函数表（virtual function table, vtbl）。虚函数表中存储了为类对象进行声明的函数的地址。

调用虚函数时，程序将查看存储在对象中的 vtbl 地址，然后转向相应的函数地址表。如果使用类声明中定义的第一个虚函数，则程序将使用数组中的第一个函数地址，并执行具有该地址的函数。

虚函数的一些要点：
- 在基类方法的声明中使用关键字 virtual 可视同该方法在基类以及所有的派生类（包括从派生类派生出来的类）中是虚的。
- 如果使用指向对象的引用或指针来调用虚方法，程序将使用为对象类型定义的方法，而不使用为引用或指针类型定义的方法。
- 如果定义的类将被用作基类，则应将哪些要在派生类中重新定义的类方法声明为虚的。

构造函数不能是虚函数。

析构函数应当是虚函数，除非不用做基类。做了以下实验：
```C++
class BaseClass {
public:
    int number;
    
    BaseClass() : number(0) {}
    
    virtual void printNumber() {
        std::cout << number << std::endl;
    }
    
    ~BaseClass() {
        std::cout << "~BaseClass" << std::endl;
    }
};

class NewClass : public BaseClass {
public:
    
    void printNumber() {
        std::cout << "new!" << std::endl;
    }
    
    ~NewClass() {
        std::cout << "~NewClass" << std::endl;
    }
};

int main(int argc, const char * argv[]) {
    NewClass * new_class = new NewClass();
    
    BaseClass * base = new_class;
    
    new_class->printNumber();
    base->printNumber();
    
    delete base;
    
    return 0;
}
```

输出如下：
```
new!
new!
~BaseClass
```

通常应给基类提供一个虚析构函数，即是它并不需要析构函数。

友元不能是虚函数，因为友元不是类成员，而只有成员才能是虚函数。

如果派生类没有重新定义函数，将使用该函数的基类版本。

重定义将隐藏方法。

## 访问控制：protected

private 和 protected 之间的区别只有在基类派生的类中此阿辉表现出来。派生类的成员可以直接访问基类的保护成员，但不能直接访问基类的私有成员。因此，对于外部世界来说，保护成员的行为与私欲成员相似；但对于派生类来说，保护成员的行为与公有成员相似。

## 抽象基类

当类声明中包含纯虚函数时，则不能创建该类的对象。包含纯虚函数的类值用作基类。将原型声明为虚的方法类似于：`void Move(int nx, ny) = 0;`。
在原型中使用`=0`指出类是一个抽象基类，在类中可以不定义该函数。

## 继承和动态内存分配

## 类设计回顾

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

## 第十一章编程练习

### 1

```C++
//
//  main.cpp
//  11-1
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include "vect.hpp"

int main() {
    using namespace std;
    using VECTOR::Vector;
    srand((unsigned)time(0));
    double direction;
    Vector step;
    Vector result(0.0, 0.0);
    unsigned long steps = 0;
    double target;
    double dstep;
    ofstream fout;

    fout.open("temp.txt");
    cout << "Enter target distance (q to quit): ";
    while (cin >> target) {
        cout << "Enter step length: ";
        if (!(cin >> dstep)) {
            break;
        }
        fout << "Target Distance: " << target;
        fout << ", Step Size: " << dstep << endl;
        fout << "0: " << result << endl;
        while (result.magval() < target) {
            direction = rand() % 360;
            step.reset(dstep, direction, Vector::POL);
            result = result + step;
            steps++;
            fout << steps << ": " << result << endl;
        }
        fout << "After " << steps << " steps, the subject ";
        fout << "has the following location:\n";
        fout << result << endl;
        result.polar_mode();
        fout << " or\n";
        fout << result << endl;
        fout << "Average outward distance per step = ";
        fout << result.magval() / steps << endl;
        fout << endl;

        cout << "After " << steps << " steps, the subject ";
        cout << "has the following location:\n";
        cout << result << endl;
        result.polar_mode();
        cout << " or\n";
        cout << result << endl;
        cout << "Average outward distance per step = ";
        cout << result.magval() / steps << endl;
        steps = 0;
        result.reset(0.0, 0.0);
        cout << "Enter target distance (q to quit): ";
    }
    cin.clear();
    while (cin.get() != '\n')
        continue;
    fout.close();
    cout << "Bye!\n";

    return 0;
}

```

```C++
//
//  vect.hpp
//  11-1
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef vect_hpp
#define vect_hpp

#include <iostream>

namespace VECTOR {
    class Vector {
    public:
        enum Mode {RECT, POL};

    private:
        double x;
        double y;
        double mag;
        double ang;
        Mode mode;
        void set_mag();
        void set_ang();
        void set_x();
        void set_y();

    public:
        Vector();
        Vector(double n1, double n2, Mode form = RECT);
        void reset(double n1, double n2, Mode form = RECT);
        ~Vector();
        double xval() const { return x; }
        double yval() const { return y; }
        double magval() const { return mag; }
        double angval() const { return ang; }
        void polar_mode();
        void rect_mode();
        Vector operator+(const Vector &b) const;
        Vector operator-(const Vector &b) const;
        Vector operator-() const;
        Vector operator*(double n) const;
        friend Vector operator*(double n, const Vector &a);
        friend std::ostream &operator<<(std::ostream &os, const Vector &v);
    };
}

#endif /* vect_hpp */

```

```C++
//
//  vect.cpp
//  11-1
//
//  Created by 郭帆 on 2023/7/20.
//

#include <cmath>
#include "vect.hpp"
using std::atan;
using std::atan2;
using std::cos;
using std::cout;
using std::sin;
using std::sqrt;

namespace VECTOR {
    const double Rad_to_deg = 45.0 / atan(1.0);

    void Vector::set_mag() {
        mag = sqrt(x * x + y * y);
    }

    void Vector::set_ang() {
        if (x == 0.0 && y == 0.0) {
            ang = 0.0;
        } else {
            ang = atan2(y, x);
        }
    }

    void Vector::set_x() {
        x = mag * cos(ang);
    }

    void Vector::set_y() {
        y = mag * sin(ang);
    }

    Vector::Vector() {
        x = y = mag = ang = 0.0;
        mode = RECT;
    }

    Vector::Vector(double n1, double n2, Mode form) {
        mode = form;
        if (form == RECT) {
            x = n1;
            y = n2;
            set_mag();
            set_ang();
        } else if (form == POL) {
            mag = n1;
            ang = n2 / Rad_to_deg;
            set_x();
            set_y();
        } else {
            cout << "Incorrect 3rd argument to Vector() -- ";
            cout << "vector set to 0\n";
            x = y = mag = ang = 0.0;
            mode = RECT;
        }
    }

    void Vector::reset(double n1, double n2, Mode form) {
        mode = form;
        if (form == RECT) {
            x = n1;
            y = n2;
            set_mag();
            set_ang();
        } else if (form == POL) {
            mag = n1;
            ang = n2 / Rad_to_deg;
            set_x();
            set_y();
        } else {
            cout << "Incorrect 3rd argument to Vector() -- ";
            cout << "vector set to 0\n";
            x = y = mag = ang = 0.0;
            mode = RECT;
        }
    }

    Vector::~Vector() {
    }

    void Vector::polar_mode() {
        mode = POL;
    }

    void Vector::rect_mode() {
        mode = RECT;
    }

    Vector Vector::operator+(const Vector &b) const {
        return Vector(x + b.x, y + b.y);
    }

    Vector Vector::operator-(const Vector &b) const {
        return Vector(x - b.x, y - b.y);
    }

    Vector Vector::operator-() const {
        return Vector(-x, -y);
    }

    Vector Vector::operator*(double n) const {
        return Vector(n * x, n * y);
    }

    Vector operator*(double n, const Vector &a) {
        return a * n;
    }

    std::ostream &operator<<(std::ostream &os, const Vector &v) {
        if (v.mode == Vector::RECT) {
            os << "(x,y) = (" << v.x << ", " << v.y << ")";
        } else if (v.mode == Vector::POL) {
            os << "(m,a) = (" << v.mag << ", ";
            os << v.ang * Rad_to_deg << ")";
        } else {
            os << "Vector object mode is invalid";
        }
        return os;
    }
}

```

### 2

```C++
//
//  main.cpp
//  11-2
//
//  Created by 郭帆 on 2023/7/20.
//

#include <iostream>
#include <cstdlib>
#include <ctime>
#include "vect.hpp"

int main() {
    using namespace std;
    using VECTOR::Vector;
    srand((unsigned)time(0));
    double direction;
    Vector step;
    Vector result(0.0, 0.0);
    unsigned long steps = 0;
    double target;
    double dstep;

    cout << "Enter target distance (q to quit): ";
    while (cin >> target) {
        cout << "Enter step length: ";
        if (!(cin >> dstep)) {
            break;
        }
        while (result.magval() < target) {
            direction = rand() % 360;
            step.reset(dstep, direction, Vector::POL);
            result = result + step;
            steps++;
        }
        cout << "After " << steps << " steps, the subject ";
        cout << "has the following location:\n";
        cout << result << endl;
        result.polar_mode();
        cout << " or\n";
        cout << result << endl;
        cout << "Average outward distance per step = ";
        cout << result.magval() / steps << endl;
        steps = 0;
        result.reset(0.0, 0.0);
        cout << "Enter target distance (q to quit): ";
    }
    cout << "Bye!\n";

    return 0;
}

```

```C++
//
//  vect.hpp
//  11-2
//
//  Created by 郭帆 on 2023/7/20.
//

#ifndef vect_hpp
#define vect_hpp

#include <iostream>

namespace VECTOR {
    class Vector {
    public:
        enum Mode{ RECT, POL };

    private:
        double x;
        double y;
        Mode mode;
        double set_mag() const;
        double set_ang() const;
        void set_x(double mag, double ang);
        void set_y(double mag, double ang);

    public:
        Vector();
        Vector(double n1, double n2, Mode form = RECT);
        void reset(double n1, double n2, Mode form = RECT);
        ~Vector();
        double xval() const { return x; }
        double yval() const { return y; }
        double magval() const { return set_mag(); }
        double angval() const { return set_ang(); }
        void polar_mode();
        void rect_mode();
        Vector operator+(const Vector &b) const;
        Vector operator-(const Vector &b) const;
        Vector operator-() const;
        Vector operator*(double n) const;
        friend Vector operator*(double n, const Vector &a);
        friend std::ostream &operator<<(std::ostream &os, const Vector &v);
    };
}

#endif /* vect_hpp */

```

```C++
//
//  vect.cpp
//  11-2
//
//  Created by 郭帆 on 2023/7/20.
//

#include <cmath>
#include "vect.hpp"
using std::atan;
using std::atan2;
using std::cos;
using std::cout;
using std::sin;
using std::sqrt;

namespace VECTOR {
    const double Rad_to_deg = 45.0 / atan(1.0);

    double Vector::set_mag() const {
        return sqrt(x * x + y * y); //计算向量的长度;
    }

    double Vector::set_ang() const {
        if (x == 0.0 && y == 0.0) {
            return 0.0; //若是向量的x坐标和y坐标为0则角度也为0;
        } else {
            return atan2(y, x); //否则计算向量的角度并返回至调用对象;
        }
    }

    void Vector::set_x(double mag, double ang) {
        x = mag * cos(ang);
    }

    void Vector::set_y(double mag, double ang) {
        y = mag * sin(ang);
    }

    Vector::Vector() {
        x = y = 0.0;
        mode = RECT;
    }

    Vector::Vector(double n1, double n2, Mode form) {
        mode = form;
        if (form == RECT) {
            x = n1;
            y = n2;
        } else if (form == POL) {
            set_x(n1, n2 / Rad_to_deg); //使用修改的设置x坐标的函数来更新x坐标值;
            set_y(n1, n2 / Rad_to_deg); //使用修改的设置y坐标的函数来更新y坐标值;
        } else {
            cout << "Incorrect 3rd argument to Vector() -- ";
            cout << "vector set to 0\n";
            x = y = 0.0;
            mode = RECT;
        }
    }

    void Vector::reset(double n1, double n2, Mode form) {
        mode = form;
        if (form == RECT) {
            x = n1;
            y = n2;
        } else if (form == POL) {
            set_x(n1, n2 / Rad_to_deg);
            set_y(n1, n2 / Rad_to_deg);
        } else {
            cout << "Incorrect 3rd argument to Vector() -- ";
            cout << "vector set to 0\n";
            x = y = 0.0;
            mode = RECT;
        }
    }

    Vector::~Vector() {
    }

    void Vector::polar_mode() {
        mode = POL;
    }

    void Vector::rect_mode() {
        mode = RECT;
    }

    Vector Vector::operator+(const Vector &b) const
    {
        return Vector(x + b.x, y + b.y);
    }

    Vector Vector::operator-(const Vector &b) const
    {
        return Vector(x - b.x, y - b.y);
    }

    Vector Vector::operator-() const
    {
        return Vector(-x, -y);
    }

    Vector Vector::operator*(double n) const
    {
        return Vector(n * x, n * y);
    }

    Vector operator*(double n, const Vector &a)
    {
        return a * n;
    }

    std::ostream &operator<<(std::ostream &os, const Vector &v)
    {
        if (v.mode == Vector::RECT)
        {
            os << "(x,y) = (" << v.x << ", " << v.y << ")";
        }
        else if (v.mode == Vector::POL)
        {
            os << "(m,a) = (" << v.magval() << ", ";
            os << v.angval() * Rad_to_deg << ")";
        }
        else
        {
            os << "Vector object mode is invalid";
        }
        return os;
    }
}

```
