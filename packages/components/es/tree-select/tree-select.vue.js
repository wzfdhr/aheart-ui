import { defineComponent, useAttrs, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, toDisplayString, withModifiers, createVNode, createCommentVNode, createBlock, Teleport, unref, withDirectives, normalizeStyle, vModelText, vShow, nextTick } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import Tree from "../tree/index.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import "./style.css.js";
const _hoisted_1 = ["id", "tabindex", "aria-expanded", "aria-disabled", "aria-labelledby"];
const _hoisted_2 = {
  key: 0,
  class: "aheart-tree-select__value aheart-tree-select__tags"
};
const _hoisted_3 = { class: "aheart-tree-select__tag-label" };
const _hoisted_4 = ["aria-label", "onClick"];
const _hoisted_5 = {
  key: 0,
  class: "aheart-tree-select__tag aheart-tree-select__tag--rest"
};
const _hoisted_6 = {
  key: 1,
  class: "aheart-tree-select__empty",
  role: "status"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATreeSelect" },
  __name: "tree-select",
  props: {
    treeData: { default: () => [] },
    id: {},
    labelledBy: {},
    ariaLabelledby: {},
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    showSearch: { type: Boolean },
    placeholder: { default: "请选择" },
    disabled: { type: Boolean },
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    allowClear: { type: Boolean },
    maxTagCount: {},
    placement: { default: "bottomLeft" },
    autoAdjustOverflow: { type: Boolean, default: true },
    getPopupContainer: {}
  },
  emits: ["update:modelValue", "change", "openChange", "clear"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const attrs = useAttrs();
    const emit = __emit;
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const innerOpen = ref(props.defaultOpen);
    const searchText = ref("");
    const innerValue = ref(props.defaultValue);
    const isControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const mergedOpen = computed(() => isOpenControlled.value ? props.open : innerOpen.value);
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const mergedValue = computed(() => isControlled.value ? props.modelValue : innerValue.value);
    const selectedKeys = computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 ? [] : [mergedValue.value]);
    const flattenNodes = (nodes) => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
    const displayLabel = computed(() => selectedKeys.value.map((key) => {
      var _a;
      return (_a = flattenNodes(props.treeData).find((node) => node.key === key)) == null ? void 0 : _a.title;
    }).filter((title) => Boolean(title)).join(", "));
    const selectedTags = computed(() => selectedKeys.value.map((key) => {
      var _a;
      return {
        key,
        title: ((_a = flattenNodes(props.treeData).find((node) => node.key === key)) == null ? void 0 : _a.title) ?? String(key)
      };
    }));
    const visibleSelectedTags = computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const filterNodes = (nodes, query) => nodes.flatMap((node) => {
      const children = filterNodes(node.children ?? [], query);
      if (node.title.toLowerCase().includes(query) || children.length)
        return [{ ...node, children }];
      return [];
    });
    const filteredTreeData = computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return query ? filterNodes(props.treeData, query) : props.treeData;
    });
    const searchExpandedKeys = computed(() => flattenNodes(filteredTreeData.value).filter((node) => {
      var _a;
      return (_a = node.children) == null ? void 0 : _a.length;
    }).map((node) => node.key));
    const toggleOpen = () => {
      requestOpen(!mergedOpen.value);
    };
    const requestOpen = (open) => {
      if (props.disabled)
        return;
      if (!isOpenControlled.value)
        innerOpen.value = open;
      emit("openChange", open);
    };
    const emitValue = (value) => {
      if (!isControlled.value)
        innerValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const handleSelect = (keys) => {
      const value = props.multiple ? keys : keys[0];
      emitValue(value);
      if (!props.multiple)
        requestOpen(false);
    };
    const clearValue = () => {
      emitValue(props.multiple ? [] : void 0);
      searchText.value = "";
      emit("clear");
    };
    const removeKey = (key) => {
      if (props.disabled)
        return;
      emitValue(selectedKeys.value.filter((current) => current !== key));
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestOpen(true);
        void nextTick(() => {
          var _a, _b;
          return (_b = (_a = panelRef.value) == null ? void 0 : _a.querySelector('[data-tree-key][tabindex="0"]')) == null ? void 0 : _b.focus();
        });
      } else if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void nextTick(() => {
          var _a;
          return (_a = triggerRef.value) == null ? void 0 : _a.focus();
        });
      }
    };
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`
    ]);
    const panelStyle = computed(() => {
      var _a;
      return [
        floatingPosition.popupStyle.value,
        ((_a = triggerRef.value) == null ? void 0 : _a.getBoundingClientRect().width) ? { width: `${triggerRef.value.getBoundingClientRect().width}px` } : void 0
      ];
    });
    useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
    });
    watch(() => props.defaultOpen, (open) => {
      if (!isOpenControlled.value)
        innerOpen.value = open;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-tree-select", { "is-open": mergedOpen.value, "is-disabled": __props.disabled }])
      }, [
        createElementVNode("div", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-tree-select__trigger",
          id: __props.id,
          role: "combobox",
          tabindex: __props.disabled ? -1 : 0,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": __props.disabled ? "true" : void 0,
          "aria-labelledby": resolvedAriaLabelledby.value,
          "aria-haspopup": "tree",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown
        }, [
          __props.multiple && selectedTags.value.length ? (openBlock(), createElementBlock("span", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSelectedTags.value, (tag) => {
              return openBlock(), createElementBlock("span", {
                key: String(tag.key),
                class: "aheart-tree-select__tag"
              }, [
                createElementVNode("span", _hoisted_3, toDisplayString(tag.title), 1),
                !__props.disabled ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  class: "aheart-tree-select__tag-remove",
                  type: "button",
                  "aria-label": `移除 ${tag.title}`,
                  onClick: withModifiers(($event) => removeKey(tag.key), ["stop"])
                }, [
                  createVNode(_sfc_main$1, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_4)) : createCommentVNode("", true)
              ]);
            }), 128)),
            hiddenTagCount.value ? (openBlock(), createElementBlock("span", _hoisted_5, "+" + toDisplayString(hiddenTagCount.value), 1)) : createCommentVNode("", true)
          ])) : (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["aheart-tree-select__value", { "is-placeholder": !displayLabel.value }])
          }, toDisplayString(displayLabel.value || __props.placeholder), 3)),
          __props.allowClear && selectedKeys.value.length && !__props.disabled ? (openBlock(), createElementBlock("button", {
            key: 2,
            class: "aheart-tree-select__clear",
            type: "button",
            "aria-label": "清除树选择",
            onClick: withModifiers(clearValue, ["stop"])
          }, [
            createVNode(_sfc_main$1, {
              name: "close",
              size: 12
            })
          ])) : createCommentVNode("", true),
          createVNode(_sfc_main$1, {
            class: "aheart-tree-select__arrow",
            name: "chevron-down",
            size: 16,
            "aria-hidden": "true"
          })
        ], 40, _hoisted_1),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: normalizeClass(["aheart-tree-select__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value)
          }, [
            __props.showSearch ? withDirectives((openBlock(), createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
              class: "aheart-tree-select__search",
              type: "search",
              placeholder: "搜索",
              "aria-label": "搜索树节点"
            }, null, 512)), [
              [vModelText, searchText.value]
            ]) : createCommentVNode("", true),
            createVNode(unref(Tree), {
              "tree-data": filteredTreeData.value,
              "selected-keys": selectedKeys.value,
              "expanded-keys": searchText.value ? searchExpandedKeys.value : void 0,
              multiple: __props.multiple,
              disabled: __props.disabled,
              "onUpdate:selectedKeys": handleSelect
            }, null, 8, ["tree-data", "selected-keys", "expanded-keys", "multiple", "disabled"]),
            searchText.value.trim() && filteredTreeData.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_6, "暂无匹配节点")) : createCommentVNode("", true)
          ], 6)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
