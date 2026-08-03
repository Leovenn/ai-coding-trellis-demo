# Design — 待办体验动画

## 背景与目标

`src/App.vue` 的待办现在是硬切换：进行中/已完成两个独立 `<section>`，勾选即迁移数组、无任何过渡。本任务为它注入统一、克制、有仪式感的动效语言，且符合 `.trellis/spec/frontend/` 的既有规范。

## 关键约束（来自规范，设计必须满足）

- **语义化 section**：「进行中」与「已完成」必须是两个可引用标题的 `<section>`（component-guidelines.md:40）。**禁止**压成一个容器来换取跨区 FLIP。
- **稳定 key**：`v-for` 必须用 `todo.id`。
- **不改写 Registry 组件默认 class**：Checkbox 打勾动画不能靠改写 `Checkbox.vue` 的内部 class 实现。
- **computed 分组渲染、模板不承担转换逻辑**：状态转换仍在 `domain` 纯函数与页面状态层。
- 视觉克制：无渐变光晕、玻璃态、弹网页字体。

## 架构与边界

### 1. 跨区移动 —— 双 auto-animate 容器（关键决策）

由于 `仅单一容器才支持 FLIP，而规范要求两个语义 section`，采用**双容器 + auto-animate** 方案：

```
<section 进行中>
  <ul ref="activeList">                 ← useAutoAnimate 包裹
    <li v-for="todo in activeTodos">
<section 已完成>
  <ul ref="completedList">             ← useAutoAnimate 包裹
    <li v-for="todo in completedTodos">
```

- **勾选完成**：待办从 `activeTodos` 移除、进入 `completedTodos`。`useAutoAnimate(activeList)` 让该项在 active 容器内 `leave`（折叠高度 + 淡出）；`useAutoAnimate(completedList)` 让它进入 completed 容器 `enter`（展开 + 淡入到已完成区）。
- **新增**：`activeList` 的 `enter` 自然产生展开入场。
- **方向感**：已完成区块在下方 + 已完成标题携带 `line-through` 与低对比；勾选动作自然"向下移入完成区"，结合 leave/enter 时序形成连贯观感。
- **能力取舍（接受项）**：`auto-animate` 只做同容器 FLIP，**跨容器无法做到"从 A 处精确滑到 B 处"的单一连续轨迹**；它表现为"源区淡出折叠 + 目标区展开淡入"。要在两个容器间精确滑行需手写跨容器 FLIP（把 one 元素以 position:fixed 从起止点渐近）——代码与风险高、且违背极简与语义化约束，**不做**。若你审阅后认为"精确滑行"高于语义化，可替换为方案 B（单 Flex 容器用 computed 排序 + 内嵌静态 "已完成"标题），但列为风险项。

> 注意：方案依赖两个 auto-animate 容器独立动画。leave/enter 时长建议对齐（默认 250ms、ease），并在 enter 延迟一点让两容器节奏不重叠（可 `duration` 参数微调），页面才不显得拥挤。

### 2. 打勾动画（不动 Registry 组件）

通过 `Checkbox` 的 **indicator slot** 传入自定义对勾，不打改 `Checkbox.vue` 默认 class：

- 用内联 `<svg viewBox>` 或简洁 `<CheckIcon>`，施加 `stroke-dasharray`/`stroke-dashoffset` 过渡实现"对勾描画"。
- 勾选时给 indicator 一个轻微 `scale` 回弹（`.data-[state=checked]` 下 transform），此反馈放在 slot 内的自定义元素 svg 上，不改组件本身。
- wrapped in `transition-colors`/`transition-transform`，完全 Tailwind。

### 3. 里程碑彩带 —— 新组件 `<Celebration/>

- 新组件 `src/components/Celebration.vue`：监听"完成率跃升至 100%"，渲染**一次性**轻量彩带（若干定位碎片 + CSS 动画自动结束自移除），或有原生 toast 的简化版。
- **防误触发**：在页面状态层用 `watch` + 旧值快照——仅当 `prevCompletion < 100 && newCompletion === 100`（即从"未全部"跃迁到"全部"）触发；取消勾选不会再到 100，天然不重触发。
- `prefers-reduced-motion` 下直接不渲染动画。

### 4. 顶部进度条增强

- **宽度**：保留 `transition-[width] duration-300`（已有）。
- **完成数平滑滚动**：用极小的 `useAnimatedNumber`（`@vueuse/useTransition` 或自写 rAF 缓动）把 `${summary.completed}` 数字从旧值缓动到新值。实现轻量、无新依赖。
- **完成反馈**：达到 100% 时进度条内做一个一次性的 `scale/亮度` 微脉冲（与彩带同节点）。不做参数。
- 规约后数字与完成率不同步会显得怪——数字动画与彩带同触发。

### 5. reduced-motion 降级（跨所有动画）

- 用 `@vueuse/core`? 的 `useReducedMotion()` 读系统偏好。
- 当一个对象为 true 时：`useAutoAnimate` 传 `{ duration: 0 }` 或直接在容器关 removeMotion 行为；打勾 svg/标 pulse 不判；进度数字数字直接设值。
- 分支在一个小的 `useMotionController()` composable 内收敛，App 与 Celebration/Checkbox 通过它取得 `reduced`。

## 数据流与契约

- **状态不变**：仍走 `createTodo` / `setTodoCompleted` / `getTodoSummary` 纯函数，`activeTodos`/`completedTodos` 计算属性不变。动画是纯渲染增强，不触碰 `src/domain/todo.ts`。
- **新增状态（页面级）**：`confettiTrigger` ref（布尔，触发后 auto 复位）；`lastCompletion` 快照用于阶段检测。均为 `script setup` 局部状态，符合"Page 状态定义在脚本顶部"。
- 无全局 store 变更。

## 兼容与回滚

- 新增依赖：`@formkit/auto-animate`（`0.10.x`，从 `@formkit/auto-animate/vue` 导入 `useAutoAnimate`）。原规划中的 `@vueuse/auto-animate` 不存在于 npm，已在实现阶段纠正。
- 回滚点：动画是**增强层**；css/animation 代码可整体回退，功能（增改分�组计数）不受影响。回滚即还原 `App.vue` 模板与删除 `useAutoAnimate` 挂点。
- 依赖 `@formkit/auto-animate`：可 `pnpm remove` 还原。

## Trade-offs 汇总

| 决策 | 取舍 |
|---|---|
| 双容器 auto-animate（非单容器 FLIP） | 语义化 section + 低风险，非"精确跨容器滑行轨迹" |
| indicator slot 自定义打勾 | 不动 Registry 组件，视觉本身内聚 |
| 里程碑彩带为新组件 + 状态跃迁触发 | 只触发一次不轰炸；reduced-motion 跳过 |
| 进度条数字用轻量数字缓动 | 无新依赖（用 XYZ 底层 rAF 小composable） |
| reduced-motion 集中 useState | 一处开关，全动画统一降级 |

## Out of scope

- 不改造 `domain/todo.ts`、不引入状态库、不动 Registry 组件默认 class 结构。
- 不做跨容器精确连续轨迹 FLIP（见架构）。未来若需：改回单容器排序方案（独立标记）。

初步设计完。 下一步写 `implement.md` 的可执行清单。