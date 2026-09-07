import { defineComponent, useSlots, useAttrs, ref, computed, watch, nextTick, openBlock, createElementBlock, mergeProps, createElementVNode, normalizeClass, normalizeStyle, renderSlot, createVNode, unref, createCommentVNode, Fragment, renderList, withModifiers, toDisplayString, createBlock, Teleport, withDirectives, vShow } from "vue";
import { useFormControl, mergeAriaIds, formAriaInvalid } from "../form/control-context.js";
import _sfc_main$1 from "../icon/icon.vue.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { useControllableState } from "../utils/use-controllable-state.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { useStableId } from "../utils/use-stable-id.js";
import { useTeleportReady } from "../utils/use-teleport-ready.js";
import { useSelectVirtual } from "./use-select-virtual.js";
import { selectProps, selectEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = ["id", "role", "tabindex", "aria-controls", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-haspopup", "aria-disabled", "aria-busy", "aria-activedescendant"];
const _hoisted_2 = { class: "aheart-select__tag-label" };
const _hoisted_3 = ["aria-label", "onClick"];
const _hoisted_4 = {
  key: 0,
  class: "aheart-select__tag aheart-select__tag--rest"
};
const _hoisted_5 = ["id", "value", "disabled", "placeholder", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "aria-busy"];
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
const _hoisted_10 = ["id", "data-index", "aria-posinset", "aria-setsize", "aria-selected", "aria-disabled", "onMouseenter", "onClick"];
const _hoisted_11 = { class: "aheart-select__option-content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ASelect", inheritAttrs: false },
  __name: "select",
  props: selectProps,
  emits: selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const attrs = useAttrs();
    const config = useAheartConfig();
    const formControl = useFormControl();
    const rootRef = ref(null);
    const selectorRef = ref(null);
    const searchRef = ref(null);
    const popupRef = ref(null);
    const internalSearchValue = ref("");
    const activeKey = ref();
    const isComposing = ref(false);
    let compositionInputValues;
    const focused = ref(false);
    const listboxId = `${useStableId(void 0, "aheart-select").value}-listbox`;
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
    const isOpenControlled = usePropPresence("open");
    const isSearchControlled = usePropPresence("searchValue", "search-value");
    const valueState = useControllableState({
      controlled: () => props.modelValue,
      isControlled,
      defaultValue: () => props.defaultValue,
      onChange: (value) => {
        if (value === void 0)
          return;
        emit("update:modelValue", value);
        emit("change", value);
      }
    });
    const openState = useControllableState({
      controlled: () => props.open,
      isControlled: isOpenControlled,
      defaultValue: () => props.defaultOpen,
      onChange: (open) => emit("openChange", Boolean(open))
    });
    const mergedValue = valueState.state;
    const mergedOpen = computed(() => Boolean(openState.state.value) && (!props.virtual || !isDisabled.value));
    const currentSearchValue = computed(() => isSearchControlled.value ? props.searchValue ?? "" : internalSearchValue.value);
    const resolvedId = computed(() => props.id ?? (formControl == null ? void 0 : formControl.controlId.value));
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const mergedAriaLabelledby = computed(() => mergeAriaIds(resolvedAriaLabelledby.value, formControl == null ? void 0 : formControl.labelledBy.value));
    const mergedAriaDescribedby = computed(() => mergeAriaIds(attrs["aria-describedby"], formControl == null ? void 0 : formControl.describedBy.value));
    const resolvedStatus = computed(() => props.status ?? (formControl == null ? void 0 : formControl.status.value));
    const resolvedAriaInvalid = computed(() => formAriaInvalid(attrs["aria-invalid"], resolvedStatus.value));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = computed(() => props.variant ?? (props.bordered === false ? "borderless" : config.value.variant ?? "outlined"));
    const hasPrefix = computed(() => Boolean(props.prefix !== void 0 || slots.prefix));
    const allowClearConfig = computed(() => typeof props.allowClear === "object" ? props.allowClear : void 0);
    const clearIconContent = computed(() => {
      var _a;
      return ((_a = allowClearConfig.value) == null ? void 0 : _a.clearIcon) ?? "×";
    });
    const interactiveAriaAttrs = computed(() => Object.fromEntries(
      Object.entries(attrs).filter(([key]) => key.startsWith("aria-"))
    ));
    const rootAttrs = computed(() => Object.fromEntries(
      Object.entries(attrs).filter(([key]) => !key.startsWith("aria-"))
    ));
    const resolvedLoadingText = computed(() => {
      var _a, _b;
      return ((_b = (_a = config.value.locale) == null ? void 0 : _a.table) == null ? void 0 : _b.loadingText) ?? "Loading";
    });
    const hasNotFoundContent = usePropPresence("notFoundContent", "not-found-content");
    const resolvedNotFoundContent = computed(
      () => {
        var _a, _b;
        return hasNotFoundContent.value ? props.notFoundContent : ((_b = (_a = config.value.locale) == null ? void 0 : _a.empty) == null ? void 0 : _b.description) ?? props.notFoundContent;
      }
    );
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
    const getOptionId = (option) => `${listboxId}-option-${Array.from(getOptionKey(option.value), (character) => character.codePointAt(0).toString(16)).join("-")}`;
    const activeIndex = computed(() => filteredOptions.value.findIndex((option) => getOptionKey(option.value) === activeKey.value));
    const activeOptionId = computed(() => {
      const option = filteredOptions.value[activeIndex.value];
      return option && mergedOpen.value ? getOptionId(option) : void 0;
    });
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const teleportReady = useTeleportReady();
    const popupContainer = computed(() => {
      var _a;
      if (props.getPopupContainer && selectorRef.value)
        return props.getPopupContainer(selectorRef.value);
      return ((_a = selectorRef.value) == null ? void 0 : _a.ownerDocument.body) ?? false;
    });
    const shouldTeleport = computed(() => teleportReady.value && popupContainer.value !== false);
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
        [`aheart-select--${resolvedStatus.value}`]: resolvedStatus.value,
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
    const popupStyle = computed(() => [floatingPosition.popupStyle.value, popupWidthStyle.value, props.styles.popup, virtualList.popupStyle.value]);
    const setInitialActive = () => {
      const current = filteredOptions.value.find((option) => getOptionKey(option.value) === activeKey.value && !isOptionDisabled(option));
      if (current)
        return;
      const selected = filteredOptions.value.find((option) => isValueSelected(option.value) && !isOptionDisabled(option));
      const firstEnabled = filteredOptions.value.find((option) => !isOptionDisabled(option));
      const next = selected ?? firstEnabled;
      activeKey.value = next ? getOptionKey(next.value) : void 0;
    };
    watch([mergedOpen, () => props.virtual], () => {
      if (props.virtual && mergedOpen.value)
        setInitialActive();
    }, { immediate: true });
    const virtualList = useSelectVirtual({
      config: () => props.virtual,
      open: mergedOpen,
      disabled: isDisabled,
      popup: popupRef,
      options: filteredOptions,
      activeIndex,
      activeKey,
      key: (option) => getOptionKey(option.value)
    });
    const requestOpen = (open) => {
      if (isDisabled.value)
        return;
      openState.setState(open, { force: true });
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
      valueState.setState(value, { force: true });
      formControl == null ? void 0 : formControl.change();
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
      if (isComposing.value || event.isComposing)
        return;
      const value = event.target.value;
      if (event.type === "input" && compositionInputValues) {
        const repeatedCommit = compositionInputValues.has(value);
        compositionInputValues = void 0;
        if (repeatedCommit)
          return;
      }
      if (!isSearchControlled.value)
        internalSearchValue.value = value;
      else
        event.target.value = currentSearchValue.value;
      emit("search", value);
      openPopup();
      void nextTick(setInitialActive);
    };
    const handleCompositionStart = () => {
      compositionInputValues = void 0;
      isComposing.value = true;
    };
    const handleCompositionEnd = (event) => {
      isComposing.value = false;
      const input = event.target;
      const value = input.value;
      handleSearch(event);
      compositionInputValues = /* @__PURE__ */ new Set([value, input.value]);
    };
    const setActiveIndex = (index) => {
      const option = filteredOptions.value[index];
      if (option && !isOptionDisabled(option))
        activeKey.value = getOptionKey(option.value);
    };
    const moveActive = (direction) => {
      if (filteredOptions.value.length === 0)
        return;
      let index = activeIndex.value;
      if (index < 0)
        index = direction === 1 ? -1 : 0;
      for (let attempts = 0; attempts < filteredOptions.value.length; attempts += 1) {
        index = (index + direction + filteredOptions.value.length) % filteredOptions.value.length;
        if (!isOptionDisabled(filteredOptions.value[index])) {
          activeKey.value = getOptionKey(filteredOptions.value[index].value);
          return;
        }
      }
    };
    const handleKeydown = (event) => {
      if (isDisabled.value)
        return;
      if (isComposing.value || event.isComposing || event.keyCode === 229)
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
      if ((event.key === "Home" || event.key === "End") && !isSearchable.value && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        const enabled = filteredOptions.value.filter((option2) => !isOptionDisabled(option2));
        const option = enabled[event.key === "Home" ? 0 : enabled.length - 1];
        activeKey.value = option ? getOptionKey(option.value) : void 0;
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
        var _a, _b, _c;
        const active = ((_a = rootRef.value) == null ? void 0 : _a.ownerDocument.activeElement) ?? null;
        if (((_b = rootRef.value) == null ? void 0 : _b.contains(active)) || ((_c = popupRef.value) == null ? void 0 : _c.contains(active)))
          return;
        focused.value = false;
        emit("blur", event);
        formControl == null ? void 0 : formControl.blur();
        closePopup();
      });
    };
    useFloatingDismiss({
      open: mergedOpen,
      trigger: selectorRef,
      floating: popupRef,
      ignoreEscape: isComposing,
      onDismiss: () => closePopup()
    });
    watch(filteredOptions, () => {
      if (mergedOpen.value)
        setInitialActive();
    });
    watch(activeOptionId, () => {
      if (virtualList.config.value)
        return;
      void nextTick(() => {
        const popup = popupRef.value;
        const id = activeOptionId.value;
        const option = id && (popup == null ? void 0 : popup.ownerDocument.getElementById(id));
        if (!popup || !option || !popup.contains(option))
          return;
        const bounds = popup.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        const scale = popup.offsetHeight ? bounds.height / popup.offsetHeight : 1;
        if (!scale)
          return;
        const top = bounds.top + popup.clientTop * scale;
        const bottom = top + popup.clientHeight * scale;
        if (row.top < top)
          popup.scrollTop += (row.top - top) / scale;
        else if (row.bottom > bottom)
          popup.scrollTop += (row.bottom - bottom) / scale;
      });
    }, { flush: "post" });
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
      return openBlock(), createElementBlock("span", mergeProps({
        ref_key: "rootRef",
        ref: rootRef,
        class: ["aheart-select", selectClass.value],
        style: rootStyle.value
      }, rootAttrs.value), [
        createElementVNode("span", mergeProps({
          ref_key: "selectorRef",
          ref: selectorRef,
          class: ["aheart-select__selector", _ctx.classNames.selector],
          style: _ctx.styles.selector
        }, isSearchable.value ? void 0 : interactiveAriaAttrs.value, {
          id: isSearchable.value ? void 0 : resolvedId.value,
          role: isSearchable.value ? void 0 : "combobox",
          tabindex: isSearchable.value || isDisabled.value ? void 0 : 0,
          "aria-controls": isSearchable.value ? void 0 : listboxId,
          "aria-labelledby": isSearchable.value ? void 0 : mergedAriaLabelledby.value,
          "aria-describedby": isSearchable.value ? void 0 : mergedAriaDescribedby.value,
          "aria-invalid": isSearchable.value ? void 0 : resolvedAriaInvalid.value,
          "aria-expanded": isSearchable.value ? void 0 : mergedOpen.value ? "true" : "false",
          "aria-haspopup": isSearchable.value ? void 0 : "listbox",
          "aria-disabled": isSearchable.value ? void 0 : isDisabled.value ? "true" : void 0,
          "aria-busy": isSearchable.value ? void 0 : _ctx.loading ? "true" : void 0,
          "aria-activedescendant": isSearchable.value ? void 0 : activeOptionId.value,
          onClick: handleSelectorClick,
          onKeydown: handleKeydown,
          onFocusin: handleFocusIn,
          onFocusout: handleFocusOut
        }), [
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
                    "aria-label": `移除 ${option.label}`,
                    onClick: withModifiers(($event) => removeValue(option.value), ["stop"])
                  }, " × ", 14, _hoisted_3)) : createCommentVNode("", true)
                ], 6);
              }), 128)),
              hiddenTagCount.value > 0 ? (openBlock(), createElementBlock("span", _hoisted_4, " +" + toDisplayString(hiddenTagCount.value), 1)) : createCommentVNode("", true)
            ], 64)) : createCommentVNode("", true),
            isSearchable.value ? (openBlock(), createElementBlock("input", mergeProps({
              key: 1,
              ref_key: "searchRef",
              ref: searchRef,
              class: ["aheart-select__search", _ctx.classNames.search],
              style: _ctx.styles.search,
              id: resolvedId.value,
              type: "text",
              role: "combobox",
              autocomplete: "off",
              value: currentSearchValue.value,
              disabled: isDisabled.value,
              placeholder: searchPlaceholder.value
            }, isSearchable.value ? interactiveAriaAttrs.value : void 0, {
              "aria-controls": listboxId,
              "aria-labelledby": mergedAriaLabelledby.value,
              "aria-describedby": mergedAriaDescribedby.value,
              "aria-invalid": resolvedAriaInvalid.value,
              "aria-expanded": mergedOpen.value ? "true" : "false",
              "aria-autocomplete": "list",
              "aria-haspopup": "listbox",
              "aria-activedescendant": activeOptionId.value,
              "aria-busy": _ctx.loading ? "true" : void 0,
              onInput: handleSearch,
              onCompositionstart: handleCompositionStart,
              onCompositionend: handleCompositionEnd,
              onClick: withModifiers(openPopup, ["stop"])
            }), null, 16, _hoisted_5)) : !isMultiple.value ? (openBlock(), createElementBlock("span", {
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
            "aria-label": "清除",
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
        ], 16, _hoisted_1),
        _ctx.loading ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(resolvedLoadingText.value), 1)) : createCommentVNode("", true),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            id: listboxId,
            onFocusout: handleFocusOut,
            ref_key: "popupRef",
            ref: popupRef,
            class: normalizeClass(["aheart-select__popup", popupClass.value]),
            style: normalizeStyle(popupStyle.value),
            role: "listbox",
            "aria-multiselectable": isMultiple.value ? "true" : void 0,
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0
          }, [
            createElementVNode("div", {
              class: normalizeClass(["aheart-select__list", [_ctx.classNames.list, { "is-virtual": unref(virtualList).config.value }]]),
              style: normalizeStyle([_ctx.styles.list, unref(virtualList).listStyle.value])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(virtualList).rows.value, ({ option, index, item }) => {
                return openBlock(), createElementBlock("div", {
                  id: getOptionId(option),
                  key: getOptionKey(option.value),
                  class: normalizeClass(["aheart-select__option", [
                    _ctx.classNames.option,
                    {
                      "is-active": getOptionKey(option.value) === activeKey.value,
                      "is-selected": isValueSelected(option.value),
                      "is-disabled": isOptionDisabled(option)
                    }
                  ]]),
                  style: normalizeStyle([_ctx.styles.option, unref(virtualList).rowStyle({ option, index, item })]),
                  ref_for: true,
                  ref: unref(virtualList).config.value ? unref(virtualList).measure : void 0,
                  "data-index": unref(virtualList).config.value ? index : void 0,
                  role: "option",
                  "aria-posinset": unref(virtualList).config.value ? index + 1 : void 0,
                  "aria-setsize": unref(virtualList).config.value ? filteredOptions.value.length : void 0,
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
              }, toDisplayString(_ctx.loading ? resolvedLoadingText.value : resolvedNotFoundContent.value), 7)) : createCommentVNode("", true)
            ], 6)
          ], 46, _hoisted_9)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 16);
    };
  }
});
export {
  _sfc_main as default
};
