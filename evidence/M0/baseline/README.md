# 基线索引与重跑

- `clean-consumer-2026-11-05/results.json`：本轮公开 registry Node 消费验证；准确命令、退出码、安装耗时、registry metadata、lockfile hash 与 scratch 路径在结果中。对应日志及输入 fixture/lockfile 同目录保存。
- `main-worktree-before.json`：11 月 4 日原主树 4,405 条记录的内容指纹。它是采集时快照，不是 11 月 5 日实时数量；不包含文件内容或凭据。
- `spec-inputs.json`：11 月 4 日读取原主树四份 draft 的来源和 SHA-256。11 月 5 日独立 worktree 已快进到 #37 的 Approved 版本；先前 draft 副本已保存在本机 `/tmp/aheart-v2-m1-preserved-draft-specs-2026-11-05/`，未覆盖主树。
- `../../M1/remote-status-2026-11-05/`：远端 refs、Release、PR 检查、Pages 部署、纯脚本测试和历史日志校验。

重复 Node 基线（只需系统 Node/Python/npm；从公开 registry 安装到仓库外新目录，禁用依赖安装脚本）：

```sh
python3 evidence/M0/baseline/collect-registry.py --out /tmp/aheart-registry-evidence-new
```

输出目录必须不存在。版本固定为 `aheart-ui@1.1.0`、DND/AI `1.0.0`、Vue `3.5.44`、TypeScript `5.9.3`。首次安装后保存 lockfile；要重放相同依赖解析，复制已归档 fixture/lockfile 到新的空目录并运行 `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org/`，再按 results.json 中其余命令运行。

`types-strict` 预计复现公开 1.1.0 的 TS2344（exit 2）；这份失败证据必须保留。脚本返回退出码不作验收结论，逐项检查 results.json 的 `commands[].exitCode`。不能仅根据 Node ESM/CJS/SSR smoke 声称 hydration、iframe、真实 CSS 渲染或用户验收通过。后续修复包需要新版本 fixture 和新目录，不能改写本快照。

11 月 5 日主树读数为 4,408 条；与 11 月 4 日快照相比多 3 条 untracked，内容指纹不同。本轮对主树只读采集，不据此重置或同步任何文件。见 main-worktree-after.json。
