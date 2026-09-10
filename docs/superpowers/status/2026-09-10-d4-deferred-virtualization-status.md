# Deferred D4 virtualization current status

- Authorization: continue the optimization sequence after D8 closure; aheart-ui v2 remains paused.
- Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`; branch `codex/d4-tree-virtualization`.
- Current gate: three independent component inspections and the independent Astra architecture loop are complete. Review history is P0/P1/P2=`0/3/3` → `0/1/1` → `0/0/0`; the final contract is approved for Tree RED only. No component source, public API, test or generated output has been changed yet.
- Next gate: an independent test author writes and runs genuine Tree RED against [the frozen contract](../specs/2026-09-10-d4-deferred-virtualization-architecture.md). GREEN implementation remains blocked until the failures prove the missing Tree behavior without weakening legacy coverage.
- Boundary: D8 is closed. Form.List, D0-D3 final review, D9 release/device gates, npm publication and aheart-ui v2 are not started by this phase.
