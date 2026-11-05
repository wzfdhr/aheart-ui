# Aheart UI v2 架构与产品体系优化设计

## 文档状态

- 状态：已批准（Approved）
- 批准：2026-11-05，wzfdhr（单人项目，产品、技术、设计/文档、发布负责人均由其担任）
- 说明：正文中的发布事实截至 2026-09-08；截至 2026-11-05，`aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0` 均已公开发布，见 [发布报告](../evidence/v1.1.0-release-2026-09-29/registry-publish-report.md)。批准文档不等于 M0 通过，M0 其余门禁仍按阶段验收标准判定。
- 日期：2026-09-08
- 适用仓库：`wzfdhr/aheart-ui`
- 文档角色：技术架构 RFC；产品目标、任务顺序和验收判定以配套主方案为准
- 目标版本：`aheart-ui@2` 候选架构；是否进入 v2 由 M8 Go/No-Go 决定
- 实施方式：独立工作树、分阶段交付，不混入当前 Table/D5 等维护分支

关联文档：

- [产品与技术总体方案](./2026-09-08-aheart-ui-product-and-technical-master-plan.md)
- [整体任务流程清单](./2026-09-08-aheart-ui-v2-task-flow-checklist.md)
- [阶段验收标准](./2026-09-08-aheart-ui-v2-phase-acceptance-criteria.md)

## 1. 执行摘要

Aheart UI v2 不应被定义为一次简单的“拆包”或“新增动画组件”工作。它需要同时解决以下问题：

1. 基础组件、AI 产品、Motion、DND、Icons 的产品边界。
2. JavaScript、TypeScript 类型和 CSS 的真实按需交付。
3. 复杂组件的受控状态、组合 API、浮层、焦点、SSR 和动画生命周期。
4. `aheart-icon` 作为默认图标源时的公共安装、单图标导出和版本供应链。
5. 文档、Resolver、质量矩阵、构建入口和发布契约使用同一份组件元数据。
6. v1 用户的兼容路径、弃用周期和可验证迁移。

最终建议采用“一个基础包 + 四个领域包 + 基础包工具入口”的结构：

```text
Aheart UI Ecosystem
├─ aheart-ui                     基础组件、默认主题、复杂组件内核
│  ├─ /button                    显式组件级入口
│  ├─ /combobox
│  ├─ /modal
│  ├─ /full                      全量 Vue Plugin
│  ├─ /namespaced                Combobox.Root 风格 API
│  ├─ /resolver                  unplugin-vue-components Resolver
│  ├─ /constant                  组件清单与构建元数据
│  └─ /theme.css                 基础 Token 与全局主题
├─ @aheart-ui/icons              由 aheart-icon 演进而来
├─ @aheart-ui/ai                 AI 产品界面组件
├─ @aheart-ui/motion             可选动效预设
└─ @aheart-ui/dnd                拖拽与排序交互
```

核心设计判断：

- 保留 `aheart-ui` 作为基础包，不公开新增 `@aheart-ui/core`。
- 保留默认视觉，不把项目整体改造成无样式 Headless UI。
- 简单组件维持简单 API，只有复杂组件增加 Compound/Anatomy API。
- 基础包拥有轻量 Presence 生命周期，但不强依赖 Motion 包。
- 图标必须先解决公共 npm 安装问题，再成为基础包默认依赖。
- 根入口继续提供 named exports；显式 subpath 和 Resolver提供确定性的按需路径。
- 全量插件迁移到 `/full`；旧根默认插件仅在 v1.x 兼容期保留，v2 根入口不再静态引用全量插件。

## 2. 背景与当前基线

### 2.1 当前产品结构

仓库已经存在三个 package 目录，但当前只有基础包已在公共 npm 发布：

```text
packages/components  → aheart-ui@1.0.0
packages/ai          → @aheart-ui/ai@1.0.0（仓库 package，公共 npm 未发布）
packages/dnd         → @aheart-ui/dnd@1.0.0（仓库 package，公共 npm 未发布）
```

这说明领域拆分方向已经在源码中形成，但公共产品生态尚未成立。v2 候选架构的重点是先验证这些分层能否被稳定发布、安装和采用，再决定是否升级为正式产品契约。

### 2.2 当前发布入口

当前基础包：

- 根入口导入全部组件。
- 根入口构造全量 `components` 数组并导出默认 Vue Plugin。
- `exports` 主要暴露 `.`、`./style.css`、`./es/*`、`./lib/*`。
- 没有稳定的 `aheart-ui/button`、`aheart-ui/modal` 等用户入口。
- Vite 使用 `preserveModules`，但主入口仍然只有 `src/index.ts` 和少量特殊入口。

因此当前属于“源码和构建目录按模块组织”，还不是“发布契约按组件组织”。

### 2.3 当前 CSS 交付

基础组件的所有样式由构建插件拼接成一个总文件：

```text
packages/components/es/style.css   191342 bytes
packages/components/lib/style.css  191342 bytes
```

组件目录中的 `style.css.js` 为空占位文件。即使 JavaScript 被 tree-shaking，用户仍需加载整份样式，或者深层入口完全得不到对应 CSS。

AI 当前同样以一份总 CSS 发布，根入口无条件导入所有 AI 组件；DND 也只有根入口和总样式。

### 2.4 当前图标实现

`AIcon` 已经提供了有价值的稳定外壳：

- 默认 slot
- `component`
- `name`
- `size`
- `color`
- `spin`

但底层语义图标固定来自 `@lucide/vue`，并使用静态字符串 Map。这个模式只适合少量内部语义图标，不适合把 518 个图标全部注册进运行时 Map。

### 2.5 当前复杂组件底座

仓库已经存在以下可复用能力：

- `useMotionPresence`
- `usePropPresence`
- `useFloatingPosition`
- `useFloatingDismiss`
- `useTeleportReady`
- ConfigProvider provide/inject
- Modal、Drawer 的焦点捕获、Tab trap 和恢复焦点
- Select、TreeSelect、Cascader、DatePicker 的受控/非受控状态
- 多个组件的 ARIA、键盘和浏览器测试

