import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, createBlock } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import _sfc_main$1 from "./menu-node.vue.js";
import { menuProps, menuEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = {
  role: "menu",
  class: "aheart-menu__list"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AMenu"
  },
  __name: "menu",
  props: menuProps,
  emits: menuEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const innerSelectedKeys = ref([...props.defaultSelectedKeys]);
    const innerOpenKeys = ref([...props.defaultOpenKeys]);
    const normalizedItems = computed(() => props.items ?? []);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedOpenKeys = computed(() => props.openKeys ?? innerOpenKeys.value);
    const isSelectedControlled = computed(() => props.selectedKeys !== void 0);
    const isOpenControlled = computed(() => props.openKeys !== void 0);
    const menuClass = computed(() => [
      `aheart-menu--${props.mode}`,
      `aheart-menu--${props.theme}`,
      {
        "is-disabled": isDisabled.value,
        "is-collapsed": props.inlineCollapsed
      }
    ]);
    watch(
      () => props.defaultSelectedKeys,
      (keys) => {
        if (!isSelectedControlled.value) {
          innerSelectedKeys.value = [...keys];
        }
      }
    );
    watch(
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
      return openBlock(), createElementBlock("nav", {
        class: normalizeClass(["aheart-menu", menuClass.value]),
        "aria-label": "menu"
      }, [
        createElementVNode("ul", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
            return openBlock(), createBlock(_sfc_main$1, {
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
export {
  _sfc_main as default
};
