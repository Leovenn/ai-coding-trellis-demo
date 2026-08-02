# AI Coding × Trellis 演示项目

这是一个基于 Vue 3、TypeScript、Vite 和 Vitest 的报销记录看板，用于展示 AI Coding 与 Trellis 的日常开发流程。

## 基础功能

- 新增报销记录。
- 展示报销列表和状态。
- 计算报销总额。
- 使用纯前端内存数据，不连接后端。

当前基线不包含状态筛选，也保留了 JavaScript 浮点金额直接计算的实现。这两部分分别用于后续普通任务和结构性任务演示。

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
