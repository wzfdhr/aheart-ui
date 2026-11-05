# M0 契约评审准备

状态：Needs decision；2026-11-05。来源是四份已批准规范，不代表 M0 验收通过。待合入 A1 的条款单独标记，保留明确的适用边界。

## 用户、JTBD 与非目标

- 第一用户：Vue 3 AI 产品开发者。任务是在保留默认视觉与复杂交互能力的同时，集成 Chat/Agent/Workbench。
- 第二用户：Vue 业务后台开发者，交付表单、数据展示、浮层与导航。
- M1 首批验证：Button、Modal、Select 的真实 JS、类型和 CSS 按需；Combobox、全组件重写不在 M1。
- 非目标：React/Angular 原生实现、纯 headless 库、UI 包代管模型请求/鉴权/业务状态、全面视觉重做。
- 目标来自主方案：10 分钟安装到正确样式首屏、无业务逻辑重写的迁移、P0/P1 为零。Node-only 安装 15 秒尚不证明首屏目标，必须补浏览器计时与真实任务。

## 依赖方向

| 入口 / 包 | 允许方向 | 禁止 / 需要证明 |
| --- | --- | --- |
| aheart-ui 基础包 | Vue peer；当前 Floating UI/Lucide/虚拟列表/Dayjs 按组件实际使用 | 不依赖 AI、DND、Motion；Button 模块图不得含 Table/全量插件 |
| aheart-ui/full | 基础包全组件 Plugin | 求值时不执行 app.use；样式由应用显式引入 |
| Resolver | 静态清单 | 不加载组件运行时；CSS 模式只注入精确组件样式，不代注入 theme |
| @aheart-ui/ai | 基础包；Workbench 专用 DND subpath | 普通 Chat/Sender/Bubble 不解析 Workbench/DND；当前是否达到是后续验证事项 |
| @aheart-ui/dnd | Vue 与拖拽引擎 | 不反向依赖 AI |
| @aheart-ui/motion | Vue/浏览器动画能力，消费基础状态协议 | 基础包脱离 Motion 可运行；目前只是规划 |
| @aheart-ui/icons | 独立图标资源与 Vue | 无私有 PAT 默认依赖；未验收前保留 Lucide fallback |

## 兼容与版本决策

| 轨道 | 公共契约 | 回退 |
| --- | --- | --- |
| 已发布 v1.1.0 | 根 named/default Plugin、style.css、es/lib 深层兼容入口 | 固定精确版本与 lockfile；注意已知严格类型问题 |
| v1.1.x patch | 修复 Card TS2344；不装入按需新范围 | 先通过 #39 严格消费者，再独立决定补丁发布 |
| M1 additive preview | Button/Modal/Select subpath + full/theme/组件 CSS | 保留根 default Plugin 与 style.css；新入口不得破坏旧 consumer |
| M1 v1.2.x（A1 待生效） | 已发布 1.1.0 无法补写同版本；A1 将 M1 对齐至 1.2 | 禁止覆盖 1.1.0；版本决策生效前不 bump |
| v2 beta / RC | 允许经迁移审查的 breaking change；根默认 Plugin 分离是 v2 契约 | 迁移清单与固定 v1 lockfile；须先完成适用 Beta/RC 门禁 |
| v2 stable | 仅在最终 Decision Gate Go 后 | 未进入，不预先称 Stable |

## M1 待冻结入口与样式

- 根 named import 保留名称、类型和现有 v1 根默认 Plugin 行为。RFC 的“根不再导出默认 Plugin”属于 v2 breaking change，不能静默移入 additive v1。
- `aheart-ui/button`、`/modal`、`/select` 对应精确组件 ESM/CJS/types；以 tarball 的 public exports 验证，不用 monorepo 源码 alias。
- `aheart-ui/full` 显式提供全组件 Plugin；应用调用 `app.use`，模块求值不自动安装。
- 应用入口引入一次 `theme.css`；按需组件各引入 `<component>/style.css`（含必要共享/子组件样式）；全量路径引入 `full.css`。兼容 `style.css` 的全量行为。
- 组件运行时入口无 CSS 副作用；CSS exports 需要真实 `.css` 产物。当前空的 `.css.js` 不是独立 CSS。
- `sideEffects: ["**/*.css"]`；不能仅以配置证明 tree-shaking。ESM、CJS、声明和 CSS 映射必须同 tarball 实际路径一致。
- 现行 M1 包含 Resolver Preview；A1 拟将其移出，在 A1 合入前不自行删减。

## 包体、支持与失败阈值

M0 记录测量基线，M1 冻结数值预算。不在本报告填写未测量的 KB 或虚构下降比例。

- 每组件报告 emitted JS、gzip JS、组件 CSS、theme CSS，以及 full 的同口径数值；Button 不含 Table/AI/DND，Modal 不含 AI/DND，Select 不含全量插件。module graph 必须直接检查模块名。
- 同一 Node、Vue、构建器和压缩设置比较按需与 full；按需产物必须有可解释下降，未下降或越界即阻塞。
- Vue peer 当前 `>=3.4.0 <4` 是声明范围，不等于已完成全部小版本矩阵；本轮 consumer 固定 3.5.44。CI Node 20 与本机 Node 24 分开记录。
- Vite、Nuxt SSR、CommonJS、iframe/custom teleport、五浏览器、键盘/axe 与 reduced-motion 按阶段验证；未测试的平台/构建器不能列为已支持。
- 失败阈值：P0=0、M1 P1=0；公共安装失败、SSR/hydration、焦点陷阱、许可证或无法回滚的变更立即 Blocked。

## 尚待决策与签字

试点名称已确定为 ai-review-gate，已按用户指示在 pilots/ai-review-gate 新建，见三试点报告；A1 生效后的阶段范围、各组件数值预算与完整支持矩阵尚未冻结。M0 不得 Accepted。Owner：wzfdhr；证据采集：Codex。用户反馈由实际使用者提供，不以执行代理代签。
