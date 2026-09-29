# Aheart UI v1.1.0 发布候选报告

日期：2026-09-29

候选提交：`8c7fe030214a1de0cf36e7aa7586a4888f0d370e`

基线主线：`d5fcb8214994d3f2fe44a85d324e355fd2f6dc3c`
本次候选改动：仅将 `CHANGELOG.md` 中 v1.1.0 标题从 Unreleased 改成日期版本并列出三包发布范围；没有运行时源码、测试、依赖锁文件或生成产物改动。

## 候选包

| 包 | 文件数 | Tarball 字节 | SHA-256 |
| --- | ---: | ---: | --- |
| `aheart-ui@1.1.0` | 1047 | 537473 | `2e263cad466fff8b23883af898d1656ad0f5c588308055889ae89ab13a8899b7` |
| `@aheart-ui/dnd@1.0.0` | 79 | 26814 | `f2ffba7d81fbf34ca6f41ff59faa12187a31c2361d6d74b61239ebc3c096ae0f` |
| `@aheart-ui/ai@1.0.0` | 115 | 74401 | `f09be0bb5b31d089c7b5d34492cb3361e46c9ab978e31f74f3383044287f102b` |

Tarball 暂存在本机 `/tmp/aheart-ui-v1.1.0-release-8c7fe03/pack/`，不提交到源码仓库。发布前在最终合并 SHA 上重新打包，并比对包内容/SHA；若与此候选不同，停止发布并复核原因。

## 候选 SHA 本地门禁

- `corepack pnpm install --frozen-lockfile`：退出码 0。
- `corepack pnpm test:coverage:r1`：14 文件全部达到 80%；聚合 3312/3829 = 86.50%，最低文件 80.33%。
- `CI=true corepack pnpm release:check`：退出码 0；组件/DnD/AI 测试 1485/79/200，脚本测试 247/247，类型、确定性构建、中文文档和 release pack 通过；E2E 955 项中 828 通过、127 按配置跳过、0 失败。
- 隔离 root-entry、Form.List、D8 三包消费者全通过，无 workspace symlink；类型、ESM/CJS、CSS、SSR/hydration 与交互测试通过。

原始日志使用 gzip 保存并附 SHA-256；覆盖率 JSON、consumer JSON、pack 文件列表和 tarball SHA 在本目录与子目录内：

- [`release-candidate.json`](release-candidate.json)
- [`r1-coverage.json`](r1-coverage.json)
- [`消费者结果`](consumers/)
- [`pack 文件清单`](pack/)
- [`release-check 日志`](logs/release-check-ci.log.gz)
- [`coverage 日志`](logs/r1-coverage.log.gz)

## Registry 与认证预检

检查 registry 为 `https://registry.npmjs.org/`。公开 registry 当前只将 `aheart-ui@1.0.0` 标为 `latest`；`aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0` 均未发布。远端 `v1.1.0` tag 与 GitHub Release 均不存在。

本机 `npm whoami` 返回 `ENEEDAUTH`，所以没有运行任何 registry 写操作。直接发布 scoped 包需要 `--access public`，并需可发布的 npm 账号与 2FA 或具备相应授权的 granular access token；参见 [npm scoped package publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)。本机 npm 11.13.0 没有 `npm stage` 命令，不能据此做 staged registry publish。

## 发布顺序与中止规则

最终主线 SHA 确认后，按核心包、DnD、AI 顺序发布；每包发布后立即用 `npm view` 检查版本，再做干净临时目录 ESM/CJS/类型/CSS 安装验证。任一包发布失败或验证失败就停止后续包，不移动 tag；按仓库发布指南的弃用/修复版策略处理。全部 registry 检查通过后，再将同一 SHA 的本地 `v1.1.0` tag 推送并创建 GitHub Release。

目前准备和审查材料已完成，`npm publish`、tag push、GitHub Release 尚未执行。账号认证或二次验证由发布负责人在本机浏览器/终端完成；不要把密码、OTP 或 token 粘贴到任务消息中。
