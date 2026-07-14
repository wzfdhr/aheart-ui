"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = ["id", "role", "tabindex", "aria-labelledby", "aria-expanded", "aria-haspopup", "aria-disabled", "aria-busy", "aria-activedescendant"];
const _hoisted_2 = { class: "aheart-select__tag-label" };
const _hoisted_3 = ["aria-label", "onClick"];
const _hoisted_4 = {
  key: 0,
  class: "aheart-select__tag aheart-select__tag--rest"
};
const _hoisted_5 = ["id", "value", "disabled", "placeholder", "aria-labelledby", "aria-expanded", "aria-activedescendant", "aria-busy"];
const _hoisted_6 = {
  key: 3,
  class: "aheart-select__value is-placeholder"
};
const _hoisted_7 = ["name", "value"];
const _hoisted_8 = {
  key: 0,
  class: "aheart-select__status",
  role: "status",
  "aria-live": "polite"
};
const _hoisted_9 = ["aria-multiselectable", "aria-hidden"];
const _hoisted_10 = ["id", "aria-selected", "aria-disabled", "onMouseenter", "onClick"];
const _hoisted_11 = { class: "aheart-select__option-content" };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ASelect" },
  __name: "select",
  props: types.selectProps,
  emits: types.selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const attrs = vue.useAttrs();
    const config = context.useAheartConfig();
    const rootRef = vue.ref(null);
    const selectorRef = vue.ref(null);
    const searchRef = vue.ref(null);
    const popupRef = vue.ref(null);
    const internalSearchValue = vue.ref("");
    const internalValue = vue.ref(props.defaultValue);
    const internalOpen = vue.ref(props.defaultOpen);
    const activeIndex = vue.ref(-1);
    const focused = vue.ref(false);
    const instanceId = vue.useId().replace(/:/g, "");
    const listboxId = `aheart-select-${instanceId}-listbox`;
    const ARenderNode = vue.defineComponent({
      name: "ASelectRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const defaultFieldNames = { label: "label", value: "value", disabled: "disabled" };
    const resolvedFieldNames = vue.computed(() => ({ ...defaultFieldNames, ...props.fieldNames }));
    const getRawField = (option, field) => option[field];
    const normalizeOption = (option) => {
      const fields = resolvedFieldNames.value;
      const value = getRawField(option, fields.value);
      return {
        label: String(getRawField(option, fields.label) ?? ""),
        value: typeof value === "number" || typeof value === "string" ? value : String(value ?? ""),
        disabled: Boolean(getRawField(option, fields.disabled))
      };
    };
    const rawOptions = vue.computed(() => props.options ?? []);
    const normalizedOptions = vue.computed(() => rawOptions.value.map(normalizeOption));
    const isMultiple = vue.computed(() => props.mode === "multiple" || props.mode === "tags");
    const isSearchable = vue.computed(() => props.showSearch || props.mode === "tags");
    const isControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const mergedValue = vue.computed(() => isControlled.value ? props.modelValue : internalValue.value);
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const isSearchControlled = usePropPresence.usePropPresence("searchValue", "search-value");
    const mergedOpen = vue.computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const currentSearchValue = vue.computed(() => isSearchControlled.value ? props.searchValue ?? "" : internalSearchValue.value);
    const resolvedAriaLabelledby = vue.computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = vue.computed(() => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined"));
    const hasPrefix = vue.computed(() => Boolean(props.prefix !== void 0 || slots.prefix));
    const allowClearConfig = vue.computed(() => typeof props.allowClear === "object" ? props.allowClear : void 0);
    const clearIconContent = vue.computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const valueEquals = (left, right) => left === right;
    const selectedValues = vue.computed(
      () => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 || mergedValue.value === "" ? [] : [mergedValue.value]
    );
    const selectedOptions = vue.computed(() => selectedValues.value.map(
      (value) => normalizedOptions.value.find((option) => valueEquals(option.value, value)) ?? { label: String(value), value }
    ));
    const selectedOption = vue.computed(() => selectedOptions.value[0]);
    const visibleSelectedOptions = vue.computed(
      () => props.maxTagCount === void 0 ? selectedOptions.value : selectedOptions.value.slice(0, Math.max(0, props.maxTagCount))
    );
    const hiddenTagCount = vue.computed(() => selectedOptions.value.length - visibleSelectedOptions.value.length);
    const hasValue = vue.computed(() => selectedValues.value.length > 0);
    const formValue = vue.computed(() => isMultiple.value ? JSON.stringify(selectedValues.value) : String(selectedValues.value[0] ?? ""));
    const searchPlaceholder = vue.computed(() => selectedOptions.value.length === 0 ? props.placeholder : void 0);
    const filteredOptions = vue.computed(() => {
      const inputValue = currentSearchValue.value;
      const normalizedSearchText = inputValue.trim().toLowerCase();
      if (!isSearchable.value || !normalizedSearchText || props.filterOption === false)
        return normalizedOptions.value;
      const fields = resolvedFieldNames.value;
      const filterField = props.optionFilterProp === "label" ? fields.label : props.optionFilterProp === "value" ? fields.value : props.optionFilterProp;
      const filtered = typeof props.filterOption === "function" ? normalizedOptions.value.filter((option) => props.filterOption && typeof props.filterOption === "function" && props.filterOption(inputValue, option)) : normalizedOptions.value.filter((_option, index) => String(getRawField(rawOptions.value[index], filterField) ?? "").toLowerCase().includes(normalizedSearchText));
      return props.filterSort ? filtered.slice().sort((a, b) => {
        var _a;
        return ((_a = props.filterSort) == null ? void 0 : _a.call(props, a, b, { searchValue: inputValue })) ?? 0;
      }) : filtered;
    });
    const hasNoOptions = vue.computed(() => filteredOptions.value.length === 0);
    const isOptionDisabled = (option) => Boolean(option.disabled);
    const isValueSelected = (value) => selectedValues.value.some((selected) => valueEquals(selected, value));
    const getOptionId = (index) => `${listboxId}-option-${index}`;
    const activeOptionId = vue.computed(() => activeIndex.value >= 0 && mergedOpen.value ? getOptionId(activeIndex.value) : void 0);
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = vue.computed(() => {
      if (props.getPopupContainer && selectorRef.value)
        return props.getPopupContainer(selectorRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: selectorRef,
      floating: popupRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
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
        "is-searchable": isSearchable.value,
        "is-open": mergedOpen.value,
        "is-focused": focused.value,
        "has-prefix": hasPrefix.value
      }
    ]);
    const rootStyle = vue.computed(() => [props.style, props.styles.root]);
    const popupClass = vue.computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`,
      props.classNames.popup
    ]);
    const popupWidthStyle = vue.computed(() => {
      var _a;
      if (props.popupMatchSelectWidth === false)
        return { minWidth: "160px" };
      const width = typeof props.popupMatchSelectWidth === "number" ? props.popupMatchSelectWidth : (_a = selectorRef.value) == null ? void 0 : _a.getBoundingClientRect().width;
      return width ? { width: `${width}px` } : {};
    });
    const popupStyle = vue.computed(() => [floatingPosition.popupStyle.value, popupWidthStyle.value, props.styles.popup]);
    const setInitialActive = () => {
      const selectedIndex = filteredOptions.value.findIndex((option) => isValueSelected(option.value) && !isOptionDisabled(option));
      activeIndex.value = selectedIndex >= 0 ? selectedIndex : filteredOptions.value.findIndex((option) => !isOptionDisabled(option));
    };
    const requestOpen = (open) => {
      if (isDisabled.value)
        return;
      if (!isOpenControlled.value)
        internalOpen.value = open;
      emit("openChange", open);
      if (open)
        setInitialActive();
    };
    const openPopup = () => {
      if (!mergedOpen.value)
        requestOpen(true);
    };
    const closePopup = () => requestOpen(false);
    const handleSelectorClick = () => {
      if (isDisabled.value)
        return;
      requestOpen(!mergedOpen.value);
      if (isSearchable.value)
        void vue.nextTick(() => {
          var _a;
          return (_a = searchRef.value) == null ? void 0 : _a.focus();
        });
    };
    const emitValue = (value) => {
      if (!isControlled.value)
        internalValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const clearSearch = () => {
      if (!isSearchControlled.value)
        internalSearchValue.value = "";
      if (isSearchable.value || currentSearchValue.value)
        emit("search", "");
    };
    const selectOption = (option) => {
      if (isDisabled.value || isOptionDisabled(option))
        return;
      if (isMultiple.value) {
        const next = isValueSelected(option.value) ? selectedValues.value.filter((value) => !valueEquals(value, option.value)) : [...selectedValues.value, option.value];
        if (!isValueSelected(option.value) && props.maxCount !== void 0 && next.length > props.maxCount)
          return;
        emitValue(next);
        clearSearch();
        if (isSearchable.value)
          void vue.nextTick(() => {
            var _a;
            return (_a = searchRef.value) == null ? void 0 : _a.focus();
          });
        return;
      }
      emitValue(option.value);
      clearSearch();
      closePopup();
    };
    const removeValue = (value) => {
      if (isDisabled.value)
        return;
      emitValue(selectedValues.value.filter((selected) => !valueEquals(selected, value)));
    };
    const handleClear = () => {
      if (isDisabled.value)
        return;
      emitValue(isMultiple.value ? [] : "");
      clearSearch();
      emit("clear");
    };
    const renderOption = (option, index) => {
      var _a;
      return ((_a = props.optionRender) == null ? void 0 : _a.call(props, option, { index })) ?? option.label;
    };
    const renderTag = (option) => {
      var _a;
      return ((_a = props.tagRender) == null ? void 0 : _a.call(props, {
        label: option.label,
        value: option.value,
        closable: !isDisabled.value,
        onClose: () => removeValue(option.value)
      })) ?? option.label;
    };
    const handleSearch = (event) => {
      const value = event.target.value;
      if (!isSearchControlled.value)
        internalSearchValue.value = value;
      else
        event.target.value = currentSearchValue.value;
      emit("search", value);
      openPopup();
      void vue.nextTick(setInitialActive);
    };
    const setActiveIndex = (index) => {
      if (!isOptionDisabled(filteredOptions.value[index]))
        activeIndex.value = index;
    };
    const moveActive = (direction) => {
      if (filteredOptions.value.length === 0)
        return;
      let index = activeIndex.value;
      for (let attempts = 0; attempts < filteredOptions.value.length; attempts += 1) {
        index = (index + direction + filteredOptions.value.length) % filteredOptions.value.length;
        if (!isOptionDisabled(filteredOptions.value[index])) {
          activeIndex.value = index;
          return;
        }
      }
    };
    const handleKeydown = (event) => {
      if (isDisabled.value)
        return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!mergedOpen.value) {
          requestOpen(true);
          return;
        }
        moveActive(event.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if (event.key === "Enter" && mergedOpen.value) {
        event.preventDefault();
        const option = filteredOptions.value[activeIndex.value];
        if (option)
          selectOption(option);
        else if (props.mode === "tags" && currentSearchValue.value.trim()) {
          selectOption({ label: currentSearchValue.value.trim(), value: currentSearchValue.value.trim() });
        }
        return;
      }
      if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        closePopup();
        void vue.nextTick(() => {
          var _a;
          return (_a = isSearchable.value ? searchRef.value : selectorRef.value) == null ? void 0 : _a.focus();
        });
      }
    };
    const handleFocusIn = (event) => {
      if (focused.value)
        return;
      focused.value = true;
      emit("focus", event);
    };
    const handleFocusOut = (event) => {
      void vue.nextTick(() => {
        var _a, _b;
        const active = document.activeElement;
        if (((_a = rootRef.value) == null ? void 0 : _a.contains(active)) || ((_b = popupRef.value) == null ? void 0 : _b.contains(active)))
          return;
        focused.value = false;
        emit("blur", event);
        closePopup();
      });
    };
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: selectorRef,
      floating: popupRef,
      onDismiss: () => closePopup()
    });
    vue.watch(filteredOptions, () => {
      if (mergedOpen.value)
        setInitialActive();
    });
    vue.watch(() => props.defaultOpen, (open) => {
      if (!isOpenControlled.value)
        internalOpen.value = open;
    });
    const focus = () => {
      var _a;
      return (_a = isSearchable.value ? searchRef.value : selectorRef.value) == null ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a, _b;
      (_a = searchRef.value) == null ? void 0 : _a.blur();
      (_b = selectorRef.value) == null ? void 0 : _b.blur();
    };
    __expose({ focus, blur });
    return (_ctx, _cache) => {
      var _a;
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-select", selectClass.value]),
        style: vue.normalizeStyle(rootStyle.value)
      }, [
        vue.createElementVNode("span", {
          ref_key: "selectorRef",
          ref: selectorRef,
          class: vue.normalizeClass(["aheart-select__selector", _ctx.classNames.selector]),
          style: vue.normalizeStyle(_ctx.styles.selector),
          id: isSearchable.value ? void 0 : _ctx.id,
          role: isSearchable.value ? void 0 : "combobox",
          tabindex: isSearchable.value || isDisabled.value ? void 0 : 0,
          "aria-controls": listboxId,
          "aria-labelledby": resolvedAriaLabelledby.value,
          "aria-expanded": mergedOpen.value ? "true" : "false",
          "aria-haspopup": isSearchable.value ? void 0 : "listbox",
          "aria-disabled": isDisabled.value ? "true" : void 0,
          "aria-busy": _ctx.loading ? "true" : void 0,
          "aria-activedescendant": activeOptionId.value,
          onClick: handleSelectorClick,
          onKeydown: handleKeydown,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut
        }, [
          hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(["aheart-select__prefix", _ctx.classNames.prefix]),
            style: vue.normalizeStyle(_ctx.styles.prefix)
          }, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ], 6)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-select__selection", _ctx.classNames.selection]),
            style: vue.normalizeStyle(_ctx.styles.selection)
          }, [
            isMultiple.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(visibleSelectedOptions.value, (option) => {
                return vue.openBlock(), vue.createElementBlock("span", {
                  key: getOptionKey(option.value),
                  class: vue.normalizeClass(["aheart-select__tag", _ctx.classNames.tag]),
                  style: vue.normalizeStyle(_ctx.styles.tag)
                }, [
                  vue.createElementVNode("span", _hoisted_2, [
                    vue.createVNode(vue.unref(ARenderNode), {
                      node: renderTag(option)
                    }, null, 8, ["node"])
                  ]),
                  !isDisabled.value ? (vue.openBlock(), vue.createElementBlock("button", {
                    key: 0,
                    class: vue.normalizeClass(["aheart-select__tag-remove", _ctx.classNames.tagRemove]),
                    style: vue.normalizeStyle(_ctx.styles.tagRemove),
                    type: "button",
                    "aria-label": `Remove ${option.label}`,
                    onClick: vue.withModifiers(($event) => removeValue(option.value), ["stop"])
                  }, " × ", 14, _hoisted_3)) : vue.createCommentVNode("", true)
                ], 6);
              }), 128)),
              hiddenTagCount.value > 0 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, " +" + vue.toDisplayString(hiddenTagCount.value), 1)) : vue.createCommentVNode("", true)
            ], 64)) : vue.createCommentVNode("", true),
            isSearchable.value ? (vue.openBlock(), vue.createElementBlock("input", {
              key: 1,
              ref_key: "searchRef",
              ref: searchRef,
              class: vue.normalizeClass(["aheart-select__search", _ctx.classNames.search]),
              style: vue.normalizeStyle(_ctx.styles.search),
              id: _ctx.id,
              type: "text",
              role: "combobox",
              autocomplete: "off",
              value: currentSearchValue.value,
              disabled: isDisabled.value,
              placeholder: searchPlaceholder.value,
              "aria-controls": listboxId,
              "aria-labelledby": resolvedAriaLabelledby.value,
              "aria-expanded": mergedOpen.value ? "true" : "false",
              "aria-haspopup": "listbox",
              "aria-activedescendant": activeOptionId.value,
              "aria-busy": _ctx.loading ? "true" : void 0,
              onInput: handleSearch,
              onClick: vue.withModifiers(openPopup, ["stop"]),
              onKeydown: handleKeydown
            }, null, 46, _hoisted_5)) : !isMultiple.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass(["aheart-select__value", { "is-placeholder": !selectedOption.value }])
            }, vue.toDisplayString(((_a = selectedOption.value) == null ? void 0 : _a.label) ?? _ctx.placeholder ?? ""), 3)) : selectedOptions.value.length === 0 && !isSearchable.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, vue.toDisplayString(_ctx.placeholder), 1)) : vue.createCommentVNode("", true)
          ], 6),
          _ctx.name ? (vue.openBlock(), vue.createElementBlock("input", {
            key: 1,
            type: "hidden",
            name: _ctx.name,
            value: formValue.value
          }, null, 8, _hoisted_7)) : vue.createCommentVNode("", true),
          _ctx.allowClear && !isDisabled.value && !_ctx.loading && hasValue.value ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            class: vue.normalizeClass(["aheart-select__clear", _ctx.classNames.clear]),
            style: vue.normalizeStyle(_ctx.styles.clear),
            type: "button",
            "aria-label": "Clear",
            onClick: vue.withModifiers(handleClear, ["stop"])
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
              _ctx.loadingIcon !== void 0 ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 0,
                node: _ctx.loadingIcon
              }, null, 8, ["node"])) : (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 1,
                name: "loading",
                size: 16,
                spin: ""
              }))
            ])
          ], 6)) : (vue.openBlock(), vue.createElementBlock("span", {
            key: 4,
            class: vue.normalizeClass(["aheart-select__suffix", _ctx.classNames.suffix]),
            style: vue.normalizeStyle(_ctx.styles.suffix),
            "aria-hidden": "true"
          }, [
            vue.renderSlot(_ctx.$slots, "suffixIcon", {}, () => [
              _ctx.suffixIcon !== void 0 ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 0,
                node: _ctx.suffixIcon
              }, null, 8, ["node"])) : (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 1,
                name: "chevron-down",
                size: 16
              }))
            ])
          ], 6))
        ], 46, _hoisted_1),
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8, "Loading")) : vue.createCommentVNode("", true),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          vue.unref(motion).isMounted.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            id: listboxId,
            ref_key: "popupRef",
            ref: popupRef,
            class: vue.normalizeClass(["aheart-select__popup", popupClass.value]),
            style: vue.normalizeStyle(popupStyle.value),
            role: "listbox",
            "aria-multiselectable": isMultiple.value ? "true" : void 0,
            "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["aheart-select__list", _ctx.classNames.list]),
              style: vue.normalizeStyle(_ctx.styles.list)
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(filteredOptions.value, (option, index) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  id: getOptionId(index),
                  key: getOptionKey(option.value),
                  class: vue.normalizeClass(["aheart-select__option", [
                    _ctx.classNames.option,
                    {
                      "is-active": index === activeIndex.value,
                      "is-selected": isValueSelected(option.value),
                      "is-disabled": isOptionDisabled(option)
                    }
                  ]]),
                  style: vue.normalizeStyle(_ctx.styles.option),
                  role: "option",
                  "aria-selected": isValueSelected(option.value) ? "true" : "false",
                  "aria-disabled": isOptionDisabled(option) ? "true" : void 0,
                  onMouseenter: ($event) => setActiveIndex(index),
                  onMousedown: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                  }, ["prevent"])),
                  onClick: ($event) => selectOption(option)
                }, [
                  vue.createElementVNode("span", _hoisted_11, [
                    vue.createVNode(vue.unref(ARenderNode), {
                      node: renderOption(option, index)
                    }, null, 8, ["node"])
                  ]),
                  isValueSelected(option.value) ? (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                    key: 0,
                    name: "check",
                    size: 16,
                    "aria-hidden": "true"
                  })) : vue.createCommentVNode("", true)
                ], 46, _hoisted_10);
              }), 128)),
              hasNoOptions.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(["aheart-select__empty", _ctx.classNames.notFound]),
                style: vue.normalizeStyle(_ctx.styles.notFound)
              }, vue.toDisplayString(_ctx.loading ? "Loading" : _ctx.notFoundContent), 7)) : vue.createCommentVNode("", true)
            ], 6)
          ], 14, _hoisted_9)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 6);
    };
  }
});
exports.default = _sfc_main;
