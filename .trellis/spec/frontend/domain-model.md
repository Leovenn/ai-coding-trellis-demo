# 待办领域模型

> 本文件描述基础版已经存在的数据结构和状态行为。待办生命周期发生变化时，必须同步更新本文件。

---

## TodoItem

领域模型定义在 [src/domain/todo.ts](../../../src/domain/todo.ts)：

| 字段 | 类型 | 当前含义 |
| --- | --- | --- |
| `id` | `string` | 页面内稳定且唯一的待办标识 |
| `title` | `string` | 待办内容 |
| `completed` | `boolean` | 是否已经完成 |
| `createdAt` | `string` | 面向当前中文界面展示的创建时间 |

当前模型没有删除状态，也没有 `deletedAt` 字段。

## 创建待办

`createTodo(id, title, createdAt)` 是创建完整领域对象的统一入口：

- 接收已经完成边界清理的标题。
- 新待办的 `completed` 固定为 `false`。
- 返回新的 `TodoItem`，不引用表单状态对象。

组件负责输入框交互和空值判断，领域函数负责构造完整对象。

## 完成状态

`setTodoCompleted(todos, todoId, completed)` 负责切换完成状态：

- 接受只读集合。
- 返回新数组。
- 只为目标待办创建新对象，其他待办保持原引用。
- 标识不存在时保持各项数据不变。

页面不直接执行 `todo.completed = ...`。

## 数量概览

`getTodoSummary()` 一次返回：

- `total`：全部待办数量。
- `completed`：已完成数量。
- `remaining`：待完成数量。

页面通过 `computed` 调用该函数，不保存第二份统计状态。

## 本地数据

- `initialTodos` 是只读演示数据源。
- 当前不进行持久化，刷新页面会恢复初始数据。
- 页面初始化时复制演示数据，后续交互只修改组件自己的状态。
- 基础版不包含删除、回收站和批量清空行为。
- 不添加后端接口、LocalStorage 或模拟请求，除非新任务明确提出。
