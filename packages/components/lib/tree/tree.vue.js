"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useStableId = require("../utils/use-stable-id.js");
const treeIndex = require("./tree-index.js");
const useTreeLoader = require("./use-tree-loader.js");
const treeCheck = require("./tree-check.js");
const treeNode_vue_vue_type_script_setup_true_lang = require("./tree-node.vue.js");
const types = require("./types.js");
const virtualOptions = require("./virtual-options.js");
const useTreeVirtual = require("./use-tree-virtual.js");
const treeFocusBridge = require("./tree-focus-bridge.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-multiselectable", "tabindex"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ATree" },
  __name: "tree",
  props: types.treeProps,
  emits: ["update:expandedKeys", "update:selectedKeys", "update:checkedKeys", "expand", "select", "check"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const config = context.useAheartConfig();
    const attrs = vue.useAttrs();
    const treeId = useStableId.useStableId(() => attrs.id, "aheart-tree");
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const sharedModel = vue.inject(useTreeLoader.treeModelKey, void 0);
    const focusBridge = vue.inject(treeFocusBridge.treeFocusBridgeKey, void 0);
    const privateViewportHeight = vue.inject(treeFocusBridge.treeVirtualViewportHeightKey, void 0);
    const loader = (sharedModel == null ? void 0 : sharedModel.loader) ?? useTreeLoader.useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value);
    const renderData = vue.computed(() => sharedModel ? props.treeData : loader.data.value);
    const treeIndex$1 = vue.computed(() => treeIndex.createTreeIndex(renderData.value, isDisabled.value));
    const checkIndex = vue.computed(() => (sharedModel == null ? void 0 : sharedModel.index.value) ?? treeIndex$1.value);
    const innerExpandedKeys = vue.ref(props.defaultExpandAll ? [...treeIndex$1.value.order] : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = vue.ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = vue.ref([...props.defaultCheckedKeys]);
    const focusedKey = vue.ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = vue.ref();
    const lastFocusKey = vue.ref();
    const focusMovedOutside = vue.ref(false);
    let treeAlive = true;
    let retryIntentSerial = 0;
    let retryIntent;
    const mergedExpandedKeys = vue.computed(() => props.expandedKeys ?? innerExpandedKeys.value);
    const mergedSelectedKeys = vue.computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedCheckedKeys = vue.computed(() => props.checkedKeys ?? innerCheckedKeys.value);
    const checkState = vue.computed(() => treeCheck.deriveTreeCheckState(checkIndex.value, mergedCheckedKeys.value, props.checkStrictly));
    const expandedControlled = vue.computed(() => props.expandedKeys !== void 0);
    const selectedControlled = vue.computed(() => props.selectedKeys !== void 0);
    const checkedControlled = vue.computed(() => props.checkedKeys !== void 0);
    const hasKey = (keys, key) => keys.includes(key);
    const replaceKey = (keys, key, enabled) => enabled ? hasKey(keys, key) ? keys : [...keys, key] : keys.filter((current) => current !== key);
    const isNodeDisabled = (key) => {
      var _a2;
      return Boolean((_a2 = treeIndex$1.value.nodes.get(key)) == null ? void 0 : _a2.disabled);
    };
    const visibleNodes = vue.computed(() => treeIndex.getVisibleTreeNodes(treeIndex$1.value, mergedExpandedKeys.value));
    const visiblePositions = vue.computed(() => new Map(visibleNodes.value.map((entry, position) => [entry.key, position])));
    const findParent = (key) => {
      var _a2, _b;
      const parentKey = (_a2 = treeIndex$1.value.nodes.get(key)) == null ? void 0 : _a2.parentKey;
      return parentKey === void 0 ? void 0 : (_b = treeIndex$1.value.nodes.get(parentKey)) == null ? void 0 : _b.node;
    };
    const virtualConfig = vue.computed(() => virtualOptions.normalizeTreeVirtual(props.virtual));
    const virtualAdapter = useTreeVirtual.useTreeVirtual(rootRef, virtualConfig, visibleNodes, focusedKey, isDisabled);
    const virtualFallback = vue.computed(() => virtualAdapter.fallback.value);
    const retireRetryIntent = (intent, cancelGeneration = true) => {
      if ((retryIntent == null ? void 0 : retryIntent.id) !== intent.id)
        return;
      if (cancelGeneration && intent.generation !== 0 && virtualAdapter.isPending(intent.key, intent.generation))
        virtualAdapter.cancelPending();
      retryIntent = void 0;
    };
    const internalViewportHeight = vue.computed(() => privateViewportHeight == null ? void 0 : privateViewportHeight.value);
    const renderedNodes = vue.computed(() => virtualConfig.value && !virtualFallback.value ? virtualAdapter.rows.value.map((row) => ({ key: row.entry.key, node: row.entry.node, item: row.item, level: row.entry.level })) : renderData.value.map((node) => ({ key: node.key, node, item: void 0 })));
    const rowStyle = (entry) => virtualConfig.value && !virtualFallback.value && entry.item ? {
      position: "absolute",
      top: "0",
      insetInline: "0",
      width: "100%",
      boxSizing: "border-box",
      paddingInlineStart: `${Math.max(0, (entry.level ?? 1) - 1) * 20}px`,
      transform: `translateY(${entry.item.start}px)`
    } : void 0;
    const measureRef = (entry) => virtualConfig.value && !virtualFallback.value && entry.item ? (element) => virtualAdapter.measureRow(element && typeof element === "object" && "nodeType" in element ? element : null, entry.item.index, treeIndex.treeKeyToken(entry.key)) : void 0;
    vue.watch([treeIndex$1, mergedExpandedKeys], ([index], previous) => {
      var _a2, _b, _c, _d;
      const activeElement = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const hadFocus = Boolean(activeElement && ((_b = rootRef.value) == null ? void 0 : _b.contains(activeElement)));
      const oldIndex = (previous == null ? void 0 : previous[0]) ?? index;
      const activeToken = hadFocus ? (_c = activeElement == null ? void 0 : activeElement.closest("[data-tree-token]")) == null ? void 0 : _c.dataset.treeToken : void 0;
      const activeKey = hadFocus ? activeToken === void 0 ? focusedKey.value : oldIndex.order.find((key) => treeIndex.treeKeyToken(key) === activeToken) : virtualConfig.value ? virtualAdapter.focusRecoveryKey.value : focusMovedOutside.value ? void 0 : lastFocusKey.value;
      const visible = new Set(visibleNodes.value.map((entry) => entry.key));
      if (activeKey !== void 0 && visible.has(activeKey))
        return;
      if (!hadFocus && activeKey === void 0 && focusedKey.value !== void 0 && visible.has(focusedKey.value))
        return;
      const recoveryKey = activeKey ?? focusedKey.value;
      const next = treeIndex.closestVisibleTreeKey(recoveryKey, index, visible) ?? treeIndex.closestVisibleTreeKey(recoveryKey, oldIndex, visible) ?? ((_d = visibleNodes.value[0]) == null ? void 0 : _d.key);
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
      lastFocusKey.value = treeIndex$1.value.order.find((key) => treeIndex.treeKeyToken(key) === token);
      focusMovedOutside.value = false;
    };
    const trackFocusOut = (event) => {
      var _a2;
      const next = event.relatedTarget;
      if (next && !((_a2 = rootRef.value) == null ? void 0 : _a2.contains(next)))
        focusMovedOutside.value = true;
    };
    const focusNode = (key, existingVersion, allowExternalSource = false, ownedIntent) => {
      var _a2, _b;
      if (!virtualConfig.value || virtualFallback.value) {
        focusedKey.value = key;
        void vue.nextTick(() => {
          var _a3;
          const target = Array.from(((_a3 = rootRef.value) == null ? void 0 : _a3.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeIndex.treeKeyToken(key));
          target == null ? void 0 : target.focus();
          if (ownedIntent)
            retireRetryIntent(ownedIntent, false);
        });
        return;
      }
      const version = existingVersion ?? virtualAdapter.ensureKey(key);
      const activeBefore = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const sourceOwnsTarget = ((_b = activeBefore == null ? void 0 : activeBefore.closest("[data-tree-token]")) == null ? void 0 : _b.dataset.treeToken) === treeIndex.treeKeyToken(key);
      let attempts = 0;
      const focusMounted = () => {
        var _a3, _b2, _c;
        const activeNow = (_a3 = rootRef.value) == null ? void 0 : _a3.ownerDocument.activeElement;
        const body = (_b2 = rootRef.value) == null ? void 0 : _b2.ownerDocument.body;
        if (!allowExternalSource && virtualConfig.value && activeBefore && rootRef.value && activeBefore !== rootRef.value && activeBefore !== body && !rootRef.value.contains(activeBefore) && !(sourceOwnsTarget && activeNow === body)) {
          if (ownedIntent)
            retireRetryIntent(ownedIntent);
          else
            virtualAdapter.cancelPending();
          return;
        }
        if (!allowExternalSource && virtualConfig.value && activeNow && rootRef.value && activeNow !== rootRef.value && activeNow !== rootRef.value.ownerDocument.body && !rootRef.value.contains(activeNow)) {
          if (ownedIntent)
            retireRetryIntent(ownedIntent);
          else
            virtualAdapter.cancelPending();
          return;
        }
        const target = Array.from(((_c = rootRef.value) == null ? void 0 : _c.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeIndex.treeKeyToken(key));
        const generationValid = virtualAdapter.isPending(key, version);
        if (target && generationValid) {
          focusedKey.value = key;
          virtualAdapter.commitFocus(key);
          target.focus();
          if (ownedIntent)
            retireRetryIntent(ownedIntent, false);
          return;
        }
        if (target && !generationValid) {
          if (ownedIntent)
            retireRetryIntent(ownedIntent, false);
          return;
        }
        if (virtualAdapter.isPending(key, version)) {
          if (attempts++ < 8)
            void vue.nextTick(focusMounted);
          else if (ownedIntent && ownedIntent.generation === version)
            retireRetryIntent(ownedIntent);
        } else if (ownedIntent)
          retireRetryIntent(ownedIntent, false);
      };
      void vue.nextTick(focusMounted);
    };
    const handleNodeFocus = (node) => {
      focusedKey.value = node.key;
      virtualAdapter.commitFocus(node.key);
    };
    const cancelTreeFocus = () => {
      if (retryIntent)
        retireRetryIntent(retryIntent);
      virtualAdapter.cancelPending();
    };
    const unregisterFocusBridge = focusBridge == null ? void 0 : focusBridge.register(
      (key, allowExternalSource) => focusNode(key, void 0, allowExternalSource),
      cancelTreeFocus,
      (last) => {
        var _a2;
        return (_a2 = visibleNodes.value.filter((entry) => !isNodeDisabled(entry.key)).at(last ? -1 : 0)) == null ? void 0 : _a2.key;
      }
    );
    vue.onBeforeUnmount(() => {
      treeAlive = false;
      if (retryIntent)
        retireRetryIntent(retryIntent);
      virtualAdapter.cancelPending();
      unregisterFocusBridge == null ? void 0 : unregisterFocusBridge();
    });
    const createRetryIntent = (node) => {
      const generation = virtualConfig.value && !virtualFallback.value ? virtualAdapter.ensureKey(node.key) : 0;
      if (generation !== 0)
        virtualAdapter.beginFocusHandoff(node.key);
      const intent = { id: ++retryIntentSerial, key: node.key, generation, node };
      retryIntent = intent;
      return intent;
    };
    const startRetry = (node, intent = createRetryIntent(node)) => {
      var _a2;
      if (!treeAlive || (retryIntent == null ? void 0 : retryIntent.id) !== intent.id || isNodeDisabled(node.key) || ((_a2 = treeIndex$1.value.nodes.get(node.key)) == null ? void 0 : _a2.node) !== intent.node) {
        retireRetryIntent(intent);
        return;
      }
      void loader.load(node.key, true);
      void vue.nextTick(() => {
        var _a3;
        if (!treeAlive || (retryIntent == null ? void 0 : retryIntent.id) !== intent.id || isNodeDisabled(node.key) || ((_a3 = treeIndex$1.value.nodes.get(node.key)) == null ? void 0 : _a3.node) !== intent.node) {
          retireRetryIntent(intent);
          return;
        }
        if (intent.generation === 0 || virtualAdapter.isPending(node.key, intent.generation))
          focusNode(node.key, intent.generation || void 0, false, intent);
        else
          retireRetryIntent(intent, false);
      });
    };
    const retryNode = (node) => {
      if (isNodeDisabled(node.key))
        return;
      const intent = createRetryIntent(node);
      if (!mergedExpandedKeys.value.includes(node.key)) {
        toggleExpanded(node, true);
        void vue.nextTick(() => {
          if ((retryIntent == null ? void 0 : retryIntent.id) === intent.id && mergedExpandedKeys.value.includes(node.key))
            startRetry(node, intent);
          else
            retireRetryIntent(intent);
        });
        return;
      }
      startRetry(node, intent);
    };
    const syncCheckboxes = () => {
      var _a2, _b;
      for (const input of Array.from(((_a2 = rootRef.value) == null ? void 0 : _a2.querySelectorAll(".aheart-tree__checkbox")) ?? [])) {
        const token = (_b = input.closest("[data-tree-token]")) == null ? void 0 : _b.dataset.treeToken;
        if (token !== void 0) {
          input.checked = checkState.value.checkedKeys.some((key) => treeIndex.treeKeyToken(key) === token);
          input.indeterminate = checkState.value.halfCheckedKeys.some((key) => treeIndex.treeKeyToken(key) === token);
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
      const next = treeCheck.toggleTreeCheck(checkIndex.value, mergedCheckedKeys.value, node.key, props.checkStrictly);
      const nextKeys = next.checkedKeys;
      if (!checkedControlled.value)
        innerCheckedKeys.value = nextKeys;
      focusedKey.value = node.key;
      emit("update:checkedKeys", nextKeys);
      emit("check", nextKeys, node, { halfCheckedKeys: next.halfCheckedKeys });
      vue.nextTick(syncCheckboxes);
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
          vue.nextTick(() => {
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
    vue.watch([treeIndex$1, mergedExpandedKeys, loader.version], syncLoads, { flush: "post" });
    vue.onMounted(() => {
      mounted = true;
      syncLoads();
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value, "is-virtual": virtualConfig.value && !virtualFallback.value }]),
        style: vue.normalizeStyle(virtualConfig.value && !virtualFallback.value ? { maxBlockSize: `${internalViewportHeight.value ?? virtualConfig.value.height}px`, overflowY: "auto" } : void 0),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0,
        tabindex: virtualConfig.value && !virtualFallback.value ? -1 : void 0,
        onFocusin: trackFocusIn,
        onFocusout: trackFocusOut
      }, [
        vue.createElementVNode("ul", {
          class: "aheart-tree__list",
          style: vue.normalizeStyle(virtualConfig.value && !virtualFallback.value ? { blockSize: `${vue.unref(virtualAdapter).totalSize.value}px`, position: "relative" } : void 0)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(renderedNodes.value, (entry) => {
            return vue.openBlock(), vue.createBlock(treeNode_vue_vue_type_script_setup_true_lang.default, {
              key: entry.key,
              node: entry.node,
              "expanded-keys": mergedExpandedKeys.value,
              "selected-keys": mergedSelectedKeys.value,
              "checked-keys": checkState.value.checkedKeys,
              "half-checked-keys": checkState.value.halfCheckedKeys,
              "loading-keys": vue.unref(loader).loadingKeys.value,
              "error-keys": vue.unref(loader).errorKeys.value,
              "focused-key": focusedKey.value,
              checkable: _ctx.checkable,
              "parent-disabled": isDisabled.value,
              "node-index": treeIndex$1.value,
              "id-prefix": vue.unref(treeId),
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
exports.default = _sfc_main;
