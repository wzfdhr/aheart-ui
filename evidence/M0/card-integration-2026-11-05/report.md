# M0 Card 整合、严格消费与升级回退验证

2026-11-05。**本地组合候选的类型和对比度阻塞已解决；未合并、未发布，M0 尚未 Accepted。**

本轮从 `codex/v2-m1` / `4915127aca0888a85015c5020a3f80ba3906931c` 的已有未提交对比度修复继续。保留上一轮全部改动，整合已审查的 [PR #39](https://github.com/wzfdhr/aheart-ui/pull/39) / `8b460a62cc89d388ead69968f3848791cec074fa`；初始 12 个文件逐字节一致、与既有修改无重叠，见 [pr39-import.json](pr39-import.json)。之后仅为声明扫描补充外置盘元数据识别；最终输入见 [source-manifest.json](source-manifest.json)。主工作树的 4,402 项既有状态记录未改变。

## 本轮改动

- 采用 #39 的 `SFCWithInstall<typeof component>` 声明修复和严格 tarball 消费门禁；Card 运行时行为与 API 不变。
- 试点 runner 默认要求 `skipLibCheck: false` 实际通过。重现旧 1.1.0 时必须显式指定 `--strict-types known-card-error`，仍返回非零状态；不会因“已知问题”放过新候选。
- `collect-declarations.mjs` 只排除存在同名源文件、且 magic/version 符合 AppleDouble 的 `._*.d.ts`，并记录排除清单。其他文件名或二进制内容继续交给 TypeScript 检查。
- 新增 `check-rollback.mjs`，在隔离 Todo 消费副本中执行公开包 → 候选包 → 公开包，保留同源浏览器状态，最后恢复原始 manifest/lock、依赖和构建。

## 验证结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| `corepack pnpm build` | 三包构建 exit 0 | card-combined-build.log.gz |
| `corepack pnpm typecheck` | 三包源码类型 exit 0 | card-combined-typecheck.log.gz |
| `corepack pnpm test` | 组件 1,485 + DND 79 + AI 200，脚本 248；全部通过，exit 0 | card-combined-tests.log.gz |
| 声明扫描器回归 | 2/2；证明只排除确认的元数据，不能凭 `._` 前缀吞掉错误 | card-declaration-scanner-tests.log.gz |
| 三包 `release:pack` | 契约检查 exit 0，tarball 无 `._*` 文件 | card-combined-pack.log.gz、artifacts.json |
| Vue 3.5.38 / 3.5.44 严格消费者 | 每版检查 486 份声明、根入口/别名/props/slots、Button 最小重现，全部 exit 0 | strict/results.json |
| 未含 Card 修复的旧候选 | 默认严格模式被正确拒绝：tsc exit 2、runner exit 1 | negative/results.json |
| 三个组合候选试点 | 安装、兼容及严格类型、SSR 构建、六视口交互和 axe 全过，runner exit 0 | pilots/results.json |
| clean-consumer iframe | 子文档 Modal 打开/关闭及父文档隔离通过 | pilots/clean-consumer/results.json |
| 升级与回退 | 三阶段业务状态正确，环境恢复 passed，exit 0 | rollback/results.json |

Node `v24.17.0`，pnpm `9.15.4`，独立消费者 TypeScript `5.9.3`。锁定的 pnpm-lock 未改。包体、CSS、导出及实际安装来源见 [package-baseline.json](package-baseline.json)、各试点 module-graph/results 和压缩锁文件。包依赖无 workspace symlink；clean/Todo 的渲染图未带入 AI/DND。

本轮全量单测是上述 1,764 + 248 项；两个新扫描器测试单独执行。没有重跑五浏览器全量 E2E、物理 iOS 或完整 release:check，不能据此宣称已完成发布门禁。

## 两个检查工具问题及处理

首次全声明检查把外置盘自动生成的 486 个 AppleDouble 伴随文件当成 TypeScript，导致语法错误。确认 tarball 中没有这些文件后，按文件头和同名源文件识别元数据；两版 Vue 的真实 486 份声明随后全部通过。失败原始记录保存在 `strict-initial/`。

首次回退尝试只把本地 tarball 依赖改成相同的 `1.1.0` 字符串，npm 保留了 `file:` 锁定来源。颜色校验识别出仍在使用候选，测试失败且成功恢复环境，见 `rollback-initial/`。最终脚本恢复公开基线的原始锁文件，并校验 `resolved` 与 `integrity`；候选安装同时核对本地 tarball 的 SHA-512。最终三阶段的来源不同且符合预期，未把同版本号误当成回退成功。

## 实际回退状态

1. 公开 1.1.0：创建并完成“迁移前保留任务”。
2. 本地组合候选：原任务及完成状态保留；新增并完成“候选期间新增任务”，把旧任务改为未完成。
3. 回退到公开 1.1.0：两个状态保留；通过 Modal 删除旧任务，新任务仍为已完成。
4. 演练结束：原始 candidate manifest/lock 逐字节恢复，再执行 `npm ci` 与构建。整个浏览器上下文始终使用同一 origin，无控制台错误。

这是新建验证应用的候选包切换演练，不代表用户真实项目已经迁移；回退到公开 1.1.0 仍会恢复其已知类型/对比度缺陷，不应把该旧版本称为已修复。

## 候选与复测

三包见 `artifacts/`；仍使用 core 1.1.0、AI/DND 1.0.0 版本号，仅供本地验证，不可覆盖公开版本。core SHA-256 为 `8ad31bfd42fa0bd525264b32b6018def9a65787a04a6a0c69c169b3ca2a5aea5`，其余见 [artifacts.json](artifacts.json)。

```sh
node pilots/run-baselines.mjs --core-tarball evidence/M0/card-integration-2026-11-05/artifacts/aheart-ui-1.1.0.tgz --out .pilot-runs/combined-recheck
corepack pnpm check:consumer-types --pack-dir evidence/M0/card-integration-2026-11-05/artifacts --out .pilot-runs/strict-recheck
```

`preview-ai-review-gate/` 保存此次候选的静态构建，可直接启动本地 HTTP 服务试用，无需保留庞大的临时安装。试用路径：勾选检查项、查看修订、发送本地消息、工作台排序、批准及重复批准限制；手机布局可切换执行抽屉。实际使用反馈与用户验收仍为 Pending。

## 主线与阶段状态

实时 `git ls-remote` 核对的 master 是 `c63edbf8c9098043d2d967d70d61d11db40e1a59`：

| PR | 精确 head | CI | 主线状态 |
| --- | --- | --- | --- |
| [#38 A1 规范修订](https://github.com/wzfdhr/aheart-ui/pull/38) | `1d85b2f39ffe89878216980b08fd0010b5886e6e` | run 41985175453 success | open，未合并；批准过的修订尚未生效 |
| [#39 Card 修复](https://github.com/wzfdhr/aheart-ui/pull/39) | `8b460a62cc89d388ead69968f3848791cec074fa` | run 41983599712 success | open，未合并；本轮仅本地整合验证 |

`pages.yml` 在 master CI 成功后自动构建并部署 GitHub Pages；合并这两个 PR 会进入该流程。没有执行主线合并、推送本地整合、npm 发布或 M0 代签。

M0-DEV-01 和 M0-QA-01 的技术基线已具备。后续是主线合并决策、真实自用反馈及适用契约/阶段书面 Go。A1 未合入前不提前删去原规范门槛；M1 subpath/CSS 实现仍未启动。
