# D5-C 独立测试经理报告

最终候选 HEAD：`cde5e665b69a4ce31a8bc1e35cd969004e1426cc`。本报告记录独立测试最终终态，并明确保留早期无效性能门禁与 CLS 缺陷历史。

## 最终技术门禁

| 门禁 | 最终结果 |
| --- | --- |
| 独立 Table unit | `109` 项 Table 独立测试通过。 |
| 独立 D5-C unit | `19` 项 D5-C 虚拟化/测量/focus/SSR/fallback 测试通过。 |
| 五项目浏览器矩阵 | D5-A/B/C 合计 `100/100` 通过，`0 skip`，`0 errors`。 |
| 全仓 unit | components `1211`、dnd `44`、ai `66`、scripts `86`；连续两次稳定通过。 |
| 类型/构建门禁 | typecheck、build determinism、generated 检查、docs build 均通过。 |
| release pack | `983 / 71 / 111` 文件检查通过。 |
| 真实 tgz consumer | 非 workspace symlink 的真实 tarball consumer 通过 ESM/CJS、CSS、SSR、hydration 及 local/server/virtual/fixed/expanded/fixed-expanded 六场景。 |

## 最终性能与包兼容性

最终 production build/static preview 的五轮交替 trusted-scroll 结果为：full DOM median `263.4 ms`，virtual median `26.3 ms`；虚拟窗口 `11` 行、恰好 `2` 个 spacer，`aria-rowcount=10000`；最大 virtual long-task `0 ms`，最大 CLS `0.0014698361`（约 `0.00147`，低于 `0.1`）。结果详见 [`d5-c README`](../evidence/d5-c/README.md) 与 [`perf.log`](../evidence/d5-c/perf/perf.log)。

package compare 的最终 gzip bundle delta 为 `10859` bytes，低于 `12288` budget；真实包检查 ESM/CJS/CSS、无 workspace symlink、默认 DOM/SSR native table 与 hydration 兼容均通过。对应记录见 [`package-compare.log`](../evidence/d5-c/package-compare/package-compare.log) 与 [`consumer.json`](../evidence/d5-c/consumer/consumer.json)。

## 初始无效门禁与 CLS 修复历史

- 初始性能运行保留于 [`perf-initial-invalid-gate.json`](../evidence/d5-c/perf/perf-initial-invalid-gate.json)，其门禁口径无效，不能作为最终通过或失败结论。
- 修正 harness 后，虚拟滚动真实暴露 CLS `0.3531`，超过 `0.1` 阈值；该结果被记录为 P1，不通过放行，且没有放宽阈值或新增 skip。
- `d1d672e` 修复 spacer visibility/overflow-anchor 造成的视觉位移后，重新执行五轮；最终 CLS `0.0014698361`、long-task `0 ms`，并继续保留修复前结果供审计。
- final style/CSS candidate 的 package 与性能结果在 `903e51d`、`16f663b` 后重新固化；旧的单表 gzip instrumentation 不替代最终 package-compare 门禁。

## 放行边界

本报告仅证明独立测试技术门禁通过，不放行产品，不批准 PR、合并、部署或发布。远端 CI、PR 状态、用户产品验收以及 D5-A/B/C 的更高层关闭仍须分别核对。
