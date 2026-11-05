# 干净消费端

新建的 M0 验证工程，非历史业务项目。

启动：`npm install --ignore-scripts --no-audit --no-fund` 后 `npm run dev`。

关键任务：点击计数；选择“紧凑”；打开弹窗后用 Tab/Escape 检查焦点；查看 ssr.html 和 iframe.html。

构建与 SSR：`npm run build`；类型：`npm run typecheck` 和 `npm run typecheck:strict`。严格类型的公开 1.1.0 已知失败须保留。完整执行方式、证据规则与回退见 [工程索引](../README.md)。
