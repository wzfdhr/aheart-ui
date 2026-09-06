"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const index = require("../tree/index.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const useControllableState = require("../utils/use-controllable-state.js");
const useStableId = require("../utils/use-stable-id.js");
const useTeleportReady = require("../utils/use-teleport-ready.js");
require("./style.css.js");
const _hoisted_1 = ["id", "tabindex", "aria-expanded", "aria-disabled", "aria-labelledby", "aria-activedescendant", "aria-describedby"];
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
const _hoisted_6 = ["aria-labelledby", "aria-describedby", "aria-label"];
const _hoisted_7 = {
  key: 1,
  class: "aheart-tree-select__empty",
  role: "status"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
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
    const attrs = vue.useAttrs();
    const instanceId = useStableId.useStableId(void 0, "aheart-tree-select").value;
    const panelId = `aheart-tree-select-panel-${instanceId}`;
    const treeId = `aheart-tree-select-tree-${instanceId}`;
    const emit = __emit;
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const searchText = vue.ref("");
    const isControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const resolvedAriaLabelledby = vue.computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const resolvedAriaDescribedby = vue.computed(() => attrs["aria-describedby"]);
    const openState = useControllableState.useControllableState({
      controlled: () => props.open,
      isControlled: isOpenControlled,
      defaultValue: () => props.defaultOpen,
      onChange: (open) => {
        const nextOpen = Boolean(open);
        emit("openChange", nextOpen);
      }
    });
    const valueState = useControllableState.useControllableState({
      controlled: () => props.modelValue,
      isControlled,
      defaultValue: () => props.defaultValue,
      onChange: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      }
    });
    const mergedOpen = vue.computed(() => Boolean(openState.state.value));
    const mergedValue = valueState.state;
    const selectedKeys = vue.computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 ? [] : [mergedValue.value]);
    const flattenNodes = (nodes) => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
    const displayLabel = vue.computed(() => selectedKeys.value.map((key) => {
      var _a;
      return (_a = flattenNodes(props.treeData).find((node) => node.key === key)) == null ? void 0 : _a.title;
    }).filter((title) => Boolean(title)).join(", "));
    const selectedTags = vue.computed(() => selectedKeys.value.map((key) => {
      var _a;
      return {
        key,
        title: ((_a = flattenNodes(props.treeData).find((node) => node.key === key)) == null ? void 0 : _a.title) ?? String(key)
      };
    }));
    const visibleSelectedTags = vue.computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = vue.computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const filterNodes = (nodes, query) => nodes.flatMap((node) => {
      const children = filterNodes(node.children ?? [], query);
      if (node.title.toLowerCase().includes(query) || children.length)
        return [{ ...node, children }];
      return [];
    });
    const filteredTreeData = vue.computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return query ? filterNodes(props.treeData, query) : props.treeData;
    });
    const activeKey = vue.ref();
    const nodeId = (key) => `${instanceId}-node-${encodeURIComponent(String(key)).replaceAll("%", "_")}`;
    const activeNodeId = vue.computed(() => {
      if (!mergedOpen.value || activeKey.value === void 0)
        return void 0;
      return flattenNodes(filteredTreeData.value).some((node) => String(node.key) === String(activeKey.value)) ? nodeId(activeKey.value) : void 0;
    });
    const syncTreeNodeIds = () => {
      var _a;
      for (const element of Array.from(((_a = panelRef.value) == null ? void 0 : _a.querySelectorAll("[data-tree-key]")) ?? [])) {
        const key = element.dataset.treeKey;
        if (key !== void 0)
          element.id = nodeId(key);
      }
    };
    vue.watch([filteredTreeData, mergedOpen], ([, open]) => {
      if (open)
        void vue.nextTick(syncTreeNodeIds);
    }, { flush: "post" });
    const handleTreeFocusin = (event) => {
      var _a;
      const node = event.target.closest("[data-tree-key]");
      if ((node == null ? void 0 : node.dataset.treeKey) !== void 0) {
        const key = node.dataset.treeKey;
        activeKey.value = ((_a = flattenNodes(filteredTreeData.value).find((item) => String(item.key) === key)) == null ? void 0 : _a.key) ?? key;
        syncTreeNodeIds();
      }
    };
    const searchExpandedKeys = vue.computed(() => flattenNodes(filteredTreeData.value).filter((node) => {
      var _a;
      return (_a = node.children) == null ? void 0 : _a.length;
    }).map((node) => node.key));
    const toggleOpen = () => {
      requestOpen(!mergedOpen.value);
    };
    const requestOpen = (open) => {
      if (props.disabled)
        return;
      openState.setState(open, { force: true });
    };
    const emitValue = (value) => {
      valueState.setState(value, { force: true });
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
        void vue.nextTick(() => {
          var _a;
          syncTreeNodeIds();
          const node = (_a = panelRef.value) == null ? void 0 : _a.querySelector('[data-tree-key][tabindex="0"]');
          if ((node == null ? void 0 : node.dataset.treeKey) !== void 0)
            activeKey.value = node.dataset.treeKey;
          node == null ? void 0 : node.focus();
        });
      } else if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void vue.nextTick(() => {
          var _a;
          return (_a = triggerRef.value) == null ? void 0 : _a.focus();
        });
      }
    };
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const teleportReady = useTeleportReady.useTeleportReady();
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = vue.computed(() => teleportReady.value && popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = vue.computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`
    ]);
    const panelStyle = vue.computed(() => {
      var _a;
      return [
        floatingPosition.popupStyle.value,
        ((_a = triggerRef.value) == null ? void 0 : _a.getBoundingClientRect().width) ? { width: `${triggerRef.value.getBoundingClientRect().width}px` } : void 0
      ];
    });
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-tree-select", { "is-open": mergedOpen.value, "is-disabled": __props.disabled }])
      }, [
        vue.createElementVNode("div", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-tree-select__trigger",
          id: __props.id,
          role: "combobox",
          tabindex: __props.disabled ? -1 : 0,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": __props.disabled ? "true" : void 0,
          "aria-labelledby": resolvedAriaLabelledby.value,
          "aria-controls": panelId,
          "aria-activedescendant": activeNodeId.value,
          "aria-describedby": resolvedAriaDescribedby.value,
          "aria-haspopup": "tree",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown
        }, [
          __props.multiple && selectedTags.value.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSelectedTags.value, (tag) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: String(tag.key),
                class: "aheart-tree-select__tag"
              }, [
                vue.createElementVNode("span", _hoisted_3, vue.toDisplayString(tag.title), 1),
                !__props.disabled ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  class: "aheart-tree-select__tag-remove",
                  type: "button",
                  "aria-label": `移除 ${tag.title}`,
                  onClick: vue.withModifiers(($event) => removeKey(tag.key), ["stop"])
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_4)) : vue.createCommentVNode("", true)
              ]);
            }), 128)),
            hiddenTagCount.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, "+" + vue.toDisplayString(hiddenTagCount.value), 1)) : vue.createCommentVNode("", true)
          ])) : (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(["aheart-tree-select__value", { "is-placeholder": !displayLabel.value }])
          }, vue.toDisplayString(displayLabel.value || __props.placeholder), 3)),
          __props.allowClear && selectedKeys.value.length && !__props.disabled ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            class: "aheart-tree-select__clear",
            type: "button",
            "aria-label": "清除树选择",
            onClick: vue.withModifiers(clearValue, ["stop"])
          }, [
            vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
              name: "close",
              size: 12
            })
          ])) : vue.createCommentVNode("", true),
          vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
            class: "aheart-tree-select__arrow",
            name: "chevron-down",
            size: 16,
            "aria-hidden": "true"
          })
        ], 40, _hoisted_1),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          vue.unref(motion).isMounted.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            class: vue.normalizeClass(["aheart-tree-select__panel", panelClass.value]),
            style: vue.normalizeStyle(panelStyle.value),
            id: panelId,
            role: "dialog",
            "aria-labelledby": resolvedAriaLabelledby.value || void 0,
            "aria-describedby": resolvedAriaDescribedby.value || void 0,
            "aria-label": resolvedAriaLabelledby.value ? void 0 : "树选择",
            onFocusin: handleTreeFocusin
          }, [
            __props.showSearch ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
              class: "aheart-tree-select__search",
              type: "search",
              placeholder: "搜索",
              "aria-label": "搜索树节点"
            }, null, 512)), [
              [vue.vModelText, searchText.value]
            ]) : vue.createCommentVNode("", true),
            vue.createVNode(vue.unref(index.default), {
              id: treeId,
              "tree-data": filteredTreeData.value,
              "selected-keys": selectedKeys.value,
              "expanded-keys": searchText.value ? searchExpandedKeys.value : void 0,
              multiple: __props.multiple,
              disabled: __props.disabled,
              "onUpdate:selectedKeys": handleSelect
            }, null, 8, ["tree-data", "selected-keys", "expanded-keys", "multiple", "disabled"]),
            searchText.value.trim() && filteredTreeData.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, "暂无匹配节点")) : vue.createCommentVNode("", true)
          ], 46, _hoisted_6)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
