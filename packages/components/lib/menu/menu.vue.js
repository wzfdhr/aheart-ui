"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const menuNode_vue_vue_type_script_setup_true_lang = require("./menu-node.vue.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
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
      props.className,
      props.classNames.root,
      {
        "is-disabled": isDisabled.value,
        "is-collapsed": props.inlineCollapsed
      }
    ]);
    const rootStyle = vue.computed(() => [
      { "--aheart-menu-inline-indent": `${props.inlineIndent}px` },
      props.style,
      props.styles.root
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
      setOpenKey(key);
    };
    const handleSubmenuOpenChange = ({ key, open }) => {
      setOpenKey(key, open);
    };
    const setOpenKey = (key, open) => {
      if (isDisabled.value) {
        return;
      }
      const isOpen = mergedOpenKeys.value.includes(key);
      const shouldOpen = open ?? !isOpen;
      if (isOpen === shouldOpen) {
        return;
      }
      const nextOpenKeys = shouldOpen ? [...mergedOpenKeys.value, key] : mergedOpenKeys.value.filter((currentKey) => currentKey !== key);
      if (!isOpenControlled.value) {
        innerOpenKeys.value = nextOpenKeys;
      }
      emit("openChange", nextOpenKeys);
      emit("update:openKeys", nextOpenKeys);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("nav", {
        class: vue.normalizeClass(["aheart-menu", menuClass.value]),
        style: vue.normalizeStyle(rootStyle.value),
        "aria-label": "menu"
      }, [
        vue.createElementVNode("ul", {
          role: "menu",
          class: vue.normalizeClass(["aheart-menu__list", _ctx.classNames.list]),
          style: vue.normalizeStyle(_ctx.styles.list)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(normalizedItems.value, (item) => {
            return vue.openBlock(), vue.createBlock(menuNode_vue_vue_type_script_setup_true_lang.default, {
              key: item.key,
              item,
              "selected-keys": mergedSelectedKeys.value,
              "open-keys": mergedOpenKeys.value,
              disabled: isDisabled.value,
              mode: _ctx.mode,
              "force-sub-menu-render": _ctx.forceSubMenuRender,
              "trigger-sub-menu-action": _ctx.triggerSubMenuAction,
              "expand-icon": _ctx.expandIcon,
              "class-names": _ctx.classNames,
              styles: _ctx.styles,
              onItemClick: handleItemClick,
              onSubmenuToggle: handleSubmenuToggle,
              onSubmenuOpenChange: handleSubmenuOpenChange
            }, null, 8, ["item", "selected-keys", "open-keys", "disabled", "mode", "force-sub-menu-render", "trigger-sub-menu-action", "expand-icon", "class-names", "styles"]);
          }), 128))
        ], 6)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
