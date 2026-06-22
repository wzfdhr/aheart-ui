"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const menuNode_vue_vue_type_script_setup_true_lang = require("./menu-node.vue.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  role: "menu",
  class: "aheart-menu__list"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "AMenu"
  },
  __name: "menu",
  props: types.menuProps,
  emits: types.menuEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const innerSelectedKeys = vue.ref([...props.defaultSelectedKeys]);
    const innerOpenKeys = vue.ref([...props.defaultOpenKeys]);
    const normalizedItems = vue.computed(() => props.items ?? []);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const mergedSelectedKeys = vue.computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedOpenKeys = vue.computed(() => props.openKeys ?? innerOpenKeys.value);
    const isSelectedControlled = vue.computed(() => props.selectedKeys !== void 0);
    const isOpenControlled = vue.computed(() => props.openKeys !== void 0);
    const menuClass = vue.computed(() => [
      `aheart-menu--${props.mode}`,
      `aheart-menu--${props.theme}`,
      {
        "is-disabled": isDisabled.value,
        "is-collapsed": props.inlineCollapsed
      }
    ]);
    vue.watch(
      () => props.defaultSelectedKeys,
      (keys) => {
        if (!isSelectedControlled.value) {
          innerSelectedKeys.value = [...keys];
        }
      }
    );
    vue.watch(
      () => props.defaultOpenKeys,
      (keys) => {
        if (!isOpenControlled.value) {
          innerOpenKeys.value = [...keys];
        }
      }
    );
    const handleItemClick = (info) => {
      if (isDisabled.value) {
        return;
      }
      emit("click", info);
      if (!props.selectable) {
        return;
      }
      const alreadySelected = mergedSelectedKeys.value.includes(info.key);
      const nextSelectedKeys = props.multiple ? alreadySelected ? mergedSelectedKeys.value.filter((key) => key !== info.key) : [...mergedSelectedKeys.value, info.key] : [info.key];
      if (!isSelectedControlled.value) {
        innerSelectedKeys.value = nextSelectedKeys;
      }
      emit("update:selectedKeys", nextSelectedKeys);
      if (alreadySelected && props.multiple) {
        emit("deselect", {
          ...info,
          selectedKeys: nextSelectedKeys
        });
        return;
      }
      emit("select", {
        ...info,
        selectedKeys: nextSelectedKeys
      });
    };
    const handleSubmenuToggle = (key) => {
      if (isDisabled.value) {
        return;
      }
      const nextOpenKeys = mergedOpenKeys.value.includes(key) ? mergedOpenKeys.value.filter((currentKey) => currentKey !== key) : [...mergedOpenKeys.value, key];
      if (!isOpenControlled.value) {
        innerOpenKeys.value = nextOpenKeys;
      }
      emit("openChange", nextOpenKeys);
      emit("update:openKeys", nextOpenKeys);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("nav", {
        class: vue.normalizeClass(["aheart-menu", menuClass.value]),
        "aria-label": "menu"
      }, [
        vue.createElementVNode("ul", _hoisted_1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item) => {
            return vue.openBlock(), vue.createBlock(menuNode_vue_vue_type_script_setup_true_lang.default, {
              key: item.key,
              item,
              "selected-keys": mergedSelectedKeys.value,
              "open-keys": mergedOpenKeys.value,
              disabled: isDisabled.value,
              mode: _ctx.mode,
              onItemClick: handleItemClick,
              onSubmenuToggle: handleSubmenuToggle
            }, null, 8, ["item", "selected-keys", "open-keys", "disabled", "mode"]);
          }), 128))
        ])
      ], 2);
    };
  }
});
exports.default = _sfc_main;
