# PR18 三项Select合并补证

## 范围与候选

产品裁定仅要求三个已批准Select契约的补证，不追加PageUp/PageDown新快捷键、所有hover排列、实体设备或读屏门禁。PR18为已授权A/B/C增量；其他三组件虚拟化未授权且未实现，但不阻塞本PR，也不因本PR合并而变成获批延期或完整D4关闭。

代码`4e546e3`，123文件指纹`a6e6597e4f471bc277a5c7b7b88acf7aa85e3c66559258ab547289673c5da664`，见[候选清单](../evidence/d4-merge-supplement/candidate.json)。先前C候选1f7b…及e201225远端全绿只作为历史，不改标为本次新候选。

## 已有证据核对与必要补充

| 指定契约 | 可复用的已有证据 | 本次新增与实际结果 |
| --- | --- | --- |
| 打开期间改变宽度、字体尺寸，布局和active有效 | C已证明真实动态高度与视口前首项增高的锚点，但没有宽度/字体尺寸专项 | 新E2E通过公开popupMatchSelectWidth与父容器同步360→180px，styles.option字体14→20px；验证行变高、内容无垂直裁切、行不重叠、active key正确且可见，再ArrowDown跳过disabled。不是自动trigger测宽或任意字体加载承诺 |
| 中部稳定key插入/删除/重排及active删除回退 | 原typed-key单测已证明1与字符串1不混用、搜索和移除的身份恢复；没有真实中部视口更新专项 | 新E2E从1000项的key0500中部视口开始；前插后索引501、删前置项回500、旋转重排到800，ID/key保持且可见；删0500后active合法回退0700，受控已选值不被擅自改写。不承诺任意重排像素不动 |
| virtual+tags创建、单次Enter、移除、clear、父拒绝 | 既有tags基础测试和virtual+multiple/clear不足以完整绑定此组合 | 新3项单测检查创建的UI与单次payload、移除→创建→clear顺序、父拒绝每一步仍保留Apple且输入数组不变异；现实现直接通过，没有伪造tags运行缺陷 |

## 实际发现及修复

宽度专项初轮失败不是预判：诊断为`rowsValid=true`、key仍0500，但`visible=false`；行高更新将原本可见的active挤出viewport。见[RED诊断](../evidence/d4-merge-supplement/02-width-diagnostic-red.log)。数据专项与tags组合原本GREEN，记录为证据补齐，不说它们原本有bug。

修复仅在测量批次前读取缓存几何，判断active此前是否完整可见；resizeItem后对该可见active复用既有定位机制。已经被用户滚走的active不强制拉回。没有新增公共API、依赖或其他组件改动。

主测Select60/60、组件类型、桌面5项与五浏览器25项通过；最后增加的数据pageerror捕获由独立测试再次运行。[独立开发复审](2026-09-07-d4-merge-supplement-dev-review.md)已通过，独立测试正在执行受影响范围；不重复未变的其他组件全套本地门禁。

## 因runtime变化复核已有消费者

同一既有生产消费者的新包36场景及4组hydrate均通过，无新增性能维度，见[记录](../evidence/d4-merge-supplement/consumer-results.json)。新tar SHA`70cf1c26eecd6f44226734c0dce0e6c61e40c0bf7b032121f205dc774355e3a1`，锁SHA`01f219294ae7a463d85536db6fd75654ff9a60b7409958a6b457689f699941ee`。默认false消费者gzip60843字节，相同旧A基线52319，增量8524字节（比上次+84字节）；CSS增量仍30字节gzip。成本口径仍限该消费者，不是任意应用固定值。

独立复验完成后补必要新截图，再更新同一Draft PR；必须等更新后head远端CI全绿再交产品经理最终合并裁定，不沿用旧head绿色状态。

## 独立补证完成

[测试经理](2026-09-07-d4-merge-supplement-test-review.md)已在同一前后指纹上通过Select60、类型、确定性构建、pack971/71/111、五浏览器25项；独立消费者4个受影响场景、4组hydrate、CJS及稳定bytes/modules通过。首次消费命令误指不存在的old-lock路径，退出失败已保存；未改锁，随后用已有只读旧锁完成对照，不当作运行时缺陷。

[必要视觉复核](2026-09-07-d4-merge-supplement-design-review.md)已重新捕获并检查窄宽度/大字体和数据回退两张新图。三个指定证据P2已完成独立补证，其中实际reflow active问题已修正。现在只更新同一PR并等待新head远端CI和产品最终裁定，不扩大评审面。
