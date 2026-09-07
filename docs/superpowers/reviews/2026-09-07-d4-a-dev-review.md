# D4-A 独立开发经理复审

## 结论

在冻结候选 `a17a0b4`（指纹 `8236908b3e9af4da35b091ef25450031669423298bdc3226fb9378799ecc6242`）范围内，未发现可确认的技术 P1/P2 缺陷。该结论仅覆盖已批准的 Tree、TreeSelect、Cascader 公共契约，不代替产品批准，也不扩展到性能虚拟化方案。

## 复审范围

- Tree：controlled expanded/selected/checked 拒绝保持、disabled 祖先/后代边界、`checkStrictly` 默认 true 与 false 联动/half-checked、lazy `void`/empty、取消、重试和迟到结果。
- TreeSelect：treeCheckable 与严格/联动模式、受控值拒绝、disabled 行为、搜索时基于完整逻辑树计算勾选，以及私有 loader/index 共享模型。
- Cascader：受控 open/value、disabled 关闭与清理、lazy pending/取消/替换分支/迟到结果、空结果和旧的一参 `loadData(option)` 回调兼容；新增上下文仅作为第二参数，旧回调在 TypeScript 函数参数兼容规则下仍可使用。
- 生成产物与候选清单：由候选指纹文件覆盖，未发现超出批准范围的运行时源码变更。

## 实际验证结果

候选冻结前后由主线记录的命令结果：

- `corepack pnpm@9.15.4` 全仓 tests：components `1102`、dnd `44`、ai `66`、scripts `86`，通过。
- 三包 `typecheck` 与 `build`，通过。
- 初轮新增 D4 E2E 五浏览器，25 项通过。
- `node scripts/d4-candidate-fingerprint.mjs` 复算与人工比对，匹配冻结指纹 `8236908b…ecc6242`。

## 未覆盖与跟进

- 候选 `a17a0b4` 后的 Cascader async-focus 捕获版本需要测试经理重新执行对应 E2E；这是验证缺口，不足以在本次只读复审中判定为缺陷。
- 未执行产品层视觉/交互批准、发布验收、移动物理设备验收或虚拟化性能验收。
- 未对未批准的公开 API 扩展、SSR hydration 及跨文档性能作额外承诺。

复审结论：技术门禁可进入下一审批状态；保留上述 E2E 复验作为独立测试门禁。

## A 续审：retry 焦点修复

续审仅覆盖 `a17a0b4..829531b` 的 5 个文件 delta：`tree.vue` 源码及其 es/lib 生成物、Tree lazy 单测、D4 selection E2E。修复将 retry 委派到 `retryNode`，先拒绝 disabled 节点，再启动 `loader.load(key, true)`，并在下一 tick 将焦点恢复到所属 treeitem；单测覆盖 retry 按钮获得焦点后点击、错误按钮移除、treeitem 恢复焦点及 loading 状态，E2E 改为键盘 Enter 并断言 treeitem focused。

续审未发现新的技术 P1/P2。续审候选绑定：commit `829531b`，指纹 `8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`，清单 `docs/superpowers/evidence/d4-a/final-candidate.json`。记录中的全量 `434 passed / 127 skipped` 属于前一候选验证；最终候选的影响范围重测仍由测试经理负责，产品批准与发布验收仍未覆盖。
