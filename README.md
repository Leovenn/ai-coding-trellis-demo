# AI Coding × Trellis 演示项目

这是一个基于 Vue 3、TypeScript、Vite、Vitest 和 shadcn-vue 的学生成绩看板，用于演示 AI Coding 与 Trellis 的日常开发流程。

## 基础功能

- 新增学生成绩。
- 展示学生、科目、成绩和录入日期。
- 自动计算学生人数、平均分和最高分。
- 使用纯前端内存数据，不连接后端。

当前基线不包含姓名搜索、成绩范围校验和成绩等级统计。这三部分用于后续普通任务、结构性任务和 Spec 复用验证。

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
