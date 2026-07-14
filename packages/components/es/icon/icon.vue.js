import { defineComponent, useSlots, computed, markRaw, toRaw, watchEffect, warn, openBlock, createElementBlock, normalizeClass, normalizeStyle, unref, renderSlot, createBlock, resolveDynamicComponent, createCommentVNode } from "vue";
import { iconComponents, warnedUnknownIconNames } from "./icons.js";
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
    const slots = useSlots();
    const resolvedComponent = computed(() => {
      const component = props.component ?? (props.name ? iconComponents[props.name] : void 0);
      return component ? markRaw(toRaw(component)) : void 0;
    });
    watchEffect(() => {
      if (slots.default || props.component || !props.name || resolvedComponent.value || warnedUnknownIconNames.has(props.name)) {
        return;
      }
      warnedUnknownIconNames.add(props.name);
      warn(`[Aheart UI] Unknown icon name: ${props.name}`);
    });
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
        unref(slots).default ? renderSlot(_ctx.$slots, "default", { key: 0 }) : resolvedComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(resolvedComponent.value), {
          key: 1,
          class: "aheart-icon__svg",
          "aria-hidden": "true",
          focusable: "false"
        })) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
