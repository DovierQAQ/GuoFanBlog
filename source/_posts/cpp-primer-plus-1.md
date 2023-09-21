---
title: 《C++ Primer Plus 第六版》学习笔记1 - 函数
date: 2023-07-19 09:50:31
updated: 2023-07-19 09:50:31
cover: cover.jpg
katex: true
tags:
    - C++
categories:
    - 学习笔记
---

{% note info flat %}
**系列文章**
-> {% post_link cpp-primer-plus-1 %}
{% post_link cpp-primer-plus-2 %}
{% post_link cpp-primer-plus-3 %}
{% endnote %}

# 第七章 - 函数

## 函数基本知识

在C++的函数原型中，函数括号为空与在括号中使用关键字`void`是等效的——意味着没有参数。在ANSI C中，括号为空意味着不指出参数——意味着将在后面定义参数列表。如果需要在C++中表达此含义，需要使用`...`，即`void say_bye(...);`

## 函数参数和按值传递

C++通常按值传递。

`cin>>`会跳过空格和换行，但`cin.get()`会读取所有的输入字符。

## 函数和数组

C++将数组名解释为其第一个元素的地址，但该规则也有一些例外：
- 数组声明使用数组名来标记存储位置
- 对数组名使用`sizeof`将得到整个数组的长度（单位字节）
- 将`&`作用于数组名时，将返回整个数组的地址（一个内存块）

当且仅当作用于函数头或函数原型中，`int *arr`和`int arr[]`的含义是相同的。

传数组给函数集传数组指针，不违反C++按值传递的规则。

使用`const`来保护数组，例如`void show_array(const double ar[], int n);`

除了在参数中传递数组地址和数组长度的方式，我们也可以使用数组区间的方式，即传入第一个元素的地址作为开头，传入最后一个元素后面的地址，作为结尾。这两个指针就划定了一段数组区间。C++模板库（STL）将区间方法广义化了。

`int age = 39; const int * pt = &age;`表明`pt`指向一个`const int`，换句话说，`*pt`的值为`const`，不能被修改。但可以直接通过`age`来修改这一段内存。
但如果倒过来，`age`是`const`变量，而`pt`定义为非`const`指针，则会导致编译错误。可以思考一下二级指针时的情况。
`int sloth = 3; int * const finger = &sloth;`定义了一个`const`的指针，这种定义下`finger`就只能指向`sloth`
了，不能修改指针的值。

## 函数和二维数组

`int sum(int (*ar2)[4], int size);`或者`int sum(int ar2[][4], int size);`，含义完全相同。

## 函数和C-风格字符串

传`char *`指针。

由于C-风格字符串以`\0`结尾，故使用如下标准方式处理字符串中的字符：
```C++
while (*str) {
    statements
    str++;
}
```

## 函数和结构

C++默认还是按值传递，会拷贝一份结构，如果要避免大量的内存开销，使用结构地址或者使用引用。

## 函数和string对象

与C-风格字符串相比，string对象与结构更相似。

## 函数与array对象

## 递归

## 函数指针

`double (*pf)(int);`。通常，要声明只想特定类型的函数的指针，可以首先编写这种函数的原型，然后用`(*pf)`替换函数名。
如果不加括号，写成了`double *pf(int);`，则声明了一个函数，该函数有着`double *`类型的返回值。

给函数指针赋值时，两者的特征标以及返回类型必须相同。

使用函数指针时，以下两种写法都是可以的：
- `(*pf)()`：原因是既然`pf`是函数指针，那么`*pf`就是函数
- `pf()`：原因是由于函数名时指向该函数的指针，那么指向函数的指针的应为应与函数名相似

两者皆有道理，使用哪种方式看编码规范。

`auto`让函数指针的定义变得简单：
```C++
auto pc = &pa;  // C++11
const double *(*(*pd)[3])(const double *, int) = &pa;   // C++98
```

也可以使用`typedef`：
```C++
typedef const double *(*p_fun)(const double *, int);
p_fun p1 = f1;
p_fun pa[3] = {f1, f2, f3};
p_fun (*pd)[3] = &pa;
```

# 第八章 - 函数探幽

## C++内联函数

通常的做法是省略原型，将整个定义放在本应提供原型的地方，并在前面加上关键字`inline`。

