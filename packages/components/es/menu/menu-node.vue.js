import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, createVNode, unref, Fragment, renderList, createBlock, createCommentVNode, withDirectives, vShow } from "vue";
const _hoisted_1 = {
  class: "aheart-menu__group-list",
  role: "group"
};
const _hoisted_2 = ["data-submenu-key", "disabled", "aria-expanded", "title"];
const _hoisted_3 = ["data-menu-key", "disabled", "aria-current", "title"];
const _sfc_main = /* @__PURE__ */ defineComponent({
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
    const ARenderNode = defineComponent({
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
    const hasChildren = computed(() => {
      var _a;
      return Boolean((_a = props.item.children) == null ? void 0 : _a.length);
    });
    const isOpen = computed(() => props.openKeys.includes(props.item.key));
    const isSelected = computed(() => props.selectedKeys.includes(props.item.key));
    const isDisabled = computed(() => props.disabled || Boolean(props.item.disabled));
    const currentKeyPath = computed(() => [...props.keyPath, props.item.key]);
    const nodeLevelStyle = computed(() => ({ "--aheart-menu-node-level": props.level }));
    const expandIconNode = computed(() => {
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
    const nodeClass = computed(() => [
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
      const _component_AMenuNode = resolveComponent("AMenuNode");
      return __props.item.type === "divider" ? (openBlock(), createElementBlock("li", {
        key: 0,
        class: normalizeClass(["aheart-menu__divider", [__props.classNames.divider, { "is-dashed": __props.item.dashed }]]),
        style: normalizeStyle(__props.styles.divider),
        role: "separator"
      }, null, 6)) : __props.item.type === "group" ? (openBlock(), createElementBlock("li", {
        key: 1,
        class: normalizeClass(["aheart-menu__group", __props.classNames.group]),
        style: normalizeStyle(__props.styles.group),
        role: "presentation"
      }, [
        createElementVNode("div", {
          class: normalizeClass(["aheart-menu__group-title", __props.classNames.groupTitle]),
          style: normalizeStyle(__props.styles.groupTitle)
        }, [
          createVNode(unref(ARenderNode), {
            node: __props.item.label
          }, null, 8, ["node"])
        ], 6),
        createElementVNode("ul", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.children ?? [], (child) => {
            return openBlock(), createBlock(_component_AMenuNode, {
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
      ], 6)) : hasChildren.value ? (openBlock(), createElementBlock("li", {
        key: 2,
        class: normalizeClass(["aheart-menu__submenu", [nodeClass.value, __props.classNames.submenu]]),
        style: normalizeStyle(__props.styles.submenu),
        role: "presentation",
        onMouseenter: handleSubmenuMouseEnter,
        onMouseleave: handleSubmenuMouseLeave
      }, [
        createElementVNode("button", {
          class: normalizeClass(["aheart-menu__submenu-title", __props.classNames.submenuTitle]),
          style: normalizeStyle([nodeLevelStyle.value, __props.styles.submenuTitle]),
          type: "button",
          "data-submenu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-expanded": isOpen.value ? "true" : "false",
          title: __props.item.title,
          onClick: handleSubmenuClick
        }, [
          __props.item.icon ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-menu__icon", __props.classNames.icon]),
            style: normalizeStyle(__props.styles.icon)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.icon
            }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-menu__label", __props.classNames.label]),
            style: normalizeStyle(__props.styles.label)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.label
            }, null, 8, ["node"])
          ], 6),
          __props.item.extra ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["aheart-menu__extra", __props.classNames.extra]),
            style: normalizeStyle(__props.styles.extra)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.extra
            }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-menu__submenu-arrow aheart-menu__expand-icon", __props.classNames.expandIcon]),
            style: normalizeStyle(__props.styles.expandIcon),
            "aria-hidden": "true"
          }, [
            createVNode(unref(ARenderNode), { node: expandIconNode.value }, null, 8, ["node"])
          ], 6)
        ], 14, _hoisted_2),
        __props.forceSubMenuRender || isOpen.value ? withDirectives((openBlock(), createElementBlock("ul", {
          key: 0,
          class: normalizeClass(["aheart-menu__submenu-list", __props.classNames.submenuList]),
          style: normalizeStyle(__props.styles.submenuList),
          role: "menu"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.children ?? [], (child) => {
            return openBlock(), createBlock(_component_AMenuNode, {
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
          [vShow, isOpen.value]
        ]) : createCommentVNode("", true)
      ], 38)) : (openBlock(), createElementBlock("li", {
        key: 3,
        class: normalizeClass(["aheart-menu__item", [nodeClass.value, __props.classNames.item]]),
        style: normalizeStyle(__props.styles.item),
        role: "none"
      }, [
        createElementVNode("button", {
          class: normalizeClass(["aheart-menu__item-button", __props.classNames.itemButton]),
          style: normalizeStyle([nodeLevelStyle.value, __props.styles.itemButton]),
          type: "button",
          role: "menuitem",
          "data-menu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-current": isSelected.value ? "page" : void 0,
          title: __props.item.title,
          onClick: handleItemClick
        }, [
          __props.item.icon ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-menu__icon", __props.classNames.icon]),
            style: normalizeStyle(__props.styles.icon)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.icon
            }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-menu__label", __props.classNames.label]),
            style: normalizeStyle(__props.styles.label)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.label
            }, null, 8, ["node"])
          ], 6),
          __props.item.extra ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["aheart-menu__extra", __props.classNames.extra]),
            style: normalizeStyle(__props.styles.extra)
          }, [
            createVNode(unref(ARenderNode), {
              node: __props.item.extra
            }, null, 8, ["node"])
          ], 6)) : createCommentVNode("", true)
        ], 14, _hoisted_3)
      ], 6));
    };
  }
});
export {
  _sfc_main as default
};
