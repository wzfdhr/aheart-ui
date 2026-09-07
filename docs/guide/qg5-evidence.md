# QG5 跨浏览器证据

QG5 的生产站自动化浏览器矩阵已经建立；物理 iOS Safari 与连续 10 次主分稳定性仍需外部证据才能完成验收。两类证据必须分开记录：Playwright 的 `mobile-webkit` 是 WebKit 引擎与移动视口回归，不能替代物理 iOS 设备上的手指触摸验收。

## 自动化浏览器矩阵

每次 QG5 CI 分别执行 Desktop Chromium、Mobile Chromium、Desktop Firefox、Desktop WebKit 和 Mobile WebKit。每个项目都会上传 HTML report 与控制台日志；失败时额外保留 trace、截图和视频。artifact 名称包含 GitHub run ID 与 attempt。

本地可执行：

```bash
corepack pnpm test:e2e:qg5
```

## iOS Safari 真机证据

真机记录必须绑定待验收的完整 commit SHA，并由测试经理复核以下任务：

1. 使用物理 iOS 设备和手指拖动 DnD 可见拖动柄，完成可信触摸排序。
2. 在 DnD 正文区域执行正文滚动，确认页面发生滚动且项目顺序不变。
3. 使用手指调整 Splitter，确认面板尺寸提交。
4. 中断一次拖动，确认遮罩、光标、文本选择和监听器完成取消清理，随后可再次拖动。

证据 JSON 使用 `qg5-ios-safari-evidence.v1`。截图和视频保存在 GitHub artifact 或受控测试存储，不提交仓库；每个文件都记录路径、字节数和 SHA-256。仓库校验器拒绝模拟器、Playwright WebKit、脚本 PointerEvent、错 commit、缺少可观察结果和损坏 artifact。

```bash
corepack pnpm check:qg5-ios-safari -- \
  --input /path/to/qg5-ios-safari-20260812-001.json \
  --sha "$(git rev-parse HEAD)" \
  --repository wzfdhr/aheart-ui \
  --branch codex/qg5-cross-browser-production
```

JSON 同目录下应有与 `evidenceId` 同名的 artifact 文件夹。设备型号、iOS/Safari 版本、系统 build、操作者、带时区的开始/结束时间和测试环境 URL 均为必填项。自动校验通过后，仍需测试经理人工确认录像确由物理设备与手指操作完成。

## 主分稳定性

稳定性条件保持为连续 10 次 QG5 主分运行的 flaky rate 低于 1%。10 次窗口中出现 1 次失败后重跑成功即为 10%，因此实际要求为零 flaky。

该条件采用两个状态，避免候选分支在进入 `master` 前无法产生主分证据的循环：

- **测量期**：PR 的单次五浏览器矩阵必须全部通过；QG5 进入 `master` 后，通过 `workflow_dispatch` 或后续 push 在同一 master commit 上累计合规运行。
- **强门禁期**：收集到连续 10 次有效运行且 flaky rate 低于 1% 后，稳定性检查转为发布必需证据。任何当前 PR 的失败仍直接阻断，历史通过率不能抵消当前失败。

采集与检查：

```bash
corepack pnpm collect:qg5-master-stability -- \
  --repository wzfdhr/aheart-ui \
  --sha "$(git rev-parse origin/master)" \
  > /tmp/qg5-master-stability.json

corepack pnpm check:qg5-master-stability -- \
  --input /tmp/qg5-master-stability.json \
  --sha "$(git rev-parse origin/master)"
```

采集器保留每次 GitHub run 的全部 attempt 和五个浏览器分片。校验器拒绝少于 10 次、缺失分片、最终失败、非 `master` 记录以及 flaky rate 不达标的窗口。

## 当前状态

- PR 自动化五浏览器矩阵：必须全绿。
- 物理 iOS Safari：只有提交有效真机记录并通过人工复核后才可标记通过。
- 连续 10 次主分稳定性：QG5 合并后进入测量期，达到窗口后转强门禁。
