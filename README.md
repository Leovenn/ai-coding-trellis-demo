# AI Coding × Trellis 演示项目

这是一个基于 Vue 3、TypeScript、Vite、Vitest 和 shadcn-vue 的轻量待办清单，用于演示 AI Coding 与 Trellis 的日常开发流程。

## 基础功能

- 新增待办。
- 展示进行中和已完成待办。
- 切换待办完成状态。
- 自动统计总数、已完成和待完成数量。
- 使用纯前端内存数据，不连接后端。

当前基线不包含删除、回收站和批量清空功能，这些功能保留给后续 Spec 沉淀与复用演示。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 质量检查

```bash
pnpm test
pnpm run build
```

## 开发工具

- Codex CLI：任务分析、编码与检查。
- Claude Code CLI：独立会话开发与 Spec 复用验证。
- VS Code：查看代码、审核变更和运行项目。
