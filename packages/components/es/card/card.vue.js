import { defineComponent, useSlots, computed, ref, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createCommentVNode, createElementVNode, createVNode, unref, Fragment, renderList, createBlock } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { cardProps, cardEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["id", "aria-selected", "aria-controls", "disabled", "tabindex", "onClick"];
const _hoisted_2 = ["id", "role", "aria-labelledby"];
const _hoisted_3 = {
  key: 0,
  class: "aheart-card__loading",
  "aria-busy": "true",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ACard"
  },
  __name: "card",
  props: cardProps,
  emits: cardEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const ARenderNode = defineComponent({
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
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const hasHeader = computed(() => Boolean(slots.title) || hasRenderable(props.title) || Boolean(slots.extra) || hasRenderable(props.extra));
    const hasExtra = computed(() => Boolean(slots.extra) || hasRenderable(props.extra));
    const isBorderless = computed(() => {
      if (props.variant) {
        return props.variant === "borderless";
      }
      return !props.bordered;
    });
    const showActions = computed(() => {
      var _a;
      return Boolean(slots.actions) || Boolean((_a = props.actions) == null ? void 0 : _a.length);
    });
    const tabList = computed(() => props.tabList ?? []);
    const hasTabs = computed(() => tabList.value.length > 0);
    const firstEnabledTabKey = computed(() => {
      var _a, _b;
      return ((_a = tabList.value.find((tab) => !tab.disabled)) == null ? void 0 : _a.key) ?? ((_b = tabList.value[0]) == null ? void 0 : _b.key);
    });
    const innerActiveTabKey = ref(props.defaultActiveTabKey ?? firstEnabledTabKey.value);
    const isActiveTabControlled = computed(() => props.activeTabKey !== void 0);
    const mergedActiveTabKey = computed(() => props.activeTabKey ?? innerActiveTabKey.value ?? firstEnabledTabKey.value);
    const activeTab = computed(() => tabList.value.find((tab) => tab.key === mergedActiveTabKey.value));
    const activeTabSlotName = computed(() => activeTab.value ? `tab-${activeTab.value.key}` : void 0);
    const activeTabId = computed(() => activeTab.value ? getTabId(activeTab.value.key) : void 0);
    const activeTabPanelId = computed(() => activeTab.value ? getTabPanelId(activeTab.value.key) : void 0);
    const hasActiveTabSlot = computed(() => Boolean(activeTabSlotName.value && slots[activeTabSlotName.value]));
    const activeTabChildren = computed(() => {
      var _a;
      return (_a = activeTab.value) == null ? void 0 : _a.children;
    });
    const hasActiveTabChildren = computed(() => hasRenderable(activeTabChildren.value));
    const hasTabExtra = computed(() => Boolean(slots.tabBarExtraContent) || hasRenderable(props.tabBarExtraContent));
    const cardClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const coverClass = computed(() => {
      var _a;
      return ["aheart-card__cover", (_a = props.classNames) == null ? void 0 : _a.cover];
    });
    const coverStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.cover;
    });
    const headerClass = computed(() => {
      var _a;
      return ["aheart-card__header", (_a = props.classNames) == null ? void 0 : _a.header];
    });
    const headerStyle = computed(() => {
      var _a;
      return [props.headStyle, (_a = props.styles) == null ? void 0 : _a.header];
    });
    const titleClass = computed(() => {
      var _a;
      return ["aheart-card__title", (_a = props.classNames) == null ? void 0 : _a.title];
    });
    const titleStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.title;
    });
    const extraClass = computed(() => {
      var _a;
      return ["aheart-card__extra", (_a = props.classNames) == null ? void 0 : _a.extra];
    });
    const extraStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.extra;
    });
    const bodyClass = computed(() => {
      var _a;
      return ["aheart-card__body", (_a = props.classNames) == null ? void 0 : _a.body];
    });
    const bodyStyleValue = computed(() => {
      var _a;
      return [props.bodyStyle, (_a = props.styles) == null ? void 0 : _a.body];
    });
    const actionsClass = computed(() => {
      var _a;
      return ["aheart-card__actions", (_a = props.classNames) == null ? void 0 : _a.actions];
    });
    const actionsStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.actions;
    });
    const tabRootClass = computed(() => {
      var _a, _b, _c, _d;
      return [
        "aheart-card__tabs",
        (_a = props.tabProps) == null ? void 0 : _a.className,
        (_b = props.tabProps) == null ? void 0 : _b.rootClassName,
        (_d = (_c = props.tabProps) == null ? void 0 : _c.classNames) == null ? void 0 : _d.root
      ];
    });
    const tabRootStyle = computed(() => {
      var _a, _b, _c;
      return [(_a = props.tabProps) == null ? void 0 : _a.style, (_c = (_b = props.tabProps) == null ? void 0 : _b.styles) == null ? void 0 : _c.root];
    });
    const tabListClass = computed(() => {
      var _a, _b;
      return ["aheart-card__tab-list", (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.list];
    });
    const tabListStyle = computed(() => {
      var _a, _b, _c;
      return [
        ((_a = props.tabProps) == null ? void 0 : _a.tabBarGutter) !== void 0 ? {
          "--aheart-card-tab-gutter": `${props.tabProps.tabBarGutter}px`
        } : void 0,
        (_c = (_b = props.tabProps) == null ? void 0 : _b.styles) == null ? void 0 : _c.list
      ];
    });
    const tabLabelClass = computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.tabLabel;
    });
    const tabLabelStyle = computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.styles) == null ? void 0 : _b.tabLabel;
    });
    const tabExtraClass = computed(() => {
      var _a, _b;
      return ["aheart-card__tab-extra", (_b = (_a = props.tabProps) == null ? void 0 : _a.classNames) == null ? void 0 : _b.extra];
    });
    const tabExtraStyle = computed(() => {
      var _a, _b;
      return (_b = (_a = props.tabProps) == null ? void 0 : _a.styles) == null ? void 0 : _b.extra;
    });
    watch(
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
      return openBlock(), createElementBlock("section", {
        class: normalizeClass(["aheart-card", cardClass.value]),
        style: normalizeStyle(rootStyle.value),
        role: "region"
      }, [
        _ctx.$slots.cover ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(coverClass.value),
          style: normalizeStyle(coverStyle.value)
        }, [
          renderSlot(_ctx.$slots, "cover")
        ], 6)) : createCommentVNode("", true),
        hasHeader.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(headerClass.value),
          style: normalizeStyle(headerStyle.value)
        }, [
          createElementVNode("div", {
            class: normalizeClass(titleClass.value),
            style: normalizeStyle(titleStyle.value)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.title }, null, 8, ["node"])
            ])
          ], 6),
          hasExtra.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(extraClass.value),
            style: normalizeStyle(extraStyle.value)
          }, [
            renderSlot(_ctx.$slots, "extra", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.extra }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true),
        hasTabs.value ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(tabRootClass.value),
          style: normalizeStyle(tabRootStyle.value)
        }, [
          createElementVNode("div", {
            class: normalizeClass(tabListClass.value),
            style: normalizeStyle(tabListStyle.value),
            role: "tablist"
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(tabList.value, (tab) => {
              return openBlock(), createElementBlock("button", {
                id: getTabId(tab.key),
                key: tab.key,
                class: normalizeClass(["aheart-card__tab", getTabClass(tab)]),
                style: normalizeStyle(getTabStyle(tab)),
                type: "button",
                role: "tab",
                "aria-selected": tab.key === mergedActiveTabKey.value ? "true" : "false",
                "aria-controls": getTabPanelId(tab.key),
                disabled: tab.disabled,
                tabindex: tab.key === mergedActiveTabKey.value ? 0 : -1,
                onClick: ($event) => handleTabClick(tab)
              }, [
                createElementVNode("span", {
                  class: normalizeClass(["aheart-card__tab-label", tabLabelClass.value]),
                  style: normalizeStyle(tabLabelStyle.value)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: tab.tab
                  }, null, 8, ["node"])
                ], 6)
              ], 14, _hoisted_1);
            }), 128))
          ], 6),
          hasTabExtra.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(tabExtraClass.value),
            style: normalizeStyle(tabExtraStyle.value)
          }, [
            renderSlot(_ctx.$slots, "tabBarExtraContent", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.tabBarExtraContent }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true)
        ], 6)) : createCommentVNode("", true),
        createElementVNode("div", {
          id: activeTabPanelId.value,
          class: normalizeClass(bodyClass.value),
          style: normalizeStyle(bodyStyleValue.value),
          role: hasTabs.value ? "tabpanel" : void 0,
          "aria-labelledby": activeTabId.value
        }, [
          _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[0] || (_cache[0] = [
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line" }, null, -1),
            createElementVNode("span", { class: "aheart-card__loading-line is-short" }, null, -1)
          ])])) : hasActiveTabSlot.value ? renderSlot(_ctx.$slots, activeTabSlotName.value, { key: 1 }) : hasActiveTabChildren.value ? (openBlock(), createBlock(unref(ARenderNode), {
            key: 2,
            node: activeTabChildren.value
          }, null, 8, ["node"])) : renderSlot(_ctx.$slots, "default", { key: 3 })
        ], 14, _hoisted_2),
        showActions.value ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: normalizeClass(actionsClass.value),
          style: normalizeStyle(actionsStyle.value)
        }, [
          renderSlot(_ctx.$slots, "actions", {}, () => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.actions, (action, index) => {
              return openBlock(), createElementBlock("span", {
                key: index,
                class: "aheart-card__action"
              }, [
                createVNode(unref(ARenderNode), { node: action }, null, 8, ["node"])
              ]);
            }), 128))
          ])
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
