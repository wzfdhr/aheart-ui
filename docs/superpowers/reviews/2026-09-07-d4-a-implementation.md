# D4 A组实施记录

授权：产品经理任务转达用户“按照你规划继续”。本次A公共API组已批准；B仅隔离适配验证获批，不授权核心正式虚拟化依赖或自动开启。

候选：`a17a0b4`，指纹`8236908b3e9af4da35b091ef25450031669423298bdc3226fb9378799ecc6242`，90文件清单`docs/superpowers/evidence/d4-a/candidate.json`。

## 行为

- Tree：checkStrictly默认true；false时derive/toggle共用typed索引，enabled父子联动、半选、保留disabled子树和unknown显式keys，取消子节点不误取消兄弟。check(keys,node,info)保持前两参数兼容。
- lazy：isLeaf=false加载，isLeaf=true不加载；同key去重、数组私有补丁、空数组叶子、void等待调用方；collapse/disabled/source或loader替换/unmount取消，迟到结果和finally隔离。
- TreeSelect：treeCheckable/treeCheckStrictly/loadData，共享私有loader及完整index；过滤只影响显示，半选不进入值、loaded label用于tags；关闭取消请求。
- Cascader：loadData(option,{signal})，旧一参函数兼容；可取消context公开类型；不兼容路径/loader/options/关闭/disabled/unmount取消，异步键盘焦点还核对请求和导航版本。

## 实际实施检查

1. Tree lazy初始RED：`corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/tree/__tests__/tree-lazy.test.ts`，初版5项中4失败（load/cancel/retry缺失），随后实现转绿。
2. TreeSelect新增RED：`corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/tree-select/__tests__/tree-checkable.test.ts`，初始3失败，接入模型后3通过。使用真实Teleport到自定义本地容器，避免stub重新挂载误丢展开状态。
3. 模型/组件集成：Tree/TreeSelect/Cascader初轮87项通过；随后补Cascader已加载分支切换与loader替换取消断言。
4. `corepack pnpm test`：Components1102、DnD44、AI66、scripts86通过；`corepack pnpm typecheck`、`corepack pnpm build`三包通过，稳定日志`docs/superpowers/evidence/d4-a/{unit,types,build}.log`。
5. 初轮`AHEART_E2E_PORT=5188 corepack pnpm exec playwright test e2e/d4-selection.spec.ts e2e/d4-iframe.spec.ts --reporter=line --output=/tmp/aheart-d4-a-browser`，五浏览器25/25通过。最终Cascaderasync-focus版本捕获及演示初始半选状态修正后，已交独立测试经理按冻结候选复验，不把初轮结果当最终验收。

包管理器固定corepack pnpm9.15.4；本轮发现工具留下allowBuilds占位配置，已精确移除并恢复本worktree原配置，未改用户主工作区。

独立开发/测试报告：`2026-09-07-d4-a-dev-review.md`、`2026-09-07-d4-a-test-review.md`。初候选a17独立全仓1102/44/66/86、types、确定性构建、pack963/71/111、全量浏览器434pass/127skip通过。

随后补查retry按钮移除丢失键盘焦点：RED1失败7通过→修复后8通过；最终代码`829531b`、指纹`8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`。开发续审与独立影响范围复验完成：Components1103、types、确定性构建、pack、相关五浏览器27/27通过，日志d4-a-final-independent。设计复核见`2026-09-07-d4-a-design-review.md`。A组产品裁定待回报，B尚未启动；不合并、不推进D5。
