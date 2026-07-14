import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, createElementVNode, normalizeClass, withModifiers, toDisplayString, createCommentVNode, Fragment, renderList, createBlock } from "vue";
const _hoisted_1 = ["aria-selected", "aria-expanded", "aria-disabled"];
const _hoisted_2 = ["data-tree-key", "tabindex"];
const _hoisted_3 = ["disabled", "aria-label"];
const _hoisted_4 = {
  key: 1,
  class: "aheart-tree__switcher aheart-tree__switcher--empty",
  "aria-hidden": "true"
};
const _hoisted_5 = ["checked", "disabled", "aria-label"];
const _hoisted_6 = { class: "aheart-tree__title" };
const _hoisted_7 = {
  key: 0,
  class: "aheart-tree__group",
  role: "group"
};
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
    parentDisabled: { type: Boolean }
  },
  emits: ["toggle", "select", "check", "keydown"],
  setup(__props) {
    const props = __props;
    const hasChildren = computed(() => {
      var _a;
      return Boolean((_a = props.node.children) == null ? void 0 : _a.length);
    });
    const isDisabled = computed(() => Boolean(props.parentDisabled || props.node.disabled));
    const expanded = computed(() => props.expandedKeys.includes(props.node.key));
    const selected = computed(() => props.selectedKeys.includes(props.node.key));
    const checked = computed(() => props.checkedKeys.includes(props.node.key));
    const focused = computed(() => props.focusedKey === props.node.key);
    return (_ctx, _cache) => {
      const _component_ATreeNode = resolveComponent("ATreeNode");
      return openBlock(), createElementBlock("li", {
        class: "aheart-tree__treeitem",
        role: "treeitem",
        "aria-selected": selected.value,
        "aria-expanded": hasChildren.value ? expanded.value : void 0,
        "aria-disabled": isDisabled.value || void 0
      }, [
        createElementVNode("div", {
          class: normalizeClass(["aheart-tree__node", { "is-expanded": expanded.value, "is-selected": selected.value, "is-checked": checked.value, "is-disabled": isDisabled.value }]),
          "data-tree-key": String(__props.node.key),
          tabindex: focused.value ? 0 : -1,
          onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("select", __props.node)),
          onKeydown: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("keydown", $event, __props.node))
        }, [
          hasChildren.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "aheart-tree__switcher",
            type: "button",
            disabled: isDisabled.value,
            "aria-label": expanded.value ? "Collapse node" : "Expand node",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("toggle", __props.node), ["stop"]))
          }, toDisplayString(expanded.value ? "−" : "+"), 9, _hoisted_3)) : (openBlock(), createElementBlock("span", _hoisted_4)),
          __props.checkable ? (openBlock(), createElementBlock("input", {
            key: 2,
            class: "aheart-tree__checkbox",
            type: "checkbox",
            checked: checked.value,
            disabled: isDisabled.value,
            "aria-label": `Select ${__props.node.title}`,
            onClick: _cache[1] || (_cache[1] = withModifiers(() => {
            }, ["stop"])),
            onChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("check", __props.node))
          }, null, 40, _hoisted_5)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_6, toDisplayString(__props.node.title), 1)
        ], 42, _hoisted_2),
        hasChildren.value && expanded.value ? (openBlock(), createElementBlock("ul", _hoisted_7, [
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
              onToggle: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("toggle", $event)),
              onSelect: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("select", $event)),
              onCheck: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("check", $event)),
              onKeydown: _cache[8] || (_cache[8] = (event, childNode) => _ctx.$emit("keydown", event, childNode))
            }, null, 8, ["node", "expanded-keys", "selected-keys", "checked-keys", "focused-key", "checkable", "parent-disabled"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};
