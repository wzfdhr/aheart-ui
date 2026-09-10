# TreeSelect virtualization implementation review

The sole production implementation worker started only after the maintained unit/type and real-browser RED contracts were frozen. This report is an ongoing repair record, not acceptance.

## Initial implementation evidence

The worker reported 67/67 selected core/legacy tests passing, then corrected two TypeScript errors (CSSProperties inference and nullable VisualViewport). The actual initial failure and subsequent type success are retained in `/tmp/d4-treeselect-green-20260910/core-and-type.log`. A later viewport-helper change occurred before final freeze; the 67-test run is not reassigned to that changed source.

## First independent full unit/lifecycle run

The independent author executed the frozen source: maintained Tree/TreeSelect **104 passed / 1 failed across 105**, lifecycle subset **4 passed / 1 failed**, public-type local config **passed**. Source hashes before/after matched. Logs are in `/tmp/d4-treeselect-independent-20260910/`.

The failed lazy retry is a reproduced integration defect. Under virtual mode the second request starts, with the root expanded/busy and the signal not aborted; after resolving, the popup remains open but the root collapses, the request signal is aborted and the child is absent. Both native button click and Vue Test Utils trigger reproduce it. A nonvirtual comparison also collapses on retry, before starting the second request, so standalone Tree retry evidence cannot establish TreeSelect integration correctness. The independent author did not change production or test assertions during diagnosis. Logs: `retry-diagnosis.log` and `retry-diagnosis-trigger.log` in the same directory.

The passing initial lifecycle cases are supplemental evidence, not fabricated RED. The independent developer's viewport/focus/compatibility diagnostics and a valid browser run remain required before the repair plan and final gate can be closed.

## Browser infrastructure attempt

An initial five-browser attempt produced 20 connection failures because preview port 5371 had already terminated before the first case. No component assertion or geometry measurement executed; these are infrastructure failures, not component RED/GREEN. Source hashes remained stable. The dead preview is being restored under its single resource owner, without a build or a duplicate live service. The original stdout/traces are retained in `/tmp/d4-treeselect-browser-independent-20260910/` and are not counted as functional validation.

## Independent development review: rejected

An independent Astra High reviewer executed ten diagnostics: **6 failed / 4 passed**, with eight reviewed production files retaining identical before/after hashes. Its development verdict is **P0/P1/P2=`0/1/5`**, excluding the separately reproduced retry integration failure above.

| Priority | Confirmed boundary | Required repair |
| --- | --- | --- |
| P1 | A parent accepts `open=false` while search focus is pending; the trigger reports closed but focus subsequently enters an exiting treeitem. | Cancel the pending transaction on the accepted state change, including external updates, not only local close requests. |
| P2 | ArrowUp from an empty search uses an all-expanded sequence and selects a hidden descendant in a collapsed tree. | Compute endpoints from the Tree's actual visible logical sequence. |
| P2 | Default nonvirtual search now prevents native Home/End editing. | Preserve the default input keyboard behavior; scope new virtual navigation to its approved keys/mode. |
| P2 | Without visualViewport, owner-window resize from height400 to350 leaves budget92 rather than42. | Subscribe to and clean up the owner-window resize fallback. |
| P2 | An internal zero viewport budget is passed as public virtual.height and normalizes back to320. | Keep valid public configuration separate from a legal zero internal viewport constraint. |
| P2 | A realm providing RAF but no cancelRAF throws on unmount. | Treat scheduling/cancellation capability as a pair and safely dispose or fall back. |

Initial keyboard open, pre-mount external focus cancellation, rejected open followed by external focus, and ancestor-scroll updates without RO/RAF passed. They are not included as defects merely because they were earlier hypotheses. The separate retry defect remains an additional functional acceptance blocker.

Report, source hashes and executable diagnostics: `/tmp/d4-treeselect-dev-review.6UWbFj/` (`review.md`, `diagnostics.test.ts`, `diagnostics.log`, `source-hashes.txt`). Production remains frozen until the independent browser snapshot finishes; the sole implementation worker then enters the repair loop. No component or phase acceptance is granted.

## Maintained recovery RED and browser classification

The independent test author preserved the developer boundaries in `tree-select-virtual-recovery.test.ts`: **6 failed / 4 passed**, log `/tmp/d4-treeselect-red-20260910/tree-select-recovery-red-final.log`. The main reviewer rejected an intermediate test that expected a public normalizer to accept zero height: that would violate the approved positive public-height contract. The corrected test preserves public `height=0` warning/fallback to256 and reproduces the actual integration error: a forced zero internal budget produces Tree inline max-block-size320 instead of0. The repair must separate public configuration and private viewport constraints, not weaken input validation.

After restoring the terminated source preview, the independent four-scenario/five-browser run reached **14 passed / 6 failed**. Four Firefox cases failed their runtime-error check on VitePress's remote Iconify GitHub SVG CORS request. Two mobile bounds cases attempted to click a toolbar behind an open popup and timed out before changing the data. Their classifications and traces are retained in `/tmp/d4-treeselect-browser-independent-20260910/run-source-5371/`. The test author added an explicit real Escape close before toolbar interaction; it still needs a fresh run. The Iconify request must be removed using the existing local icon asset, not by suppressing console errors or mocking a successful network response.

The main thread now owns source preview port5371 to keep its lifecycle independent of short-lived audit workers. No distribution build is allowed during browser verification. All seven component blockers (six developer findings plus retry) remain open until repairs and fresh independent evidence pass.

## Infrastructure/test-precondition repair evidence

The independent test worker reused the exact installed `@iconify-json/simple-icons@1.2.86` GitHub body as `docs/public/github.svg`; the VitePress social link now reads that local SVG through its supported custom-icon configuration. The main thread checked the SVG body against the installed asset. No dependency, navigation destination or console-error suppression was added.

With the explicit Escape-before-toolbar test precondition, targeted desktop Firefox, mobile Chromium and mobile WebKit bounds cases each passed once. Firefox no longer emitted the Iconify CORS error. Logs: `/tmp/d4-treeselect-browser-independent-20260910/offline-final/`. These targeted results validate the asset/precondition repairs only: the component repair worker was allowed to change source during this period, so they are not final frozen-source browser acceptance. A complete fresh matrix remains required.

Main-thread review then identified an accessibility regression in that custom-icon change: VitePress supplies an empty default aria-label for object icons, and the decorative SVG is hidden from assistive technology. An independent browser check confirmed two unnamed social links and no GitHub-labelled social link. The configuration now explicitly supplies `ariaLabel: 'GitHub'`; a maintained Node configuration/asset self-check and the actual browser name check each pass. RED/GREEN logs are retained under `/tmp/d4-docs-social-icon-a11y/`. This repair preserves the original destination and icon while restoring its accessible name; it is not a general accessibility compliance claim.
