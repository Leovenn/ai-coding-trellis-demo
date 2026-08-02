# 类型安全

> 当前类型模式以 [src/domain/score.ts](../../../src/domain/score.ts) 为准。

---

## 领域类型

- 使用 `StudentScore` 描述一条完整成绩记录。
- 使用 `subjects as const` 同时生成运行时科目选项和 `Subject` 联合类型。
- `subject` 不接受任意字符串，表单默认值显式满足 `Subject`。
- 不在组件中复制领域接口或科目联合类型。

```typescript
export const subjects = ['语文', '数学', '英语'] as const
export type Subject = (typeof subjects)[number]

export interface StudentScore {
  id: string
  studentName: string
  subject: Subject
  score: number
  recordedAt: string
}
```

## 只读边界

- 不会修改的集合使用 `readonly` 参数或 `readonly StudentScore[]`。
- `calculateAverageScore()` 和 `findHighestScore()` 接受只读集合，保证统计函数不会修改调用方状态。
- 初始演示数据对外暴露为只读集合，组件持有自己的可变副本。

## 输入边界

shadcn-vue `Input` 的表单值在进入领域对象前显式转换：

- 学生姓名清理首尾空格后不能为空。
- 成绩原始值不能为空字符串。
- 使用 `Number(...)` 转换数字输入。
- 转换结果必须通过 `Number.isFinite()`。

当前基础版没有成绩范围和整数规则。后续若建立这些约束，应由领域函数统一表达并被表单、统计和导入复用。

## 路径和配置

- 业务代码使用 `@/` 别名引用 `src/`。
- TypeScript `paths` 与 Vite `resolve.alias` 必须保持一致。
- TypeScript 6 不使用已经弃用的 `baseUrl`，也不通过 `ignoreDeprecations` 隐藏配置问题。

## 禁止模式

- 禁止使用 `any` 绕过类型检查。
- 禁止用强制断言掩盖未校验的表单输入。
- 禁止为同一领域对象维护多份形状相近但语义不清的接口。
- 禁止把可变数组参数传给只需要读取数据的统计函数。
- 禁止在组件中复制成绩范围或等级区间。
