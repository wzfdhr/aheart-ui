# D5-A 独立测试经理报告

最终候选：`b94252b2c1bdd339ca055cde9e13bb44771816ca`；核心实现来自`15305d3`，两者packages文件完全相同。独立测试者没有参与D5实现或D5契约测试编写，完整读过批准规格后执行，未改断言、skip或源码。

## 最终结果：技术门禁通过

| 门禁 | 结果与原始记录 |
| --- | --- |
| 冻结安装 | Node20.20.2 / pnpm9.15.4，[frozen install](../evidence/d5-a/independent/01-frozen-install.log)通过。workspace lock SHA `6be4e05b87455d707f8698bedbbf4686026f1b9cf74273d06771dec162a3fb90`。 |
| 类型 | 全仓[typecheck](../evidence/d5-a/independent/02-typecheck.log)通过。 |
| 单测/脚本 | [1161 components +44 DnD +66 AI +86 scripts =1357 passed](../evidence/d5-a/independent/03-unit-full.log)。 |
| 构建 | [确定性双构建](../evidence/d5-a/independent/04-build-determinism.log)和生成物检查通过，[docs build](../evidence/d5-a/independent/05-docs-build.log)通过。 |
| 打包 | [release pack](../evidence/d5-a/independent/06-release-pack.log)通过，975/71/111文件。 |
| 完整浏览器回归 | [611项，484 passed /127既有skip /0 failed](../evidence/d5-a/independent/07-e2e.log)，4 workers、独立port5198；包含D5-A五浏览器25项。 |
| 独立真实消费者 | [重打包](../evidence/d5-a/independent/08-pack-tarball.log)和[消费者执行](../evidence/d5-a/independent/09-consumer-run.log)通过；公开类型、CJS/ESM根入口、真实SSR server/local、两模式hydration零warning；[结果JSON](../evidence/d5-a/independent-consumer/results.json)。 |

独立tarball SHA：`f943ae0c03992637bc94ac8fef8d07d4fe56ec6a0ea1550eff2d1adcbe42c651`，与主线程tarball一致；运行前后未改变。消费者npm install→npm ci的lock SHA均为`b23b9c8428fb0c2b689eb326a19fbc66d3370bce3bc5106b5e99410d8da47879`，亦与主消费者一致。真实包不是workspace软链。

候选HEAD前后相同，源码/已跟踪文件无变化；主线程只新增独立的review/evidence文档。

## 首轮失败不覆盖

`15305d3`首次完整E2E为481通过/3失败/127skip，测试经理按门禁停止，未运行后续consumer。两个失败为Pagination首个基础示例被拒绝更新fixture取代；一个为Cascader交互发生在页面模块完成前。主线程分别修复文档顺序与测试hydration等待，独立开发续审通过后才重跑上述完整门禁。

首轮[原始失败日志](../evidence/d5-a/primary/independent-first-full-e2e-failure.log)、[Cascader trace](../evidence/d5-a/first-failure/cascader-mobile-trace.zip)和修复后[定向重复验证](../evidence/d5-a/primary/readiness-targeted-green.log)均保留。trace SHA：`c91507b67fc46c3f53b1e8257509e093eecbf5445e8a220b17aff0e59652a2b9`。没有新增skip或弱化功能断言。

## 放行边界

本结论仅为D5-A独立技术验证通过。必要视觉复核单列；用户最终产品验收、PR、最新head远端CI、合并与部署仍未完成。不批准D5-B/C，也不关闭D5总体目标。