相对于宏定义的简单文本替换来说，内联函数做了更多的检查。

## 引用变量

相当于给变量起别名，是通过`const`指针实现的。
```C++
int rats;
int & rodents = rats
```

引用经常被用作函数参数，使得函数中的变量名成为调用程序中的变量的别名。按饮用传递允许被调用的函数能够访问调用函数中的变量。

左值参数是可被引用的数据对象。常规变量和const变量都可视为左值，因为可以通过地址访问他们。用“可修改的左值”和“不可修改的左值”作区分。

如果接受引用参数的函数的意图是修改作为参数传递的变量，现在的C++标准会禁止创建临时变量（或给出警告）。如果不修改则会宽松一些。
即：如果函数调用的参数不是左值或与相应的`const`引用参数的类型不匹配，则C++将创建类型正确的匿名变量，将函数调用的参数的值传递给该匿名变量，并让参数来引用该变量。

> 应尽可能使用`const`

使用`&&`来声明右值引用：
```C++
double && rref = std::sqrt(36.00);
double j = 15.0;
double && jref = 2.0 * j + 18.5;
```

返回引用时，应注意变量的声明周期。如果实在要返回函数内创建的对象，应使用智能指针。

## 默认参数

`int harpo(int n, int m=4, int j=5)`。对于带参数列表的函数，必须从右向左天假默认值。

调用时不能跳过中间参数。

默认参数在函数原型中给出就好了，在定义时给出会出现重复定义的错误。

## 函数重载

函数重载的关键是函数的参数列表——也称为特征标(function signature)。如果两个函数的参数数目和类型相同，同时参数的排列顺序也相同，则他们的特征标相同。

编译器检查函数特征标时，将把类型引用和类型本身视为同一个特征标。

使用以下技巧可以根据参数是左值、`const`还是右值来定制函数的行为。
```C++
void stove(double &r1);         // matches modifiable lvalue
void stove(const double & r2);  // matches rvalue, const lvalue
void stove(double && r3);       // matches rvalue
```

## 函数模板

建立一个交换模板：
```C++
template <typename AnyType>
void Swap(Anytype &a, AnyType &b) {
    Anytype temp;
    temp = a;
    a = b;
    b = temp;
}
```

有些地方会在`typename`那里换写`class`，这是旧的C++规范，也是可用的。

如果需要多个将同一种算法用于不同类型的函数，请使用模板。如果不考虑向后兼容的问题，并愿意键入较长的单词，则声明类型参数时，应使用关键字`typename`而不使用`class`。

函数原型也应写成模板形式：
```C++
template <typename T>
void Swap(T &a, T &b);
```

函数模板也能重载：
```C++
template <typename T>
void Swap(T &a, T &b);

template <typename T>
void Swap(T *a, T *b, int n);
```

模板代码在编写时，会假定类型具有某些操作，比如赋值、相加等。所以模板的通用化是有限的。
不过可以提供具体化的模板定义，为这些不符合通用模板的类型做特殊处理：
```C++
// non template function prototype
void Swap(job &, job &);

// template prototype
template <typename T>
void Swap(T &, T &);

// explicit specialization for the job type
template <> void Swap<job>(job &, job &);
```
其中`<job>`是可选的，这个写法也是函数模板的具体化：`template <> void Swap(job &, job &);`

在代码中包含函数模板本身并不会生成函数定义，它只是一个用于生成函数定义的方案。编译器为特定类型生成函数定义时，得到的是模板实例(instantiation)。
现在C++允许显式实例化(explicit instantiation)，例如：`template void Swap<int>(int, int);`。（注意与显式具体化相区别）

编译器通过如下步骤决定使用哪个函数版本：
1. 创建候选函数列表。其中包含与被调用函数的名称相同的函数和模板函数。
2. 使用候选函数列表创建可行函数列表。这些都是参数数目正确的函数，为此有一个隐式转换序列，其中包括实参类型与相应的形参完全匹配的情况。
3. 确定是否有最佳的可行函数。如果有则使用它，否则该函数调用出错。

完全匹配和最佳匹配

使用`decltype`可以确定类型：
```C++
template<class T1, class T2>
void ft(T1 x, T2 y) {
    // ...
    decltype(x+y) xpy = x+y;
    // ...
}
```

