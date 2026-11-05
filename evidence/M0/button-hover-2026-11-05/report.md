# M0 Button 悬停对比度修复与消费回归

2026-11-05（项目记录日期）。状态：**本地修复与候选包验证通过；未合并、未发布；M0/M1 仍 Blocked**。

基线分支 `codex/v2-m1`，HEAD `4915127aca0888a85015c5020a3f80ba3906931c`。本报告对应其上的未提交改动，具体输入哈希见 [source-manifest.json](source-manifest.json)。原主工作树已有改动保持原状。本轮不修改 Card 声明或引入 M1 subpath 实现。

## 问题与改动

默认颜色按钮在 hover 时把用于边框的浅蓝 `#4096ff` 同时用于文字。clean-consumer 的 Modal 触发按钮和 AI 工作台的排序文字按钮均低于正常文字的 4.5:1 门槛。

新增可覆盖的 CSS token `--aheart-color-primary-text-hover: #003eb3`，仅用于默认颜色、非 solid、可交互按钮的悬停文字。边框、点击行为、禁用态及显式语义颜色保留既有规则。主题文档包含浅色及暗色覆盖说明；ESM/CJS 的 CSS 均从源码重新构建。

消费 runner 新增 `--core-tarball`：在新的隔离副本更新锁文件，再执行 `npm ci`，校验安装版本、非 symlink、tarball SHA-256。对比度检查显式悬停 Modal 触发按钮和排序按钮，等待过渡结束；手机视口检查打开的 Drawer。严格类型仅允许既有 Card TS2344，额外错误会失败。

## 修复前后

| 试点 / Chromium 视口 | 公开 1.1.0 修复前 | 本地候选修复后 | 候选 axe 违规 |
| --- | --- | --- | --- |
| clean-consumer / 1440×1000 | 2.98:1 | 8.97:1 | 0 |
| clean-consumer / 390×844 | 2.98:1 | 8.97:1 | 0 |
| ai-review-gate / 1440×1000 | 2.49:1 | 7.50:1 | 0 |
| ai-review-gate / 390×844 | 2.55:1 | 7.67:1 | 0 |

逐目标颜色、背景及对比度见 [contrast-comparison.json](contrast-comparison.json)；完整 axe 数据、日志及截图分别保存在 `before/` 和 `candidate/`。原始结果未被覆盖。抽查 clean 桌面与 AI 手机截图，文字及布局正常；这不代替用户视觉验收。

## 验证

| 命令 / 检查 | 结果 | 证据 |
| --- | --- | --- |
| `corepack pnpm install --frozen-lockfile --store-dir /Volumes/新加卷/Codex/.pnpm-store` | exit 0，pnpm 9.15.4，锁文件未改 | dependency-install.log.gz |
| `corepack pnpm build:components` | exit 0；产物仅两份 CSS 有差异 | button-hover-build.log.gz |
| `corepack pnpm --filter aheart-ui typecheck` | exit 0 | button-hover-typecheck.log.gz |
| Button Vitest | 26/26，exit 0 | button-unit.log.gz |
| 生产文档 + `e2e/button-hover-contrast.spec.ts` | 桌面/手机共 4/4，exit 0；原 120 秒配置 | button-hover-e2e-final.log.gz |
| 公开包消费基线，clean + AI | exit 1；四视口对比度失败 | before/results.json |
| 本地 core tarball，三个试点 | 六视口 hydration、关键业务交互、axe 通过；clean iframe Modal 通过 | candidate/results.json |
| 候选兼容类型 / 严格类型 | 兼容类型全过；严格类型仍为 Card TS2344，三个工程 exit 2 | candidate/*/strict-types.log.gz |
| 候选依赖与模块图 | 无 workspace symlink；clean/Todo 无 AI/DND 渲染模块 | candidate/*/results.json |

候选 runner 总退出码 **2**（`baseline-collected-with-known-issue`），不是全绿。PR #39 的 Card 修复未叠入本候选，因此不能宣称严格消费者已修好。2026-11-05 本轮实时查询 #39：开放、未合并，HEAD `8b460a62cc89d388ead69968f3848791cec074fa` 的 CI run `41983599712` success；这是远端 CI 状态，不是本轮重新执行该 PR 的全部测试。

候选为 [aheart-ui-1.1.0-local-hover-fix.tgz](artifacts/aheart-ui-1.1.0-local-hover-fix.tgz)，仍使用 1.1.0 版本号，仅作本地对照，不可覆盖公开版本。SHA-256：`8e3d251a29c457b98adf4a53707cb3dfae0eb064980f3d4e61485bc775e0f25d`。包内 1,047 个文件，没有 macOS `._*` 元数据文件。

重跑候选：

```sh
node pilots/run-baselines.mjs --core-tarball evidence/M0/button-hover-2026-11-05/artifacts/aheart-ui-1.1.0-local-hover-fix.tgz --out .pilot-runs/button-hover-recheck
AHEART_E2E_PORT=5197 corepack pnpm exec playwright test e2e/button-hover-contrast.spec.ts --project=desktop --project=mobile --workers=1 --reporter=line
```

## 环境修复

首次文档生产构建超过 120 秒。查明 VitePress 的 `git log` 子进程被共享对象目录里的 12 个 `._pack-*.idx` AppleDouble 文件引发的大量 stderr 阻塞。核对文件魔数及真实索引存在后，仅将元数据文件移入 `.git/metadata-sidecars-2026-11-05/pack`，未删除真实 pack/index。Git log/status/worktree list 均恢复 exit 0、无 stderr；原配置的文档构建和四项测试共 16.5 秒通过。见 [git-sidecar-repair.json](git-sidecar-repair.json)。新增 `._*` 忽略规则，防止外置盘元数据进入源码差异。

## 清单与后续边界

- M0-QA-01：三个新消费试点的可重复基线已建立，失败原因、交互、截图、模块图和候选对照有证据；完成此任务不等于试点用户验收。
- 对比度 P1：本地源码及打包消费验证已关闭；审查、合并及公开版本交付仍待完成。
- Card P1：继续由 #39 承担；本轮无合并或发布。
- #38 规范修订尚未合并；预算/兼容契约、真实使用反馈及 M0 书面 Go 尚未完成，M1 实现继续等待。
- 未执行物理设备、Firefox/WebKit、全仓测试或全量发布门禁；本报告只记录上述范围。

回退为恢复本次主题/button CSS 改动并重新构建，消费者恢复原 package.json/package-lock 后 `npm ci`。没有公开包或生产部署需要回滚。
