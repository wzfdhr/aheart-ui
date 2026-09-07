import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeClass, unref, withModifiers, toDisplayString, createCommentVNode, Fragment, renderList, createBlock } from "vue";
import { treeKeyToken } from "./tree-index.js";
const _hoisted_1 = {
  class: "aheart-tree__treeitem",
  role: "presentation"
};
const _hoisted_2 = ["id", "aria-label", "aria-selected", "aria-expanded", "aria-disabled", "aria-checked", "aria-level", "aria-posinset", "aria-setsize", "aria-owns", "data-tree-key", "data-tree-token", "tabindex"];
const _hoisted_3 = ["disabled", "aria-label"];
const _hoisted_4 = {
  key: 1,
  class: "aheart-tree__switcher aheart-tree__switcher--empty",
  "aria-hidden": "true"
};
const _hoisted_5 = ["checked", "disabled", "aria-label"];
const _hoisted_6 = { class: "aheart-tree__title" };
const _hoisted_7 = ["id"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATreeNode" },
  __name: "tree-node",
  props: {
    node: {},
    expandedKeys: {},
    selectedKeys: {},
    checkedKeys: {},
    focusedKey: {},
    checkable: { type: Boolean },
    parentDisabled: { type: Boolean },
    nodeIndex: {},
    idPrefix: {}
  },
  emits: ["toggle", "select", "check", "keydown", "focus"],
  setup(__props) {
    const props = __props;
    const hasChildren = computed(() => {
      var _a;
      return Boolean((_a = props.node.children) == null ? void 0 : _a.length);
    });
    const metadata = computed(() => props.nodeIndex.nodes.get(props.node.key));
    const nodeId = computed(() => `${props.idPrefix}-node-${treeKeyToken(props.node.key)}`);
    const isDisabled = computed(() => Boolean(props.parentDisabled || props.node.disabled));
    const expanded = computed(() => props.expandedKeys.includes(props.node.key));
    const selected = computed(() => props.selectedKeys.includes(props.node.key));
    const checked = computed(() => props.checkedKeys.includes(props.node.key));
    const focused = computed(() => props.focusedKey === props.node.key);
    return (_ctx, _cache) => {
      var _a, _b, _c;
      const _component_ATreeNode = resolveComponent("ATreeNode");
      return openBlock(), createElementBlock("li", _hoisted_1, [
        createElementVNode("div", {
          class: normalizeClass(["aheart-tree__node", { "is-expanded": expanded.value, "is-selected": selected.value, "is-checked": checked.value, "is-disabled": isDisabled.value }]),
          id: nodeId.value,
          role: "treeitem",
          "aria-label": __props.node.title,
          "aria-selected": selected.value,
          "aria-expanded": hasChildren.value ? expanded.value : void 0,
          "aria-disabled": isDisabled.value || void 0,
          "aria-checked": __props.checkable ? checked.value : void 0,
          "aria-level": (_a = metadata.value) == null ? void 0 : _a.level,
          "aria-posinset": (_b = metadata.value) == null ? void 0 : _b.position,
          "aria-setsize": (_c = metadata.value) == null ? void 0 : _c.setSize,
          "aria-owns": hasChildren.value && expanded.value ? `${nodeId.value}-group` : void 0,
          "data-tree-key": String(__props.node.key),
          "data-tree-token": unref(treeKeyToken)(__props.node.key),
          tabindex: focused.value ? 0 : -1,
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("select", __props.node)),
          onKeydown: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("keydown", $event, __props.node)),
          onFocus: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("focus", __props.node))
        }, [
          hasChildren.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "aheart-tree__switcher",
            type: "button",
            tabindex: "-1",
            disabled: isDisabled.value,
            "aria-label": expanded.value ? "Collapse node" : "Expand node",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("toggle", __props.node), ["stop"]))
          }, toDisplayString(expanded.value ? "−" : "+"), 9, _hoisted_3)) : (openBlock(), createElementBlock("span", _hoisted_4)),
          __props.checkable ? (openBlock(), createElementBlock("input", {
            key: 2,
            class: "aheart-tree__checkbox",
            type: "checkbox",
            tabindex: "-1",
            checked: checked.value,
            disabled: isDisabled.value,
            "aria-label": `Select ${__props.node.title}`,
            onClick: _cache[1] || (_cache[1] = withModifiers(() => {
            }, ["stop"])),
            onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("check", __props.node))
          }, null, 40, _hoisted_5)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_6, toDisplayString(__props.node.title), 1)
        ], 42, _hoisted_2),
        hasChildren.value && expanded.value ? (openBlock(), createElementBlock("ul", {
          key: 0,
          id: `${nodeId.value}-group`,
          class: "aheart-tree__group",
          role: "group"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.node.children, (child) => {
            return openBlock(), createBlock(_component_ATreeNode, {
              key: child.key,
              node: child,
              "expanded-keys": __props.expandedKeys,
              "selected-keys": __props.selectedKeys,
              "checked-keys": __props.checkedKeys,
              "focused-key": __props.focusedKey,
              checkable: __props.checkable,
              "parent-disabled": isDisabled.value,
              "node-index": __props.nodeIndex,
              "id-prefix": __props.idPrefix,
              onToggle: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("toggle", $event)),
              onSelect: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("select", $event)),
              onCheck: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("check", $event)),
              onKeydown: _cache[9] || (_cache[9] = (event, childNode) => _ctx.$emit("keydown", event, childNode)),
              onFocus: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("focus", $event))
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "focused-key", "checkable", "parent-disabled", "node-index", "id-prefix"]);
          }), 128))
        ], 8, _hoisted_7)) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};
