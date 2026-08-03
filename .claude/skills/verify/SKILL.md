---
name: verify-todo-web
context: fork
agent: general-purpose
model: inherit
description: 通过 Vite 与 Chrome DevTools Protocol 运行并验证今日待办页面的新增、完成、庆祝和 reduced-motion 行为。
---

# 今日待办运行验证

## 启动

```bash
pnpm dev --host 127.0.0.1 --port 4173
```

等待 `http://127.0.0.1:4173` 可访问。

## 浏览器

macOS 使用本机 Chrome 的 CDP：

```bash
profile=$(mktemp -d /tmp/todo-animation-chrome.XXXXXX)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-first-run --no-default-browser-check \
  --remote-debugging-port=9223 --user-data-dir="$profile" \
  http://127.0.0.1:4173
```

通过 `http://127.0.0.1:9223/json/list` 获取页面的 `webSocketDebuggerUrl`。Node 当前提供原生 `WebSocket`，可直接发送 CDP `Runtime.evaluate` 与 `Page.captureScreenshot`。

## 必验流程

1. 在 `input[name="todo-title"]` 输入标题，等待一个 tick 后点击 `button[type="submit"]`；确认新项置顶、输入清空，列表存在运行中 Web Animation。
2. 逐个点击 `button[aria-label^="完成待办："]`；确认进行中为 0、已完成数量正确、空状态出现、`[data-testid="celebration"]` 在 100% 时出现。
3. 用 `Emulation.setEmulatedMedia` 设置 `prefers-reduced-motion: reduce`，刷新并重放完成流程；确认功能正常、庆祝层不渲染、无运行中动画。
4. 用 `Page.captureScreenshot` 保存全部完成画面并实际查看。

## 注意

同一 JavaScript tick 内派发 `input` 后立刻 `requestSubmit()` 会早于 Vue 的 v-model 刷新；验证脚本应等待一个 tick，再模拟真实按钮点击。