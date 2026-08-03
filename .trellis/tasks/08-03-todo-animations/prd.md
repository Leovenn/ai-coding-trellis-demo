# 待办体验动画：丝滑跨区移动 + 仪式感完成反馈

## Goal

让"今日待办"的交互变得有生命感：新增待办有自然的入场、待办完成时能从「进行中」平滑滑入「已完成」并在视觉上受到"完成"的强调，整体动画节奏统一、克制而高级，符合当前极简设计语言。

## 已确认事实（来自代码，非待定）

- 列表渲染在 `src/App.vue`：「进行中」与「已完成」是**两个独立** `<div class="space-y-1">`（App.vue:165 与 App.vue:218），各自 `v-for` 一份计算属性数组。
- 勾选通过 `setTodoCompleted`（`src/domain/todo.ts` 纯函数）更新，待办在 `activeTodos`/`completedTodos` 之间迁移，DOM 表现为"移除 + 重新插入"，**当前没有任何跨区动画机制**。
- `Checkbox.vue:27` 对勾指示器是 `transition-none`，勾选瞬间直接显隐。
- 顶部进度条已有 `transition-[width] duration-300`（App.vue:114）。
- 已依赖：Vue 3.5、Tailwind v4、reka-ui(shadcn)、lucide、`@vueuse/core`。动效库采用官方 `@formkit/auto-animate`（任务开始前尚未安装）。
- 数据仅内存，无后端、无全局状态库；待办表单与可访问性约定见 `.trellis/spec/frontend/component-guidelines.md`。

## 已确认决策（Brainstorm 收敛）

- **技术底座**：跨区移动采用官方 `@formkit/auto-animate` 的 Vue `useAutoAnimate` 自动 FLIP（新增一个依赖，量小）；Checkbox 打勾、卡片反馈、里程碑彩带手写实现。
- **仪式感节奏**：分层 —— 每次勾选克制反馈，全部完成时庆祝一次彩带。
- **无障碍**：检测 `prefers-reduced-motion`，开启时关闭/大幅简化动画。
- **范围边界**：自定义 Checkbox 打勾动画 + 顶部进度条增强（完成数平滑滚动、进度条反馈）均纳入本次。

## Requirements

- R1 待办完成时，从「进行中」**平滑移动**到「已完成」，动作连贯、有方向感（`@formkit/auto-animate` 的 Vue `useAutoAnimate`，双容器 FLIP）。
- R2 新增待办有自然的入场动画。
- R3 仪式感按**分层**呈现：每次勾选完成给克制反馈（对勾回弹 + 卡片轻微"落地/轻飘"）；达成里程碑（**全部完成（完成率 100%）**）时，触发一次庆祝彩带（一次性、不重复轰炸）。
- R4 打勾动作本身有动画（对勾绘制/回弹出现），而非瞬间跳变。
- R5 顶部进度条增强：完成数平滑滚动、进度条完成时有反馈。
- R6 检测 `prefers-reduced-motion`，开启时关闭/大幅简化动画，优雅降级。
- R7 样式、缓动、节奏形成统一设计语言，与现有极简风格相融。

## Acceptance Criteria

- [ ] A1 待办完成时视觉上平滑过渡/移动到已完成区块，非跳变（`prefers-reduced-motion` 下退化为瞬时）。
- [ ] A2 新增待办有入场动画。
- [ ] A3 打勾拥有流畅的"完成"反馈动画（对勾绘制/回弹）。
- [ ] A4 全部待办完成时触发一次庆祝彩带，且只触发一次；中途取消勾选消退后不会误触发。
- [ ] A5 进度条宽度与完成数值随完成操作平滑更新。
- [ ] A6 `prefers-reduced-motion` 开启时，跨区移动/入场/彩带/打勾动画关闭或降级，功能正常。
- [ ] A7 `pnpm test` 与 `pnpm run build`（含 vue-tsc 类型检查）通过；相关测试与可观察行为同步更新。

## Out of Scope

- 后端/持久化、全局状态、移动端专项适配（响应式已具备）。
- 回收站逻辑（此前有残留空壳任务 `08-03-todo-recycle-bin`，非本次）。