# D4 final-head Chromium long-task RED

Date: 2026-09-13. Failed candidate: `7c87cee792620f46e95f1e21ae1aa430a3937c9a`. Candidate tarball SHA-256: `2983aea84a5217b4b401e4d356ef9fade4bf93bcabd81922978ea49d03515ce3`.

The exact-head full collector completed its 714 raw checkpoints but final validation rejected the candidate:

`chromium long-task entry is outside its observer round window or over budget`

The failure is real and was not an observer-assignment error:

- raw validating report at capture time: `/private/tmp/aheart-d4-final-ci-baseline-QqCP5k/full-release.json.validating`;
- report size / SHA-256: 196,828,334 bytes / `2b975f47ee886c71301361f09b753e33b3ef4a9d2a28f3c668dd0374b9950da9`;
- observer identity: Chromium ordinal 63, `Tree/10000/fixed`, virtual mode, measured round 1;
- observer window: started 239.9ms, first write 250.2ms, last write 1783.1ms, drained 1800.9ms, disconnected 1801.1ms;
- long-task entry: start 348.6ms, duration 126ms, therefore inside the window but above the 100ms limit;
- the corresponding third scroll step took 201.4ms while moving from offset 14,720 to 29,440; row window remained correct and bounded;
- that measured first interaction was 211.5ms. Four other virtual samples were 77.7, 76.0, 75.9 and 152.8ms, so the median gate alone would have hidden this tail event.

Code review found that every fixed-height mounted row and every same-size ResizeObserver callback called TanStack `resizeItem(index, 28)` even when the virtualizer already stored 28px. A controlled observer regression test initially used the wrong row selector and was rejected. After correcting it to the actual `.aheart-tree__treeitem` measurement element, the genuine RED recorded 16 redundant `resizeItem` calls for 16 unchanged rows.

Required GREEN: no resize for unchanged cached height; dynamic/replacement height behavior retained; Tree unit/browser gates pass; generated outputs regenerated; complete real collector reports no long task over 100ms. Until then, product acceptance and PR merge remain suspended.
