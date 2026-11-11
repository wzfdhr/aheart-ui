# M2 Combobox 与浮层迁移本地验证

基线为已验收 M1 的 `a87bd74`，开发分支为 `codex/m2-overlays`。组件示例见 [Combobox 输入选择框](../../../docs/components/combobox.md)。

| 批次 | 实现 | 验证 |
| --- | --- | --- |
| Combobox | 新增根入口、按需入口和独立 CSS。复用浮层定位、退出状态、Esc 派发及选项遍历。 | Chromium 与 WebKit 的桌面和移动项目以及桌面 Firefox 覆盖了筛选、禁用项、单选、Esc、Tab 和 iframe 卸载。Chromium 桌面示例通过 axe。单测覆盖受控值拒绝更新和自定义容器清理。 |
| Popover / Tooltip / Dropdown | 共用锚定浮层的定位、Teleport 与关闭注册。默认容器使用触发器所属文档。 | 113 项组件与浮层单测通过。生产示例验证定位、动画、嵌套 Esc、悬停、点击和外部点击关闭。 |
| Modal / Drawer | 共用浮层注册、层级、滚动锁和触发器焦点记录与恢复。 | 127 项单测通过。生产示例覆盖嵌套层级、逐层关闭、滚动锁、焦点恢复和退出动画。打包后的 clean-consumer 在 Chromium 与 WebKit 通过 M1 原生 Tab 回归。 |
| Select 族 | Select、TreeSelect、Cascader 接入锚定浮层。 | 259 项单测和 56 项定向浏览器用例通过，覆盖虚拟列表、筛选恢复、iframe 归属、Esc、焦点恢复和 SPA 卸载。 |
| Picker 族 | 日期和时间的单值、范围选择器接入锚定浮层。 | 159 项单测通过。Picker 相关浏览器运行通过 54 项，5 项按既有视口条件跳过。覆盖确认提交、草稿取消、焦点和移动布局。 |

- 三个包全量单测通过 1,775 项。类型检查、三个包的构建、文档生产构建以及 `git diff --check` 通过。
- 浮层最终浏览器回归通过 29 项，文档与 Combobox 最终回归通过 10 项。收尾复跑 Combobox 和 Select 族 iframe 用例，25 项全部通过。浏览器运行包含 Chromium、Firefox 和 WebKit，移动项目使用设备模拟。
- 与 M1 比较，17 个重新生成的既有组件 ESM 声明文件只有声明行顺序变化。
- 首轮 Node 脚本测试通过 248 项。补齐 Combobox 的质量矩阵、文档入口及浏览器配置登记，并清理新工作树文档的 AppleDouble 元数据后，三套受影响脚本定向重跑通过 20 项。
- 本地 tarball 的发布契约、ESM/CJS、SSR、模块图和显式 CSS 检查通过。Vue 3.5.38 和 3.5.44 的打包消费端严格类型检查通过。三包重新构建后的 tarball 与验证输入逐字节一致。
- clean-consumer 在 Chromium 和 WebKit 通过，ai-review-gate 在 Chromium 通过。两项消费端检查在独立输出目录重跑，避免 Playwright 清理测试输出目录时覆盖结果。
- 原生 Computer Use 超时后，用 cua-driver 在隔离 Chrome 窗口确认 `sh` 筛选显示上海和深圳。完整交互路径由浏览器自动化覆盖。

交付状态为本地实现与验证完成，待评审。

## 提交前自审

- 对照 M1 核查现有组件 API。34 个重生成的 ESM/CJS 组件声明文件仅调整了行顺序，公开组件入口及样式路径继续通过打包契约校验。
- 修复 Esc 后延迟回焦抢走新焦点的情况，并保留 Modal 和 Drawer 在关闭期间由应用明确交接的焦点。补齐两条定时回焦回归测试。
- Combobox 将带修饰键的按键交给输入框处理。新增用例验证 Shift+方向键保留原生行为。
- 修复前新增的 3 个回归用例均复现问题。修复后组件包 1,499 项测试通过，分支覆盖率为 86.79%，三个包的类型检查通过。
- 生产文档定向浏览器回归通过 84 项，5 项按项目条件跳过。范围包含 Combobox、iframe 中的选择器、嵌套浮层、原生焦点和 Picker 的提交与取消。