问题不是完全缺少底座，而是：

- API 命名和状态机分散在各组件。
- Presence 依赖固定 duration，不监听真实 animation/transition 完成。
- `useFloatingDismiss` 使用全局 `document`，不适合 iframe、多 document 和 ShadowRoot。
- Modal 与 Drawer 重复维护焦点逻辑。
- Menu、Tabs、Tree 重复实现 roving focus。
- Teleport、容器解析、层级和 Escape 处理分散。
- 公开 DOM 状态主要依赖 class，没有统一 `data-*` 契约。

## 3. 目标与非目标

### 3.1 目标

1. 用户可以只安装和引入实际需要的产品领域。
2. 单组件消费只包含实际依赖的 JS、类型、CSS 和图标。
3. 根 named import 和显式 subpath 都具备真实 tree-shaking 证据。
4. 基础组件开箱即用，同时允许复杂场景进行 Compound 组合。
5. 图标、Motion 和 AI 不污染基础组件公共 API。
6. 浮层、焦点、受控状态、SSR 和动画行为拥有统一内核。
7. 文档和发布工具能准确告诉用户每个组件来自哪个包、入口和样式文件。
8. v1 用户有明确迁移、弃用和回退路线。

### 3.2 非目标

- 不把 Aheart UI 改造成完全无样式组件库。
- 不把每个组件发布成一个独立 npm 包。
- 不一次性重写全部 48 个 Ready 组件。
- 不直接复制 Reka UI 或 Ark UI 的内部实现。
- 不让所有简单组件都使用 `Root/Content/Item` 写法。
- 不在基础包中引入 GSAP、Lottie 或大型动画运行时。
- 不把 AI provider、模型请求、鉴权或业务状态管理放进 UI 包。
- 不在没有 bundle fixture 的情况下宣布“支持按需引入”。

## 4. 设计原则

### 4.1 Styled by default, composable when needed

默认 API 必须保持低门槛：

```vue
<AButton>提交</AButton>
<ASelect v-model="value" :options="options" />
<ACombobox v-model="value" :options="options" />
```

复杂组件额外提供高级 API：

```vue
<Combobox.Root v-model="value">
  <Combobox.Anchor>
    <Combobox.Input />
    <Combobox.Trigger />
  </Combobox.Anchor>
  <Combobox.Portal>
    <Combobox.Positioner>
      <Combobox.Content>
        <Combobox.Item />
      </Combobox.Content>
    </Combobox.Positioner>
  </Combobox.Portal>
</Combobox.Root>
```

### 4.2 Progressive disclosure

- 普通业务用户看到高阶组件。
- 高级用户按需进入 Compound API。
- 设计系统作者使用 Primitive、状态属性和 CSS Variables。
- 构建工具通过 Resolver 自动选择入口和样式。

### 4.3 Stable public contract, replaceable internals

公开稳定的是：

- props/emits/slots
- subpath
- `data-scope/data-part/data-state`
- CSS Variables
- ConfigProvider 配置
- Presence 生命周期事件

内部实现可以从自研 utility 演进为新的 Primitive，但不能把用户绑定到内部目录和私有类型。

### 4.4 Evidence before claims

“支持按需”必须同时有：

- exports 证据
- consumer fixture 证据
- bundle 模块图证据
- CSS 证据
- 类型与 SSR 证据

## 5. 产品与包架构

### 5.1 `aheart-ui`：基础组件包

职责：

- 通用、布局、导航、数据录入、数据展示、反馈与浮层组件。
- ConfigProvider、主题 Token、locale。
- 轻量内部 Primitive。
- `AIcon` 适配层和少量默认语义图标。
- 复杂组件的高级 Compound API。

不负责：

- AI 产品语义。
- 高级动画预设。
- 拖拽业务交互。
- 完整图标库再导出。

### 5.2 `@aheart-ui/icons`：图标包

由现有 `aheart-icon` 仓库演进。

职责：

- 独立 Vue 图标组件。
- `currentColor`。
- 单图标 subpath。
- 图标 manifest、类型和可搜索 Gallery。

不负责：

- Aheart UI 的尺寸、spin、语义角色 API。
- 组件级默认图标选择。
- 主题状态。

这些由基础包的 `AIcon` 和 ConfigProvider 负责。

### 5.3 `@aheart-ui/ai`：AI 产品组件

第一层：依赖轻、可独立组合的 AI primitives。

```text
Bubble
Sender
Actions
Attachments
Sources
Prompts
ThoughtChain
Process
Welcome
```

第二层：组合组件。

```text
ChatPanel
Conversations
AIForm
AgentExecution
```

第三层：Workbench。

```text
AgentWorkbench
```

Workbench 才允许依赖 DND。AI 根入口不应因为导出 Workbench 就强制普通 Bubble/Sender 消费者解析 DND。

### 5.4 `@aheart-ui/motion`：动画预设包

职责：

- Fade、Slide、Scale、Collapse、Stagger 等视觉预设。
- AnimateNumber、Typewriter、Marquee 等产品动效。
- reduced-motion 策略。
- 消费基础组件的 `data-state`、Presence 和 CSS Variables。

不负责：

- 基础组件的 open/close 状态。
- 焦点和卸载正确性。
- 浮层定位。

### 5.5 `@aheart-ui/dnd`：拖拽扩展包

继续保持独立包，并新增：

```text
@aheart-ui/dnd/draggable
@aheart-ui/dnd/drop-zone
@aheart-ui/dnd/sortable
@aheart-ui/dnd/full
```

AI Workbench 应只引用 `@aheart-ui/dnd/sortable`。

## 6. 公共导入契约

### 6.1 基础组件

同时支持三种使用层级。

根 named import：

```ts
import { Button, Modal } from 'aheart-ui'
```

确定性的组件 subpath：

```ts
import { Button } from 'aheart-ui/button'
import { Modal } from 'aheart-ui/modal'
```

