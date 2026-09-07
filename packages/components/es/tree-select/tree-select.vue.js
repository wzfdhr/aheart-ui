import { defineComponent, useAttrs, ref, computed, provide, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, unref, toDisplayString, withModifiers, createVNode, createCommentVNode, createBlock, Teleport, withDirectives, normalizeStyle, vModelText, vShow, nextTick } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { useFormControl, mergeAriaIds } from "../form/control-context.js";
import Tree from "../tree/index.js";
import { useTreeLoader, treeModelKey } from "../tree/use-tree-loader.js";
import { deriveTreeCheckState, toggleTreeCheck } from "../tree/tree-check.js";
import { createTreeIndex, filterTreeIndex, treeKeyToken } from "../tree/tree-index.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { useStableId } from "../utils/use-stable-id.js";
import { useTeleportReady } from "../utils/use-teleport-ready.js";
import "./style.css.js";
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
    const attrs = useAttrs();
    const formControl = useFormControl();
    const instanceId = useStableId(void 0, "aheart-tree-select").value;
    const panelId = `aheart-tree-select-panel-${instanceId}`;
    const treeId = `aheart-tree-select-tree-${instanceId}`;
    const emit = __emit;
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const searchText = ref("");
    const isControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const resolvedId = computed(() => props.id ?? attrs.id ?? (formControl == null ? void 0 : formControl.controlId.value));
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const mergedAriaLabelledby = computed(() => mergeAriaIds(resolvedAriaLabelledby.value, formControl == null ? void 0 : formControl.labelledBy.value));
    const resolvedAriaDescribedby = computed(() => attrs["aria-describedby"]);
    const mergedAriaDescribedby = computed(() => mergeAriaIds(resolvedAriaDescribedby.value, formControl == null ? void 0 : formControl.describedBy.value));
    const resolvedAriaInvalid = computed(() => attrs["aria-invalid"] ?? ((formControl == null ? void 0 : formControl.invalid.value) ? true : void 0));
    const openState = useControllableState({
      controlled: () => props.open,
      isControlled: isOpenControlled,
      defaultValue: () => props.defaultOpen,
      onChange: (open) => {
        const nextOpen = Boolean(open);
        emit("openChange", nextOpen);
      }
    });
    const valueState = useControllableState({
      controlled: () => props.modelValue,
      isControlled,
      defaultValue: () => props.defaultValue,
      onChange: (value) => {
        emit("update:modelValue", value);
        emit("change", value);
      }
    });
    const mergedOpen = computed(() => Boolean(openState.state.value));
    const mergedValue = valueState.state;
    const isMultiple = computed(() => props.multiple || props.treeCheckable);
    const rawSelectedKeys = computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 ? [] : [mergedValue.value]);
    const loader = useTreeLoader(() => props.treeData, () => props.loadData, () => Boolean(props.disabled));
    const treeIndex = computed(() => createTreeIndex(loader.data.value, Boolean(props.disabled)));
    const selectedKeys = computed(() => props.treeCheckable ? deriveTreeCheckState(treeIndex.value, rawSelectedKeys.value, props.treeCheckStrictly).checkedKeys : rawSelectedKeys.value);
    provide(treeModelKey, { loader, index: treeIndex });
    watch(mergedOpen, (open) => {
      if (!open)
        loader.cancelAll();
    }, { flush: "sync" });
    const displayLabel = computed(() => selectedKeys.value.map((key) => {
      var _a;
      return (_a = treeIndex.value.nodes.get(key)) == null ? void 0 : _a.node.title;
    }).filter((title) => Boolean(title)).join(", "));
    const selectedTags = computed(() => selectedKeys.value.map((key) => {
      var _a;
      return {
        key,
        title: ((_a = treeIndex.value.nodes.get(key)) == null ? void 0 : _a.node.title) ?? String(key)
      };
    }));
    const visibleSelectedTags = computed(() => props.maxTagCount === void 0 ? selectedTags.value : selectedTags.value.slice(0, Math.max(0, props.maxTagCount)));
    const hiddenTagCount = computed(() => selectedTags.value.length - visibleSelectedTags.value.length);
    const filteredTreeData = computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return query ? filterTreeIndex(treeIndex.value, (node) => node.title.toLowerCase().includes(query)) : loader.data.value;
    });
    const filteredTreeIndex = computed(() => createTreeIndex(filteredTreeData.value, Boolean(props.disabled)));
    const activeKey = ref();
    const nodeId = (key) => `${treeId}-node-${treeKeyToken(key)}`;
    const activeNodeId = computed(() => {
      if (!mergedOpen.value || activeKey.value === void 0)
        return void 0;
      return filteredTreeIndex.value.nodes.has(activeKey.value) ? nodeId(activeKey.value) : void 0;
    });
    const handleTreeFocusin = (event) => {
      var _a;
      const token = (_a = event.target.closest("[data-tree-token]")) == null ? void 0 : _a.dataset.treeToken;
      if (token === void 0)
        return;
      activeKey.value = filteredTreeIndex.value.order.find((key) => treeKeyToken(key) === token);
    };
    const handleTriggerFocusout = () => {
      void nextTick(() => {
        var _a, _b, _c;
        const active = ((_a = triggerRef.value) == null ? void 0 : _a.ownerDocument.activeElement) ?? null;
        if (!((_b = triggerRef.value) == null ? void 0 : _b.contains(active)) && !((_c = panelRef.value) == null ? void 0 : _c.contains(active)))
          formControl == null ? void 0 : formControl.blur();
      });
    };
    const searchExpandedKeys = computed(() => filteredTreeIndex.value.order.filter((key) => {
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
      emitValue(props.treeCheckable ? toggleTreeCheck(treeIndex.value, rawSelectedKeys.value, key, props.treeCheckStrictly).checkedKeys : selectedKeys.value.filter((current) => current !== key));
    };
    const handleTriggerKeydown = (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        requestOpen(true);
        void nextTick(() => {
          var _a;
          const node = (_a = panelRef.value) == null ? void 0 : _a.querySelector('[data-tree-token][tabindex="0"]');
          const token = node == null ? void 0 : node.dataset.treeToken;
          if (token !== void 0)
            activeKey.value = filteredTreeIndex.value.order.find((key) => treeKeyToken(key) === token);
          node == null ? void 0 : node.focus();
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
    const teleportReady = useTeleportReady();
    const popupContainer = computed(() => {
      var _a;
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return ((_a = triggerRef.value) == null ? void 0 : _a.ownerDocument.body) ?? false;
    });
    const shouldTeleport = computed(() => teleportReady.value && popupContainer.value !== false);
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
          isMultiple.value && selectedTags.value.length ? (openBlock(), createElementBlock("span", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSelectedTags.value, (tag) => {
              return openBlock(), createElementBlock("span", {
                key: unref(treeKeyToken)(tag.key),
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
            style: normalizeStyle(panelStyle.value),
            id: panelId,
            role: "dialog",
            "aria-labelledby": resolvedAriaLabelledby.value || void 0,
            "aria-describedby": resolvedAriaDescribedby.value || void 0,
            "aria-label": resolvedAriaLabelledby.value ? void 0 : "树选择",
            onFocusin: handleTreeFocusin,
            onFocusout: handleTriggerFocusout
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
            searchText.value.trim() && filteredTreeData.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7, "暂无匹配节点")) : createCommentVNode("", true)
          ], 46, _hoisted_6)), [
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
