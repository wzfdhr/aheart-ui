import { defineComponent as t, openBlock as n, createBlock as o } from "vue";
import m from "./process.vue.js";
const s = /* @__PURE__ */ t({
  name: "AAIThoughtChain",
  __name: "thought-chain",
  props: {
    items: { default: () => [] }
  },
  setup(e) {
    return (a, i) => (n(), o(m, { items: e.items }, null, 8, ["items"]));
  }
});
export {
  s as default
};
