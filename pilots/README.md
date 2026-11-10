# Aheart UI M0 消费验证工程

这三个工程由本轮根据用户指示新建，源码随 Aheart UI 仓库保存，运行时安装和浏览器测试在仓库外的独立目录执行。它们不冒充历史业务采用，不自动代表用户验收。

| 工程 | 功能 | 依赖范围 |
| --- | --- | --- |
| clean-consumer | Button 计数、Select 切换、Modal 焦点、SSR hydration、真实 iframe | core + Vue |
| ai-review-gate | 本地聊天、检查清单、修订预览、人工批准及重复批准限制 | core + AI + DND + Vue |
| muxu-todo | 添加/完成/筛选/删除任务，localStorage 刷新恢复 | core + Vue |

每个目录都是独立 npm/Vite 工程，不在 pnpm workspace 中。没有源码 alias、绝对 link 或 workspace 依赖。当前消费公开版本 core 1.1.0、AI/DND 1.0.0；依赖锁文件和 registry 来源随基线结果保存。

## 单独启动

在一个独立副本中执行：

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run dev
```

访问终端打印的本地 URL。验证路径：`/index.html` 是客户端入口；`npm run build` 后的 `/ssr.html` 是真实服务端渲染后的 hydration 入口；`/iframe.html` 把同一应用加载进独立子文档。生产预览使用 `npm run preview`。

`npm run typecheck` 是现有消费者兼容检查。`npm run typecheck:strict` 不使用 skipLibCheck，公开 core 1.1.0 当前会复现 Card TS2344（#39），保留失败结论，不把兼容模式通过写成严格类型通过。

## 全部基线

```sh
npm --prefix pilots/tooling ci --ignore-scripts --no-audit --no-fund
npm --prefix pilots/tooling exec -- playwright install chromium
node pilots/run-baselines.mjs --strict-types known-card-error --out .pilot-runs/evidence-new
```

证据目录必须不存在。runner 会为三个工程创建仓库外安装副本，记录源码 SHA、输入文件 hash、公开包版本/无 symlink、lockfile、命令/退出码/耗时、SSR 构建、真实浏览器 hydration、桌面/移动关键交互、axe、截图和模块图。普通两个应用不能解析出 AI/DND 的已渲染 JS。

限制：本轮是 Chromium desktop/mobile emulation；不等同五浏览器、物理 iOS、Electron shell 或真实用户验收。AI 消息来自本地适配器，审批只更新本页本地状态；不调用模型、Git、网络写入或发布服务。先建立此基线，再单独决定扩大场景。

## 验证本地 core 修复包

构建并打包 core 后，可用 `--core-tarball /绝对路径/aheart-ui-1.1.0.tgz` 对照公开版本基线。runner 只在新的安装副本中更新依赖及锁文件，执行 `npm ci`，记录 tarball SHA-256 和已安装版本，拒绝 workspace symlink；AI/DND 仍使用试点锁定的公开版本。

```sh
node pilots/run-baselines.mjs --core-tarball /绝对路径/aheart-ui-1.1.0.tgz --out .pilot-runs/evidence-candidate
```

默认要求严格类型检查 exit 0；包含 Card 修复的候选包必须在此模式通过。只有重现旧 1.1.0 基线时才显式使用 `--strict-types known-card-error`，该模式检查每条错误都是已知 Card TS2344，并以非零退出码记录已知问题；其他错误或预期失败消失都会失败。历史对比度修复包尚未包含 Card 修复，重跑它时也需显式选择已知错误模式。

clean-consumer 和 AI 工作台的 axe 检查会主动悬停默认/排序按钮，等待颜色过渡结束；手机视口也检查 Drawer 内排序按钮。

## 升级与回退

记录当前 package-lock 和 registry/tarball hash。后续组件版本在新的隔离副本里验证；回退时在另一新副本恢复原 package.json/package-lock，执行 `npm ci` 并重跑关键任务。禁止为让新入口通过而改写旧基线结果。

`check-rollback.mjs` 在 runner 创建的隔离 `muxu-todo` 副本中执行公开基线 → 本地候选 → 公开基线的同源浏览器演练，验证跨安装保留任务和完成状态，以及回退后删除任务的能力。它恢复原始 manifest/lock、重新安装并构建后才结束，不修改试点源码。

```sh
node pilots/check-rollback.mjs --project .pilot-runs/aheart-m0-pilots-XXXXXX/muxu-todo --core-tarball /绝对路径/aheart-ui-1.1.0.tgz --out .pilot-runs/rollback-new
```

回退必须恢复公开基线锁文件并验证 `resolved`/`integrity`；同版本本地 tarball 与 registry 包不能只改版本字符串。此演练验证组件候选包的切换，不等于公开发布、真实业务迁移或用户验收。

## 同时预览已建好的三工程

基线运行完成后执行 `node pilots/serve-baselines.mjs <证据目录>`。默认分别在本机 4181、4182、4183 端口预览 SSR 页面；Ctrl+C 关闭。本命令只启动已有独立副本，不安装或更新包，也不部署线上。

退出码：基线 runner 返回 0 表示无已知失败，1 表示本轮检查失败，2 表示基线已采集但仍有公开包的已知严格类型失败。始终以逐项结果判断，不把预期失败写成通过。

磁盘位置：默认将独立安装副本和证据存入 worktree 下的 `.pilot-runs/`（Git 忽略），跟随仓库所在磁盘，不再使用系统 `/tmp`。可用 `--work-dir <目录>` 指定其他盘上的安装副本目录。

## M1 1.2 候选

`--entry-mode subpath` 只改写隔离副本中的 clean-consumer 导入及 CSS，原业务流程保持一致；AI 工作台和 Todo 保留旧入口验证兼容。`--browser chromium|firefox|webkit` 控制真实浏览器，手机视口在 Chromium/WebKit 开启触屏移动上下文。默认仍为 legacy + chromium，便于复测公开 1.1.0 历史基线。

```sh
node pilots/run-baselines.mjs --core-tarball test-results/release-tarballs/aheart-ui-1.2.0.tgz --entry-mode subpath --out .pilot-runs/m1-chromium
node pilots/run-baselines.mjs --core-tarball test-results/release-tarballs/aheart-ui-1.2.0.tgz --entry-mode subpath --only clean-consumer --browser webkit --out .pilot-runs/m1-webkit
```

产物含消费后的源码、锁文件、包来源、模块图、SSR 与交互/axe 结果。不以自动化运行代替阶段负责人验收。
