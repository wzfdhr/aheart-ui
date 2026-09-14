# Independent Cascader focus lifecycle finding

Reviewer: read-only agent `/root/d4_final_evidence_audit`.
Production scope: baseline `4a7511f` to frozen `f383375`, TreeSelect/Cascader controlled state, focus pinning, lazy invalidation, SSR and owner-document cleanup. No tests or builds were executed by this review.

P2: `cascader-virtual-list.vue` restarts `focusIndex` by calling `clearTimeout` on `focusTimer`, although the retry can have been scheduled with `requestAnimationFrame`. A superseded RAF can remain queued, and its callback unconditionally clears the shared handle. The generation guard prevents a stale focus commit, but does not cancel the queued owner-realm resource. Subsequent suspension may lose the newer handle.

Required repair: track the scheduling kind, cancel with its matching owner-window API, and ensure a callback only clears its own handle. Required RED: consecutive focus requests with unavailable row targets followed by suspension/unmount must leave no pending retry frames.

The new regression in `cascader-virtual-lifecycle.test.ts` is prepared but not executed while the frozen performance collector runs. This is a static finding, not an already demonstrated failing test. No production fix or acceptance is claimed. The frozen tgz remains unchanged; its result cannot prove a future fixed package's acceptance.

The reviewer found no other concrete issue in this bounded inspection. This is not final four-role approval; P2 remains open pending RED/GREEN, affected runtime checks and independent re-review.
