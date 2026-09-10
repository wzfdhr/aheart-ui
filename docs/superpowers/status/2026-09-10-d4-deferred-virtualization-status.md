# Deferred D4 virtualization current status

- Authorization: continue the optimization sequence after D8 closure; aheart-ui v2 remains paused.
- Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`; branch `codex/d4-tree-virtualization`.
- Current gate: architecture is P0/P1/P2=`0/0/0`. Independent Tree RED is complete after a test-quality repair loop: existing Tree `44/44` passed; the corrected virtual suite is `3 passed / 10 failed`; the full Tree directory is `47 passed / 10 failed`; a type-included `vue-tsc` fails on the three missing public Tree virtual types. Only the new Tree virtual test and evidence record changed; production source, generated output and lockfile remain unchanged.
- Next gate: the sole implementation worker completes Tree GREEN against [the frozen contract](../specs/2026-09-10-d4-deferred-virtualization-architecture.md) and [RED evidence](../reviews/2026-09-10-d4-tree-virtual-red.md). TreeSelect/Cascader RED remain blocked until Tree passes its component review gates.
- Boundary: D8 is closed. Form.List, D0-D3 final review, D9 release/device gates, npm publication and aheart-ui v2 are not started by this phase.
