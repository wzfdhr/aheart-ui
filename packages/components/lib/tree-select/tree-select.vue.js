"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const index = require("../tree/index.js");
require("./style.css.js");
const _hoisted_1 = ["disabled"];
const _hoisted_2 = { "aria-hidden": "true" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-tree-select__panel"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ATreeSelect" },
  __name: "tree-select",
  props: {
    treeData: { default: () => [] },
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    showSearch: { type: Boolean },
    placeholder: { default: "请选择" },
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = vue.ref(false);
    const searchText = vue.ref("");
    const innerValue = vue.ref(props.defaultValue);
    const instance = vue.getCurrentInstance();
    const isControlled = vue.computed(() => Object.prototype.hasOwnProperty.call((instance == null ? void 0 : instance.vnode.props) ?? {}, "modelValue"));
    const mergedValue = vue.computed(() => isControlled.value ? props.modelValue : innerValue.value);
    const selectedKeys = vue.computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 ? [] : [mergedValue.value]);
    const flattenNodes = (nodes) => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
    const displayLabel = vue.computed(() => selectedKeys.value.map((key) => {
      var _a;
      return (_a = flattenNodes(props.treeData).find((node) => node.key === key)) == null ? void 0 : _a.title;
    }).filter((title) => Boolean(title)).join(", "));
    const filterNodes = (nodes, query) => nodes.flatMap((node) => {
      const children = filterNodes(node.children ?? [], query);
      if (node.title.toLowerCase().includes(query) || children.length)
        return [{ ...node, children }];
      return [];
    });
    const filteredTreeData = vue.computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return query ? filterNodes(props.treeData, query) : props.treeData;
    });
    const searchExpandedKeys = vue.computed(() => flattenNodes(filteredTreeData.value).filter((node) => {
      var _a;
      return (_a = node.children) == null ? void 0 : _a.length;
    }).map((node) => node.key));
    const toggleOpen = () => {
      if (!props.disabled)
        open.value = !open.value;
    };
    const handleSelect = (keys) => {
      const value = props.multiple ? keys : keys[0];
      if (!isControlled.value)
        innerValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      if (!props.multiple)
        open.value = false;
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-tree-select", { "is-open": open.value, "is-disabled": __props.disabled }])
      }, [
        vue.createElementVNode("button", {
          class: "aheart-tree-select__trigger",
          type: "button",
          disabled: __props.disabled,
          onClick: toggleOpen
        }, [
          vue.createElementVNode("span", null, vue.toDisplayString(displayLabel.value || __props.placeholder), 1),
          vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(open.value ? "⌃" : "⌄"), 1)
        ], 8, _hoisted_1),
        open.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
          __props.showSearch ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
            class: "aheart-tree-select__search",
            type: "search",
            placeholder: "搜索",
            "aria-label": "搜索树节点"
          }, null, 512)), [
            [vue.vModelText, searchText.value]
          ]) : vue.createCommentVNode("", true),
          vue.createVNode(vue.unref(index.default), {
            "tree-data": filteredTreeData.value,
            "selected-keys": selectedKeys.value,
            "expanded-keys": searchText.value ? searchExpandedKeys.value : void 0,
            multiple: __props.multiple,
            disabled: __props.disabled,
            "onUpdate:selectedKeys": handleSelect
          }, null, 8, ["tree-data", "selected-keys", "expanded-keys", "multiple", "disabled"])
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
