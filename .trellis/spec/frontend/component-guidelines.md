# 组件规范

> 当前组件约定来自 [src/App.vue](../../../src/App.vue)、[src/App.test.ts](../../../src/App.test.ts) 和 `src/components/ui/`。

---

## shadcn-vue 使用方式

- 项目使用 `components.json` 中定义的 `reka-nova` 风格和 Reka UI 基础层。
- Button、Checkbox、Input 从对应的 `@/components/ui/*` 入口导入。
- Registry 组件源码属于项目代码，可以审核；业务页面通过 Props、Slots 和 `class` 组合使用。
- 页面级颜色、间距和布局使用 Tailwind class，不把业务样式写入基础组件。
- 新增 Registry 组件后删除确认不用的组件，避免演示项目膨胀。

## 单文件组件结构

- 使用 `<script setup lang="ts">`，脚本放在模板之前。
- 导入顺序保持“外部库 → UI 组件 → 领域模块”。
- 从领域模块导入类型、常量和纯函数，组件不重新定义它们。
- 页面状态定义在脚本顶部，事件处理函数保持短小并使用提前返回。

## 待办输入

- 使用 `@submit.prevent` 统一处理提交，不把新增逻辑绑定到按钮点击事件。
- 待办输入使用稳定的 `name="todo-title"` 和可访问名称。
- 新增前清理标题首尾空格，空标题直接返回。
- 输入值只作为表单状态；创建领域对象时调用 `createTodo()`。
- 创建成功后显式清空输入框。

## 完成状态

- 完成切换使用 shadcn-vue `Checkbox`，不使用可点击 `div` 模拟复选框。
- Checkbox 通过稳定 `id` 与 `label` 关联，并提供包含待办标题的 `aria-label`。
- 页面调用 `setTodoCompleted()` 更新状态，不直接修改列表项属性。
- 进行中和已完成列表由 `computed` 分组，模板只负责渲染。

## 列表渲染

- `v-for` 必须使用 `todo.id` 作为稳定 `key`。
- 进行中和已完成区域使用语义化 `section` 与可引用标题。
- 已完成标题使用删除线和降低对比度，同时保留可读文字，不能只依赖颜色表示状态。
- 列表为空时展示明确的完成提示，不留下无说明的空白区域。

## 视觉约定

- 整体采用暖灰背景、深色正文、细边框和克制阴影。
- 页面使用紧凑的应用工作区结构，不堆叠装饰性统计卡片或营销式主视觉。
- 不使用渐变光晕、玻璃拟态和外部字体网络请求。
- 大标题通过字重、字距和留白建立层级，正文保持适合中文阅读的行高。
- 图标使用 `@lucide/vue`，图标辅助文字，不替代必要标签。

## 动效与减少动态效果

- 列表增删和分组迁移使用 `@formkit/auto-animate/vue` 导出的 `useAutoAnimate`；不存在 `@vueuse/auto-animate` 这个包。
- 进行中和已完成列表仍保持独立的语义化 `<section>`，分别挂载 auto-animate 容器，不为动效牺牲标题与分区语义。
- 动效只是渲染增强，不能改变 `createTodo()`、`setTodoCompleted()` 等领域状态转换。
- 所有非必要动画必须尊重 `prefers-reduced-motion: reduce`：关闭 auto-animate、彩带和数字缓动，CSS 动画同时提供 `@media (prefers-reduced-motion: reduce)` 降级。
- Checkbox 的业务性对勾动画通过现有 indicator slot 组合，不改写 Registry 组件内部默认 class。

```ts
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const [list, enableAnimation] = useAutoAnimate<HTMLElement>({ duration: 260 })
// 模板：<ul ref="list">...</ul>
```

## 当前边界

- 基础版仅包含新增、完成状态切换、分组展示和数量统计。
- 当前没有删除、回收站、批量操作或持久化逻辑。
- 不在基础版中提前建立不存在的删除生命周期规则。

## 避免

- 不在模板中执行复杂状态转换。
- 不直接修改从 `initialTodos` 导入的只读数据。
- 不为了单页样式改写 Registry 组件内部默认 class。
- 不引入另一套完整 UI 组件库。
