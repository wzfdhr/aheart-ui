# D8 real-package consumer RED

日期：2026-09-10

## 范围

新增无 workspace 软链的真实 Vue 3.5 consumer，覆盖 AI tarball 的 package files、public D8 类型、ESM/CJS、CSS、plugin install、纯 reducer、SSR 两次确定性、hydrate 零 warning、Chat lifecycle、Workbench 操作/重排、AIForm rules/tool summary，以及 primitive-only bundle 不拉 Workbench/DnD。另提供独立 gzip baseline/current 测量入口，D8 AI gzip 增量超过 12 KiB 时硬失败。

夹具：[d8-consumer](../../experiments/d8-consumer/README.md)。

## 当前真实 RED

当前候选源码已修改 `packages/ai/src/index.ts` 并新增 `stream-reducer.ts`，但 `packages/ai/es` 与 `packages/ai/lib` 尚未用该候选重建；生成声明/入口仍缺少 `createAIStreamReducer`。因此在生成物重建前，consumer 必须拒绝把旧 tarball 当作 D8 通过证据。

首轮命令要求三个真实 tarball；省略任一 tarball 时 runner 以退出码 1 写出 `results.json`，理由为“all three real tarballs are required”，不回退到 workspace 包、软链或本地源码。使用旧生成物 tarball 时，预期在 public typecheck/ESM/CJS gate 失败，具体失败日志由同目录 `results.json` 与 `typecheck.log` 保留。

```sh
node docs/superpowers/experiments/d8-consumer/run.mjs \
  --ai-tarball /path/to/stale-aheart-ui-ai.tgz \
  --components-tarball /path/to/aheart-ui.tgz \
  --dnd-tarball /path/to/aheart-ui-dnd.tgz \
  --out docs/superpowers/evidence/d8/red/consumer
```

本 RED 不修改生产源码、不重建 `es/lib`、不伪造 GREEN；生成物同步后必须重新运行同一 consumer，并另行保留完整 GREEN 结果。未提供 baseline/current 时 gzip gate 也明确为未测量，不能推断低于 12 KiB。
