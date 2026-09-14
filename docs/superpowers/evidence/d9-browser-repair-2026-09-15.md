# D9 post-merge browser repair

The first master run for merge commit `c2a6e363ac4717c0f7cec9f7b5e3594f7c890cfd` had one browser failure after `765 passed / 124 skipped`: the mobile-WebKit Cascader lazy-load scenario observed `state=success` after Escape instead of `state=aborted`. The fixture's pending mock request used a 180ms timer, which allowed a busy CI worker to complete the request before Playwright delivered the keyboard action; the trace contained no product assertion failure outside that timing race.

The fixture now keeps the pending request open for 1000ms. This preserves the same abort/late-result assertions while making the intended Escape cancellation deterministic. A local three-repeat mobile-WebKit run on the pre-repair source passed 3/3; the repair must be validated by a fresh exact-head PR and the complete post-merge master/Pages gates before D9 can close.