全量 Vue Plugin：

```ts
import AheartUI from 'aheart-ui/full'
import 'aheart-ui/full.css'

app.use(AheartUI)
```

### 6.2 Compound 组件族

组件族入口应直接提供 namespace：

```ts
import { Combobox } from 'aheart-ui/combobox'
```

可选的聚合高级入口：

```ts
import { Combobox, Modal } from 'aheart-ui/namespaced'
```

`/namespaced` 适合文档、设计系统封装和高级场景，不承诺是最小 bundle 入口。

### 6.3 AI、Motion、DND、Icons

```ts
import { AISender } from '@aheart-ui/ai/sender'
import { AIBubble } from '@aheart-ui/ai/bubble'
import { AIAgentWorkbench } from '@aheart-ui/ai/agent-workbench'

import { Fade } from '@aheart-ui/motion/fade'
import { Collapse } from '@aheart-ui/motion/collapse'

import { SortableList } from '@aheart-ui/dnd/sortable'

import Search from '@aheart-ui/icons/search'
import HeartFill from '@aheart-ui/icons/heart-fill'
```

## 7. 构建与真实按需交付

### 7.1 入口 manifest

新增单一组件元数据源：

```ts
interface ComponentManifestItem {
  name: string
  globalName: string
  package: 'aheart-ui' | '@aheart-ui/ai' | '@aheart-ui/motion' | '@aheart-ui/dnd'
  domain: string
  subpath: string
  sourceEntry: string
  styleEntry?: string
  compound?: boolean
  status: 'ready' | 'preview' | 'planned'
  since: string
}
```

以下内容必须由 manifest 生成或验证：

- Rollup/Vite inputs
- package exports
- root named exports 完整性
- `/constant`
- `/namespaced`
- Resolver
- 文档导航和组件概览
- 质量矩阵 package/domain 字段
- release contract

避免组件清单在构建脚本、文档、Resolver 和质量矩阵中重复维护。

Icons 使用独立的 `IconManifest`，不混入组件 Resolver 的 `ComponentManifestItem`：

```ts
interface IconManifestItem {
  name: string
  componentName: string
  source: string
  subpath: string
  keywords: string[]
}
```

`ComponentManifestItem.package` 因此有意不包含 `@aheart-ui/icons`；图标 Gallery、单图标 exports 和图标发布契约由 `IconManifest` 驱动。

### 7.2 目标产物

v2 推荐统一为：

```text
dist/
├─ esm/
├─ cjs/
├─ types/
└─ styles/
   ├─ theme.css
   ├─ full.css
   ├─ button.css
   ├─ modal.css
   └─ combobox.css
```

`package.json` 仅发布 `dist`、README、LICENSE 和必要 metadata。

### 7.3 CSS 规则

拆分三层 CSS：

1. `theme.css`：tokens、基础变量和必要的全局契约。
2. 组件 CSS：只包含该组件视觉和必要共享样式。
3. `full.css`：兼容性全量聚合入口。

v2 冻结以下唯一规则：

- 组件 Vue/JS 运行时入口不再内联导入 CSS。
- 应用入口显式导入一次 `aheart-ui/theme.css`。
- 手动按需用户显式导入组件 CSS。
- Resolver 的 `importStyle: 'css'` 只注入组件 CSS，不注入 theme。
- `/full` 用户显式导入 `aheart-ui/full.css`。
- 同一项目应选择“手动组件 CSS”或“Resolver 自动组件 CSS”，不混用。

使用方式：

```ts
import 'aheart-ui/theme.css'
import 'aheart-ui/button/style.css'
```

逻辑路径与物理产物通过 `package.json.exports` 显式映射：

```json
{
  "./theme.css": "./dist/styles/theme.css",
  "./full.css": "./dist/styles/full.css",
  "./button/style.css": "./dist/styles/button.css",
  "./modal/style.css": "./dist/styles/modal.css"
}
```

Resolver 样式策略只有两种：

```text
importStyle: false  → 只解析 JS，用户手动管理组件 CSS
importStyle: 'css'  → Resolver 注入该组件的精确 CSS
```

Resolver 不提供隐式全局 theme 注入，避免不同构建器产生重复或顺序差异。

兼容入口：

```text
aheart-ui/style.css → v2 中继续指向 full.css
```

### 7.4 `sideEffects` 策略

JavaScript 默认应无副作用；样式入口精确标记为副作用：

```json
{
  "sideEffects": ["**/*.css"]
}
```

`full.js` 只导出 Plugin，不在模块求值阶段执行 `app.use`，因此本身保持无副作用。ESM/CJS/types/exports/files/main/module 的路径必须由发布契约检查，且 package tarball 必须实际包含所有被 `exports` 和 `sideEffects` 引用的文件。

不能在没有 consumer bundle 验证的情况下简单设置全包 `sideEffects: false`。

### 7.5 根入口与全量入口硬边界

```text
src/index.ts
  只导出 named components 和 types
  不导入、不再导出 src/full.ts 的默认 Plugin

src/full.ts
  才导入完整组件清单并创建 Vue Plugin
```

v2 中：

```ts
import { Button } from 'aheart-ui'       // 按需候选
import AheartUI from 'aheart-ui/full'    // 明确全量
```

bundle fixture 必须证明根 named import 不包含 `full.js`、Table、DatePicker、AI 或 DND。

### 7.6 生成物策略

目标状态建议不再把 `es/`、`lib/` 构建目录长期提交进 Git：

- Docs 开发通过 alias 消费源代码。
- CI 在隔离目录构建两次并比较 hash，验证确定性。
- 发布通过 `npm pack` 生成可重建 tarball。
- 本地项目集成使用带版本、commit 和 SHA-256 的 `.tgz` 快照。

为降低迁移风险：

- v1.1 仍保留当前 `es/lib` 兼容结构。
- v2 prerelease 切换到 `dist`。
- v2 稳定后删除 Git 中旧构建目录；若仍保留 `aheart-ui/es/*`、`aheart-ui/lib/*` 逻辑入口，则由 release build 在 tarball 中生成指向 `dist` 的兼容 facade，不再提交生成物。

