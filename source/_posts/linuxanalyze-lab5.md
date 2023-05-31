---
title: Linux 进程切换
date: 2023-04-25 22:10:18
updated: 2023-04-25 22:10:18
cover: http://www.plantuml.com/plantuml/svg/VLH1RzCm6BtdL_ZO7IPnfj8qSUR8FKexPusKf5lY3OrJfj5serGLegEbxMXN2IYCfWKDYBA6_9dOIKxy1HmdIfDknOgYVBRVv_VUzpcxEX8qTAJ87CU-E4a41NzWad4ZS0V-j4bwSrolaR4LXt-Neos0Ab05XHEeRt60ZiTq2TS-0bbuSGAGN09aUesNxI9RLAi80XcAY4NH27i_o6pYMItire9Fftx_9NZsz0aWWrloRi5sGNMFuUBiMJQUu_gTANRUuejMF1F1XJAIZY6lA9kEn8EnPzbP7TWOqKJq8UU_avdX0byP_XSxxDxcMR0eyYLxBlKbYtx85yO-PWmKPLyJIW0lwclayVAIhWVcDRbSu5UKfb5CmVU5C37jhsHu4QN9GAcyHuIcFNF2Za7cfta4aqyvy3hIZie8uE4q4NtU8Aq9wVxoblrWSXCut_pFToasLmSewn0Kr6f6stqrgr80tp6fcMjYD6c_igOcKvJjdMn4qv6p6gx_zAnc3fBHqNxZTqOnwy1u7LvzY3tPe43TaqGkhoEj3rHAWgP9KEFrvn8gLo89-CxsRvgK4vxryFTss1zc6Yml9UamPgTdrrSSrze-tX6uZQYPhLbWkc7N33llW_dyWTPFoAMCU4axrFcgA88up-gOugOcZHtrRVT_JHgOVsYvW7QulNEWmUFq9YMEiRUEgWSSjqi3-hVu1m00
tags:
    - linux
    - kernel
    - vscode
categories:
    - 课程实验
    - linux操作系统分析
hide: true
---

与进程切换有关的代码在 `kernel/sched/core.c - function context_switch` 中：

```C
/*
 * context_switch - switch to the new MM and the new thread's register state.
 */
static __always_inline struct rq *
context_switch(struct rq *rq, struct task_struct *prev,
	       struct task_struct *next, struct rq_flags *rf)
{
	prepare_task_switch(rq, prev, next);

	/*
	 * For paravirt, this is coupled with an exit in switch_to to
	 * combine the page table reload and the switch backend into
	 * one hypercall.
	 */
	arch_start_context_switch(prev);

	/*
	 * kernel -> kernel   lazy + transfer active
	 *   user -> kernel   lazy + mmgrab() active
	 *
	 * kernel ->   user   switch + mmdrop() active
	 *   user ->   user   switch
	 */
	if (!next->mm) {                                // to kernel
		enter_lazy_tlb(prev->active_mm, next);

		next->active_mm = prev->active_mm;
		if (prev->mm)                           // from user
			mmgrab(prev->active_mm);
		else
			prev->active_mm = NULL;
	} else {                                        // to user
		membarrier_switch_mm(rq, prev->active_mm, next->mm);
		/*
		 * sys_membarrier() requires an smp_mb() between setting
		 * rq->curr / membarrier_switch_mm() and returning to userspace.
		 *
		 * The below provides this either through switch_mm(), or in
		 * case 'prev->active_mm == next->mm' through
		 * finish_task_switch()'s mmdrop().
		 */
		switch_mm_irqs_off(prev->active_mm, next->mm, next);

		if (!prev->mm) {                        // from kernel
			/* will mmdrop() in finish_task_switch(). */
			rq->prev_mm = prev->active_mm;
			prev->active_mm = NULL;
		}
	}

	rq->clock_update_flags &= ~(RQCF_ACT_SKIP|RQCF_REQ_SKIP);

	prepare_lock_switch(rq, next, rf);

	/* Here we just switch the register state and the stack. */
	switch_to(prev, next, prev);
	barrier();

	return finish_task_switch(prev);
}
```

大致流程如下：
1. 切换准备工作
2. 切换地址空间
3. 切换寄存器状态
4. 切换收尾

## 切换准备工作

`prepare_task_switch` 函数的注释如下：

```C
/**
 * prepare_task_switch - prepare to switch tasks
 * @rq: the runqueue preparing to switch
 * @prev: the current task that is being switched out
 * @next: the task we are going to switch to.
 *
 * This is called with the rq lock held and interrupts off. It must
 * be paired with a subsequent finish_task_switch after the context
 * switch.
 *
 * prepare_task_switch sets up locking and calls architecture specific
 * hooks.
 */
```

主要目的是：
- 进入临界区，防止进程切换被打断
- 调用一些跟体系结构相关的 hooks
- 与 `finish_task_switch` 配套使用，退出临界区

`arch_start_context_switch` 的作用是区分不同体系结构，将与体系结构相关的进程切换入口放到其中。

