# D4 native browser zoom supplement — incomplete

Source preview: current production c608a9b via documentation build at ad95912, served from `/private/tmp/aheart-d4-final-audit-dist-ad95912` on port5191. Captured by the implementation agent using native Chrome computer controls; not an independent full design sign-off.

Chrome was reset to100% then increased using its native zoom shortcuts. The browser accessibility tree explicitly reported `缩放比例：200%`; its zoom popup displayed200%. This is native browser zoom, not CSS zoom, larger text or a narrower simulated viewport.

![Native zoom readout](/private/tmp/d4-native-zoom-200/00-native-200-percent.png)

At200%, Cascader opened with its search field visible. Down then End reached the final enabled root Sibling0998, skipping disabled0999. The focused item and focus outline were visible within the scroll viewport. This proves that bounded Cascader task only, not every deep/search case.

![Cascader tail at native200%](/private/tmp/d4-native-zoom-200/01-cascader-tail.png)

Both exact screenshots were saved and reopened before accepting them. The browser bridge had timed out; direct native Chrome control succeeded. Subsequent typed navigation lost URL punctuation. While correcting navigation, computer use stopped with a policy notice that the current browser URL was not allowed. No further interaction with that blocked page was attempted.

**Remaining:** native200% Tree and TreeSelect verification and independent review of the complete supplement. The previously completed19-step independent IAB review does not replace this outstanding native zoom requirement. Merge approval remains pending.
