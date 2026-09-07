"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const treeIndex = require("./tree-index.js");
const _hoisted_1 = {
  class: "aheart-tree__treeitem",
  role: "presentation"
};
const _hoisted_2 = ["id", "aria-label", "aria-selected", "aria-expanded", "aria-disabled", "aria-checked", "aria-busy", "aria-level", "aria-posinset", "aria-setsize", "aria-owns", "data-tree-key", "data-tree-token", "tabindex"];
const _hoisted_3 = ["disabled", "aria-label"];
const _hoisted_4 = {
  key: 1,
  class: "aheart-tree__switcher aheart-tree__switcher--empty",
  "aria-hidden": "true"
};
const _hoisted_5 = ["checked", "indeterminate", "disabled", "aria-label"];
const _hoisted_6 = { class: "aheart-tree__title" };
const _hoisted_7 = ["disabled", "aria-label"];
const _hoisted_8 = ["id"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ATreeNode" },
  __name: "tree-node",
  props: {
    node: {},
    expandedKeys: {},
    selectedKeys: {},
    checkedKeys: {},
    halfCheckedKeys: {},
    loadingKeys: {},
    errorKeys: {},
    focusedKey: {},
    checkable: { type: Boolean },
    parentDisabled: { type: Boolean },
    nodeIndex: {},
    idPrefix: {}
  },
  emits: ["toggle", "select", "check", "retry", "keydown", "focus"],
  setup(__props) {
    const props = __props;
    const hasChildren = vue.computed(() => {
      var _a;
      return Boolean((_a = props.node.children) == null ? void 0 : _a.length) || props.node.isLeaf === false;
    });
    const loading = vue.computed(() => props.loadingKeys.has(props.node.key));
    const halfChecked = vue.computed(() => props.halfCheckedKeys.includes(props.node.key));
    const metadata = vue.computed(() => props.nodeIndex.nodes.get(props.node.key));
    const nodeId = vue.computed(() => `${props.idPrefix}-node-${treeIndex.treeKeyToken(props.node.key)}`);
    const isDisabled = vue.computed(() => Boolean(props.parentDisabled || props.node.disabled));
    const expanded = vue.computed(() => props.expandedKeys.includes(props.node.key));
    const selected = vue.computed(() => props.selectedKeys.includes(props.node.key));
    const checked = vue.computed(() => props.checkedKeys.includes(props.node.key));
    const focused = vue.computed(() => props.focusedKey === props.node.key);
    return (_ctx, _cache) => {
      var _a, _b, _c;
      const _component_ATreeNode = vue.resolveComponent("ATreeNode");
      return vue.openBlock(), vue.createElementBlock("li", _hoisted_1, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["aheart-tree__node", { "is-expanded": expanded.value, "is-selected": selected.value, "is-checked": checked.value, "is-disabled": isDisabled.value }]),
          id: nodeId.value,
          role: "treeitem",
          "aria-label": __props.node.title,
          "aria-selected": selected.value,
          "aria-expanded": hasChildren.value ? expanded.value : void 0,
          "aria-disabled": isDisabled.value || void 0,
          "aria-checked": __props.checkable ? halfChecked.value ? "mixed" : checked.value : void 0,
          "aria-busy": loading.value || void 0,
          "aria-level": (_a = metadata.value) == null ? void 0 : _a.level,
          "aria-posinset": (_b = metadata.value) == null ? void 0 : _b.position,
          "aria-setsize": (_c = metadata.value) == null ? void 0 : _c.setSize,
          "aria-owns": hasChildren.value && expanded.value ? `${nodeId.value}-group` : void 0,
          "data-tree-key": String(__props.node.key),
          "data-tree-token": vue.unref(treeIndex.treeKeyToken)(__props.node.key),
          tabindex: focused.value ? 0 : -1,
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("select", __props.node)),
          onKeydown: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("keydown", $event, __props.node)),
          onFocus: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("focus", __props.node))
        }, [
          hasChildren.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "aheart-tree__switcher",
            type: "button",
            tabindex: "-1",
            disabled: isDisabled.value,
            "aria-label": expanded.value ? "Collapse node" : "Expand node",
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => _ctx.$emit("toggle", __props.node), ["stop"]))
          }, [
            loading.value ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
              key: 0,
              name: "loading",
              size: 14,
              spin: "",
              "aria-hidden": "true"
            })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              vue.createTextVNode(vue.toDisplayString(expanded.value ? "−" : "+"), 1)
            ], 64))
          ], 8, _hoisted_3)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_4)),
          __props.checkable ? (vue.openBlock(), vue.createElementBlock("input", {
            key: 2,
            class: "aheart-tree__checkbox",
            type: "checkbox",
            tabindex: "-1",
            checked: checked.value,
            indeterminate: halfChecked.value,
            disabled: isDisabled.value,
            "aria-label": `Select ${__props.node.title}`,
            onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["stop"])),
            onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("check", __props.node))
          }, null, 40, _hoisted_5)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_6, vue.toDisplayString(__props.node.title), 1),
          __props.errorKeys.has(__props.node.key) ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 3,
            type: "button",
            class: "aheart-tree__retry",
            disabled: isDisabled.value,
            "aria-label": `重试加载 ${__props.node.title}`,
            onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => _ctx.$emit("retry", __props.node), ["stop"])),
            onKeydown: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, "加载失败，重试", 40, _hoisted_7)) : vue.createCommentVNode("", true)
        ], 42, _hoisted_2),
        hasChildren.value && expanded.value ? (vue.openBlock(), vue.createElementBlock("ul", {
          key: 0,
          id: `${nodeId.value}-group`,
          class: "aheart-tree__group",
          role: "group"
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.node.children, (child) => {
            return vue.openBlock(), vue.createBlock(_component_ATreeNode, {
              key: child.key,
              node: child,
              "expanded-keys": __props.expandedKeys,
              "selected-keys": __props.selectedKeys,
              "checked-keys": __props.checkedKeys,
              "half-checked-keys": __props.halfCheckedKeys,
              "loading-keys": __props.loadingKeys,
              "error-keys": __props.errorKeys,
              "focused-key": __props.focusedKey,
              checkable: __props.checkable,
              "parent-disabled": isDisabled.value,
              "node-index": __props.nodeIndex,
              "id-prefix": __props.idPrefix,
              onToggle: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("toggle", $event)),
              onSelect: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("select", $event)),
              onCheck: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("check", $event)),
              onRetry: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("retry", $event)),
              onKeydown: _cache[12] || (_cache[12] = (event, childNode) => _ctx.$emit("keydown", event, childNode)),
              onFocus: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("focus", $event))
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "half-checked-keys", "loading-keys", "error-keys", "focused-key", "checkable", "parent-disabled", "node-index", "id-prefix"]);
          }), 128))
        ], 8, _hoisted_8)) : vue.createCommentVNode("", true)
      ]);
    };
  }
});
exports.default = _sfc_main;
