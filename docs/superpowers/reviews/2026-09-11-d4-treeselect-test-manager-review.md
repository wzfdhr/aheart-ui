# TreeSelect virtualization independent test-manager review

Verdict: **PASS for the TreeSelect functional substage**, P0/P1/P2=`0/0/0`.

Reviewed candidate: `586dfacfe1942b91523d769256c63bdd6f97afa1`. Production source is unchanged from `ad18e3b089a7f9ab0b1de35f2c09ea3395d01c28`; the intervening commit changes only `packages/components/src/tree/__tests__/tree-virtual-lazy-retry.test.ts`. This verdict does not close the combined Tree/TreeSelect/Cascader phase, product acceptance, release or deployment.

The reviewer independently read the approved architecture, maintained assertions, relevant commit diffs and original failure/success logs. No production file, fixture, browser, preview port or distribution build was changed or operated during this review.

## Candidate and evidence integrity

- `/tmp/d4-ad18-final-DkTQXH/`: both HEAD snapshots are `ad18e3b`; source, configuration and status before/after comparisons are empty. All 36 source/helper/fixture/E2E hashes and both browser-configuration hashes were checked against the current working tree and match. Thus the recorded browser results remain applicable to current production behavior, without claiming a browser rerun at `586dfac`.
- `/tmp/d4-retry-cleanup-final-7riwkp/`: current files match `hash-after.sha256`. The only before/after hash change is the authorized retry test cleanup; `production-hash.diff` is empty and all 33 production hashes match the current tree. The pre-commit snapshot is `ad18e3b`; `head-after-commit.txt` records `586dfac`.
- Current source, fixture and E2E assertions match the reviewed committed candidate. Existing unrelated documentation/evidence and generated CSS changes were preserved and are not represented as freshly verified release output.

| Evidence | Independently checked result |
| --- | --- |
| `d4-ad18-final-DkTQXH/unit/lazy10-retry20.log` | 30/30, exit 0 |
| `d4-ad18-final-DkTQXH/unit/all-maintenance.log` | 142/142 across 14 files, exit 0 |
| `d4-ad18-final-DkTQXH/unit/public-type.log` and `.exit` | Public-barrel type contract, exit 0 |
| `d4-ad18-final-DkTQXH/browser/tree-select-50.log` | 50/50 across five browser projects, exit 0 |
| `d4-ad18-final-DkTQXH/browser/tree-45.log` | Shared Tree regression 45/45 across five projects, exit 0 |
| `d4-retry-cleanup-final-7riwkp/retry20-final.log` | 20/20 after cleanup repair, exit 0 |
| `d4-retry-cleanup-final-7riwkp/lazy10.log` | 10/10, exit 0 |
| `d4-retry-cleanup-final-7riwkp/maintenance142.log` | 142/142, exit 0 |
| `d4-retry-cleanup-final-7riwkp/public-type.log` and `.exit` | Public-barrel type contract, exit 0 |

The browser suites register console-error and page-error capture before navigation and assert the captured arrays are empty after every case. All selected cases passed; no skip, todo, only, error suppression or reduced contrast threshold was introduced. These are scoped suite results, not whole-repository QG5 results.

## RED/GREEN provenance and assertion quality

The original core RED report at `2026-09-10-d4-treeselect-virtual-red.md` distinguishes new failures from already-passing compatibility cases. The early Teleport-stub retry observation was correctly withdrawn after the real-Teleport comparison; it is not counted as a production RED. Likewise, a dead preview, remote icon failure and test setup issues are not used as component failures.

| Boundary | Genuine failure evidence and repair chain |
| --- | --- |
| Parent removal-focus handoff | Maintained RED `fd2a076`, production repair `91f212b`; real Chromium retry originally reached children with BODY focus. The maintained tests preserve connected explicit blur, outside focus and close/query cancellation controls. |
| Retry/selected-title contrast | Test commit `3e97ff9`; `/tmp/d4-treeselect-contrast-complete-kxVG8a/matrix-5-corrected.log` contains five failures with normal/hover/selected-retry/selected-title ratios approximately 3.2677/3.1307/2.9175/3.6641. Production commit `6ecf8cb` changes Tree-local foreground colors. Current browser logs measure approximately 5.3056/5.0831/4.7368/4.9447 against the retained 4.5 threshold. |
| Collapsed retry after selection and reopen | Test commit `66dc6ac`; `/tmp/d4-treeselect-lazy-reopen-fIgLtb/matrix-5.log` records five failures with `state=aborted; attempts=2; aborts=1`. First repair `53fdd5d` expands before retry. Current five-project results require success, two attempts, zero aborts, the actual root focus, ArrowRight child focus and selected child label. |
| Deferred collapse/lifecycle races | Tests `1e2435c`, `2710a66`, `c4a5634`; `/tmp/d4-tree-lazy-race-jhXoPL/race-red-final.log` contains four failures across 14 cases: unmount/accepted close started a second loader, disabling reclaimed root focus, and synchronous blur lost BODY focus. Production repair `c759ed4` guards the deferred intent. |
| Terminal owner-focus listener cleanup | Test commit `d41ace2`; `race-listener-red.log` in the same directory contains two failures across 18 cases, leaving a capture focus listener after controlled refusal or node removal. Production repair `ab5b9f0` retires intents. |
| Older/newer navigation ownership | Test commit `f199050`; `/tmp/d4-tree-retry-ab5b9f0.4KbdVa/ownership-24.log` records two failures across 24 diagnostics. Production `ad18e3b` passes the same 24 diagnostics in `/tmp/d4-tree-retry-ad18e3b.KQ2pR1/ownership-24.log` and the maintained 20-case suite. |

