# M1 最终候选与原生 Tab 回归验证

2026-11-09。运行时与验证器提交 `c76b33529162152fea4d029482d0b8bcf67871a2`，基线 `90285d6`。此报告取代[初始本地候选](../implementation-2026-11-09/report.md)的当前结论；初始日志和 tarball 原样保留。

**M0 已获负责人书面 Go；M1 仍为 In progress / 待验收。** [PR #41](https://github.com/wzfdhr/aheart-ui/pull/41) 尚未合并，线上文档和 npm 未更新。之前对 #38/#39/#40 的授权不扩展为本 PR 的合并授权。

## 最终行为

Button、Modal、Select 提供 ESM/CJS/types 子入口和显式样式入口；`/full` 保留整套插件。根入口、旧 es/lib 和 `style.css` 兼容。完整 CSS 与 master 基线逐字节相同。实现范围、冻结预算见 [contract.md](../contract.md)；Resolver 按 A1 留在后续 M3。

Modal 保留弹窗内部的浏览器原生 Tab 导航：已知首尾边界同步环绕，其余步骤先允许浏览器导航，只有原生导航实际逃离弹窗才通过所属窗口的零延时任务恢复。关闭、卸载或上层弹窗变化后不恢复过期焦点。恢复路径考虑 radio 分组、编辑区、正 tabindex、隐藏/禁用/inert、关闭的 details 和拒绝聚焦的节点；不主动推进日期和媒体控件的内部步骤。

初始“每次 Tab 显式推进”在原生 radio、contenteditable 和日期控件中产生回归，现已移除；原始对照保存在 diagnostics/。最终验证器在独立原生页面测量同样控件的真实导航，再与打包后的 Modal 比较：原生留在控件集合内时要求目的节点一致；原生逃离集合时要求焦点留在弹窗。每个用例重建控件，避免复合控件内部状态污染下个用例。该对照不预设操作系统的键盘偏好。

相关语义参考 [MDN contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) 与 [WAI-ARIA Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)。本报告的通过结论来自实际浏览器和包消费测试。

## 包体预算

同一真实 npm consumer，Vue 3.5.44、Vite 5.0.12、Node 24.17.0。JS gzip 包含 Vue；组件 CSS 为原始样式源，不含 theme。完整明细见 [consumer/results.json](consumer/results.json)。

| 组件 | 子入口 JS gzip bytes | 根 named JS gzip bytes | 组件 CSS bytes | CSS / full |
| --- | ---: | ---: | ---: | ---: |
| Button | 32,939 | 32,939 | 7,945 | 3.98% |
| Modal | 41,766 | 41,741 | 16,305 | 8.17% |
| Select | 56,974 | 57,067 | 10,472 | 5.25% |

显式 `/full` 为 190,644 JS gzip bytes；full CSS 199,595 bytes，theme 1,767 bytes。三组件通过冻结的 JS/CSS 预算，未调高阈值。仅 JS 的 Button 构建输出零 CSS，显式导入样式均保留；三个子入口的 parsed 模块图没有无关基础组件、AI 或 DND。已有第三方依赖的解析成本保留在图中。

## 验证与溯源

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 三包 build/typecheck/pack | 通过 | build/typecheck/pack.log.gz；artifacts/ |
| Modal 回归 | 69 项通过 | modal-tests.log.gz |
| 全量组件及脚本 | 1,494 + 79 + 200 组件；251 脚本，全部通过 | full-tests.log.gz |
| APFS fresh clone 构建确定性 | frozen lock 真安装，两次构建及前后检查 exit 0 | determinism/results.json、run.log.gz |
| ESM/CJS/SSR/legacy/模块图/样式 | 10 种真实构建通过 | consumer/ |
| Vue 3.5.38 / 3.5.44 严格类型 | 每版 488 份声明，skipLibCheck:false 通过 | strict/results.json |
| clean consumer 新入口 + AI/Todo 旧入口 | tarball 安装、SSR hydration、交互、axe、iframe 通过 | chromium/ |
| 五种要求配置 | Chromium 桌面/手机、Firefox 桌面、WebKit 桌面/手机通过；额外 Firefox 手机视口通过 | chromium/、firefox/、webkit/ |
| 原生 Tab 对照 | radio、编辑区、details、日期、媒体导航与容纳通过 | 各引擎 results.json 的 modalNativeTab |
| 1.1.0 → 1.2.0 → 1.1.0 | 状态保留；候选 manifest/lock 安装和构建恢复通过 | rollback/results.json |

手机配置是浏览器视口/触控仿真，不代表真机 Safari 或 Electron 验收。新建验证应用不等于既有业务采用，自动化通过不替代 M1 用户确认。

最终 core tarball SHA-256：`38c00fed373bba4c30a4b0c0bbc9e0e38bb3db5360d2948f5bc5aca1458782a1`。三包哈希和生成文件逐字节核对数见 [artifacts.json](artifacts.json)。原始浏览器 runner 在提交前启动，sourceSha 保留当时 HEAD `63fb3d1`；[source-manifest.json](source-manifest.json) 核对当前全部包/脚本/试点输入与 `c76b335` 的 Git blob 一致，所有浏览器和 consumer 指向相同最终 tarball。未修改原始日志的 sourceSha。

归档只含结果、日志、锁文件、截图和静态预览，不含 node_modules；日志/模块图/axe/锁文件以 gzip 保留，解压后字节核对见 archive-verification.json。初始失败记录仍在初始报告目录和 diagnostics/，不计为最终通过证据。

## 门禁

本地证据通过；必需远端 CI 待本轮提交完成后核实。G1 契约负责人审查、G6 PR/CI、G7 主线/Pages 与 G8 M1 用户验收未全部完成，M1 不得标记 Accepted。候选静态预览见 preview-clean-consumer/；npm 发布仍未授权。完成 CI 后提交负责人决策，不进入 M2/M3。
