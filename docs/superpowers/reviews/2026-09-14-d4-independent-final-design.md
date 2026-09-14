# Independent final D4 design / UX audit

Reviewer: independent design agent `/root/d4_final_design_acceptance`; no component, test or build implementation edits by this reviewer. Date: 2026-09-14.

Verdict: PASS for the observed design/interaction scope below; confirmed component P0/P1/P2 = 0/0/0. This is a design verdict, not phase closure or a claim of full accessibility compliance. Automated browser, performance, SSR/iframe and delivery gates remain separately owned.

## Candidate and method

The main agent supplied the fresh current-source docs build at `/private/tmp/aheart-d4-final-audit-dist-ad95912`, source `ad95912`, production `c608a9b`. The audit used `http://127.0.0.1:5191` and the existing Tree, TreeSelect and Cascader virtual fixture query routes. All accepted images below were captured during this independent run through the in-app browser, saved to `/private/tmp/d4-independent-design-OJhJwh`, and individually opened with the image viewer before accepting them. No historical screenshots or earlier review verdicts are used as visual evidence.

Product Design audit, index, critical overrides, user-context preflight, communication protocol and audit framework were read. Preflight found no saved design context. Initial port 5188 returned 404 for its referenced application script; that preview was rejected. Port 5190 was a working preflight but lacked final build binding, so its images are excluded. The evidence below uses only 5191.

## Observed steps

1. Cascader virtual panel opens with anchored search and independently scrollable options; healthy spacing, borders and visible disclosure controls.

![Cascader open](/private/tmp/d4-independent-design-OJhJwh/03-final-cascader-open.png)

2. A nonmatching query displays `暂无匹配选项` while focus remains in search; recovery is clear. Searching `0999` exposed a disabled result, and `0998` restored an enabled result.

![Cascader empty](/private/tmp/d4-independent-design-OJhJwh/04-cascader-empty.png)

3. ArrowDown then Enter selects sibling 0998, closes the popup and restores actual DOM focus to the combobox. The accepted full path is displayed and the fixture records one change; healthy.

![Cascader selected focus](/private/tmp/d4-independent-design-OJhJwh/05-cascader-selected-focus.png)

4. Lazy first failure exposes red `重试` and an accessible retry instruction. The filename says loading, but the accepted image actually captures the error state; no loading screenshot is claimed here.

![Cascader error](/private/tmp/d4-independent-design-OJhJwh/06-cascader-loading.png)

5. Enter on retry loads the child and transfers visible keyboard focus to it; healthy recovery.

![Cascader retry success](/private/tmp/d4-independent-design-OJhJwh/07-cascader-retry.png)

6. Four ArrowRight transitions reach the fifth column; the active column remains visible and horizontal scrolling preserves access to earlier columns.

![Cascader five columns](/private/tmp/d4-independent-design-OJhJwh/10-cascader-deep-final.png)

7. At 390×844, the popup stays inside the viewport and offers horizontal scrolling. Resizing an already-open desktop panel initially leaves its previously focused fifth column outside the visible horizontal window; the next End navigation reveals the final column and item. This bounded resize observation is not a claim that arbitrary resize retains focus visibility without another navigation.

![Cascader narrow reflow](/private/tmp/d4-independent-design-OJhJwh/11-cascader-mobile-deep.png)

8. End reaches `Level 4 1999` with a visible focus outline at 390×844; healthy keyboard reachability at the deep tail.

![Cascader narrow tail](/private/tmp/d4-independent-design-OJhJwh/12-cascader-mobile-tail.png)

9. Tree Space checks `Ancestor child 00`; hierarchy indentation and checked state are visible. The separate lazy tree shows its spinner.

![Tree check](/private/tmp/d4-independent-design-OJhJwh/13-tree-check.png)

10. Tree End moves actual focus to `Tree row 00999` and scrolls it into view; healthy tail navigation. Long labels in the default single-line mode use ellipsis.

![Tree tail](/private/tmp/d4-independent-design-OJhJwh/14-tree-end.png)

11. Tree lazy failure exposes the explicit `加载失败，重试` action; Tab can leave the widget to the following button.

![Tree error](/private/tmp/d4-independent-design-OJhJwh/15-tree-error.png)

12. Enter retries and the fixture success control resolves the request; ArrowDown operates the loaded children. Visible indentation and focus row remain coherent.

![Tree recovered children](/private/tmp/d4-independent-design-OJhJwh/17-tree-retry-visible.png)

13. TreeSelect opens with selected tags and checked nodes. Search stays above its internal tree scroller; healthy compact layout.

![TreeSelect open](/private/tmp/d4-independent-design-OJhJwh/18-treeselect-open.png)

14. Missing search displays `暂无匹配节点` and keeps focus in the search input; healthy recovery affordance.

![TreeSelect empty](/private/tmp/d4-independent-design-OJhJwh/19-treeselect-empty.png)

15. Searching `00998` restores the row. Under the fixture's reject policy, Space produces a request but leaves the row unchecked and tags unchanged, as required.

![TreeSelect rejection](/private/tmp/d4-independent-design-OJhJwh/20-treeselect-check-result.png)

16. After switching the fixture to acceptance, Space checks the same row and increments the collapsed tag indicator from +1 to +2. Escape closes and actual focus returns to the tags combobox.

![TreeSelect acceptance](/private/tmp/d4-independent-design-OJhJwh/22-treeselect-accept.png)

17. Lazy TreeSelect exposes a visible loading spinner, then an explicit retry action; healthy state communication.

![TreeSelect loading](/private/tmp/d4-independent-design-OJhJwh/23-treeselect-lazy.png)

![TreeSelect error](/private/tmp/d4-independent-design-OJhJwh/24-treeselect-error.png)

18. Enter retries successfully; selecting `Loaded lazy child` closes the popup, displays its label and restores actual combobox focus.

![TreeSelect success](/private/tmp/d4-independent-design-OJhJwh/25-treeselect-success.png)

19. At 390×600, tags reflow, controls remain reachable, and the open searched/checkable panel fits inside the viewport. Healthy narrow-screen behavior for the observed state.

![TreeSelect mobile](/private/tmp/d4-independent-design-OJhJwh/27-treeselect-mobile-open.png)

## Limits and disposition

This independent visual audit used the in-app browser only. It did not repeat the five-engine automated matrix, performance measurements, real 200% browser zoom, iframe, screen reader, contrast measurement, complete dynamic-font combinations or physical device tests. Those require their own evidence; screenshots alone cannot establish them. The plain Tree focus treatment is a subtle row highlight rather than the blue outline used by Cascader, but actual keyboard focus and tail visibility were confirmed. No inaccessible action or clipped required content was confirmed in the observed tasks.

Temporary viewport overrides were reset. The current tab error log returned no errors. Images 00–02 are excluded preflight evidence; images 08–09 captured intermediate search/column states and are excluded; image16 did not show the recovered subtree and was replaced by17; image26 is closed-mobile context and not needed for the final open-state claim. The accepted screenshots above are the only visual evidence supporting this report.

Proceed with independent product/test acceptance and the delivery gates using this bounded design verdict.
