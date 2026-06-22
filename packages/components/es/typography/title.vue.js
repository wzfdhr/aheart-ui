import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, renderSlot } from "vue";
import { titleProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATitle"
  },
  __name: "title",
  props: titleProps,
  setup(__props) {
    const props = __props;
    const tagName = computed(() => `h${props.level}`);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tagName.value), {
        class: normalizeClass(["aheart-typography-title", `aheart-typography-title--${_ctx.level}`])
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};
