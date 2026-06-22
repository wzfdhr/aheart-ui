import { defineComponent, computed, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, renderSlot } from "vue";
import { flexProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AFlex"
  },
  __name: "flex",
  props: flexProps,
  setup(__props) {
    const props = __props;
    const gapToValue = (gap) => {
      if (typeof gap === "number") {
        return `${gap}px`;
      }
      const tokenMap = {
        large: "var(--aheart-spacing-lg)",
        middle: "var(--aheart-spacing-md)",
        medium: "var(--aheart-spacing-md)",
        small: "var(--aheart-spacing-sm)"
      };
      return gap ? tokenMap[gap] ?? gap : void 0;
    };
    const justifyToValue = (justify) => {
      const valueMap = {
        start: "flex-start",
        end: "flex-end",
        between: "space-between",
        around: "space-around",
        evenly: "space-evenly"
      };
      return justify ? valueMap[justify] ?? justify : void 0;
    };
    const alignToValue = (align) => {
      const valueMap = {
        start: "flex-start",
        end: "flex-end"
      };
      return align ? valueMap[align] ?? align : void 0;
    };
    const wrapToValue = (wrap) => {
      if (wrap === true) {
        return "wrap";
      }
      if (wrap === false || wrap === void 0) {
        return void 0;
      }
      return wrap === "reverse" ? "wrap-reverse" : wrap;
    };
    const resolvedOrientation = computed(() => props.orientation || (props.vertical ? "vertical" : "horizontal"));
    const resolvedWrap = computed(() => wrapToValue(props.wrap));
    const flexClass = computed(() => [
      props.className,
      props.rootClassName,
      `aheart-flex--${resolvedOrientation.value}`,
      {
        "is-vertical": resolvedOrientation.value === "vertical",
        "is-wrap": props.wrap === true,
        [`is-wrap-${props.wrap}`]: typeof props.wrap === "string",
        [`aheart-flex--justify-${props.justify}`]: props.justify,
        [`aheart-flex--align-${props.align}`]: props.align
      }
    ]);
    const flexStyle = computed(() => [
      {
        "--aheart-flex-gap": gapToValue(props.gap),
        flexDirection: resolvedOrientation.value === "vertical" ? "column" : void 0,
        flexWrap: resolvedWrap.value,
        justifyContent: justifyToValue(props.justify),
        alignItems: alignToValue(props.align),
        flex: props.flex
      },
      props.style
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.component), {
        class: normalizeClass(["aheart-flex", flexClass.value]),
        style: normalizeStyle(flexStyle.value)
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
