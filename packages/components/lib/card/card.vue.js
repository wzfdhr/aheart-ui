"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick"];
const _hoisted_2 = ["id", "role", "aria-labelledby"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ACard"
  },
  __name: "card",
  props: types.cardProps,
  emits: types.cardEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const ARenderNode = vue.defineComponent({
      name: "ACardRenderNode",
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
    const hasRenderable = (value) => value !== void 0 && value !== null && value !== false && value !== "";
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const hasHeader = vue.computed(() => Boolean(slots.title) || hasRenderable(props.title) || Boolean(slots.extra) || hasRenderable(props.extra));
    const hasExtra = vue.computed(() => Boolean(slots.extra) || hasRenderable(props.extra));
    const isBorderless = vue.computed(() => {
      if (props.variant) {
        return props.variant === "borderless";
      }
      return !props.bordered;
    });
    const showActions = vue.computed(() => {
      var _a;
      return Boolean(slots.actions) || Boolean((_a = props.actions) == null ? void 0 : _a.length);
    });
    const tabList = vue.computed(() => props.tabList ?? []);
    const hasTabs = vue.computed(() => tabList.value.length > 0);
    const firstEnabledTabKey = vue.computed(() => {
      var _a, _b;
      return ((_a = tabList.value.find((tab) => !tab.disabled)) == null ? void 0 : _a.key) ?? ((_b = tabList.value[0]) == null ? void 0 : _b.key);
    });
    const innerActiveTabKey = vue.ref(props.defaultActiveTabKey ?? firstEnabledTabKey.value);
    const isActiveTabControlled = vue.computed(() => props.activeTabKey !== void 0);
    const mergedActiveTabKey = vue.computed(() => props.activeTabKey ?? innerActiveTabKey.value ?? firstEnabledTabKey.value);
    const activeTab = vue.computed(() => tabList.value.find((tab) => tab.key === mergedActiveTabKey.value));
    const activeTabSlotName = vue.computed(() => activeTab.value ? `tab-${activeTab.value.key}` : void 0);
    const activeTabId = vue.computed(() => activeTab.value ? getTabId(activeTab.value.key) : void 0);
    const activeTabPanelId = vue.computed(() => activeTab.value ? getTabPanelId(activeTab.value.key) : void 0);
    const hasActiveTabSlot = vue.computed(() => Boolean(activeTabSlotName.value && slots[activeTabSlotName.value]));
    const activeTabChildren = vue.computed(() => {
      var _a;
      return (_a = activeTab.value) == null ? void 0 : _a.children;
    });
    const hasActiveTabChildren = vue.computed(() => hasRenderable(activeTabChildren.value));
    const hasTabExtra = vue.computed(() => Boolean(slots.tabBarExtraContent) || hasRenderable(props.tabBarExtraContent));
    const cardClass = vue.computed(() => {
      var _a;
      return [
        `aheart-card--${resolvedSize.value}`,
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-borderless": isBorderless.value,
          "aheart-card--inner": props.type === "inner",
          "is-hoverable": props.hoverable,
          "is-loading": props.loading
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const coverClass = vue.computed(() => {
      var _a;
      return ["aheart-card__cover", (_a = props.classNames) == null ? void 0 : _a.cover];
    });
    const coverStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cover;
    });
    const headerClass = vue.computed(() => {
      var _a;
      return ["aheart-card__header", (_a = props.classNames) == null ? void 0 : _a.header];
    });
    const headerStyle = vue.computed(() => {
      var _a;
      return [props.headStyle, (_a = props.styles) == null ? void 0 : _a.header];
    });
    const titleClass = vue.computed(() => {
      var _a;
      return ["aheart-card__title", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const titleStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const extraClass = vue.computed(() => {
      var _a;
      return ["aheart-card__extra", (_a = props.classNames) == null ? void 0 : _a.extra];
    });
    const extraStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.extra;
    });
    const bodyClass = vue.computed(() => {
      var _a;
      return ["aheart-card__body", (_a = props.classNames) == null ? void 0 : _a.body];
    });
    const bodyStyleValue = vue.computed(() => {
      var _a;
      return [props.bodyStyle, (_a = props.styles) == null ? void 0 : _a.body];
    });
    const actionsClass = vue.computed(() => {
      var _a;
      return ["aheart-card__actions", (_a = props.classNames) == null ? void 0 : _a.actions];
    });
    const actionsStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    const tabRootClass = vue.computed(() => {
      var _a, _b, _c, _d;
      return [
        "aheart-card__tabs",
        (_a = props.tabProps) == null ? void 0 : _a.className,
        (_b = props.tabProps) == null ? void 0 : _b.rootClassName,
        (_d = (_c = props.tabProps) == null ? void 0 : _c.classNames) == null ? void 0 : _d.root
      ];
    });
    const tabRootStyle = vue.computed(() => {
      var _a, _b, _c;
      return [(_a = props.tabProps) == null ? void 0 : _a.style, (_c = (_b = props.tabProps) == null ? void 0 : _b.styles) == null ? void 0 : _c.root];
    });
    const tabListClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-card__tab-list", (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.list];
    });
    const tabListStyle = vue.computed(() => {
      var _a, _b, _c;
      return [
        ((_a = props.tabProps) == null ? void 0 : _a.tabBarGutter) !== void 0 ? {
          "--aheart-card-tab-gutter": `${props.tabProps.tabBarGutter}px`
        } : void 0,
        (_c = (_b = props.tabProps) == null ? void 0 : _b.styles) == null ? void 0 : _c.list
      ];
    });
    const tabLabelClass = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.tabLabel;
    });
    const tabLabelStyle = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.styles) == null ? void 0 : _b.tabLabel;
    });
    const tabExtraClass = vue.computed(() => {
      var _a, _b;
      return ["aheart-card__tab-extra", (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.extra];
    });
    const tabExtraStyle = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.styles) == null ? void 0 : _b.extra;
    });
    vue.watch(
      tabList,
      () => {
        if (!mergedActiveTabKey.value || !tabList.value.some((tab) => tab.key === mergedActiveTabKey.value)) {
          innerActiveTabKey.value = props.defaultActiveTabKey ?? firstEnabledTabKey.value;
        }
      },
      { deep: true }
    );
    const getTabId = (key) => `aheart-card-tab-${key}`;
    const getTabPanelId = (key) => `aheart-card-tab-panel-${key}`;
    const getTabClass = (tab) => {
      var _a, _b, _c, _d;
      return [
        (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.tab,
        tab.key === mergedActiveTabKey.value ? (_d = (_c = props.tabProps) == null ? void 0 : _c.classNames) == null ? void 0 : _d.activeTab : void 0,
        {
          "is-active": tab.key === mergedActiveTabKey.value,
          "is-disabled": tab.disabled
        }
      ];
    };
    const getTabStyle = (tab) => {
      var _a, _b, _c, _d;
      return [
        (_b = (_a = props.tabProps) == null ? void 0 : _a.styles) == null ? void 0 : _b.tab,
        tab.key === mergedActiveTabKey.value ? (_d = (_c = props.tabProps) == null ? void 0 : _c.styles) == null ? void 0 : _d.activeTab : void 0
      ];
    };
    const handleTabClick = (tab) => {
      if (tab.disabled || tab.key === mergedActiveTabKey.value) {
        return;
      }
      if (!isActiveTabControlled.value) {
        innerActiveTabKey.value = tab.key;
      }
      emit("update:activeTabKey", tab.key);
      emit("tabChange", tab.key);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("section", {
        class: vue.normalizeClass(["aheart-card", cardClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        role: "region"
      }, [
        _ctx.$slots.cover ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(coverClass.value),
          style: vue.normalizeStyle(coverStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "cover")
        ], 6)) : vue.createCommentVNode("", true),
        hasHeader.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(headerClass.value),
          style: vue.normalizeStyle(headerStyle.value)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(titleClass.value),
            style: vue.normalizeStyle(titleStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
            ])
          ], 6),
          hasExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(extraClass.value),
            style: vue.normalizeStyle(extraStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.extra }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true),
        hasTabs.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(tabRootClass.value),
          style: vue.normalizeStyle(tabRootStyle.value)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(tabListClass.value),
            style: vue.normalizeStyle(tabListStyle.value),
            role: "tablist"
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(tabList.value, (tab) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                id: getTabId(tab.key),
                key: tab.key,
                class: vue.normalizeClass(["aheart-card__tab", getTabClass(tab)]),
                style: vue.normalizeStyle(getTabStyle(tab)),
                type: "button",
                role: "tab",
                "aria-selected": tab.key === mergedActiveTabKey.value ? "true" : "false",
                "aria-controls": getTabPanelId(tab.key),
                disabled: tab.disabled,
                tabindex: tab.key === mergedActiveTabKey.value ? 0 : -1,
                onClick: ($event) => handleTabClick(tab)
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(["aheart-card__tab-label", tabLabelClass.value]),
                  style: vue.normalizeStyle(tabLabelStyle.value)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: tab.tab
                  }, null, 8, ["node"])
                ], 6)
              ], 14, _hoisted_1);
            }), 128))
          ], 6),
          hasTabExtra.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(tabExtraClass.value),
            style: vue.normalizeStyle(tabExtraStyle.value)
          }, [
            vue.renderSlot(_ctx.$slots, "tabBarExtraContent", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.tabBarExtraContent }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true)
        ], 6)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          id: activeTabPanelId.value,
          class: vue.normalizeClass(bodyClass.value),
          style: vue.normalizeStyle(bodyStyleValue.value),
          role: hasTabs.value ? "tabpanel" : void 0,
          "aria-labelledby": activeTabId.value
        }, [
          _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [..._cache[0] || (_cache[0] = [
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            vue.createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : hasActiveTabSlot.value ? vue.renderSlot(_ctx.$slots, activeTabSlotName.value, { key: 1 }) : hasActiveTabChildren.value ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
            key: 2,
            node: activeTabChildren.value
          }, null, 8, ["node"])) : vue.renderSlot(_ctx.$slots, "default", { key: 3 })
        ], 14, _hoisted_2),
        showActions.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 3,
          class: vue.normalizeClass(actionsClass.value),
          style: vue.normalizeStyle(actionsStyle.value)
        }, [
          vue.renderSlot(_ctx.$slots, "actions", {}, () => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.actions, (action, index) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: index,
                class: "aheart-card__action"
              }, [
                vue.createVNode(vue.unref(ARenderNode), { node: action }, null, 8, ["node"])
              ]);
            }), 128))
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
