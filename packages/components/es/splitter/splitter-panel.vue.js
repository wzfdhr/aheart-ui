import { defineComponent, openBlock, createElementBlock, renderSlot } from "vue";
const _hoisted_1 = { class: "aheart-splitter__panel" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASplitterPanel"
  },
  __name: "splitter-panel",
  props: {
    min: [Number, String],
    max: [Number, String],
    collapsible: Boolean
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