## 切换地址空间

切换地址空间的代码如下：

```C
/*
    * kernel -> kernel   lazy + transfer active
    *   user -> kernel   lazy + mmgrab() active
    *
    * kernel ->   user   switch + mmdrop() active
    *   user ->   user   switch
    */
if (!next->mm) {                                // to kernel
    enter_lazy_tlb(prev->active_mm, next);

    next->active_mm = prev->active_mm;
    if (prev->mm)                           // from user
        mmgrab(prev->active_mm);
    else
        prev->active_mm = NULL;
} else {                                        // to user
    membarrier_switch_mm(rq, prev->active_mm, next->mm);
    /*
        * sys_membarrier() requires an smp_mb() between setting
        * rq->curr / membarrier_switch_mm() and returning to userspace.
        *
        * The below provides this either through switch_mm(), or in
        * case 'prev->active_mm == next->mm' through
        * finish_task_switch()'s mmdrop().
        */
    switch_mm_irqs_off(prev->active_mm, next->mm, next);

    if (!prev->mm) {                        // from kernel
        /* will mmdrop() in finish_task_switch(). */
        rq->prev_mm = prev->active_mm;
        prev->active_mm = NULL;
    }
}
```

{% plantuml %}
@startuml

start
if (目标进程是内核进程？) then (yes)
    :进入 lazy tlb 模式;
    note left
        防止不必要的 TLB 更新
    end note
    :目标进程使用当前进程的 active_mm;
    note left
        因为内核进程借用用户进程地址空间
    end note

    if (当前进程是用户进程？) then (yes)
        :使用 mmgrab 将当前进程的引用计数加一;
        note left
            只有当引用计数为0才能销毁
            因为 mm_struct 在进程切换时会被转移
        end note
    else (no)
        :将当前进程的 active_mm 置空;
        note right
            内核进程->内核进程的情况下
            mm_struct 发生转移而非引用
        end note
    endif
else (no)
    :使用 membarrier_switch_mm 建立内存屏障;
    note right
        因为切换了 mm_struct
        防止切换过程中访问错误
    end note
    :使用 switch_mm_irqs_off 切换 mm_struct;
    if (当前进程是内核线程？) then (yes)
        :设置 rq->prev_mm;
    endif
endif
stop

@enduml
{% endplantuml %}

## 切换寄存器状态

`switch_to` 即为各个体系结构对进程切换的寄存器操作，对于 X86 来说：

```C
#define switch_to(prev, next, last)					\
do {									\
	prepare_switch_to(next);					\
									\
	((last) = __switch_to_asm((prev), (next)));			\
} while (0)
```

`__switch_to_asm`：
```C
/*
 * %rdi: prev task
 * %rsi: next task
 */
ENTRY(__switch_to_asm)
	UNWIND_HINT_FUNC
	/*
	 * Save callee-saved registers
	 * This must match the order in inactive_task_frame
	 */
	pushq	%rbp
	pushq	%rbx
	pushq	%r12
	pushq	%r13
	pushq	%r14
	pushq	%r15

	/* switch stack */
	movq	%rsp, TASK_threadsp(%rdi)
	movq	TASK_threadsp(%rsi), %rsp

#ifdef CONFIG_STACKPROTECTOR
	movq	TASK_stack_canary(%rsi), %rbx
	movq	%rbx, PER_CPU_VAR(fixed_percpu_data) + stack_canary_offset
#endif

#ifdef CONFIG_RETPOLINE
	/*
	 * When switching from a shallower to a deeper call stack
	 * the RSB may either underflow or use entries populated
	 * with userspace addresses. On CPUs where those concerns
	 * exist, overwrite the RSB with entries which capture
	 * speculative execution to prevent attack.
	 */
	FILL_RETURN_BUFFER %r12, RSB_CLEAR_LOOPS, X86_FEATURE_RSB_CTXSW
#endif

	/* restore callee-saved registers */
	popq	%r15
	popq	%r14
	popq	%r13
	popq	%r12
	popq	%rbx
	popq	%rbp

	jmp	__switch_to
END(__switch_to_asm)
```

所做的工作如下：
1. 保存寄存器
2. 切换进程
3. 恢复寄存器

## 切换收尾

`finish_task_switch` 函数的注释如下：

```C
/**
 * finish_task_switch - clean up after a task-switch
 * @prev: the thread we just switched away from.
 *
 * finish_task_switch must be called after the context switch, paired
 * with a prepare_task_switch call before the context switch.
 * finish_task_switch will reconcile locking set up by prepare_task_switch,
 * and do any other architecture-specific cleanup actions.
 *
 * Note that we may have delayed dropping an mm in context_switch(). If
 * so, we finish that here outside of the runqueue lock. (Doing it
 * with the lock held can cause deadlocks; see schedule() for
 * details.)
 *
 * The context switch have flipped the stack from under us and restored the
 * local variables which were saved when this task called schedule() in the
 * past. prev == current is still correct but we need to recalculate this_rq
 * because prev may have moved to another CPU.
 */
```
