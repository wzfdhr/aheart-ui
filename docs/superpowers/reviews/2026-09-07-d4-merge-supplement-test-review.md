# D4 Select 合并补证独立测试报告

日期：2026-09-07
角色：独立测试经理
范围：冻结候选 `HEAD 4e546e3`，123 文件

## 候选完整性

- 执行前后指纹均为 `a6e6597e4f471bc277a5c7b7b88acf7aa85e3c66559258ab547289673c5da664`。
- 候选前后日志：[00-candidate-fingerprint-after.log](../evidence/d4-merge-supplement-independent/00-candidate-fingerprint-after.log)。
- 旧 C 全量 `449 passed / 127 skipped` 绑定旧 `1f7b2f...`，本报告不混用。

## 实际门禁

- Select 五文件全 suite：60/60 passed。[01-select-suite.log](../evidence/d4-merge-supplement-independent/01-select-suite.log)
- components typecheck：退出码 0。[02-typecheck.log](../evidence/d4-merge-supplement-independent/02-typecheck.log)
- 三包双构建 determinism：退出码 0。[03-build-determinism.log](../evidence/d4-merge-supplement-independent/03-build-determinism.log)
- release pack：components 971、dnd 71、ai 111。[04-release-pack.log](../evidence/d4-merge-supplement-independent/04-release-pack.log)
- 新 tarball SHA-256：`70cf1c26eecd6f44226734c0dce0e6c61e40c0bf7b032121f205dc774355e3a1`，与预期一致。[00-tarball-sha-after.log](../evidence/d4-merge-supplement-independent/00-tarball-sha-after.log)

## Consumer 补证

新 consumer 首次按任务指定命令执行时，4 个新候选场景全部通过，但旧对照阶段因指定路径 `docs/superpowers/evidence/d4-merge-supplement/old-lock.json` 不存在而退出码 1；未修改锁文件。[06-consumer.log](../evidence/d4-merge-supplement-independent/06-consumer.log)

随后使用现有只读旧锁 `docs/superpowers/evidence/d4-c/consumer/old-lock.json` 完成同等旧 tarball 对照：4/4 新场景、4 组 hydration、CJS、stable bytes/modules 均通过，stable 对照为 true。[consumer-results.json](../evidence/d4-merge-supplement-independent/consumer-results.json)、[08-consumer-stable-compare.log](../evidence/d4-merge-supplement-independent/08-consumer-stable-compare.log)。新 default-false JS gzip 为 60843，CSS gzip 为 21944。

## 五浏览器受影响 E2E

实际命令：`AHEART_E2E_PORT=5217 corepack pnpm exec playwright test e2e/d4-select-virtual.spec.ts --project=desktop --project=mobile --project=desktop-firefox --project=desktop-webkit --project=mobile-webkit --reporter=line --output=/tmp/aheart-d4-merge-supplement-independent`

结果：25/25 passed，退出码 0；docs build/preview 正常。覆盖宽度/字体 remeasure active 可见与 rowsValid、中部稳定 key 插删重排及 active fallback、no-results 恢复、tail/disabled/HomeEnd/dynamic scroll、iframe realm/unmount，以及末次 pageerror 捕获。[09-playwright.log](../evidence/d4-merge-supplement-independent/09-playwright.log)

## 结论与边界

- 技术 P1/P2：本次授权受影响范围未观察到。
- 本轮不扩展 Tree/TreeSelect/Cascader virtual、PageUp/PageDown、全面 hover、实体设备或产品 API/视觉放行。
- 指纹与 tarball 复算均一致；consumer 指定目录缺失 old-lock 是证据流程问题，已以既有只读旧锁完成对照并保留首次失败日志。
