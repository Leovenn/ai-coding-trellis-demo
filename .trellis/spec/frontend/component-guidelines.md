# 组件规范

> 当前组件约定来自 [src/App.vue](../../../src/App.vue) 和 [src/App.test.ts](../../../src/App.test.ts)。

---

## 单文件组件结构

- 使用 `<script setup lang="ts">`，脚本放在模板之前。
- 从领域模块导入类型、常量和纯函数，组件不重新定义它们。
- 页面状态定义在脚本顶部，事件处理函数保持短小并使用提前返回。
- 当前项目使用全局 [src/style.css](../../../src/style.css)，组件模板只声明语义化 class。

## 表单处理

- 使用 `@submit.prevent` 统一处理提交，不把新增逻辑绑定到按钮点击事件。
- 输入元素必须具有可见的 `<label>`、稳定的 `name` 和合适的原生约束。
- 数字输入使用 `v-model.number`，但仍需在事件处理函数中检查 `null`、有限数和业务范围。
- 创建记录成功后显式重置表单字段。

当前示例是 `addExpense()`：先清理事由，再校验金额，最后创建一条默认状态为 `pending` 的报销记录。

## 列表渲染

- `v-for` 必须使用稳定业务标识作为 `key`，当前使用 `expense.id`。
- 状态文案统一来自 `expenseStatusLabels`，模板不得自行拼接或重复维护映射。
- 表格列使用语义化的 `table`、`thead`、`tbody` 和 `th`。
- 小屏幕下由 `.table-scroll` 提供横向滚动，不压缩到不可读。

## 状态样式

状态样式使用统一前缀：

```text
status-badge--pending
status-badge--approved
status-badge--rejected
```

新增状态时必须同时检查领域联合类型、中文映射、样式和测试，不能只修改模板。

## 可访问性

- 仅图形化的分组需要提供可读的 `aria-label`。
- 交互元素优先使用原生 `button` 和 `input`。
- 键盘焦点必须有明显的 `:focus-visible` 样式。
- 颜色不能是表达状态的唯一方式，状态徽标必须同时显示文字。

## 避免

- 不在模板中执行复杂统计或数据转换。
- 不直接修改从 `initialExpenses` 导入的只读数据。
