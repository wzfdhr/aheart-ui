"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-orientation"];
const _hoisted_2 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick", "onKeydown"];
const _hoisted_3 = ["id", "aria-labelledby"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ATabs"
  },
  __name: "tabs",
  props: types.tabsProps,
  emits: types.tabsEmits,
  setup(__props, { emit: __emit }) {
    const ARenderNode = vue.defineComponent({
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
    const positionPlacementMap = {
      left: "start",
      right: "end",
      top: "top",
      bottom: "bottom"
    };
    const resolvedPlacement = vue.computed(() => props.tabPlacement ?? (props.tabPosition ? positionPlacementMap[props.tabPosition] : "top"));
    const tabOrientation = vue.computed(() => resolvedPlacement.value === "start" || resolvedPlacement.value === "end" ? "vertical" : "horizontal");
    const animatedInkBar = vue.computed(() => typeof props.animated === "object" ? props.animated.inkBar === true : props.animated);
    const animatedTabPane = vue.computed(() => typeof props.animated === "object" ? props.animated.tabPane === true : props.animated);
    const isExtraContentConfig = (value) => {
      return typeof value === "object" && value !== null && !Array.isArray(value) && ("left" in value || "right" in value);
    };
    const extraContentConfig = vue.computed(() => {
      if (isExtraContentConfig(props.tabBarExtraContent)) {
        return props.tabBarExtraContent;
      }
      return props.tabBarExtraContent !== void 0 ? { right: props.tabBarExtraContent } : {};
    });
    const leftExtraContent = vue.computed(() => extraContentConfig.value.left);
    const rightExtraContent = vue.computed(() => extraContentConfig.value.right);
    const hasLeftExtra = vue.computed(() => hasRenderable(leftExtraContent.value));
    const hasRightExtra = vue.computed(() => hasRenderable(rightExtraContent.value));
    const tabsClass = vue.computed(() => {
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
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const navClass = vue.computed(() => {
      var _a;
      return ["aheart-tabs__nav", (_a = props.classNames) == null ? void 0 : _a.nav];
    });
    const navStyle = vue.computed(() => {
      var _a;
      return [props.tabBarStyle, (_a = props.styles) == null ? void 0 : _a.nav];
    });
    const navListClass = vue.computed(() => {
      var _a;
      return ["aheart-tabs__nav-list", (_a = props.classNames) == null ? void 0 : _a.navList];
    });
    const navListStyle = vue.computed(() => {
      var _a;
      return [
        props.tabBarGutter !== void 0 ? { "--aheart-tabs-gutter": `${props.tabBarGutter}px` } : void 0,
        (_a = props.styles) == null ? void 0 : _a.navList
      ];
    });
    const tabIconClass = vue.computed(() => {
      var _a;
      return ["aheart-tabs__tab-icon", (_a = props.classNames) == null ? void 0 : _a.tabIcon];
    });
    const tabIconStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.tabIcon;
    });
    const tabLabelClass = vue.computed(() => {
      var _a;
      return ["aheart-tabs__tab-label", (_a = props.classNames) == null ? void 0 : _a.tabLabel];
    });
    const tabLabelStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.tabLabel;
    });
    const panelClass = vue.computed(() => {
      var _a;
      return ["aheart-tabs__panel", (_a = props.classNames) == null ? void 0 : _a.panel];
    });
    const panelStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.panel;
    });
    const extraLeftClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-tabs__extra", "aheart-tabs__extra--left", (_a = props.classNames) == null ? void 0 : _a.extra, (_b = props.classNames) == null ? void 0 : _b.extraLeft];
    });
    const extraLeftStyle = vue.computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.extra, (_b = props.styles) == null ? void 0 : _b.extraLeft];
    });
    const extraRightClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-tabs__extra", "aheart-tabs__extra--right", (_a = props.classNames) == null ? void 0 : _a.extra, (_b = props.classNames) == null ? void 0 : _b.extraRight];
    });
    const extraRightStyle = vue.computed(() => {
      var _a, _b;
      return [(_a = props.styles) == null ? void 0 : _a.extra, (_b = props.styles) == null ? void 0 : _b.extraRight];
    });
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
    const tabRefs = /* @__PURE__ */ new Map();
    const setTabRef = (key, element) => {
      if (element instanceof HTMLButtonElement)
        tabRefs.set(key, element);
      else
        tabRefs.delete(key);
    };
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
    const activateTab = (item) => {
      if (item.disabled)
        return;
      if (item.key === mergedActiveKey.value) {
        return;
      }
      if (!isControlled.value) {
        innerActiveKey.value = item.key;
      }
      emit("update:activeKey", item.key);
      emit("change", item.key);
    };
    const handleTabClick = (item, event) => {
      if (item.disabled)
        return;
      emit("tabClick", item.key, event);
      activateTab(item);
    };
    const handleTabKeydown = (item, event) => {
      const forwardKey = tabOrientation.value === "vertical" ? "ArrowDown" : "ArrowRight";
      const backwardKey = tabOrientation.value === "vertical" ? "ArrowUp" : "ArrowLeft";
      if (![forwardKey, backwardKey, "Home", "End"].includes(event.key))
        return;
      const enabledItems = normalizedItems.value.filter((candidate) => !candidate.disabled);
      if (!enabledItems.length)
        return;
      const currentIndex = Math.max(enabledItems.findIndex((candidate) => candidate.key === item.key), 0);
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? enabledItems.length - 1 : (currentIndex + (event.key === forwardKey ? 1 : -1) + enabledItems.length) % enabledItems.length;
      const nextItem = enabledItems[nextIndex];
      if (!nextItem)
        return;
      event.preventDefault();
      activateTab(nextItem);
      void vue.nextTick(() => {
        var _a;
        return (_a = tabRefs.get(nextItem.key)) == null ? void 0 : _a.focus();
      });
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-tabs", tabsClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(navClass.value),
          style: vue.normalizeStyle(navStyle.value)
        }, [
          hasLeftExtra.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(extraLeftClass.value),
            style: vue.normalizeStyle(extraLeftStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "extraLeft", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: leftExtraContent.value }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(navListClass.value),
            style: vue.normalizeStyle(navListStyle.value),
            role: "tablist",
            "aria-orientation": tabOrientation.value
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                id: getTabId(item.key),
                key: item.key,
                class: vue.normalizeClass(["aheart-tabs__tab", getTabClass(item)]),
                style: vue.normalizeStyle(getTabStyle(item)),
                type: "button",
                role: "tab",
                "aria-selected": item.key === mergedActiveKey.value ? "true" : "false",
                "aria-controls": getPanelId(item.key),
                disabled: item.disabled,
                tabindex: item.key === mergedActiveKey.value ? 0 : -1,
                ref_for: true,
                ref: (element) => setTabRef(item.key, element),
                onClick: ($event) => handleTabClick(item, $event),
                onKeydown: ($event) => handleTabKeydown(item, $event)
              }, [
                hasRenderable(item.icon) ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass(tabIconClass.value),
                  style: vue.normalizeStyle(tabIconStyle.value),
                  "aria-hidden": "true"
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: item.icon
                  }, null, 8, ["node"])
                ], 6)) : vue.createCommentVNode("", true),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(tabLabelClass.value),
                  style: vue.normalizeStyle(tabLabelStyle.value)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: item.label
                  }, null, 8, ["node"])
                ], 6)
              ], 46, _hoisted_2);
            }), 128))
          ], 14, _hoisted_1),
          hasRightExtra.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(extraRightClass.value),
            style: vue.normalizeStyle(extraRightStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "extraRight", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: rightExtraContent.value }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6),
        activeItem.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          id: getPanelId(activeItem.value.key),
          class: vue.normalizeClass(panelClass.value),
          style: vue.normalizeStyle(panelStyle.value),
          role: "tabpanel",
          "aria-labelledby": getTabId(activeItem.value.key)
        }, [
          activeSlotName.value ? vue.renderSlot(_ctx.$slots, activeSlotName.value, { key: 0 }, () => [
            vue.createVNode(vue.unref(ARenderNode), {
              node: activeItem.value.children
            }, null, 8, ["node"])
          ]) : vue.createCommentVNode("", true)
        ], 14, _hoisted_3)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
