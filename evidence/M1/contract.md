# M1 v1.2 入口、样式与验证契约

2026-11-09。依据已生效 A1 和负责人 M0 Go；本轮实现前冻结，验证失败时不通过放宽预算消除失败。范围为基础包，Resolver/Icons/Primitive/AI/DND 拆分不在本轮。目标 minor 为 1.2.0；本地 pack 不代表 npm 发布。

| 入口 | JS / types | 样式 |
| --- | --- | --- |
| `aheart-ui/button` | default 与 named Button，ESM/CJS/types 同一组件 | 显式 theme.css + button/style.css；包含 Icon 视觉依赖 |
| `aheart-ui/modal` | default 与 named Modal | theme + modal/style.css；包含 Button/Icon/Skeleton 视觉依赖 |
| `aheart-ui/select` | default 与 named Select | theme + select/style.css；包含 Icon 和共享 floating 样式 |
| `aheart-ui/full` | default Plugin；模块求值不注册应用 | 显式 full.css |
| v1 根与 es/lib 深层入口 | 保留根 named/default Plugin，既有路径不删除 | style.css 与 full.css 内容一致 |

公共入口和样式依赖由 packages/components/build/entries.mjs 定义，构建 inputs 与 release contract 共同使用。运行时 JS 不引入真实 CSS；CSS 产物单独导出。根与 es/lib 两层 package.json 均用 sideEffects ["**/*.css"]，不能让消费者的打包器删掉显式 CSS。

## 数值预算与失败条件

- 统一 Vite/Vue/压缩参数，用同一个隔离 tarball 消费项目测量，保留模块 ID 和 renderedLength；禁止源码 alias 和 workspace symlink。
- Button/Modal/Select 子入口各自 JS gzip 必须小于显式 full Plugin；相对对应 root named 兼容基线的增加不得超过 max(512 bytes, 1%)。根 named 基线同时验证产物不保留全量插件；它不承诺停止解析根入口的所有静态 export。
- 每个组件 CSS 原始字节不得超过 full.css 的 25%；theme.css 不超过 full.css 的 5%；theme + 单组件 CSS 不超过 full.css 的 30%。不得包含 Table/AI/DND selector 或隐式完整样式。
- 三个子入口的模块图（包含被解析的模块）不得越过其声明的组件依赖；Button 不含 Table/Modal/Select/AI/DND；Modal 不含 Select/Table/AI/DND；Select 不含 Modal/Table/AI/DND。shared config、form control context、Floating UI、虚拟列表和 Lucide 当前兼容依赖允许保留，必须记录。
- 无 CSS 的 JS-only fixture 必须没有 CSS 资源；显式样式 fixture 的生产 CSS 不得被 tree shaking 丢弃；全量与旧 style.css 必须字节一致。
- public exports 的 ESM、CJS、types 与实际 tarball 路径一致；严格类型 skipLibCheck:false；不破坏根默认 Plugin。
- 独立消费 SSR/hydration、Modal/Select 键盘及 iframe/teleport、五浏览器检查成功率 100%，运行时错误/axe violations = 0；失败为 P1，保持 M1 未验收。
- 两项必需试点均需从 tarball 安装，clean-consumer 采用新 subpath，ai-review-gate 可保留旧根入口以证明无业务重写兼容；可选 Todo 继续作为回归。

M1 Gate 以实际记录的 E2/E3/E4 为准。未经负责人确认不标为 Accepted；本次 M0 确认不授权 M1 合并、部署或 npm 发布。

2026-11-10：负责人已认可本 M1 候选及契约，并授权 #41 合并与文档站更新；主线 CI/Pages 通过。完整依据见 [阶段验收记录](decision-log.md)。冻结的入口、依赖和数值预算保持原值。
