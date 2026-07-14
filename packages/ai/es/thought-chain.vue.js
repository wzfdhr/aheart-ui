import { defineComponent, openBlock, createBlock } from "vue";
import _sfc_main$1 from "./process.vue.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAIThoughtChain" },
  __name: "thought-chain",
  props: {
    items: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$1, { items: __props.items }, null, 8, ["items"]);
    };
  }
});
export {
  _sfc_main as default
};
