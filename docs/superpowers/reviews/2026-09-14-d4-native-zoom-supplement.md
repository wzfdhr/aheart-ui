# D4 native browser zoom supplement

Source preview: current production c608a9b via documentation build at ad95912, served from `/private/tmp/aheart-d4-final-audit-dist-ad95912` on port5191. Captured by the implementation agent using native Chrome computer controls; not an independent full design sign-off.

Chrome was reset to100% then increased using its native zoom shortcuts. The browser accessibility tree explicitly reported `缩放比例：200%`; its zoom popup displayed200%. This is native browser zoom, not CSS zoom, larger text or a narrower simulated viewport.

![Native zoom readout](/private/tmp/d4-native-zoom-200/00-native-200-percent.png)

At200%, Cascader opened with its search field visible. Down then End reached the final enabled root Sibling0998, skipping disabled0999. The focused item and focus outline were visible within the scroll viewport. This proves that bounded Cascader task only, not every deep/search case.

![Cascader tail at native200%](/private/tmp/d4-native-zoom-200/01-cascader-tail.png)

Both exact screenshots were saved and reopened before accepting them. The browser bridge had timed out; direct native Chrome control succeeded. Subsequent typed navigation lost URL punctuation. While correcting navigation, computer use stopped with a policy notice that the current browser URL was not allowed. No further interaction with that blocked page was attempted.

## Resumed verification after user restored the local page

Chrome's actual accessibility toolbar again reported `缩放比例：200%` on each route. Address-bar setValue preserved the exact local fixture URLs.

- Tree: clicked the ancestor title, pressed End, and the actual focused accessibility element became Tree row00999. The last row and checkbox were visible within its scrolling area.
  ![Tree tail at200%](/private/tmp/d4-native-zoom-200/02-tree-tail.png)
- TreeSelect: opened the checkable/searchable fixture, focused its search field, pressed Down then End. Actual focus became Node00998 while disabled00999 was skipped. Search and the final enabled item remained visible together.
  ![TreeSelect tail at200%](/private/tmp/d4-native-zoom-200/03-tree-select-tail.png)
- TreeSelect search remained editable at200%; querying00998 produced the visible matching row. Escape closed the panel and actual accessibility focus returned to the combobox.
  ![TreeSelect search at200%](/private/tmp/d4-native-zoom-200/04-tree-select-search.png)

All three added screenshots were saved and individually reopened with the image viewer. Chrome zoom was restored to100% afterward, confirmed by its own toolbar reading. These observations complete the three-component native200% search/final-item reachability supplement; independent review of these captures remains required before final sign-off. They do not claim physical-device, every-browser zoom or full assistive-technology compliance.
