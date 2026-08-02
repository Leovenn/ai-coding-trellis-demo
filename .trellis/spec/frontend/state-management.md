# 状态管理

> 当前应用只使用 Vue 内置响应式能力，不引入 Pinia 或其他全局状态库。

---

## 状态分类

| 状态 | 当前实现 | 所有者 |
| --- | --- | --- |
| 成绩记录 | `ref<StudentScore[]>` | `src/App.vue` |
| 表单输入 | `reactive({ studentName, subject, score })` | `src/App.vue` |
| 平均分 | `computed(...)` | 由成绩记录派生 |
| 最高分 | `computed(...)` | 由成绩记录派生 |
| 初始演示数据 | `readonly StudentScore[]` | `src/domain/score.ts` |

参考：[src/App.vue](../../../src/App.vue) 中的 `scores`、`form`、`averageScore` 和 `highestScore`。

## 当前规则

- 只被当前页面使用的状态留在组件内。
- 能从成绩列表计算得到的值使用 `computed`，不再创建可变副本。
- 导入的初始数据视为只读模板；初始化页面状态时逐项复制。
- 更新数组时创建新数组，例如 `[item, ...scores.value]`，不修改传入参数或共享常量。
- 表单状态与领域对象分开，只有基础输入检查通过后才构造 `StudentScore`。
- shadcn-vue Select 通过 `v-model` 直接绑定 `Subject`，科目默认值必须属于领域联合类型。

## 何时引入全局状态

当前不需要全局状态。只有同时满足以下条件时才考虑引入：

1. 同一成绩状态存在多个真实页面或远距离组件消费者。
2. 通过 Props、Emits 或领域函数共享会明显增加同步成本。
3. 已经明确状态生命周期和唯一写入入口。

不能因为“以后可能需要”而提前加入状态库。

## 避免

- 不同时保存成绩列表、平均分和最高分三份可变状态。
- 不让表单对象直接成为列表中的领域对象。
- 不在多个组件中分别维护科目集合。
- 不直接修改 `initialScores`。
