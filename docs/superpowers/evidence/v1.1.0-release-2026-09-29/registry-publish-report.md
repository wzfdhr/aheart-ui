# Aheart UI v1.1.0 npm 发布与 registry 验证

日期：2026-11-05（UTC）

发布源：tag `v1.1.0`，提交 `90a0b25e43065c80261fdb2069dad472c92e1e38`。机器可读记录见 [`registry-publish.json`](registry-publish.json)。

## 重新打包与核对

- 在 `v1.1.0` 的干净 git 工作树中执行 `corepack pnpm install --frozen-lockfile` 与 `corepack pnpm check:build-determinism`，退出码 0，`es/lib` 无漂移。
- `pnpm pack` 得到的三个 tarball 的 SHA-256 与字节数和 [发布候选报告](release-candidate-report.md) 完全一致，发布的即为候选验收过的内容。
- 发布的是上述 tarball 文件本身（`npm publish <tgz> --access public`），未在发布时重新构建。

## npm 发布

| 包 | 发布时间（UTC） | registry shasum | 与本地 tarball 一致 | `latest` |
| --- | --- | --- | --- | --- |
| `aheart-ui@1.1.0` | 2026-11-05T02:28:52Z | `f59a5e379259f9e575d61ede006ddad70c213da0` | 是 | `1.1.0` |
| `@aheart-ui/dnd@1.0.0` | 2026-11-05T02:38:10Z | `14a1d4f3899ecb34f7c0c58a47ffad14e01ccf38` | 是 | `1.0.0` |
| `@aheart-ui/ai@1.0.0` | 2026-11-05T02:55:10Z | `84daf908c62f77e341afe8a54fcb62b923d71172` | 是 | `1.0.0` |

顺序为核心包、DnD、AI；每个包在 registry 上可见并核对 shasum 后才发布下一个。npm 要求二次验证，发布者在自己的浏览器中逐包确认；`@aheart-ui` 组织由发布者在发布 scoped 包前创建。

## 公开 registry 消费验证

在仓库外的空项目中从 `https://registry.npmjs.org/` 安装三个包（Vue 3.5.44，无 workspace 符号链接），脚本与输出见 [`registry-smoke/`](registry-smoke/)：

- ESM：三个默认插件可 `app.use()`，`Button`、`SortableList`、`useSortable`、`AIChatPanel`、`AIBubble`、`AIAgentWorkbench` 等导出存在，版本号正确。
- SSR：`renderToString` 渲染 `AIBubble` 输出正确内容。
- 样式：三个包的 `style.css` 均可解析加载。
- CommonJS：三个包均可 `require`。
- 类型：`skipLibCheck: true` 下 `tsc` 通过。

## GitHub Release

[Aheart UI v1.1.0](https://github.com/wzfdhr/aheart-ui/releases/tag/v1.1.0) 于 2026-11-05T02:58:30Z 发布，绑定已有 tag `v1.1.0`（`90a0b25`），标为 Latest。

## 偏差与已知问题

- `v1.1.0` tag 在 2026-09-29 已推送到远端，早于 npm 发布；与发布指南“registry 检查通过后再推送 tag”的顺序不一致。tag 未移动，tag、tarball 与 Release 均对应同一提交。
- 消费项目设置 `skipLibCheck: false` 时，`aheart-ui/es/card/index.d.ts` 在 Vue 3.5.44 类型下报 `TS2344`（`GlobalComponents` 约束）。默认 `skipLibCheck: true` 的 Vite/Nuxt 项目不受影响；已在 Release 中列为已知问题，待补丁版本修复并补充严格类型的消费测试。

## 仍待完成（L4）

- 物理 iOS Safari 手指验收。
- 同一主线提交连续 10 次有效 QG5 运行。
