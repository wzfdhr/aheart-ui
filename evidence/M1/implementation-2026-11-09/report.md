# M1 v1.2 本地实现与消费验证

2026-11-09。M0 已获负责人书面 Go；**M1 实现已具备本地验证证据，阶段仍为 In progress / 待审查，未合并、未部署、未发布 npm。**

运行时代码提交 `5445886d2437e2fae6a2365e05438397c35bab2a`，基线 master `90285d6`。试验在代码提交前启动，因此原始 runner 的 sourceSha 仍显示当时 HEAD；[source-manifest.json](source-manifest.json) 逐个核对源文件 Git blob 与该提交一致，不回写原始日志。最终 tarball SHA 见 [artifacts.json](artifacts.json)，core 为 `2e42ed55f5a98a23364cf3dea90b8bf8a4e3c471cda9a89723b9a635694df377`。

## 实现与兼容边界

- Button/Modal/Select 公共 subpath：ESM、CJS、default/named 及类型；新增 /full Plugin，模块求值不会注册应用。
- 真实 theme.css、组件 style.css、full.css。组件样式含必需子组件视觉依赖；嵌套 es/lib package.json 保留 CSS sideEffects。
- 根 default Plugin、named、旧 es/lib 路径与 style.css 保留；full.css/style.css 与基线全量样式逐字节相同。
- 三组件入口/视觉依赖在一份 build manifest 中，构建与 release contract 共用。Resolver/Icons/Primitive/AI/DND 拆分不在本轮。
- M1 core 版本为 1.2.0，本地 pack；AI/DND 仍 1.0.0，现有 peer 接受 1.2。未执行 publish。

## 实际包体与模块图

同一隔离 npm 安装、Vite 5.0.12、Vue 3.5.44、Node 24.17.0。JS gzip **包含 Vue**，表中 CSS 是未压缩的组件样式源（不含独立 theme）。预算在 [contract.md](../contract.md) 实现前固定。

| 组件 | 子入口 JS gzip bytes | 根 named 基线 JS gzip bytes | 组件 CSS bytes | CSS / full |
| --- | ---: | ---: | ---: | ---: |
| button | 32,939 | 32,939 | 7,945 | 3.98% |
| modal | 41,090 | 41,060 | 16,305 | 8.17% |
| select | 56,974 | 57,067 | 10,472 | 5.25% |

显式 /full 为 189,940 JS gzip bytes；full CSS 199,595 bytes，theme 1,767 bytes。所有三组件都低于 full，且在根 named + max(512 bytes, 1%) 预算内。组件 CSS 各低于 full 25%，theme + 组件低于 30%。JS-only fixture 的 CSS 资源为 0，显式样式均保留。模块图同时记录 parsed 和 rendered 模块：三个子入口未解析越界的基础组件/AI/DND。Lucide 等已有第三方依赖仍保留并完整记录，未声称解析零开销。

## 验证

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 三包 build/typecheck | exit 0 | m1-all-build / m1-all-typecheck.log.gz |
| 全量组件与脚本测试 | 1,488 + 79 + 200；251 脚本，全部通过 | m1-verified-tests-recheck.log.gz |
| fresh APFS clone 构建确定性 | frozen lock 真安装，完整两次构建及生成产物检查 exit 0 | determinism/results.json、run.log.gz |
| 三包 release:pack | core 1061 / DND 79 / AI 115 files，无 AppleDouble | artifacts/、artifacts.json |
| ESM/CJS/legacy/SSR/module graph/CSS | 10 种实际构建，全部通过 | consumer/results.json、各模块图、node-probe.log.gz |
| Vue 3.5.38 / 3.5.44 严格类型 | 每版 488 份声明、根/新 subpath/full，skipLibCheck:false 通过 | strict/results.json |
| 必需两试点 + 可选 Todo | tarball 安装、SSR hydration、交互、axe、iframe 通过 | chromium/results.json；clean 使用新入口，AI/Todo 旧入口兼容 |
| 五浏览器 | Chromium 桌面/手机、Firefox 桌面、WebKit 桌面/手机通过；额外 Firefox 手机视口也通过 | chromium/、firefox/、webkit/；截图与独立结果 |
| 升级/回退 | 公开 1.1.0 → 本地 1.2 → 公开 1.1.0，状态保留；原候选 manifest/lock 恢复 passed | rollback/results.json |

## WebKit 焦点问题与失败保留

首次 WebKit 失败于 Modal Tab trap。补充等待后仍失败；独立记录显示从关闭按钮按 Tab 后 activeElement 变为 body，随后进入弹窗外控件，见 webkit-focus-before.json 和两轮初始截图/日志。根因是只在 DOM 可聚焦列表边缘拦截 Tab，依赖浏览器原生逐项跳转；原生跳过按钮时会逃逸。

修复为每次被 trap 的 Tab 都显式移动焦点，保留正 tabindex 优先顺序，跳过隐藏/inert/disabled 控件，并尊重子控件已 preventDefault 的事件。新增 3 项回归，Modal 共 63 项测试通过，最终五浏览器从打包产物通过。没有跳过焦点检查或增加重试。

首次全量本地测试因外置盘新生成的 ._modal.test.ts 被当作测试文件失败，真实 1488 项均通过。已验证 AppleDouble magic 和同名源文件后隔离伴随元数据，再跑全量成功；没有放宽 Vitest。首次确定性探针复用跨目录 node_modules 符号链接，导致 Vue 声明别名差异；该探针结果保留但不计为通过，最终使用 fresh clone + frozen 安装，两次构建通过。

## 门禁与下一步

Local / npm pack：Pass。G2/G3/G4/G5 本地证据具备；G1 契约待负责人审查，G6 PR/必需 CI、G7 主线/Pages、G8 M1 用户验收尚未完成。M1 **不得 Accepted**。M0 的确认不等于 M1 合并、部署或 npm 发布授权。

review 用静态候选见 preview-clean-consumer/，支持 SSR 页面和 iframe。PR 审查及 CI 完成后再请求 M1 合并/部署决策；此阶段不进入 M2/M3。
