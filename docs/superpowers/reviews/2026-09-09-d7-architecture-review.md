# D7 DnD architecture review

基线：master `b6630ceb31c3d30e4bdc6529c622354b1e34c181`。范围只含 D7 七项；aheart-ui v2、D8、D4 延期虚拟化、D0-D3 最终复核和 D9 发布均未启动。

## Final verdict

独立只读架构复审最终为 P0/P1/P2=`0/0/0`，允许进入真实 RED。旧 `44 passed` 只作为 DnD 基线，不替代 D7 新契约测试。

## Review loop

第一轮盘点确认：生产仍按 drag-start index 移动；无 revision；跨列表 source/target 顺序 emit 没有 settle/rollback；通用 Draggable/DropZone 没有键盘取放；失败播报不完整；auto-scroll 使用全局 window；插入/删除/刷新与迟到 drop 缺覆盖。

首次规格复审拦截 4 个 P1、3 个 P2：受控 settle 时序、generic keyboard session、stable target position、Atlaskit iframe window 边界，以及 revision fallback、事件类型、可复算测试标准不明确。第二轮拦截 2 个 P1、2 个 P2：复用路由组件缺 lifecycle key、对象 clone 会误判父拒绝、keyboard payload 未冻结、frame detach 清理不足。

最终规格已冻结：

- stable itemKey、item/end target identity、显式及 fallback revision；
- candidate 一个 nextTick、rollback 一个 nextTick，按 key 顺序 settle，并保留父层 clone 与并发字段；
- `scopeKey` 处理复用路由，owner-detach observer 处理同源 iframe 移除；
- ownerDocument keyboard session/zone registry、精确公共事件类型与播报；
- Atlaskit 主文档路径和自有 iframe owner-realm auto-scroll wrapper 的边界；
- RED、SSR/hydration、五浏览器、consumer、设计、独立测试、产品、PR/master/Pages/线上退出门禁。

架构依据：[D7 architecture contract](../specs/2026-09-09-d7-dnd-architecture.md)。任何公共 API、settle tick、target identity、keyboard keymap 或 owner-realm 边界变化都必须重新架构复审。