## 8. Resolver 与开发体验

推荐入口：

```ts
import { AheartUIResolver } from 'aheart-ui/resolver'
```

```ts
Components({
  resolvers: [
    AheartUIResolver({
      importStyle: 'css',
      domains: ['base', 'ai', 'motion', 'dnd']
    })
  ]
})
```

解析示例：

```text
AButton             → aheart-ui/button
ACombobox           → aheart-ui/combobox
AAISender           → @aheart-ui/ai/sender
AMotionFade         → @aheart-ui/motion/fade
ASortableList       → @aheart-ui/dnd/sortable
```

Resolver 只读取 `/constant` 导出的静态 manifest，不导入组件运行时代码。

`importStyle: 'css'` 模式只生成精确的组件 CSS import；`theme.css` 始终由应用入口显式导入。选择 `importStyle: false` 后，Resolver 不生成任何样式副作用。

后续可增加 `aheart-ui/nuxt`，但不作为 v2 首发阻塞项。

## 9. 基础 Primitive 设计

### 9.1 内部目录

```text
packages/components/src/internal/
├─ controllable/
│  ├─ use-controllable-state.ts
│  └─ use-controllable-boolean.ts
├─ dom/
│  ├─ use-owner-document.ts
│  ├─ use-stable-id.ts
│  └─ use-composed-refs.ts
├─ primitive/
│  ├─ primitive.vue
│  ├─ slot.vue
│  └─ merge-props.ts
├─ presence/
│  └─ use-presence.ts
├─ floating/
│  ├─ floating-root.ts
│  ├─ portal.vue
│  ├─ positioner.vue
│  ├─ dismissable-layer.ts
│  └─ layer-stack.ts
├─ focus/
│  ├─ focus-scope.ts
│  ├─ roving-focus.ts
│  └─ keyboard-navigation.ts
├─ collection/
│  └─ collection.ts
└─ field/
   └─ field-context.ts
```

这些模块先保持私有。只有经过至少两个组件族复用、API 冻结和独立测试后，才考虑公开。

### 9.2 受控状态

统一 API：

```ts
const state = useControllableState({
  value: () => props.modelValue,
  defaultValue: () => props.defaultValue,
  onChange: value => emit('update:modelValue', value)
})
```

返回：

```ts
{
  value,
  isControlled,
  setValue,
  reset
}
```

统一规则：

- 挂载时确定受控状态。
- 开发模式检测从受控切换为非受控或反向切换。
- `defaultValue/defaultOpen` 只定义初始非受控值，不持续同步。
- 所有更新统一经过 `setValue/requestOpen`。

### 9.3 Primitive、`as` 与 `asChild`

- `as` 改变默认标签或组件。
- `asChild` 把行为、ARIA、事件、class、style 和 ref 合并到唯一子节点。
- 多根、文本根或 Fragment 在开发模式给出明确警告。
- 合并事件时，用户调用 `preventDefault` 后是否继续内部行为必须书面定义。
- 只优先用于 Trigger、Item、Content 等高级部件。

### 9.4 Presence

现有 `useMotionPresence` 应演进为无视觉依赖的 Presence：

```ts
usePresence({
  present,
  forceMount,
  unmountOnExit,
  onEnter,
  onAfterEnter,
  onLeave,
  onAfterLeave
})
```

要求：

- 同时识别 CSS animation 和 transition 的真实完成事件。
- duration 只作为超时保护，不作为唯一完成依据。
- 支持 reduced motion。
- 支持取消中的 enter/leave。
- 统一输出 `data-state="open|closed"` 和阶段事件。
- 嵌套 Presence 不得导致父节点提前卸载。

### 9.5 Floating 与 Layer

`useFloatingPosition` 继续作为定位基础；`useFloatingDismiss` 改为 DismissableLayer。

要求：

- 从 trigger/floating 元素推导 `ownerDocument`。
- Escape 只关闭最上层可关闭浮层。
- Outside interaction 使用 `composedPath`。
- 支持 iframe、ShadowRoot、多 app root。
- Portal 容器优先级统一。
- 提供 layer stack 和 z-index token。
- 嵌套 Popover、Select、Modal 不互相误关。

### 9.6 Focus 与 Collection

FocusScope 统一：

- mount autofocus
- unmount restore focus
- trapped
- loop
- present

RovingFocus 统一：

- orientation
- loop
- Home/End
- disabled item
- 当前 tab stop

Collection 统一：

- item 注册与顺序
- value/label/disabled
- group
- visible items
- typeahead
- virtual index 映射

迁移顺序：Tabs → Menu → Tree → Select/Combobox。

### 9.7 FieldContext

Form 保持高层业务组件，新增轻量 Field contract：

```ts
interface FieldContext {
  id: string
  name?: string
  disabled: ComputedRef<boolean>
  required: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
  controlProps: ComputedRef<Record<string, unknown>>
}
```

Input、Select、DatePicker、TreeSelect、AIForm 可以独立消费，不依赖完整 Form 实例。

## 10. DOM 状态与样式契约

统一公开状态：

```html
data-scope="combobox"
data-part="content"
data-state="open"
data-disabled
data-readonly
data-required
data-invalid
data-highlighted
data-selected
data-empty
data-orientation="horizontal"
data-side="bottom"
data-align="start"
```

规则：

- class 继续作为 Aheart 默认视觉实现。
- `data-*` 是面向用户主题、Motion、测试和 AI 的稳定契约。
- 同一状态在所有组件中必须使用同一名字。
- 每个组件文档列出 scope、parts、states、CSS Variables。

浮层统一 CSS Variables：

```css
--aheart-layer-index
--aheart-trigger-width
--aheart-available-width
--aheart-available-height
--aheart-transform-origin
--aheart-anchor-x
--aheart-anchor-y
```

## 11. ConfigProvider v2

