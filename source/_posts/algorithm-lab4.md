---
title: 算法设计与分析 - 实验4 - 贪心算法实现最佳任务调度实验
date: 2023-05-05 14:05:53
updated: 2023-05-05 14:05:53
cover: 
tags:
    - 贪心算法
    - 任务调度
categories:
    - 课程实验
    - 算法设计与分析
---

## 活动选择问题

对几个互相竞争的活动进行调度，它们都要求以独占的方式使用某一公共资源。而在同一时间内有一个活动能使用这一资源。假设有一个需要使用某一资源的 n 个活动组成的集合 S={a1,a2,a3,...,an}。每个活动 ai 都有一个要求使用该资源的起始时间 si 和一个结束时间 fi,且 si <fi。如果选择了活动 i，则它在半开时间区间[si, fi)内占用资源。若区间[si, fi)与区间[sj, fj)不相交,则称活动 i 与活动 j 是兼容的。
活动选择问题就是要选择出一个由互不兼容的问题组成的最大子集合。

## 任务调度问题

一个单位时间任务是恰好需要一个单位时间完成的任务。给定一个单位时间任务的有限集 S。关于 S 的一个时间表用于描述 S 中单位时间任务的执行次序。时间表中第 1 个任务从时间 0 开始执行直至时间 1 结束，第 2 个任务从时间 1 开始执行至时间 2 结束，…，第 n 个任务从时间 n-1 开始执行直至时间 n 结束。具有截止时间和误时惩罚的单位时间任务时间表问题可描述如下：
- n 个单位时间任务的集合 S={1,2,…,n}（n ≤ 500）；
- 任务 i 的截止时间 d[i], 1 ≤ i ≤ n，1 ≤ d[i] ≤ n，即要求任务 i 在时间 d[i] 之前结束；
- 任务 i 的误时惩罚 1 ≤ w[i] < 1000，1 ≤ i ≤ n, 即任务 i 未在时间 d[i] 之前结束将招致 w[i] 的惩罚；若按时完成则无惩罚。

任务时间表问题要求确定 S 的一个时间表（最优时间表）使得总误时惩罚达到最小。

### 基本思路

由于贪心的思想，对于 w 越大的任务，我们越不希望它超时，所以优先满足 w 值大的任务：
- 对所有任务按照 w 值从大到小排序
- 遍历排序后的任务，对每一个任务做如下操作：
    * 从该任务的 d 值开始往前遍历，看是否有空位给该任务完成
    * 如果有空位，即该任务可以在指定时间内完成，则不计惩罚
    * 如果没有空位，即遍历到第一个时间片了发现全部被其他任务占据，则该任务超时，需记录其惩罚

### 题解

该题有两问：
1. 实现这个问题的贪心算法，并写出流程图或者伪代码。
2. 将每个 Wi 替换为 max{W1,W2……Wn}-Wi 运行算法、比较并分析结果。

对于第一问，直接编译运行下面的程序，输入用例即可得到结果；对于第二问，编译以下程序时加上 `-DUSE_MAX` 编译选项，让代码中的 `#ifdef USE_MAX` 生效。

```C++
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

struct Task {
	int d;
	int w;
};

bool Task_compare(Task& t1, Task& t2) {
	return t1.w > t2.w;
}

int main() {
	// 输入任务个数
	int n;
	cout << "number of tasks: ";
	cin >> n;

	vector<Task> task(n);

	int max_d = 0;
#ifdef USE_MAX
	int max_w = 0;
#endif // USE_MAX

	// 输入任务的 d 和 w 值
	cout << "d: ";
	for (int i = 0; i < n; i++) {
		cin >> task[i].d;
		if (task[i].d > max_d) max_d = task[i].d;
	}
	cout << "w: ";
	for (int i = 0; i < n; i++) {
		cin >> task[i].w;
#ifdef USE_MAX
		if (task[i].w > max_w) max_w = task[i].w;
#endif // USE_MAX
	}

	vector<bool> used(max_d, false);

#ifdef USE_MAX
	// 使用 max{w1, w2, ..., wn} - wi 代替 wi
	for (int i = 0; i < n; i++) task[i].w = max_w - task[i].w;
#endif // USE_MAX

	// 按照 w 值从大到小排序
	sort(task.begin(), task.end(), Task_compare);

	int result = 0;
	for (int i = 0; i < n; i++) {
		bool isovertime = false;
		for (int j = task[i].d; j > 0; j--) {
			if (!used[j - 1]) {
				// 可以按时完成，则跳过累加
				used[j - 1] = true;
				isovertime = true;
				break;
			}
		}
		// 如果不可以满足，则说明一定超时，将 w 值累加到结果
		if (!isovertime) result += task[i].w;
	}

	// 输出结果
	cout << "result: ";
	cout << result << endl;

	return 0;
}
```

### 运行结果

1. 第一问：

```
number of tasks: 7
d: 4 2 4 3 1 4 6
w: 70 60 50 40 30 20 10
result: 50
```

2. 第二问：

```
number of tasks: 7
d: 4 2 4 3 1 4 6
w: 70 60 50 40 30 20 10
result: 10
```

### 复杂度分析

- 对于每一个 d 值，均需遍历 used 数组，所以时间复杂度为 O(n × max{d1, d2, ..., dn})
- 空间复杂度 O(n + max{d1, d2, ..., dn})
