# D4 内部候选完整门禁（实施记录，待独立复审）

本地检查点：`a5300e8`。未推送、未创建 PR、未合并。此前 iframe 指定证据 P2 产品裁定保持其原有适用范围；本报告不作完整 D4 放行。

| 门禁 | 实际命令 | 结果与边界 |
| --- | --- | --- |
| 全仓单测 | `corepack pnpm test` | Components 70文件1079项、DnD 44项、AI 66项通过；scripts首次85/86，旧浏览器清单断言未包含iframe套件 |
| 配置修复复测 | `node --test scripts/*.test.mjs` | 86/86通过；仅更新清单精确断言并要求iframe套件存在，无运行时改动 |
| 三包类型 | `corepack pnpm typecheck` | 全部通过 |
| 确定性双构建 | `corepack pnpm check:build-determinism` | 退出码0；两次完整三包构建哈希一致，产物与本地HEAD一致 |
| 文档生产构建 | E2E webServer 的 `corepack pnpm docs:build` | client/server bundle和页面渲染通过；保留已有大chunk告警 |
| 三包打包契约 | `corepack pnpm release:pack` | Components 955、DnD 71、AI 111文件，契约通过；不等于registry发布 |
| 完整既定E2E | `AHEART_E2E_PORT=5185 corepack pnpm exec playwright test --grep-invert 'same-origin iframe' --workers=4 --reporter=line --output=/tmp/aheart-d4-full-e2e` | 409 passed /127既有平台skip /0失败，4.1分钟。排除无变化且已独立验证的iframe专项15项；不把skip算通过 |

稳定日志：`docs/superpowers/evidence/d4-full-gates/` 中 `unit.log`（含原失败）、`scripts-fixed.log`、`typecheck.log`、`determinism.log`、`release-pack.log`、`e2e.log`。实际输出保留，不覆盖原失败记录。

后续真实浏览器基线暴露Select活动项不可见、20键跳40项两个内部问题，已修复并新增一次事件回归。新候选`709de18a183a09e76059c6ea184232b8f41163f4`、指纹`17de1fad1c17fdbcd9ff686812de6067316b626e93a35c5b506d6a24e1a285ad`，清单`docs/superpowers/evidence/d4-full-candidate.json`。上表完整门禁属于修复前检查点，新候选正在按影响范围重新独立复审与验证，不能直接把旧全量结果改标到新SHA。

性能夹具：`node scripts/d4-browser-performance.mjs --require-visible` 在新源码9场景通过；最终基线`docs/superpowers/evidence/d4-performance/baseline-2026-09-07T034506Z.json`，20键必须停Option00020且可见。开发模式单轮数据不等同生产包/移动性能。固定/动态高度、键盘、SSR方案见`docs/superpowers/specs/2026-09-07-d4-virtualization-options.md`。

公共API确认仍由产品经理任务收集用户回复，窗口化另行评审；未回复不构成批准。

## 新候选独立验证结果

按顺序完成独立开发复审→独立测试经理实际运行→必要设计复核，报告分别为 `2026-09-07-d4-select-keyboard-dev-review.md`、`2026-09-07-d4-select-keyboard-test-review.md`、`2026-09-07-d4-select-keyboard-design-review.md`。

新候选709de18：Components1080/1080、scripts86/86、typecheck、确定性双构建、docs build、三包pack、Select受影响浏览器14/14、真实Chromium严格基线9/9通过；前后指纹17de1fad…e1a285ad一致。日志 `docs/superpowers/evidence/d4-select-test/`。14项包含Select五浏览器iframe；TreeSelect/Cascader无运行时修改，不重复其已批准专项。

产品待裁定：本次新发现的Select重复键盘事件及活动项不可见修复；不将开发/测试技术P1/P2结论升级为产品关闭，不宣布完整D4完成。
