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
node pilots/run-baselines.mjs --out /tmp/aheart-pilot-evidence-new
```

证据目录必须不存在。runner 会为三个工程创建仓库外安装副本，记录源码 SHA、输入文件 hash、公开包版本/无 symlink、lockfile、命令/退出码/耗时、SSR 构建、真实浏览器 hydration、桌面/移动关键交互、axe、截图和模块图。普通两个应用不能解析出 AI/DND 的已渲染 JS。

限制：本轮是 Chromium desktop/mobile emulation；不等同五浏览器、物理 iOS、Electron shell 或真实用户验收。AI 消息来自本地适配器，审批只更新本页本地状态；不调用模型、Git、网络写入或发布服务。先建立此基线，再单独决定扩大场景。

## 升级与回退

记录当前 package-lock 和 registry/tarball hash。后续组件版本在新的隔离副本里验证；回退时在另一新副本恢复原 package.json/package-lock，执行 `npm ci` 并重跑关键任务。禁止为让新入口通过而改写旧基线结果。