目标接口：

```ts
interface AheartConfig {
  size?: AheartSize
  disabled?: boolean
  variant?: string
  locale?: AheartLocale
  theme?: AheartTheme

  dir?: 'ltr' | 'rtl'
  teleportTo?: string | HTMLElement
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement
  scrollBody?: boolean | ScrollBodyOptions
  useId?: () => string
  nonce?: string

  icons?: Partial<AheartIconSet>
  motion?: AheartMotionConfig
  zIndex?: Partial<AheartZIndexConfig>
}
```

解析优先级：

```text
组件显式 prop
→ 最近 ConfigProvider
→ trigger/target ownerDocument 推导
→ 默认配置
```

`teleportTo` 不能覆盖正确的 ownerDocument 推导；在 iframe 中默认应使用触发器所属文档，而不是主窗口 `document.body`。

## 12. 图标体系

### 12.1 发布策略

现有仓库继续叫 `aheart-icon`，公开包建议变更为：

```text
@aheart-ui/icons
```

发布到 npmjs public registry。旧包 `@wzfdhr/aheart-icon` 保留一个兼容周期，可以重新导出新包并给出弃用说明。

成为基础包依赖前必须满足：

- 无需 GitHub PAT 即可安装。
- npm package 有稳定 tag/release/provenance。
- 每个图标有独立 ESM/CJS/types 入口。
- `sideEffects: false`。
- `currentColor` 保持不变。
- 单图标 consumer fixture 证明不会打入全部图标。

### 12.2 图标入口

```text
@aheart-ui/icons
@aheart-ui/icons/search
@aheart-ui/icons/close
@aheart-ui/icons/heart-fill
@aheart-ui/icons/manifest
```

### 12.3 AIcon 适配层

解析优先级：

```text
显式 slot
→ component prop
→ ConfigProvider 语义图标覆盖
→ 内置语义图标默认值
→ 未知名称 warning
```

语义图标只覆盖基础组件真正需要的集合：

```text
close
check
loading
search
calendar
clock
chevronDown
chevronLeft
chevronRight
previousPage
nextPage
dragHandle
info
```

不把全部 518 个图标放入 `Record<string, Component>`。

### 12.4 用户用法

```vue
<script setup lang="ts">
import HeartFill from '@aheart-ui/icons/heart-fill'
</script>

<AIcon :component="HeartFill" size="24" />
```

全局覆盖：

```vue
<AConfigProvider
  :icons="{
    close: CustomClose,
    chevronDown: CustomArrow,
    loading: CustomLoader
  }"
>
  <App />
</AConfigProvider>
```

### 12.5 可访问性

- 装饰性图标默认 `aria-hidden="true"`。
- 有语义的独立图标必须允许 `title`、`aria-label` 或可见文本。
- Icon-only Button 必须拥有 accessible name。
- loading 图标必须和 `aria-busy`、状态文本配合，而不是单靠旋转图形。

## 13. Combobox 试点设计

### 13.1 Select 与 Combobox 的边界

- Select：从已知集合选择值，搜索是选择体验的辅助。
- Combobox：输入值和建议列表并存，可支持自由输入、异步建议和创建项。

两者共享 Collection、Floating、Presence、Portal、Dismiss、Field 和图标基础设施，但不强行合并为同一个组件。

### 13.2 高阶 API

```vue
<ACombobox
  v-model="value"
  v-model:input-value="query"
  :options="options"
  :loading="loading"
  allow-custom-value
  clearable
/>
```

### 13.3 Compound API

```vue
<Combobox.Root
  v-model="value"
  v-model:input-value="query"
>
  <Combobox.Label>成员</Combobox.Label>
  <Combobox.Anchor>
    <Combobox.Input />
    <Combobox.ClearTrigger />
    <Combobox.Trigger />
  </Combobox.Anchor>
  <Combobox.Portal>
    <Combobox.Positioner>
      <Combobox.Content>
        <Combobox.Empty />
        <Combobox.Item
          v-for="item in collection.items"
          :key="item.value"
          :item="item"
        >
          <Combobox.ItemText />
          <Combobox.ItemIndicator />
        </Combobox.Item>
      </Combobox.Content>
    </Combobox.Positioner>
  </Combobox.Portal>
</Combobox.Root>
```

### 13.4 Collection API

```ts
const collection = createListCollection({
  items,
  itemToValue: item => item.id,
  itemToString: item => item.name,
  isItemDisabled: item => item.disabled
})
```

### 13.5 首发能力

- controlled/uncontrolled value
- controlled/uncontrolled inputValue/open
- single selection
- custom object
- grouping
- async loading 状态
- clearable
- keyboard navigation
- Portal/Floating/Presence
- Form/Field integration
- SSR/iframe

以下能力作为后续增量，不阻塞第一版：

- multiple/tags
- creatable
- virtualizer
- remote pagination
- command menu recipe

## 14. Motion 包

### 14.1 技术边界

第一版使用：

- CSS animation/transition
- Web Animations API
- Vue lifecycle

不硬依赖 GSAP、Lottie、motion-v 或 `@vueuse/motion`。

### 14.2 Motion tokens

```css
--aheart-motion-duration-fast: 120ms;
--aheart-motion-duration-base: 180ms;
--aheart-motion-duration-slow: 240ms;
--aheart-motion-ease-standard: cubic-bezier(.2, 0, 0, 1);
--aheart-motion-ease-enter: cubic-bezier(0, 0, .2, 1);
--aheart-motion-ease-exit: cubic-bezier(.4, 0, 1, 1);
```

### 14.3 第一批导出

```text
Fade
Slide
Scale
Collapse
Stagger
AnimateNumber
Typewriter
Marquee
ReducedMotionProvider
```

### 14.4 基础组件接入

基础组件只暴露：

```ts
present
forceMount
unmountOnExit
onEnter
onAfterEnter
onLeave
onAfterLeave
motionPreset
```

Motion 包通过状态和 slot 接入，不接管组件业务状态。

