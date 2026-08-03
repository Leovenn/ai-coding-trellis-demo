# 状态管理

> 当前应用只使用 Vue 内置响应式能力，不引入 Pinia 或其他全局状态库。

---

## 状态分类

| 状态 | 当前实现 | 所有者 |
| --- | --- | --- |
| 待办记录 | `ref<TodoItem[]>` | `src/App.vue` |
| 新待办标题 | `ref<string>` | `src/App.vue` |
| 进行中待办 | `computed(...)` | 由待办记录派生 |
| 已完成待办 | `computed(...)` | 由待办记录派生 |
| 数量概览 | `computed(getTodoSummary)` | 由待办记录派生 |
| 初始演示数据 | `readonly TodoItem[]` | `src/domain/todo.ts` |

参考：[src/App.vue](../../../src/App.vue) 中的 `todos`、`newTodoTitle`、`activeTodos`、`completedTodos` 和 `summary`。

## 当前规则

- 只被当前页面使用的状态留在组件内。
- 能从待办列表计算得到的分组和数量使用 `computed`，不创建可变副本。
- 导入的初始数据视为只读模板；初始化页面状态时逐项复制。
- 新增记录通过 `[todo, ...todos.value]` 创建新数组。
- 完成状态通过 `setTodoCompleted()` 返回新数组和新的目标对象，不修改传入集合。
- Checkbox 的 `indeterminate` 状态不是当前领域值，事件边界明确忽略它。

## 何时引入全局状态

当前不需要全局状态。只有同时满足以下条件时才考虑引入：

1. 同一待办状态存在多个真实页面或远距离组件消费者。
2. 通过 Props、Emits 或领域函数共享会明显增加同步成本。
3. 已经明确状态生命周期和唯一写入入口。

不能因为“以后可能需要”而提前加入状态库。

## 避免

- 不同时保存总数、已完成数量和待完成数量三份可变状态。
- 不分别维护进行中列表和已完成列表。
- 不让输入框值直接成为列表对象。
- 不直接修改 `initialTodos` 或待办对象的 `completed` 字段。
