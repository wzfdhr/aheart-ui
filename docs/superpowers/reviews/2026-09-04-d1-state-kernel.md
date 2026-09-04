# D1 组件状态内核验收记录

## 范围

- 新增内部 `useControllableState`、`useStableId`、`useAsyncTask`、`useCollection`、`useRovingFocus`。
- 首批迁移 Select、Cascader、TreeSelect、DatePicker/DateRangePicker、TimePicker/TimeRangePicker、Table、Upload。
- `default*` 只用于初始化；受控父组件是唯一事实源，拒绝更新时不得乐观漂移。

不包含公开 API/类型导出、D2 浮层栈、Table 数据模式/缺失 rowKey 策略、虚拟化、DnD 包或 AI 包改造。

## 开发实施

- `useControllableState` 支持运行时接管/释放控制、显式 `undefined` 受控值、函数更新、`Object.is` 去重及必要的强制通知。
- `useStableId` 基于 Vue `useId`，生成 CSS 安全、SSR 稳定的内部 ID，并保留显式 ID 覆盖。
- `useAsyncTask` 处理 abort、请求版本、迟到成功/失败、错误恢复和卸载清理。
- `useCollection` 管理稳定 key、注册顺序、可见/禁用状态；`useRovingFocus` 统一方向键、Home/End、循环与禁用跳过。
- 各迁移组件继续使用原 props/events/types，状态桥接改由内部 helper 管理。

## 开发经理复审

- [x] helper 不从公共入口导出，未改变包边界或主要依赖。
- [x] 受控/非受控切换、显式 undefined、默认值初始化语义一致。
- [x] Picker 草稿/确认、Table 选择/展开/分页、Upload 迟到回调语义未回退。
- [x] source 与 es/lib 生成产物一致，diff 无无关漂移。

## 测试经理测试

- [x] 五个 helper 契约测试通过。
- [x] 迁移组件专项与 SSR 测试通过。
- [x] 全量 unit、typecheck、构建确定性、docs build、三包 tarball 通过。
- [x] 关键生产 E2E 与跨浏览器 R1 冒烟通过（Desktop WebKit R1 8/8）。
- [ ] GitHub PR CI 与 master CI 全绿。

## 设计审核

- [x] 无 CSS、视觉 token、用户文案或布局变化。
- [x] Select、Picker、Table、Upload 关键页面截图无未解释差异（QG4 desktop 14 passed / 3 skipped）。
- [x] 键盘焦点、ARIA ID 与父拒绝更新的可观察行为保持一致。

## 产品经理最终验收

- [x] 非受控用户操作后，父层改变 `default*` 不覆盖当前值。
- [x] 受控父层拒绝 value/open/selection/page 更新时，界面不漂移。
- [x] 父层在挂载后接管受控状态时，界面立即以父层值为准。
- [ ] P1/P2 为零，PR 留存完成，合并 master 后远端 CI 绿色。

## GitHub 留存

- 分支：`codex/d1-state-kernel`
- PR：待创建
- 合并提交：待完成
- master CI：待完成
