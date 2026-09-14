# Independent Cascader focus lifecycle finding

Reviewer: read-only agent `/root/d4_final_evidence_audit`.
Production scope: baseline `4a7511f` to frozen `f383375`, TreeSelect/Cascader controlled state, focus pinning, lazy invalidation, SSR and owner-document cleanup. No tests or builds were executed by this review.

P2: `cascader-virtual-list.vue` restarts `focusIndex` by calling `clearTimeout` on `focusTimer`, although the retry can have been scheduled with `requestAnimationFrame`. A superseded RAF can remain queued, and its callback unconditionally clears the shared handle. The generation guard prevents a stale focus commit, but does not cancel the queued owner-realm resource. Subsequent suspension may lose the newer handle.

Required repair: track the scheduling kind, cancel with its matching owner-window API, and ensure a callback only clears its own handle. Required RED: consecutive focus requests with unavailable row targets followed by suspension/unmount must leave no pending retry frames.

The new regression in `cascader-virtual-lifecycle.test.ts` is prepared but not executed while the frozen performance collector runs. This is a static finding, not an already demonstrated failing test. No production fix or acceptance is claimed. The frozen tgz remains unchanged; its result cannot prove a future fixed package's acceptance.

The reviewer found no other concrete issue in this bounded inspection. This is not final four-role approval; P2 remains open pending RED/GREEN, affected runtime checks and independent re-review.

## Repair evidence

The first command omitted the package's jsdom environment and failed with `window is not defined`; that is a harness error, not the defect RED. The corrected regression observed two residual frames before repair. An initial suspension-only assertion included a virtualizer-owned frame; the final regression checks actual unmount for both enabled=false and enabled=true.

Restoring only the old `clearTimeout` restart behavior in the otherwise repaired implementation made both final regression cases fail (one residual RAF each). Restoring matching-kind cancellation made both pass. Full lifecycle file: 17/17 passed with no skips; component `vue-tsc --noEmit -p tsconfig.json` passed.

The repair captures the scheduling owner and kind in a cancellation closure, cancels superseded work with the matching API, and clears a callback handle only when it still owns that handle. Generated output, broader browser/consumer checks and independent repair review remain pending. The older f383375 tgz does not include this repair.
