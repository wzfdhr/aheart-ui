# D8 AIForm / tool summary / SSR RED

日期：2026-09-09

## 范围

本 RED 由独立测试作者新增，覆盖 D8 规格中的 AIForm 规则编译、严格格式、跨字段比较、异步校验生命周期、隐藏字段 preserve、公开 Form API、错误摘要与焦点、AIToolCallDisplay 安全投影及 checkpoint 清旧、Workbench SSR 确定性/唯一 ID/hydration。

测试文件：`packages/ai/src/__tests__/d8-form-tool-ssr.test.ts`

约束：没有添加 `skip`、`only`、`force` 或测试超时；没有修改生产代码、既有测试或其他 evidence 文件。

## 真实 RED

运行命令：

```text
corepack pnpm --filter @aheart-ui/ai test -- src/__tests__/d8-form-tool-ssr.test.ts
```

结果：未通过（RED），Vitest 收集并运行 14 个测试，其中 13 个失败、1 个通过；退出码为 1。当前基线尚未实现 D8 AIForm rules/validators/preserve/public methods、结构化工具摘要投影及 D8 SSR instance scope；本文件故意先表达完整行为，不以条件分支掩盖缺口。

复核后重跑仍为 `14 tests | 13 failed`；SSR 唯一性断言现在只读取带空白属性边界的真实 `id="…"`（不会把 `data-task-id`/`data-artifact-id` 误算为 ID），并额外校验所有 `aria-labelledby` 引用均指向真实 ID。structured toolCall 测试明确断言 legacy `content` 不渲染；hydrate 测试在断言后执行 `app.unmount()` 并清空 host。实现完成后，SSR 唯一性项应按该修正断言重新取得 GREEN。

## 修正后复测记录

在 D8 实现代理已同步生产实现后，使用上述修正后的测试再次运行同一命令，结果为：

```text
Test Files  1 passed (1)
Tests  14 passed (14)
```

随后修正独立测试数据：错误摘要/焦点用例的 `enabled` 字段改为与布尔模型匹配的 `switch` 类型，保留“首个可见启用错误”语义。修正后重跑仍为 `14 passed (14)`，stderr 无 Vue prop type warning。

这不改写本文件记录的初始真实 RED；它证明修正后的 SSR 选择器不再误报 `data-*` 属性，且当前实现已通过该独立测试文件。

## 开发经理补充契约 RED

在开发经理发现实现缺口后，本文件追加了 10 个行为断言，覆盖：禁用字段跳过全部规则、core Form 作为唯一校验引擎、compare 自动依赖与重验、异步 validator 的多规则/空值/生命周期 Abort、受控 reset 与合并 preserve 删除、字段与规则组合安全、缺失 validator schema-error、Agent task toolCall 安全投影，以及无 Vue warning。

追加测试后的真实运行结果：

```text
❯ src/__tests__/d8-form-tool-ssr.test.ts (24 tests | 8 failed)
Tests  8 failed | 16 passed (24)
```

失败集中暴露当前实现仍缺少禁用规则跳过、多规则独立 Abort、依赖声明与重验、reset 清错、严格字段/rule 组合验证、缺失 validator schema-error、Agent task toolCall 投影等能力；没有新增 `skip`、`only`、`force` 或测试超时。追加测试运行期间未出现 Vue warning。

## Teleport hydration 复核追加

hydration 用例已强化为携带最小 `AITransport` 的 Workbench SSR 应用，并在 detached host 上完成 hydrate 后等待 `nextTick`/`flushPromises`，切换执行 Tab、打开 Drawer，使 ChatPanel/Teleport/Drawer target refs 的客户端路径参与；同时独立捕获并恢复 `console.warn` 与 `console.error`，断言二者均为空，最后卸载 app 并清空 host。原有 SSR 确定性与真实 `id`/`aria-labelledby` 断言未放宽。

强化后的当前实现复测为 `24 tests | 1 failed | 23 passed`：hydration/Teleport 用例捕获到 `Unhandled error during execution of component update` 的 Vue warning，并在客户端 Teleport 移动阶段捕获 `Cannot read properties of null (reading 'insertBefore')`；零 warning/error 断言因此保留真实 RED，其余测试结果未改变。

## 开发经理二审精确反例 RED

再次追加受控 reset 提交权威性、单轮 core 校验、连续 async run/共享 signal/相关依赖取消、独立 schema 组合错误及有限数字/规范日期时间 ordered compare 反例。当前实现复测结果：

```text
❯ src/__tests__/d8-form-tool-ssr.test.ts (35 tests | 10 failed)
Tests  10 failed | 25 passed (35)
```

失败明确包含：reset 后 core 仍提交冻结初始值、range/format/compare 产生重复 validation-error、连续 validate 未 abort 首个 async run、字段自身值变化未取消自身 validator、依赖变化未只取消相关字段、schema 尚未拒绝 field/rule 不兼容组合、非法 ordered compare 未被 schema 拒绝，以及非法日期 ordered compare 未产生错误。async 反例已明确区分字段自身值变化与无关字段/依赖变化。未新增 `skip`、`only`、`force` 或测试超时。

## async 语义裁决后的复测

将反例修正为：字段自身值变化必须取消自身 validator；随后重新 validate 生成新的 `other` signal；依赖变化只取消 `name` 相关 signal，新的 `other` signal 保持有效。复测同一文件结果：

```text
Test Files  1 passed (1)
Tests  35 passed (35)
```

