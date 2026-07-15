import { defineComponent, useAttrs, useSlots, ref, useId, isVNode, h, toRaw, computed, watch, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, createBlock, Teleport, withDirectives, normalizeStyle, withModifiers, Fragment, renderList, toDisplayString, vShow } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { createTimeOptions, parseTimeValue, formatTimeValue } from "../picker-core/time.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { timePickerProps, timePickerEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, zhCN, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-time-picker__prefix"
};
const _hoisted_2 = ["id", "value", "placeholder", "disabled", "readonly", "aria-labelledby", "aria-expanded", "aria-activedescendant"];
const _hoisted_3 = ["aria-label"];
const _hoisted_4 = {
  class: "aheart-time-picker__suffix",
  "aria-hidden": "true"
};
const _hoisted_5 = ["aria-label", "aria-hidden"];
const _hoisted_6 = { class: "aheart-time-picker__columns" };
const _hoisted_7 = ["aria-label"];
const _hoisted_8 = ["id", "data-hour", "disabled", "aria-selected", "onClick"];
const _hoisted_9 = ["aria-label"];
const _hoisted_10 = ["id", "data-minute", "disabled", "aria-selected", "onClick"];
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = ["id", "data-second", "disabled", "aria-selected", "onClick"];
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["id", "data-period", "disabled", "aria-selected", "onClick"];
const _hoisted_15 = {
  key: 0,
  class: "aheart-time-picker__footer"
};
const _hoisted_16 = ["disabled"];
const _hoisted_17 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATimePicker" },
  __name: "time-picker",
  props: timePickerProps,
  emits: timePickerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const attrs = useAttrs();
    const slots = useSlots();
    const config = useAheartConfig();
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const inputRef = ref(null);
    const panelRef = ref(null);
    const hourColumnRef = ref(null);
    const minuteColumnRef = ref(null);
    const secondColumnRef = ref(null);
    const periodColumnRef = ref(null);
    const activeColumn = ref("hour");
    const internalValue = ref(props.defaultValue);
    const internalOpen = ref(props.defaultOpen);
    const instanceId = useId().replace(/:/g, "");
    const panelId = `aheart-time-${instanceId}-panel`;
    const isValueControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const isFormatProvided = usePropPresence("format");
    const ARenderNode = defineComponent({
      name: "ATimePickerRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => {
          const node = renderProps.node;
          const component = typeof node === "function" || typeof node === "object" && node !== null && !Array.isArray(node) && !isVNode(node);
          return component ? h(toRaw(node)) : node;
        };
      }
    });
    const mergedValue = computed(() => isValueControlled.value ? props.modelValue : internalValue.value);
    const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const resolvedLocale = computed(() => {
      var _a;
      return { ...zhCN.timePicker, ...(_a = config.value.locale) == null ? void 0 : _a.timePicker };
    });
    const resolvedPlaceholder = computed(() => props.placeholder ?? resolvedLocale.value.selectTime);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const rootClass = computed(() => [
      `aheart-time-picker--${resolvedSize.value}`,
      `aheart-time-picker--${resolvedVariant.value}`,
      props.status && `aheart-time-picker--${props.status}`,
      { "is-open": mergedOpen.value, "is-disabled": isDisabled.value }
    ]);
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const resolvedFormat = computed(() => props.use12Hours && !isFormatProvided.value ? "hh:mm:ss A" : props.format);
    const meridiemLabels = computed(() => ({ am: resolvedLocale.value.am, pm: resolvedLocale.value.pm }));
    const showSeconds = computed(() => resolvedFormat.value.includes("ss"));
    const showPeriod = computed(() => props.use12Hours || resolvedFormat.value.includes("A"));
    const pad = (value) => String(value).padStart(2, "0");
    const parseTime = (value) => parseTimeValue(value, meridiemLabels.value);
    const formatTime = (parts, format = resolvedFormat.value, localized = false) => formatTimeValue(parts, format, localized ? meridiemLabels.value : void 0);
    const initialParts = () => parseTime(mergedValue.value) ?? { hour: 0, minute: 0, second: 0 };
    const draft = ref(initialParts());
    const draftHasValue = ref(Boolean(mergedValue.value));
    const displayValue = computed(() => {
      if (mergedOpen.value && props.needConfirm && draftHasValue.value)
        return formatTime(draft.value, resolvedFormat.value, true);
      const parts = parseTime(mergedValue.value);
      return parts ? formatTime(parts, resolvedFormat.value, true) : mergedValue.value ?? "";
    });
    const displayedHour = computed(() => showPeriod.value ? draft.value.hour % 12 || 12 : draft.value.hour);
    const selectedPeriod = computed(() => draft.value.hour >= 12 ? "PM" : "AM");
    const isInteractionDisabled = computed(() => isDisabled.value || props.readOnly);
    const hourOptions = computed(() => showPeriod.value ? createTimeOptions(12, props.hourStep).map((hour) => hour || 12) : createTimeOptions(24, props.hourStep));
    const minuteOptions = computed(() => createTimeOptions(60, props.minuteStep));
    const secondOptions = computed(() => createTimeOptions(60, props.secondStep));
    const visibleHourOptions = computed(() => props.hideDisabledOptions ? hourOptions.value.filter((value) => !isHourDisabled(value)) : hourOptions.value);
    const visibleMinuteOptions = computed(() => props.hideDisabledOptions ? minuteOptions.value.filter((value) => !isMinuteDisabled(value)) : minuteOptions.value);
    const visibleSecondOptions = computed(() => props.hideDisabledOptions ? secondOptions.value.filter((value) => !isSecondDisabled(value)) : secondOptions.value);
    const visibleColumns = computed(() => [
      "hour",
      "minute",
      ...showSeconds.value ? ["second"] : [],
      ...showPeriod.value ? ["period"] : []
    ]);
    const getTimeOptionId = (column, value) => `aheart-time-${instanceId}-${column}-${String(value).toLowerCase()}`;
    const activeDescendantId = computed(() => {
      if (activeColumn.value === "hour")
        return visibleHourOptions.value.includes(displayedHour.value) ? getTimeOptionId("hour", displayedHour.value) : void 0;
      if (activeColumn.value === "minute")
        return visibleMinuteOptions.value.includes(draft.value.minute) ? getTimeOptionId("minute", draft.value.minute) : void 0;
      if (activeColumn.value === "second")
        return visibleSecondOptions.value.includes(draft.value.second) ? getTimeOptionId("second", draft.value.second) : void 0;
      return getTimeOptionId("period", selectedPeriod.value);
    });
    const disabledConfig = computed(() => {
      if (!props.disabledTime)
        return void 0;
      if (typeof props.disabledTime === "object")
        return props.disabledTime;
      if (props.disabledTime.length === 0)
        return props.disabledTime();
      return void 0;
    });
    const legacyDisabled = computed(
      () => typeof props.disabledTime === "function" && props.disabledTime.length > 0 ? props.disabledTime : void 0
    );
    const isLegacyDisabled = (parts) => {
      if (!legacyDisabled.value)
        return false;
      return legacyDisabled.value(formatTime(parts, props.valueFormat)) || legacyDisabled.value(formatTime(parts, "HH:mm"));
    };
    const isPartsDisabled = (parts) => {
      var _a, _b, _c, _d, _e, _f;
      return Boolean(
        ((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledHours) == null ? void 0 : _b.call(_a).includes(parts.hour)) || ((_d = (_c = disabledConfig.value) == null ? void 0 : _c.disabledMinutes) == null ? void 0 : _d.call(_c, parts.hour).includes(parts.minute)) || ((_f = (_e = disabledConfig.value) == null ? void 0 : _e.disabledSeconds) == null ? void 0 : _f.call(_e, parts.hour, parts.minute).includes(parts.second)) || isLegacyDisabled(parts)
      );
    };
    const toHour24 = (hour) => showPeriod.value ? hour % 12 + (selectedPeriod.value === "PM" ? 12 : 0) : hour;
    const isHourDisabled = (hour) => {
      var _a, _b;
      const hour24 = toHour24(hour);
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledHours) == null ? void 0 : _b.call(_a).includes(hour24)) || isLegacyDisabled({ ...draft.value, hour: hour24 });
    };
    const isMinuteDisabled = (minute) => {
      var _a, _b;
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledMinutes) == null ? void 0 : _b.call(_a, draft.value.hour).includes(minute)) || isLegacyDisabled({ ...draft.value, minute });
    };
    const isSecondDisabled = (second) => {
      var _a, _b;
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledSeconds) == null ? void 0 : _b.call(_a, draft.value.hour, draft.value.minute).includes(second)) || isLegacyDisabled({ ...draft.value, second });
    };
    const isPeriodDisabled = (period) => {
      const hour12 = draft.value.hour % 12;
      return isPartsDisabled({ ...draft.value, hour: hour12 + (period === "PM" ? 12 : 0) });
    };
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => {
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = computed(() => [
      `aheart-floating--${floatingPosition.placement.value}`,
      `is-${motion.phase.value}`
    ]);
    const panelStyle = computed(() => floatingPosition.popupStyle.value);
    const syncDraft = () => {
      draft.value = initialParts();
      draftHasValue.value = Boolean(mergedValue.value);
    };
    const scrollSelectedOptionsIntoView = () => {
      var _a, _b;
      for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value]) {
        (_b = (_a = column == null ? void 0 : column.querySelector(".is-selected")) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { block: "center" });
      }
    };
    const requestOpen = (open) => {
      if (open && isInteractionDisabled.value)
        return;
      if (!isOpenControlled.value)
        internalOpen.value = open;
      emit("openChange", open);
      if (open) {
        syncDraft();
        activeColumn.value = "hour";
      }
    };
    const commitValue = (parts, close = true) => {
      if (isInteractionDisabled.value || isPartsDisabled(parts))
        return false;
      const value = formatTime(parts, props.valueFormat);
      if (!isValueControlled.value)
        internalValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      if (isValueControlled.value && !props.needConfirm)
        syncDraft();
      if (close)
        requestOpen(false);
      return true;
    };
    const selectHour = (hour) => {
      if (isInteractionDisabled.value || isHourDisabled(hour))
        return;
      draft.value = { ...draft.value, hour: toHour24(hour) };
      draftHasValue.value = true;
      if (!props.needConfirm)
        commitValue(draft.value, false);
    };
    const selectMinute = (minute) => {
      if (isInteractionDisabled.value || isMinuteDisabled(minute))
        return;
      draft.value = { ...draft.value, minute };
      draftHasValue.value = true;
      if (!props.needConfirm)
        commitValue(draft.value, false);
    };
    const selectSecond = (second) => {
      if (isInteractionDisabled.value || isSecondDisabled(second))
        return;
      draft.value = { ...draft.value, second };
      draftHasValue.value = true;
      if (!props.needConfirm)
        commitValue(draft.value, false);
    };
    const selectPeriod = (period) => {
      if (isInteractionDisabled.value || isPeriodDisabled(period))
        return;
      const hour12 = draft.value.hour % 12;
      draft.value = { ...draft.value, hour: hour12 + (period === "PM" ? 12 : 0) };
      draftHasValue.value = true;
      if (!props.needConfirm)
        commitValue(draft.value, false);
    };
    const confirmValue = () => commitValue(draft.value);
    const selectNow = () => {
      if (isInteractionDisabled.value)
        return;
      const now = /* @__PURE__ */ new Date();
      const next = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
      if (isPartsDisabled(next))
        return;
      draft.value = next;
      draftHasValue.value = true;
      if (!props.needConfirm)
        commitValue(draft.value);
    };
    const clearValue = () => {
      if (isInteractionDisabled.value)
        return;
      if (!isValueControlled.value)
        internalValue.value = void 0;
      emit("update:modelValue", void 0);
      emit("change", void 0);
      emit("clear");
      requestOpen(false);
    };
    const handleInputChange = (event) => {
      if (isInteractionDisabled.value)
        return;
      const input = event.target;
      const value = input.value.trim();
      if (!value)
        return clearValue();
      const parts = parseTime(value);
      if (!parts || isPartsDisabled(parts)) {
        emit("invalid", value);
        input.value = displayValue.value;
      } else if (props.needConfirm) {
        draft.value = parts;
        draftHasValue.value = true;
        input.value = formatTime(parts, resolvedFormat.value, true);
      } else if (!commitValue(parts)) {
        emit("invalid", value);
        input.value = displayValue.value;
      }
    };
    let scrollTimer;
    const handleColumnScroll = (column, event) => {
      if (!props.changeOnScroll || isInteractionDisabled.value)
        return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const options = column === "hour" ? visibleHourOptions.value : column === "minute" ? visibleMinuteOptions.value : visibleSecondOptions.value;
        const value = options[Math.max(0, Math.min(options.length - 1, Math.round(event.target.scrollTop / 28)))];
        if (value === void 0)
          return;
        const next = column === "hour" ? { ...draft.value, hour: toHour24(value) } : column === "minute" ? { ...draft.value, minute: value } : { ...draft.value, second: value };
        draft.value = next;
        draftHasValue.value = true;
        if (!props.needConfirm)
          commitValue(next, false);
      }, 0);
    };
    const moveToOption = (options, current, direction, disabled, apply) => {
      if (!options.length)
        return;
      let index = Math.max(0, options.indexOf(current));
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        index = (index + direction + options.length) % options.length;
        const option = options[index];
        if (!disabled(option)) {
          apply(option);
          return;
        }
      }
    };
    const moveActiveColumn = (direction) => {
      const index = visibleColumns.value.indexOf(activeColumn.value);
      activeColumn.value = visibleColumns.value[(index + direction + visibleColumns.value.length) % visibleColumns.value.length];
    };
    const moveActiveValue = (direction) => {
      if (activeColumn.value === "hour") {
        moveToOption(visibleHourOptions.value, displayedHour.value, direction, isHourDisabled, selectHour);
      } else if (activeColumn.value === "minute") {
        moveToOption(visibleMinuteOptions.value, draft.value.minute, direction, isMinuteDisabled, selectMinute);
      } else if (activeColumn.value === "second") {
        moveToOption(visibleSecondOptions.value, draft.value.second, direction, isSecondDisabled, selectSecond);
      } else {
        moveToOption(["AM", "PM"], selectedPeriod.value, direction, isPeriodDisabled, selectPeriod);
      }
      void nextTick(scrollSelectedOptionsIntoView);
    };
    const handleKeydown = (event) => {
      if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void nextTick(() => {
          var _a;
          return (_a = inputRef.value) == null ? void 0 : _a.focus();
        });
        return;
      }
      if (isInteractionDisabled.value)
        return;
      if (!mergedOpen.value && event.key === "ArrowDown") {
        event.preventDefault();
        requestOpen(true);
      } else if (mergedOpen.value && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        moveActiveColumn(event.key === "ArrowRight" ? 1 : -1);
      } else if (mergedOpen.value && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        moveActiveValue(event.key === "ArrowDown" ? 1 : -1);
      } else if (event.key === "Enter" && mergedOpen.value) {
        event.preventDefault();
        confirmValue();
      }
    };
    useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: () => requestOpen(false)
    });
    watch(mergedValue, syncDraft);
    watch(mergedOpen, (open) => {
      if (open)
        void nextTick(scrollSelectedOptionsIntoView);
    }, { immediate: true });
    watch(() => props.defaultOpen, (open) => {
      if (!isOpenControlled.value)
        internalOpen.value = open;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-time-picker", rootClass.value])
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-time-picker__selector"
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            class: "aheart-time-picker__input",
            id: _ctx.id,
            value: displayValue.value,
            placeholder: resolvedPlaceholder.value,
            disabled: isDisabled.value,
            readonly: _ctx.readOnly,
            role: "combobox",
            "aria-labelledby": resolvedAriaLabelledby.value,
            "aria-controls": panelId,
            "aria-expanded": mergedOpen.value ? "true" : "false",
            "aria-haspopup": "dialog",
            "aria-activedescendant": mergedOpen.value ? activeDescendantId.value : void 0,
            onFocus: _cache[0] || (_cache[0] = ($event) => requestOpen(true)),
            onChange: handleInputChange,
            onKeydown: handleKeydown
          }, null, 40, _hoisted_2),
          _ctx.allowClear && displayValue.value && !isDisabled.value && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "aheart-time-picker__clear",
            type: "button",
            "aria-label": resolvedLocale.value.clear,
            onClick: clearValue
          }, [
            renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              _ctx.clearIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.clearIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "close",
                size: 14
              }))
            ])
          ], 8, _hoisted_3)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_4, [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              _ctx.suffixIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.suffixIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "clock",
                size: 16
              }))
            ])
          ])
        ], 512),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            id: panelId,
            class: normalizeClass(["aheart-time-picker__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": resolvedLocale.value.selectTime,
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMousedown: _cache[4] || (_cache[4] = withModifiers(() => {
            }, ["prevent"]))
          }, [
            createElementVNode("div", _hoisted_6, [
              createElementVNode("div", {
                ref_key: "hourColumnRef",
                ref: hourColumnRef,
                "data-time-column": "hour",
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "hour" }]),
                role: "listbox",
                "aria-label": resolvedLocale.value.hour,
                onScroll: _cache[1] || (_cache[1] = ($event) => handleColumnScroll("hour", $event))
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(visibleHourOptions.value, (hour) => {
                  return openBlock(), createElementBlock("button", {
                    key: hour,
                    type: "button",
                    id: getTimeOptionId("hour", hour),
                    "data-hour": hour,
                    disabled: isInteractionDisabled.value || isHourDisabled(hour),
                    tabindex: "-1",
                    class: normalizeClass({ "is-selected": displayedHour.value === hour }),
                    role: "option",
                    "aria-selected": displayedHour.value === hour ? "true" : "false",
                    onClick: ($event) => selectHour(hour)
                  }, toDisplayString(pad(hour)), 11, _hoisted_8);
                }), 128))
              ], 42, _hoisted_7),
              createElementVNode("div", {
                ref_key: "minuteColumnRef",
                ref: minuteColumnRef,
                "data-time-column": "minute",
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "minute" }]),
                role: "listbox",
                "aria-label": resolvedLocale.value.minute,
                onScroll: _cache[2] || (_cache[2] = ($event) => handleColumnScroll("minute", $event))
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(visibleMinuteOptions.value, (minute) => {
                  return openBlock(), createElementBlock("button", {
                    key: minute,
                    type: "button",
                    id: getTimeOptionId("minute", minute),
                    "data-minute": minute,
                    disabled: isInteractionDisabled.value || isMinuteDisabled(minute),
                    tabindex: "-1",
                    class: normalizeClass({ "is-selected": draft.value.minute === minute }),
                    role: "option",
                    "aria-selected": draft.value.minute === minute ? "true" : "false",
                    onClick: ($event) => selectMinute(minute)
                  }, toDisplayString(pad(minute)), 11, _hoisted_10);
                }), 128))
              ], 42, _hoisted_9),
              showSeconds.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                ref_key: "secondColumnRef",
                ref: secondColumnRef,
                "data-time-column": "second",
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "second" }]),
                role: "listbox",
                "aria-label": resolvedLocale.value.second,
                onScroll: _cache[3] || (_cache[3] = ($event) => handleColumnScroll("second", $event))
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSecondOptions.value, (second) => {
                  return openBlock(), createElementBlock("button", {
                    key: second,
                    type: "button",
                    id: getTimeOptionId("second", second),
                    "data-second": second,
                    disabled: isInteractionDisabled.value || isSecondDisabled(second),
                    tabindex: "-1",
                    class: normalizeClass({ "is-selected": draft.value.second === second }),
                    role: "option",
                    "aria-selected": draft.value.second === second ? "true" : "false",
                    onClick: ($event) => selectSecond(second)
                  }, toDisplayString(pad(second)), 11, _hoisted_12);
                }), 128))
              ], 42, _hoisted_11)) : createCommentVNode("", true),
              showPeriod.value ? (openBlock(), createElementBlock("div", {
                key: 1,
                ref_key: "periodColumnRef",
                ref: periodColumnRef,
                "data-time-column": "period",
                class: normalizeClass(["aheart-time-picker__column aheart-time-picker__column--period", { "is-keyboard-active": activeColumn.value === "period" }]),
                role: "listbox",
                "aria-label": resolvedLocale.value.period
              }, [
                (openBlock(), createElementBlock(Fragment, null, renderList(["AM", "PM"], (period) => {
                  return createElementVNode("button", {
                    key: period,
                    type: "button",
                    id: getTimeOptionId("period", period),
                    "data-period": period,
                    disabled: isInteractionDisabled.value || isPeriodDisabled(period),
                    tabindex: "-1",
                    class: normalizeClass({ "is-selected": selectedPeriod.value === period }),
                    role: "option",
                    "aria-selected": selectedPeriod.value === period ? "true" : "false",
                    onClick: ($event) => selectPeriod(period)
                  }, toDisplayString(period === "AM" ? resolvedLocale.value.am : resolvedLocale.value.pm), 11, _hoisted_14);
                }), 64))
              ], 10, _hoisted_13)) : createCommentVNode("", true)
            ]),
            _ctx.showNow || _ctx.needConfirm || _ctx.renderExtraFooter || unref(slots).footer ? (openBlock(), createElementBlock("div", _hoisted_15, [
              _ctx.showNow ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "aheart-time-picker__now",
                type: "button",
                disabled: isInteractionDisabled.value,
                onClick: selectNow
              }, toDisplayString(resolvedLocale.value.now), 9, _hoisted_16)) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "footer", {}, () => [
                _ctx.renderExtraFooter ? (openBlock(), createBlock(unref(ARenderNode), {
                  key: 0,
                  node: _ctx.renderExtraFooter()
                }, null, 8, ["node"])) : createCommentVNode("", true)
              ]),
              _ctx.needConfirm ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "aheart-time-picker__confirm",
                type: "button",
                disabled: isInteractionDisabled.value,
                onClick: confirmValue
              }, toDisplayString(resolvedLocale.value.ok), 9, _hoisted_17)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ], 46, _hoisted_5)), [
            [vShow, unref(motion).phase.value !== "hidden"]
          ]) : createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
