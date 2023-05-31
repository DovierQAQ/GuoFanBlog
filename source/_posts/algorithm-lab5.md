---
title: 算法设计与分析 - 实验5 - 0-1 背包问题的算法设计
date: 2023-05-20 13:08:01
updated: 2023-05-20 13:08:01
cover: 
tags:
    - 贪心算法
    - 任务调度
categories:
    - 课程实验
    - 算法设计与分析
hide: true
---

## 实验原理

### 背包问题

### 0-1 背包问题

### 完全背包问题

### 多重背包问题

## 解决算法

### 动态规划算法

### 贪婪算法

### 回溯法

### 分支定界法

## 实验要求

算法设计：
输入物品数 n，背包容量 c，输入 n 个物品的重量、价值，在以上算法中任选两个实现最优解决 0-1 背包问题。

请问：所选算法的实现流程图或者伪代码是什么？比较时间复杂度和空间复杂度，得出什么结论？

## 题解

```C++
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int c = 10;
int n = 5;
vector<int> w{ 0, 2, 2, 6, 5, 4 };
vector<int> v{ 0, 6, 3, 5, 4, 6 };

int dp_01backpack() {
	vector<vector<int>> dp(n + 1, vector<int>(c + 1, 0));

	for (int i = 1; i <= n; i++) {
		for (int j = 1; j <= c; j++) {
			if (w[i] <= j) {
				dp[i][j] = max(dp[i - 1][j - w[i]] + v[i], dp[i - 1][j]);
			}
			else {
				dp[i][j] = dp[i - 1][j];
			}
		}
	}
	return dp[n][c];
}

struct cmp {
	bool operator ()(const pair<int, int>& a, const pair<int, int>& b) {
		return (double)a.second / (double)a.first < (double)b.second / (double)b.first;
	}
};

int greedy_01backpack() {
	priority_queue<pair<int, int>, vector<pair<int, int>>, cmp> q;
	for (int i = 1; i <= n; i++) {
		q.push(make_pair(w[i], v[i]));
	}

	int result = 0;
	int capacity = c;
	while (!q.empty()) {
		if (capacity >= q.top().first) {
			result += q.top().second;
			capacity -= q.top().first;
		}
		q.pop();
	}
	
	return result;
}

int main() {
	cout << "使用动态规划的结果：" << dp_01backpack() << endl;
	cout << "使用贪婪算法的结果：" << greedy_01backpack() << endl;

	return 0;
}
```

## 总结
