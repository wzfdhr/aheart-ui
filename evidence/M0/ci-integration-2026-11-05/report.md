# M0 整合 CI 与 DnD iframe 测试前置条件

2026-11-05。源提交 `af05b7a7d7b76a2aff3512d7d849d9f34840c82b` 的 [PR CI](https://github.com/wzfdhr/aheart-ui/actions/runs/42015292362) 12/12 success；同一提交的 [push CI 首次运行](https://github.com/wzfdhr/aheart-ui/actions/runs/42015283622/attempts/1) browser job 失败，780 passed / 127 skipped / 1 failed。不能将两条不同结果合并称为全绿。

失败项是 mobile-webkit 的 D7 iframe nested auto-scroll：`scrollTop` 在 5 秒内一直为 0。原始 [截图](d7-mobile-webkit-failure.png) 显示页面仍停留在页首，目标 iframe 位于屏外；测试通过 `frame.evaluate` 派发 PointerEvent，不会自动滚动目标到视口内。完整 trace 保留于 [CI artifact](https://github.com/wzfdhr/aheart-ui/actions/runs/42015283622/artifacts/13412595730)。这说明原测试缺少用户能够触及目标的前置条件；不将该次失败直接归因为生产 DnD 的确定性缺陷。

修正只涉及该测试：先 `iframe.scrollIntoViewIfNeeded()`，再断言 `toBeInViewport()`，然后继续原有 iframe 坐标、pointer、`scrollTop > 0` 和 detach cleanup 检查。没有放宽断言、增加 retry 或 sleep，也没有修改运行时代码。

本地定向验证：desktop Chromium 和 mobile Chromium 各重复 3 次，6/6 passed（19.7 秒），见压缩日志。首次本地 mobile-webkit 尝试因未安装所需 WebKit 2311 而未执行测试；浏览器安装中。修正后的 WebKit 和完整 CI 结果以 PR #40 最新提交为准，本记录不预报通过。

M0 用户验收继续 Pending，M1 Blocked。已授权合并和 Pages，未授权 npm 发布。
