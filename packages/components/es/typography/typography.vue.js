import { defineComponent, openBlock, createElementBlock, renderSlot } from "vue";
import "./style.css.js";
const _hoisted_1 = { class: "aheart-typography" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATypography"
  },
  __name: "typography",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("article", _hoisted_1, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};
