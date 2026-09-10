import { defineComponent as r, openBlock as o, createElementBlock as i, withModifiers as s, createElementVNode as b, withKeys as c } from "vue";
const f = ["value", "placeholder", "disabled", "onKeydown"], p = ["disabled"], v = /* @__PURE__ */ r({
  name: "AAISender",
  __name: "sender",
  props: {
    modelValue: { default: "" },
    placeholder: { default: "输入消息" },
    disabled: { type: Boolean, default: !1 },
    loading: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue", "submit", "stop"],
  setup(e, { emit: m }) {
    const l = e, a = m, d = () => {
      const n = l.modelValue.trim();
      n && !l.disabled && !l.loading && a("submit", n);
    };
    return (n, t) => (o(), i("form", {
      class: "aheart-ai-sender",
      onSubmit: s(d, ["prevent"])
    }, [
      b("textarea", {
        value: e.modelValue,
        "aria-label": "消息内容",
        placeholder: e.placeholder,
        disabled: e.disabled || e.loading,
        onInput: t[0] || (t[0] = (u) => a("update:modelValue", u.target.value)),
        onKeydown: c(s(d, ["exact", "prevent"]), ["enter"])
      }, null, 40, f),
      e.loading ? (o(), i("button", {
        key: 0,
        type: "button",
        "aria-label": "停止生成",
        onClick: t[1] || (t[1] = (u) => a("stop"))
      }, "停止")) : (o(), i("button", {
        key: 1,
        type: "submit",
        "aria-label": "发送消息",
        disabled: e.disabled || !e.modelValue.trim(),
        onClick: s(d, ["prevent"])
      }, "发送", 8, p))
    ], 32));
  }
});
export {
  v as default
};