## 15. AI 包

### 15.1 公共入口

```text
@aheart-ui/ai/bubble
@aheart-ui/ai/sender
@aheart-ui/ai/actions
@aheart-ui/ai/attachments
@aheart-ui/ai/sources
@aheart-ui/ai/prompts
@aheart-ui/ai/thought-chain
@aheart-ui/ai/process
@aheart-ui/ai/chat-panel
@aheart-ui/ai/form
@aheart-ui/ai/agent-workbench
@aheart-ui/ai/full
```

### 15.2 依赖规则

- AI package peer-depends on `aheart-ui` 和 Vue。
- Bubble、Sender、Form 不依赖 DND。
- v2 的 `@aheart-ui/ai` 根入口只导出不依赖 DND 的组件，不静态导入 AgentWorkbench。
- `@aheart-ui/ai/agent-workbench` 才引用 `@aheart-ui/dnd/sortable`。
- `@aheart-ui/dnd` 声明为 AI 包的 optional peer；使用 AgentWorkbench 前必须显式安装。
- `@aheart-ui/ai/full` 包含 AgentWorkbench，因此明确要求同时安装 `@aheart-ui/dnd`；缺少时构建应给出可操作的依赖错误。
- Motion 为 optional peer，缺少时使用基础 CSS 状态。
- UI 包不负责请求模型、保存会话、鉴权和 provider SDK。

迁移规则：v1.x 根入口继续导出 `AIAgentWorkbench`；v2 将其移到明确 subpath，并在迁移文档提供替代 import。这是有意的 major breaking change，用来保证普通 AI 消费者不解析 DND。

### 15.3 后续产品能力

在现有组件稳定后可增加：

- ToolCall
- ApprovalCard
- ArtifactPanel
- ModelSelector
- StreamText
- CitationList
- TokenUsage
- AgentStatus

所有能力必须保持 transport-agnostic，通过 props/emits/slots 接入业务。

## 16. 文档与信息架构

### 16.1 顶层导航

```text
开始
基础组件
组合组件
AI 产品
Motion
DND
Icons
工程与质量
```

### 16.2 指南

```text
介绍
安装
按需引入
自动导入 Resolver
全量安装
主题 Token
ConfigProvider
SSR / Nuxt
图标
动画与 reduced-motion
浏览器支持
迁移到 v2
```

### 16.3 组件页统一模板

1. 所属包与安装命令。
2. 推荐 import 和完整 import。
3. 基础用法。
4. Anatomy/Compound 用法。
5. 受控与非受控状态。
6. Props、Emits、Slots、Methods。
7. `data-scope/data-part/data-state`。
8. CSS Variables 和主题覆盖。
9. 默认图标与替换方法。
10. Presence 和 Motion。
11. 键盘矩阵和无障碍。
12. SSR、Teleport、iframe 注意事项。
13. Bundle 与依赖说明。
14. 迁移和弃用项。

### 16.4 AI 可读文档

在稳定文档元数据后增加：

- `llms.txt`
- 组件 JSON manifest
- API markdown endpoint
- MCP：list components、get example、get API、get styling guide

这属于生态增强，不阻塞 v2 基础发布。

## 17. 测试与质量门禁

### 17.1 单元与类型

- 组件行为测试。
- controlled/uncontrolled 状态矩阵。
- props/emits/slots 类型测试。
- export-contract 测试。
- manifest 与实际入口一致性测试。
- Primitive mergeProps/asChild 测试。
- Presence 中断和完成事件测试。

### 17.2 无障碍

- axe 自动化。
- WAI-ARIA role/attribute。
- accessible name。
- Tab、Shift+Tab、方向键、Home/End、Escape。
- focus trap 和 restore focus。
- reduced motion。

### 17.3 Consumer fixtures

```text
fixtures/consumers/
├─ base-button-root-import/
├─ base-button-subpath/
├─ base-modal/
├─ combobox-high-level/
├─ combobox-namespaced/
├─ ai-sender-only/
├─ ai-workbench/
├─ motion-fade/
├─ dnd-sortable/
├─ icon-search-only/
├─ full-plugin/
├─ cjs-require/
└─ ssr-nuxt-like/
```

每个 fixture 验证：

- tarball 安装成功。
- ESM/CJS/types/CSS 解析成功。
- 不依赖 workspace 源码。
- 不包含 `workspace:` 协议。
- SSR 不在导入时访问 window/document。
- bundle 模块图只包含允许依赖。

关键排除断言：

```text
Button 不包含 Table、DatePicker、AI、DND。
AISender 不包含 AgentWorkbench、DND。
Icon Search 不包含完整 518 图标。
Motion Fade 不包含 AI 和 DND。
```

### 17.4 Bundle budgets

先采集 v1 baseline，再冻结 v2 预算。CI 同时检查：

- gzip/brotli 大小。
- 模块清单。
- CSS 大小。
- 重复依赖。
- 完整库上限。

不能只检查入口文件大小，因为 shared chunk、CSS 和外部依赖会隐藏真实成本。

### 17.5 浏览器与视觉

- Chromium、Firefox、WebKit。
- 桌面与移动 H5。
- light/dark。
- reduced motion。
- iframe/ownerDocument。
- Teleport 到自定义容器。
- 嵌套 Modal/Popover/Select。
- SSR hydration。

视觉验收必须使用实际文档运行时，而不是只看源文件和截图生成脚本。

## 18. 版本与兼容策略

### 18.1 发布节奏

```text
1.1.x  新增稳定 subpath、manifest、Resolver、consumer fixtures；旧根入口行为不变
1.2.x  新图标适配层 opt-in、图标公共 npm 准备
2.0.0-beta 根入口与 /full 分离、组件 CSS 按需、默认 Aheart Icons、Compound、Motion
2.0.0-rc   全量迁移验证、文档和 consumer fixtures
2.0.0      稳定发布
```

### 18.2 兼容保留

