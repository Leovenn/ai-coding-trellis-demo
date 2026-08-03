# 前端开发规范

> 本目录记录“今日清单”当前已经落地的前端约定。规范来自真实代码，后续任务应在实现变化时同步更新。

---

## 技术基线

- Vue 3 单文件组件与 `<script setup lang="ts">`。
- TypeScript 严格类型检查。
- Vite 与 Tailwind CSS v4 负责开发、构建和样式生成。
- shadcn-vue Nova 风格组件基于 Reka UI，组件源码保存在仓库中。
- Vitest 与 Vue Test Utils 负责领域单元测试和页面组件测试。
- 数据仅保存在当前页面内存中，不接后端，也不使用全局状态库。

参考：[package.json](../../../package.json)、[components.json](../../../components.json)、[vite.config.ts](../../../vite.config.ts) 和 [tsconfig.app.json](../../../tsconfig.app.json)。

---

## 规范索引

| 规范 | 适用内容 |
| --- | --- |
| [目录结构](./directory-structure.md) | 源码职责、Registry 组件和测试位置 |
| [组件规范](./component-guidelines.md) | Vue 组件、shadcn-vue、待办表单与可访问性 |
| [状态管理](./state-management.md) | 页面状态、派生分组和不可变更新 |
| [领域模型](./domain-model.md) | 待办结构、创建、完成状态和数量统计 |
| [类型安全](./type-safety.md) | TypeScript 类型、只读边界和禁止模式 |
| [质量规范](./quality-guidelines.md) | 测试策略、验证命令和审核清单 |

---

## 开发前检查

1. 先阅读与任务相关的规范文件，不要只读本索引。
2. 修改 `TodoItem` 字段或生命周期前，使用 `rg` 查找所有消费者。
3. 领域对象创建、状态转换和统计放在 `src/domain/` 的纯函数中。
4. UI 优先组合 `src/components/ui/` 中已有的 shadcn-vue 组件。
5. 修改可观察行为时同步更新相邻测试。

## 质量检查

按顺序运行：

```bash
pnpm test
pnpm run build
```

其中 `pnpm run build` 同时执行 `vue-tsc` 类型检查和 Vite 生产构建。

---

**语言约定**：规范正文、界面文案和测试描述使用中文；代码标识符、命令和技术专有名词保留原文。
