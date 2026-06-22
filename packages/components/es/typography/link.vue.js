import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { linkProps } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["href", "target", "aria-disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ALink"
  },
  __name: "link",
  props: linkProps,
  setup(__props) {
    const props = __props;
    const resolvedHref = computed(() => props.disabled ? void 0 : props.href);
    const linkClass = computed(() => ({
      "is-disabled": props.disabled,
      "is-underline": props.underline
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(["aheart-typography-link", linkClass.value]),
        href: resolvedHref.value,
        target: props.target,
        "aria-disabled": props.disabled || void 0
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
