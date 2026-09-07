# D4 内部批次设计与可访问性审计

范围：Select、Tree、TreeSelect、Cascader 的当前内部批次；桌面默认视口与 390×844 窄屏。此记录不是完整 D4 产品验收，公共 API 与窗口化仍待批准。

## 顺序门禁

后续裁定：iframe 指定证据已补齐并由产品经理批准关闭本项 P2，见 [正式产品报告](./2026-09-07-d4-iframe-product-review.md)。下列“待裁定”记录反映纠正时的状态，不代表新的未决问题，也不构成完整 D4 放行。

- 开发经理复审：P1=0、P2=0。Tree/TreeSelect typed key、禁用祖先、Cascader 请求代际及三组件 ownerDocument 修复与生成物一致。
- 产品测试 P2=1，待裁定：此前指定 iframe 行为证据缺失，“等价覆盖、非阻断”结论未经产品经理批准，已撤销。现已补齐并绑定 `c81258c59f8da5bef1cc9d67740ca8fad44f80154fef6fdb7198ef119b697c6c`，独立开发/测试报告见同目录 `2026-09-07-d4-iframe-dev-review.md` 与 `2026-09-07-d4-iframe-test-review.md`；实际五浏览器15/15通过。历史测试总数不替代指定场景，实施者不能自行关闭产品阻断。
- 设计审核：下列六步当前未发现 P1/P2；Cascader 窄屏首列裁字在复拍前已修复。
- 产品经理最终验收：未执行。公共 API 与窗口化尚未批准，不能把内部批次称为 D4 完成。

## 逐步证据

1. Select 桌面展开：健康。选中态、禁用态、焦点边框和浮层层级清晰，未出现裁切。
   - `docs/superpowers/evidence/d4-internal-audit/01-select-open-desktop.png`
2. Tree 桌面受控勾选：健康。展开层级、勾选结果、接受/拒绝策略和 LIVE STATE 同屏可见。
   - `docs/superpowers/evidence/d4-internal-audit/02-tree-expanded-desktop.png`
3. TreeSelect 桌面展开：健康。浮层与触发器对齐，层级入口清晰；DOM 复核确认实际 treeitem 持有层级和活动项身份。
   - `docs/superpowers/evidence/d4-internal-audit/03-tree-select-open-desktop.png`
4. Cascader 桌面 lazy pending：健康。loading spinner 在原选项位置显示，布局不跳动。
   - `docs/superpowers/evidence/d4-internal-audit/04-cascader-loading-desktop.png`
5. Tree 窄屏展开：健康。策略按钮换行，Tree 与 LIVE STATE 纵向重排，触控目标和信息未溢出。
   - `docs/superpowers/evidence/d4-internal-audit/05-tree-expanded-mobile.png`
6. Cascader 窄屏两列：修复后健康。初拍发现自动滚动裁掉首列第一个汉字；将两列宽度适配视口后，父级与子级文本完整可见，三列以上仍可横向滚动。
   - `docs/superpowers/evidence/d4-internal-audit/06-cascader-columns-mobile.png`

## 结论与边界

- 当前截图未发现新的 P1/P2 视觉问题；白底、品牌蓝、精细灰线与克制科技感保持一致。
- DOM 快照和自动化覆盖键盘、角色、层级、禁用与活动项；截图本身不能证明屏幕阅读器完整体验或 WCAG 全量合规。
- Cascader 错误重试状态由组件测试覆盖，当前文档示例只演示成功加载，因此本轮没有错误态运行时截图。