后置返回类型，由于需要使用`decltype`来确定返回值类型，但是在函数参数列表出来之前`decltype`中的变量还未定义，所以先使用`auto`占位，后面再指定类型。
```C++
template<class T1, class T2>
auto gt(T1 x, T2 y) -> decltype(x+y) {
    // ...
    return x + y;
}
```

# 编程练习

## 第七章编程练习

### 1
编写一个程序，不断要求用户输入两个数，直到其中的一个为0。对于每两个数，程序将使用一个函数来计算他们的调和平均数，并将结果返回给`main()`，而后者将报告结果。调和平均数指的是倒数平均值的倒数，计算公式如下：
$$
\text{调和平均数}={2xy \over (x+y)}
$$

```C++
#include <iostream>

using namespace std;

double calc_avg(int x, int y);

int main() {
    int x, y;
    while (true) {
        cout << "input two numbers: ";

        cin >> x >> y;
        if (x*y == 0) break;

        cout << "result: " << calc_avg(x, y) << endl;
    }

    return 0;
}

double calc_avg(int x, int y) {
    return 2.0 * x * y / (x+y);
}
```

### 2
不抄题了
```C++
#include <iostream>

using namespace std;

const int MAX_LEN = 10;

int input_score(int s[], int size);
void show_score(const int s[], int size);
double calc_avg(const int s[], int size);

int main() {
    int scores[MAX_LEN] = {};
    int size = MAX_LEN;
    double avg;

    size = input_score(scores, size);
    show_score(scores, size);
    avg = calc_avg(scores, size);

    cout << "average score: " << avg << endl;

    return 0;
}

int input_score(int s[], int size) {
    int x;

    cout << "input atmost 10 scores(-1 to finish): ";

    int i;
    for (i = 0; i < size; i++) {
        cin >> x;
        if (x < 0) break;
        s[i] = x;
    }
    return i;
}

void show_score(const int s[], int size) {
    cout << "score: ";
    for (int i = 0; i < size; i++) {
        cout << s[i] << " ";
    }
    cout << endl;
}

double calc_avg(const int s[], int size) {
    double sum;

    for (int i = 0; i < size; i++) {
        sum += s[i];
    }

    return sum / size;
}
```

### 3

```C++
#include <iostream>
#include <string>

using namespace std;

struct box
{
    char maker[40];
    float height;
    float width;
    float length;
    float volume;
};

void show_box(const box b);
void calc_volume(box *b);

int main() {
    box b = {"this is a box.", 1, 2, 3};

    show_box(b);
    calc_volume(&b);
    show_box(b);

    return 0;
}

void show_box(const box b) {
    cout << "maker: " << string(b.maker) << endl;
    cout << "height: " << b.height << endl;
    cout << "width: " << b.width << endl;
    cout << "length: " << b.length << endl;
    cout << "volume: " << b.volume << endl;
}

void calc_volume(box *b) {
    b->volume = b->height * b->length * b->width;
}
```

### 4

```C++
#include <iostream>

using namespace std;

long double probablilty(unsigned number, unsigned picks);

int main() {
    double field_total_number, choices, range_total_number;
    cout << "Enter the total number of field choices on the game card and\n"
            "the number of picks allowd and\n"
            "the total number of range choices on the game card: " << endl;
    while ((cin >> field_total_number >> choices >> range_total_number) && choices <= field_total_number) {
        cout << "you have one chance in ";
        cout << probablilty(field_total_number, choices) * probablilty(range_total_number, 1);
        cout << " of winning.\n";
        cout << "Next two numbers (q to quit): ";
    }
    cout << "bye" << endl;

    return 0;
}

long double probablilty(unsigned number, unsigned picks) {
    long double result = 1.0;
    long double n;
    unsigned p;

    for (n = number, p = picks; p > 0; n--, p--) {
        result = result * n / p;
    }

    return result;
}
```

### 5

```C++
#include <iostream>

using namespace std;

long long factorial(unsigned n);

int main() {
    int n;

    while (true) {
        cout << "Enter a number: ";

        if (!(cin >> n) || n < 0) break;

        cout << "result: " << factorial(n) << endl;
    }

    return 0;
}

long long factorial(unsigned n) {
    if (n == 0) return 1;
    return n * factorial(n-1);
}
```

### 6

