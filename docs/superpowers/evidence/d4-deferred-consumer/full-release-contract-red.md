# D4 first complete full-release contract RED

- Candidate: `cb17a7d1def4ae16f951363c79263cc36abe20e1`.
- Baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.
- Candidate tarball SHA-256: `363840929f12f0f710d92f3b1a35bf8c2a944758155d3ba104eb966524dd7183`.
- The collector completed both package sides, all three engines and all `270` measured rounds per engine/side. It wrote `714` checkpoints, then correctly rejected release validation; no acceptance result was produced.
- Cleanup evidence: baseline and candidate each closed `28` Chromium, `28` Firefox, `28` WebKit and one preview server; each side closed `82` explicitly recycled pages; both temporary consumers were removed.
- Preserved raw validating report at capture time: `/private/tmp/aheart-d4-full-final-r9.nltgct/full.json.validating` (`210 MiB`).

## Rejected evidence classes

1. Scroll observers covered page initialization and first render rather than only the scripted-scroll window, so Chromium collected mount long tasks over 100 ms. Millisecond-resolution Firefox/WebKit clocks also legitimately produced equal ordered `lastWrite/takeRecords/drain/disconnect` timestamps, which the first validator rejected with strict `<` comparisons.
2. TreeSelect full mode still used content height while virtual mode used 256 px. Dynamic/coarse virtual measurement legitimately adjusted `scrollTop`, but the first contract compared the settled value directly with the pre-measurement requested percentage. The report did not preserve requested offset and adjustment separately.
3. Dynamic fixture styling used `nth-child` on recycled virtual DOM children, so logical row height identity changed with the window. Tree and TreeSelect also exposed a real blank-gap sample at the repeated bottom endpoint under that unstable fixture.
4. Cascader 10k coarse and dynamic virtual first-interaction medians were only about 75% and 65% of the full path, above the approved 50% limit. This performance P2 remains open and is not waived by the harness corrections.

The repair starts PerformanceObservers immediately before the forty scroll writes, records actual browser support per round, permits equal timestamps while preserving call order, gives TreeSelect a comparable 256 px viewport, removes DOM-position-based dynamic styling, and stores `requestedOffset`, `actualOffset`, `scrollAdjustment`, and settled range separately. A new full run is required; the preserved failure is not reusable as GREEN evidence.
