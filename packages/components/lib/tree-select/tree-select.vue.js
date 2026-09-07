"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const controlContext = require("../form/control-context.js");
const index = require("../tree/index.js");
const useTreeLoader = require("../tree/use-tree-loader.js");
const treeCheck = require("../tree/tree-check.js");
const treeIndex = require("../tree/tree-index.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const useControllableState = require("../utils/use-controllable-state.js");
const useStableId = require("../utils/use-stable-id.js");
const useTeleportReady = require("../utils/use-teleport-ready.js");
require("./style.css.js");
const _hoisted_1 = ["id", "tabindex", "aria-expanded", "aria-disabled", "aria-labelledby", "aria-activedescendant", "aria-describedby", "aria-invalid"];
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
    treeCheckable: { type: Boolean },
    treeCheckStrictly: { type: Boolean, default: true },
    loadData: {},
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
    const formControl = controlContext.useFormControl();
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
    const resolvedId = vue.computed(() => props.id ?? attrs.id ?? (formControl == null ? void 0 : formControl.controlId.value));
    const resolvedAriaLabelledby = vue.computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const mergedAriaLabelledby = vue.computed(() => controlContext.mergeAriaIds(resolvedAriaLabelledby.value, formControl == null ? void 0 : formControl.labelledBy.value));
    const resolvedAriaDescribedby = vue.computed(() => attrs["aria-describedby"]);
    const mergedAriaDescribedby = vue.computed(() => controlContext.mergeAriaIds(resolvedAriaDescribedby.value, formControl == null ? void 0 : formControl.describedBy.value));
    const resolvedAriaInvalid = vue.computed(() => attrs["aria-invalid"] ?? ((formControl == null ? void 0 : formControl.invalid.value) ? true : void 0));
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
    const isMultiple = vue.computed(() => props.multiple || props.treeCheckable);
    const rawSelectedKeys = vue.computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 ? [] : [mergedValue.value]);
    const loader = useTreeLoader.useTreeLoader(() => props.treeData, () => props.loadData, () => Boolean(props.disabled));
    const treeIndex$1 = vue.computed(() => treeIndex.createTreeIndex(loader.data.value, Boolean(props.disabled)));
    const selectedKeys = vue.computed(() => props.treeCheckable ? treeCheck.deriveTreeCheckState(treeIndex$1.value, rawSelectedKeys.value, props.treeCheckStrictly).checkedKeys : rawSelectedKeys.value);
    vue.provide(useTreeLoader.treeModelKey, { loader, index: treeIndex$1 });
    vue.watch(mergedOpen, (open) => {
      if (!open)
        loader.cancelAll();
    }, { flush: "sync" });
    const displayLabel = vue.computed(() => selectedKeys.value.map((key) => {
      var _a;
      return (_a = treeIndex$1.value.nodes.get(key)) == null ? void 0 : _a.node.title;
    }).filter((title) => Boolean(title)).join(", "));
    const selectedTags = vue.computed(() => selectedKeys.value.map((key) => {
      var _a;
      return {
        key,
        title: ((_a = treeIndex$1.value.nodes.get(key)) == null ? void 0 : _a.node.title) ?? String(key)
      };
    }));
    const visibleSelectedTags = vue.computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = vue.computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const filteredTreeData = vue.computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return query ? treeIndex.filterTreeIndex(treeIndex$1.value, (node) => node.title.toLowerCase().includes(query)) : loader.data.value;
    });
    const filteredTreeIndex = vue.computed(() => treeIndex.createTreeIndex(filteredTreeData.value, Boolean(props.disabled)));
    const activeKey = vue.ref();
    const nodeId = (key) => `${treeId}-node-${treeIndex.treeKeyToken(key)}`;
    const activeNodeId = vue.computed(() => {
      if (!mergedOpen.value || activeKey.value === void 0)
        return void 0;
      return filteredTreeIndex.value.nodes.has(activeKey.value) ? nodeId(activeKey.value) : void 0;
    });
    const handleTreeFocusin = (event) => {
      var _a;
      const token = (_a = event.target.closest("[data-tree-token]")) == null ? void 0 : _a.dataset.treeToken;
      if (token === void 0)
        return;
      activeKey.value = filteredTreeIndex.value.order.find((key) => treeIndex.treeKeyToken(key) === token);
    };
    const handleTriggerFocusout = () => {
      void vue.nextTick(() => {
        var _a, _b, _c;
        const active = ((_a = triggerRef.value) == null ? void 0 : _a.ownerDocument.activeElement) ?? null;
        if (!((_b = triggerRef.value) == null ? void 0 : _b.contains(active)) && !((_c = panelRef.value) == null ? void 0 : _c.contains(active)))
          formControl == null ? void 0 : formControl.blur();
      });
    };
    const searchExpandedKeys = vue.computed(() => filteredTreeIndex.value.order.filter((key) => {
      var _a;
      return Boolean((_a = filteredTreeIndex.value.nodes.get(key)) == null ? void 0 : _a.children.length);
    }));
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
      formControl == null ? void 0 : formControl.change();
    };
    const handleSelect = (keys) => {
      if (props.treeCheckable)
        return;
      const value = isMultiple.value ? keys : keys[0];
      emitValue(value);
      if (!isMultiple.value)
        requestOpen(false);
    };
    const handleCheck = (keys) => {
      if (props.treeCheckable)
        emitValue(keys);
    };
    const clearValue = () => {
      emitValue(isMultiple.value ? [] : void 0);
      searchText.value = "";
      emit("clear");
    };
    const removeKey = (key) => {
      if (props.disabled)
        return;
      emitValue(props.treeCheckable ? treeCheck.toggleTreeCheck(treeIndex$1.value, rawSelectedKeys.value, key, props.treeCheckStrictly).checkedKeys : selectedKeys.value.filter((current) => current !== key));
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestOpen(true);
        void vue.nextTick(() => {
          var _a;
          const node = (_a = panelRef.value) == null ? void 0 : _a.querySelector('[data-tree-token][tabindex="0"]');
          const token = node == null ? void 0 : node.dataset.treeToken;
          if (token !== void 0)
            activeKey.value = filteredTreeIndex.value.order.find((key) => treeIndex.treeKeyToken(key) === token);
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
      var _a;
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return ((_a = triggerRef.value) == null ? void 0 : _a.ownerDocument.body) ?? false;
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
          id: resolvedId.value,
          role: "combobox",
          tabindex: __props.disabled ? -1 : 0,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-disabled": __props.disabled ? "true" : void 0,
          "aria-labelledby": mergedAriaLabelledby.value,
          "aria-controls": panelId,
          "aria-activedescendant": activeNodeId.value,
          "aria-describedby": mergedAriaDescribedby.value,
          "aria-invalid": resolvedAriaInvalid.value,
          "aria-haspopup": "tree",
          onClick: toggleOpen,
          onKeydown: handleTriggerKeydown,
          onFocusout: handleTriggerFocusout
        }, [
          isMultiple.value && selectedTags.value.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSelectedTags.value, (tag) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: vue.unref(treeIndex.treeKeyToken)(tag.key),
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
            onFocusin: handleTreeFocusin,
            onFocusout: handleTriggerFocusout
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
              "selected-keys": __props.treeCheckable ? [] : selectedKeys.value,
              "checked-keys": __props.treeCheckable ? selectedKeys.value : void 0,
              checkable: __props.treeCheckable,
              "check-strictly": __props.treeCheckStrictly,
              selectable: !__props.treeCheckable,
              "expanded-keys": searchText.value ? searchExpandedKeys.value : void 0,
              multiple: isMultiple.value,
              disabled: __props.disabled,
              "onUpdate:selectedKeys": handleSelect,
              "onUpdate:checkedKeys": handleCheck
            }, null, 8, ["tree-data", "selected-keys", "checked-keys", "checkable", "check-strictly", "selectable", "expanded-keys", "multiple", "disabled"]),
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