本次 GREEN 反映实现代理已同步修复；此前 `35 tests | 10 failed | 25 passed` 的 RED 记录仍保留，未被覆盖。

## 旧测试文案迁移

`packages/ai/src/__tests__/form.test.ts` 中唯一仍断言旧摘要标题“请完成 N 个必填项”的断言已迁移为 D8 契约“请解决 N 个校验问题”。数量、错误项、焦点及 submit 失败语义断言均保持不变；其他旧必填错误明细文案未改动。

迁移后联合复测：

```text
✓ form.test.ts (21 tests)
✓ d8-form-tool-ssr.test.ts (35 tests)
Test Files  2 passed (2)
Tests  56 passed (56)
```

## 开发经理第三轮精确反例 RED

追加了 async submit→reset 的迟到结果隔离、server error reset 清理与父拒绝 reset 权威值、date/time canonical ordered compare、number/非文本 format 组合，以及 `preserve:false` 父拒绝/接受 tombstone 与 defaultValue 复现反例。联合复测结果：

```text
form.test.ts                 21 passed
d8-form-tool-ssr.test.ts     44 tests | 9 failed | 35 passed
总计                         65 tests | 9 failed | 56 passed
```

失败暴露当前实现仍会让 reset 后迟到 async 结果提交、保留旧 server error、canonical date 类型错误未阻断、format/schema 类型组合未拒绝，以及 preserve 删除后 defaultValue 状态不符合父拒绝/tombstone 契约。未新增 `skip`、`only`、`force` 或测试超时。

随后将 preserve 反例明确为“父拒绝时保留显式 `advanced: DEFAULT`，父接受后才删除并 tombstone”，避免把父状态变更与候选拒绝混为一谈。修正后联合复测为：

```text
form.test.ts                 21 passed
d8-form-tool-ssr.test.ts     44 tests | 8 failed | 36 passed
总计                         65 tests | 8 failed | 57 passed
```

preserve 反例现已通过；其余失败仍是本轮要求覆盖的生产缺口。

## 开发经理第四轮精确反例 RED

追加了初始 model 仅含 `show` 的 preserve 拒绝/接受路径、`rule.kind` 为合法 JSON 字符串 `toString`/`__proto__` 的原型链安全验证，以及 `date-range + format:date`、`time-range + format:time` 的独立 schema 反例。联合复测：

```text
form.test.ts                 21 passed
d8-form-tool-ssr.test.ts     49 tests | 5 failed | 44 passed
总计                         70 tests | 5 failed | 65 passed
```

失败对应：model 仅含 show 时父拒绝删除后 DEFAULT 未恢复、原型链 rule kind 会抛出 `allowed.has is not a function`、以及两个 range format 组合尚未被 schema 拒绝。每项 schema 反例独立执行，未新增 `skip`、`only`、`force` 或测试超时。

## 开发经理第五轮 P2 反例 RED

强化 preserve 路径：父拒绝删除后再修改无关 `y` 字段仍须保留 `DEFAULT`，父接受删除 candidate 后立即 submit 不得带回被删字段或默认值。另增加 validator `constructor`/原型继承名、own function 与 own 非函数的 schema/error 反例。

联合复测：

```text
form.test.ts                 21 passed
d8-form-tool-ssr.test.ts     52 tests | 4 failed | 48 passed
总计                         73 tests | 4 failed | 69 passed
```

失败对应 preserve 无关字段后的默认值保留、默认/原型 validator 名及 own 非函数未进入 schema-error；own function validator 路径通过。未新增 `skip`、`only`、`force` 或测试超时。

## 开发经理第六轮唯一 P2 RED

新增浅克隆等值 candidate 接受路径：父先拒绝删除并修改无关 `y`，再以 `{ ...candidate }` 新对象接受删除，立即重新显示并 submit，验证 deleted/default 字段不复活。

当前联合复测：

```text
form.test.ts                 21 passed
d8-form-tool-ssr.test.ts     53 tests | 1 failed | 52 passed
总计                         74 tests | 1 failed | 73 passed
```

唯一失败为浅克隆 candidate 被接受后 submit 仍复带 `advanced: DEFAULT`，证明 tombstone 尚未对等值新对象响应。

关键原始结果摘要：

```text
❯ src/__tests__/d8-form-tool-ssr.test.ts (14 tests | 13 failed)
Tests  13 failed | 1 passed (14)
```

主要缺口类别：

- 规则白名单仍拒绝 `rules`、`dependencies`、`preserve`，且表单只执行 required 校验；number/length/range、email/http(s)、date/time、compare 与 async registry 未接入。
- AIForm 尚未暴露 `validate`、`resetFields`、`clearValidate`、`setFieldsErrors`，也没有异步 AbortSignal/stale/reset/schema/unmount 生命周期仲裁。
- 隐藏字段仍没有 V1 保留提交与 `preserve:false` 的受控候选语义。
- 错误摘要仍是必填项专用文案，未覆盖跨字段/异步/服务端错误及首个可见启用字段焦点。
- `AIMessage.toolCall` / AIToolCallDisplay 安全白名单、checkpoint 缺省清旧尚未实现。
- Workbench 尚未提供 D8 要求的 SSR 稳定 instance scope；两实例唯一 ID 与 hydrate 零 warning 证据尚未成立。

## 退出条件

实现代理完成后，必须在同一测试文件上取得 GREEN；随后由独立测试经理复跑 AI 包单测、typecheck、SSR/hydration 与五浏览器门禁，并核对无新增 skip。
