"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATitle"
  },
  __name: "title",
  props: types.titleProps,
  setup(__props) {
    const props = __props;
    const tagName = vue.computed(() => `h${props.level}`);
    const semanticInfo = vue.computed(() => ({ props }));
    const semanticClassNames = vue.computed(
      () => typeof props.classNames === "function" ? props.classNames(semanticInfo.value) : props.classNames ?? {}
    );
    const semanticStyles = vue.computed(
      () => typeof props.styles === "function" ? props.styles(semanticInfo.value) : props.styles ?? {}
    );
    const titleClass = vue.computed(() => [
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
    const titleStyle = vue.computed(() => [props.style, semanticStyles.value.root]);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(tagName.value), {
        class: vue.normalizeClass(["aheart-typography-title", titleClass.value]),
        style: vue.normalizeStyle(titleStyle.value)
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
