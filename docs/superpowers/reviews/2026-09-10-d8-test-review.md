# D8 独立测试经理审查

审查日期：2026-09-10（Asia/Shanghai）
分支：`codex/d8-ai`
基线：`ff243fffc2a3c8e7d7d1b169e77d7c3914cf0f1e`
职责：独立测试经理；本轮未修改生产源码、现有测试、docs fixture、配置或 lockfile。
最终结论（受后续候选增量复验覆盖）：**暂不放行产品经理验收**；P0/P1/P2 = **0/0/1**。

## 候选与独立证据

本轮从开发经理已复查为 0/0/0 的 gzip 修复候选重新执行，没有沿用上一轮 P2 失败证据。工作树仍是未提交候选，`HEAD` 是基线提交，故不把基线 SHA 冒充候选提交 SHA。

所有本轮独立产物使用单一临时根目录：`/tmp/d8-final-independent.T6oo3u`。完成后可整体清理该目录；consumer 安装根目录由 runner 创建在系统临时目录：`/private/var/folders/r6/2s10_vtx00l5g5kwbl5hkxw00000gn/T/aheart-d8-ai-m7pOaD`。

## 结果矩阵

### AI unit 与 typecheck

命令：

```text
corepack pnpm --filter @aheart-ui/ai test -- --reporter dot
corepack pnpm --filter @aheart-ui/ai typecheck
```

结果：10 个测试文件、**200/200** 通过，退出码 0；`vue-tsc --noEmit -p tsconfig.json` 退出码 0。未观察到 Vue warning、unhandled exception 或 unhandled rejection；Vite CJS API 弃用提示不计为失败。

### 五浏览器真实运行

命令：

```text
AHEART_E2E_PORT=5348 corepack pnpm exec playwright test e2e/d8-ai.spec.ts \
  --project=desktop --project=mobile --project=desktop-firefox \
  --project=desktop-webkit --project=mobile-webkit \
  --reporter=line --output=/tmp/d8-final-independent.T6oo3u/e2e
```

结果：**25 passed (25.4s)**，退出码 0，五个 project 各执行 5 个场景。测试真实启动 docs server，使用新端口 5348 和新输出目录，没有复用历史 browser 日志。覆盖真实 ChatPanel 的乱序/去重/reconnect/final/会话切换、Workbench 桌面→移动单 owner、操作幂等与重试、依赖/锁定/旧 revision、AIForm、工具白名单、iframe ownerDocument cleanup、窄屏/200% 布局。每个场景实际收集并断言 pageerror/console error 为空。

### AI build、生成物与公开包面

命令：

```text
corepack pnpm --filter @aheart-ui/ai build   # 连续执行 4 次；第 3、4 次生成快照
```

两次连续快照均为 **112 个生成文件且 SHA-256 清单完全一致**。公开包回查通过：

- ESM：`es/index.js`、`es/index.d.ts`
- CJS：`lib/index.js`
- CSS：`es/style.css` / `lib/style.css`
- package `main/module/types/exports` 指向公开产物
- Vue peer：`>=3.5.0 <4`
- 组件公开名称由 consumer plugin/import 验证

`cmp packages/ai/es/style.css packages/ai/lib/style.css` 通过；`git diff --check` 通过。

### 全新 packed consumer

分别在包目录使用 `corepack pnpm pack` 生成全新 tarball，并在全新临时 consumer 中用 npm 安装；`symlink: false`。本轮 tarball SHA-256：

- AI：115 files，`f23a7504a328c5f5cd7c8addcdaee241cbe3a3c1c9057954be33d750bbc35f27`
- Components：995 files，`b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`
- DnD：79 files，`a78c41e518ebc5f2c46af7638a958d5d81a3204aaaaed03f6358b6e2fe036eee`

命令入口：

```text
node docs/superpowers/experiments/d8-consumer/run.mjs \
  --ai-tarball /tmp/d8-final-independent.T6oo3u/pack/aheart-ui-ai-1.0.0.tgz \
  --components-tarball /tmp/d8-final-independent.T6oo3u/pack/aheart-ui-1.0.0.tgz \
  --dnd-tarball /tmp/d8-final-independent.T6oo3u/pack/aheart-ui-dnd-1.0.0.tgz \
  --out /tmp/d8-final-independent.T6oo3u/consumer
```

结果 `status: passed`，退出码 0；Node `v24.17.0`、npm `11.13.0`、pnpm `9.15.4`。public types、ESM/CJS、CSS、Vue peer、plugin install、reducer、SSR deterministic output、hydration、Chat lifecycle、Workbench operations/reorder、AIForm、primitive-only bundle isolation 全部通过。

### 同工具链生产 gzip

baseline 与 current 均使用 Vite **5.0.12**、同一 production lib build 配置和同一入口形态：