```C++
#include <iostream>

using namespace std;

const int MAX_LEN = 10;

int Fill_array(double a[], int size);
void Show_array(const double a[], int size);
void Reverse_array(double a[], int size);

int main() {
    double a[MAX_LEN] = {};
    int size = MAX_LEN;

    size = Fill_array(a, size);
    Show_array(a, size);
    Reverse_array(a, size);
    Show_array(a, size);
    Reverse_array(&a[1], size-2);
    Show_array(a, size);

    return 0;
}

int Fill_array(double a[], int size) {
    int i;
    double x;
    for (i = 0; i < size; i++) {
        cout << "input a double value (s to stop): ";
        if (!(cin >> x)) break;
        a[i] = x;
    }
    return i;
}

void Show_array(const double a[], int size) {
    cout << "array: ";
    for (int i = 0; i < size; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
}

void Reverse_array(double a[], int size) {
    int i = 0, j = size-1;
    while (i < j) {
        double temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        i++;
        j--;
    }
}
```

### 7

```C++
// arrfun3.cpp -- array functions and const
#include <iostream>
const int Max = 5;

// function prototypes
double* fill_array(double ar[], int limit);
void show_array(const double ar[], double* end);  // don't change data
void revalue(double r, double ar[], double* end);
 
int main()
{
    using namespace std;
    double properties[Max];
 
    double* end = fill_array(properties, Max);
    show_array(properties, end);
    if (end > properties)
    {
        cout << "Enter revaluation factor: ";
        double factor;
        while (!(cin >> factor))    // bad input
        {
            cin.clear();
            while (cin.get() != '\n')
                continue;
            cout << "Bad input; Please enter a number: ";
        }
        revalue(factor, properties, end);
        show_array(properties, end);
    }
    cout << "Done.\n";
    // cin.get();
    // cin.get();
    return 0;
}
 
double* fill_array(double ar[], int limit)
{
    using namespace std;
    double temp;
    int i;
    double *p = ar;
    for (i = 0; i < limit; i++)
    {
        cout << "Enter value #" << (i + 1) << ": ";
        cin >> temp;
        if (!cin)    // bad input
        {
            cin.clear();
            while (cin.get() != '\n')
                continue;
            cout << "Bad input; input process terminated.\n";
            break;
        }
        else if (temp < 0)     // signal to terminate
            break;
        *p = temp;
        p++;
    }
    return p;
}
 
// the following function can use, but not alter,
// the array whose address is ar
void show_array(const double ar[], double* end)
{
    using namespace std;
    const double *p = ar;
    for (int i = 0; p != end; i++, p++)
    {
        cout << "Property #" << (i + 1) << ": $";
        cout << *p << endl;
    }
}
 
// multiplies each element of ar[] by r
void revalue(double r, double ar[], double* end)
{
    for (double *p = ar; p != end; p++)
        *p *= r;
}
```

### 8

```C++
#include <iostream>

using namespace std;

const int Seasons = 4;
const char *Snames[] = {"Spring", "Summer", "Fall", "Winter"};

struct Expense {
    double value[Seasons];
};

void fill(double pa[]);
void show(double da[]);
void fill(Expense &e);
void show(Expense &e);

int main() {
    double expenses[Seasons];
    Expense e;

    fill(expenses);
    show(expenses);

    fill(e);
    show(e);

    return 0;
}

void fill(double pa[]) {
    for (int i = 0; i < Seasons; i++) {
        cout << "Enter " << Snames[i] << " expenses: ";
        cin >> pa[i];
    }
}

void show(double da[]) {
    double total = 0.0;
    cout << "\nEXPENSES\n";
    for (int i = 0; i < Seasons; i++) {
        cout << Snames[i] << ": $" << da[i] << endl;
        total += da[i];
    }
    cout << "Total Expenses: $" << total << endl;
}

void fill(Expense &e) {
    fill(e.value);
}

void show(Expense &e) {
    show(e.value);
}
```

### 9

