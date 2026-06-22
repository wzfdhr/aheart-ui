"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const index = require("../menu/index.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = ["aria-expanded", "aria-disabled"];
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
    const slots = vue.useSlots();
    const ARenderNode = vue.defineComponent({
      name: "ADropdownRenderNode",
      props: {
        node: null
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const innerOpen = vue.ref(props.defaultOpen);
    const hasRenderedOverlay = vue.ref(Boolean(props.defaultOpen || props.open));
    const isControlled = vue.computed(() => props.open !== void 0);
    const mergedOpen = vue.computed(() => props.open ?? innerOpen.value);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = vue.computed(() => new Set(props.trigger));
    const shouldDestroyOnHidden = vue.computed(() => props.destroyOnHidden || props.destroyPopupOnHide);
    const hasMenu = vue.computed(() => {
      var _a, _b;
      return Boolean((_b = (_a = props.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length);
    });
    const hasOverlayContent = vue.computed(() => hasMenu.value || Boolean(slots.popup || props.popupRender || props.dropdownRender));
    const shouldRenderOverlay = vue.computed(
      () => hasOverlayContent.value && (mergedOpen.value || !shouldDestroyOnHidden.value && hasRenderedOverlay.value)
    );
    const dropdownClass = vue.computed(() => {
      var _a;
      return [
        props.className,
        props.rootClassName,
        (_a = props.classNames) == null ? void 0 : _a.root,
        {
          "is-open": mergedOpen.value,
          "is-disabled": isDisabled.value
        }
      ];
    });
    const rootStyle = vue.computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const overlayClass = vue.computed(() => {
      var _a;
      return [
        `aheart-dropdown__overlay--${props.placement}`,
        props.overlayClassName,
        (_a = props.classNames) == null ? void 0 : _a.popup
      ];
    });
    const overlayStyle = vue.computed(() => {
      var _a;
      return [props.overlayStyle, (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const menuClass = vue.computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.menu;
    });
    const menuStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.menu;
    });
    const showArrow = vue.computed(() => props.arrow !== false);
    const arrowPointsAtCenter = vue.computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = vue.computed(() => {
      var _a;
      return [
        (_a = props.classNames) == null ? void 0 : _a.arrow,
        {
          "aheart-dropdown__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = vue.computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
    const defaultMenuNode = vue.computed(() => {
      var _a, _b, _c, _d;
      if (!hasMenu.value) {
        return null;
      }
      return vue.h(
        "div",
        {
          class: ["aheart-dropdown__menu", menuClass.value],
          style: menuStyle.value
        },
        [
          vue.h(index.default, {
            items: (_a = props.menu) == null ? void 0 : _a.items,
            selectable: ((_b = props.menu) == null ? void 0 : _b.selectable) ?? false,
            selectedKeys: (_c = props.menu) == null ? void 0 : _c.selectedKeys,
            defaultSelectedKeys: (_d = props.menu) == null ? void 0 : _d.defaultSelectedKeys,
            onClick: handleMenuClick
          })
        ]
      );
    });
    const popupContent = vue.computed(() => {
      const menus = defaultMenuNode.value;
      if (props.popupRender) {
        return props.popupRender(menus);
      }
      if (props.dropdownRender) {
        return props.dropdownRender(menus);
      }
      return menus;
    });
    vue.watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    vue.watch(
      mergedOpen,
      (open) => {
        if (open) {
          hasRenderedOverlay.value = true;
        }
      },
      { immediate: true }
    );
    const setOpen = (open, options = {}) => {
      if (isDisabled.value) {
        return;
      }
      const { source = "trigger", emitOpenChange = true } = options;
      if (!isControlled.value) {
        innerOpen.value = open;
      }
      emit("update:open", open);
      if (emitOpenChange) {
        emit("openChange", open, { source });
      }
    };
    const handleTriggerClick = () => {
      if (!triggerSet.value.has("click")) {
        return;
      }
      setOpen(!mergedOpen.value, { source: "trigger" });
    };
    const handleMouseEnter = () => {
      if (triggerSet.value.has("hover")) {
        setOpen(true, { source: "trigger" });
      }
    };
    const handleMouseLeave = () => {
      if (triggerSet.value.has("hover")) {
        setOpen(false, { source: "trigger" });
      }
    };
    const handleContextmenu = (event) => {
      if (triggerSet.value.has("contextMenu")) {
        event.preventDefault();
        setOpen(true, { source: "trigger" });
      }
    };
    const handleMenuClick = (info) => {
      var _a;
      emit("click", info);
      if (((_a = props.menu) == null ? void 0 : _a.closeOnClick) === false) {
        return;
      }
      setOpen(false, { source: "menu", emitOpenChange: false });
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-dropdown", dropdownClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(["aheart-dropdown__trigger", triggerClass.value]),
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": isDisabled.value ? "true" : void 0,
          style: vue.normalizeStyle(triggerStyle.value),
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onContextmenu: handleContextmenu
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 46, _hoisted_1),
        shouldRenderOverlay.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
          style: vue.normalizeStyle(overlayStyle.value),
          role: "presentation"
        }, [
          showArrow.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-dropdown__arrow", arrowClass.value]),
            style: vue.normalizeStyle(arrowStyle.value),
            "aria-hidden": "true"
          }, null, 6)) : vue.createCommentVNode("", true),
          vue.renderSlot(_ctx.$slots, "popup", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: popupContent.value }, null, 8, ["node"])
          ])
        ], 6)), [
          [vue.vShow, mergedOpen.value]
        ]) : vue.createCommentVNode("", true)
      ], 38);
    };
  }
});
exports.default = _sfc_main;
