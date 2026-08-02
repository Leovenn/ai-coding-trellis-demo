# 目录结构

> 业务代码保持少文件结构；shadcn-vue Registry 组件按组件目录独立维护。

---

## 当前结构

```text
src/
├── App.vue                     # 页面组合、表单交互和成绩列表
├── App.test.ts                 # 页面级组件测试
├── components/ui/              # shadcn-vue Registry 组件源码
│   ├── badge/
│   ├── button/
│   ├── card/
│   ├── input/
│   ├── label/
│   ├── select/
│   └── separator/
├── domain/
│   ├── score.ts                # 成绩类型、初始数据和纯统计函数
│   └── score.test.ts           # 领域逻辑单元测试
├── lib/utils.ts                # shadcn-vue class 合并工具
├── main.ts                     # Vue 应用入口
└── style.css                   # Tailwind、主题变量和全局基础样式
```

参考：[src/App.vue](../../../src/App.vue)、[src/domain/score.ts](../../../src/domain/score.ts) 和 [components.json](../../../components.json)。

---

## 职责边界

- `src/App.vue` 负责页面状态、用户输入、布局和组件组合，不重复实现领域统计。
- `src/domain/` 负责稳定的数据类型、科目集合、演示数据和可独立测试的纯函数。
- `src/components/ui/` 是通过 shadcn-vue Registry 写入仓库的基础组件，不放业务逻辑。
- `src/lib/utils.ts` 只负责 class 合并，是 shadcn-vue 组件的公共依赖。
- `src/style.css` 保存 Tailwind 导入、主题变量和全局基础样式。
- 测试与被测业务文件相邻，以 `.test.ts` 结尾。

## 新文件的放置规则

- 新增纯业务规则或统计：放入 `src/domain/`。
- 新增页面交互：当前只有一个页面时保留在 `App.vue`；职责独立或出现真实复用时才拆分业务组件。
- 新增基础 UI 组件：使用 shadcn-vue CLI 写入 `src/components/ui/`，不要手写第二套同名组件。
- 新增共享有状态逻辑：出现两个以上真实消费者后，再创建 `src/composables/`。
- 不为不存在的后端、路由或全局状态预建空目录。

## 命名约定

- Vue 业务组件文件使用 PascalCase，例如 `App.vue`。
- 领域模块和测试文件使用小写名，例如 `score.ts`、`score.test.ts`。
- shadcn-vue 组件保持 Registry 生成的目录和导出结构。
- TypeScript 变量和函数使用 camelCase，类型使用 PascalCase。

## 避免

- 不在多个组件中分别声明 `StudentScore` 或科目集合。
- 不把业务计算复制进模板表达式。
- 不直接修改 Registry 组件来满足单个页面的业务样式，优先通过 `class` 组合。
- 不保留未使用的 Registry 组件和依赖。
