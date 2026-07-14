"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
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
    const collectKeys = (nodes) => nodes.flatMap((node) => [node.key, ...collectKeys(node.children ?? [])]);
    const innerExpandedKeys = vue.ref(props.defaultExpandAll ? collectKeys(props.treeData) : [...props.defaultExpandedKeys]);
    const innerSelectedKeys = vue.ref([...props.defaultSelectedKeys]);
    const innerCheckedKeys = vue.ref([...props.defaultCheckedKeys]);
    const focusedKey = vue.ref((_a = props.treeData[0]) == null ? void 0 : _a.key);
    const rootRef = vue.ref();
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const mergedExpandedKeys = vue.computed(() => props.expandedKeys ?? innerExpandedKeys.value);
    const mergedSelectedKeys = vue.computed(() => props.selectedKeys ?? innerSelectedKeys.value);
    const mergedCheckedKeys = vue.computed(() => props.checkedKeys ?? innerCheckedKeys.value);
    const expandedControlled = vue.computed(() => props.expandedKeys !== void 0);
    const selectedControlled = vue.computed(() => props.selectedKeys !== void 0);
    const checkedControlled = vue.computed(() => props.checkedKeys !== void 0);
    vue.watch(() => props.treeData, (nodes) => {
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
    vue.watch(mergedExpandedKeys, () => {
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
      vue.nextTick(() => {
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
      return vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-tree", { "is-disabled": isDisabled.value }]),
        role: "tree",
        "aria-multiselectable": _ctx.multiple || void 0
      }, [
        vue.createElementVNode("ul", _hoisted_2, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.treeData, (node) => {
            return vue.openBlock(), vue.createBlock(treeNode_vue_vue_type_script_setup_true_lang.default, {
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
exports.default = _sfc_main;
