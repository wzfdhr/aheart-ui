# D4 Cascader WebKit stable-geometry RED/GREEN

Date: 2026-09-13. Production candidate: `cf2a24c1460187041f622ddd0a01831076f91ab0`.

The first final D4 five-project rerun ended 159 passed / 1 failed. Desktop WebKit failed `narrow short viewport, font 24 and long labels keep dynamic geometry inside the panel` at line 446: the first immediate snapshot had no mounted row crossing the column viewport's top boundary. The trace, video, screenshot and error context were retained under `/tmp/d4-final-cf2-targeted/d4-cascader-virtual-narrow-6564c-c-geometry-inside-the-panel-desktop-webkit/` at capture time.

The other assertions in that same snapshot passed: mounted row budget, panel/viewport sizes, 24px computed font, non-zero row/title sizes and wrapped content. Five isolated desktop-WebKit repeats of the unchanged test passed, confirming asynchronous ResizeObserver/RAF convergence rather than a deterministic product regression.

The repaired test does not weaken geometry. It polls a single stable snapshot until all original boolean constraints are simultaneously true: every row/title measured, top covered, bottom covered, rows non-overlapping and at least one title wrapped. Numeric panel, viewport, font and row-budget assertions remain unchanged. The repair passed 10/10 isolated desktop WebKit and then the complete D4 five-project matrix 160/160. No component source, CSS, timeout, browser matrix or skip changed.

Disposition: test-stability P2 closed. This evidence is not a substitute for the full repository E2E or performance collector.
