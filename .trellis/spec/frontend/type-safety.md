# 类型安全

> 当前类型模式以 [src/domain/todo.ts](../../../src/domain/todo.ts) 为准。

---

## 领域类型

- 使用 `TodoItem` 描述一条完整待办记录。
- 使用 `TodoSummary` 描述从待办集合派生的数量概览。
- 不在组件中复制领域接口或创建形状相近的临时待办类型。

```typescript
export interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: string
}
```

## 只读边界

- 不会修改的集合使用 `readonly TodoItem[]`。
- `setTodoCompleted()` 和 `getTodoSummary()` 接受只读集合，保证领域函数不会修改调用方状态。
- `initialTodos` 对外暴露为只读集合，组件持有自己的可变副本。
- 状态更新返回新数组，目标项发生变化时返回新对象。

## 输入边界

- 输入框状态保持为 `string`。
- 标题进入领域对象前调用 `trim()`。
- 空标题不创建待办。
- 标题最大长度由当前输入边界限制为 60 个字符。
- Checkbox 更新值可能包含 `indeterminate`，进入领域函数前必须收窄为 `boolean`。

## 路径和配置

- 业务代码使用 `@/` 别名引用 `src/`。
- TypeScript `paths` 与 Vite `resolve.alias` 必须保持一致。
- TypeScript 6 不使用已经弃用的 `baseUrl`，也不通过 `ignoreDeprecations` 隐藏配置问题。

## 禁止模式

- 禁止使用 `any` 绕过类型检查。
- 禁止用强制断言掩盖未收窄的 Checkbox 状态。
- 禁止为同一待办维护多份形状相近但语义不清的接口。
- 禁止把可变数组参数传给只需要读取数据的领域函数。
- 禁止在组件中复制待办状态转换逻辑。
