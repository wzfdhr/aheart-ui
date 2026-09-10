# TreeSelect virtual screenshot-first design review

Scope: final functional candidate `ad18e3b089a7f9ab0b1de35f2c09ea3395d01c28`. Product Design audit captured the actual source preview first, saved every accepted PNG, and reopened every saved image at original detail. The existing component design system was retained. This is the TreeSelect functional visual gate, not the combined three-component consumer, native-zoom, physical-device or deployment gate.

## Final candidate states

1. **Closed selected tags — pass.** Two explicit tags and a `+1` overflow count represent the three accepted selections. The trigger, clear control and field labels remain distinct.

![Closed tags](../evidence/d4-treeselect-virtual/audit-ad18e3b/01-closed-tags.png)

2. **Open searchable tree — pass.** Search remains outside the one vertical Tree scroll viewport. Checked rows match the accepted tags and the root expansion affordance is separate from selection.

![Open searchable tree](../evidence/d4-treeselect-virtual/audit-ad18e3b/02-open-search-tree.png)

3. **No search results — pass.** The query stays editable, an explicit empty state replaces rows, and accepted tags remain unchanged.

![Empty search](../evidence/d4-treeselect-virtual/audit-ad18e3b/03-empty-search.png)

4. **Keyboard search tail — pass.** ArrowDown entered the logical results and End moved real DOM focus to the last enabled item, Node00998. The focused row is fully visible; the disabled tail remains excluded from focus by browser assertions.

![Keyboard tail](../evidence/d4-treeselect-virtual/audit-ad18e3b/04-search-keyboard-tail.png)

5. **Controlled refusal — pass.** Requesting Node00002 increments the request readout while the authoritative field remains Node00001.

![Controlled rejection](../evidence/d4-treeselect-virtual/audit-ad18e3b/05-controlled-rejection.png)

6. **Controlled acceptance — pass.** After the parent policy changes, the same Node00002 request is accepted and displayed without altering the independent multiple field.

![Controlled acceptance](../evidence/d4-treeselect-virtual/audit-ad18e3b/06-controlled-accepted.png)

7. **Narrow 390px viewport, 24px multiline label — pass.** The complete long Node00010 label is readable, the popup remains anchored, and search stays above the Tree viewport. This is a responsive browser check, not native 200% zoom or a physical-phone claim.

![Narrow multiline label](../evidence/d4-treeselect-virtual/audit-ad18e3b/07-narrow-font24-long-label.png)

8. **Initial lazy loading — pass.** The loading indicator replaces the expansion glyph without changing the trigger value.

![Initial lazy loading](../evidence/d4-treeselect-virtual/audit-ad18e3b/08-lazy-loading.png)

9. **Lazy error — pass.** The expanded root retains context and exposes a named retry action. The repaired retry foreground is visibly distinct on the normal row background.

![Lazy error](../evidence/d4-treeselect-virtual/audit-ad18e3b/09-lazy-error.png)

10. **Selected, collapsed error — pass.** Selecting the root closes the single-select popup; reopening shows the authoritative selected value, collapsed state and still-actionable retry. Selected title and retry text remain legible on the selected background.

![Selected collapsed error](../evidence/d4-treeselect-virtual/audit-ad18e3b/10-selected-collapsed-error.png)

11. **Collapsed retry starts — pass.** Keyboard activation first expands the node and then starts the accepted second request. The readout was `state=loading; attempts=2; aborts=0`.

![Collapsed retry loading](../evidence/d4-treeselect-virtual/audit-ad18e3b/11-collapsed-retry-loading.png)

12. **Retry success and focus handoff — pass.** The child appears, the readout is `state=success; attempts=2; aborts=0`, and the accessibility snapshot identifies the root as the focused element after the retry control is removed.

![Retry success](../evidence/d4-treeselect-virtual/audit-ad18e3b/12-retry-success-root-focus.png)

13. **Loaded-child navigation and selection — pass.** ArrowRight moved real focus to Loaded lazy child; Enter selected it and closed the popup with the child label in the trigger.

![Loaded child selected](../evidence/d4-treeselect-virtual/audit-ad18e3b/13-loaded-child-selected.png)

## Contrast and interaction evidence

The five-browser test measures the actual computed foreground and composed background. Default-theme contrast ratios are normal retry `5.3056`, hovered retry `5.0831`, selected retry `4.7368`, and selected title `4.9447`; each exceeds the WCAG 2.2 ordinary-text threshold of 4.5:1 described by [Understanding Success Criterion 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). This result applies to the tested default theme and is not generalized to arbitrary consumer token overrides.

The final independent browser matrix passed TreeSelect `50/50` and Tree `45/45` with no console error, page error or new skip. The final manual run also proved root-focus restoration and child keyboard selection from the collapsed-error retry path. Screenshots from rejected `6ecf8cb` and `53fdd5d` candidates are retained in separate evidence directories but are not cited as final proof.

## Verdict and limits

Scoped TreeSelect visual/design verdict: **P0/P1/P2=`0/0/0`**.

Native 200% zoom, an actual browser iframe, packed-consumer rendering, combined three-component performance and physical-device verification remain later joint gates. No full WCAG, assistive-technology or physical-device compliance claim is made here.
