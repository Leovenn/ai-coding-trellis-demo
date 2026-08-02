# 类型安全

> 当前类型模式以 [src/domain/expense.ts](../../../src/domain/expense.ts) 为准。

---

## 领域类型

- 使用 `Expense` 描述报销记录的完整结构。
- 使用字符串联合类型 `ExpenseStatus` 限定状态值，不接受任意字符串。
- 状态中文映射声明为 `Record<ExpenseStatus, string>`，新增状态时由 TypeScript 提醒补全映射。
- 不在组件中复制领域接口。

```typescript
export type ExpenseStatus = 'pending' | 'approved' | 'rejected'

export interface Expense {
  id: string
  purpose: string
  amount: number
  status: ExpenseStatus
  submittedAt: string
}
```

## 只读边界

- 不会修改的集合使用 `readonly` 参数或 `readonly Expense[]`。
- `calculateExpenseTotal()` 接受只读集合，保证计算函数不会修改调用方状态。
- 初始演示数据对外暴露为只读集合，组件持有自己的可变副本。

## 输入校验

表单虽然由 TypeScript 管理，浏览器输入仍然属于运行时数据。构造领域对象前必须检查：

- 文本清理后不能为空。
- 金额不能为 `null`。
- 金额必须通过 `Number.isFinite()`。
- 金额必须大于零。

参考：[src/App.vue](../../../src/App.vue) 中的 `addExpense()`。

## 类型推导与显式声明

- 简单局部值优先依赖类型推导。
- 公共数据结构、函数参数和返回值显式声明类型。
- 需要表达业务取值范围时使用联合类型，不使用普通 `string`。
- 状态映射使用 `Record` 等工具类型保证覆盖完整。

## 禁止模式

- 禁止使用 `any` 绕过类型检查。
- 禁止在组件中使用强制断言掩盖未校验的输入。
- 禁止为同一领域对象维护多份形状相近但语义不清的接口。
- 禁止把可变数组参数传给只需要读取数据的计算函数。
