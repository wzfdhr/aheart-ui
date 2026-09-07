# D4 Select 合并补证独立开发复审

## 结论

对授权的三项补证范围复审未发现新的技术 P1/P2；此前 C 批发现的空结果窗口 P2 不属于本次 delta，且已在前一续审中记录为已修复。本报告不扩展到三组件虚拟化，也不代替产品批准。

## 候选与范围

- delta：`e201225..4e546e3`，仅 6 个实施/证据文件（hook 及 ES/lib 产物、Select 文档 fixture、E2E、tags 单测）。
- HEAD：`4e546e3`。
- 123 文件指纹：`a6e6597e4f471bc277a5c7b7b88acf7aa85e3c66559258ab547289673c5da664`。
- 清单：`docs/superpowers/evidence/d4-merge-supplement/candidate.json`。

## 三项补证复核

1. 宽度/字体 reflow：fixture 使用公开 `popupMatchSelectWidth` 与父容器同步从 360→180，字体通过 `styles.option` 14→20 改变；断言 active 可见、行内容不裁切/重叠、rowsValid、宽度及行高变化，并检查 pageerror。不是虚构自动测宽。
2. 稳定 key 数据变更：以中部 `probe-0500` 为 active，执行索引 501 前插、索引 500 删除、索引 800 重排，再删除 active 并断言合法 fallback `probe-0700`。断言 key/id/index/可见性、rowsValid、已选值及旧 active DOM 删除；没有不当承诺任意重排像素不变。
3. virtual + tags：新增单测覆盖创建、Enter 单次 update、tag 删除、clear、输入数组不可变和受控父拒绝；同时保留旧 typed-key/multiple/IME 覆盖。

## runtime 修复判断

测量前从缓存 virtual item geometry 判断 active 是否完整位于 popup scroll 区域；仅当原 active 本来可见且没有已有主动定位请求时，resizeItem 后复用 activeScroll 重新定位。该条件避免把用户已手动滚走的 active 拉回，同时覆盖 reflow 后 active 被挤出视口的情形。wheel/touch/pointer 取消 token 的既有路径未被削弱。

## 验证结果与边界

- 主线 Select `60/60`、桌面 `5/5`、五浏览器 `25/25` 通过。
- 新增 E2E 的末次 pageerror 断言仍需独立测试经理复跑确认；这属于测试门禁，不是当前代码审查发现的 P1/P2。
- 本复审不新增 PageUp/PageDown、全量 hover、实体设备或其他未授权门槛。
- 源码已冻结；未修改实现或测试。开发复审通过，交独立测试经理执行最终整套运行。
