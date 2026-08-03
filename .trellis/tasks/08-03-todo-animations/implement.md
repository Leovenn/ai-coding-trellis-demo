# Implement — 待办体验动画

> 复杂任务：实现前必须有 `prd.md`、`design.md`、本文件并 review，且 `implement.jsonl`/`check.jsonl` 各有真实条目，然后 `task.py start`。

## 前置

- 依赖：`pnpm add @formkit/auto-animate`（官方 Vue 集成从 `@formkit/auto-animate/vue` 导入，其余全部手写/已有）。
- 参考 `prd.md`（R1–R7 / A1–A7）与 `design.md`。

## 有序实现清单

1. **安装依赖**
   - `pnpm add @formkit/auto-animate`
   - 确认从 `@formkit/auto-animate/vue` 导入 `useAutoAnimate`，类型通过。

2. **集中 reduced-motion 控制**（新 composable）
   - `src/composables/useMotionController.ts`：用 `@vueuse/core` 的 `useReducedMotion()`，导出 `{ reduced }`；统一供 App / Celebration / Checkbox 动画降级判断。纯渲染关心点，不影响。

3. **App.vue 跨区动画容器（核心）**
   - 「进行中」`<ul ref="activeList">` 与「已完成」`<ul ref="completedList">` 各用 `useAutoAnimate(activeList)` / `useAutoAnimate(completedList)` 包裹对应 `<li v-for...>` 列表。
   - 勾选完成 → leave（active 折叠淡出）+ enter（completed 展开淡入）；新增 → enter。
   - reduced 时为 `duration: 0` 即时切换。
   - 保留语义 `<section>`、`aria-labelledby`、稳定 `todo.id` key；为空提示保留。

4. **打勾动画（不动 Registry 组件）**
   - 通过 `Checkbox` 的 indicator slot 传入自定义对勾（svg 描边 `stroke-dasharray/dashoffset` 过渡 + 勾选时 `scale` 回弹），样式类放在 slot 内自定义元素上，不写进 `Checkbox.vue` 默认 class。
   - reduced 时关闭描边/回弹。

5. **里程碑彩带组件**
   - 新建 `src/components/Celebration.vue`：一次性轻量彩带（固定层、CSS 动画、结束后自移除），props 控制触发；reduced 时零渲染。
   - App.vue 集成：用 `watch` + 旧值快照，仅当 `(prev < 100 → now === 100)` 跃迁触发一次，自动复位。

6. **进度条增强**
   - 完成数平滑：新 `useAnimatedNumber`（rAF/缓动，无新依赖）把 `${summary.completed}` 数字从旧值缓动到新值。
   - 达到 100% 时进度条一次性微脉冲（与彩带同触发点）。

7. **测试更新**
   - 核心：既有组件测试断言"勾选后分组与概览同步更新"等**行为**应保持不变、不因动画而失效。
   - 补充可观察行为断言（不断言 class/ref）：新增后出现在进行中、勾选后进入已完成、全完成时出现彩带占位、reduced-motion 下无动画痕迹（可用 `matchMedia` stub）。
   - `.trellis/spec/frontend/quality-guidelines.md`：不振快照、不复制转换逻辑。

8. **验证**
   - `pnpm test` 全绿
   - `pnpm run build`（vue-tsc 类型检查 + 生产构建）通过

## 风险文件与回滚点

- **`src/App.vue`**：改动最大（模板 + 动画挂点 + watch）。若跨区方案有误，回滚点为此文件还原 + 移除 `useAutoAnimate` 挂点即可恢复功能。
- 新增文件：`src/components/Celebration.vue`、`src/composables/useMotionController.ts`、数字缓动 composable——均可单独删除回滚。
- 依赖 `@formkit/auto-animate`：可 `pnpm remove` 还原。
- `src/domain/todo.ts` **不改**。

## start 前核对（review gate）

- [ ] prd.md 已收敛、无残留开放问题
- [ ] design.md / implement.md 已存在且与 prd 一致
- [ ] implement.jsonl / check.jsonl 有真实条目（见下）
- [ ] 用户已初审上述 artifacts，同意进入实现
- [ ] `python3 ./.trellis/scripts/task.py start 08-03-todo-animations`