```C++
#include <iostream>

using namespace std;

const int SLEN = 30;

struct student {
    char fullname[SLEN];
    char hobby[SLEN];
    int ooplevel;
};

int getinfo(student pa[], int n);
void display1(student st);
void display2(const student * ps);
void display3(const student pa[], int n);

int main() {
    cout << "Enter class size: ";
    int class_size;
    cin >> class_size;
    while (cin.get() != '\n') continue;

    student * ptr_stu = new student[class_size];
    int entered = getinfo(ptr_stu, class_size);
    for (int i = 0; i < entered; i++) {
        display1(ptr_stu[i]);
        display2(&ptr_stu[i]);
    }
    display3(ptr_stu, entered);
    delete[] ptr_stu;
    cout << "Done" << endl;

    return 0;
}

int getinfo(student pa[], int n)
{
    int i;
    
    cout << "You can enter up to " << n;
    cout << " students' messages (enter to terminate)." << endl;
    for (i = 0; i < n; i++)
    {
        cout << "Student #" << i + 1 << ": " << endl;
        cout << "Enter the fullname(a blank line to quit): ";
        cin.getline(pa[i].fullname, SLEN);
        if ('\0' == pa[i].fullname[0])
        {
            break;
        }
        cout << "Enter the hobby: ";
        cin.getline(pa[i].hobby, SLEN);
        cout << "Enter the ooplevel: ";
        while (!(cin >> pa[i].ooplevel))
        {
            cin.clear();
            while (cin.get() != '\n')
                continue;
            cout << "Please enter an number: ";
        }
        cin.get(); //吸收正确输入时的换行符;
    }
    return i;
}

void display1(student st)
{
    cout << "\nName: " << st.fullname << endl;
    cout << "Hobby: " << st.hobby << endl;
    cout << "Ooplevel: " << st.ooplevel << endl;
}

void display2(const student *ps)
{
    cout << "\nName: " << ps->fullname << endl;
    cout << "Hobby: " << ps->hobby << endl;
    cout << "Ooplevel: " << ps->ooplevel << endl;
}

void display3(const student pa[], int n)
{
    if (n > 0)
    {
        cout << "\nAll students' information:" << endl;
        for (int i = 0; i < n; i++)
        {
            display2(&pa[i]);
        }
    }
}
```

### 10

```C++
#include <iostream>

using namespace std;

typedef double (*operation_func)(double, double);

double add(double x, double y);
double sub(double x, double y);
double mul(double x, double y);
double div(double x, double y);
double calculate(double x, double y, operation_func f);

int main() {
    operation_func pf[] = {add, sub, mul, div};

    double x, y;
    while (true) {
        cout << "Enter two numbers (q to quit): ";
        if (!(cin >> x >> y)) break;
        for (int i = 0; i < 4; i++) {
            cout << calculate(x, y, pf[i]) << endl;
        }
    }

    return 0;
}

double add(double x, double y) {
    cout << x << "+" << y << "=";
    return x+y;
}

double sub(double x, double y) {
    cout << x << "-" << y << "=";
    return x-y;
}

double mul(double x, double y) {
    cout << x << "*" << y << "=";
    return x*y;
}

double div(double x, double y) {
    cout << x << "/" << y << "=";
    return x/y;
}

double calculate(double x, double y, operation_func f) {
    return f(x, y);
}
```

## 第八章编程练习

### 1

```C++
#include <iostream>
#include <string>

using namespace std;

void print_str(string *str, int n);

int main() {
    string s;
    int n;

    cout << "Enter a string: ";
    getline(cin, s);
    cout << "Enter a number: ";
    cin >> n;

    print_str(&s, n);

    return 0;
}

void print_str(string *str, int n) {
    cout << n << " string left: " << *str << endl;
    if (n > 1) {
        print_str(str, --n);
    }
}
```

### 2

```C++
#include <iostream>
#include <string>

using namespace std;

struct CandyBar {
    string brand;
    double weight;
    int heat;
};


CandyBar & create_candybar(CandyBar &c, const char *b = "Millennium Munch", 
                            const double w = 2.85, const int h = 350);

int main() {
    CandyBar c;
    create_candybar(c);
    cout << c.brand << ", " << c.weight << ", " << c.heat << endl;
    create_candybar(c, "hello", 1, 2);
    cout << c.brand << ", " << c.weight << ", " << c.heat << endl;

    return 0;
}

CandyBar & create_candybar(CandyBar &c, const char *b, 
                            const double w, const int h) {
    c.brand = string(b);
    c.weight = w;
    c.heat = h;

    return c;
}
```

### 3

