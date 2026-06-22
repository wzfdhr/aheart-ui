import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot } from "vue";
import { provideAheartConfig } from "../config/context.js";
import { formProps, formEmits } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AForm"
  },
  __name: "form",
  props: formProps,
  emits: formEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    provideAheartConfig(
      computed(() => ({
        size: props.size,
        disabled: props.disabled
      }))
    );
    const formClass = computed(() => [
      `aheart-form--${props.layout}`,
      `aheart-form--label-${props.labelAlign}`
    ]);
    const handleSubmit = (event) => {
      emit("submit", event);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("form", {
        class: normalizeClass(["aheart-form", formClass.value]),
        onSubmit: withModifiers(handleSubmit, ["prevent"])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
