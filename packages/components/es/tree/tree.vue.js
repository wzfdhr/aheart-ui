import { defineComponent, useAttrs, computed, inject, ref, watch, nextTick, onBeforeUnmount, onMounted, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, unref, Fragment, renderList, createBlock } from "vue";
import { useStableId } from "../utils/use-stable-id.js";
import { createTreeIndex, getVisibleTreeNodes, treeKeyToken, closestVisibleTreeKey } from "./tree-index.js";
import { treeModelKey, useTreeLoader } from "./use-tree-loader.js";
import { deriveTreeCheckState, toggleTreeCheck } from "./tree-check.js";
import _sfc_main$1 from "./tree-node.vue.js";
import { treeProps } from "./types.js";
import { normalizeTreeVirtual } from "./virtual-options.js";
import { useTreeVirtual } from "./use-tree-virtual.js";
import { treeFocusBridgeKey, treeVirtualViewportHeightKey } from "./tree-focus-bridge.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["aria-multiselectable", "tabindex"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATree" },
  __name: "tree",
  props: treeProps,
  emits: ["update:expandedKeys", "update:selectedKeys", "update:checkedKeys", "expand", "select", "check"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const config = useAheartConfig();
    const attrs = useAttrs();
    const treeId = useStableId(() => attrs.id, "aheart-tree");
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const sharedModel = inject(treeModelKey, void 0);
    const focusBridge = inject(treeFocusBridgeKey, void 0);
    const privateViewportHeight = inject(treeVirtualViewportHeightKey, void 0);
    const loader = (sharedModel == null ? void 0 : sharedModel.loader) ?? useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value);
    const renderData = computed(() => sharedModel ? props.treeData : loader.data.value);
    const treeIndex = computed(() => createTreeIndex(renderData.value, isDisabled.value));
    const checkIndex = computed(() => (sharedModel == null ? void 0 : sharedModel.index.value) ?? treeIndex.value);
    const innerExpandedKeys = ref(props.defaultExpandAll ? [...treeIndex.value.order] : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = ref([...props.defaultCheckedKeys]);
    const focusedKey = ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = ref();
    const lastFocusKey = ref();
    const focusMovedOutside = ref(false);
    const mergedExpandedKeys = computed(() => props.expandedKeys ?? innerExpandedKeys.value);
    const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedCheckedKeys = computed(() => props.checkedKeys ?? innerCheckedKeys.value);
    const checkState = computed(() => deriveTreeCheckState(checkIndex.value, mergedCheckedKeys.value, props.checkStrictly));
    const expandedControlled = computed(() => props.expandedKeys !== void 0);
    const selectedControlled = computed(() => props.selectedKeys !== void 0);
    const checkedControlled = computed(() => props.checkedKeys !== void 0);
    const hasKey = (keys, key) => keys.includes(key);
    const replaceKey = (keys, key, enabled) => enabled ? hasKey(keys, key) ? keys : [...keys, key] : keys.filter((current) => current !== key);
    const isNodeDisabled = (key) => {
      var _a2;
      return Boolean((_a2 = treeIndex.value.nodes.get(key)) == null ? void 0 : _a2.disabled);
    };
    const visibleNodes = computed(() => getVisibleTreeNodes(treeIndex.value, mergedExpandedKeys.value));
    const visiblePositions = computed(() => new Map(visibleNodes.value.map((entry, position) => [entry.key, position])));
    const findParent = (key) => {
      var _a2, _b;
      const parentKey = (_a2 = treeIndex.value.nodes.get(key)) == null ? void 0 : _a2.parentKey;
      return parentKey === void 0 ? void 0 : (_b = treeIndex.value.nodes.get(parentKey)) == null ? void 0 : _b.node;
    };
    const virtualConfig = computed(() => normalizeTreeVirtual(props.virtual, (message) => {
    }));
    const virtualAdapter = useTreeVirtual(rootRef, virtualConfig, visibleNodes, focusedKey, isDisabled);
    const virtualFallback = computed(() => virtualAdapter.fallback.value);
    const internalViewportHeight = computed(() => privateViewportHeight == null ? void 0 : privateViewportHeight.value);
    const renderedNodes = computed(() => virtualConfig.value && !virtualFallback.value ? virtualAdapter.rows.value.map((row) => ({ key: row.entry.key, node: row.entry.node, item: row.item, level: row.entry.level })) : renderData.value.map((node) => ({ key: node.key, node, item: void 0 })));
    const rowStyle = (entry) => virtualConfig.value && !virtualFallback.value && entry.item ? {
      position: "absolute",
      top: "0",
      insetInline: "0",
      width: "100%",
      boxSizing: "border-box",
      paddingInlineStart: `${Math.max(0, (entry.level ?? 1) - 1) * 20}px`,
      transform: `translateY(${entry.item.start}px)`
    } : void 0;
    const measureRef = (entry) => virtualConfig.value && !virtualFallback.value && entry.item ? (element) => virtualAdapter.measureRow(element && typeof element === "object" && "nodeType" in element ? element : null, entry.item.index, treeKeyToken(entry.key)) : void 0;
    watch([treeIndex, mergedExpandedKeys], ([index], previous) => {
      var _a2, _b, _c, _d;
      const activeElement = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const hadFocus = Boolean(activeElement && ((_b = rootRef.value) == null ? void 0 : _b.contains(activeElement)));
      const oldIndex = (previous == null ? void 0 : previous[0]) ?? index;
      const activeToken = hadFocus ? (_c = activeElement == null ? void 0 : activeElement.closest("[data-tree-token]")) == null ? void 0 : _c.dataset.treeToken : void 0;
      const activeKey = hadFocus ? activeToken === void 0 ? focusedKey.value : oldIndex.order.find((key) => treeKeyToken(key) === activeToken) : virtualConfig.value ? virtualAdapter.focusRecoveryKey.value : focusMovedOutside.value ? void 0 : lastFocusKey.value;
      const visible = new Set(visibleNodes.value.map((entry) => entry.key));
      if (activeKey !== void 0 && visible.has(activeKey))
        return;
      if (!hadFocus && activeKey === void 0 && focusedKey.value !== void 0 && visible.has(focusedKey.value))
        return;
      const recoveryKey = activeKey ?? focusedKey.value;
      const next = closestVisibleTreeKey(recoveryKey, index, visible) ?? closestVisibleTreeKey(recoveryKey, oldIndex, visible) ?? ((_d = visibleNodes.value[0]) == null ? void 0 : _d.key);
      if (next === void 0)
        return;
      if (hadFocus || activeKey !== void 0)
        focusNode(next);
      else
        focusedKey.value = next;
    }, { flush: "post" });
    const trackFocusIn = (event) => {
      var _a2, _b;
      const row = (_a2 = event.target) == null ? void 0 : _a2.closest("[data-tree-token]");
      if (!row || !((_b = rootRef.value) == null ? void 0 : _b.contains(row)))
        return;
      const token = row.dataset.treeToken;
      lastFocusKey.value = treeIndex.value.order.find((key) => treeKeyToken(key) === token);
      focusMovedOutside.value = false;
    };
    const trackFocusOut = (event) => {
      var _a2;
      const next = event.relatedTarget;
      if (next && !((_a2 = rootRef.value) == null ? void 0 : _a2.contains(next)))
        focusMovedOutside.value = true;
    };
    const focusNode = (key, existingVersion, allowExternalSource = false) => {
      var _a2, _b;
      if (!virtualConfig.value || virtualFallback.value) {
        focusedKey.value = key;
        void nextTick(() => {
          var _a3, _b2;
          return (_b2 = Array.from(((_a3 = rootRef.value) == null ? void 0 : _a3.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeKeyToken(key))) == null ? void 0 : _b2.focus();
        });
        return;
      }
      const version = existingVersion ?? virtualAdapter.ensureKey(key);
      const activeBefore = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const sourceOwnsTarget = ((_b = activeBefore == null ? void 0 : activeBefore.closest("[data-tree-token]")) == null ? void 0 : _b.dataset.treeToken) === treeKeyToken(key);
      let attempts = 0;
      const focusMounted = () => {
        var _a3, _b2, _c;
        const activeNow = (_a3 = rootRef.value) == null ? void 0 : _a3.ownerDocument.activeElement;
        const body = (_b2 = rootRef.value) == null ? void 0 : _b2.ownerDocument.body;
        if (!allowExternalSource && virtualConfig.value && activeBefore && rootRef.value && activeBefore !== rootRef.value && activeBefore !== body && !rootRef.value.contains(activeBefore) && !(sourceOwnsTarget && activeNow === body)) {
          virtualAdapter.cancelPending();
          return;
        }
        if (!allowExternalSource && virtualConfig.value && activeNow && rootRef.value && activeNow !== rootRef.value && activeNow !== rootRef.value.ownerDocument.body && !rootRef.value.contains(activeNow)) {
          virtualAdapter.cancelPending();
          return;
        }
        const target = Array.from(((_c = rootRef.value) == null ? void 0 : _c.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeKeyToken(key));
        const generationValid = virtualAdapter.isPending(key, version);
        if (target && generationValid) {
          focusedKey.value = key;
          virtualAdapter.commitFocus(key);
          target.focus();
          return;
        }
        if (target && !generationValid)
          return;
        if (virtualAdapter.isPending(key, version) && attempts++ < 8)
          void nextTick(focusMounted);
      };
      void nextTick(focusMounted);
    };
    const handleNodeFocus = (node) => {
      focusedKey.value = node.key;
      virtualAdapter.commitFocus(node.key);
    };
    const unregisterFocusBridge = focusBridge == null ? void 0 : focusBridge.register(
      (key, allowExternalSource) => focusNode(key, void 0, allowExternalSource),
      virtualAdapter.cancelPending,
      (last) => {
        var _a2;
        return (_a2 = visibleNodes.value.filter((entry) => !isNodeDisabled(entry.key)).at(last ? -1 : 0)) == null ? void 0 : _a2.key;
      }
    );
    onBeforeUnmount(() => unregisterFocusBridge == null ? void 0 : unregisterFocusBridge());
    const retryNode = (node) => {
      if (isNodeDisabled(node.key))
        return;
      const transaction = virtualConfig.value && !virtualFallback.value ? virtualAdapter.ensureKey(node.key) : void 0;
      if (transaction !== void 0)
        virtualAdapter.beginFocusHandoff(node.key);
      void loader.load(node.key, true);
      void nextTick(() => {
        if (transaction === void 0 || virtualAdapter.isPending(node.key, transaction))
          focusNode(node.key, transaction);
      });
    };
    const syncCheckboxes = () => {
      var _a2, _b;
      for (const input of Array.from(((_a2 = rootRef.value) == null ? void 0 : _a2.querySelectorAll(".aheart-tree__checkbox")) ?? [])) {
        const token = (_b = input.closest("[data-tree-token]")) == null ? void 0 : _b.dataset.treeToken;
        if (token !== void 0) {
          input.checked = checkState.value.checkedKeys.some((key) => treeKeyToken(key) === token);
          input.indeterminate = checkState.value.halfCheckedKeys.some((key) => treeKeyToken(key) === token);
        }
      }
    };
    const updateExpandedKeys = (keys, node) => {
      if (!expandedControlled.value)
        innerExpandedKeys.value = keys;
      emit("update:expandedKeys", keys);
      emit("expand", keys, node);
    };
    const toggleExpanded = (node, force) => {
      var _a2;
      if (isNodeDisabled(node.key) || !((_a2 = node.children) == null ? void 0 : _a2.length) && node.isLeaf !== false)
        return;
      const expanded = force ?? !mergedExpandedKeys.value.includes(node.key);
      updateExpandedKeys(replaceKey(mergedExpandedKeys.value, node.key, expanded), node);
    };
    const selectNode = (node) => {
      if (isNodeDisabled(node.key) || !props.selectable)
        return;
      const selected = mergedSelectedKeys.value.includes(node.key);
      const nextKeys = props.multiple ? replaceKey(mergedSelectedKeys.value, node.key, !selected) : selected ? [] : [node.key];
      if (!selectedControlled.value)
        innerSelectedKeys.value = nextKeys;
      focusedKey.value = node.key;
      emit("update:selectedKeys", nextKeys);
      emit("select", nextKeys, node);
    };
    const checkNode = (node) => {
      if (isNodeDisabled(node.key) || !props.checkable)
        return;
      const next = toggleTreeCheck(checkIndex.value, mergedCheckedKeys.value, node.key, props.checkStrictly);
      const nextKeys = next.checkedKeys;
      if (!checkedControlled.value)
        innerCheckedKeys.value = nextKeys;
      focusedKey.value = node.key;
      emit("update:checkedKeys", nextKeys);
      emit("check", nextKeys, node, { halfCheckedKeys: next.halfCheckedKeys });
      nextTick(syncCheckboxes);
    };
    const handleKeydown = (event, node) => {
      var _a2, _b;
      const orderedNodes = visibleNodes.value;
      const index = visiblePositions.value.get(node.key) ?? -1;
      if (event.key === "ArrowDown" && orderedNodes[index + 1]) {
        event.preventDefault();
        focusNode(orderedNodes[index + 1].key);
      } else if (event.key === "ArrowUp" && orderedNodes[index - 1]) {
        event.preventDefault();
        focusNode(orderedNodes[index - 1].key);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if ((((_a2 = node.children) == null ? void 0 : _a2.length) || node.isLeaf === false) && !mergedExpandedKeys.value.includes(node.key)) {
          toggleExpanded(node, true);
          nextTick(() => {
            var _a3;
            if (mergedExpandedKeys.value.includes(node.key) && ((_a3 = node.children) == null ? void 0 : _a3[0]))
              focusNode(node.children[0].key);
          });
        } else if ((_b = node.children) == null ? void 0 : _b[0])
          focusNode(node.children[0].key);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (mergedExpandedKeys.value.includes(node.key))
          toggleExpanded(node, false);
        else {
          const parent = findParent(node.key);
          if (parent)
            focusNode(parent.key);
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        selectNode(node);
      } else if (event.key === " ") {
        event.preventDefault();
        if (props.checkable)
          checkNode(node);
        else
          selectNode(node);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const enabledNodes = orderedNodes.filter((entry) => !isNodeDisabled(entry.key));
        const target = event.key === "Home" ? enabledNodes[0] : enabledNodes.at(-1);
        if (target)
          focusNode(target.key);
      }
    };
    let mounted = false;
    const syncLoads = () => {
      if (!mounted)
        return;
      const visible = new Set(visibleNodes.value.map((node) => node.key));
      for (const key of loader.loadingKeys.value) {
        if (!visible.has(key) || !mergedExpandedKeys.value.includes(key))
          loader.cancel(key);
      }
      for (const key of mergedExpandedKeys.value) {
        if (visible.has(key))
          void loader.load(key);
      }
    };
    watch([treeIndex, mergedExpandedKeys, loader.version], syncLoads, { flush: "post" });
    onMounted(() => {
      mounted = true;
      syncLoads();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value, "is-virtual": virtualConfig.value && !virtualFallback.value }]),
        style: normalizeStyle(virtualConfig.value && !virtualFallback.value ? { maxBlockSize: `${internalViewportHeight.value ?? virtualConfig.value.height}px`, overflowY: "auto" } : void 0),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0,
        tabindex: virtualConfig.value && !virtualFallback.value ? -1 : void 0,
        onFocusin: trackFocusIn,
        onFocusout: trackFocusOut
      }, [
        createElementVNode("ul", {
          class: "aheart-tree__list",
          style: normalizeStyle(virtualConfig.value && !virtualFallback.value ? { blockSize: `${unref(virtualAdapter).totalSize.value}px`, position: "relative" } : void 0)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(renderedNodes.value, (entry) => {
            return openBlock(), createBlock(_sfc_main$1, {
              key: entry.key,
              node: entry.node,
              "expanded-keys": mergedExpandedKeys.value,
              "selected-keys": mergedSelectedKeys.value,
              "checked-keys": checkState.value.checkedKeys,
              "half-checked-keys": checkState.value.halfCheckedKeys,
              "loading-keys": unref(loader).loadingKeys.value,
              "error-keys": unref(loader).errorKeys.value,
              "focused-key": focusedKey.value,
              checkable: _ctx.checkable,
              "parent-disabled": isDisabled.value,
              "node-index": treeIndex.value,
              "id-prefix": unref(treeId),
              onToggle: toggleExpanded,
              onSelect: selectNode,
              onCheck: checkNode,
              onRetry: retryNode,
              onKeydown: handleKeydown,
              onFocus: handleNodeFocus,
              virtual: Boolean(virtualConfig.value && !virtualFallback.value),
              "virtual-style": rowStyle(entry),
              "measure-ref": measureRef(entry)
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "half-checked-keys", "loading-keys", "error-keys", "focused-key", "checkable", "parent-disabled", "node-index", "id-prefix", "virtual", "virtual-style", "measure-ref"]);
          }), 128))
        ], 4)
      ], 46, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
