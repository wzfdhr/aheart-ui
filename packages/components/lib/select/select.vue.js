"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const context = require("../config/context.js");
const types = require("./types.js");
require("./style.css.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-select__prefix"
};
const _hoisted_2 = ["value", "disabled", "placeholder"];
const _hoisted_3 = ["id", "name", "value", "multiple", "disabled"];
const _hoisted_4 = {
  key: 0,
  value: "",
  disabled: ""
};
const _hoisted_5 = {
  key: 1,
  value: "",
  disabled: ""
};
const _hoisted_6 = ["value", "disabled"];
const _hoisted_7 = {
  key: 3,
  class: "aheart-select__suffix"
};
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASelect"
  },
  __name: "select",
  props: types.selectProps,
  emits: types.selectEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const internalSearchValue = vue.ref("");
    const normalizedOptions = vue.computed(() => props.options ?? []);
    const isMultiple = vue.computed(() => props.mode === "multiple" || props.mode === "tags");
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const currentSearchValue = vue.computed(() => props.searchValue ?? internalSearchValue.value);
    const hasPrefix = vue.computed(() => Boolean(props.prefix || slots.prefix));
    const hasSuffix = vue.computed(() => Boolean(props.suffixIcon || slots.suffixIcon));
    const stringifyValue = (value) => String(value);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const mapNativeValue = (value) => {
      const option = normalizedOptions.value.find((currentOption) => stringifyValue(currentOption.value) === value);
      return (option == null ? void 0 : option.value) ?? value;
    };
    const filteredOptions = vue.computed(() => {
      if (!props.showSearch) {
        return normalizedOptions.value;
      }
      const searchText = currentSearchValue.value.trim().toLowerCase();
      if (!searchText || props.filterOption === false) {
        return normalizedOptions.value;
      }
      const filterOption = props.filterOption;
      if (typeof filterOption === "function") {
        return normalizedOptions.value.filter((option) => filterOption(searchText, option));
      }
      return normalizedOptions.value.filter((option) => option.label.toLowerCase().includes(searchText));
    });
    const hasNoOptions = vue.computed(() => filteredOptions.value.length === 0);
    const selectValue = vue.computed(() => {
      if (isMultiple.value) {
        return Array.isArray(props.modelValue) ? props.modelValue.map(stringifyValue) : [];
      }
      return typeof props.modelValue === "string" || typeof props.modelValue === "number" ? stringifyValue(props.modelValue) : "";
    });
    const hasValue = vue.computed(() => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.length > 0;
      }
      return Boolean(props.modelValue);
    });
    const selectClass = vue.computed(() => [
      `aheart-select--${resolvedSize.value}`,
      `aheart-select--${resolvedVariant.value}`,
      {
        [`aheart-select--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-multiple": isMultiple.value,
        "is-searchable": props.showSearch,
        "has-prefix": hasPrefix.value,
        "has-suffix": hasSuffix.value
      }
    ]);
    const emitValue = (value) => {
      emit("update:modelValue", value);
      emit("change", value);
    };
    const handleChange = (event) => {
      const target = event.target;
      if (isMultiple.value) {
        const selectedValues = Array.from(target.selectedOptions).map((option) => mapNativeValue(option.value));
        emitValue(props.maxCount === void 0 ? selectedValues : selectedValues.slice(0, props.maxCount));
        return;
      }
      emitValue(mapNativeValue(target.value));
    };
    const handleClear = () => {
      const value = isMultiple.value ? [] : "";
      emit("update:modelValue", value);
      emit("change", value);
      emit("clear");
    };
    const isOptionDisabled = (option) => option.disabled;
    const handleSearch = (event) => {
      const value = event.target.value;
      internalSearchValue.value = value;
      emit("search", value);
    };
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-select", selectClass.value])
      }, [
        hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
          ])
        ])) : vue.createCommentVNode("", true),
        _ctx.showSearch ? (vue.openBlock(), vue.createElementBlock("input", {
          key: 1,
          class: "aheart-select__search",
          type: "search",
          value: currentSearchValue.value,
          disabled: isDisabled.value,
          placeholder: _ctx.placeholder,
          "aria-label": "Search options",
          onInput: handleSearch
        }, null, 40, _hoisted_2)) : vue.createCommentVNode("", true),
        vue.createElementVNode("select", {
          class: "aheart-select__control",
          id: _ctx.id,
          name: _ctx.name,
          value: selectValue.value,
          multiple: isMultiple.value,
          disabled: isDisabled.value,
          onChange: handleChange
        }, [
          _ctx.placeholder && !isMultiple.value && !_ctx.showSearch && !hasNoOptions.value ? (vue.openBlock(), vue.createElementBlock("option", _hoisted_4, vue.toDisplayString(_ctx.placeholder), 1)) : vue.createCommentVNode("", true),
          hasNoOptions.value ? (vue.openBlock(), vue.createElementBlock("option", _hoisted_5, vue.toDisplayString(_ctx.notFoundContent), 1)) : vue.createCommentVNode("", true),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredOptions.value, (option) => {
            return vue.openBlock(), vue.createElementBlock("option", {
              key: getOptionKey(option.value),
              value: stringifyValue(option.value),
              disabled: isOptionDisabled(option)
            }, vue.toDisplayString(option.label), 9, _hoisted_6);
          }), 128))
        ], 40, _hoisted_3),
        _ctx.allowClear && !isDisabled.value && hasValue.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: "aheart-select__clear",
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, " × ")) : vue.createCommentVNode("", true),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7, [
          vue.renderSlot(_ctx.$slots, "suffixIcon", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.suffixIcon), 1)
          ])
        ])) : vue.createCommentVNode("", true)
      ], 2);
    };
  }
});
exports.default = _sfc_main;
