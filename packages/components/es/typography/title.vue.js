import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, renderSlot } from "vue";
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
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const titleClass = computed(() => [
      `aheart-typography-title--${props.level}`,
      props.type ? `aheart-typography-title--${props.type}` : void 0,
      {
        "is-disabled": props.disabled,
        "is-mark": props.mark
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const titleStyle = computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tagName.value), {
        class: normalizeClass(["aheart-typography-title", titleClass.value]),
        style: normalizeStyle(titleStyle.value)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};
