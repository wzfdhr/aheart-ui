import { defineComponent, useSlots, useAttrs, ref, useId, computed, watch, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, Fragment, renderList, withModifiers, toDisplayString, createBlock, Teleport, withDirectives, vShow, nextTick } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { selectProps, selectEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASelect" },
  __name: "select",
  props: selectProps,
  emits: selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    const config = useAheartConfig();
    const rootRef = ref(null);
    const selectorRef = ref(null);
    const searchRef = ref(null);
    const popupRef = ref(null);
    const internalSearchValue = ref("");
    const internalValue = ref(props.defaultValue);
    const internalOpen = ref(props.defaultOpen);
    const activeIndex = ref(-1);
    const focused = ref(false);
    const instanceId = useId().replace(/:/g, "");
    const listboxId = `aheart-select-${instanceId}-listbox`;
    const ARenderNode = defineComponent({
      name: "ASelectRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => renderProps.node;
      }
    });
    const defaultFieldNames = { label: "label", value: "value", disabled: "disabled" };
    const resolvedFieldNames = computed(() => ({ ...defaultFieldNames, ...props.fieldNames }));
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
    const rawOptions = computed(() => props.options ?? []);
    const normalizedOptions = computed(() => rawOptions.value.map(normalizeOption));
    const isMultiple = computed(() => props.mode === "multiple" || props.mode === "tags");
    const isSearchable = computed(() => props.showSearch || props.mode === "tags");
    const isControlled = usePropPresence("modelValue", "model-value");
    const mergedValue = computed(() => isControlled.value ? props.modelValue : internalValue.value);
    const isOpenControlled = usePropPresence("open");
    const isSearchControlled = usePropPresence("searchValue", "search-value");
    const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const currentSearchValue = computed(() => isSearchControlled.value ? props.searchValue ?? "" : internalSearchValue.value);
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined"));
    const hasPrefix = computed(() => Boolean(props.prefix !== void 0 || slots.prefix));
    const allowClearConfig = computed(() => typeof props.allowClear === "object" ? props.allowClear : void 0);
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const getOptionKey = (value) => `${typeof value}:${String(value)}`;
    const valueEquals = (left, right) => left === right;
    const selectedValues = computed(
      () => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value === void 0 || mergedValue.value === "" ? [] : [mergedValue.value]
    );
    const selectedOptions = computed(() => selectedValues.value.map(
      (value) => normalizedOptions.value.find((option) => valueEquals(option.value, value)) ?? { label: String(value), value }
    ));
    const selectedOption = computed(() => selectedOptions.value[0]);
    const visibleSelectedOptions = computed(
      () => props.maxTagCount === void 0 ? selectedOptions.value : selectedOptions.value.slice(0, Math.max(0, props.maxTagCount))
    );
    const hiddenTagCount = computed(() => selectedOptions.value.length - visibleSelectedOptions.value.length);
    const hasValue = computed(() => selectedValues.value.length > 0);
    const formValue = computed(() => isMultiple.value ? JSON.stringify(selectedValues.value) : String(selectedValues.value[0] ?? ""));
    const searchPlaceholder = computed(() => selectedOptions.value.length === 0 ? props.placeholder : void 0);
    const filteredOptions = computed(() => {
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
    const hasNoOptions = computed(() => filteredOptions.value.length === 0);
    const isOptionDisabled = (option) => Boolean(option.disabled);
    const isValueSelected = (value) => selectedValues.value.some((selected) => valueEquals(selected, value));
    const getOptionId = (index) => `${listboxId}-option-${index}`;
    const activeOptionId = computed(() => activeIndex.value >= 0 && mergedOpen.value ? getOptionId(activeIndex.value) : void 0);
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => {
      if (props.getPopupContainer && selectorRef.value)
        return props.getPopupContainer(selectorRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({
      reference: selectorRef,
      floating: popupRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
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
        "is-searchable": isSearchable.value,
        "is-open": mergedOpen.value,
        "is-focused": focused.value,
        "has-prefix": hasPrefix.value
      }
    ]);
    const rootStyle = computed(() => [props.style, props.styles.root]);
    const popupClass = computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`,
      props.classNames.popup
    ]);
    const popupWidthStyle = computed(() => {
      var _a;
      if (props.popupMatchSelectWidth === false)
        return { minWidth: "160px" };
      const width = typeof props.popupMatchSelectWidth === "number" ? props.popupMatchSelectWidth : (_a = selectorRef.value) == null ? void 0 : _a.getBoundingClientRect().width;
      return width ? { width: `${width}px` } : {};
    });
    const popupStyle = computed(() => [floatingPosition.popupStyle.value, popupWidthStyle.value, props.styles.popup]);
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
        void nextTick(() => {
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
          void nextTick(() => {
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
      void nextTick(setInitialActive);
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
        void nextTick(() => {
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
      void nextTick(() => {
        var _a, _b;
        const active = document.activeElement;
        if (((_a = rootRef.value) == null ? void 0 : _a.contains(active)) || ((_b = popupRef.value) == null ? void 0 : _b.contains(active)))
          return;
        focused.value = false;
        emit("blur", event);
        closePopup();
      });
    };
    useFloatingDismiss({
      open: mergedOpen,
      trigger: selectorRef,
      floating: popupRef,
      onDismiss: () => closePopup()
    });
    watch(filteredOptions, () => {
      if (mergedOpen.value)
        setInitialActive();
    });
    watch(() => props.defaultOpen, (open) => {
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
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-select", selectClass.value]),
        style: normalizeStyle(rootStyle.value)
      }, [
        createElementVNode("span", {
          ref_key: "selectorRef",
          ref: selectorRef,
          class: normalizeClass(["aheart-select__selector", _ctx.classNames.selector]),
          style: normalizeStyle(_ctx.styles.selector),
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
          hasPrefix.value ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(["aheart-select__prefix", _ctx.classNames.prefix]),
            style: normalizeStyle(_ctx.styles.prefix)
          }, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ], 6)) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-select__selection", _ctx.classNames.selection]),
            style: normalizeStyle(_ctx.styles.selection)
          }, [
            isMultiple.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSelectedOptions.value, (option) => {
                return openBlock(), createElementBlock("span", {
                  key: getOptionKey(option.value),
                  class: normalizeClass(["aheart-select__tag", _ctx.classNames.tag]),
                  style: normalizeStyle(_ctx.styles.tag)
                }, [
                  createElementVNode("span", _hoisted_2, [
                    createVNode(unref(ARenderNode), {
                      node: renderTag(option)
                    }, null, 8, ["node"])
                  ]),
                  !isDisabled.value ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    class: normalizeClass(["aheart-select__tag-remove", _ctx.classNames.tagRemove]),
                    style: normalizeStyle(_ctx.styles.tagRemove),
                    type: "button",
                    "aria-label": `Remove ${option.label}`,
                    onClick: withModifiers(($event) => removeValue(option.value), ["stop"])
                  }, " × ", 14, _hoisted_3)) : createCommentVNode("", true)
                ], 6);
              }), 128)),
              hiddenTagCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_4, " +" + toDisplayString(hiddenTagCount.value), 1)) : createCommentVNode("", true)
            ], 64)) : createCommentVNode("", true),
            isSearchable.value ? (openBlock(), createElementBlock("input", {
              key: 1,
              ref_key: "searchRef",
              ref: searchRef,
              class: normalizeClass(["aheart-select__search", _ctx.classNames.search]),
              style: normalizeStyle(_ctx.styles.search),
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
              onClick: withModifiers(openPopup, ["stop"]),
              onKeydown: handleKeydown
            }, null, 46, _hoisted_5)) : !isMultiple.value ? (openBlock(), createElementBlock("span", {
              key: 2,
              class: normalizeClass(["aheart-select__value", { "is-placeholder": !selectedOption.value }])
            }, toDisplayString(((_a = selectedOption.value) == null ? void 0 : _a.label) ?? _ctx.placeholder ?? ""), 3)) : selectedOptions.value.length === 0 && !isSearchable.value ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(_ctx.placeholder), 1)) : createCommentVNode("", true)
          ], 6),
          _ctx.name ? (openBlock(), createElementBlock("input", {
            key: 1,
            type: "hidden",
            name: _ctx.name,
            value: formValue.value
          }, null, 8, _hoisted_7)) : createCommentVNode("", true),
          _ctx.allowClear && !isDisabled.value && !_ctx.loading && hasValue.value ? (openBlock(), createElementBlock("button", {
            key: 2,
            class: normalizeClass(["aheart-select__clear", _ctx.classNames.clear]),
            style: normalizeStyle(_ctx.styles.clear),
            type: "button",
            "aria-label": "Clear",
            onClick: withModifiers(handleClear, ["stop"])
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
              _ctx.loadingIcon !== void 0 ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.loadingIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "loading",
                size: 16,
                spin: ""
              }))
            ])
          ], 6)) : (openBlock(), createElementBlock("span", {
            key: 4,
            class: normalizeClass(["aheart-select__suffix", _ctx.classNames.suffix]),
            style: normalizeStyle(_ctx.styles.suffix),
            "aria-hidden": "true"
          }, [
            renderSlot(_ctx.$slots, "suffixIcon", {}, () => [
              _ctx.suffixIcon !== void 0 ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.suffixIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "chevron-down",
                size: 16
              }))
            ])
          ], 6))
        ], 46, _hoisted_1),
        _ctx.loading ? (openBlock(), createElementBlock("span", _hoisted_8, "Loading")) : createCommentVNode("", true),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            id: listboxId,
            ref_key: "popupRef",
            ref: popupRef,
            class: normalizeClass(["aheart-select__popup", popupClass.value]),
            style: normalizeStyle(popupStyle.value),
            role: "listbox",
            "aria-multiselectable": isMultiple.value ? "true" : void 0,
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0
          }, [
            createElementVNode("div", {
              class: normalizeClass(["aheart-select__list", _ctx.classNames.list]),
              style: normalizeStyle(_ctx.styles.list)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredOptions.value, (option, index) => {
                return openBlock(), createElementBlock("div", {
                  id: getOptionId(index),
                  key: getOptionKey(option.value),
                  class: normalizeClass(["aheart-select__option", [
                    _ctx.classNames.option,
                    {
                      "is-active": index === activeIndex.value,
                      "is-selected": isValueSelected(option.value),
                      "is-disabled": isOptionDisabled(option)
                    }
                  ]]),
                  style: normalizeStyle(_ctx.styles.option),
                  role: "option",
                  "aria-selected": isValueSelected(option.value) ? "true" : "false",
                  "aria-disabled": isOptionDisabled(option) ? "true" : void 0,
                  onMouseenter: ($event) => setActiveIndex(index),
                  onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
                  }, ["prevent"])),
                  onClick: ($event) => selectOption(option)
                }, [
                  createElementVNode("span", _hoisted_11, [
                    createVNode(unref(ARenderNode), {
                      node: renderOption(option, index)
                    }, null, 8, ["node"])
                  ]),
                  isValueSelected(option.value) ? (openBlock(), createBlock(_sfc_main$1, {
                    key: 0,
                    name: "check",
                    size: 16,
                    "aria-hidden": "true"
                  })) : createCommentVNode("", true)
                ], 46, _hoisted_10);
              }), 128)),
              hasNoOptions.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["aheart-select__empty", _ctx.classNames.notFound]),
                style: normalizeStyle(_ctx.styles.notFound)
              }, toDisplayString(_ctx.loading ? "Loading" : _ctx.notFoundContent), 7)) : createCommentVNode("", true)
            ], 6)
          ], 14, _hoisted_9)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};
