---
title: 使用Unity3D制作一款类吸血鬼幸存者的3D游戏 - 角色篇
date: 2023-03-25 13:34:51
updated: 2023-03-25 13:34:51
tags:
    - Unity3D
    - C#
    - 俯视角射击
    - 随机地图
    - Rouge-like
categories:
    - Unity3D
    - AShootGame
---


<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;"><iframe 
src="//player.bilibili.com/player.html?aid=269009801&bvid=BV1wc411L78j&cid=1070306432&page=1&autoplay=false" 
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" 
style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"> </iframe></div>

<!-- more -->

![](./使用Unity3D制作一款类吸血鬼幸存者的3D游戏/enemy_cover.png)

学习Unity3D过程中做的第一个项目，项目主体框架是照着这个教程做的：
https://www.youtube.com/playlist?list=PLFt_AvWsXl0ctd4dgE1F8g3uec4zKNRV0
后续增加了道具拾取以及升级的功能。

写这篇博客主要目的是将这个过程中学到的一些功能的典型实现摘出来，尽量避开记录这款游戏本身，而是讲解通用功能的实现。
（如果想复习这个特定游戏的开发，可以重新再看一遍教程）

------------------------

本篇为系列的角色篇，目标是回顾完这一篇章之后可以做出来一个功能齐全的角色，经过一定程度的针对性扩展可以让这个角色出现在不同的游戏中。

**目录**
1. 角色控制
2. 角色生命
3. 镜头控制
4. 准心显示

------------------------

## 1. 角色控制

给角色添加Collider以及Rigidbody，并在角色身上添加Player.cs，以后对于角色的按键输入都由Player.cs来处理。
记得锁定角色旋转以防角色“过分”的物理模拟。

![](./使用Unity3D制作一款类吸血鬼幸存者的3D游戏/player_components.png)

为角色添加PlayerController.cs脚本，该脚本负责角色的移动。

PlayerController.cs
```C#
Vector3 velocity;
Rigidbody myRigidbody;

void Start()
{
    myRigidbody = GetComponent<Rigidbody>();
}

public void Move(Vector3 _velocity)
{
    velocity = _velocity;
}

void FixedUpdate()
{
    myRigidbody.MovePosition(myRigidbody.position + velocity * Time.deltaTime);
}
```

流程是Player检测到移动角色的按键输入，于是调用PlayerContrller中的Move方法，Move方法设定好角色的移动速度向量，每次FixedUpdate到来时依照速度向量来移动角色。

Player.cs
```C#
public float moveSpeed = 5;

PlayerController controller;

private void Awake()
{
    controller = GetComponent<PlayerController>();
}

void Update()
{
    // movement input
    Vector3 moveInput = new Vector3(Input.GetAxisRaw("Horizontal"), 0, Input.GetAxisRaw("Vertical"));
    Vector3 moveVelocity = moveInput.normalized * moveSpeed;
    controller.Move(moveVelocity);
}
```

------------------------

## 2. 角色生命

注意到生命值这个属性，无论是对于角色，还是对于敌人都是可用的，所以新建一个父类，叫做LivingEntity，新建一个接口，叫做IDamageable。

LivingEntity.cs
```C#
public class LivingEntity : MonoBehaviour, IDamageable
{
    public float startingHealth;

    public float health { get; protected set; }
    protected bool dead;

    public event Action OndDeath;

    protected virtual void Start()
    {
        health = startingHealth;
    }

    public virtual void TakeHit(float damage, Vector3 hitPoint, Vector3 hitDirection)
    {
        TakeDamage(damage);
    }

    public virtual void TakeDamage(float damage)
    {
        health -= damage;

        if (health <= 0 && !dead)
        {
            Die();
        }
    }

    [ContextMenu("Self Destruct")]
    public virtual void Die()
    {
        dead = true;
        if (OndDeath != null) OndDeath();
        Destroy(gameObject);
    }
}
```

IDamageable.cs
```C#
public interface IDamageable
{
    void TakeHit(float damage, Vector3 hitPoint, Vector3 hitDirection);

    void TakeDamage(float damage);
}
```

让Player继承LivingEntity，则角色有了生命值属性。但是光使用LivingEntity中的TakeDamage方法，没有任何击中反馈，表现到游戏中则是玩家很容易忽视自己受到伤害这件事情，“死”得不明不白的。所以我们在Player中重载TakeDamage方法，加入动画效果实现受伤反馈。反馈的形式可以自由创造，这里实现一种颜色变化的方式。
同时加入Recover方法，让角色有机会得到治疗。（当然，将Recover方法放到IDamageable和LivingEntity中是更合理的方式，这里偷懒了）

Player.cs
```C#
public ParticleSystem recoverEffect;

Material skinMatetial;
Color originalColor;

private void Awake()
{
    skinMatetial = GetComponent<Renderer>().material;
    originalColor = skinMatetial.color;
}

public override void TakeDamage(float damage)
{
    base.TakeDamage(damage);

    StartCoroutine(AnimateTakeDamage());
}

IEnumerator AnimateTakeDamage()
{
    float percent = 0;
    float speed = 1 / 0.2f;

    while (percent < 1)
    {
        percent += Time.deltaTime * speed;
        skinMatetial.color = Color.Lerp(Color.red, originalColor, percent);

        yield return null;
    }
}

public void Recover(float value)
{
    health = Mathf.Clamp(health + value, 0, startingHealth);
    ParticleSystem newRecoverEffect = Instantiate(recoverEffect, transform.position, Quaternion.identity);
    newRecoverEffect.transform.SetParent(transform, false);
    newRecoverEffect.transform.localPosition = Vector3.zero;
}

public override void Die()
{
    AudioManager.instance.PlaySound("Player Death", transform.position);
    base.Die();
}
```

注意到我们重写了Die方法，里面用到了AudioManager的单例，以后我们会单独开一个章节讲AudioManager。

Recover方法中用到了粒子效果，该效果的参数如下：（角色拾取恢复道具时围绕在角色周围的粉红色粒子效果）
![](./使用Unity3D制作一款类吸血鬼幸存者的3D游戏/recover_effect_params.png)
![](./使用Unity3D制作一款类吸血鬼幸存者的3D游戏/recover_effect_params2.png)

------------------------

## 3. 镜头控制

------------------------

## 4. 准心显示


