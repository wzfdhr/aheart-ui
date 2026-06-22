import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot } from "vue";
import { cardGridProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACardGrid"
  },
  __name: "grid",
  props: cardGridProps,
  setup(__props) {
    const props = __props;
    const gridClass = computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-hoverable": props.hoverable
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-card-grid", gridClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        createElementVNode("div", {
          class: normalizeClass(["aheart-card-grid__content", (_a = _ctx.classNames) == null ? void 0 : _a.content]),
          style: normalizeStyle((_b = _ctx.styles) == null ? void 0 : _b.content)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 6)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
