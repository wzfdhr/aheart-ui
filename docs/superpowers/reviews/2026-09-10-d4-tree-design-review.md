# Tree virtual runtime design review

Scope: the current Tree substage, using the Product Design audit screenshot-first workflow. Sources are the live source preview on port 5371, the current Tree styles and the independently captured `r12` screenshots below. This is not a design review of TreeSelect or Cascader.

Initial live browser inspection identified missing hierarchy indentation and rejected the candidate. After repair, fresh captures were opened and inspected. An earlier mobile capture was rejected because the documentation header obscured the fixture and the multiline title was not fully shown.

1. **Parent/child hierarchy and inherited disabled state — pass.** Child rows retain the 20px visual level distinction. Disabled controls and text are consistently subdued, while the following independent root remains available. The screenshot is supported by DOM/behavior regressions for inherited disabled state.

![Inherited disabled tree](../evidence/d4-tree-virtual/recovery-final/desktop-ancestor-disabled.png)

2. **Desktop scroll tail — pass.** The last logical item is visible, adjacent rows do not overlap and the final viewport contains continuous content.

![Desktop tail](../evidence/d4-tree-virtual/recovery-final/desktop-tail.png)

3. **Mobile narrow, larger-font multiline title — pass.** The freshly captured viewport displays the complete four-line title and the following rows with no overlap. Cropping of the preceding/following row at the scroll viewport edge is expected; the audited multiline row is fully visible.

![Mobile multiline title](../evidence/d4-tree-virtual/recovery-final/mobile-tree-long-title.png)

4. **Whole-tree disabled presentation — pass.** All shown rows consistently indicate the disabled state. Independent five-browser tests verify that this state still permits reading by scrolling and that re-enabling restores keyboard navigation.

![Whole-tree disabled](../evidence/d4-tree-virtual/recovery-final/desktop-whole-tree-disabled.png)

Tree visual verdict for these states: P0/P1/P2=`0/0/0`. Keyboard, selection, ARIA metadata and cleanup are supported by independent tests rather than inferred from screenshots. Physical devices, screen readers, performance, release consumers, broader TreeSelect/Cascader layouts and the complete phase's final screenshot matrix remain outside this substage review.