The maintained assertions check observable load counts, expansion, AbortSignal state, children, selection, actual DOM focus and removal of the exact registered listener functions. The ownership missing-target diagnostic controls row lookup to expose a scheduling boundary, then asserts real endpoint focus and listener retirement; it does not set production intent state to the expected answer. The collapsed setup correction moves the test to the actual deferred path and retains the loader-count expectation. The already-expanded path is separately checked for one retry without an extra expansion event. Browser contrast measurements read computed foreground/background colors rather than comparing source tokens.

## Test isolation finding and closure

The first independent review rejected `ad18e3b` at P0/P1/P2=`0/0/1`: the TreeSelect branch of `prepareCollapsedRetry(true)` bypassed `trackedWrappers`, so the controlled-close test left its mounted Vue instance alive for following cases. This was a test-lifecycle defect, not a new production defect.

Commit `586dfac` routes both Tree and TreeSelect through `trackWrapper`. Each wrapper receives an idempotent unmount function, so the explicit same-turn unmount case and the common afterEach cleanup do not invoke Vue unmount twice. No behavior assertion was removed or weakened.

The reviewer also reran all 20 retry cases at 2026-09-11 00:22:49 Asia/Shanghai using a Vite transform held only in memory. It added afterEach checks that every tracked Vue instance has `isUnmounted=true`, no `.aheart-tree`, `.aheart-tree-select` or popup panel remains in the document, and the set of document `focusin` listeners registered during the case is empty. All 20 cases passed with these additional assertions, zero unhandled errors and exit 0. No test file was written. Empty Vue mount-host containers are not live component or overlay instances.

The first attempt to configure that in-memory diagnostic put a function-bearing Vite plugin in Vitest worker options, causing a DataCloneError before any test ran; it is excluded from passing evidence. The corrected invocation supplies the plugin through Vite overrides. Separately, `retry20-pre-syntax.log` in the repair evidence is an intermediate transform failure with no executed tests; only `retry20-final.log` is the repaired suite result.

## Coverage boundaries

| Area | Evidence covered by this functional verdict | Evidence not claimed here |
| --- | --- | --- |
| Configuration and semantics | Default full DOM, explicit virtual options, invalid-field normalization, caller immutability, public types, controlled value/open refusal, full-index checking/disabled/tags, logical search endpoints and bounded windows in maintained units. | Combined packaged consumer across all three components. |
| SSR/hydration | Repeated render-to-string stability; attached-host Vue hydration in jsdom with matching initial bounded rows, no beforeMount observer/RAF and empty Vue/console diagnostics. | Production tgz SSR/hydration in a real-browser consumer. |
| iframe realm | The lifecycle unit mounts into an actual jsdom iframe document, verifies owner-document panel placement and owner-realm observers, then verifies panel removal, every observer disconnect and no pending iframe RAF. Shared Tree realm/fallback tests supplement it. | Real-browser iframe Teleport consumer and packaged iframe interaction matrix. |
| Lifecycle and focus | Units cover rejected versus accepted close, late response isolation, disable/unmount abort, retry removal/blur/outside focus, deferred transitions, controlled expansion refusal and ownership retirement. The additional cleanup audit verifies afterEach disposal. | Full application SPA navigation/unmount consumer validation. |
| Browser interaction | Desktop/mobile Chromium, desktop Firefox, desktop/mobile WebKit: search and actual focus, 10k endpoint access, Tab/Shift+Tab re-entry, controlled refusal, lazy loading/error/retry/selection, collapsed retry after close/reopen and zero console/page errors. | These source-preview suites are not whole-repository E2E or deployed product acceptance. |
| Browser layout | Single vertical scroll ownership, viewport budgeting, short viewport, long labels, measured 24px font, dynamic row/window geometry, tail reachability and computed contrast. | Native browser 200% zoom; a 24px font or viewport resize is not substituted for native zoom. |

## Remaining combined gates

The approved architecture still requires Cascader completion and one frozen three-component candidate, then the combined real-tgz ESM/CJS/CSS/declarations/SSR/hydration/iframe consumer, native 200% zoom and application cleanup checks. The fixed/coarse/dynamic 1k/5k/10k performance protocol, first-interaction medians, scroll long tasks/CLS and combined gzip delta at most 12KiB remain unverified by this report.

Full-repository unit/typecheck, deterministic double build, generated-output check, docs build, release pack, complete E2E/five-browser QG5, final independent role reviews/product acceptance, exact-head PR CI, merge, master CI, Pages and live deployed interaction remain separate gates. Historical green runs are not promoted to current-candidate release proof. This test-manager PASS permits the TreeSelect functional workflow to proceed to its remaining role gates; it does not authorize a phase-complete or released claim.
