"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AFlex"
  },
  __name: "flex",
  props: types.flexProps,
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
    const resolvedOrientation = vue.computed(() => props.orientation || (props.vertical ? "vertical" : "horizontal"));
    const resolvedWrap = vue.computed(() => wrapToValue(props.wrap));
    const flexClass = vue.computed(() => [
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
    const flexStyle = vue.computed(() => [
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
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), {
        class: vue.normalizeClass(["aheart-flex", flexClass.value]),
        style: vue.normalizeStyle(flexStyle.value)
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class", "style"]);
    };
  }
});
exports.default = _sfc_main;
