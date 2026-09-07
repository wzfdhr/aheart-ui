# D3 Form 表单引擎：范围与 API 评审草案

状态：用户已回复“开始”，批准完整 D3 公共 API 与跨组件交互范围，进入实施。Form.List 延后。

## 分支与前置门禁

- D3 分支：`codex/d3-form-engine`，从 D2 候选 `ece7e836f3508fad6088ac0dd506260ce76c5db0` 建立。
- 当前远端 master 为 `f63df811e1e83aacc5bd3015c63b9f436d09a5ea`，包含 D1。
- D2 已推送但尚未确认 PR/CI/合并完成。D3 可以独立准备；合并仍须先完成 D2 门禁，并重新核对 D3 基线。

## 原始目标与现状

D3 原始路线图要求 FormItem 自动关联 control/help/error、控件接入校验状态、字段依赖与 change/blur 策略、嵌套路径和保留策略、过期异步结果隔离、服务端字段错误及提交恢复，并使 AIForm 复用核心 Form。

现有 Form 已有 validate/validateFields/resetFields/clearValidate、字段值读写、getFieldError/getFieldsError/scrollToField；存在字段校验序号和提交值快照。FormItem name 为 string，字段通过 model[name] 访问；未提供依赖/触发/保留/外部错误 API。AIForm 目前独立判断必填项。

## 推荐范围：完整 D3，Form.List 延后

保留已有 props/events 的含义，增加下列能力；不新增包或主要依赖，不开放内部 injection/helper，不在 D3 实施 Form.List 的动态数组操作 API。

### 1. 嵌套路径

- 新增 `FormNamePath = string | readonly (string | number)[]`，数组必须非空。
- FormItem `name` 接受 FormNamePath。
- string 保持字面字段键：`"user.email"` 仍访问同名顶层属性；`['user', 'email']` 才访问嵌套对象，避免破坏现有数据。
- 单字段实例方法接受 FormNamePath；批量方法接受路径列表，`['a', 'b']` 仍表示两个顶层字段，嵌套单字段使用 `[['user', 'email']]`。
- `FormValidationError.name`、validate 事件的 name 在嵌套字段时返回数组；既有字符串字段继续返回字符串。这会扩大公开类型，需要明确接受。
- Form.rules 的字符串键保持字面访问；嵌套规则先使用对应 FormItem.rules，不增加点路径规则语法。
- 内部路径编码区分数字与字符串，不用 join('.')。路径写入拒绝原型污染片段，不因字段卸载自动压缩数组索引。

### 2. 依赖、触发与保留

- Form/FormItem 新增 `validateTrigger: 'change' | 'blur' | Array<'change' | 'blur'> | false`；默认 false，保留当前提交/显式 validate 的行为。FormItem 覆盖 Form。
- FormRule 可选 validateTrigger，用于缩小规则触发范围；提交和显式 validate 始终校验全部规则。
- FormItem 新增 `dependencies: FormNamePath[]`。沿用现有值比较语义，依赖值发生有效变化时重新校验当前挂载字段；环和菱形依赖按一轮去重，校验本身不修改 model。
- Form/FormItem 新增 preserve，默认 true。卸载立即撤销注册、清理错误和迟到任务；默认保留值，false 才删除该路径的值。
- hidden 字段仍注册；真正卸载才应用 preserve。字段改名视为旧注册卸载、新注册挂载。

### 3. 外部错误与提交恢复

- 新增实例方法 `setFieldsErrors(fields: Array<{ name: FormNamePath; errors: string[] }>): void`。
- 服务端字段错误由应用显式映射；空数组清除。设置外部错误使旧异步结果失效，不能被迟到成功覆盖。
- 字段值真正变化、resetFields 或 clearValidate 后清理对应外部错误。未改字段的服务端错误保持有效并阻止 finish，直到显式清除。
- 不引入提交网络请求；应用继续通过既有 finish/finishFailed 处理保存、失败和重试。

### 4. 控件与无障碍协议

- FormItem 使用 SSR 稳定 ID 生成 label/control/help/error/extra 关联。
- 控件显式 id 优先；aria-describedby 合并并去重用户描述与当前存在的帮助/错误节点，避免引用已卸载元素。
- 使用内部 provide/inject 协议接入 Input、Select、单值/范围 Picker、Upload、TreeSelect；协议通知语义 change 与离开整个控件的 blur。
- 受控父层拒绝值请求不应把请求值视为已提交模型值；触发校验读取父层接受后的 model。
- Popup 内部焦点移动不算 blur；Upload 对文件输入/操作按钮提供可见的标签与错误关联。
- noStyle 不生成不可见 help/error 引用；多控件 FormItem 的默认关联必须有确定的首个主控件规则，复杂布局通过嵌套 FormItem 明确字段归属。

### 5. AIForm 复用

- 优先通过已有公开 Form/FormItem/实例校验能力复用核心规则执行，不从另一个包深导入内部源码。
- 保持 AIForm 当前 schema V1、受控 modelValue、submit/validation-error、可见性/禁用规则和业务文案。
- AIForm 向核心引擎传递已接受值的快照；更新继续通过 update:modelValue 请求，不允许核心实例 reset/set 方法直接修改父层 modelValue。条件隐藏或禁用字段不参加当前校验。
- 用适配规则保留 AIForm 的布尔必填、完整范围值等现有语义；不把 schema 可执行异步函数扩展混入本阶段。
- 若实现证明仅通过现有公开 Form 无法复用，再单独提出精确导出方案，不默认增加包或 exports。

## 验收门禁

1. 兼容性：原 Form 和 AIForm 套件、消费端类型、字符串字面路径行为保持通过。
2. 字段生命周期：改名、卸载、再次挂载、preserve、依赖循环、嵌套 reset，以及数字/字符串路径不会串字段。
3. 异步：新旧校验乱序、模型变化但未启动新校验、reset/clear/外部错误/卸载和提交重试均不接受过期结果。
4. 控件：change/blur、父层接受/拒绝、popup 焦点移动、实际输入节点 label/error 关联，并覆盖 SSR hydration。
5. 产品：跨字段密码确认、动态地址字段、服务端邮箱错误修正重试，以及 AIForm 同一规则结果。
6. 交付：开发经理复审 → 测试经理测试 → 设计审核 → 产品经理验收 → PR → CI → 按 D2、D3 顺序合并 master。P1/P2 必须为零。

## 评审选择

只读盘点已完成：表单引擎与控件/AIForm 两个子任务确认上述能力缺口。无需新依赖即可复用公开组件，但必须同步扩展 validate 事件运行时校验器，并覆盖受控 AIForm 适配。

- 推荐：接受上述新增 API 与控件接入范围，执行完整 D3，Form.List 延后。
- 缩小范围：仅执行内部异步可靠性和现有 API 的无障碍修复，新增公共 API 和 AIForm 迁移留待下一次专项评审；此方案不宣称完整 D3 完成。
