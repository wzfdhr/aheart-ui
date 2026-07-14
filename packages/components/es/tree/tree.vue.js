import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, createBlock, nextTick } from "vue";
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
    const collectKeys = (nodes) => nodes.flatMap((node) => [node.key, ...collectKeys(node.children ?? [])]);
    const innerExpandedKeys = ref(props.defaultExpandAll ? collectKeys(props.treeData) : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = ref([...props.defaultCheckedKeys]);
    const focusedKey = ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = ref();
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const mergedExpandedKeys = computed(() => props.expandedKeys ?? innerExpandedKeys.value);
    const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedCheckedKeys = computed(() => props.checkedKeys ?? innerCheckedKeys.value);
    const expandedControlled = computed(() => props.expandedKeys !== void 0);
    const selectedControlled = computed(() => props.selectedKeys !== void 0);
    const checkedControlled = computed(() => props.checkedKeys !== void 0);
    watch(() => props.treeData, (nodes) => {
      var _a2;
      if (!focusedKey.value)
        focusedKey.value = (_a2 = nodes[0]) == null ? void 0 : _a2.key;
    });
    const hasKey = (keys, key) => keys.includes(key);
    const replaceKey = (keys, key, enabled) => enabled ? hasKey(keys, key) ? keys : [...keys, key] : keys.filter((current) => current !== key);
    const getVisibleNodes = (nodes, output = []) => {
      for (const node of nodes) {
        output.push(node);
        if (mergedExpandedKeys.value.includes(node.key))
          getVisibleNodes(node.children ?? [], output);
      }
      return output;
    };
    const findParent = (key, nodes = props.treeData, parent) => {
      for (const node of nodes) {
        if (node.key === key)
          return parent;
        const result = findParent(key, node.children ?? [], node);
        if (result)
          return result;
      }
    };
    watch(mergedExpandedKeys, () => {
      var _a2, _b;
      const visibleNodes = getVisibleNodes(props.treeData);
      if (!visibleNodes.some((node) => node.key === focusedKey.value)) {
        let nextKey = focusedKey.value;
        while (nextKey !== void 0 && !visibleNodes.some((node) => node.key === nextKey)) {
          nextKey = (_a2 = findParent(nextKey)) == null ? void 0 : _a2.key;
        }
        focusedKey.value = nextKey ?? ((_b = visibleNodes[0]) == null ? void 0 : _b.key);
      }
    });
    const focusNode = (key) => {
      focusedKey.value = key;
      nextTick(() => {
        var _a2, _b;
        (_b = Array.from(((_a2 = rootRef.value) == null ? void 0 : _a2.querySelectorAll(".aheart-tree__node")) ?? []).find((element) => element.dataset.treeKey === String(key))) == null ? void 0 : _b.focus();
      });
    };
    const updateExpandedKeys = (keys, node) => {
      if (!expandedControlled.value)
        innerExpandedKeys.value = keys;
      emit("update:expandedKeys", keys);
      emit("expand", keys, node);
    };
    const toggleExpanded = (node, force) => {
      var _a2;
      if (isDisabled.value || node.disabled || !((_a2 = node.children) == null ? void 0 : _a2.length))
        return;
      const expanded = force ?? !mergedExpandedKeys.value.includes(node.key);
      updateExpandedKeys(replaceKey(mergedExpandedKeys.value, node.key, expanded), node);
    };
    const selectNode = (node) => {
      if (isDisabled.value || node.disabled || !props.selectable)
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
      if (isDisabled.value || node.disabled || !props.checkable)
        return;
      const nextKeys = replaceKey(mergedCheckedKeys.value, node.key, !mergedCheckedKeys.value.includes(node.key));
      if (!checkedControlled.value)
        innerCheckedKeys.value = nextKeys;
      focusedKey.value = node.key;
      emit("update:checkedKeys", nextKeys);
      emit("check", nextKeys, node);
    };
    const handleKeydown = (event, node) => {
      var _a2, _b;
      const visibleNodes = getVisibleNodes(props.treeData);
      const index = visibleNodes.findIndex((current) => current.key === node.key);
      if (event.key === "ArrowDown" && visibleNodes[index + 1]) {
        event.preventDefault();
        focusNode(visibleNodes[index + 1].key);
      } else if (event.key === "ArrowUp" && visibleNodes[index - 1]) {
        event.preventDefault();
        focusNode(visibleNodes[index - 1].key);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (((_a2 = node.children) == null ? void 0 : _a2.length) && !mergedExpandedKeys.value.includes(node.key))
          toggleExpanded(node, true);
        else if ((_b = node.children) == null ? void 0 : _b[0])
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
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value }]),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0
      }, [
        createElementVNode("ul", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.treeData, (node) => {
            return openBlock(), createBlock(_sfc_main$1, {
              key: node.key,
              node,
              "expanded-keys": mergedExpandedKeys.value,
              "selected-keys": mergedSelectedKeys.value,
              "checked-keys": mergedCheckedKeys.value,
              "focused-key": focusedKey.value,
              checkable: _ctx.checkable,
              "parent-disabled": isDisabled.value,
              onToggle: toggleExpanded,
              onSelect: selectNode,
              onCheck: checkNode,
              onKeydown: handleKeydown
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "focused-key", "checkable", "parent-disabled"]);
          }), 128))
        ])
      ], 10, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
