# 1.2 按需候选

本页描述 **`aheart-ui@1.3.0-preview.1` 预览候选**，示例以本地 tarball 安装。当前稳定版的安装方式见[安装](./installation)。

## 推荐：组件子入口与显式样式

```sh
npm install ./aheart-ui-1.3.0-preview.1.tgz vue@3.5.44
```

应用入口引入一次主题，并仅引入使用到的组件样式：

```ts
import 'aheart-ui/theme.css'
import 'aheart-ui/button/style.css'
import 'aheart-ui/combobox/style.css'
import 'aheart-ui/modal/style.css'
import 'aheart-ui/select/style.css'

import Button from 'aheart-ui/button'
import Combobox from 'aheart-ui/combobox'
import Modal from 'aheart-ui/modal'
import Select from 'aheart-ui/select'
```

这些子入口也提供同名 named export 及组件类型。应用仍使用原有 props、事件和 slots，无需修改业务状态。组件 CSS 已包含必需的 Icon、Button、Skeleton 或 floating 视觉依赖；不必为 Modal 额外手工引入 Button 样式。

JS 不会自动导入 CSS。缺少样式时，先检查 `theme.css` 与对应组件 `style.css` 是否由应用入口引入，再检查自定义全局样式覆盖。主题变量仍可覆盖，见[主题 Token](./theme)。

## 全量与兼容路径

需要全量注册的应用可以显式选择：

```ts
import AheartUI from 'aheart-ui/full'
import 'aheart-ui/full.css'
app.use(AheartUI)
```

v1 根 default Plugin、根 named exports、`aheart-ui/style.css` 及既有 `es/lib` 深层路径继续保留。`style.css` 与 `full.css` 内容相同；现有项目可以先升级包、保留旧导入，再逐个迁移到子入口。根 default Plugin 的分离属于未来 v2，1.2 不会删除它。

SSR 消费同一组公共 JS/types 入口；应用的服务端和客户端必须使用相同的组件树和入口版本。Modal/Select 的 teleport 目标和样式须位于正确的 owner document；iframe 应在子文档加载主题和组件 CSS。

## 范围与回退

基础包提供 Button、Combobox、Modal 和 Select 子入口。自动导入、AI/DND 场景入口与迁移步骤见 [M3 按需迁移](./m3-migration)。

回退时恢复此前精确版本与 lockfile，并还原旧根入口和 `style.css`。候选验证使用独立目录；公开 npm 发布与阶段 Go 是单独决策。包图与预算依据见仓库 `evidence/M1/contract.md`，可运行 `pnpm check:m1-consumer` 重现 tarball 消费证明。
