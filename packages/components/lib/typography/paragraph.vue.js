"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AParagraph"
  },
  __name: "paragraph",
  props: types.paragraphProps,
  setup(__props) {
    const props = __props;
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const isEllipsis = vue.computed(() => Boolean(props.ellipsis));
    const ellipsisRows = vue.computed(() => {
      var _a;
      if (typeof props.ellipsis === "object" && ((_a = props.ellipsis) == null ? void 0 : _a.rows) && props.ellipsis.rows > 0) {
        return props.ellipsis.rows;
      }
      return 1;
    });
    const isMultilineEllipsis = vue.computed(() => isEllipsis.value && ellipsisRows.value > 1);
    const paragraphClass = vue.computed(() => [
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
    const paragraphStyle = vue.computed(() => [
      isEllipsis.value ? { "--aheart-typography-ellipsis-rows": ellipsisRows.value } : void 0,
      props.style,
      semanticStyles.value.root
    ]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("p", {
        class: vue.normalizeClass(["aheart-typography-paragraph", paragraphClass.value]),
        style: vue.normalizeStyle(paragraphStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
exports.default = _sfc_main;
