# 报销领域模型

> 本文件描述基础版已经存在的数据结构和业务行为。金额模型后续发生变化时，必须同步更新本文件。

---

## Expense

领域模型定义在 [src/domain/expense.ts](../../../src/domain/expense.ts)：

| 字段 | 类型 | 当前含义 |
| --- | --- | --- |
| `id` | `string` | 页面内稳定且唯一的记录标识 |
| `purpose` | `string` | 报销事由 |
| `amount` | `number` | 当前以“元”为单位保存的金额 |
| `status` | `ExpenseStatus` | 报销状态 |
| `submittedAt` | `string` | 面向当前中文界面展示的提交日期 |

## 状态

当前允许三种状态：

| 值 | 页面文案 |
| --- | --- |
| `pending` | 待审批 |
| `approved` | 已通过 |
| `rejected` | 已驳回 |

`expenseStatusLabels` 是状态中文文案的唯一来源。新增记录由 [src/App.vue](../../../src/App.vue) 创建，并固定以 `pending` 作为初始状态。

当前基础版只展示状态，没有筛选和状态流转能力。

## 金额数据流

当前实现的数据流是：

```text
金额输入（元） → v-model.number → Expense.amount:number → reduce 累加 → 页面直接展示
```

总额只通过 `calculateExpenseTotal()` 计算：

```typescript
export function calculateExpenseTotal(expenses: readonly Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}
```

组件不得重复实现总额计算。金额类型、单位或计算方式发生变化时，应同时检查：

- `Expense.amount`
- 表单输入边界
- `calculateExpenseTotal()`
- 页面金额展示
- `expense.test.ts` 和相关组件测试

## 本地数据

- `initialExpenses` 是只读的演示数据源。
- 当前不进行持久化，刷新页面会恢复初始数据。
- 页面初始化时复制演示数据，后续新增只修改组件自己的状态。
- 不添加后端接口、LocalStorage 或模拟请求，除非新任务明确提出。
