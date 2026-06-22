"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  class: "aheart-tabs__nav",
  role: "tablist"
};
const _hoisted_2 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick"];
const _hoisted_3 = ["id", "aria-labelledby"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATabs"
  },
  __name: "tabs",
  props: types.tabsProps,
  emits: types.tabsEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const normalizedItems = vue.computed(() => props.items ?? []);
    const firstEnabledKey = vue.computed(() => {
      var _a, _b;
      return ((_a = normalizedItems.value.find((item) => !item.disabled)) == null ? void 0 : _a.key) ?? ((_b = normalizedItems.value[0]) == null ? void 0 : _b.key);
    });
    const innerActiveKey = vue.ref(props.defaultActiveKey ?? firstEnabledKey.value);
    const isControlled = vue.computed(() => props.activeKey !== void 0);
    const mergedActiveKey = vue.computed(() => {
      return props.activeKey ?? innerActiveKey.value ?? firstEnabledKey.value;
    });
    const activeItem = vue.computed(() => normalizedItems.value.find((item) => item.key === mergedActiveKey.value));
    const activeSlotName = vue.computed(() => activeItem.value ? `tab-${activeItem.value.key}` : void 0);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const tabsClass = vue.computed(() => [
      `aheart-tabs--${props.type}`,
      `aheart-tabs--${resolvedSize.value}`,
      {
        "is-centered": props.centered
      }
    ]);
    vue.watch(
      () => props.items,
      () => {
        if (!mergedActiveKey.value || !normalizedItems.value.some((item) => item.key === mergedActiveKey.value)) {
          innerActiveKey.value = firstEnabledKey.value;
        }
      },
      { deep: true }
    );
    const getTabId = (key) => `aheart-tab-${key}`;
    const getPanelId = (key) => `aheart-tab-panel-${key}`;
    const handleTabClick = (item) => {
      if (item.disabled || item.key === mergedActiveKey.value) {
        return;
      }
      if (!isControlled.value) {
        innerActiveKey.value = item.key;
      }
      emit("update:activeKey", item.key);
      emit("change", item.key);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-tabs", tabsClass.value])
      }, [
        vue.createElementVNode("div", _hoisted_1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item) => {
            return vue.openBlock(), vue.createElementBlock("button", {
              id: getTabId(item.key),
              key: item.key,
              class: vue.normalizeClass(["aheart-tabs__tab", { "is-active": item.key === mergedActiveKey.value }]),
              type: "button",
              role: "tab",
              "aria-selected": item.key === mergedActiveKey.value ? "true" : "false",
              "aria-controls": getPanelId(item.key),
              disabled: item.disabled,
              tabindex: item.key === mergedActiveKey.value ? 0 : -1,
              onClick: ($event) => handleTabClick(item)
            }, vue.toDisplayString(item.label), 11, _hoisted_2);
          }), 128))
        ]),
        activeItem.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          id: getPanelId(activeItem.value.key),
          class: "aheart-tabs__panel",
          role: "tabpanel",
          "aria-labelledby": getTabId(activeItem.value.key)
        }, [
          activeSlotName.value ? vue.renderSlot(_ctx.$slots, activeSlotName.value, { key: 0 }, () => [
            vue.createTextVNode(vue.toDisplayString(activeItem.value.children), 1)
          ]) : vue.createCommentVNode("", true)
        ], 8, _hoisted_3)) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
