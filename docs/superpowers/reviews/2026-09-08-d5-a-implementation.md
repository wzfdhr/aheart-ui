# D5-A 实施与候选记录

用户于2026-09-08明确批准[D5-A规格](../specs/2026-09-08-d5-table-pagination-design.md)。当前实现候选为`15305d38cd8f5c479207f74977b557bed4b4e7fe`，基线`92cbb52`；指纹见[候选记录](../evidence/d5-a/candidate.json)。本批不包含D5-B/C，不等于整个D5完成。

最终门禁候选推进到`b94252b`：相对核心实现`15305d3`只调整Pagination文档夹具顺序及Cascader既有E2E的hydration等待，所有packages文件不变。核心实现、真实tarball与最终测试候选的口径分别保留。

最终独立门禁已完成：[测试经理报告](./2026-09-08-d5-a-test-review.md)记录1357项单测/脚本、types/确定性/docs/pack、完整E2E484通过/127既有skip/0失败、独立真实消费者通过。以下主线程和初轮结果保留历史，不覆盖最终结论。仍待最终产品验收，尚未PR或合并。

## 已实施范围

| 契约 | 实现 | 验证入口 |
| --- | --- | --- |
| local/server与旧路径兼容 | Table可选dataMode；local忽略远端total，server保留传入顺序/集合并浅拷贝事件数组；省略继续旧路径 | table-d5-contracts.test.ts；D5浏览器server/local场景；真实包SSR/hydration。 |
| 受控查询与分页 | null为空排序；首个可见受控列权威；接受查询签名变化才重置未受控页码；Table保存未受控pageSize并与Pagination共用内部归一化 | Table新增契约与分页矩阵；pagination-state.test.ts；真实浏览器拒绝/接受。 |
| 行禁用/全选/保留 | 泛型TableRowSelection、getCheckboxProps、preserve默认true；全选仅当前页可选行；silent裁剪原始dataSource；事件数组隔离 | disabled/half/fullselect/typed key/preserve/事件顺序测试。 |
| 原生受控DOM | 复选框恢复父值；单选恢复整个原生组，防止被拒绝的点击清空之前的radio | table-radio-rejection.test.ts及五浏览器native radio场景。 |
| 文档/消费端 | 中文交互夹具、四项Pagination配置透传；新增内部helper不从根入口公开导出 | 五浏览器专项、真实tgz类型/根入口ESM/CJS/SSR/hydration。 |

## RED 与纠错记录

- Table首轮19项为11失败/8通过，扩充到23项后15失败/8通过；[原始RED](../evidence/d5-a/primary/table-contracts-red.log)保留。后来6处测试预期与既定契约或VTU包装不符：proxy/raw身份、点击列请求、父组件事件观测、受控页码误当未受控、显式undefined选择、silent裁剪误期望事件。已按规格修正，未为迁就实现削弱契约；[集成初轮](../evidence/d5-a/primary/integration-first.log)保留。
- Pagination新helper缺失形成初始RED，不将这条模块缺失日志冒称为每个数值边界均已单独复现。新增边界随后GREEN。
- 原生radio父拒绝真实复现为`[false,false]`而非`[true,false]`，见[失败记录](../evidence/d5-a/primary/radio-red.log)；主线程修复整组DOM恢复。
- 新增8项矩阵首跑就是GREEN，属于补证，虽原临时文件名含red，仓库保存为[matrix-initial-green](../evidence/d5-a/primary/matrix-initial-green.log)，不虚构失败。
- 类型检查首次缺ImportMeta.env声明，随后沿用已有Select的显式环境类型方式修复。全仓脚本初次仅因五浏览器配置列表新增D5但严格断言未同步失败；更新断言保留所有旧套件并明确要求D5，86项脚本复验通过。失败日志均保留。
- 首次独立完整E2E为481通过/3失败/127既有skip，不能放行。两个失败由新增受控拒绝夹具放在Pagination首个demo导致，`46b51c3`恢复基础示例第一入口，未改旧断言。另一失败trace显示Cascader trigger点击发生在页面模块完成前约81ms；`b94252b`在既有粗指针测试中复用waitForHydration，未修改Cascader实现或skip。首轮[原始日志](../evidence/d5-a/primary/independent-first-full-e2e-failure.log)及[原始trace](../evidence/d5-a/first-failure/cascader-mobile-trace.zip)保留；修复后定向3轮为[9通过/3既有skip](../evidence/d5-a/primary/readiness-targeted-green.log)。最终仍需独立完整复验，不用定向绿色豁免失败。

## 主线程验证（不是最终独立放行）

- 相关76项单测/组件types通过，后补8项矩阵通过；全组件实现测试在初轮通过，但全仓脚本配置断言需上述修正，不把那次全命令说成成功。
- 组件与文档构建、pack975/71/111通过；初轮D5五浏览器20项通过，随后加入原生radio后候选有25项，待独立完整复验。
- [真实包消费者](../evidence/d5-a/consumer/results.json)：无workspace软链、npm install→npm ci相同锁、公开类型、根入口ESM/CJS实际SSR、local/server hydration无warning；tarball前后SHA一致。主消费者锁与tar SHA在候选JSON。
- 冻结候选独立开发复审、完整测试经理复验和必要视觉报告分别记录，不用本段取代它们。产品最终验收、PR/远端CI和合并尚未完成。
