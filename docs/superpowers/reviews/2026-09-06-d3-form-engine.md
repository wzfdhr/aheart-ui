# D3 Form 引擎验收记录

## 批准范围

用户已批准完整 D3 方案。包含嵌套字段路径、字段依赖、change/blur 策略、preserve、外部字段错误、异步生命周期、FormItem/control 协议及 AIForm 复用。Form.List 延后，不新增包或主要依赖。

分支 `codex/d3-form-engine` 基于 D2 候选 `ece7e836f3508fad6088ac0dd506260ce76c5db0`。D2 PR 为 #16，合并次序保持 D2 → D3。

## 开发实施

- 字符串 name 保持字面字段键；数组表达嵌套路径。路径编码区分数字和字符串，拒绝原型污染片段，删除数组项不移动其它索引。
- validateTrigger 默认 false；依赖实际值改变时独立触发全规则校验，同一批次去重。preserve 默认 true，卸载/改名按配置清理模型值。
- 校验结果绑定模型快照、字段版本和生命周期。过期公开校验结果带 outOfDate: true；过期提交不发出 finish/finishFailed，用户可重新提交。
- setFieldsErrors 保留服务端错误，值变化/reset/clear 后清理。迟到校验不能覆盖新错误。
- FormItem 保存注册路径快照，支持 reactive 数组原地改名；自动生成 control/label/help/error/extra ID，并保留显式属性。内部控件协议不增加公开 injection 导出。
- Input、Select、Picker、Upload、TreeSelect 绑定实际交互节点，合并用户描述，按接受后的 model 校验；弹层内部焦点转移不触发字段 blur。
- AIForm 组合公开 Form/FormItem，通过隔离模型快照和 schema 规则适配保留 V1 受控更新、必填布尔/范围、可见性/禁用、中文错误摘要与现有事件。

## 开发经理复审

- [x] 数组 name 原地修改的注册残留 P1 已修复并有 preserve=false 回归。
- [x] validateTrigger=false 的公共声明 P2 已修复。
- [x] 服务端错误可观察性、规则/模型/字段变更后的异步隔离、未注册依赖与批次去重通过复审。
- [x] 当前开发经理复审 P1=0、P2=0。

## 测试经理

- [x] Form 原有 39 项、引擎 20 项、FormItem 协议/SSR 4 项、控件集成 6 项通过。
- [x] Components 69 files / 1056 tests、DnD 44 tests、AI 66 tests、scripts 86 tests 通过。
- [x] 三包类型检查与生产构建通过。
- [x] D3 账户资料流程五浏览器通过：桌面/移动 Chromium、Firefox、桌面/移动 WebKit。
- [x] tarball 门禁通过（components 951 files、DnD 71、AI 111）。
- [ ] 完整浏览器与生成物确定性门禁完成。
- [x] 测试经理只读复审通过，未发现阻断 P1/P2，允许产品验收。

## 设计与产品验收

- [x] 账户邮箱服务端错误显示在实际输入控件旁，并通过 aria-invalid/describedby 关联。
- [x] 修改密码后确认字段依赖校验更新；修正服务端错误后再次提交成功。
- [x] 移除再添加地址字段，preserve=false 清理旧城市值。
- [ ] 最终桌面/移动截图与既有视觉回归复核。

证据由 e2e/form-engine.spec.ts 在每个浏览器项目输出 server-error.png / saved.png；CI 保留 test-results。实体 iOS Safari 验收仍独立于模拟 mobile WebKit。

## 远端交付

- [ ] D2 PR/主分门禁关闭。
- [ ] D3 PR 创建、CI 通过、审查记录保留。
- [ ] D3 合并 master，主分 CI 与 Pages 核实。
