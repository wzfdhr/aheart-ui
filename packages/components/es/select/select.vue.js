import { defineComponent, useSlots, ref, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, Fragment, renderList, createVNode, unref } from "vue";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
import { selectProps, selectEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["value", "disabled", "placeholder"];
const _hoisted_2 = ["id", "name", "value", "multiple", "disabled"];
const _hoisted_3 = {
  key: 0,
  value: "",
  disabled: ""
};
const _hoisted_4 = ["value", "disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ASelect"
  },
  __name: "select",
  props: selectProps,
  emits: selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const searchRef = ref();
    const selectRef = ref();
    const internalSearchValue = ref("");
    const internalValue = ref(props.defaultValue);
    const ARenderNode = defineComponent({
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
    const resolvedFieldNames = computed(() => ({
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
    const rawOptions = computed(() => props.options ?? []);
    const normalizedOptions = computed(() => rawOptions.value.map(normalizeOption));
    const isMultiple = computed(() => props.mode === "multiple" || props.mode === "tags");
    const isControlled = computed(() => props.modelValue !== void 0);
    const mergedValue = computed(() => isControlled.value ? props.modelValue : internalValue.value);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = computed(
      () => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined")
    );
    const currentSearchValue = computed(() => props.searchValue ?? internalSearchValue.value);
    const hasPrefix = computed(() => Boolean(props.prefix || slots.prefix));
    const hasSuffix = computed(() => Boolean(props.suffixIcon || slots.suffixIcon));
    const hasSuffixAffordance = computed(() => hasSuffix.value || props.loading);
    const allowClearConfig = computed(() => {
      if (!props.allowClear) {
        return void 0;
      }
      return typeof props.allowClear === "object" ? props.allowClear : {};
    });
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const loadingIconContent = computed(() => props.loadingIcon ?? "…");
    const stringifyValue = (value) => String(value);
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const mapNativeValue = (value) => {
      const option = normalizedOptions.value.find((currentOption) => stringifyValue(currentOption.value) === value);
      return (option == null ? void 0 : option.value) ?? value;
    };
    const filteredOptions = computed(() => {
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
    const hasNoOptions = computed(() => filteredOptions.value.length === 0);
    const selectValue = computed(() => {
      if (isMultiple.value) {
        return Array.isArray(mergedValue.value) ? mergedValue.value.map(stringifyValue) : [];
      }
      return typeof mergedValue.value === "string" || typeof mergedValue.value === "number" ? stringifyValue(mergedValue.value) : "";
    });
    const hasValue = computed(() => {
      if (Array.isArray(mergedValue.value)) {
        return mergedValue.value.length > 0;
      }
      return mergedValue.value !== void 0 && mergedValue.value !== null && mergedValue.value !== "";
    });
    const selectClass = computed(() => [
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
    const rootStyle = computed(() => [props.style, props.styles.root]);
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
      return openBlock(), createElementBlock("span", {
        class: normalizeClass(["aheart-select", selectClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        hasPrefix.value ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["aheart-select__prefix", _ctx.classNames.prefix]),
          style: normalizeStyle(_ctx.styles.prefix)
        }, [
          renderSlot(_ctx.$slots, "prefix", {}, () => [
            createTextVNode(toDisplayString(_ctx.prefix), 1)
          ])
        ], 6)) : createCommentVNode("", true),
        _ctx.showSearch ? (openBlock(), createElementBlock("input", {
          key: 1,
          ref_key: "searchRef",
          ref: searchRef,
          class: normalizeClass(["aheart-select__search", _ctx.classNames.search]),
          style: normalizeStyle(_ctx.styles.search),
          type: "search",
          value: currentSearchValue.value,
          disabled: isDisabled.value,
          placeholder: _ctx.placeholder,
          "aria-label": "Search options",
          onInput: handleSearch,
          onFocus: handleFocus,
          onBlur: handleBlur
        }, null, 46, _hoisted_1)) : createCommentVNode("", true),
        createElementVNode("select", {
          ref_key: "selectRef",
          ref: selectRef,
          class: normalizeClass(["aheart-select__control", _ctx.classNames.selector]),
          style: normalizeStyle(_ctx.styles.selector),
          id: _ctx.id,
          name: _ctx.name,
          value: selectValue.value,
          multiple: isMultiple.value,
          disabled: isDisabled.value,
          onChange: handleChange,
          onFocus: handleFocus,
          onBlur: handleBlur
        }, [
          _ctx.placeholder && !isMultiple.value && !_ctx.showSearch && !hasNoOptions.value ? (openBlock(), createElementBlock("option", _hoisted_3, toDisplayString(_ctx.placeholder), 1)) : createCommentVNode("", true),
          hasNoOptions.value ? (openBlock(), createElementBlock("option", {
            key: 1,
            value: "",
            disabled: "",
            class: normalizeClass(_ctx.classNames.notFound),
            style: normalizeStyle(_ctx.styles.notFound)
          }, toDisplayString(_ctx.notFoundContent), 7)) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(filteredOptions.value, (option) => {
            return openBlock(), createElementBlock("option", {
              key: getOptionKey(option.value),
              value: stringifyValue(option.value),
              disabled: isOptionDisabled(option),
              class: normalizeClass(_ctx.classNames.option),
              style: normalizeStyle(_ctx.styles.option)
            }, toDisplayString(option.label), 15, _hoisted_4);
          }), 128))
        ], 46, _hoisted_2),
        _ctx.allowClear && !isDisabled.value && hasValue.value ? (openBlock(), createElementBlock("button", {
          key: 2,
          class: normalizeClass(["aheart-select__clear", _ctx.classNames.clear]),
          style: normalizeStyle(_ctx.styles.clear),
          type: "button",
          "aria-label": "Clear",
          onClick: handleClear
        }, [
          renderSlot(_ctx.$slots, "clearIcon", {}, () => [
            createVNode(unref(ARenderNode), { node: clearIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        _ctx.loading ? (openBlock(), createElementBlock("span", {
          key: 3,
          class: normalizeClass(["aheart-select__loading", _ctx.classNames.loading]),
          style: normalizeStyle(_ctx.styles.loading),
          "aria-hidden": "true"
        }, [
          renderSlot(_ctx.$slots, "loadingIcon", {}, () => [
            createVNode(unref(ARenderNode), { node: loadingIconContent.value }, null, 8, ["node"])
          ])
        ], 6)) : createCommentVNode("", true),
        hasSuffix.value ? (openBlock(), createElementBlock("span", {
          key: 4,
          class: normalizeClass(["aheart-select__suffix", _ctx.classNames.suffix]),
          style: normalizeStyle(_ctx.styles.suffix)
        }, [
          renderSlot(_ctx.$slots, "suffixIcon", {}, () => [
            createTextVNode(toDisplayString(_ctx.suffixIcon), 1)
          ])
        ], 6)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
