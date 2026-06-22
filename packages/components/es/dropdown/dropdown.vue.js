import { defineComponent, useSlots, ref, computed, h, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, withDirectives, createCommentVNode, createVNode, unref, vShow } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import Menu from "../menu/index.js";
import { dropdownProps, dropdownEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["aria-expanded", "aria-disabled"];
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
    const slots = useSlots();
    const ARenderNode = defineComponent({
      name: "ADropdownRenderNode",
      props: {
        node: null
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const innerOpen = ref(props.defaultOpen);
    const hasRenderedOverlay = ref(Boolean(props.defaultOpen || props.open));
    const isControlled = computed(() => props.open !== void 0);
    const mergedOpen = computed(() => props.open ?? innerOpen.value);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const triggerSet = computed(() => new Set(props.trigger));
    const shouldDestroyOnHidden = computed(() => props.destroyOnHidden || props.destroyPopupOnHide);
    const hasMenu = computed(() => {
      var _a, _b;
      return Boolean((_b = (_a = props.menu) == null ? void 0 : _a.items) == null ? void 0 : _b.length);
    });
    const hasOverlayContent = computed(() => hasMenu.value || Boolean(slots.popup || props.popupRender || props.dropdownRender));
    const shouldRenderOverlay = computed(
      () => hasOverlayContent.value && (mergedOpen.value || !shouldDestroyOnHidden.value && hasRenderedOverlay.value)
    );
    const dropdownClass = computed(() => {
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
    const rootStyle = computed(() => {
      var _a;
      return [props.style, (_a = props.styles) == null ? void 0 : _a.root];
    });
    const triggerClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.trigger;
    });
    const triggerStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.trigger;
    });
    const overlayClass = computed(() => {
      var _a;
      return [
        `aheart-dropdown__overlay--${props.placement}`,
        props.overlayClassName,
        (_a = props.classNames) == null ? void 0 : _a.popup
      ];
    });
    const overlayStyle = computed(() => {
      var _a;
      return [props.overlayStyle, (_a = props.styles) == null ? void 0 : _a.popup];
    });
    const menuClass = computed(() => {
      var _a;
      return (_a = props.classNames) == null ? void 0 : _a.menu;
    });
    const menuStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.menu;
    });
    const showArrow = computed(() => props.arrow !== false);
    const arrowPointsAtCenter = computed(() => {
      var _a;
      return typeof props.arrow === "object" && ((_a = props.arrow) == null ? void 0 : _a.pointAtCenter) === true;
    });
    const arrowClass = computed(() => {
      var _a;
      return [
        (_a = props.classNames) == null ? void 0 : _a.arrow,
        {
          "aheart-dropdown__arrow--point-at-center": arrowPointsAtCenter.value
        }
      ];
    });
    const arrowStyle = computed(() => {
      var _a;
      return (_a = props.styles) == null ? void 0 : _a.arrow;
    });
    const defaultMenuNode = computed(() => {
      var _a, _b, _c, _d;
      if (!hasMenu.value) {
        return null;
      }
      return h(
        "div",
        {
          class: ["aheart-dropdown__menu", menuClass.value],
          style: menuStyle.value
        },
        [
          h(Menu, {
            items: (_a = props.menu) == null ? void 0 : _a.items,
            selectable: ((_b = props.menu) == null ? void 0 : _b.selectable) ?? false,
            selectedKeys: (_c = props.menu) == null ? void 0 : _c.selectedKeys,
            defaultSelectedKeys: (_d = props.menu) == null ? void 0 : _d.defaultSelectedKeys,
            onClick: handleMenuClick
          })
        ]
      );
    });
    const popupContent = computed(() => {
      const menus = defaultMenuNode.value;
      if (props.popupRender) {
        return props.popupRender(menus);
      }
      if (props.dropdownRender) {
        return props.dropdownRender(menus);
      }
      return menus;
    });
    watch(
      () => props.defaultOpen,
      (open) => {
        if (!isControlled.value) {
          innerOpen.value = open;
        }
      }
    );
    watch(
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
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["aheart-dropdown", dropdownClass.value]),
        style: normalizeStyle(rootStyle.value),
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave
      }, [
        createElementVNode("span", {
          class: normalizeClass(["aheart-dropdown__trigger", triggerClass.value]),
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": isDisabled.value ? "true" : void 0,
          style: normalizeStyle(triggerStyle.value),
          onClick: handleTriggerClick,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onContextmenu: handleContextmenu
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 46, _hoisted_1),
        shouldRenderOverlay.value ? withDirectives((openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["aheart-dropdown__overlay", overlayClass.value]),
          style: normalizeStyle(overlayStyle.value),
          role: "presentation"
        }, [
          showArrow.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-dropdown__arrow", arrowClass.value]),
            style: normalizeStyle(arrowStyle.value),
            "aria-hidden": "true"
          }, null, 6)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "popup", {}, () => [
            createVNode(unref(ARenderNode), { node: popupContent.value }, null, 8, ["node"])
          ])
        ], 6)), [
          [vShow, mergedOpen.value]
        ]) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};
