import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { paragraphProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AParagraph"
  },
  __name: "paragraph",
  props: paragraphProps,
  setup(__props) {
    const props = __props;
    const semanticInfo = computed(() => ({ props }));
    const semanticClassNames = computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const isEllipsis = computed(() => Boolean(props.ellipsis));
    const ellipsisRows = computed(() => {
      var _a;
      if (typeof props.ellipsis === "object" && ((_a = props.ellipsis) == null ? void 0 : _a.rows) && props.ellipsis.rows > 0) {
        return props.ellipsis.rows;
      }
      return 1;
    });
    const isMultilineEllipsis = computed(() => isEllipsis.value && ellipsisRows.value > 1);
    const paragraphClass = computed(() => [
      {
        [`aheart-typography-paragraph--${props.type}`]: props.type,
        "is-strong": props.strong,
        "is-italic": props.italic,
        "is-ellipsis": isEllipsis.value,
        "is-ellipsis-multiline": isMultilineEllipsis.value,
        "is-mark": props.mark,
        "is-disabled": props.disabled
      },
      props.className,
      props.rootClassName,
      semanticClassNames.value.root
    ]);
    const paragraphStyle = computed(() => [
      isEllipsis.value ? { "--aheart-typography-ellipsis-rows": ellipsisRows.value } : void 0,
      props.style,
      semanticStyles.value.root
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("p", {
        class: normalizeClass(["aheart-typography-paragraph", paragraphClass.value]),
        style: normalizeStyle(paragraphStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
