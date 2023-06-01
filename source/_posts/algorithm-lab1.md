---
title: 算法设计与分析 - 实验1 - 分治法实验
date: 2023-03-24 22:07:04
tags:
    - 分治法
    - 力扣
categories:
    - 算法研究
hide: true
---

## 实验1 用分治法求解数组的中位数和最大子集

-------------------------------------

## Pro1：Median of Two Sorted Arrays
*There are two sorted arrays nums1 and nums2 of size m and n respectively.Find the
median of the two sorted arrays. The overall run time complexity should be O(log
(m+n)).*

对应力扣题：[**4. 寻找两个正序数组的中位数**](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

### 基本思路：
利用数组已经排好序的特性，寻找第k大的数（k=(m+n)/2），该数即为中位数。
特别的，如果总的数字数目为双数，需要找第k大的数和它后面的一个数，两数做平均。
对于找第k大的数，每次先找到两个数组中，未丢弃的第一个数与数组第k个数中间的数，找到两个数i1和i2，将较小者前面的数全部丢弃，因为较小者前面的数一定不会包含第k大的数。
之后因为丢弃了数，所以k应当减小。
如此反复，直到(1)一个数组被丢弃完，或者(2)k减小到1，则第k大的数被找到。
如果是发生情况(1)，说明另一个数组中未丢弃的部分，第k'个即为所寻找的数（k'是逐次更新到现在的k）；
如果是发生情况(2)，说明已经丢弃了k-1个数，两个数组中当前最小的一个数就是所寻找的数。
因为每次迭代之后，所需解决的问题规模变小了k'/2，所以符合分治法的思想。

### 题解：
```C++
class Solution {
public:
    int findKthNumber(vector<int>& nums1, vector<int>& nums2, int k) {
        int m = nums1.size();
        int n = nums2.size();
        int idx1 = 0, idx2 = 0;
        while (true) {
            if (idx1 == m) {
                return nums2[idx2 + k - 1];
            }
            if (idx2 == n) {
                return nums1[idx1 + k - 1];
            }
            if (k == 1) {
                return min(nums1[idx1], nums2[idx2]);
            }

            int newidx1 = min(idx1 + k/2 - 1, m-1);
            int newidx2 = min(idx2 + k/2 - 1, n-1);
            if (nums1[newidx1] <= nums2[newidx2]) {
                k -= newidx1 - idx1 + 1;
                idx1 = newidx1 + 1;
            } else {
                k -= newidx2 - idx2 + 1;
                idx2 = newidx2 + 1;
            }
        }
    }

    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int maddn = nums1.size() + nums2.size();
        if (maddn % 2 == 0) {
            return (findKthNumber(nums1, nums2, maddn / 2) + findKthNumber(nums1, nums2, maddn / 2 + 1)) / 2.0;
        } else {
            return findKthNumber(nums1, nums2, (maddn + 1) / 2);
        }
    }
};
```

### 复杂度分析：
最好情况下：每次递归调⽤去除⼀半的数据，则复杂度为O(log(m+n))
最坏情况下：每次递归调⽤去除⼀个数据，则复杂度为O(m+n)
平均情况： O(log(m+n))
递归树层数平均为log(m+n)层，每层的时间复杂度为常数级别，因此总平均复杂度为O(log(m+n))

----------------------------------

## Pro2：Maximum Subarray
*Find the contiguous subarray within an array (containing at least one number) which has the largest sum.
For example, given the array [-2,1,-3,4,-1,2,1,-5,4], the contiguous subarray [4,-1,2,1] has the largest sum = 6*

对应力扣题：[**53. 最大子数组和**](https://leetcode.cn/problems/maximum-subarray/)

#### 基本思路：
利用分治法，每次将数组对半分，将寻找最大子数组和分解为三个问题：
1. 左半边数组中最大子数组和
2. 右半边数组中最大子数组和
3. 分割线所在元素周围最大子数组和

为了实现这个思想，需要对每次求解结果维护如下数据：
- lsum: 以最左元素为左端点时的最大子数组和
- rsum: 以最右元素为右端点时的最大子数组和
- isum: 整个数组的和
- msum: 最大子数组和

对于每次迭代，各数据更新规则如下：
```C++
// 结合左右两半数组求解得出的数据l和r，更新当前数组求解的数据：
lsum = max(l.lsum, l.isum + r.lsum);
rsum = max(r.rsum, r.isum + l.rsum);
isum = l.isum + r.isum;
msum = max(max(l.msum, r.msum), l.rsum + r.lsum);
```

### 题解：
```C++
class Solution {
    struct state {
        int lsum, rsum, isum, msum;
        state(int l, int r, int i, int m) : lsum(l), rsum(r), isum(i), msum(m) {};
        state(state& l, state& r) {
            lsum = max(l.lsum, l.isum + r.lsum);
            rsum = max(r.rsum, r.isum + l.rsum);
            isum = l.isum + r.isum;
            msum = max(max(l.msum, r.msum), l.rsum + r.lsum);
        }
    };

public:
    state getMaxSub(vector<int>& nums, int l, int r) {
        if (l == r) return state(nums[l], nums[l], nums[l], nums[l]);
        int m = (l + r) / 2;
        state sl = getMaxSub(nums, l, m);
        state sr = getMaxSub(nums, m+1, r);
        return state(sl, sr);
    }

    int maxSubArray(vector<int>& nums) {
        return getMaxSub(nums, 0, nums.size()-1).msum;
    }
};
```

### 复杂度分析：
时间复杂度：O(nlogn)，其中 n 是数组 nums 的⻓度
空间复杂度：即函数递归栈的深度 O(logn)
每次分解数组都是等分，因此递归树的层数是logn，每层进⾏合并的复杂度（求解跨越mid的⼦数组最⼤和的时间是n），因此时间复杂度是O(nlogn)