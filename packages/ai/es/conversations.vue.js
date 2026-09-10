import { defineComponent as s, openBlock as t, createElementBlock as l, Fragment as i, renderList as r, normalizeClass as d, toDisplayString as u } from "vue";
const c = {
  class: "aheart-ai-conversations",
  "aria-label": "会话列表"
}, m = ["disabled", "aria-current", "onClick"], f = /* @__PURE__ */ s({
  name: "AAIConversations",
  __name: "conversations",
  props: {
    modelValue: { default: void 0 },
    conversations: { default: () => [] }
  },
  emits: ["update:modelValue"],
  setup(a, { emit: n }) {
    const o = n;
    return (k, p) => (t(), l("nav", c, [
      (t(!0), l(i, null, r(a.conversations, (e) => (t(), l("button", {
        key: e.key,
        type: "button",
        class: d({ "is-active": e.key === a.modelValue }),
        disabled: e.disabled,
        "aria-current": e.key === a.modelValue ? "page" : void 0,
        onClick: (b) => o("update:modelValue", e.key)
      }, u(e.label), 11, m))), 128))
    ]));
  }
});
export {
  f as default
};
