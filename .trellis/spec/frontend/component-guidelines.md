# 组件规范

> 当前组件约定来自 [src/App.vue](../../../src/App.vue)、[src/App.test.ts](../../../src/App.test.ts) 和 `src/components/ui/`。

---

## shadcn-vue 使用方式

- 项目使用 `components.json` 中定义的 `reka-nova` 风格和 Reka UI 基础层。
- Button、Card、Input、Label、Select、Badge、Separator 从对应的 `@/components/ui/*` 入口导入。
- Registry 组件源码属于项目代码，可以审核；业务页面通过 Props、Slots 和 `class` 组合使用。
- 页面级颜色、间距和布局使用 Tailwind class，不把业务样式写入基础组件。
- 新增 Registry 组件后删除未使用的组件和专属依赖，避免演示项目膨胀。

## 单文件组件结构

- 使用 `<script setup lang="ts">`，脚本放在模板之前。
- 导入顺序保持“外部库 → UI 组件 → 领域模块”。
- 从领域模块导入类型、常量和纯函数，组件不重新定义它们。
- 页面状态定义在脚本顶部，事件处理函数保持短小并使用提前返回。

## 表单处理

- 使用 `@submit.prevent` 统一处理提交，不把新增逻辑绑定到按钮点击事件。
- 每个输入必须有可见的 shadcn-vue `Label`、稳定的 `id` 和 `name`。
- 文本和数字输入使用 `Input`，有限集合使用基于 Reka UI 的 `Select`。
- 原始数字输入在构造领域对象前通过 `Number(...)` 转换，并检查空值与有限数。
- 当前基础版尚未校验成绩范围和整数约束，不能在其他组件中提前增加一套局部规则。
- 创建记录成功后显式重置姓名和成绩字段。

## 列表渲染

- `v-for` 必须使用稳定业务标识作为 `key`，当前使用 `item.id`。
- 科目选项统一来自 `subjects`，模板不得维护第二份数组。
- 数据表格使用语义化的 `table`、`thead`、`tbody` 和 `th`。
- 小屏幕下由外层 `overflow-x-auto` 提供横向滚动。
- 最高分标识来自 `findHighestScore()` 的结果，不在每一行重复计算。

## 视觉约定

- 整体采用低饱和薄荷绿、白色半透明卡片和大面积留白。
- 主色和基础语义色定义在 [src/style.css](../../../src/style.css) 的 CSS Variables 中。
- 局部业务色通过 Tailwind class 表达，例如不同科目的 Badge 配色。
- 图标使用 `@lucide/vue`，图标辅助文字，不替代必要标签。
- 不依赖外部字体网络请求，使用系统中文字体栈。

## 可访问性

- 概览区域提供可读的 `aria-label`。
- 交互元素优先使用 shadcn-vue 包装的原生语义组件。
- 输入标签的 `for` 必须与控件 `id` 一致。
- 图标表达独立含义时提供 `aria-label`，装饰性图标由组件语义文字补充。
- 键盘焦点使用主题 Ring 或页面指定的清晰焦点样式。

## 避免

- 不在模板中执行复杂统计或数据转换。
- 不直接修改从 `initialScores` 导入的只读数据。
- 不为了单页样式直接改写 Registry 组件内部默认 class。
- 不引入另一套完整 UI 组件库。