```text
node --input-type=module -e 'import { build } from "vite"; ... build({root,configFile:false,logLevel:"error",build:{outDir,emptyOutDir:true,minify:false,lib:{entry,formats:["es"],fileName:"ai-consumer"}}})'
node docs/superpowers/experiments/d8-consumer/measure-gzip.mjs \
  --baseline /tmp/d8-final-independent.T6oo3u/gzip-baseline/dist/ai-consumer.js \
  --current /tmp/d8-final-independent.T6oo3u/gzip-current/dist/ai-consumer.js \
  --out /tmp/d8-final-independent.T6oo3u/gzip.json
```

完整 bundle SHA-256：

- baseline：`01bdb99289e1e09fc60985bebcf0a419cda9529dae4a066b6fd4bcd3f0456043`
- current：`758745f2ed04f8f3ec82db9601ad7da477decc29bddba3117b3009308424a6b0`

结果：baseline gzip **301,281 bytes**，current gzip **310,757 bytes**，增量 **9,476 bytes**，上限 12,288 bytes；退出码 0，门禁通过。未混用上一轮 `313,422` 的失败 bundle。

### Docs、lock 与 skip 边界

- `corepack pnpm docs:build`：通过，退出码 0；VitePress 1.6.4 完成 client/server/rendering。
- `git diff --numstat -- pnpm-lock.yaml`：无输出；整个执行前后 lockfile 无 diff。
- D8 E2E 与 AI tests：未发现新增 `skip`、`only`、`fixme`、force skip 或 timeout 放宽。
- 五浏览器场景真实验证了 reconnect 唯一可见 live status、tool 输入/结果标签、reasoning/raw/secret 隐藏、桌面/移动单 owner、operation 幂等、依赖锁、AIForm 与 iframe cleanup。

## 审核结论

| 等级 | 数量 | 结果 |
| --- | ---: | --- |
| P0 | 0 | 无阻断性崩溃、数据错误或安全暴露 |
| P1 | 0 | unit/typecheck、browser、consumer、build、SSR/hydrate 全部通过 |
| P2 | 0 | gzip 增量低于阈值；无新增 skip、lock drift 或 diffcheck 问题 |

最终决定：**独立测试经理通过，放行产品经理验收**。本报告不冒充 PR、CI、merge、master、Pages 或线上验证；这些仍必须在最终候选冻结后单独执行。

## 发布契约增量复审（2026-09-10）

主线程随后只调整了发布契约校验：`validatePackageContract` 使用
`contract.expectedVuePeer ?? '>=3.4.0 <4'`，因此 `aheart-ui` 与 `@aheart-ui/dnd`
仍保持默认 Vue peer floor `>=3.4.0 <4`，只有 `@aheart-ui/ai` 显式要求
`>=3.5.0 <4`。本增量未修改 AI 实现、生成物、测试 fixture 或 lockfile。

独立执行：

```text
node --test scripts/release-contract.test.mjs
node --test scripts/*.test.mjs
node scripts/release-contract.mjs
```

结果：发布契约定向 **7/7**、全 scripts **89/89**，均退出码 0；release pack 通过并验证：
`aheart-ui` **995 files**、`@aheart-ui/dnd` **79 files**、`@aheart-ui/ai` **115 files**。

独立源码审查确认：

- AI 的显式 Vue peer floor 仅作用于 AI contract；components/dnd 未被放宽或改成 3.5。
- packed manifest 仍拒绝任意 `workspace:` 协议；相关 reject 测试通过。
- AI 的 `@aheart-ui/dnd` 依赖仍必须是 `^1.0.0`，DnD 的 Pragmatic DnD 依赖约束仍保持；unexpected dependency range 与 DnD drift reject 测试通过。
- 必需的 ESM/CJS/types/CSS/package metadata 与禁止 source/test 文件的契约仍被校验。
- lockfile 仍无 diff，`git diff --check` 仍通过。

增量复审不改变结论：**P0/P1/P2 = 0/0/0，继续放行产品经理验收**。该增量同样不代表 PR、CI、merge、master、Pages 或线上验证。

## 最终候选跨里程碑增量复验（2026-09-10）

本轮重新执行了受影响范围：

- AI unit/typecheck：**200/200**、10 个文件，typecheck 通过。
- normal docs legacy：`docs-component-smoke.spec.ts` + `docs-information-architecture.spec.ts`，desktop 真实运行 **54 passed / 2 existing project skips**；包含 AI Agent Workbench H1、product context、Ready route `/components/ai-agent-workbench` 和其他 legacy 页面加载/无 runtime error 检查。
- D8 五浏览器：新端口 `5360`，新临时输出 `/tmp/d8-final-retest.YnlIFn/d8`，**25/25 passed**，退出码 0。
- Q5 定向：`e2e/q5-ai-product-suite.spec.ts`，desktop/mobile，`--grep 'AIChatPanel|AIForm|Agent workbench'`，**7 passed / 1 existing project skip**。
- QG4 a11y/visual 定向：新端口 `5365`，**8 passed / 2 existing project skips**；仅有两份 Workbench desktop snapshot 发生变化，mobile snapshot 未变化之外的其他 snapshot 也未变化。当前 diff 仅列出 `ai-agent-workbench-desktop-1440x900-desktop-darwin.png` 与 `ai-agent-workbench-desktop-1440x900-mobile-darwin.png` 两份文件。
- 全 scripts：**89/89**；release pack：`aheart-ui 995`、`@aheart-ui/dnd 79`、`@aheart-ui/ai 115`，均通过。
- `/tmp/d8-final-full-e2e-green/.last-run.json`：`status: passed`、`failedTests: []`；该既有全量证据按指令核验为 648 pass / 127 existing skip / 0 fail，本轮未以它替代新 D8/Q5/a11y/legacy 运行。
- `pnpm-lock.yaml`：前后无 diff；`git diff --check`：通过；skip 总边界未扩大。

