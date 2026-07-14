import { defineComponent, useAttrs, ref, useId, computed, watch, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, createCommentVNode, createBlock, Teleport, unref, withDirectives, normalizeStyle, withModifiers, Fragment, renderList, toDisplayString, vShow } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { timePickerProps, timePickerEmits } from "./types.js";
import "./style.css.js";
const _hoisted_1 = ["id", "value", "placeholder", "disabled", "readonly", "aria-labelledby", "aria-expanded", "aria-activedescendant"];
const _hoisted_2 = ["aria-hidden"];
const _hoisted_3 = { class: "aheart-time-picker__columns" };
const _hoisted_4 = ["id", "data-hour", "disabled", "aria-selected", "onClick"];
const _hoisted_5 = ["id", "data-minute", "disabled", "aria-selected", "onClick"];
const _hoisted_6 = ["id", "data-second", "disabled", "aria-selected", "onClick"];
const _hoisted_7 = ["id", "data-period", "disabled", "aria-selected", "onClick"];
const _hoisted_8 = {
  key: 0,
  class: "aheart-time-picker__footer"
};
const _hoisted_9 = ["disabled"];
const _hoisted_10 = ["disabled"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATimePicker" },
  __name: "time-picker",
  props: timePickerProps,
  emits: timePickerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const attrs = useAttrs();
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
    const mergedValue = computed(() => isValueControlled.value ? props.modelValue : internalValue.value);
    const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs["aria-labelledby"]);
    const showSeconds = computed(() => props.format.includes("ss"));
    const showPeriod = computed(() => props.use12Hours || props.format.includes("A"));
    const pad = (value) => String(value).padStart(2, "0");
    const parseTime = (value) => {
      var _a;
      if (!value)
        return void 0;
      const match = value.trim().match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s*(AM|PM))?$/i);
      if (!match)
        return void 0;
      let hour = Number(match[1]);
      const period = (_a = match[4]) == null ? void 0 : _a.toUpperCase();
      if (period && hour <= 12) {
        hour = hour % 12 + (period === "PM" ? 12 : 0);
      }
      if (hour > 23)
        return void 0;
      return { hour, minute: Number(match[2]), second: Number(match[3] ?? 0) };
    };
    const formatTime = (parts) => {
      const hour12 = parts.hour % 12 || 12;
      const period = parts.hour >= 12 ? "PM" : "AM";
      return props.format.replace("HH", pad(parts.hour)).replace("hh", pad(hour12)).replace("mm", pad(parts.minute)).replace("ss", pad(parts.second)).replace("A", period);
    };
    const initialParts = () => parseTime(mergedValue.value) ?? { hour: 0, minute: 0, second: 0 };
    const draft = ref(initialParts());
    const displayValue = computed(() => {
      const parts = parseTime(mergedValue.value);
      return parts ? formatTime(parts) : mergedValue.value ?? "";
    });
    const displayedHour = computed(() => showPeriod.value ? draft.value.hour % 12 || 12 : draft.value.hour);
    const selectedPeriod = computed(() => draft.value.hour >= 12 ? "PM" : "AM");
    const isInteractionDisabled = computed(() => props.disabled || props.readOnly);
    const normalizeStep = (step, limit) => Math.max(1, Math.min(limit, Math.floor(step) || 1));
    const createOptions = (limit, step, start = 0) => {
      const normalizedStep = normalizeStep(step, limit);
      const values = [];
      for (let value = start; value < limit + start; value += normalizedStep)
        values.push(value);
      return values;
    };
    const hourOptions = computed(() => showPeriod.value ? createOptions(12, props.hourStep, 1).filter((hour) => hour <= 12) : createOptions(24, props.hourStep));
    const minuteOptions = computed(() => createOptions(60, props.minuteStep));
    const secondOptions = computed(() => createOptions(60, props.secondStep));
    const visibleColumns = computed(() => [
      "hour",
      "minute",
      ...showSeconds.value ? ["second"] : [],
      ...showPeriod.value ? ["period"] : []
    ]);
    const getTimeOptionId = (column, value) => `aheart-time-${instanceId}-${column}-${String(value).toLowerCase()}`;
    const activeDescendantId = computed(() => {
      if (activeColumn.value === "hour")
        return getTimeOptionId("hour", displayedHour.value);
      if (activeColumn.value === "minute")
        return getTimeOptionId("minute", draft.value.minute);
      if (activeColumn.value === "second")
        return getTimeOptionId("second", draft.value.second);
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
    const isPartsDisabled = (parts) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return Boolean(
        ((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledHours) == null ? void 0 : _b.call(_a).includes(parts.hour)) || ((_d = (_c = disabledConfig.value) == null ? void 0 : _c.disabledMinutes) == null ? void 0 : _d.call(_c, parts.hour).includes(parts.minute)) || ((_f = (_e = disabledConfig.value) == null ? void 0 : _e.disabledSeconds) == null ? void 0 : _f.call(_e, parts.hour, parts.minute).includes(parts.second)) || ((_g = legacyDisabled.value) == null ? void 0 : _g.call(legacyDisabled, formatTime(parts)))
      );
    };
    const toHour24 = (hour) => showPeriod.value ? hour % 12 + (selectedPeriod.value === "PM" ? 12 : 0) : hour;
    const isHourDisabled = (hour) => {
      var _a, _b, _c;
      const hour24 = toHour24(hour);
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledHours) == null ? void 0 : _b.call(_a).includes(hour24)) || Boolean((_c = legacyDisabled.value) == null ? void 0 : _c.call(legacyDisabled, formatTime({ ...draft.value, hour: hour24 })));
    };
    const isMinuteDisabled = (minute) => {
      var _a, _b, _c;
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledMinutes) == null ? void 0 : _b.call(_a, draft.value.hour).includes(minute)) || Boolean((_c = legacyDisabled.value) == null ? void 0 : _c.call(legacyDisabled, formatTime({ ...draft.value, minute })));
    };
    const isSecondDisabled = (second) => {
      var _a, _b, _c;
      return Boolean((_b = (_a = disabledConfig.value) == null ? void 0 : _a.disabledSeconds) == null ? void 0 : _b.call(_a, draft.value.hour, draft.value.minute).includes(second)) || Boolean((_c = legacyDisabled.value) == null ? void 0 : _c.call(legacyDisabled, formatTime({ ...draft.value, second })));
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
    };
    const scrollSelectedOptionsIntoView = () => {
      var _a, _b;
      for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value]) {
        (_b = (_a = column == null ? void 0 : column.querySelector(".is-selected")) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { block: "center" });
      }
    };
    const requestOpen = (open) => {
      if (isInteractionDisabled.value)
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
      const value = formatTime(parts);
      if (!isValueControlled.value)
        internalValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      if (close)
        requestOpen(false);
      return true;
    };
    const selectHour = (hour) => {
      if (isInteractionDisabled.value || isHourDisabled(hour))
        return;
      draft.value = { ...draft.value, hour: toHour24(hour) };
    };
    const selectMinute = (minute) => {
      if (isInteractionDisabled.value || isMinuteDisabled(minute))
        return;
      draft.value = { ...draft.value, minute };
      if (!props.needConfirm && !showSeconds.value)
        commitValue(draft.value);
    };
    const selectSecond = (second) => {
      if (isInteractionDisabled.value || isSecondDisabled(second))
        return;
      draft.value = { ...draft.value, second };
      if (!props.needConfirm)
        commitValue(draft.value);
    };
    const selectPeriod = (period) => {
      if (isInteractionDisabled.value || isPeriodDisabled(period))
        return;
      const hour12 = draft.value.hour % 12;
      draft.value = { ...draft.value, hour: hour12 + (period === "PM" ? 12 : 0) };
    };
    const confirmValue = () => commitValue(draft.value);
    const selectNow = () => {
      if (isInteractionDisabled.value)
        return;
      const now = /* @__PURE__ */ new Date();
      draft.value = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
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
      if (!parts || !commitValue(parts))
        input.value = displayValue.value;
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
        moveToOption(hourOptions.value, displayedHour.value, direction, isHourDisabled, (hour) => {
          draft.value = { ...draft.value, hour: toHour24(hour) };
        });
      } else if (activeColumn.value === "minute") {
        moveToOption(minuteOptions.value, draft.value.minute, direction, isMinuteDisabled, (minute) => {
          draft.value = { ...draft.value, minute };
        });
      } else if (activeColumn.value === "second") {
        moveToOption(secondOptions.value, draft.value.second, direction, isSecondDisabled, (second) => {
          draft.value = { ...draft.value, second };
        });
      } else {
        moveToOption(["AM", "PM"], selectedPeriod.value, direction, isPeriodDisabled, (period) => {
          const hour12 = draft.value.hour % 12;
          const next = { ...draft.value, hour: hour12 + (period === "PM" ? 12 : 0) };
          if (!isPartsDisabled(next))
            draft.value = next;
        });
      }
      void nextTick(scrollSelectedOptionsIntoView);
    };
    const handleKeydown = (event) => {
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
      } else if (event.key === "Escape" && mergedOpen.value) {
        event.preventDefault();
        requestOpen(false);
        void nextTick(() => {
          var _a;
          return (_a = inputRef.value) == null ? void 0 : _a.focus();
        });
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
        class: normalizeClass(["aheart-time-picker", { "is-open": mergedOpen.value, "is-disabled": _ctx.disabled }])
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-time-picker__selector"
        }, [
          createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            class: "aheart-time-picker__input",
            id: _ctx.id,
            value: displayValue.value,
            placeholder: _ctx.placeholder,
            disabled: _ctx.disabled,
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
          }, null, 40, _hoisted_1),
          _ctx.allowClear && displayValue.value && !_ctx.disabled && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "aheart-time-picker__clear",
            type: "button",
            "aria-label": "Clear time",
            onClick: clearValue
          }, [
            createVNode(_sfc_main$1, {
              name: "close",
              size: 14
            })
          ])) : createCommentVNode("", true),
          createVNode(_sfc_main$1, {
            class: "aheart-time-picker__suffix",
            name: "clock",
            size: 16,
            "aria-hidden": "true"
          })
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
            "aria-label": "Choose time",
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0,
            onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
            }, ["prevent"]))
          }, [
            createElementVNode("div", _hoisted_3, [
              createElementVNode("div", {
                ref_key: "hourColumnRef",
                ref: hourColumnRef,
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "hour" }]),
                role: "listbox",
                "aria-label": "Hour"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(hourOptions.value, (hour) => {
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
                  }, toDisplayString(pad(hour)), 11, _hoisted_4);
                }), 128))
              ], 2),
              createElementVNode("div", {
                ref_key: "minuteColumnRef",
                ref: minuteColumnRef,
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "minute" }]),
                role: "listbox",
                "aria-label": "Minute"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(minuteOptions.value, (minute) => {
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
                  }, toDisplayString(pad(minute)), 11, _hoisted_5);
                }), 128))
              ], 2),
              showSeconds.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                ref_key: "secondColumnRef",
                ref: secondColumnRef,
                class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "second" }]),
                role: "listbox",
                "aria-label": "Second"
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(secondOptions.value, (second) => {
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
                  }, toDisplayString(pad(second)), 11, _hoisted_6);
                }), 128))
              ], 2)) : createCommentVNode("", true),
              showPeriod.value ? (openBlock(), createElementBlock("div", {
                key: 1,
                ref_key: "periodColumnRef",
                ref: periodColumnRef,
                class: normalizeClass(["aheart-time-picker__column aheart-time-picker__column--period", { "is-keyboard-active": activeColumn.value === "period" }]),
                role: "listbox",
                "aria-label": "Period"
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
                  }, toDisplayString(period), 11, _hoisted_7);
                }), 64))
              ], 2)) : createCommentVNode("", true)
            ]),
            _ctx.showNow || _ctx.needConfirm ? (openBlock(), createElementBlock("div", _hoisted_8, [
              _ctx.showNow ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "aheart-time-picker__now",
                type: "button",
                disabled: isInteractionDisabled.value,
                onClick: selectNow
              }, "此刻", 8, _hoisted_9)) : createCommentVNode("", true),
              _ctx.needConfirm ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "aheart-time-picker__confirm",
                type: "button",
                disabled: isInteractionDisabled.value,
                onClick: confirmValue
              }, "确定", 8, _hoisted_10)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ], 46, _hoisted_2)), [
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
