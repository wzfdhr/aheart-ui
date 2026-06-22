import { defineComponent, computed, ref, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString, renderSlot, createTextVNode, createCommentVNode } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { tabsProps, tabsEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  class: "aheart-tabs__nav",
  role: "tablist"
};
const _hoisted_2 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick"];
const _hoisted_3 = ["id", "aria-labelledby"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATabs"
  },
  __name: "tabs",
  props: tabsProps,
  emits: tabsEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const normalizedItems = computed(() => props.items ?? []);
    const firstEnabledKey = computed(() => {
      var _a, _b;
      return ((_a = normalizedItems.value.find((item) => !item.disabled)) == null ? void 0 : _a.key) ?? ((_b = normalizedItems.value[0]) == null ? void 0 : _b.key);
    });
    const innerActiveKey = ref(props.defaultActiveKey ?? firstEnabledKey.value);
    const isControlled = computed(() => props.activeKey !== void 0);
    const mergedActiveKey = computed(() => {
      return props.activeKey ?? innerActiveKey.value ?? firstEnabledKey.value;
    });
    const activeItem = computed(() => normalizedItems.value.find((item) => item.key === mergedActiveKey.value));
    const activeSlotName = computed(() => activeItem.value ? `tab-${activeItem.value.key}` : void 0);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const tabsClass = computed(() => [
      `aheart-tabs--${props.type}`,
      `aheart-tabs--${resolvedSize.value}`,
      {
        "is-centered": props.centered
      }
    ]);
    watch(
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-tabs", tabsClass.value])
      }, [
        createElementVNode("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
            return openBlock(), createElementBlock("button", {
              id: getTabId(item.key),
              key: item.key,
              class: normalizeClass(["aheart-tabs__tab", { "is-active": item.key === mergedActiveKey.value }]),
              type: "button",
              role: "tab",
              "aria-selected": item.key === mergedActiveKey.value ? "true" : "false",
              "aria-controls": getPanelId(item.key),
              disabled: item.disabled,
              tabindex: item.key === mergedActiveKey.value ? 0 : -1,
              onClick: ($event) => handleTabClick(item)
            }, toDisplayString(item.label), 11, _hoisted_2);
          }), 128))
        ]),
        activeItem.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          id: getPanelId(activeItem.value.key),
          class: "aheart-tabs__panel",
          role: "tabpanel",
          "aria-labelledby": getTabId(activeItem.value.key)
        }, [
          activeSlotName.value ? renderSlot(_ctx.$slots, activeSlotName.value, { key: 0 }, () => [
            createTextVNode(toDisplayString(activeItem.value.children), 1)
          ]) : createCommentVNode("", true)
        ], 8, _hoisted_3)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
