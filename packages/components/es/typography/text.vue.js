import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, renderSlot } from "vue";
import { textProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AText"
  },
  __name: "text",
  props: textProps,
  setup(__props) {
    const props = __props;
    const tagName = computed(() => {
      if (props.code)
        return "code";
      if (props.keyboard)
        return "kbd";
      if (props.delete)
        return "del";
      if (props.underline)
        return "u";
      if (props.mark)
        return "mark";
      if (props.italic)
        return "em";
      if (props.strong)
        return "strong";
      return "span";
    });
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const textClass = computed(() => [
      {
        [`aheart-typography-text--${props.type}`]: props.type,
        "is-strong": props.strong,
        "is-italic": props.italic,
        "is-mark": props.mark,
        "is-disabled": props.disabled
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const textStyle = computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(tagName.value), {
        class: normalizeClass(["aheart-typography-text", textClass.value]),
        style: normalizeStyle(textStyle.value)
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
