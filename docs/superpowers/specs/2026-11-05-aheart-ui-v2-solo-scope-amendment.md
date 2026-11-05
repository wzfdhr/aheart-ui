# Aheart UI v2 规范修订 A1：单人项目范围与版本对齐

> 状态：已批准（Approved），2026-11-05 由 wzfdhr（单人项目唯一负责人）批准。本修订的条款优先于下列四份已批准规范中的对应条款；四份原文不修改，未提及的条款继续有效。
>
> 修订对象：[产品与技术总体方案](./2026-09-08-aheart-ui-product-and-technical-master-plan.md)、[技术 RFC](./2026-09-08-aheart-ui-v2-architecture-optimization-design.md)、[阶段验收标准](./2026-09-08-aheart-ui-v2-phase-acceptance-criteria.md)、[整体任务流程清单](./2026-09-08-aheart-ui-v2-task-flow-checklist.md)。
>
> 日期：2026-11-05。

## 修订原因

1. **版本事实已变化。** `aheart-ui@1.1.0` 已于 2026-11-05 发布（[发布报告](../evidence/v1.1.0-release-2026-09-29/registry-publish-report.md)），但它不含组件 subpath 或拆分 CSS。规范中“M1 = v1.1”的版本对应已经无法实现。
2. **试点前提不成立。** `ai-review-gate` 与 `muxu-todo` 在当前环境无法定位。原规则要求三项试点贯穿 M0–M8，M0 因此无法通过。
3. **流程按多人团队设计。** 规范要求多角色审查签字、Beta 观察和多试点持续使用，这些条件在单人、无外部用户的项目中无法满足，只会造成长期 Blocked，而不能提高质量。

技术方向（style-free 运行时入口、逻辑 subpath CSS、根入口与 `/full` 分离、Primitive 经 Combobox 试点后再迁移浮层）不变。

## A1-1 版本轨道（替换总体方案 §13.1 及各文档中的“M1 v1.1”）

```text
v1.1.x  已发布的稳定基线；仅补丁修复（含 Card 声明 TS2344）
v1.2.x  M1：Button/Modal/Select subpath 与 theme/组件/full CSS（additive）
v1.3+   M2 合并阶段（Combobox、浮层迁移）中可独立发布的 additive 能力
v2.0.0  仅在 M8 Go 后发布
```

各文档中出现的“M1 v1.1”一律读作“M1 v1.2”。v1.x 兼容原则（总体方案 §13.2）不变。

## A1-2 试点与用户验收（替换验收标准 §4 的试点定义，及任务清单“默认试点项目”）

- 固定试点改为两项：
  1. `clean-consumer`：仓库外从零创建的 Vite 消费端（若声称 Nuxt/SSR，再加 Nuxt fixture），从 tarball 或公开 registry 安装。
  2. 一个由 wzfdhr 实际使用的项目，名称和路径在 M0 决策日志中登记。登记前，此项标记 `Needs decision`。
- 原文中“三个试点”“至少 3 个试点”“试点 ≥2/≥3”的要求，一律改为“上述两项试点均完成”。
- 若以后找到 `ai-review-gate` 或 `muxu-todo`，或出现外部用户，可作为可选试点加入，但不作为门禁。

## A1-3 门禁与签字（修订验收标准 §3、任务清单“使用规则”）

- 所有“产品/技术/质量/设计负责人分别批准”的要求，改为 wzfdhr 的一次书面决策，写入对应阶段的决策日志，并注明日期和依据。
- G6 审查合并：改为 PR 自审清单，主线必需 CI 全部 SUCCESS 后才可合并（沿用当前做法）。
- 八门禁和八个状态字段继续保留，但每阶段只需填写一张验收表（验收标准 §6）。不适用项写 `N/A` 和一句理由即可。
- 证据等级 E0–E5 与缺陷级别 P0–P2 不变。

## A1-4 阶段结构（替换总体方案 §12.2 路线图、任务清单依赖图）

| 新阶段 | 原阶段 | 范围 | 启动方式 |
| --- | --- | --- | --- |
| M0 契约冻结 | M0 | 四份规范和本修订已批准；clean-consumer 与自用项目的基线；包图与 v1.2 契约 | 立即 |
| M1 真实按需（v1.2） | M1 | Button/Modal/Select subpath、theme/组件/full CSS、module graph fixture、release contract；**Resolver Preview 移出** | M0 Pass 后 |
| M2 Primitive 与浮层 | M3 + M4 | Combobox 试点通过后，按 Popover/Tooltip/Dropdown → Modal/Drawer → Select 族 → Picker 族逐族迁移 | M1 Pass 后 |
| M3 AI/DND 与文档 | M6 + M7 | AI/DND subpath 与 CSS、文档 IA、迁移指南、Resolver（覆盖已有 subpath） | M1 Pass 后，可与 M2 并行 |
| M4 v2 决策 | M8 | 见 A1-6 | M2、M3 Pass 后 |
| 按需触发 | M2 Icons、M5 Motion | 只有出现品牌图标或动效的具体需求时才立项，立项时按原验收标准执行 | 需求触发 |

- 在 Icons 立项前，继续使用 Lucide 兼容层；原 RFC 中依赖 `@aheart-ui/icons` 的默认图标切换随之延后。
- 原 M3 拆分的 3A/3B/3C 切片保留，作为新 M2 内部的提交顺序。

## A1-5 M0 退出条件（修订验收标准 M0）

- **进入条件：** 删除“三项试点可定位或已建立”。
- **Must：** “三个试点的当前基线”改为 A1-2 两项试点的基线：安装耗时、首屏渲染、包体、失败点、关键任务、可回滚版本。
- **不阻塞 M0：** v1 L4 的物理 iOS Safari 验收、QG5 连续 10 次运行、Card TS2344 补丁，均作为 v1.1.x 独立待办，与 v2 M0 无关。
- **Go：** 四份规范和本修订已批准并合入 `master`，两项试点基线已归档，P0 = 0。

## A1-6 v2 发布决策（替换验收标准 M8 的 Beta/RC/Stable 量化条件）

- **Beta Go：** P0 = 0、Beta 范围 P1 = 0；两项试点都从 registry 安装 prerelease 并完成关键任务。
- **RC Go：** 自用项目在 Beta 上使用至少 7 天且无 P0；全部 P1 已关闭；回滚演练成功；主线连续两次 CI 全绿。
- **Stable Go：** RC 无新增 P0/P1，迁移指南与变更日志齐全。
- **删除：** 14 天 Beta 观察期、“≥3 试点持续使用”、30/60/90 天复盘机制。若将来有外部用户，可重新启用复盘。

## 批准

- [x] wzfdhr 于 2026-11-05 批准本修订；批准经 [PR #38](https://github.com/wzfdhr/aheart-ui/pull/38) 合入 `master` 后生效，并记入 M0 决策日志。
- [ ] A1-2 自用项目试点：名称与路径待登记（登记前该试点为 `Needs decision`）。
