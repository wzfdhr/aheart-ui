import { defineComponent, useAttrs, computed, inject, ref, watch, nextTick, onMounted, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, createBlock, unref } from "vue";
import { useStableId } from "../utils/use-stable-id.js";
import { createTreeIndex, getVisibleTreeNodes, treeKeyToken, closestVisibleTreeKey } from "./tree-index.js";
import { treeModelKey, useTreeLoader } from "./use-tree-loader.js";
import { deriveTreeCheckState, toggleTreeCheck } from "./tree-check.js";
import _sfc_main$1 from "./tree-node.vue.js";
import { treeProps } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["aria-multiselectable"];
const _hoisted_2 = { class: "aheart-tree__list" };
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
    const loader = (sharedModel == null ? void 0 : sharedModel.loader) ?? useTreeLoader(() => props.treeData, () => props.loadData, () => isDisabled.value);
    const renderData = computed(() => sharedModel ? props.treeData : loader.data.value);
    const treeIndex = computed(() => createTreeIndex(renderData.value, isDisabled.value));
    const checkIndex = computed(() => (sharedModel == null ? void 0 : sharedModel.index.value) ?? treeIndex.value);
    const innerExpandedKeys = ref(props.defaultExpandAll ? [...treeIndex.value.order] : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = ref([...props.defaultCheckedKeys]);
    const focusedKey = ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = ref();
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
    watch([treeIndex, mergedExpandedKeys], ([index], previous) => {
      var _a2, _b, _c, _d;
      const activeElement = (_a2 = rootRef.value) == null ? void 0 : _a2.ownerDocument.activeElement;
      const hadFocus = Boolean(activeElement && ((_b = rootRef.value) == null ? void 0 : _b.contains(activeElement)));
      const oldIndex = (previous == null ? void 0 : previous[0]) ?? index;
      const activeToken = hadFocus ? (_c = activeElement == null ? void 0 : activeElement.closest("[data-tree-token]")) == null ? void 0 : _c.dataset.treeToken : void 0;
      const activeKey = activeToken === void 0 ? focusedKey.value : oldIndex.order.find((key) => treeKeyToken(key) === activeToken);
      const visible = new Set(visibleNodes.value.map((entry) => entry.key));
      if (activeKey !== void 0 && visible.has(activeKey))
        return;
      const next = closestVisibleTreeKey(activeKey, index, visible) ?? closestVisibleTreeKey(activeKey, oldIndex, visible) ?? ((_d = visibleNodes.value[0]) == null ? void 0 : _d.key);
      focusedKey.value = next;
      if (hadFocus && next !== void 0)
        focusNode(next);
    });
    const focusNode = (key) => {
      focusedKey.value = key;
      nextTick(() => {
        var _a2, _b;
        (_b = Array.from(((_a2 = rootRef.value) == null ? void 0 : _a2.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeToken === treeKeyToken(key))) == null ? void 0 : _b.focus();
      });
    };
    const retryNode = (node) => {
      if (isNodeDisabled(node.key))
        return;
      void loader.load(node.key, true);
      focusNode(node.key);
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
    watch([treeIndex, mergedExpandedKeys, loader.version], syncLoads, { flush: "post" });
    onMounted(() => {
      mounted = true;
      syncLoads();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value }]),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0
      }, [
        createElementVNode("ul", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(renderData.value, (node) => {
            return openBlock(), createBlock(_sfc_main$1, {
              key: node.key,
              node,
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
              onFocus: (node2) => focusedKey.value = node2.key
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "half-checked-keys", "loading-keys", "error-keys", "focused-key", "checkable", "parent-disabled", "node-index", "id-prefix", "onFocus"]);
          }), 128))
        ])
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
