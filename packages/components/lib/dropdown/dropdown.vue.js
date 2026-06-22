"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const index = require("../menu/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-expanded"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-dropdown__arrow",
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ADropdown"
  },
  __name: "dropdown",
  props: types.dropdownProps,
  emits: types.dropdownEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const innerOpen = vue.ref(props.defaultOpen);
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = vue.computed(() => new Set(props.trigger));
    const dropdownClass = vue.computed(() => [
      {
        "is-open": mergedOpen.value,
        "is-disabled": isDisabled.value
      }
    ]);
    const overlayClass = vue.computed(() => [`aheart-dropdown__overlay--${props.placement}`]);
    vue.watch(
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
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-dropdown", dropdownClass.value]),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          class: "aheart-dropdown__trigger",
          "aria-expanded": mergedOpen.value ? "true" : "false",
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 40, _hoisted_1),
        mergedOpen.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
          role: "presentation"
        }, [
          _ctx.arrow ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2)) : vue.createCommentVNode("", true),
          ((_b = (_a = _ctx.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length) ? (vue.openBlock(), vue.createBlock(vue.unref(index.default), {
            key: 1,
            items: _ctx.menu.items,
            selectable: _ctx.menu.selectable ?? false,
            "selected-keys": _ctx.menu.selectedKeys,
            "default-selected-keys": _ctx.menu.defaultSelectedKeys,
            onClick: handleMenuClick
          }, null, 8, ["items", "selectable", "selected-keys", "default-selected-keys"])) : vue.createCommentVNode("", true)
        ], 2)) : vue.createCommentVNode("", true)
      ], 34);
    };
  }
});
exports.default = _sfc_main;