- `import { Button } from 'aheart-ui'` 保留。
- 根默认 Vue Plugin 只在 v1.x 保留并标记为 legacy；v2 使用 `/full`，确保根 `index.ts` 不引用全量组件数组。
- `aheart-ui/style.css` 在 v2 指向全量兼容样式。
- `aheart-ui/es/*`、`aheart-ui/lib/*` 保留一个 major 周期，v3 删除；v2 tarball 可生成兼容 facade，但不再把旧构建目录作为主产物或提交到 Git。
- `AIcon name/component/slot` 保留。
- 旧 Lucide 名称保留 alias，一个 major 后再评估移除。
- `@aheart-ui/ai`、`@aheart-ui/dnd` 根入口保留；v2 AI 根入口不再导出 AgentWorkbench，替代入口为 `@aheart-ui/ai/agent-workbench`。

### 18.3 包版本

采用 Changesets 独立版本：

```text
aheart-ui@2.x
@aheart-ui/ai@2.x
@aheart-ui/dnd@1.x（没有破坏性变更时不强制升 major）
@aheart-ui/motion@1.x
@aheart-ui/icons@1.x
```

文档维护兼容矩阵，不要求所有领域包永远同版本。

### 18.4 弃用格式

每个弃用项必须记录：

```text
旧 API
替代 API
开始弃用版本
预计移除版本
是否有运行时 warning
迁移示例
```

## 19. 实施阶段

### Phase 0：RFC 与基线冻结

范围：

- 冻结包边界、入口命名、CSS 策略、图标策略和兼容规则。
- 生成现有组件、样式、bundle、依赖和测试基线。
- 明确每个现有组件的 package、subpath、style、status 和风险。

交付物：

- 本设计文档批准版。
- component manifest 初稿。
- API/兼容矩阵。
- bundle baseline。
- 风险清单。

验收：不修改运行时行为。

### Phase 1：按需发布基础设施

试点：Button、Modal、Select。

交付：

- `aheart-ui/button`、`/modal`、`/select`。
- `aheart-ui/full`。
- `theme.css`、组件 CSS、`full.css`。
- 自动 exports manifest。
- 仅覆盖 Button/Modal/Select 的 Resolver Preview；M7 再扩展并稳定为全生态 Resolver。
- root/subpath consumer fixtures。
- `main/module/types/exports/files/sideEffects` 与目标 `dist` 结构一致。
- 组件源码 CSS import 的迁移规则：运行时入口 style-free，CSS 通过逻辑 subpath 交付。

验收：

- ESM、CJS、types、CSS 全部可用。
- Button 不包含无关组件。
- v1.1 additive 发布保持旧根默认 Plugin 行为；此阶段的最小 bundle 强保证来自 `aheart-ui/button` 等 subpath。
- v2 beta 完成根入口与 `/full` 硬分离后，根 named import 才必须达到同样的最小 bundle 门禁。
- release contract 和 build determinism 更新。
- 本阶段继续使用现有 Lucide 兼容层，只验证按需链路；最终默认图标切换属于 Phase 2，并重新执行视觉和 bundle 回归。

### Phase 2：Aheart Icons 供应链

交付：

- `@aheart-ui/icons` 公共 npm 包。
- 单图标 exports 和类型。
- npm provenance、tag、release。
- AIcon adapter 和 ConfigProvider icons。

验收：

- 干净环境无需 GitHub PAT 安装。
- 单图标 bundle 不包含整库。
- 基础组件默认图标完成视觉回归。
- Lucide 兼容 alias 通过。

### Phase 3：Primitive 与 Combobox 垂直试点

为避免一次建设全部基础设施，拆成三个连续、可单独验收的切片。

#### Phase 3A：状态、Document 与 Presence

交付：

- useControllableState。
- useOwnerDocument/useStableId。
- Presence 升级。
- `<ACombobox>` 最小单选、输入和浮层闭环。

验收：controlled/uncontrolled、SSR hydration、iframe/custom Teleport、exit 完成后卸载。

#### Phase 3B：Primitive 与 Focus

交付：

- Primitive/Slot。
- FocusScope/RovingFocus。
- Combobox Trigger/Input/Item 的 `as/asChild` 和完整键盘行为。

验收：事件、ARIA、class、style、ref 不丢失；Tab/Arrow/Home/End 与 axe 通过。

#### Phase 3C：Layer、Collection 与 Namespaced

交付：

- DismissableLayer/LayerStack。
- Collection。
- `Combobox.Root` 与组件族 namespace。

验收：Escape 只关闭最上层，集合与选中状态一致，root/subpath/namespaced bundle 通过。

### Phase 4：浮层与 Dialog 内核迁移

顺序：

1. Popover/Tooltip/Dropdown。
2. Modal/Drawer。
3. Select/TreeSelect/Cascader。
4. DatePicker/TimePicker。

目标：复用 FloatingRoot、Portal、Presence、DismissableLayer、FocusScope 和 ownerDocument。

每次只迁移一个组件族，保留原 API 和独立浏览器验收。

### Phase 5：Motion 包

交付：

- Fade、Slide、Scale、Collapse、Stagger。
- motion tokens。
- ReducedMotionProvider。
- Modal/Popover/Combobox 示例。

验收：基础包不依赖 Motion；关闭 Motion 后交互完全可用。

### Phase 6：AI 与 DND 边界

交付：

- AI 每组件 subpath 和 CSS。
- Workbench 单独入口。
- DND sortable subpath。
- AI 根/full 兼容入口。

验收：AISender/AIBubble 不解析 DND；Workbench 行为和可访问性无回归。

### Phase 7：Resolver、Namespaced 与文档

交付：

- `aheart-ui/resolver`。
- 自动生成 `/constant`、`/namespaced`。
- 文档新信息架构。
- 每页 import/anatomy/state/style/a11y/SSR/bundle 模板。
- v2 迁移指南。

验收：文档代码全部从打包产物或 consumer fixture 验证，不允许只验证源码。

### Phase 8：v2 prerelease 与稳定发布

顺序：

