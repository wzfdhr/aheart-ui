"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const useStableId = require("../utils/use-stable-id.js");
const treeIndex = require("./tree-index.js");
const useTreeLoader = require("./use-tree-loader.js");
const treeCheck = require("./tree-check.js");
const treeNode_vue_vue_type_script_setup_true_lang = require("./tree-node.vue.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["aria-multiselectable"];
const _hoisted_2 = { class: "aheart-tree__list" };
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
    const loader = (sharedModel == null ? void 0 : sharedModel.loader) ?? useTreeLoader.useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value);
    const renderData = vue.computed(() => sharedModel ? props.treeData : loader.data.value);
    const treeIndex$1 = vue.computed(() => treeIndex.createTreeIndex(renderData.value, isDisabled.value));
    const checkIndex = vue.computed(() => (sharedModel == null ? void 0 : sharedModel.index.value) ?? treeIndex$1.value);
    const innerExpandedKeys = vue.ref(props.defaultExpandAll ? [...treeIndex$1.value.order] : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = vue.ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = vue.ref([...props.defaultCheckedKeys]);
    const focusedKey = vue.ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = vue.ref();
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
    vue.watch([treeIndex$1, mergedExpandedKeys], ([index], previous) => {
      var _a2, _b, _c, _d;
      const activeElement = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const hadFocus = Boolean(activeElement && ((_b = rootRef.value) == null ? void 0 : _b.contains(activeElement)));
      const oldIndex = (previous == null ? void 0 : previous[0]) ?? index;
      const activeToken = hadFocus ? (_c = activeElement == null ? void 0 : activeElement.closest("[data-tree-token]")) == null ? void 0 : _c.dataset.treeToken : void 0;
      const activeKey = activeToken === void 0 ? focusedKey.value : oldIndex.order.find((key) => treeIndex.treeKeyToken(key) === activeToken);
      const visible = new Set(visibleNodes.value.map((entry) => entry.key));
      if (activeKey !== void 0 && visible.has(activeKey))
        return;
      const next = treeIndex.closestVisibleTreeKey(activeKey, index, visible) ?? treeIndex.closestVisibleTreeKey(activeKey, oldIndex, visible) ?? ((_d = visibleNodes.value[0]) == null ? void 0 : _d.key);
      focusedKey.value = next;
      if (hadFocus && next !== void 0)
        focusNode(next);
    });
    const focusNode = (key) => {
      focusedKey.value = key;
      vue.nextTick(() => {
        var _a2, _b;
        (_b = Array.from(((_a2 = rootRef.value) == null ? void 0 : _a2.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeIndex.treeKeyToken(key))) == null ? void 0 : _b.focus();
      });
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
        const target = event.key === "Home" ? orderedNodes[0] : orderedNodes.at(-1);
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
        class: vue.normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value }]),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0
      }, [
        vue.createElementVNode("ul", _hoisted_2, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(renderData.value, (node) => {
            return vue.openBlock(), vue.createBlock(treeNode_vue_vue_type_script_setup_true_lang.default, {
              key: node.key,
              node,
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
              onRetry: (node2) => vue.unref(loader).load(node2.key, true),
              onKeydown: handleKeydown,
              onFocus: (node2) => focusedKey.value = node2.key
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "half-checked-keys", "loading-keys", "error-keys", "focused-key", "checkable", "parent-disabled", "node-index", "id-prefix", "onRetry", "onFocus"]);
          }), 128))
        ])
      ], 10, _hoisted_1);
    };
  }
});
exports.default = _sfc_main;
