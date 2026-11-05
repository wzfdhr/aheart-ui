# 本地 AI 审批工作台

新建的 M0 验证工程，非历史业务项目。

启动：`npm install --ignore-scripts --no-audit --no-fund` 后 `npm run dev`。

关键任务：勾选两个检查项；查看本地变更；发送消息获得本地回复；批准修订并检查重复批准被阻止。

构建与 SSR：`npm run build`；类型：`npm run typecheck` 和 `npm run typecheck:strict`。严格类型的公开 1.1.0 已知失败须保留。完整执行方式、证据规则与回退见 [工程索引](../README.md)。
