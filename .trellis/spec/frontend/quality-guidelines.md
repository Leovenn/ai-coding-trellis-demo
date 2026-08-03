# 质量规范

> 当前项目使用 Vitest、Vue Test Utils、`vue-tsc` 和 Vite 构成最小质量门禁。

---

## 测试分层

### 领域逻辑单元测试

[src/domain/todo.test.ts](../../../src/domain/todo.test.ts) 直接测试纯函数：

- 新待办默认为未完成。
- 完成状态以不可变方式更新。
- 不存在的标识不会修改其他待办。
- 总数、已完成和待完成数量计算正确。

新增领域函数或修改生命周期规则时，优先在相邻领域测试中覆盖正常路径和边界。

### 页面组件测试

[src/App.test.ts](../../../src/App.test.ts) 使用 Vue Test Utils 和 jsdom 验证用户可观察行为：

- 初始待办、复选框数量和完成概览正确展示。
- 填写并提交后新增一条进行中待办。
- 新增成功后输入框清空，数量同步更新。
- 勾选待办后，进行中和已完成分组以及概览同步更新。

组件测试断言页面行为和语义，不断言内部 `ref`、函数名或 Tailwind class。

## 验证命令

```bash
# 运行全部测试
pnpm test

# 监听测试
pnpm run test:watch

# TypeScript 检查和生产构建
pnpm run build
```

## 测试发现隔离

Trellis/Claude 子代理会在仓库内的 `.claude/worktrees/` 创建完整源码副本。Vitest 若使用默认递归发现，会误执行这些副本中的测试，造成重复套件、缺文件或 Vue 运行时交叉污染。

`vite.config.ts` 必须保留以下排除项：

```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '**/.claude/worktrees/**'],
  },
})
```

验证应从仓库根目录执行 `pnpm test`；只在单个代理 worktree 内通过不等于根目录质量门禁通过。

## 必须遵循

- 新增纯函数时补充单元测试。
- 修改可观察交互时补充或更新组件测试。
- 修复缺陷时先增加能复现问题的回归测试。
- 测试数据应只包含理解行为所需的字段和值。
- Registry 组件升级后至少运行组件测试和构建。
- 提交前按“测试 → 类型检查与构建”的顺序验证。

## 避免

- 不写实现被删除后仍会通过的空洞测试。
- 不通过快照替代关键行为断言。
- 不在测试中复制生产状态转换来生成期望值。
- 不用类型断言或忽略指令隐藏测试环境中的真实错误。
- 不为了让检查通过而吞掉异常或添加静默兜底。

## 审核清单

- [ ] 改动符合当前领域类型和目录职责。
- [ ] 没有重复的待办状态转换或数量计算。
- [ ] shadcn-vue 组件通过公共入口导入且没有已确认无用的组件。
- [ ] 交互元素具有可访问名称和键盘焦点样式。
- [ ] 相关测试覆盖正常路径和必要边界。
- [ ] `pnpm test` 通过。
- [ ] `pnpm run build` 通过。
- [ ] 新出现的长期规则已经评估是否需要更新 Spec。