```C++
#include <iostream>
#include <string>

using namespace std;

string &capitalization(string &s);

int main() {
    string s;
    while (true) {
        cout << "Enter a string (q to quit): ";
        getline(cin, s);
        if (s == "q") break;
        cout << capitalization(s) << endl;
    }
    cout << "Bye." << endl;

    return 0;
}

string &capitalization(string &s) {
    for (auto &c : s) {
        c = toupper(c);
    }
    return s;
}
```

### 4

```C++
#include <iostream>

using namespace std;

#include <cstring>

struct stringy {
    char * str;
    int ct;
};

void set(struct stringy &in_stringy, char * in_string);
void show(const struct stringy &in_stringy, int print_times = 1);
void show(const char * str, int print_times = 1);

int main() {
    stringy beany;
    char testing[] = "Reality isn't what it used to be.";

    set(beany, testing);
    show(beany);
    show(beany, 2);
    testing[0] = 'D';
    testing[1] = 'u';
    show(testing);
    show(testing, 3);
    show("Done!");

    return 0;
}

void set(struct stringy &in_stringy, char * in_string) {
    int string_length = strlen(in_string);
    in_stringy.str = new char(string_length + 1);
    strcpy(in_stringy.str, in_string);
    in_stringy.ct = string_length;
}

void show(const struct stringy &in_stringy, int print_times) {
    for (int i = 0; i < print_times; i++) {
        cout << "member string of struct stringy: " << in_stringy.str << endl;
    }
}

void show(const char * str, int print_times) {
    for (int i = 0; i < print_times; i++) {
        cout << "Print char string: " << str << endl;
    }
}
```

### 5

```C++
#include <iostream>

using namespace std;


template <typename T>
T max5(T arr[5]);

int main() {
    int a[] = {1, 2, 3, 4, 5};
    double b[] = {2, 3, 4, 5, 6};

    cout << max5(a) << endl;
    cout << max5(b) << endl;

    return 0;
}

template <typename T>
T max5(T arr[5]) {
    T max = arr[0];
    for (int i = 1; i < 5; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}
```

### 6

```C++
#include <iostream>

using namespace std;

template <typename T>
T maxn(T arr[], int n);

template <> const char * maxn(const char *arr[], int n);

int main() {
    int a[] = {1, 2, 3, 4, 5, 6};
    double b[] = {4, 3, 2, 1};
    const char *c[] = {"hello", "a", "b", "world!", "c"};

    cout << maxn(a, 6) << endl;
    cout << maxn(b, 4) << endl;
    cout << maxn(c, 5) << endl;

    return 0;
}

template <typename T>
T maxn(T arr[], int n) {
    T max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

template <> const char * maxn(const char *arr[], int n) {
    int max_len = strlen(arr[0]);
    const char * longest_str = arr[0];
    for (int i = 1; i < n; i++) {
        int l = strlen(arr[i]);
        if (l > max_len) {
            max_len = l;
            longest_str = arr[i];
        }
    }
    return longest_str;
}
```

### 7

```C++
#include <iostream>

using namespace std;

template <typename T>
T SumArray(T arr[], int n);

template <typename T>
T SumArray(T * arr[], int n);

struct debts {
    char name[50];
    double amount;
};

int main() {
    int thing[6] = { 13, 31, 103, 301, 310, 130 };
    int int_sum = 0;
    struct debts mr_E[3] = 
    {
        {"Ima Wolfe", 2400.0},
        {"Ura Foxe", 1300.0},
        {"Iby Stout", 1800.0}
    };
    double *pd[3];
    double double_sum = 0.0;
 
    for (size_t i = 0; i < 3; i++)
    {
        pd[i] = &mr_E[i].amount;
    }
 
    int_sum = SumArray(thing, 6);
    double_sum = SumArray(pd, 3);
 
    cout << "Sum of int array: " << int_sum << endl;
    cout << "Sum of double* array: " << double_sum << endl;
 
    return 0;
}

template <typename T>
T SumArray(T arr[], int n)
{
    T sum = arr[0];
 
    for (int i = 1; i < n; i++)
    {
        sum += arr[i];
    }
 
    return sum;
}
 
template <typename T>
T SumArray(T * arr[], int n)
{
    T sum = *(arr[0]);
    for (int i = 1; i < n; i++)
    {
        sum += *(arr[i]);
    }
 
    return sum;
}
```
