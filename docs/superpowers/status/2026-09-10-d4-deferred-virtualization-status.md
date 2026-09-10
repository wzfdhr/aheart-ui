# Deferred D4 virtualization current status

- Authorization: continue the optimization sequence after D8 closure; aheart-ui v2 remains paused.
- Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`; branch `codex/d4-tree-virtualization`.
- Current gate: architecture and Tree development review are P0/P1/P2=`0/0/0`. Tree repair history is retained in [implementation recovery](../reviews/2026-09-10-d4-tree-implementation-recovery.md). The maintained suite is `87/87` (19 virtual, 6 recovery, 62 existing). Independent five-browser source run `r12` is `40/40`, including real Tab re-entry, dynamic rows, stable keys and disabled scrolling. Four final screenshots passed the scoped design review. Root typecheck, rebuilt ESM/CJS/types/CSS, docs build and release pack passed.
- Next gate: independent Tree product review of the functional substage. The joint three-component production/consumer/performance/full-repository/delivery gates are still pending; current source-preview results do not replace them. TreeSelect/Cascader implementation has not started.
- Boundary: D8 is closed. Form.List, D0-D3 final review, D9 release/device gates, npm publication and aheart-ui v2 are not started by this phase.
