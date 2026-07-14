import { defineComponent, openBlock, createElementBlock, withModifiers, createElementVNode, withKeys } from "vue";
const _hoisted_1 = ["value", "placeholder", "disabled", "onKeydown"];
const _hoisted_2 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AAISender" },
  __name: "sender",
  props: {
    modelValue: { default: "" },
    placeholder: { default: "输入消息" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "submit", "stop"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const submit = () => {
      const content = props.modelValue.trim();
      if (content && !props.disabled && !props.loading) emit("submit", content);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("form", {
        class: "aheart-ai-sender",
        onSubmit: withModifiers(submit, ["prevent"])
      }, [
        createElementVNode("textarea", {
          value: __props.modelValue,
          "aria-label": "消息内容",
          placeholder: __props.placeholder,
          disabled: __props.disabled || __props.loading,
          onInput: _cache[0] || (_cache[0] = ($event) => emit("update:modelValue", $event.target.value)),
          onKeydown: withKeys(withModifiers(submit, ["exact", "prevent"]), ["enter"])
        }, null, 40, _hoisted_1),
        __props.loading ? (openBlock(), createElementBlock("button", {
          key: 0,
          type: "button",
          onClick: _cache[1] || (_cache[1] = ($event) => emit("stop"))
        }, "停止")) : (openBlock(), createElementBlock("button", {
          key: 1,
          type: "submit",
          disabled: __props.disabled || !__props.modelValue.trim(),
          onClick: withModifiers(submit, ["prevent"])
        }, "发送", 8, _hoisted_2))
      ], 32);
    };
  }
});
export {
  _sfc_main as default
};
