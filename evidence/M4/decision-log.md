# M4 发布决策准备 · 2026-11-11

技术结论为 **暂缓 v2，先准备 v1.x 兼容预览**。当前代码保留核心包根默认插件，以及 AI 根入口的 Workbench 和 DND 安装依赖。这两项属于 RFC §18.2 的 v2 兼容边界。按 [A1](../../docs/superpowers/specs/2026-11-05-aheart-ui-v2-solo-scope-amendment.md) 推进 v1.x 增量版本，实际 Beta 放行仍需两个试点从 npm 安装预发布版本并完成关键任务。

## 主线与公开版本

- M3 由用户委托验收并合并。[PR #44](https://github.com/Labradorca/aheart-ui/pull/44) 合入 `25d0d4babfee5782377c787ac187d9728a3635a4`，合并前 24 项检查通过。[M3 验证记录](../M3/implementation-2026-11-11/summary.md) 保留自审和验证证据。
- `25d0d4b` 的[主线 CI](https://github.com/Labradorca/aheart-ui/actions/runs/42984728965) 通过 11 项，最后的浏览器任务因 [PR #45](https://github.com/Labradorca/aheart-ui/pull/45) 合入主线而取消。M4 本地分支已快进到 `db46efd0d2896bd1b3863a4f6719a551046dec2e`。两个提交的包目录、workspace manifest、锁文件和打包契约一致。M3 的线上验收以[新主线 CI](https://github.com/Labradorca/aheart-ui/actions/runs/42988846735) 和随后 Pages 的实际部署为准。
- 基于 `db46efd` 的本地生产文档通过 9 项 AI 接入与导航浏览器用例，7 项按既有项目条件跳过。[本地迁移指南](http://127.0.0.1:5195/guide/m3-migration.html) 的四个示例均可打开，Chat 实际发送并收到模拟回复。
- npm 查询到 `latest` 为 `aheart-ui@1.1.0`、`@aheart-ui/ai@1.0.0`、`@aheart-ui/dnd@1.0.0`，三个包均无 `preview` 或 `beta` 标签。npm 身份检查返回 `E401`，发布前需恢复有效的 npm 会话。

## 兼容预览演练

| 包 | 当前主线 tarball | 拟用 Preview 版本 | 演练 tarball SHA-256 |
| --- | --- | --- | --- |
| `aheart-ui` | `1.2.0` | `1.3.0-preview.1` | `0e7264366021920b5835cf0313ede7cfb267247c4a77c988130a6c36c8901cc5` |
| `@aheart-ui/dnd` | `1.1.0` | `1.1.0-preview.1` | `8a0f466fd8b53efe16ced61e3fb27a3bfdcfe9d15d732823316ba2be51c9ace9` |
| `@aheart-ui/ai` | `1.1.0` | `1.1.0-preview.1` | `b3e3959bf165b52a0927eef7017fcf99e19c837fc09ceba0529fcfec360e1067` |

用 `pnpm release:pack` 从合并提交打包，再在本地暂存副本调整版本并用 `npm pack` 生成预览包。AI 固定依赖 DND `1.1.0-preview.1`，核心 peer 使用 `^1.1.0 || 1.3.0-preview.1`。三个产物均通过发布契约，解包后仅 `package.json` 与主线 tarball 有内容差异。演练包在 `.pilot-runs/m4-preview-tarballs/`。获准发布后，应提交正式版本及依赖范围，从同一受审提交构建并复验发布包，再使用 `preview` 标签。

[主线消费产物](https://github.com/Labradorca/aheart-ui/actions/runs/42984728965/artifacts/13839565980) 与本地主线 tarball 的文件内容和权限逐项一致。三包 `npm publish --dry-run --tag preview` 均生成对应版本和完整性摘要。候选工作台的生产依赖 `npm audit --omit=dev` 返回 0 条公告。已安装生产依赖的许可证标识为 MIT、Apache-2.0、ISC、BSD-3-Clause 或 BSD-2-Clause。

### 试点与回退

- `clean-consumer` 和 `ai-review-gate` 从三个本地 Preview tarball 安装。Chromium、Firefox 和 WebKit 均通过宽窄视口验证，包含严格类型、SSR、水合、关键任务及 axe 检查。验证入口为 [clean-consumer](http://127.0.0.1:4181/ssr.html) 和 [AI 工作台](http://127.0.0.1:4182/ssr.html)。
- 新增确切 registry 版本参数。两个试点恢复公开稳定版本时，校验了锁文件的 URL、完整性字段和安装版本。核心交互仍可使用，但复现了 `1.1.0` 的 Card TS2344 和默认按钮悬停对比度问题。完整结果保留失败状态。
- `muxu-todo` 同源演练通过。公开 `1.1.0` 升级至本地 Preview 后新增并完成任务，再恢复公开锁文件，任务和完成状态得到保留。回退后完成删除操作，演练结束时恢复了试点原 manifest 和 lockfile。该试点提供状态恢复证据，A1 的两项 Beta 试点仍为 `clean-consumer` 与 `ai-review-gate`。

原始结果在 `.pilot-runs/m4-preview-pilots/`、`.pilot-runs/m4-preview-firefox/`、`.pilot-runs/m4-preview-webkit/`、`.pilot-runs/m4-public-rollback/` 和 `.pilot-runs/m4-state-rollback/`。公共安装试点命令见 [试点说明](../../pilots/README.md#公开-preview-试点)。

## 从候选源码打包

工作区已写入上述三包版本、AI 的核心 peer 范围和 DND 精确依赖。锁文件通过冻结安装。三包通过发布契约，逐文件核对确认与演练 tarball 的文件内容和 manifest 字段一致。

| 包 | 候选源码 tarball SHA-256 |
| --- | --- |
| `aheart-ui@1.3.0-preview.1` | `9c0cbaac1fcfc25fa489b08a4314a125ab40584fe1a77a2c860726f7f20c4e69` |
| `@aheart-ui/dnd@1.1.0-preview.1` | `5edac9041d06437b50df9a609568399130aea702cb72cd437189b9c4fc294fcf` |
| `@aheart-ui/ai@1.1.0-preview.1` | `c85cfbdb8754bf84b9f2186c8ba10cf968e49869b5e566d29f480e52950f4e98` |

候选通过三包类型检查、Vue 3.5.38 与 3.5.44 严格声明消费、核心包按需与旧入口、M3 按需和 Resolver 消费、AI 工作台旧入口以及文档构建。三包均完成带 `preview` 标签的 npm dry-run。

## 发布决策待办

本轮已确定 v1.x Preview 版本。发布前恢复 npm 登录，并核对三个版本在 registry 的可用状态。正式发布时核心和 DND 先于 AI，三个包使用 `preview` 标签。发布后由两项试点从公开 registry 安装精确版本并复跑任务，登记负责人自用反馈。RC 还需完成自用满 7 天、缺陷处理、回滚及连续两次主线全绿；Stable 以 RC 结果、迁移指南和[变更日志](../../CHANGELOG.md)为依据。
