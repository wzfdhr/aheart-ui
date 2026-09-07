# D4-B 隔离 consumer 独立测试报告

日期：2026-09-07
角色：独立测试经理
范围：`docs/superpowers/experiments/d4-b-consumer/`，冻结 manifest `docs/superpowers/evidence/d4-b/fixture-candidate.json`

## 冻结与完整性

- A 核心候选复算后保持：`8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`。
- B 夹具 manifest：10 文件，指定 fixture 指纹 `622be79440a47e4d1bafeef428874df364675a518ea2bf1383421f379a29a0ef`。
- 10 个夹具逐文件 SHA-256 与 manifest 一致。
- `corepack pnpm --dir packages/components pack --pack-destination /tmp/aheart-d4-b-reproduce.3idcIl` 成功，tarball SHA-256 为 `378f59655efbaa9a4416bee112f6668c89353ba47147093e6461a9a24aaa703f`，与 manifest 一致。
- 临时目录：`/private/tmp/aheart-d4-b-reproduce.3idcIl`。
- 核心后指纹：[00-core-fingerprint-after.log](../evidence/d4-b-independent/00-core-fingerprint-after.log)；夹具复核：[00-fixture-fingerprint-after.log](../evidence/d4-b-independent/00-fixture-fingerprint-after.log)。

## 实际执行结果

| 步骤 | 实际命令 | 结果 | 日志 |
|---|---|---|---|
| pack | `corepack pnpm --dir packages/components pack --pack-destination /tmp/aheart-d4-b-reproduce.3idcIl` | 退出码 0，tarball 与 manifest 字节指纹一致 | [01-pack.log](../evidence/d4-b-independent/01-pack.log) |
| 临时依赖安装 | `npm ci --ignore-scripts --no-audit --no-fund` | 退出码 1，阻断后续 engine/measure | [02-npm-ci.log](../evidence/d4-b-independent/02-npm-ci.log) |
| engine-size | 未执行：npm ci 未通过 | 无 JSON | — |
| measure | 未执行：npm ci 未通过 | 无 JSON/PNG | — |

## 阻断证据

`npm ci` 报告 package.json/package-lock.json 不同步，缺失 `@playwright/test`、`@tanstack/vue-virtual`、Vue、Vite、打包的 `aheart-ui` 及其依赖等大量 lock entries。复制到 README 要求的新随机临时目录后，锁内 package location 仍指向原始路径 `../../private/tmp/aheart-d4-virtual-consumer.T7xOU8/…`，因此 npm 11.13 无法进行 clean install。没有修改 lock、没有使用 `npm install`、没有用 symlink 或 `--force` 绕过。

这是隔离夹具独立复现的 P1 测试阻断，不判定为 Aheart 核心运行时缺陷；在 npm clean install 可复现前，不得把开发复审或旧目录已有结果当作本轮独立 engine/measure 结果。

## 覆盖边界

因 clean install 阻断，本轮没有独立证明：production ESM/CJS/SSR/hydration、engine-size tree-shaking、disabled engine module 保留、10k fixed/dynamic active、跳过 disabled、Home/End、48→80 ResizeObserver、heap/timing 或截图。

即使后续安装恢复，README 已声明本夹具仍不代表真实 Aheart Select/Tree/TreeSelect/Cascader 性能收益；custom list、Aheart 单 option smoke、baseline/disabled 均是隔离构建口径，不是实际组件门禁。未覆盖真实组件集成、冷/热 popup、filter、Firefox/WebKit/mobile/iframe、统计性能、完整无障碍和产品 API 放行。

## 分级与结论

- 技术 P1：1 项，B 夹具 `npm ci` 在新临时目录不可复现，阻断独立复现完成标准。
- 技术 P2：未评估；engine/measure 未运行，不虚构性能或内存结论。
- 产品放行：不作产品裁定。

结论：夹具源码与 tarball 指纹完整、A 核心指纹未变化；但本轮不能宣称 B 隔离 engine/measure 通过。需要先修复或重新生成可在新临时目录执行的 package-lock，再重新进行独立安装和全部 engine/measure 验收。

## 修正版 fixture 独立续验

开发续审后的 10 文件 manifest 更新为 `21f3b0b4bdf200d0bee256f8ab684e74e7c40515dca3710136a3c3f80a3aea61`；`package-lock.json` SHA-256 为 `1af2e3a957e6edd429a0198ae8392c331b2544c7243392f7bda70470fa76f0aa`。原失败报告和日志保留不覆盖。

全新临时目录：`/private/tmp/aheart-d4-b-reproduce-fixed.MBV6Re`。实际复验结果：

- `corepack pnpm --dir packages/components pack --pack-destination /tmp/aheart-d4-b-reproduce-fixed.MBV6Re`：退出码 0；tarball SHA-256 `378f59655efbaa9a4416bee112f6668c89353ba47147093e6461a9a24aaa703f` 与 manifest 一致。[01-pack.log](../evidence/d4-b-independent-success/01-pack.log)
- `npm ci --ignore-scripts --no-audit --no-fund`：退出码 0；安装在临时目录完成，`node_modules/aheart-ui` 非 symlink。[02-npm-ci.log](../evidence/d4-b-independent-success/02-npm-ci.log)
- `node engine-size.mjs`：退出码 0；[03-engine-size.log](../evidence/d4-b-independent-success/03-engine-size.log)、[engine-sizes.json](../evidence/d4-b-independent-success/engine-sizes.json)。
- `node measure.mjs`：退出码 0；[04-measure.log](../evidence/d4-b-independent-success/04-measure.log)、[results.json](../evidence/d4-b-independent-success/results.json)。

独立结果与既有稳定记录的 bytes/moduleSets 完全一致：baseline 与 unused JS/CSS 字节相同且 unused engine modules 为空；disabled/virtual 均保留相同 TanStack engine modules；engine-only ESM 为 raw 23060、gzip 6970、Brotli 6334。CJS import、CJS SSR、Vue SSR/hydration 错误检查通过；Chromium `149.0.7827.55` 下 fixed 12 行、dynamic 11 行，20 次 ArrowDown active 非禁用，End 到 `virtual-row-9999`、Home 回首行，动态 48→80 行高和截图均通过。截图：[production-fixed.png](../evidence/d4-b-independent-success/production-fixed.png)、[production-dynamic.png](../evidence/d4-b-independent-success/production-dynamic.png)。

本次修正版续验关闭此前由 lock portability 造成的技术 P1。技术 P2 未观察到，但结论仍严格限定为隔离 consumer 的 ESM/CJS/SSR、tree-shaking 与 custom listbox 机制；不声称真实 Aheart Select/Tree/TreeSelect/Cascader 性能收益，不作真实组件集成、统计加速、内存泄漏、跨浏览器/移动/iframe 或产品 API 放行结论。

## 修正版续验后指纹复算

- B 10 文件逐文件实际复算：`allFilesMatch: true`；manifest 指纹为 `21f3b0b4bdf200d0bee256f8ab684e74e7c40515dca3710136a3c3f80a3aea61`。
- B tarball 实际复算：期望与实际均为 `378f59655efbaa9a4416bee112f6668c89353ba47147093e6461a9a24aaa703f`。
- A 90 文件候选实际复算：期望与实际均为 `8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`。
- 续验后复算日志：[06-fingerprint-fixture-after.log](../evidence/d4-b-independent-success/06-fingerprint-fixture-after.log)、[05-fingerprint-core-after.log](../evidence/d4-b-independent-success/05-fingerprint-core-after.log)。初轮旧 manifest 的 after 日志不作为新版指纹证据。
