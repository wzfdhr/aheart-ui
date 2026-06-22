import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, createElementVNode, toDisplayString, Fragment, renderList, createBlock, normalizeClass, createCommentVNode } from "vue";
const _hoisted_1 = {
  key: 0,
  class: "aheart-menu__divider",
  role: "separator"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-menu__group",
  role: "presentation"
};
const _hoisted_3 = { class: "aheart-menu__group-title" };
const _hoisted_4 = {
  class: "aheart-menu__group-list",
  role: "group"
};
const _hoisted_5 = ["data-submenu-key", "disabled", "aria-expanded"];
const _hoisted_6 = { class: "aheart-menu__label" };
const _hoisted_7 = {
  key: 0,
  class: "aheart-menu__submenu-list",
  role: "menu"
};
const _hoisted_8 = ["data-menu-key", "disabled", "aria-current"];
const _hoisted_9 = { class: "aheart-menu__label" };
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
    keyPath: { default: () => [] }
  },
  emits: ["itemClick", "submenuToggle"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const hasChildren = computed(() => {
      var _a;
      return Boolean((_a = props.item.children) == null ? void 0 : _a.length);
    });
    const isOpen = computed(() => props.openKeys.includes(props.item.key));
    const isSelected = computed(() => props.selectedKeys.includes(props.item.key));
    const isDisabled = computed(() => props.disabled || Boolean(props.item.disabled));
    const currentKeyPath = computed(() => [...props.keyPath, props.item.key]);
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
      emit("submenuToggle", props.item.key);
    };
    return (_ctx, _cache) => {
      const _component_AMenuNode = resolveComponent("AMenuNode");
      return __props.item.type === "divider" ? (openBlock(), createElementBlock("li", _hoisted_1)) : __props.item.type === "group" ? (openBlock(), createElementBlock("li", _hoisted_2, [
        createElementVNode("div", _hoisted_3, toDisplayString(__props.item.label), 1),
        createElementVNode("ul", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.children ?? [], (child) => {
            return openBlock(), createBlock(_component_AMenuNode, {
              key: child.key,
              item: child,
              level: __props.level + 1,
              "selected-keys": __props.selectedKeys,
              "open-keys": __props.openKeys,
              disabled: __props.disabled,
              mode: __props.mode,
              "key-path": [...__props.keyPath, __props.item.key],
              onItemClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("itemClick", $event)),
              onSubmenuToggle: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("submenuToggle", $event))
            }, null, 8, ["item", "level", "selected-keys", "open-keys", "disabled", "mode", "key-path"]);
          }), 128))
        ])
      ])) : hasChildren.value ? (openBlock(), createElementBlock("li", {
        key: 2,
        class: normalizeClass(["aheart-menu__submenu", nodeClass.value]),
        role: "presentation"
      }, [
        createElementVNode("button", {
          class: "aheart-menu__submenu-title",
          type: "button",
          "data-submenu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-expanded": isOpen.value ? "true" : "false",
          onClick: handleSubmenuClick
        }, [
          createElementVNode("span", _hoisted_6, toDisplayString(__props.item.label), 1),
          _cache[4] || (_cache[4] = createElementVNode("span", {
            class: "aheart-menu__submenu-arrow",
            "aria-hidden": "true"
          }, "›", -1))
        ], 8, _hoisted_5),
        isOpen.value ? (openBlock(), createElementBlock("ul", _hoisted_7, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.item.children ?? [], (child) => {
            return openBlock(), createBlock(_component_AMenuNode, {
              key: child.key,
              item: child,
              level: __props.level + 1,
              "selected-keys": __props.selectedKeys,
              "open-keys": __props.openKeys,
              disabled: __props.disabled,
              mode: __props.mode,
              "key-path": [...__props.keyPath, __props.item.key],
              onItemClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("itemClick", $event)),
              onSubmenuToggle: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("submenuToggle", $event))
            }, null, 8, ["item", "level", "selected-keys", "open-keys", "disabled", "mode", "key-path"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 2)) : (openBlock(), createElementBlock("li", {
        key: 3,
        class: normalizeClass(["aheart-menu__item", nodeClass.value]),
        role: "none"
      }, [
        createElementVNode("button", {
          class: "aheart-menu__item-button",
          type: "button",
          role: "menuitem",
          "data-menu-key": __props.item.key,
          disabled: isDisabled.value,
          "aria-current": isSelected.value ? "page" : void 0,
          onClick: handleItemClick
        }, [
          createElementVNode("span", _hoisted_9, toDisplayString(__props.item.label), 1)
        ], 8, _hoisted_8)
      ], 2));
    };
  }
});
export {
  _sfc_main as default
};
