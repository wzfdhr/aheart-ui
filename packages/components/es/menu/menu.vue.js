import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, Fragment, renderList, createBlock } from "vue";
import _sfc_main$1 from "./menu-node.vue.js";
import { menuProps, menuEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
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
      props.className,
      props.classNames.root,
      {
        "is-disabled": isDisabled.value,
        "is-collapsed": props.inlineCollapsed
      }
    ]);
    const rootStyle = computed(() => [
      { "--aheart-menu-inline-indent": `${props.inlineIndent}px` },
      props.style,
      props.styles.root
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
      return openBlock(), createElementBlock("nav", {
        class: normalizeClass(["aheart-menu", menuClass.value]),
        style: normalizeStyle(rootStyle.value),
        "aria-label": "menu"
      }, [
        createElementVNode("ul", {
          role: "menu",
          class: normalizeClass(["aheart-menu__list", _ctx.classNames.list]),
          style: normalizeStyle(_ctx.styles.list)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(normalizedItems.value, (item) => {
            return openBlock(), createBlock(_sfc_main$1, {
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
export {
  _sfc_main as default
};
