# 目录结构

> 项目保持单应用、少文件结构，让演示重点落在开发流程而不是工程复杂度上。

---

## 当前结构

```text
src/
├── App.vue                 # 页面组合、表单交互和列表展示
├── App.test.ts             # 页面级组件测试
├── domain/
│   ├── expense.ts          # 报销类型、初始数据和纯计算函数
│   └── expense.test.ts     # 领域逻辑单元测试
├── main.ts                 # Vue 应用入口
└── style.css               # 全局视觉样式和响应式布局
```

参考文件：[src/App.vue](../../../src/App.vue)、[src/domain/expense.ts](../../../src/domain/expense.ts)。

---

## 职责边界

- `src/App.vue` 负责页面状态、用户输入和视图组合，不重复实现领域计算。
- `src/domain/` 负责稳定的数据类型、状态映射、演示数据和可独立测试的业务函数。
- `src/style.css` 负责当前单页面应用的全局视觉规则，不在模板中堆叠内联样式。
- 测试与被测文件相邻，以 `.test.ts` 结尾。

## 新文件的放置规则

- 新增纯业务规则或计算：放入 `src/domain/`。
- 新增页面交互：当前只有一个页面时保留在 `App.vue`；只有当组件具有独立职责或可复用价值时才拆分。
- 新增共享的有状态逻辑：出现两个以上真实消费者后，再创建 `src/composables/`。
- 不为一次性逻辑预先创建 `utils/`、`stores/` 或多层目录。

## 命名约定

- Vue 组件文件使用 PascalCase，例如 `App.vue`。
- 领域模块和测试文件使用小写名，例如 `expense.ts`、`expense.test.ts`。
- TypeScript 变量和函数使用 camelCase，类型使用 PascalCase。

## 避免

- 不在多个组件中分别声明 `Expense` 或状态文案。
- 不为当前不存在的后端、路由或全局状态预建空目录。
- 不把业务计算直接复制进模板表达式。
