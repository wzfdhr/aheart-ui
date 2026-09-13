# D4 deferred virtualization final screenshot-first design review

Date: 2026-09-13. Candidate reviewed: `932f589c602f397cb8ef38e46384907365ad5b80`.

## Audit scope

Combined Product Design audit of Tree, TreeSelect and Cascader virtualization in the production VitePress preview. The audit used a fresh Codex in-app Browser tab and current-run captures only. Desktop captures used 1440x900; mobile captures used 390x844. Every accepted capture was opened inline and visually inspected before proceeding. The task-local production preview was port 5432; console warning/error logs were empty after the final navigation.

User goal: browse, search, expand, select, recover from lazy-load failure and read large virtualized structures without clipped controls, page-level overflow, ambiguous state or inaccessible focus affordances.

## Numbered flow and capture health

1. **Tree desktop default and 10k narrow dynamic rows — healthy.** The default hierarchy, checkbox alignment and internal scrollbar are clear. At 10k, width 260, font 20 and wrapping enabled, the control stays inside its card; long content remains readable through the component's internal viewport.
2. **Tree mobile containment — fixed and healthy.** The first capture was rejected: a 520px width was applied to the grid frame, producing `documentScrollWidth=557` with a 375px document client width and visibly cropping the page header. The repaired capture measured document/body width `375/375`, `scrollX=0`, frame client width 301 and internal scroll width 520. Toolbar controls wrap, the page header is intact and wide content is owned by the inner horizontal scroller.
3. **Tree mobile disabled state — healthy after containment repair.** The disabled state is visibly quieter while retaining row hierarchy; switcher and checkbox disabled semantics are also present in the accessibility tree. Static screenshots do not prove every keyboard transition, which remains covered by automated browser tests.
4. **TreeSelect desktop 10k closed/open — healthy.** Tags, `+1`, clear affordance and controlled-policy readout remain distinct. The open panel aligns to the trigger, keeps search outside the internal tree scroller, and shows selected checkboxes without covering the adjacent controlled field.
5. **TreeSelect mobile 10k and 24px long-label state — healthy.** The fixture collapses to one column, controls wrap, the popup remains inside the viewport, and selected tags retain remove affordances. Large row text wraps without horizontal page overflow; the popup remains the only vertical scroll owner for its tree.
6. **Cascader desktop five columns x 2000 — healthy.** The initial column and fully expanded five-column state were captured. Active column focus is visible, each column has its own vertical scrollbar, and the panel exposes a clear bottom horizontal scrollbar when all columns cannot fit. Auto-reveal may move the first column partly out of view after deeper navigation; the horizontal scrollbar makes that state recoverable.
7. **Cascader mobile 24px long-label stress state — healthy with an explicit stress limitation.** The panel stays within the mobile page and uses internal horizontal scrolling. Very long labels wrap into narrow columns and are intentionally dense, but remain reachable; this stress configuration is not presented as the recommended normal mobile density.
8. **Cascader mobile lazy error — healthy.** The failed row uses danger text and a visible `重试` action, while the trigger focus ring and error target remain legible. The accessibility name includes the loading-failure/retry instruction.
9. **Cascader mobile lazy retry success — healthy.** The same panel transitions to two columns with `Loaded lazy child`; the fixture status records `idle>loading>error>loading>success`, making recovery observable without leaving the task.

## Findings and disposition

- P0: 0.
- P1: 0.
- P2: 0 after the Tree mobile grid/min-content overflow repair and final re-capture.
- Strengths: consistent neutral containers, visible focus rings, clear error/retry language, bounded popup ownership, responsive one-column fixture layouts and internal scroll cues for intentionally wide data.
- No visual baseline was updated merely to hide a difference. The only implementation change caused by this audit moved the requested Tree width onto the Tree itself and gave the containing grid item `min-width:0; width:100%; overflow-x:auto`.

## Accessibility evidence and limits

The live accessibility snapshots showed named tree/combobox/dialog controls, expanded/disabled states, checkboxes, status regions and retry buttons. Screenshots support visible focus, contrast, wrapping and target discoverability, but do not by themselves prove screen-reader announcements, complete WCAG conformance, resource cleanup or all keyboard transitions. Those claims remain bound to the independent automated test/consumer gates. Mobile IAB viewport emulation is not physical iOS Safari; physical-device acceptance remains D9.

Final design decision: **PASS, P0/P1/P2 = 0/0/0**, releasing independent test-manager verification. The exact screenshots are retained as current-run inline Product Design audit captures in this task; this report preserves the ordered states, measurements, findings and rejected-capture history.
