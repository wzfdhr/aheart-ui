# D5-A 独立开发复审

候选：`15305d38cd8f5c479207f74977b557bed4b4e7fe`。范围：D5-A，按2026-09-08用户批准的规格执行。

审查者：Table契约测试子代理；其参与了新增契约测试，但没有编写Table/Pagination实现。本次只读复核实现、types、生成es/lib、docs、E2E与真实消费者脚本，未改文件或构建。此身份与独立测试经理分开记录。

## 结论

未发现可复现P1/P2；未发现D5-B/C、D4延期虚拟化或D6越界实现。技术复审通过，不代替独立测试或用户最终产品验收。

## 核对项

- server响应数组浅拷贝、不本地变换；local忽略pagination.total并按本地派生集合切页；省略模式保留历史兼容路径。
- sortOrder=null、首个可见受控排序列、filteredValue=[]；接受后的查询签名才重置未受控页码，父拒绝不预先提交。
- current/pageSize部分受控、拒绝后候选clamp不永久写入、共用内部归一化；显示归一化不额外制造用户事件。
- 当前页全选、disabled排除、跨页保留、silent裁剪、数字/字符串key、事件顺序和独立数组；受控preserve=false保持父keys。
- 原生radio父拒绝恢复整组。新增DOM查询以触发input所属table为根，不直接访问全局window/document，SSR不执行事件处理。
- 真实包验证脚本已检查CSS仅在浏览器入口引入、CJS实际SSR、公开ESM根入口、冻结npm ci和tarball前后SHA检查。

## 非阻塞边界

`pagination-state`未从根index导出，但现有`./es/*`和`./lib/*`通配exports使其构建后的深路径技术上可访问。这不是新增根入口公共工具；若要严格封闭所有私有深路径，需要另行评审包边界，不能在D5-A偷偷修改。

以上不宣称实体设备、读屏或所有未来组合均已验证。独立完整回归结果见测试报告，最终产品验收待用户确认。

## 后续两处修正复审

`b94252b`相对`15305d3`的文档/测试diff已由同一审查者只读续审通过：Pagination只后移D5故意拒绝demo，保留原基础示例第一入口；Cascader粗指针E2E只增加已有waitForHydration，既有组件、断言和skip均未改。trace中模块请求完成晚于点击约81ms支持该等待修正。定向重复3轮9通过/3既有skip；不是以扩大超时或忽略页面错误规避失败。

更正诊断过程中的过宽描述：该粗指针块的TreeSelect跳转后实际没有waitForHydration；同文件已有此helper，TimePicker流程使用它，本次仅按trace证据补Cascader的等待。