发现一个尚未满足的生成门禁：

```text
corepack pnpm check:generated
```

退出码 1，原因是 `packages/ai/es/style.css` 与 `packages/ai/lib/style.css` 相对于当前 Git index 各有同一处尚未暂存的 mobile ChatPanel selector 修复（两份生成文件彼此一致，也与 `packages/ai/src/style.css` 一致）：

```text
.aheart-ai-workbench__mobile-panel .aheart-ai-chat-panel
```

因此这是当前候选卫生/生成门禁的 P2，而非运行时不一致；但在 index/候选冻结前不能宣称 generated gate 通过，也不能放行产品验收。该问题需要将对应源码与两份生成产物纳入同一最终候选后，重新执行 `check:generated` 与受影响门禁。

本增量结论：**P0/P1/P2 = 0/0/1，暂不放行产品经理验收**。除上述生成门禁外，AI、legacy docs、D8/Q5/QG4、scripts/release pack、snapshot 范围、skip 边界、lockfile 与 diffcheck 均通过。

## Clean commit 最终卫生复核（2026-09-10）

最终候选已冻结并提交为 `bcdaef57283d0410aeaa3cc010effd091e587dc0`；本轮仅在该 clean commit 上执行卫生门禁：

```text
corepack pnpm check:generated       # exit 0
git status --short --branch         # clean worktree
git diff --check                    # exit 0
git diff --numstat -- pnpm-lock.yaml # no output
```

此前受影响范围的独立结果保持有效：AI **200/200 + typecheck**、normal docs legacy **54 passed / 2 existing project skips**、D8 五浏览器 **25/25**（端口 5360）、Q5 定向 **7 passed / 1 existing project skip**、QG4 a11y/visual **8 passed / 2 existing project skips**、scripts **89/89**、release pack **995/79/115**；全仓最终 E2E 证据为 **648 pass / 127 existing skip / 0 fail**。snapshot 变化仍仅限两份 Workbench desktop baseline，skip 总边界未扩大。

生成门禁 P2 已关闭：`check:generated` 在 clean commit 上退出 0，工作树与 lockfile 均无漂移。

最终独立测试经理结论：**P0/P1/P2 = 0/0/0，放行产品经理验收**。本报告仍不冒充 PR、CI、merge、master、Pages 或线上验证。

## CI Linux visual baseline 增量复核（2026-09-10）

CI 仅在 Linux 视觉基线发现两项 Workbench desktop snapshot 差异，主线程从 artifact 更新了对应 actual；本轮独立核验如下：

- `git diff --name-only -- e2e/a11y-visual.spec.ts-snapshots` 仅包含：
  - `ai-agent-workbench-desktop-1440x900-desktop-linux.png`
  - `ai-agent-workbench-desktop-1440x900-mobile-linux.png`
- 两图均保持 **1040×1271 RGB PNG**；不存在其他 snapshot 变更。
- 当前 SHA-256：
  - desktop-linux：`45bfaeadedf97abb19eff2ef3566f6ac732dd8c090d57870d8f7418e09efe6bf`
  - mobile-linux：`dd54eaacd916360824215fe81913ef5d971fa82ab7315a6b5413c84406c10761`
- 与 commit `793b27c173517a13f393151cf5db955cc9a58f1a` 的旧图逐像素比较，两张图的差异 bounding box 均为 `(817,639)-(858,671)`，集中在执行时间线中禁用“上移”按钮的局部背景/文字抗锯齿区域；没有布局、内容、面板边界或其他组件区域变化。
- CI 报告的每图 55 diff pixels 与该局部差异一致；本环境无 Linux Playwright 容器，因此不把 macOS/本地截图冒充 Linux 重跑证据。
- 未修改视觉 diff 阈值、生产源码、测试行为或 skip；CI 其他步骤为 **646 pass / 127 existing skip / 2 visual fail**，五浏览器、脚本、release 与此前独立门禁保持通过。

决定：这两份 actual 属于受审查的 Linux 平台渲染基线更新，差异局部且仅限目标 Workbench 图；可以重新推送该 snapshot-only 修复候选并重新跑 PR CI。重推后仍必须核对 exact head 的 CI 全绿；本地独立门禁结论保持 **P0/P1/P2 = 0/0/0**，不将 CI 失败轮冒充通过。
