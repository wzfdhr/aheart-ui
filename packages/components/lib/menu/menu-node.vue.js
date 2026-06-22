"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const _hoisted_1 = {
  class: "aheart-menu__group-list",
  role: "group"
};
const _hoisted_2 = ["data-submenu-key", "disabled", "aria-expanded", "title"];
const _hoisted_3 = ["data-menu-key", "disabled", "aria-current", "title"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AMenuNode"
  },
  __name: "menu-node",
  props: {
    item: {},
    level: { default: 0 },
    selectedKeys: {},
    openKeys: {},
    disabled: { type: Boolean, default: false },
    mode: { default: "vertical" },
    forceSubMenuRender: { type: Boolean, default: false },
    triggerSubMenuAction: { default: "click" },
    expandIcon: { type: [Object, String, Number, Boolean, null, Array, Function] },
    classNames: { default: () => ({}) },
    styles: { default: () => ({}) },
    keyPath: { default: () => [] }
  },
  emits: ["itemClick", "submenuToggle", "submenuOpenChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ARenderNode = vue.defineComponent({
      name: "AMenuRenderNode",
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
    const hasChildren = vue.computed(() => {
      var _a;
      return Boolean((_a = props.item.children) == null ? void 0 : _a.length);
    });
    const isOpen = vue.computed(() => props.openKeys.includes(props.item.key));
    const isSelected = vue.computed(() => props.selectedKeys.includes(props.item.key));
    const isDisabled = vue.computed(() => props.disabled || Boolean(props.item.disabled));
    const currentKeyPath = vue.computed(() => [...props.keyPath, props.item.key]);
    const nodeLevelStyle = vue.computed(() => ({ "--aheart-menu-node-level": props.level }));
    const expandIconNode = vue.computed(() => {
      if (typeof props.expandIcon === "function") {
        return props.expandIcon({
          item: props.item,
          isOpen: isOpen.value,
          disabled: isDisabled.value,
          level: props.level
        });
      }
      return props.expandIcon ?? "›";
    });
    const nodeClass = vue.computed(() => [
      `aheart-menu__node--level-${props.level}`,
      {
        "is-open": isOpen.value,
        "is-selected": isSelected.value,
        "is-disabled": isDisabled.value,
        "is-danger": props.item.danger
      }
    ]);
    const handleItemClick = () => {
      if (isDisabled.value) {
        return;
      }
      emit("itemClick", {
        key: props.item.key,
        keyPath: currentKeyPath.value,
        item: props.item
      });
    };
    const handleSubmenuClick = () => {
      if (isDisabled.value) {
        return;
      }
      if (props.triggerSubMenuAction !== "click") {
        return;
      }
      emit("submenuToggle", props.item.key);
    };
    const handleSubmenuMouseEnter = () => {
      if (isDisabled.value || props.triggerSubMenuAction !== "hover") {
        return;
      }
      emit("submenuOpenChange", { key: props.item.key, open: true });
    };
    const handleSubmenuMouseLeave = () => {
      if (isDisabled.value || props.triggerSubMenuAction !== "hover") {
        return;
      }
      emit("submenuOpenChange", { key: props.item.key, open: false });
    };
    return (_ctx, _cache) => {
      const _component_AMenuNode = vue.resolveComponent("AMenuNode");
      return __props.item.type === "divider" ? (vue.openBlock(), vue.createElementBlock("li", {
        key: 0,
        class: vue.normalizeClass(["aheart-menu__divider", [__props.classNames.divider, { "is-dashed": __props.item.dashed }]]),
        style: vue.normalizeStyle(__props.styles.divider),
        role: "separator"
      }, null, 6)) : __props.item.type === "group" ? (vue.openBlock(), vue.createElementBlock("li", {
        key: 1,
        class: vue.normalizeClass(["aheart-menu__group", __props.classNames.group]),
        style: vue.normalizeStyle(__props.styles.group),
        role: "presentation"
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["aheart-menu__group-title", __props.classNames.groupTitle]),
          style: vue.normalizeStyle(__props.styles.groupTitle)
        }, [
          vue.createVNode(vue.unref(ARenderNode), {
            node: __props.item.label
          }, null, 8, ["node"])
        ], 6),
        vue.createElementVNode("ul", _hoisted_1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.item.children ?? [], (child) => {
            return vue.openBlock(), vue.createBlock(_component_AMenuNode, {
              key: child.key,
              item: child,
              level: __props.level + 1,
              "selected-keys": __props.selectedKeys,
              "open-keys": __props.openKeys,
              disabled: __props.disabled,
              mode: __props.mode,
              "force-sub-menu-render": __props.forceSubMenuRender,
              "trigger-sub-menu-action": __props.triggerSubMenuAction,
              "expand-icon": __props.expandIcon,
              "class-names": __props.classNames,
              styles: __props.styles,
              "key-path": [...__props.keyPath, __props.item.key],
              onItemClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("itemClick", $event)),
              onSubmenuToggle: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("submenuToggle", $event)),
              onSubmenuOpenChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("submenuOpenChange", $event))
            }, null, 8, ["item", "level", "selected-keys", "open-keys", "disabled", "mode", "force-sub-menu-render", "trigger-sub-menu-action", "expand-icon", "class-names", "styles", "key-path"]);
          }), 128))
        ])
      ], 6)) : hasChildren.value ? (vue.openBlock(), vue.createElementBlock("li", {
        key: 2,
        class: vue.normalizeClass(["aheart-menu__submenu", [nodeClass.value, __props.classNames.submenu]]),
        style: vue.normalizeStyle(__props.styles.submenu),
        role: "presentation",
        onMouseenter: handleSubmenuMouseEnter,
        onMouseleave: handleSubmenuMouseLeave
      }, [
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["aheart-menu__submenu-title", __props.classNames.submenuTitle]),
          style: vue.normalizeStyle([nodeLevelStyle.value, __props.styles.submenuTitle]),
          type: "button",
          "data-submenu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-expanded": isOpen.value ? "true" : "false",
          title: __props.item.title,
          onClick: handleSubmenuClick
        }, [
          __props.item.icon ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-menu__icon", __props.classNames.icon]),
            style: vue.normalizeStyle(__props.styles.icon)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.icon
            }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-menu__label", __props.classNames.label]),
            style: vue.normalizeStyle(__props.styles.label)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.label
            }, null, 8, ["node"])
          ], 6),
          __props.item.extra ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(["aheart-menu__extra", __props.classNames.extra]),
            style: vue.normalizeStyle(__props.styles.extra)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.extra
            }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-menu__submenu-arrow aheart-menu__expand-icon", __props.classNames.expandIcon]),
            style: vue.normalizeStyle(__props.styles.expandIcon),
            "aria-hidden": "true"
          }, [
            vue.createVNode(vue.unref(ARenderNode), { node: expandIconNode.value }, null, 8, ["node"])
          ], 6)
        ], 14, _hoisted_2),
        __props.forceSubMenuRender || isOpen.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("ul", {
          key: 0,
          class: vue.normalizeClass(["aheart-menu__submenu-list", __props.classNames.submenuList]),
          style: vue.normalizeStyle(__props.styles.submenuList),
          role: "menu"
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.item.children ?? [], (child) => {
            return vue.openBlock(), vue.createBlock(_component_AMenuNode, {
              key: child.key,
              item: child,
              level: __props.level + 1,
              "selected-keys": __props.selectedKeys,
              "open-keys": __props.openKeys,
              disabled: __props.disabled,
              mode: __props.mode,
              "force-sub-menu-render": __props.forceSubMenuRender,
              "trigger-sub-menu-action": __props.triggerSubMenuAction,
              "expand-icon": __props.expandIcon,
              "class-names": __props.classNames,
              styles: __props.styles,
              "key-path": [...__props.keyPath, __props.item.key],
              onItemClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("itemClick", $event)),
              onSubmenuToggle: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("submenuToggle", $event)),
              onSubmenuOpenChange: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("submenuOpenChange", $event))
            }, null, 8, ["item", "level", "selected-keys", "open-keys", "disabled", "mode", "force-sub-menu-render", "trigger-sub-menu-action", "expand-icon", "class-names", "styles", "key-path"]);
          }), 128))
        ], 6)), [
          [vue.vShow, isOpen.value]
        ]) : vue.createCommentVNode("", true)
      ], 38)) : (vue.openBlock(), vue.createElementBlock("li", {
        key: 3,
        class: vue.normalizeClass(["aheart-menu__item", [nodeClass.value, __props.classNames.item]]),
        style: vue.normalizeStyle(__props.styles.item),
        role: "none"
      }, [
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["aheart-menu__item-button", __props.classNames.itemButton]),
          style: vue.normalizeStyle([nodeLevelStyle.value, __props.styles.itemButton]),
          type: "button",
          role: "menuitem",
          "data-menu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-current": isSelected.value ? "page" : void 0,
          title: __props.item.title,
          onClick: handleItemClick
        }, [
          __props.item.icon ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-menu__icon", __props.classNames.icon]),
            style: vue.normalizeStyle(__props.styles.icon)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.icon
            }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-menu__label", __props.classNames.label]),
            style: vue.normalizeStyle(__props.styles.label)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.label
            }, null, 8, ["node"])
          ], 6),
          __props.item.extra ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(["aheart-menu__extra", __props.classNames.extra]),
            style: vue.normalizeStyle(__props.styles.extra)
          }, [
            vue.createVNode(vue.unref(ARenderNode), {
              node: __props.item.extra
            }, null, 8, ["node"])
          ], 6)) : vue.createCommentVNode("", true)
        ], 14, _hoisted_3)
      ], 6));
    };
  }
});
exports.default = _sfc_main;
