import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
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
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const linkClass = computed(() => [
      {
        "is-disabled": props.disabled,
        "is-underline": props.underline
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const linkStyle = computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(["aheart-typography-link", linkClass.value]),
        href: resolvedHref.value,
        target: props.target,
        "aria-disabled": props.disabled || void 0,
        style: normalizeStyle(linkStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
