# M0 真实业务试点：ai-review-gate

日期：2026-11-05。状态：**Needs decision（源码位置）/ Not run（当前基线）**。

## 用户决定

本 chat 中用户对“真实业务试点选哪个项目”的明确回复为 `ai-review-gate`。名称选择已确认，不能再报告为“未选择试点”。仍缺当前可访问源码路径或远端仓库地址。该选择不代表用户已经验收试点，也不代表 M0 Go。

负责人：wzfdhr 提供源码位置并验收实际任务；Codex 采集可复测基线。本记录不修改 PR #38 的生效条件；其修订仍需合入 master 后生效。

## 定位结果与边界

本轮只读查询：

- `/Users/start/Desktop/ai-review-gate`、`/Users/start/Projects/ai-review-gate`、`/Volumes/新加卷/Codex/桌面归档/ai-review-gate` 均不存在。
- 在 `/Users/start/Desktop/桌面归档`、`/Volumes/新加卷/Codex`、`/Users/start/Documents/Codex` 内，以最大 7 层、排除依赖/缓存/构建目录的目录名遍历，未匹配 `ai-review`、`review-gate`、`review_gate`、`人工验收`。
- `rg --files` 对桌面归档、Projects、Documents 和外置 Codex 目录按项目名称检索，未找到匹配文件。
- `mdfind 'kMDItemFSName == "ai-review-gate"c'` 无结果。
- Codex 已登记项目中没有 ai-review-gate；GitHub 连接器仓库搜索 `user:wzfdhr ai-review-gate` 返回空列表。

以上是指定范围的未命中，不证明项目被删除或不存在于其他位置。已向用户请求现路径或仓库地址；不猜测远端，不重建替代项目。

## 历史线索（仅用于接手定位）

旧记录指向 Electron Forge + Vue 3 工程，UI 在 `apps/desktop/renderer/src/App.vue`，采用 `vendor/packages/aheart-ui-1.0.0.tgz` 与来源锁定文件。旧命令为 `corepack pnpm start` 和 `corepack pnpm verify`，Node 22.22.0、pnpm hoisted。历史关键任务是勾选验收项后批准 Revision。

上述内容来自旧会话记录，未在当前源码核实。旧测试、截图、打包和 UI 行为均不计入本次试点通过证据。

## 源码到位后的检查顺序

1. 确认真实路径、AGENTS.md、分支/SHA、dirty 状态、包管理器/Node、锁文件、Aheart 版本与 vendor tarball 哈希；保留原工程的改动。
2. 在独立副本建立“现有依赖”基线，先读取实际 package scripts，再执行安装、类型、测试、构建/打包；每项记录命令、耗时、退出码和原始日志。
3. 启动真实 Electron 窗口，记录启动到正确首屏的耗时、应用/浏览器版本、视口、截图及控制台错误。截图不能代替交互。
4. 以当前源码定义的真实任务验证：至少一条输入/焦点操作、一条 Modal/表单或菜单操作；如仍有 Revision 批准流程，验证前置条件、批准动作及状态变化。演示数据与真实 Git 集成分别记录。
5. 在独立消费副本将 Aheart 来源切换为精确 tarball/registry 版本；锁定文件和包 SHA 归档，确认无 workspace link。只改依赖与必要迁移配置，业务变更单独报告。
6. 比较两条基线的类型、包体、CSS、SSR/iframe（若消费路径适用）与交互；不适用项需说明理由，未运行项写 Not run。
7. 回滚到原 vendor tarball + 原 lockfile 并复跑关键任务，记录回滚结果；实际使用者提供反馈/接受结论后才能关闭用户验收。

## 当前证据状态

| 项目 | 状态 |
| --- | --- |
| 真实项目名称选择 | Confirmed：用户选择 ai-review-gate |
| 当前路径 / Git SHA / dirty | 未取得 |
| 当前 tarball / lockfile / 安装耗时 | Not run |
| 首屏 / 关键交互 / 视觉 / 无障碍 | Not run |
| 升级 / 包体 / 类型 / CSS | Not run |
| 回滚演练 | Not run |
| 用户验收 | 未请求验收，待实际运行证据 |

解除条件：用户提供可访问的当前源码路径或仓库地址 → Codex 完成上述基线 → 用户对实际任务给出结论。此项未通过前 M0/M1 仍保持 Blocked。
