"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["value", "disabled", "placeholder"];
const _hoisted_2 = ["id", "name", "value", "multiple", "disabled"];
const _hoisted_3 = {
  key: 0,
  value: "",
  disabled: ""
};
const _hoisted_4 = ["value", "disabled"];
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{
    name: "ASelect"
  },
  __name: "select",
  props: types.selectProps,
  emits: types.selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const searchRef = vue.ref();
    const selectRef = vue.ref();
    const internalSearchValue = vue.ref("");
    const internalValue = vue.ref(props.defaultValue);
    const ARenderNode = vue.defineComponent({
      name: "ASelectRenderNode",
      props: {
        node: {
          type: null,
          default: void 0
        }
      },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const defaultFieldNames = {
      label: "label",
      value: "value",
      disabled: "disabled"
    };
    const resolvedFieldNames = vue.computed(() => ({
      ...defaultFieldNames,
      ...props.fieldNames
    }));
    const getRawField = (option, field) => option[field];
    const normalizeOption = (option) => {
      const fieldNames = resolvedFieldNames.value;
      const label = getRawField(option, fieldNames.label);
      const value = getRawField(option, fieldNames.value);
      const disabled = getRawField(option, fieldNames.disabled);
      return {
        label: String(label ?? ""),
        value: typeof value === "number" || typeof value === "string" ? value : String(value ?? ""),
        disabled: Boolean(disabled)
      };
    };
    const rawOptions = vue.computed(() => props.options ?? []);
    const normalizedOptions = vue.computed(() => rawOptions.value.map(normalizeOption));
    const isMultiple = vue.computed(() => props.mode === "multiple" || props.mode === "tags");
    const isControlled = vue.computed(() => props.modelValue !== void 0);
    const mergedValue = vue.computed(() => isControlled.value ? props.modelValue : internalValue.value);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = vue.computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const currentSearchValue = vue.computed(() => props.searchValue ?? internalSearchValue.value);
    const hasPrefix = vue.computed(() => Boolean(props.prefix || slots.prefix));
    const hasSuffix = vue.computed(() => Boolean(props.suffixIcon || slots.suffixIcon));
    const hasSuffixAffordance = vue.computed(() => hasSuffix.value || props.loading);
    const allowClearConfig = vue.computed(() => {
      if (!props.allowClear) {
        return void 0;
      }
      return typeof props.allowClear === "object" ? props.allowClear : {};
    });
    const clearIconContent = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const loadingIconContent = vue.computed(() => props.loadingIcon ?? "…");
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
      const fieldNames = resolvedFieldNames.value;
      const filterField = props.optionFilterProp === fieldNames.label || props.optionFilterProp === "label" ? fieldNames.label : props.optionFilterProp === fieldNames.value || props.optionFilterProp === "value" ? fieldNames.value : props.optionFilterProp;
      const filtered = typeof filterOption === "function" ? normalizedOptions.value.filter((option) => filterOption(searchText, option)) : normalizedOptions.value.filter((option, index) => {
        const rawValue = getRawField(rawOptions.value[index], filterField);
        return String(rawValue ?? "").toLowerCase().includes(searchText);
      });
      return props.filterSort ? filtered.slice().sort((a, b) => {
        var _a;
        return ((_a = props.filterSort) == null ? void 0 : _a.call(props, a, b, { searchValue: searchText })) ?? 0;
      }) : filtered;
    });
    const hasNoOptions = vue.computed(() => filteredOptions.value.length === 0);
    const selectValue = vue.computed(() => {
      if (isMultiple.value) {
        return Array.isArray(mergedValue.value) ? mergedValue.value.map(stringifyValue) : [];
      }
      return typeof mergedValue.value === "string" || typeof mergedValue.value === "number" ? stringifyValue(mergedValue.value) : "";
    });
    const hasValue = vue.computed(() => {
      if (Array.isArray(mergedValue.value)) {
        return mergedValue.value.length > 0;
      }
      return mergedValue.value !== void 0 && mergedValue.value !== null && mergedValue.value !== "";
    });
    const selectClass = vue.computed(() => [
      props.className,
      props.rootClassName,
      props.classNames.root,
      `aheart-select--${resolvedSize.value}`,
      `aheart-select--${resolvedVariant.value}`,
      {
        [`aheart-select--${props.status}`]: props.status,
        "is-disabled": isDisabled.value,
        "is-loading": props.loading,
        "is-multiple": isMultiple.value,
        "is-searchable": props.showSearch,
        "has-prefix": hasPrefix.value,
        "has-suffix": hasSuffixAffordance.value
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
    const emitValue = (value) => {
      if (!isControlled.value) {
        internalValue.value = value;
      }
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
      if (!isControlled.value) {
        internalValue.value = value;
      }
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
    const handleFocus = (event) => {
      emit("focus", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const focus = () => {
      const target = props.showSearch ? searchRef.value : selectRef.value;
      target == null ? void 0 : target.focus();
    };
    const blur = () => {
      var _a, _b;
      (_a = searchRef.value) == null ? void 0 : _a.blur();
      (_b = selectRef.value) == null ? void 0 : _b.blur();
    };
    __expose({
      focus,
      blur
    });
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        class: vue.normalizeClass(["aheart-select", selectClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(["aheart-select__prefix", _ctx.classNames.prefix]),
          style: vue.normalizeStyle(_ctx.styles.prefix)
        }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.prefix), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true),
        _ctx.showSearch ? (vue.openBlock(), vue.createElementBlock("input", {
          key: 1,
          ref_key: "searchRef",
          ref: searchRef,
          class: vue.normalizeClass(["aheart-select__search", _ctx.classNames.search]),
          style: vue.normalizeStyle(_ctx.styles.search),
          type: "search",
          value: currentSearchValue.value,
          disabled: isDisabled.value,
          placeholder: _ctx.placeholder,
          "aria-label": "Search options",
          onInput: handleSearch,
          onFocus: handleFocus,
          onBlur: handleBlur
        }, null, 46, _hoisted_1)) : vue.createCommentVNode("", true),
        vue.createElementVNode("select", {
          ref_key: "selectRef",
          ref: selectRef,
          class: vue.normalizeClass(["aheart-select__control", _ctx.classNames.selector]),
          style: vue.normalizeStyle(_ctx.styles.selector),
          id: _ctx.id,
          name: _ctx.name,
          value: selectValue.value,
          multiple: isMultiple.value,
          disabled: isDisabled.value,
          onChange: handleChange,
          onFocus: handleFocus,
          onBlur: handleBlur
        }, [
          _ctx.placeholder && !isMultiple.value && !_ctx.showSearch && !hasNoOptions.value ? (vue.openBlock(), vue.createElementBlock("option", _hoisted_3, vue.toDisplayString(_ctx.placeholder), 1)) : vue.createCommentVNode("", true),
          hasNoOptions.value ? (vue.openBlock(), vue.createElementBlock("option", {
            key: 1,
            value: "",
            disabled: "",
            class: vue.normalizeClass(_ctx.classNames.notFound),
            style: vue.normalizeStyle(_ctx.styles.notFound)
          }, vue.toDisplayString(_ctx.notFoundContent), 7)) : vue.createCommentVNode("", true),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredOptions.value, (option) => {
            return vue.openBlock(), vue.createElementBlock("option", {
              key: getOptionKey(option.value),
              value: stringifyValue(option.value),
              disabled: isOptionDisabled(option),
              class: vue.normalizeClass(_ctx.classNames.option),
              style: vue.normalizeStyle(_ctx.styles.option)
            }, vue.toDisplayString(option.label), 15, _hoisted_4);
          }), 128))
        ], 46, _hoisted_2),
        _ctx.allowClear && !isDisabled.value && hasValue.value ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 2,
          class: vue.normalizeClass(["aheart-select__clear", _ctx.classNames.clear]),
          style: vue.normalizeStyle(_ctx.styles.clear),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 3,
          class: vue.normalizeClass(["aheart-select__loading", _ctx.classNames.loading]),
          style: vue.normalizeStyle(_ctx.styles.loading),
          "aria-hidden": "true"
        }, [
          vue.renderSlot(_ctx.$slots, "loadingIcon", {}, () => [
            vue.createVNode(vue.unref(ARenderNode), { node: loadingIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : vue.createCommentVNode("", true),
        hasSuffix.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 4,
          class: vue.normalizeClass(["aheart-select__suffix", _ctx.classNames.suffix]),
          style: vue.normalizeStyle(_ctx.styles.suffix)
        }, [
          vue.renderSlot(_ctx.$slots, "suffixIcon", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.suffixIcon), 1)
          ])
        ], 6)) : vue.createCommentVNode("", true)
      ], 6);
    };
  }
});
exports.default = _sfc_main;
