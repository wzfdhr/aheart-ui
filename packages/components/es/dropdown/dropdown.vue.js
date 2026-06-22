import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createCommentVNode, createBlock, unref } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import Menu from "../menu/index.js";
import { dropdownProps, dropdownEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-expanded"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-dropdown__arrow",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ADropdown"
  },
  __name: "dropdown",
  props: dropdownProps,
  emits: dropdownEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const innerOpen = ref(props.defaultOpen);
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = computed(() => new Set(props.trigger));
    const dropdownClass = computed(() => [
      {
        "is-open": mergedOpen.value,
        "is-disabled": isDisabled.value
      }
    ]);
    const overlayClass = computed(() => [`aheart-dropdown__overlay--${props.placement}`]);
    watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    const setOpen = (open) => {
      if (isDisabled.value) {
        return;
      }
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      emit("openChange", open);
    };
    const handleTriggerClick = () => {
      if (!triggerSet.value.has("click")) {
        return;
      }
      setOpen(!mergedOpen.value);
    };
    const handleMouseEnter = () => {
      if (triggerSet.value.has("hover")) {
        setOpen(true);
      }
    };
    const handleMouseLeave = () => {
      if (triggerSet.value.has("hover")) {
        setOpen(false);
      }
    };
    const handleMenuClick = (info) => {
      emit("click", info);
      setOpen(false);
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-dropdown", dropdownClass.value]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: "aheart-dropdown__trigger",
          "aria-expanded": mergedOpen.value ? "true" : "false",
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 40, _hoisted_1),
        mergedOpen.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
          role: "presentation"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_2)) : createCommentVNode("", true),
          ((_b = (_a = _ctx.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length) ? (openBlock(), createBlock(unref(Menu), {
            key: 1,
            items: _ctx.menu.items,
            selectable: _ctx.menu.selectable ?? false,
            "selected-keys": _ctx.menu.selectedKeys,
            "default-selected-keys": _ctx.menu.defaultSelectedKeys,
            onClick: handleMenuClick
          }, null, 8, ["items", "selectable", "selected-keys", "default-selected-keys"])) : createCommentVNode("", true)
        ], 2)) : createCommentVNode("", true)
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};
