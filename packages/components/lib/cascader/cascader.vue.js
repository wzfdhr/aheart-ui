"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
require("./style.css.js");
const _hoisted_1 = ["disabled"];
const _hoisted_2 = { "aria-hidden": "true" };
const _hoisted_3 = {
  key: 0,
  class: "aheart-cascader__panel"
};
const _hoisted_4 = {
  key: 1,
  class: "aheart-cascader__search-results"
};
const _hoisted_5 = ["data-cascader-path", "disabled", "onClick"];
const _hoisted_6 = {
  key: 2,
  class: "aheart-cascader__columns"
};
const _hoisted_7 = ["data-cascader-value", "disabled", "onClick"];
const _hoisted_8 = {
  key: 0,
  "aria-hidden": "true"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ACascader" },
  __name: "cascader",
  props: {
    options: { default: () => [] },
    modelValue: {},
    defaultValue: {},
    multiple: { type: Boolean },
    showSearch: { type: Boolean },
    placeholder: { default: "请选择" },
    disabled: { type: Boolean },
    loadData: {}
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const cloneOptions = (options) => options.map((option) => ({
      ...option,
      children: option.children ? cloneOptions(option.children) : void 0
    }));
    const open = vue.ref(false);
    const searchText = vue.ref("");
    const activePath = vue.ref([]);
    const loadingPaths = vue.ref([]);
    const innerOptions = vue.ref(cloneOptions(props.options));
    const innerValue = vue.ref(props.defaultValue);
    const instance = vue.getCurrentInstance();
    const isControlled = vue.computed(() => Object.prototype.hasOwnProperty.call((instance == null ? void 0 : instance.vnode.props) ?? {}, "modelValue"));
    const mergedValue = vue.computed(() => isControlled.value ? props.modelValue : innerValue.value);
    const selectedPaths = vue.computed(() => {
      if (props.multiple) {
        return Array.isArray(mergedValue.value) && mergedValue.value.every(Array.isArray) ? mergedValue.value : [];
      }
      return Array.isArray(mergedValue.value) ? [mergedValue.value] : [];
    });
    vue.watch(() => props.options, (options) => {
      innerOptions.value = cloneOptions(options);
    });
    const pathKey = (path) => path.join("/");
    const samePath = (left, right) => left.length === right.length && left.every((key, index) => key === right[index]);
    const isBranch = (option) => {
      var _a;
      return Boolean((_a = option.children) == null ? void 0 : _a.length) || option.isLeaf === false;
    };
    const columns = vue.computed(() => {
      var _a;
      const result = [innerOptions.value];
      let siblings = innerOptions.value;
      for (const key of activePath.value) {
        const option = siblings.find((current) => current.value === key);
        if (!((_a = option == null ? void 0 : option.children) == null ? void 0 : _a.length))
          break;
        siblings = option.children;
        result.push(siblings);
      }
      return result;
    });
    const findOption = (path, options = innerOptions.value) => {
      let siblings = options;
      let current;
      for (const key of path) {
        current = siblings.find((option) => option.value === key);
        if (!current)
          return void 0;
        siblings = current.children ?? [];
      }
      return current;
    };
    const findLabels = (path) => {
      const labels = [];
      let siblings = innerOptions.value;
      for (const key of path) {
        const option = siblings.find((current) => current.value === key);
        if (!option)
          return [];
        labels.push(option.label);
        siblings = option.children ?? [];
      }
      return labels;
    };
    const pathHasDisabledOption = (path) => {
      let siblings = innerOptions.value;
      for (const key of path) {
        const option = siblings.find((current) => current.value === key);
        if (!option || option.disabled)
          return true;
        siblings = option.children ?? [];
      }
      return false;
    };
    const displayLabel = vue.computed(() => selectedPaths.value.map((path) => findLabels(path).join(" / ")).filter(Boolean).join(", "));
    const collectLeaves = (options, parentPath = [], parentLabels = [], parentDisabled = false) => options.flatMap((option) => {
      var _a;
      const path = [...parentPath, option.value];
      const labels = [...parentLabels, option.label];
      const disabled = parentDisabled || Boolean(option.disabled);
      if ((_a = option.children) == null ? void 0 : _a.length)
        return collectLeaves(option.children, path, labels, disabled);
      return option.isLeaf === false ? [] : [{ path, labels, disabled }];
    });
    const searchResults = vue.computed(() => {
      const query = searchText.value.trim().toLowerCase();
      return collectLeaves(innerOptions.value).filter((result) => result.labels.join(" / ").toLowerCase().includes(query));
    });
    const isSelected = (columnIndex, option) => selectedPaths.value.some((path) => path[columnIndex] === option.value && path.length === columnIndex + 1);
    const isLoading = (columnIndex, option) => loadingPaths.value.some((path) => samePath(path, [...activePath.value.slice(0, columnIndex), option.value]));
    const toggleOpen = () => {
      if (!props.disabled)
        open.value = !open.value;
    };
    const emitValue = (value) => {
      if (!isControlled.value)
        innerValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const selectPath = (path) => {
      const option = findOption(path);
      if (props.disabled || !option || pathHasDisabledOption(path) || isBranch(option))
        return;
      if (props.multiple) {
        const paths = selectedPaths.value.some((current) => samePath(current, path)) ? selectedPaths.value.filter((current) => !samePath(current, path)) : [...selectedPaths.value, path];
        emitValue(paths);
        return;
      }
      emitValue(path);
      open.value = false;
    };
    const replaceChildren = (options, path, children) => options.map((option) => {
      if (option.value !== path[0])
        return option;
      if (path.length === 1)
        return { ...option, children };
      return { ...option, children: replaceChildren(option.children ?? [], path.slice(1), children) };
    });
    const handleOption = async (option, columnIndex) => {
      var _a;
      if (props.disabled || option.disabled)
        return;
      const path = [...activePath.value.slice(0, columnIndex), option.value];
      if (!isBranch(option)) {
        selectPath(path);
        return;
      }
      activePath.value = path;
      if (!((_a = option.children) == null ? void 0 : _a.length) && props.loadData) {
        if (loadingPaths.value.some((current) => samePath(current, path)))
          return;
        loadingPaths.value = [...loadingPaths.value, path];
        try {
          const children = await props.loadData(option);
          innerOptions.value = replaceChildren(innerOptions.value, path, cloneOptions(children));
        } catch {
        } finally {
          loadingPaths.value = loadingPaths.value.filter((current) => !samePath(current, path));
        }
      }
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["aheart-cascader", { "is-open": open.value, "is-disabled": __props.disabled }])
      }, [
        vue.createElementVNode("button", {
          class: "aheart-cascader__trigger",
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
            class: "aheart-cascader__search",
            type: "search",
            placeholder: "搜索",
            "aria-label": "搜索级联选项"
          }, null, 512)), [
            [vue.vModelText, searchText.value]
          ]) : vue.createCommentVNode("", true),
          searchText.value.trim() ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(searchResults.value, (result) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                key: pathKey(result.path),
                class: "aheart-cascader__option",
                type: "button",
                "data-cascader-path": pathKey(result.path),
                disabled: __props.disabled || result.disabled,
                onClick: ($event) => selectPath(result.path)
              }, vue.toDisplayString(result.labels.join(" / ")), 9, _hoisted_5);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(columns.value, (column, columnIndex) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: columnIndex,
                class: "aheart-cascader__column"
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(column, (option) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    key: option.value,
                    class: vue.normalizeClass(["aheart-cascader__option", { "is-active": activePath.value[columnIndex] === option.value, "is-selected": isSelected(columnIndex, option) }]),
                    type: "button",
                    "data-cascader-value": option.value,
                    disabled: __props.disabled || option.disabled || isLoading(columnIndex, option),
                    onClick: ($event) => handleOption(option, columnIndex)
                  }, [
                    vue.createElementVNode("span", null, vue.toDisplayString(option.label), 1),
                    isBranch(option) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8, "›")) : vue.createCommentVNode("", true)
                  ], 10, _hoisted_7);
                }), 128))
              ]);
            }), 128))
          ]))
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
