# 成绩领域模型

> 本文件描述基础版已经存在的数据结构和统计行为。成绩规则后续发生变化时，必须同步更新本文件。

---

## StudentScore

领域模型定义在 [src/domain/score.ts](../../../src/domain/score.ts)：

| 字段 | 类型 | 当前含义 |
| --- | --- | --- |
| `id` | `string` | 页面内稳定且唯一的成绩记录标识 |
| `studentName` | `string` | 学生姓名 |
| `subject` | `Subject` | 语文、数学或英语 |
| `score` | `number` | 当前录入的数字成绩 |
| `recordedAt` | `string` | 面向中文界面展示的录入日期 |

## 科目

`subjects` 是可选科目的唯一来源：

```typescript
export const subjects = ['语文', '数学', '英语'] as const
export type Subject = (typeof subjects)[number]
```

表单选项和领域类型必须共同引用该常量，不在组件中维护第二份科目数组。

## 当前成绩输入

当前基础版的数据流是：

```text
数字输入 → Number(...) → StudentScore.score → 列表和统计函数 → 页面展示
```

基础版只拒绝空值和非有限数字，尚未定义 `0～100`、整数或等级规则。后续任务增加这些约束时，应在领域层建立统一入口，而不是只给输入框添加属性。

## 统计函数

- `calculateAverageScore()` 负责平均分；空集合返回 `0`。
- `findHighestScore()` 负责最高分记录；空集合返回 `null`。
- 组件通过 `computed` 调用这两个函数，不保存第二份统计状态。

统计规则发生变化时，应同时检查：

- `StudentScore.score`
- 表单输入边界
- 领域统计函数
- 概览卡片和成绩列表
- `score.test.ts` 与相关组件测试

## 本地数据

- `initialScores` 是只读的演示数据源。
- 当前不进行持久化，刷新页面会恢复初始数据。
- 页面初始化时复制演示数据，后续新增只修改组件自己的状态。
- 当前基础版没有姓名搜索、成绩等级和等级分布统计。
- 不添加后端接口、LocalStorage 或模拟请求，除非新任务明确提出。
