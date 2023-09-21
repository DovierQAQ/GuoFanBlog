---
title: 开源EDA软件iEDA源码解析 - iDRC
date: 2023-09-19 10:10:13
updated: 2023-09-19 10:10:13
cover:
hide: true
tags:
    - EDA
    - C++
    - 开源项目
categories:
    - 经验总结
---

{% note danger flat %}
TODO: 文章草稿，不建议阅读
{% endnote %}

{% note info flat %}
**系列文章**

{% post_link ieda-architecture %}
-> {% post_link ieda-idrc-code-reading %}
{% endnote %}

{% plantuml %}

@startmindmap

<style>
  node {
    BackGroundColor white
  }
</style>

* DrcAPI::runDrc
  * DRC::initDRC
  * DRC::initCheckModule
  * DRC::run
    * RoutingSpacingCheck::checkRoutingSpacing
      * RegionQuery::queryContainsInRoutingLayer
      * Tech::getRoutingMaxRequireSpacing
      * RoutingSpacingCheck::getSpacingQueryBox
      * RoutingSpacingCheck::getQueryResult
      * RoutingSpacingCheck::checkSpacingFromQueryResult
    * RoutingWidthCheck::checkRoutingWidth
    * RoutingAreaCheck::checkArea
    * ...

@endmindmap

{% endplantuml %}

{% plantuml %}
@startuml

start
:从 _drc_design 中取出所有 DrcNet;
note left
  _drc_design 是在 DRC::initDRC 里面初始化的
endnote
while (遍历所有 DrcNet)
  :从 DrcNet 中取出所有矩形（DrcRect）;
  while (遍历所有 DrcRect)
    :从 DrcRect 中获得 layer_id;
    :查询 R-Tree，获得该 DrcRect 范围内
    routing rect 和 fixed rect 的数量;
    if (数量不大于 1？) then (yes)
      note left
        为什么？
      endnote
      :使用 layer_id 和矩形大小查得 spacing 数值;
      :将 DrcRect 往外扩大这个数值的宽度，
      得到查询矩形;
      :通过 R-Tree 查找该查询矩形区域内的所有
      routing rect 和 fixed rect;
      while (遍历这些 rect)
        if (该 rect 不需要被跳过检查？) then (yes)
          note left
            需要被跳过的情况：
            1. 区域搜索的结果就是目标检查矩形本身
            2. 被检查的两个矩形都是 fix 的
            3. 搜索结果矩形被检查过
            4. 同一 net 的两个相交矩形
          endnote
          :获得 DrcRect 和遍历到的 rect 之间的 span box;
          note left
            后面将这两个矩形分辨称为
            1. 受检矩形
            2. 邻居矩形
          endnote
          if (发现短路违例？) then (yes)
            note left
              两个不同 layer_id 的矩形有交叠
            endnote
            :记录违例;
          else (no)
            :通过 R-Tree 查询所有在 span box 范围内的
            routing rect 和 fixed rect;
            if (查询到的结果为空？) then (yes)
              :获得受检矩形和邻居矩形的 PRL，
              查得它们需要满足的 PRL spacing;
              if (两个矩形有正的 PRL) then (no)
                :检查角间距;
                note left
                  x^2 + y^2 < spacing^2
                endnote
              else (yes)
                :检查 PRL spacing;
              endif
              if (发现 spacing 违例？) then (yes)
                :记录违例;
              endif
            endif
          endif
        endif
      endwhile
    endif
  endwhile
endwhile

stop
@enduml
{% endplantuml %}

发现的问题：
1. 需要被跳过的条件中，检查了“是否被检查过”，实现方法是检查该 rect 是否在 list 中。但是被检查过的 rect 并没有被加入到这个 list 中。
2. 