1. 类型检查。
2. 包级单测。
3. export/release contract。
4. build determinism。
5. consumer fixtures。
6. docs build。
7. npm pack。
8. 定向 E2E。
9. 五浏览器矩阵。
10. 空目录 tarball 安装。
11. prerelease 用户验证。
12. stable 发布。

## 20. 风险与缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| 一次迁移全部组件 | 范围失控、回归难定位 | 先 Button/Modal/Select，再 Combobox 垂直切片 |
| CSS 顺序变化 | 视觉回归 | theme/component/full 三层与实际运行时截图 |
| 图标包仍需 PAT | 外部用户无法安装 | 公共 npm 是接入默认图标的前置门 |
| 全图标运行时 Map | tree-shaking 失效 | 仅语义图标 Map，完整图标走 subpath |
| asChild 合并错误 | 事件、ARIA、ref 丢失 | 单根限制、merge contract、专门测试 |
| Presence 只靠 timer | 动画截断或卸载过晚 | 监听 animation/transition end，timer 只兜底 |
| 全局 document | iframe/ShadowRoot 错误 | ownerDocument 推导和 Environment fallback |
| 多层 Escape 冲突 | 多个浮层同时关闭 | LayerStack，只有 topmost 响应 |
| root named import 仍带全量 CSS | 假按需 | 组件 CSS + module graph fixture |
| AI 根入口解析 DND | 非 Workbench 用户成本高 | Workbench subpath 与 optional peer |
| 文档、Resolver、exports 漂移 | 安装示例失真 | 单一 manifest 生成与完整性测试 |
| 构建目录退出 Git | 本地流程短期不适应 | v1.1 兼容期、docs source alias、tarball workflow |

## 21. 验收报告格式

每个 Phase 必须分别报告以下状态：

| 状态 | 含义 |
|---|---|
| 设计冻结 | API、范围、非目标和风险已批准 |
| 代码完成 | 目标代码和生成物已经实现 |
| 自动检查 | 单测、类型、契约、bundle、SSR 已通过 |
| 视觉检查 | 实际文档运行时、桌面和移动已检查 |
| 包验证 | npm pack 和干净消费项目已通过 |
| 合并状态 | PR 已审查并合并 |
| CI/部署 | 主线 CI 和 Pages 已通过 |
| 用户验收 | 用户明确接受该阶段结果 |

任一状态不能替代其他状态。尤其是：

- 测试通过不等于视觉接受。
- 本地通过不等于主线 CI。
- npm pack 成功不等于已发布。
- 提交 PR 不等于已合并。
- Pages 部署不等于用户验收。

## 22. 推荐的第一个实施闭环

第一个工作树只处理：

```text
Button + Modal + Select
→ component manifest
→ stable subpath exports
→ theme/component/full CSS
→ /full
→ consumer fixtures
→ release contract
→ bundle 模块图
```

该闭环不包含：

- 图标切换。
- Motion 包。
- AI 重构。
- 全组件迁移。
- Reka 式 Compound API。

本闭环继续保留 Lucide 兼容图标，只验证入口、CSS、types、bundle 和发布契约。Aheart Icons 切换后必须重新跑同一组 Button/Modal/Select 视觉与 bundle fixture。

原因：真实按需发布链是 Icons、Motion、AI 和 Combobox 的共同前置条件。如果这条链路不成立，继续扩展产品域只会制造更多无法验证的入口和样式。

完成第一个闭环后，第二个工作树再处理 Aheart Icons；第三个工作树处理 Primitive + Combobox。每一阶段都单独验证、审查和验收。

## 23. 参考项目的借鉴边界

### Ark UI

借鉴：

- Anatomy 文档。
- Compound 组件结构。
- 复杂场景 recipes。
- `data-scope/data-part`。
- AI MCP/LLM 文档思路。

不照搬：

- 多框架架构。
- 完全 Headless 产品定位。

参考：

- <https://ark-ui.com/docs/components/combobox>
- <https://ark-ui.com/docs/guides/composition>
- <https://ark-ui.com/docs/guides/animation>

### Reka UI

借鉴：

- Vue controlled/uncontrolled 契约。
- Primitive、Slot、`as/asChild`。
- Presence、FocusScope、RovingFocus。
- ConfigProvider runtime 配置。
- `/namespaced`、`/resolver`、`/constant`。
- PURE 标记和真实 bundle size 门禁。

不照搬：

- 完全无样式定位。
- 所有组件都拆成大量 parts。
- 把当前内部 ref/expose 细节直接复制为公共 API。

参考：

- <https://www.reka-ui.com/docs/overview/introduction>
- <https://www.reka-ui.com/docs/guides/controlled-state>
- <https://www.reka-ui.com/docs/utilities/primitive>
- <https://www.reka-ui.com/docs/utilities/presence>
- <https://www.reka-ui.com/docs/utilities/config-provider>
- <https://raw.githubusercontent.com/unovue/reka-ui/v2/packages/core/package.json>
- <https://raw.githubusercontent.com/unovue/reka-ui/v2/packages/core/.size-limit.json>

## 24. 最终决策摘要

1. `aheart-ui` 继续作为基础包。
2. AI、Motion、DND、Icons 保持领域包。
3. Resolver、Namespaced、Constant 放在基础包 subpath。
4. 先解决 JS + CSS + types + bundle 的真实按需。
5. `aheart-icon` 公共 npm 化是默认图标接入的前置条件。
6. `AIcon` 保持稳定适配层，不重新导出完整图标库。
7. 基础包保留 styled 默认体验，复杂组件才提供 Compound API。
8. 现有 Presence/Floating utilities 演进为统一 Primitive，不推倒重写。
9. Motion 只负责视觉预设，基础包负责正确的生命周期和无障碍。
10. AI Workbench 与 DND 建立明确 subpath 边界。
11. 单一 manifest 驱动 exports、Resolver、文档、质量矩阵和发布契约。
12. v2 以独立工作树、垂直切片和多门禁验收推进。
