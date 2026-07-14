"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const process_vue_vue_type_script_setup_true_lang = require("./process.vue.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "AAIThoughtChain" },
  __name: "thought-chain",
  props: {
    items: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(process_vue_vue_type_script_setup_true_lang.default, { items: __props.items }, null, 8, ["items"]);
    };
  }
});
exports.default = _sfc_main;
