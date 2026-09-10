# D8 五浏览器独立执行记录

日期：2026-09-10

## 执行命令

```text
AHEART_E2E_PORT=5332 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop --project=mobile --project=desktop-firefox --project=desktop-webkit --project=mobile-webkit --reporter=line --output=/tmp/aheart-d8-browser-five
```

执行使用独占端口 `5332`，一次运行五个 Playwright project，共 25 个测试；没有 `skip`、`only`、`force` 或重跑掩盖失败。

关闭时序修复前的首轮结果保留在 `/tmp/aheart-d8-browser-five`；该轮唯一失败为 desktop WebKit 的 iframe cleanup count。随后先在独占端口 `5332` 单独执行该测试：

```text
AHEART_E2E_PORT=5332 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop-webkit --grep 'tool summary' --reporter=line --output=/tmp/aheart-d8-browser-webkit-close
```

单测结果：**1 passed, 0 failed**，耗时 **10.2s**。

## 结果

| Project | Passed | Failed | Skipped | 说明 |
| --- | ---: | ---: | ---: | --- |
| desktop | 5 | 0 | 0 | V2、Workbench、任务排序、AIForm、tool/iframe 全通过 |
| mobile | 5 | 0 | 0 | 同一 390×844 入口全通过 |
| desktop-firefox | 5 | 0 | 0 | 全通过 |
| desktop-webkit | 5 | 0 | 0 | 关闭时序修复后通过 |
| mobile-webkit | 5 | 0 | 0 | 全通过 |
| 总计 | **25** | **0** | **0** | 25 tests，退出码 0，耗时 **23.4s** |

## 修复前失败（已复验通过）

`desktop-webkit` 的 `tool summary is whitelist-only and iframe owner-document cleanup survives narrow 200% layout` 在真实 iframe Drawer 关闭并点击卸载后失败：

```text
Expected: "1"
Received: "0"
Locator: iframe[data-testid="d8-owner-document-iframe"]
  .contentFrame().getByTestId("d8-iframe-cleanup-count")
```

这不是选择器跳过或超时放宽；修复前失败 artifact 保留在：

```text
/tmp/aheart-d8-browser-five/d8-ai-D8-AI-browser-contra-988b9--survives-narrow-200-layout-desktop-webkit/
```

其中包含 `error-context.md`、失败截图、视频和 `trace.zip`。修复后的关闭路径现在等待 `.aheart-drawer.is-hidden` 或 `aria-hidden=true`、确认 iframe body scroll lock 已释放，再触发卸载；完整五项目复验未再失败。

## pageerror / console error

测试在每个 fixture 开始时收集 `pageerror` 与 `console` 类型为 `error` 的消息，并在每个行为断言完成后执行 `expect(runtimeErrors).toEqual([])`。

- 完整复验的 25 个测试均完成该断言，未观察到 pageerror 或 console error。
- 修复前失败发生在 cleanup 计数断言，位于该测试最后的运行时错误断言之前；该轮不能报告为零错误断言通过。修复后所有测试均完成并通过该断言。

## 复核

本轮只新增本证据文件；未修改测试、docs 页面或生产代码。工作树现有其他 D8 修改保持不动。`git diff --check` 及新增证据文件空白检查通过。
