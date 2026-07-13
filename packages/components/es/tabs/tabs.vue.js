import { defineComponent, computed, ref, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, Fragment, renderList } from "vue";
import { tabsProps, tabsEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick"];
const _hoisted_2 = ["id", "aria-labelledby"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ATabs"
  },
  __name: "tabs",
  props: tabsProps,
  emits: tabsEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = defineComponent({
      name: "ATabsRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false;
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
    const positionPlacementMap = {
      left: "start",
      right: "end",
      top: "top",
      bottom: "bottom"
    };
    const resolvedPlacement = computed(() => props.tabPlacement ?? (props.tabPosition ? positionPlacementMap[props.tabPosition] : "top"));
    const animatedInkBar = computed(() => typeof props.animated === "object" ? props.animated.inkBar === true : props.animated);
    const animatedTabPane = computed(() => typeof props.animated === "object" ? props.animated.tabPane === true : props.animated);
    const isExtraContentConfig = (value) => {
      return typeof value === "object" && value !== null && !Array.isArray(value) && ("left" in value || "right" in value);
    };
    const extraContentConfig = computed(() => {
      if (isExtraContentConfig(props.tabBarExtraContent)) {
        return props.tabBarExtraContent;
      }
      return props.tabBarExtraContent !== void 0 ? { right: props.tabBarExtraContent } : {};
    });
    const leftExtraContent = computed(() => extraContentConfig.value.left);
    const rightExtraContent = computed(() => extraContentConfig.value.right);
    const hasLeftExtra = computed(() => hasRenderable(leftExtraContent.value));
    const hasRightExtra = computed(() => hasRenderable(rightExtraContent.value));
    const tabsClass = computed(() => {
      var _a;
      return [
        `aheart-tabs--${props.type}`,
        `aheart-tabs--${resolvedSize.value}`,
        `aheart-tabs--placement-${resolvedPlacement.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-centered": props.centered,
          "is-ink-bar-animated": animatedInkBar.value,
          "is-tab-pane-animated": animatedTabPane.value
        }
      ];
    });
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const navClass = computed(() => {
      var _a;
      return ["aheart-tabs__nav", (_a = props.classNames) == null ? void 0 : _a.nav];
    });
    const navStyle = computed(() => {
      var _a;
      return [props.tabBarStyle, (_a = props.styles) == null ? void 0 : _a.nav];
    });
    const navListClass = computed(() => {
      var _a;
      return ["aheart-tabs__nav-list", (_a = props.classNames) == null ? void 0 : _a.navList];
    });
    const navListStyle = computed(() => {
      var _a;
      return [
        props.tabBarGutter !== void 0 ? { "--aheart-tabs-gutter": `${props.tabBarGutter}px` } : void 0,
        (_a = props.styles) == null ? void 0 : _a.navList
      ];
    });
    const tabIconClass = computed(() => {
      var _a;
      return ["aheart-tabs__tab-icon", (_a = props.classNames) == null ? void 0 : _a.tabIcon];
    });
    const tabIconStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.tabIcon;
    });
    const tabLabelClass = computed(() => {
      var _a;
      return ["aheart-tabs__tab-label", (_a = props.classNames) == null ? void 0 : _a.tabLabel];
    });
    const tabLabelStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.tabLabel;
    });
    const panelClass = computed(() => {
      var _a;
      return ["aheart-tabs__panel", (_a = props.classNames) == null ? void 0 : _a.panel];
    });
    const panelStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.panel;
    });
    const extraLeftClass = computed(() => {
      var _a, _b;
      return ["aheart-tabs__extra", "aheart-tabs__extra--left", (_a = props.classNames) == null ? void 0 : _a.extra, (_b = props.classNames) == null ? void 0 : _b.extraLeft];
    });
    const extraLeftStyle = computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.extra, (_b = props.styles) == null ? void 0 : _b.extraLeft];
    });
    const extraRightClass = computed(() => {
      var _a, _b;
      return ["aheart-tabs__extra", "aheart-tabs__extra--right", (_a = props.classNames) == null ? void 0 : _a.extra, (_b = props.classNames) == null ? void 0 : _b.extraRight];
    });
    const extraRightStyle = computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.extra, (_b = props.styles) == null ? void 0 : _b.extraRight];
    });
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
    const getTabClass = (item) => {
      var _a, _b, _c, _d;
      return [
        (_a = props.classNames) == null ? void 0 : _a.tab,
        ((_b = props.indicator) == null ? void 0 : _b.align) ? `aheart-tabs__tab--indicator-${props.indicator.align}` : void 0,
        {
          "is-active": item.key === mergedActiveKey.value,
          [String((_c = props.classNames) == null ? void 0 : _c.activeTab)]: item.key === mergedActiveKey.value && ((_d = props.classNames) == null ? void 0 : _d.activeTab)
        }
      ];
    };
    const getTabStyle = (item) => {
      var _a, _b, _c;
      return [
        ((_a = props.indicator) == null ? void 0 : _a.size) !== void 0 ? { "--aheart-tabs-indicator-size": `${props.indicator.size}px` } : void 0,
        (_b = props.styles) == null ? void 0 : _b.tab,
        item.key === mergedActiveKey.value ? (_c = props.styles) == null ? void 0 : _c.activeTab : void 0
      ];
    };
    const handleTabClick = (item, event) => {
      if (item.disabled) {
        return;
      }
      emit("tabClick", item.key, event);
      if (item.key === mergedActiveKey.value) {
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
        class: normalizeClass(["aheart-tabs", tabsClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        createElementVNode("div", {
          class: normalizeClass(navClass.value),
          style: normalizeStyle(navStyle.value)
        }, [
          hasLeftExtra.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(extraLeftClass.value),
            style: normalizeStyle(extraLeftStyle.value)
          }, [
            renderSlot(_ctx.$slots, "extraLeft", {}, () => [
              createVNode(unref(ARenderNode), { node: leftExtraContent.value }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("div", {
            class: normalizeClass(navListClass.value),
            style: normalizeStyle(navListStyle.value),
            role: "tablist"
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
              return openBlock(), createElementBlock("button", {
                id: getTabId(item.key),
                key: item.key,
                class: normalizeClass(["aheart-tabs__tab", getTabClass(item)]),
                style: normalizeStyle(getTabStyle(item)),
                type: "button",
                role: "tab",
                "aria-selected": item.key === mergedActiveKey.value ? "true" : "false",
                "aria-controls": getPanelId(item.key),
                disabled: item.disabled,
                tabindex: item.key === mergedActiveKey.value ? 0 : -1,
                onClick: ($event) => handleTabClick(item, $event)
              }, [
                hasRenderable(item.icon) ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass(tabIconClass.value),
                  style: normalizeStyle(tabIconStyle.value),
                  "aria-hidden": "true"
                }, [
                  createVNode(unref(ARenderNode), {
                    node: item.icon
                  }, null, 8, ["node"])
                ], 6)) : createCommentVNode("", true),
                createElementVNode("span", {
                  class: normalizeClass(tabLabelClass.value),
                  style: normalizeStyle(tabLabelStyle.value)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: item.label
                  }, null, 8, ["node"])
                ], 6)
              ], 14, _hoisted_1);
            }), 128))
          ], 6),
          hasRightExtra.value ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(extraRightClass.value),
            style: normalizeStyle(extraRightStyle.value)
          }, [
            renderSlot(_ctx.$slots, "extraRight", {}, () => [
              createVNode(unref(ARenderNode), { node: rightExtraContent.value }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6),
        activeItem.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          id: getPanelId(activeItem.value.key),
          class: normalizeClass(panelClass.value),
          style: normalizeStyle(panelStyle.value),
          role: "tabpanel",
          "aria-labelledby": getTabId(activeItem.value.key)
        }, [
          activeSlotName.value ? renderSlot(_ctx.$slots, activeSlotName.value, { key: 0 }, () => [
            createVNode(unref(ARenderNode), {
              node: activeItem.value.children
            }, null, 8, ["node"])
          ]) : createCommentVNode("", true)
        ], 14, _hoisted_2)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
