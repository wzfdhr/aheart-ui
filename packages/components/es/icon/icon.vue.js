import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString } from "vue";
import { iconProps } from "./types.js";
import "./style.css.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AIcon"
  },
  __name: "icon",
  props: iconProps,
  setup(__props) {
    const props = __props;
    const normalizeSize = (size) => {
      if (typeof size === "number") {
        return `${size}px`;
      }
      return size;
    };
    const iconClass = computed(() => ({
      "aheart-icon--spin": props.spin
    }));
    const iconStyle = computed(() => ({
      "--aheart-icon-size": normalizeSize(props.size),
      "--aheart-icon-color": props.color
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-icon", iconClass.value]),
        style: normalizeStyle(iconStyle.value),
        "aria-hidden": "true"
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(_ctx.name), 1)
        ])
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
