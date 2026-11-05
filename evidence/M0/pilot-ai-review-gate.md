# M0 试点：ai-review-gate

用户已指示由 Codex 创建。本轮已在 `pilots/ai-review-gate` 新建独立 Vue/Vite 消费应用，不再等待用户提供旧项目路径。

功能：本地聊天、检查清单、修订预览、人工批准记录、重复批准限制、Workbench 排序和手机执行抽屉。采用公开 core 1.1.0、AI/DND 1.0.0，并记录独立 npm lock。

这是本轮新建验证应用，不是历史 Electron 工程恢复，也不代表真实模型/Git 集成或用户验收。

[三试点完整报告](pilots-2026-11-05/report.md)记录安装、SSR/hydration、两视口交互、无障碍、失败日志和负责人。严格类型与桌面对比度仍失败，阶段保持 Blocked。

2026-11-05 后续：[Card 与对比度组合候选](card-integration-2026-11-05/report.md)已通过本试点的严格类型、桌面/手机交互和 axe；前述失败保留为公开包原始基线。新候选静态预览位于 `evidence/M0/card-integration-2026-11-05/preview-ai-review-gate/`。真实用户使用反馈仍待提供，未以自动化结果代签验收。

2026-11-05 用户决定：**“尚未实际试用，保持待验收”**。合并与文档站部署已获授权，但不构成试点采用、M0 Go 或 npm 发布授权。
