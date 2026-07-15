"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const icon_vue_vue_type_script_setup_true_lang = require("../icon/icon.vue.js");
const calendar = require("../picker-core/calendar.js");
const codec = require("../picker-core/codec.js");
const dayjs = require("../picker-core/dayjs.js");
const selection = require("../picker-core/selection.js");
const useFloatingDismiss = require("../utils/use-floating-dismiss.js");
const useFloatingPosition = require("../utils/use-floating-position.js");
const useMotionPresence = require("../utils/use-motion-presence.js");
const usePropPresence = require("../utils/use-prop-presence.js");
const types = require("./types.js");
require("./style.css.js");
const context = require("../config/context.js");
const _hoisted_1 = {
  key: 0,
  class: "aheart-date-picker__prefix"
};
const _hoisted_2 = {
  key: 1,
  class: "aheart-date-picker__tags"
};
const _hoisted_3 = ["aria-label", "onClick"];
const _hoisted_4 = ["id", "inputmode", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_5 = ["aria-label"];
const _hoisted_6 = {
  class: "aheart-date-picker__suffix",
  "aria-hidden": "true"
};
const _hoisted_7 = ["aria-label", "aria-hidden"];
const _hoisted_8 = ["aria-label"];
const _hoisted_9 = ["data-preset-index", "onClick"];
const _hoisted_10 = { class: "aheart-date-picker__main" };
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = ["aria-label"];
const _hoisted_13 = ["aria-label"];
const _hoisted_14 = ["aria-label"];
const _hoisted_15 = {
  key: 0,
  class: "aheart-date-picker__weekdays",
  "aria-hidden": "true"
};
const _hoisted_16 = ["aria-label"];
const _hoisted_17 = ["id", "data-value", "disabled", "aria-selected", "onMouseenter", "onClick"];
const _hoisted_18 = ["aria-label"];
const _hoisted_19 = ["min", "max", "step", "value"];
const _hoisted_20 = { key: 0 };
const _hoisted_21 = ["value"];
const _hoisted_22 = { value: "AM" };
const _hoisted_23 = { value: "PM" };
const _hoisted_24 = ["step", "value"];
const _hoisted_25 = ["step", "value"];
const _hoisted_26 = { class: "aheart-date-picker__footer" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = {
  class: "aheart-date-picker__live",
  "aria-live": "polite"
};
const initialPanelFallback = "2000-01-01";
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADatePicker" },
  __name: "date-picker",
  props: types.datePickerProps,
  emits: types.datePickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const inputRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const internalValue = vue.ref(props.defaultValue);
    const internalOpen = vue.ref(props.defaultOpen);
    const draftValue = vue.ref();
    const inputText = vue.ref("");
    const activeCellKey = vue.ref("");
    const liveMessage = vue.ref("");
    const instanceId = vue.useId().replace(/:/g, "");
    const panelId = `aheart-date-picker-${instanceId}-panel`;
    const isValueControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const isPanelControlled = usePropPresence.usePropPresence("pickerValue", "picker-value");
    const ARenderNode = vue.defineComponent({
      name: "ADatePickerRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => {
          const node = renderProps.node;
          const isComponent = typeof node === "function" || typeof node === "object" && node !== null && !Array.isArray(node) && !vue.isVNode(node);
          return isComponent ? vue.h(vue.toRaw(node)) : node;
        };
      }
    });
    const mergedValue = vue.computed(() => isValueControlled.value ? props.modelValue : internalValue.value);
    const mergedOpen = vue.computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const selectedValues = vue.computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value ? [mergedValue.value] : []);
    const effectiveShowTime = vue.computed(() => Boolean(props.showTime) && !props.multiple && props.picker === "date");
    const showTimeOptions = vue.computed(() => typeof props.showTime === "object" ? props.showTime : {});
    const effectiveNeedConfirm = vue.computed(() => props.needConfirm ?? effectiveShowTime.value);
    const resolvedValueFormat = vue.computed(() => props.valueFormat ?? codec.defaultValueFormat(props.picker, effectiveShowTime.value));
    const resolvedFormats = vue.computed(() => codec.normalizeFormats(props.format ?? (effectiveShowTime.value && showTimeOptions.value.use12Hours ? "YYYY-MM-DD hh:mm:ss A" : resolvedValueFormat.value)));
    const displayFormat = vue.computed(() => resolvedFormats.value[0] ?? resolvedValueFormat.value);
    const resolvedLocale = vue.computed(() => {
      var _a2, _b;
      return {
        ...context.zhCN.datePicker,
        ...(_a2 = config.value.locale) == null ? void 0 : _a2.datePicker,
        ...(_b = props.locale) == null ? void 0 : _b.datePicker
      };
    });
    const cancelText = vue.computed(() => resolvedLocale.value.locale === "en-US" ? "Cancel" : "取消");
    const resolvedPlaceholder = vue.computed(() => props.placeholder ?? {
      date: effectiveShowTime.value ? resolvedLocale.value.selectTime : resolvedLocale.value.selectDate,
      week: resolvedLocale.value.selectWeek,
      month: resolvedLocale.value.selectMonth,
      quarter: resolvedLocale.value.selectQuarter,
      year: resolvedLocale.value.selectYear
    }[props.picker]);
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = vue.computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = vue.computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const hasValue = vue.computed(() => selectedValues.value.length > 0);
    const hasDraftValue = vue.computed(() => Array.isArray(draftValue.value) ? draftValue.value.length > 0 : Boolean(draftValue.value));
    const rootClass = vue.computed(() => [
      `aheart-date-picker--${resolvedSize.value}`,
      `aheart-date-picker--${resolvedVariant.value}`,
      props.status && `aheart-date-picker--${props.status}`,
      { "is-open": mergedOpen.value, "is-disabled": isDisabled.value, "is-multiple": props.multiple }
    ]);
    const parseDateValue = (value) => value ? codec.parsePickerValue(
      value,
      [resolvedValueFormat.value, "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD", "GGGG-[W]WW", "YYYY-MM", "YYYY-[Q]Q", "YYYY"],
      dayjs.pickerDayjsLocale(resolvedLocale.value.locale)
    ) : void 0;
    const initialPanelDate = (runtimeNow) => {
      const firstValue = Array.isArray(mergedValue.value) ? mergedValue.value[0] : mergedValue.value;
      return parseDateValue(props.pickerValue) ?? parseDateValue(props.defaultPickerValue) ?? parseDateValue(firstValue) ?? runtimeNow ?? dayjs.createPickerDate(initialPanelFallback);
    };
    const viewDate = vue.ref(initialPanelDate());
    const focusedDate = vue.ref(initialPanelDate());
    const nowDate = vue.ref();
    vue.onMounted(() => {
      nowDate.value = dayjs.createPickerDate();
      const firstValue = Array.isArray(mergedValue.value) ? mergedValue.value[0] : mergedValue.value;
      if (!props.pickerValue && !props.defaultPickerValue && !firstValue) {
        viewDate.value = nowDate.value;
        focusedDate.value = nowDate.value;
        activeCellKey.value = cellKeyForDate(nowDate.value);
      }
    });
    const runtimeProcess = globalThis.process;
    if (((_a = runtimeProcess == null ? void 0 : runtimeProcess.env) == null ? void 0 : _a.NODE_ENV) !== "production" && props.multiple && props.showTime) {
      console.warn("[Aheart UI DatePicker] `multiple` cannot be combined with `showTime`; time selection was disabled.");
    }
    const formatDisplayValue = (value) => {
      const parsed = parseDateValue(value);
      return codec.formatPickerValue(parsed == null ? void 0 : parsed.locale(dayjs.pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value;
    };
    const committedInputText = vue.computed(() => props.multiple ? "" : selectedValues.value[0] ? formatDisplayValue(selectedValues.value[0]) : "");
    vue.watch(committedInputText, (value) => {
      inputText.value = value;
    }, { immediate: true });
    const candidateValues = vue.computed(() => effectiveNeedConfirm.value ? Array.isArray(draftValue.value) ? draftValue.value : draftValue.value ? [draftValue.value] : [] : selectedValues.value);
    const minDateValue = vue.computed(() => codec.parsePickerValue(props.minDate, "YYYY-MM-DD"));
    const maxDateValue = vue.computed(() => codec.parsePickerValue(props.maxDate, "YYYY-MM-DD"));
    const isDateDisabled = (date) => calendar.isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a2;
        return Boolean((_a2 = props.disabledDate) == null ? void 0 : _a2.call(
          props,
          codec.formatPickerValue(current, "YYYY-MM-DD"),
          { type: props.picker }
        ));
      }
    });
    const modelValueForDate = (date) => codec.formatPickerValue(date, resolvedValueFormat.value);
    const cellValueForDate = (date) => codec.formatPickerValue(date, codec.defaultValueFormat(props.picker));
    const cellKeyForDate = (date) => codec.formatPickerValue(date, props.picker === "date" || props.picker === "week" ? "YYYY-MM-DD" : codec.defaultValueFormat(props.picker)) ?? "";
    const isCellSelected = (date) => effectiveShowTime.value ? candidateValues.value.some((value) => {
      var _a2;
      return (_a2 = parseDateValue(value)) == null ? void 0 : _a2.isSame(date, "day");
    }) : candidateValues.value.includes(modelValueForDate(date));
    const createPanelCell = (date, text, key, inView = true, today = false) => {
      const value = cellValueForDate(date);
      const disabled = isDateDisabled(date);
      const selected = isCellSelected(date);
      return {
        id: `${panelId}-${key.replace(/[^a-zA-Z0-9]/g, "")}`,
        key,
        value,
        text,
        date,
        inView,
        today,
        selected,
        disabled,
        renderInfo: { mode: props.picker, text, value, selected, disabled }
      };
    };
    const panelCells = vue.computed(() => {
      if (props.picker === "date" || props.picker === "week") {
        return calendar.createDateMatrix(viewDate.value, resolvedLocale.value.weekStartsOn, nowDate.value).map(
          (cell) => createPanelCell(cell.value, String(cell.value.date()), codec.formatPickerValue(cell.value, "YYYY-MM-DD"), cell.inView, cell.today)
        );
      }
      if (props.picker === "month") {
        return Array.from({ length: 12 }, (_, month) => {
          const date = viewDate.value.month(month).startOf("month");
          return createPanelCell(date, resolvedLocale.value.monthsShort[month], codec.formatPickerValue(date, "YYYY-MM"));
        });
      }
      if (props.picker === "quarter") {
        return Array.from({ length: 4 }, (_, quarter) => {
          const date = viewDate.value.month(quarter * 3).startOf("month");
          return createPanelCell(date, `Q${quarter + 1}`, codec.formatPickerValue(date, "YYYY-[Q]Q"));
        });
      }
      const decadeStart = Math.floor(viewDate.value.year() / 10) * 10 - 1;
      return Array.from({ length: 12 }, (_, index) => {
        const date = viewDate.value.year(decadeStart + index).startOf("year");
        return createPanelCell(date, String(date.year()), codec.formatPickerValue(date, "YYYY"), index > 0 && index < 11);
      });
    });
    const panelTitle = vue.computed(() => {
      if (props.picker === "date" || props.picker === "week") {
        const localized = viewDate.value.locale(dayjs.pickerDayjsLocale(resolvedLocale.value.locale));
        return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format("MMMM"));
      }
      if (props.picker === "year") {
        const start = Math.floor(viewDate.value.year() / 10) * 10;
        return `${start} - ${start + 9}`;
      }
      return String(viewDate.value.year());
    });
    const activeCell = vue.computed(() => panelCells.value.find((cell) => cell.key === activeCellKey.value) ?? panelCells.value.find((cell) => cell.inView && !cell.disabled));
    const activeCellId = vue.computed(() => {
      var _a2;
      return (_a2 = activeCell.value) == null ? void 0 : _a2.id;
    });
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = vue.computed(() => {
      if (!triggerRef.value)
        return false;
      if (props.getPopupContainer && triggerRef.value)
        return props.getPopupContainer(triggerRef.value);
      return typeof document === "undefined" ? false : document.body;
    });
    const shouldTeleport = vue.computed(() => popupContainer.value !== false);
    const teleportTo = vue.computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition.useFloatingPosition({
      reference: triggerRef,
      floating: panelRef,
      open: () => motion.isMounted.value && motion.phase.value !== "hidden",
      placement: () => props.placement,
      strategy: "fixed",
      offset: 4,
      autoAdjustOverflow: () => props.autoAdjustOverflow
    });
    const panelClass = vue.computed(() => {
      var _a2;
      return [
        `aheart-floating--${floatingPosition.placement.value}`,
        `is-${motion.phase.value}`,
        { "has-presets": (_a2 = props.presets) == null ? void 0 : _a2.length, "has-time": effectiveShowTime.value }
      ];
    });
    const panelStyle = vue.computed(() => floatingPosition.popupStyle.value);
    vue.watch(() => motion.phase.value, (phase) => {
      if (phase === "entered")
        void vue.nextTick(floatingPosition.update);
    });
    const syncDraft = () => {
      draftValue.value = Array.isArray(mergedValue.value) ? [...mergedValue.value] : mergedValue.value;
      const panel = initialPanelDate(nowDate.value);
      if (!isPanelControlled.value)
        viewDate.value = panel;
      focusedDate.value = panel;
      activeCellKey.value = cellKeyForDate(panel);
    };
    let restoreFocusOnClose = false;
    const requestOpen = (nextOpen, restoreFocus = false) => {
      if (nextOpen && (isDisabled.value || props.readOnly))
        return;
      if (!nextOpen)
        restoreFocusOnClose = restoreFocus;
      if (!isOpenControlled.value)
        internalOpen.value = nextOpen;
      emit("openChange", nextOpen);
    };
    let restoringFocus = false;
    const handleFocus = () => {
      if (restoringFocus)
        return;
      requestOpen(true);
    };
    vue.watch(mergedOpen, (open, wasOpen) => {
      if (open) {
        syncDraft();
        return;
      }
      if (wasOpen) {
        draftValue.value = void 0;
        const shouldRestoreFocus = restoreFocusOnClose;
        restoreFocusOnClose = false;
        if (shouldRestoreFocus) {
          void vue.nextTick(() => {
            var _a2;
            restoringFocus = true;
            (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
            queueMicrotask(() => {
              restoringFocus = false;
            });
          });
        }
      }
    }, { immediate: true });
    useFloatingDismiss.useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: (reason) => requestOpen(false, reason === "escape"),
      restoreFocus: false
    });
    const commitValue = (value, close = true) => {
      const normalized = Array.isArray(value) ? selection.normalizeMultipleValues(value) : value;
      if (!isValueControlled.value)
        internalValue.value = normalized;
      emit("update:modelValue", normalized);
      emit("change", normalized);
      if (isValueControlled.value) {
        void vue.nextTick(() => {
          inputText.value = committedInputText.value;
        });
      }
      liveMessage.value = Array.isArray(normalized) ? normalized.map(formatDisplayValue).join(", ") : normalized ? resolvedLocale.value.selected(normalized) : "";
      if (close) {
        requestOpen(false, true);
      }
    };
    const toggleMultipleValue = (value) => {
      const base = effectiveNeedConfirm.value ? Array.isArray(draftValue.value) ? draftValue.value : [] : selectedValues.value;
      const next = base.includes(value) ? base.filter((item) => item !== value) : [...base, value];
      if (effectiveNeedConfirm.value)
        draftValue.value = next;
      else
        commitValue(next, false);
    };
    const removeMultipleValue = (value) => {
      if (isDisabled.value || props.readOnly)
        return;
      commitValue(selectedValues.value.filter((item) => item !== value), false);
    };
    const currentDraftDate = () => {
      const value = Array.isArray(draftValue.value) ? draftValue.value[0] : draftValue.value;
      const base = parseDateValue(value) ?? parseDateValue(props.defaultPickerValue) ?? viewDate.value;
      const defaultTime = showTimeOptions.value.defaultValue ? codec.parsePickerValue(showTimeOptions.value.defaultValue, showTimeOptions.value.format ?? "HH:mm:ss") : void 0;
      return value || !defaultTime ? base : base.hour(defaultTime.hour()).minute(defaultTime.minute()).second(defaultTime.second());
    };
    const applyDraftTime = (date) => {
      const time = currentDraftDate();
      return date.hour(time.hour()).minute(time.minute()).second(time.second());
    };
    const selectCell = (cell) => {
      if (cell.disabled || isDisabled.value || props.readOnly)
        return;
      focusedDate.value = cell.date;
      const selectedDate = effectiveShowTime.value ? applyDraftTime(cell.date) : cell.date;
      const value = modelValueForDate(selectedDate);
      if (props.multiple) {
        toggleMultipleValue(value);
        return;
      }
      if (effectiveNeedConfirm.value) {
        draftValue.value = value;
        liveMessage.value = resolvedLocale.value.selected(value);
      } else
        commitValue(value);
    };
    const draftDate = vue.computed(() => currentDraftDate());
    const draftTime = vue.computed(() => ({ hour: draftDate.value.hour(), minute: draftDate.value.minute(), second: draftDate.value.second() }));
    const displayedDraftHour = vue.computed(() => showTimeOptions.value.use12Hours ? draftTime.value.hour % 12 || 12 : draftTime.value.hour);
    const draftPeriod = vue.computed(() => draftTime.value.hour >= 12 ? "PM" : "AM");
    const updateTimePart = (part, event) => {
      const maximum = part === "hour" ? showTimeOptions.value.use12Hours ? 12 : 23 : 59;
      const configuredStep = part === "hour" ? showTimeOptions.value.hourStep ?? 1 : part === "minute" ? showTimeOptions.value.minuteStep ?? 1 : showTimeOptions.value.secondStep ?? 1;
      const step = Number.isFinite(configuredStep) && configuredStep > 0 ? Math.max(1, Math.floor(configuredStep)) : 1;
      const rawValue = Math.max(0, Math.min(maximum, Number(event.target.value) || 0));
      let normalizedHour;
      let value;
      if (part === "hour" && showTimeOptions.value.use12Hours) {
        const rawHour = Math.max(1, rawValue);
        const hour24 = rawHour % 12 + (draftPeriod.value === "PM" ? 12 : 0);
        normalizedHour = Math.max(0, Math.min(23, hour24));
        value = normalizedHour % 12 || 12;
      } else {
        const maximumStepValue = Math.floor(maximum / step) * step;
        value = Math.max(0, Math.min(maximumStepValue, Math.round(rawValue / step) * step));
      }
      event.target.value = String(value);
      const next = part === "hour" ? draftDate.value.hour(normalizedHour ?? value) : part === "minute" ? draftDate.value.minute(value) : draftDate.value.second(value);
      draftValue.value = modelValueForDate(next);
    };
    const updateTimePeriod = (event) => {
      const period = event.target.value;
      const hour = draftTime.value.hour % 12 + (period === "PM" ? 12 : 0);
      draftValue.value = modelValueForDate(draftDate.value.hour(hour));
    };
    const confirmDraft = () => {
      if (!hasDraftValue.value)
        return;
      const value = Array.isArray(draftValue.value) ? [...draftValue.value] : draftValue.value;
      commitValue(value);
      emit("ok", value);
    };
    const cancelDraft = () => {
      requestOpen(false, true);
    };
    const selectToday = () => {
      const today = nowDate.value ?? dayjs.createPickerDate();
      const cell = createPanelCell(today, String(today.date()), codec.formatPickerValue(today, "YYYY-MM-DD"));
      selectCell(cell);
    };
    const selectPreset = (index) => {
      var _a2;
      const preset = (_a2 = props.presets) == null ? void 0 : _a2[index];
      if (!preset)
        return;
      const value = typeof preset.value === "function" ? preset.value() : preset.value;
      const values = Array.isArray(value) ? value : value ? [value] : [];
      const invalidValue = values.find((item) => {
        const parsed = parseDateValue(item);
        return !parsed || isDateDisabled(parsed);
      });
      if (invalidValue) {
        emit("invalid", invalidValue);
        return;
      }
      if (effectiveNeedConfirm.value)
        draftValue.value = Array.isArray(value) ? [...value] : value;
      else
        commitValue(value, props.multiple ? false : true);
    };
    const clearValue = () => {
      if (isDisabled.value || props.readOnly)
        return;
      const empty = props.multiple ? [] : void 0;
      commitValue(empty, false);
      emit("clear");
      requestOpen(false, true);
    };
    const moveView = (offset, yearJump = false) => {
      const unit = yearJump ? props.picker === "year" ? "year" : "year" : props.picker === "date" || props.picker === "week" ? "month" : "year";
      const amount = yearJump && props.picker === "year" ? offset * 10 : offset;
      const next = viewDate.value.add(amount, unit);
      if (!isPanelControlled.value)
        viewDate.value = next;
      emit("panelChange", codec.formatPickerValue(next, "YYYY-MM-DD"), props.picker);
    };
    const applyInputMask = (value) => {
      var _a2, _b;
      const tokenNames = ["YYYY", "GGGG", "MM", "DD", "HH", "hh", "mm", "ss", "WW", "Q", "A"];
      const parts = [];
      for (let index = 0; index < displayFormat.value.length; ) {
        if (displayFormat.value[index] === "[") {
          const end = displayFormat.value.indexOf("]", index + 1);
          if (end >= 0) {
            parts.push({ value: displayFormat.value.slice(index + 1, end), token: false });
            index = end + 1;
            continue;
          }
        }
        const token = tokenNames.find((name) => displayFormat.value.startsWith(name, index));
        if (token) {
          parts.push({ value: token, token: true });
          index += token.length;
        } else {
          parts.push({ value: displayFormat.value[index], token: false });
          index += 1;
        }
      }
      const allowedLiterals = new Set(parts.filter((part) => !part.token).flatMap((part) => [...part.value]));
      if (resolvedFormats.value.length > 1) {
        const requiredDigits = parts.reduce((total, part) => total + (part.token && part.value !== "A" ? part.value === "Q" ? 1 : part.value.length : 0), 0);
        if (/^\d+$/.test(value) && value.length < requiredDigits)
          return value;
        if (/\D/.test(value))
          return value;
      }
      const inputLiterals = value.replace(/[\dA-Za-z]/g, "");
      if ([...inputLiterals].some((literal) => !allowedLiterals.has(literal)))
        return value;
      const digits = value.replace(/\D/g, "");
      const period = (_b = (_a2 = value.match(/(?:AM|PM)/i)) == null ? void 0 : _a2[0]) == null ? void 0 : _b.toUpperCase();
      let digitIndex = 0;
      let output = "";
      for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index];
        const tokenLength = part.token && part.value !== "A" ? part.value === "Q" ? 1 : part.value.length : 0;
        if (tokenLength) {
          const segment = digits.slice(digitIndex, digitIndex + tokenLength);
          if (!segment)
            break;
          output += segment;
          digitIndex += segment.length;
          if (segment.length < tokenLength)
            break;
        } else if (part.token && part.value === "A") {
          if (period)
            output += period;
        } else if (digitIndex > 0 && (digitIndex < digits.length || index < parts.length - 1))
          output += part.value;
      }
      return output;
    };
    const handleInput = (event) => {
      const target = event.target;
      const masked = applyInputMask(target.value);
      target.value = masked;
      inputText.value = masked;
    };
    const restoreInput = async () => {
      inputText.value = "";
      await vue.nextTick();
      inputText.value = committedInputText.value;
    };
    const handleInputChange = async () => {
      const value = inputText.value.trim();
      if (!value)
        return clearValue();
      const parsed = codec.parsePickerValue(value, resolvedFormats.value, dayjs.pickerDayjsLocale(resolvedLocale.value.locale));
      if (!parsed || isDateDisabled(parsed)) {
        emit("invalid", value);
        await restoreInput();
        return;
      }
      const parsedValue = codec.formatPickerValue(parsed, resolvedValueFormat.value);
      if (effectiveNeedConfirm.value) {
        if (!mergedOpen.value) {
          requestOpen(true);
          await vue.nextTick();
          if (!mergedOpen.value) {
            await restoreInput();
            return;
          }
        }
        draftValue.value = parsedValue;
        liveMessage.value = resolvedLocale.value.selected(parsedValue);
        return;
      }
      commitValue(parsedValue);
    };
    const moveFocusedDate = (key) => {
      const dateOffsets = {
        ArrowLeft: [props.picker === "quarter" ? -3 : -1, props.picker === "date" || props.picker === "week" ? "day" : props.picker === "year" ? "year" : "month"],
        ArrowRight: [props.picker === "quarter" ? 3 : 1, props.picker === "date" || props.picker === "week" ? "day" : props.picker === "year" ? "year" : "month"],
        ArrowUp: [props.picker === "date" || props.picker === "week" ? -7 : props.picker === "year" || props.picker === "month" ? -3 : -6, props.picker === "date" || props.picker === "week" ? "day" : props.picker === "year" ? "year" : "month"],
        ArrowDown: [props.picker === "date" || props.picker === "week" ? 7 : props.picker === "year" || props.picker === "month" ? 3 : 6, props.picker === "date" || props.picker === "week" ? "day" : props.picker === "year" ? "year" : "month"]
      };
      const [offset, unit] = dateOffsets[key];
      const next = focusedDate.value.add(offset, unit);
      const panelIdentity = (date) => props.picker === "date" || props.picker === "week" ? date.format("YYYY-MM") : props.picker === "year" ? String(Math.floor(date.year() / 10)) : String(date.year());
      const changesPanel = panelIdentity(next) !== panelIdentity(viewDate.value);
      if (changesPanel && isPanelControlled.value) {
        emit("panelChange", codec.formatPickerValue(next, "YYYY-MM-DD"), props.picker);
        return;
      }
      focusedDate.value = next;
      if (changesPanel) {
        viewDate.value = next;
        emit("panelChange", codec.formatPickerValue(next, "YYYY-MM-DD"), props.picker);
      }
      activeCellKey.value = cellKeyForDate(next);
    };
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        if (!event.defaultPrevented) {
          event.preventDefault();
          requestOpen(false, true);
        }
        return;
      }
      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        if (!mergedOpen.value)
          requestOpen(true);
        if (!mergedOpen.value)
          return;
        moveFocusedDate(event.key);
        return;
      }
      if (event.key === "Enter" && mergedOpen.value) {
        event.preventDefault();
        if (inputText.value.trim() !== committedInputText.value) {
          void handleInputChange();
          return;
        }
        const cell = createPanelCell(focusedDate.value, String(focusedDate.value.date()), codec.formatPickerValue(focusedDate.value, "YYYY-MM-DD"));
        selectCell(cell);
      }
    };
    const handleSelectorMouseDown = (event) => {
      var _a2;
      if (event.target.closest("button"))
        return;
      const inputWasFocused = typeof document !== "undefined" && document.activeElement === inputRef.value;
      if (event.target !== inputRef.value)
        (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
      if (inputWasFocused && !mergedOpen.value)
        requestOpen(true);
    };
    vue.watch(() => props.pickerValue, (value) => {
      const next = parseDateValue(value);
      if (next)
        viewDate.value = next;
    });
    vue.watch(mergedValue, (value) => {
      if (!mergedOpen.value || !effectiveNeedConfirm.value)
        return;
      draftValue.value = Array.isArray(value) ? [...value] : value;
    }, { deep: true });
    const focus = () => {
      var _a2;
      return (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
    };
    const blur = () => {
      var _a2;
      return (_a2 = inputRef.value) == null ? void 0 : _a2.blur();
    };
    __expose({ focus, blur });
    return (_ctx, _cache) => {
      var _a2;
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-date-picker", rootClass.value])
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-date-picker__selector",
          onMousedown: handleSelectorMouseDown
        }, [
          hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true),
          _ctx.multiple && selectedValues.value.length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(selectedValues.value, (value) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: value,
                class: "aheart-date-picker__tag"
              }, [
                vue.renderSlot(_ctx.$slots, "tag", { value }, () => [
                  vue.createTextVNode(vue.toDisplayString(formatDisplayValue(value)), 1)
                ]),
                vue.createElementVNode("button", {
                  type: "button",
                  "aria-label": `${resolvedLocale.value.clear} ${value}`,
                  onClick: vue.withModifiers(($event) => removeMultipleValue(value), ["stop"])
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_3)
              ]);
            }), 128))
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("input", {
            ref_key: "inputRef",
            ref: inputRef,
            id: _ctx.id,
            class: "aheart-date-picker__input",
            type: "text",
            inputmode: showTimeOptions.value.use12Hours ? "text" : "numeric",
            autocomplete: "off",
            role: "combobox",
            "aria-haspopup": "dialog",
            "aria-labelledby": _ctx.labelledBy ?? _ctx.ariaLabelledby,
            "aria-describedby": _ctx.describedBy ?? _ctx.ariaDescribedby,
            "aria-invalid": _ctx.status === "error" ? "true" : void 0,
            "aria-controls": panelId,
            "aria-expanded": mergedOpen.value ? "true" : "false",
            "aria-activedescendant": mergedOpen.value ? activeCellId.value : void 0,
            value: inputText.value,
            placeholder: resolvedPlaceholder.value,
            disabled: isDisabled.value,
            readonly: _ctx.readOnly || _ctx.multiple,
            onFocus: handleFocus,
            onInput: handleInput,
            onChange: handleInputChange,
            onKeydown: handleKeydown
          }, null, 40, _hoisted_4),
          _ctx.allowClear && hasValue.value && !isDisabled.value && !_ctx.readOnly ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            class: "aheart-date-picker__clear",
            type: "button",
            "aria-label": resolvedLocale.value.clear,
            onClick: vue.withModifiers(clearValue, ["stop"])
          }, [
            vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
              name: "close",
              size: 14
            })
          ], 8, _hoisted_5)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_6, [
            vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
              _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 0,
                node: _ctx.suffixIcon
              }, null, 8, ["node"])) : (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 1,
                name: "calendar",
                size: 16
              }))
            ])
          ])
        ], 544),
        (vue.openBlock(), vue.createBlock(vue.Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          vue.unref(motion).isMounted.value ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            id: panelId,
            class: vue.normalizeClass(["aheart-date-picker__panel", panelClass.value]),
            style: vue.normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": resolvedPlaceholder.value,
            "aria-hidden": vue.unref(motion).phase.value === "hidden" ? "true" : void 0
          }, [
            ((_a2 = _ctx.presets) == null ? void 0 : _a2.length) ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "aheart-date-picker__presets",
              "aria-label": resolvedLocale.value.presets
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.presets, (preset, index) => {
                return vue.openBlock(), vue.createElementBlock("button", {
                  key: index,
                  type: "button",
                  "data-preset-index": index,
                  onClick: ($event) => selectPreset(index)
                }, [
                  vue.createVNode(vue.unref(ARenderNode), {
                    node: preset.label
                  }, null, 8, ["node"])
                ], 8, _hoisted_9);
              }), 128))
            ], 8, _hoisted_8)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_10, [
              vue.createElementVNode("header", {
                class: vue.normalizeClass(["aheart-date-picker__header", { "is-compact": _ctx.picker !== "date" && _ctx.picker !== "week" }])
              }, [
                vue.createElementVNode("button", {
                  type: "button",
                  "aria-label": _ctx.picker === "year" ? resolvedLocale.value.previousDecade : resolvedLocale.value.previousYear,
                  onClick: _cache[0] || (_cache[0] = ($event) => moveView(-1, true))
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "chevrons-left",
                    size: 16
                  })
                ], 8, _hoisted_11),
                _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  type: "button",
                  "aria-label": resolvedLocale.value.previousMonth,
                  onClick: _cache[1] || (_cache[1] = ($event) => moveView(-1))
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "chevron-left",
                    size: 16
                  })
                ], 8, _hoisted_12)) : vue.createCommentVNode("", true),
                vue.createElementVNode("strong", null, vue.toDisplayString(panelTitle.value), 1),
                _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 1,
                  type: "button",
                  "aria-label": resolvedLocale.value.nextMonth,
                  onClick: _cache[2] || (_cache[2] = ($event) => moveView(1))
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "chevron-right",
                    size: 16
                  })
                ], 8, _hoisted_13)) : vue.createCommentVNode("", true),
                vue.createElementVNode("button", {
                  type: "button",
                  "aria-label": _ctx.picker === "year" ? resolvedLocale.value.nextDecade : resolvedLocale.value.nextYear,
                  onClick: _cache[3] || (_cache[3] = ($event) => moveView(1, true))
                }, [
                  vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                    name: "chevrons-right",
                    size: 16
                  })
                ], 8, _hoisted_14)
              ], 2),
              _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(resolvedLocale.value.weekdaysShort, (day) => {
                  return vue.openBlock(), vue.createElementBlock("span", { key: day }, vue.toDisplayString(day), 1);
                }), 128))
              ])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["aheart-date-picker__grid", `aheart-date-picker__grid--${_ctx.picker}`]),
                role: "grid",
                "aria-label": panelTitle.value
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(panelCells.value, (cell) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    id: cell.id,
                    key: cell.key,
                    type: "button",
                    role: "gridcell",
                    tabindex: "-1",
                    "data-value": cell.value,
                    disabled: cell.disabled,
                    "aria-selected": cell.selected ? "true" : "false",
                    class: vue.normalizeClass({
                      "is-outside": !cell.inView,
                      "is-selected": cell.selected,
                      "is-today": cell.today,
                      "is-active": cell.key === activeCellKey.value
                    }),
                    onMouseenter: ($event) => activeCellKey.value = cell.key,
                    onClick: ($event) => selectCell(cell)
                  }, [
                    vue.renderSlot(_ctx.$slots, "cell", vue.mergeProps({ ref_for: true }, cell.renderInfo), () => [
                      _ctx.cellRender ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                        key: 0,
                        node: _ctx.cellRender(cell.renderInfo)
                      }, null, 8, ["node"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                        vue.createTextVNode(vue.toDisplayString(cell.text), 1)
                      ], 64))
                    ])
                  ], 42, _hoisted_17);
                }), 128))
              ], 10, _hoisted_16),
              effectiveShowTime.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: "aheart-date-picker__time",
                "aria-label": resolvedLocale.value.time
              }, [
                vue.createElementVNode("label", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(resolvedLocale.value.hour), 1),
                  vue.createElementVNode("input", {
                    "data-time-part": "hour",
                    type: "number",
                    min: showTimeOptions.value.use12Hours ? 1 : 0,
                    max: showTimeOptions.value.use12Hours ? 12 : 23,
                    step: showTimeOptions.value.hourStep ?? 1,
                    value: displayedDraftHour.value,
                    onInput: _cache[4] || (_cache[4] = ($event) => updateTimePart("hour", $event))
                  }, null, 40, _hoisted_19)
                ]),
                showTimeOptions.value.use12Hours ? (vue.openBlock(), vue.createElementBlock("label", _hoisted_20, [
                  vue.createElementVNode("span", null, vue.toDisplayString(resolvedLocale.value.period), 1),
                  vue.createElementVNode("select", {
                    "data-time-part": "period",
                    value: draftPeriod.value,
                    onChange: updateTimePeriod
                  }, [
                    vue.createElementVNode("option", _hoisted_22, vue.toDisplayString(resolvedLocale.value.am), 1),
                    vue.createElementVNode("option", _hoisted_23, vue.toDisplayString(resolvedLocale.value.pm), 1)
                  ], 40, _hoisted_21)
                ])) : vue.createCommentVNode("", true),
                _cache[7] || (_cache[7] = vue.createElementVNode("span", null, ":", -1)),
                vue.createElementVNode("label", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(resolvedLocale.value.minute), 1),
                  vue.createElementVNode("input", {
                    "data-time-part": "minute",
                    type: "number",
                    min: "0",
                    max: "59",
                    step: showTimeOptions.value.minuteStep ?? 1,
                    value: draftTime.value.minute,
                    onInput: _cache[5] || (_cache[5] = ($event) => updateTimePart("minute", $event))
                  }, null, 40, _hoisted_24)
                ]),
                _cache[8] || (_cache[8] = vue.createElementVNode("span", null, ":", -1)),
                vue.createElementVNode("label", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(resolvedLocale.value.second), 1),
                  vue.createElementVNode("input", {
                    "data-time-part": "second",
                    type: "number",
                    min: "0",
                    max: "59",
                    step: showTimeOptions.value.secondStep ?? 1,
                    value: draftTime.value.second,
                    onInput: _cache[6] || (_cache[6] = ($event) => updateTimePart("second", $event))
                  }, null, 40, _hoisted_25)
                ])
              ], 8, _hoisted_18)) : vue.createCommentVNode("", true),
              vue.createElementVNode("footer", _hoisted_26, [
                vue.createElementVNode("button", {
                  class: "aheart-date-picker__today",
                  type: "button",
                  onClick: selectToday
                }, vue.toDisplayString(resolvedLocale.value.today), 1),
                vue.renderSlot(_ctx.$slots, "footer"),
                effectiveNeedConfirm.value ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  class: "aheart-date-picker__cancel",
                  type: "button",
                  onClick: cancelDraft
                }, vue.toDisplayString(cancelText.value), 1)) : vue.createCommentVNode("", true),
                effectiveNeedConfirm.value ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 1,
                  class: "aheart-date-picker__ok",
                  type: "button",
                  disabled: !hasDraftValue.value,
                  onClick: confirmDraft
                }, vue.toDisplayString(resolvedLocale.value.ok), 9, _hoisted_27)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("span", _hoisted_28, vue.toDisplayString(liveMessage.value), 1)
            ])
          ], 14, _hoisted_7)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
