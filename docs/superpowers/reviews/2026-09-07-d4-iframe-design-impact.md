# D4 iframe 补测的设计影响核对

候选：`c81258c59f8da5bef1cc9d67740ca8fad44f80154fef6fdb7198ef119b697c6c`，46 文件清单见 `docs/superpowers/evidence/d4-iframe-candidate.json`。

本次补测没有运行时/样式变化。实施者将当前生产 diff 与补测前备份 `/Users/start/.codex/recovery/aheart-ui-d4-2026-09-07/internal-checkpoint.patch` 按文件逐段比较：30 段生产 diff 全部一致；新增 Tree 索引源码及 ES/CJS 四份产物与备份 `current-untracked-files.tar.gz` 中内容 SHA256 一致（5/5）。比较使用 Node readFileSync / execFileSync git diff --binary / tar -xOf 和 crypto SHA256，仅只读检查。

依据产品经理要求“设计审核（有视觉变化）”，本轮不触发新视觉审核，不宣称重新截图或由独立设计经理完成审计。此前六张截图保存在 `docs/superpowers/evidence/d4-internal-audit/`，仅作为前批背景证据，不能替代本次 iframe 指定行为测试。

设计影响：无新增布局、样式、动效或公开交互模型改动；无新增设计问题。未覆盖：新的视觉状态、真实辅助技术和实体设备检查。本记录由整合者完成，产品测试 P2=1 仍待产品经理最终裁定。
