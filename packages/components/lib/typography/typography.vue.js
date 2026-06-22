"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATypography"
  },
  __name: "typography",
  props: types.typographyProps,
  setup(__props) {
    const props = __props;
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const typographyClass = vue.computed(() => [props.className, props.rootClassName, semanticClassNames.value.root]);
    const typographyStyle = vue.computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("article", {
        class: vue.normalizeClass(["aheart-typography", typographyClass.value]),
        style: vue.normalizeStyle(typographyStyle.value)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 6);
    };
  }
});
exports.default = _sfc_main;
