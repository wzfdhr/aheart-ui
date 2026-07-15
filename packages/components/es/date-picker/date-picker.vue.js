import { defineComponent, useSlots, ref, useId, isVNode, h, toRaw, computed, onMounted, watch, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, Fragment, renderList, createTextVNode, toDisplayString, withModifiers, createBlock, Teleport, withDirectives, normalizeStyle, mergeProps, vShow } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { createDateMatrix, isPickerDateDisabled } from "../picker-core/calendar.js";
import { defaultValueFormat, normalizeFormats, parsePickerValue, formatPickerValue } from "../picker-core/codec.js";
import { createPickerDate, pickerDayjsLocale } from "../picker-core/dayjs.js";
import { normalizeMultipleValues } from "../picker-core/selection.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { datePickerProps, datePickerEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, zhCN, resolveConfigValue } from "../config/context.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADatePicker" },
  __name: "date-picker",
  props: datePickerProps,
  emits: datePickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const inputRef = ref(null);
    const panelRef = ref(null);
    const internalValue = ref(props.defaultValue);
    const internalOpen = ref(props.defaultOpen);
    const draftValue = ref();
    const inputText = ref("");
    const activeCellKey = ref("");
    const liveMessage = ref("");
    const instanceId = useId().replace(/:/g, "");
    const panelId = `aheart-date-picker-${instanceId}-panel`;
    const isValueControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const isPanelControlled = usePropPresence("pickerValue", "picker-value");
    const ARenderNode = defineComponent({
      name: "ADatePickerRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => {
          const node = renderProps.node;
          const isComponent = typeof node === "function" || typeof node === "object" && node !== null && !Array.isArray(node) && !isVNode(node);
          return isComponent ? h(toRaw(node)) : node;
        };
      }
    });
    const mergedValue = computed(() => isValueControlled.value ? props.modelValue : internalValue.value);
    const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const selectedValues = computed(() => Array.isArray(mergedValue.value) ? mergedValue.value : mergedValue.value ? [mergedValue.value] : []);
    const effectiveShowTime = computed(() => Boolean(props.showTime) && !props.multiple && props.picker === "date");
    const showTimeOptions = computed(() => typeof props.showTime === "object" ? props.showTime : {});
    const effectiveNeedConfirm = computed(() => props.needConfirm ?? effectiveShowTime.value);
    const resolvedValueFormat = computed(() => props.valueFormat ?? defaultValueFormat(props.picker, effectiveShowTime.value));
    const resolvedFormats = computed(() => normalizeFormats(props.format ?? (effectiveShowTime.value && showTimeOptions.value.use12Hours ? "YYYY-MM-DD hh:mm:ss A" : resolvedValueFormat.value)));
    const displayFormat = computed(() => resolvedFormats.value[0] ?? resolvedValueFormat.value);
    const resolvedLocale = computed(() => {
      var _a2, _b;
      return {
        ...zhCN.datePicker,
        ...(_a2 = config.value.locale) == null ? void 0 : _a2.datePicker,
        ...(_b = props.locale) == null ? void 0 : _b.datePicker
      };
    });
    const cancelText = computed(() => resolvedLocale.value.locale === "en-US" ? "Cancel" : "取消");
    const resolvedPlaceholder = computed(() => props.placeholder ?? {
      date: effectiveShowTime.value ? resolvedLocale.value.selectTime : resolvedLocale.value.selectDate,
      week: resolvedLocale.value.selectWeek,
      month: resolvedLocale.value.selectMonth,
      quarter: resolvedLocale.value.selectQuarter,
      year: resolvedLocale.value.selectYear
    }[props.picker]);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const hasValue = computed(() => selectedValues.value.length > 0);
    const hasDraftValue = computed(() => Array.isArray(draftValue.value) ? draftValue.value.length > 0 : Boolean(draftValue.value));
    const rootClass = computed(() => [
      `aheart-date-picker--${resolvedSize.value}`,
      `aheart-date-picker--${resolvedVariant.value}`,
      props.status && `aheart-date-picker--${props.status}`,
      { "is-open": mergedOpen.value, "is-disabled": isDisabled.value, "is-multiple": props.multiple }
    ]);
    const parseDateValue = (value) => value ? parsePickerValue(
      value,
      [resolvedValueFormat.value, "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD", "GGGG-[W]WW", "YYYY-MM", "YYYY-[Q]Q", "YYYY"],
      pickerDayjsLocale(resolvedLocale.value.locale)
    ) : void 0;
    const initialPanelDate = (runtimeNow) => {
      const firstValue = Array.isArray(mergedValue.value) ? mergedValue.value[0] : mergedValue.value;
      return parseDateValue(props.pickerValue) ?? parseDateValue(props.defaultPickerValue) ?? parseDateValue(firstValue) ?? runtimeNow ?? createPickerDate(initialPanelFallback);
    };
    const viewDate = ref(initialPanelDate());
    const focusedDate = ref(initialPanelDate());
    const nowDate = ref();
    onMounted(() => {
      nowDate.value = createPickerDate();
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
      return formatPickerValue(parsed == null ? void 0 : parsed.locale(pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value;
    };
    const committedInputText = computed(() => props.multiple ? "" : selectedValues.value[0] ? formatDisplayValue(selectedValues.value[0]) : "");
    watch(committedInputText, (value) => {
      inputText.value = value;
    }, { immediate: true });
    const candidateValues = computed(() => effectiveNeedConfirm.value ? Array.isArray(draftValue.value) ? draftValue.value : draftValue.value ? [draftValue.value] : [] : selectedValues.value);
    const minDateValue = computed(() => parsePickerValue(props.minDate, "YYYY-MM-DD"));
    const maxDateValue = computed(() => parsePickerValue(props.maxDate, "YYYY-MM-DD"));
    const isDateDisabled = (date) => isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a2;
        return Boolean((_a2 = props.disabledDate) == null ? void 0 : _a2.call(
          props,
          formatPickerValue(current, "YYYY-MM-DD"),
          { type: props.picker }
        ));
      }
    });
    const modelValueForDate = (date) => formatPickerValue(date, resolvedValueFormat.value);
    const cellValueForDate = (date) => formatPickerValue(date, defaultValueFormat(props.picker));
    const cellKeyForDate = (date) => formatPickerValue(date, props.picker === "date" || props.picker === "week" ? "YYYY-MM-DD" : defaultValueFormat(props.picker)) ?? "";
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
    const panelCells = computed(() => {
      if (props.picker === "date" || props.picker === "week") {
        return createDateMatrix(viewDate.value, resolvedLocale.value.weekStartsOn, nowDate.value).map(
          (cell) => createPanelCell(cell.value, String(cell.value.date()), formatPickerValue(cell.value, "YYYY-MM-DD"), cell.inView, cell.today)
        );
      }
      if (props.picker === "month") {
        return Array.from({ length: 12 }, (_, month) => {
          const date = viewDate.value.month(month).startOf("month");
          return createPanelCell(date, resolvedLocale.value.monthsShort[month], formatPickerValue(date, "YYYY-MM"));
        });
      }
      if (props.picker === "quarter") {
        return Array.from({ length: 4 }, (_, quarter) => {
          const date = viewDate.value.month(quarter * 3).startOf("month");
          return createPanelCell(date, `Q${quarter + 1}`, formatPickerValue(date, "YYYY-[Q]Q"));
        });
      }
      const decadeStart = Math.floor(viewDate.value.year() / 10) * 10 - 1;
      return Array.from({ length: 12 }, (_, index) => {
        const date = viewDate.value.year(decadeStart + index).startOf("year");
        return createPanelCell(date, String(date.year()), formatPickerValue(date, "YYYY"), index > 0 && index < 11);
      });
    });
    const panelTitle = computed(() => {
      if (props.picker === "date" || props.picker === "week") {
        const localized = viewDate.value.locale(pickerDayjsLocale(resolvedLocale.value.locale));
        return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format("MMMM"));
      }
      if (props.picker === "year") {
        const start = Math.floor(viewDate.value.year() / 10) * 10;
        return `${start} - ${start + 9}`;
      }
      return String(viewDate.value.year());
    });
    const activeCell = computed(() => panelCells.value.find((cell) => cell.key === activeCellKey.value) ?? panelCells.value.find((cell) => cell.inView && !cell.disabled));
    const activeCellId = computed(() => {
      var _a2;
      return (_a2 = activeCell.value) == null ? void 0 : _a2.id;
    });
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => {
      if (!triggerRef.value)
        return false;
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
    const panelClass = computed(() => {
      var _a2;
      return [
        `aheart-floating--${floatingPosition.placement.value}`,
        `is-${motion.phase.value}`,
        { "has-presets": (_a2 = props.presets) == null ? void 0 : _a2.length, "has-time": effectiveShowTime.value }
      ];
    });
    const panelStyle = computed(() => floatingPosition.popupStyle.value);
    watch(() => motion.phase.value, (phase) => {
      if (phase === "entered")
        void nextTick(floatingPosition.update);
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
    watch(mergedOpen, (open, wasOpen) => {
      if (open) {
        syncDraft();
        return;
      }
      if (wasOpen) {
        draftValue.value = void 0;
        const shouldRestoreFocus = restoreFocusOnClose;
        restoreFocusOnClose = false;
        if (shouldRestoreFocus) {
          void nextTick(() => {
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
    useFloatingDismiss({
      open: mergedOpen,
      trigger: triggerRef,
      floating: panelRef,
      onDismiss: (reason) => requestOpen(false, reason === "escape"),
      restoreFocus: false
    });
    const commitValue = (value, close = true) => {
      const normalized = Array.isArray(value) ? normalizeMultipleValues(value) : value;
      if (!isValueControlled.value)
        internalValue.value = normalized;
      emit("update:modelValue", normalized);
      emit("change", normalized);
      if (isValueControlled.value) {
        void nextTick(() => {
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
      const defaultTime = showTimeOptions.value.defaultValue ? parsePickerValue(showTimeOptions.value.defaultValue, showTimeOptions.value.format ?? "HH:mm:ss") : void 0;
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
    const draftDate = computed(() => currentDraftDate());
    const draftTime = computed(() => ({ hour: draftDate.value.hour(), minute: draftDate.value.minute(), second: draftDate.value.second() }));
    const displayedDraftHour = computed(() => showTimeOptions.value.use12Hours ? draftTime.value.hour % 12 || 12 : draftTime.value.hour);
    const draftPeriod = computed(() => draftTime.value.hour >= 12 ? "PM" : "AM");
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
      const today = nowDate.value ?? createPickerDate();
      const cell = createPanelCell(today, String(today.date()), formatPickerValue(today, "YYYY-MM-DD"));
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
      emit("panelChange", formatPickerValue(next, "YYYY-MM-DD"), props.picker);
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
      await nextTick();
      inputText.value = committedInputText.value;
    };
    const handleInputChange = async () => {
      const value = inputText.value.trim();
      if (!value)
        return clearValue();
      const parsed = parsePickerValue(value, resolvedFormats.value, pickerDayjsLocale(resolvedLocale.value.locale));
      if (!parsed || isDateDisabled(parsed)) {
        emit("invalid", value);
        await restoreInput();
        return;
      }
      const parsedValue = formatPickerValue(parsed, resolvedValueFormat.value);
      if (effectiveNeedConfirm.value) {
        if (!mergedOpen.value) {
          requestOpen(true);
          await nextTick();
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
        emit("panelChange", formatPickerValue(next, "YYYY-MM-DD"), props.picker);
        return;
      }
      focusedDate.value = next;
      if (changesPanel) {
        viewDate.value = next;
        emit("panelChange", formatPickerValue(next, "YYYY-MM-DD"), props.picker);
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
        const cell = createPanelCell(focusedDate.value, String(focusedDate.value.date()), formatPickerValue(focusedDate.value, "YYYY-MM-DD"));
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
    watch(() => props.pickerValue, (value) => {
      const next = parseDateValue(value);
      if (next)
        viewDate.value = next;
    });
    watch(mergedValue, (value) => {
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
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-date-picker", rootClass.value])
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-date-picker__selector",
          onMousedown: handleSelectorMouseDown
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true),
          _ctx.multiple && selectedValues.value.length ? (openBlock(), createElementBlock("span", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(selectedValues.value, (value) => {
              return openBlock(), createElementBlock("span", {
                key: value,
                class: "aheart-date-picker__tag"
              }, [
                renderSlot(_ctx.$slots, "tag", { value }, () => [
                  createTextVNode(toDisplayString(formatDisplayValue(value)), 1)
                ]),
                createElementVNode("button", {
                  type: "button",
                  "aria-label": `${resolvedLocale.value.clear} ${value}`,
                  onClick: withModifiers(($event) => removeMultipleValue(value), ["stop"])
                }, [
                  createVNode(_sfc_main$1, {
                    name: "close",
                    size: 12
                  })
                ], 8, _hoisted_3)
              ]);
            }), 128))
          ])) : createCommentVNode("", true),
          createElementVNode("input", {
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
          _ctx.allowClear && hasValue.value && !isDisabled.value && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
            key: 2,
            class: "aheart-date-picker__clear",
            type: "button",
            "aria-label": resolvedLocale.value.clear,
            onClick: withModifiers(clearValue, ["stop"])
          }, [
            createVNode(_sfc_main$1, {
              name: "close",
              size: 14
            })
          ], 8, _hoisted_5)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_6, [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              _ctx.suffixIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.suffixIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "calendar",
                size: 16
              }))
            ])
          ])
        ], 544),
        (openBlock(), createBlock(Teleport, {
          to: teleportTo.value,
          disabled: !shouldTeleport.value
        }, [
          unref(motion).isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
            key: 0,
            ref_key: "panelRef",
            ref: panelRef,
            id: panelId,
            class: normalizeClass(["aheart-date-picker__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": resolvedPlaceholder.value,
            "aria-hidden": unref(motion).phase.value === "hidden" ? "true" : void 0
          }, [
            ((_a2 = _ctx.presets) == null ? void 0 : _a2.length) ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "aheart-date-picker__presets",
              "aria-label": resolvedLocale.value.presets
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.presets, (preset, index) => {
                return openBlock(), createElementBlock("button", {
                  key: index,
                  type: "button",
                  "data-preset-index": index,
                  onClick: ($event) => selectPreset(index)
                }, [
                  createVNode(unref(ARenderNode), {
                    node: preset.label
                  }, null, 8, ["node"])
                ], 8, _hoisted_9);
              }), 128))
            ], 8, _hoisted_8)) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_10, [
              createElementVNode("header", {
                class: normalizeClass(["aheart-date-picker__header", { "is-compact": _ctx.picker !== "date" && _ctx.picker !== "week" }])
              }, [
                createElementVNode("button", {
                  type: "button",
                  "aria-label": _ctx.picker === "year" ? resolvedLocale.value.previousDecade : resolvedLocale.value.previousYear,
                  onClick: _cache[0] || (_cache[0] = ($event) => moveView(-1, true))
                }, [
                  createVNode(_sfc_main$1, {
                    name: "chevrons-left",
                    size: 16
                  })
                ], 8, _hoisted_11),
                _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  "aria-label": resolvedLocale.value.previousMonth,
                  onClick: _cache[1] || (_cache[1] = ($event) => moveView(-1))
                }, [
                  createVNode(_sfc_main$1, {
                    name: "chevron-left",
                    size: 16
                  })
                ], 8, _hoisted_12)) : createCommentVNode("", true),
                createElementVNode("strong", null, toDisplayString(panelTitle.value), 1),
                _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("button", {
                  key: 1,
                  type: "button",
                  "aria-label": resolvedLocale.value.nextMonth,
                  onClick: _cache[2] || (_cache[2] = ($event) => moveView(1))
                }, [
                  createVNode(_sfc_main$1, {
                    name: "chevron-right",
                    size: 16
                  })
                ], 8, _hoisted_13)) : createCommentVNode("", true),
                createElementVNode("button", {
                  type: "button",
                  "aria-label": _ctx.picker === "year" ? resolvedLocale.value.nextDecade : resolvedLocale.value.nextYear,
                  onClick: _cache[3] || (_cache[3] = ($event) => moveView(1, true))
                }, [
                  createVNode(_sfc_main$1, {
                    name: "chevrons-right",
                    size: 16
                  })
                ], 8, _hoisted_14)
              ], 2),
              _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("div", _hoisted_15, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(resolvedLocale.value.weekdaysShort, (day) => {
                  return openBlock(), createElementBlock("span", { key: day }, toDisplayString(day), 1);
                }), 128))
              ])) : createCommentVNode("", true),
              createElementVNode("div", {
                class: normalizeClass(["aheart-date-picker__grid", `aheart-date-picker__grid--${_ctx.picker}`]),
                role: "grid",
                "aria-label": panelTitle.value
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(panelCells.value, (cell) => {
                  return openBlock(), createElementBlock("button", {
                    id: cell.id,
                    key: cell.key,
                    type: "button",
                    role: "gridcell",
                    tabindex: "-1",
                    "data-value": cell.value,
                    disabled: cell.disabled,
                    "aria-selected": cell.selected ? "true" : "false",
                    class: normalizeClass({
                      "is-outside": !cell.inView,
                      "is-selected": cell.selected,
                      "is-today": cell.today,
                      "is-active": cell.key === activeCellKey.value
                    }),
                    onMouseenter: ($event) => activeCellKey.value = cell.key,
                    onClick: ($event) => selectCell(cell)
                  }, [
                    renderSlot(_ctx.$slots, "cell", mergeProps({ ref_for: true }, cell.renderInfo), () => [
                      _ctx.cellRender ? (openBlock(), createBlock(unref(ARenderNode), {
                        key: 0,
                        node: _ctx.cellRender(cell.renderInfo)
                      }, null, 8, ["node"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createTextVNode(toDisplayString(cell.text), 1)
                      ], 64))
                    ])
                  ], 42, _hoisted_17);
                }), 128))
              ], 10, _hoisted_16),
              effectiveShowTime.value ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: "aheart-date-picker__time",
                "aria-label": resolvedLocale.value.time
              }, [
                createElementVNode("label", null, [
                  createElementVNode("span", null, toDisplayString(resolvedLocale.value.hour), 1),
                  createElementVNode("input", {
                    "data-time-part": "hour",
                    type: "number",
                    min: showTimeOptions.value.use12Hours ? 1 : 0,
                    max: showTimeOptions.value.use12Hours ? 12 : 23,
                    step: showTimeOptions.value.hourStep ?? 1,
                    value: displayedDraftHour.value,
                    onInput: _cache[4] || (_cache[4] = ($event) => updateTimePart("hour", $event))
                  }, null, 40, _hoisted_19)
                ]),
                showTimeOptions.value.use12Hours ? (openBlock(), createElementBlock("label", _hoisted_20, [
                  createElementVNode("span", null, toDisplayString(resolvedLocale.value.period), 1),
                  createElementVNode("select", {
                    "data-time-part": "period",
                    value: draftPeriod.value,
                    onChange: updateTimePeriod
                  }, [
                    createElementVNode("option", _hoisted_22, toDisplayString(resolvedLocale.value.am), 1),
                    createElementVNode("option", _hoisted_23, toDisplayString(resolvedLocale.value.pm), 1)
                  ], 40, _hoisted_21)
                ])) : createCommentVNode("", true),
                _cache[7] || (_cache[7] = createElementVNode("span", null, ":", -1)),
                createElementVNode("label", null, [
                  createElementVNode("span", null, toDisplayString(resolvedLocale.value.minute), 1),
                  createElementVNode("input", {
                    "data-time-part": "minute",
                    type: "number",
                    min: "0",
                    max: "59",
                    step: showTimeOptions.value.minuteStep ?? 1,
                    value: draftTime.value.minute,
                    onInput: _cache[5] || (_cache[5] = ($event) => updateTimePart("minute", $event))
                  }, null, 40, _hoisted_24)
                ]),
                _cache[8] || (_cache[8] = createElementVNode("span", null, ":", -1)),
                createElementVNode("label", null, [
                  createElementVNode("span", null, toDisplayString(resolvedLocale.value.second), 1),
                  createElementVNode("input", {
                    "data-time-part": "second",
                    type: "number",
                    min: "0",
                    max: "59",
                    step: showTimeOptions.value.secondStep ?? 1,
                    value: draftTime.value.second,
                    onInput: _cache[6] || (_cache[6] = ($event) => updateTimePart("second", $event))
                  }, null, 40, _hoisted_25)
                ])
              ], 8, _hoisted_18)) : createCommentVNode("", true),
              createElementVNode("footer", _hoisted_26, [
                createElementVNode("button", {
                  class: "aheart-date-picker__today",
                  type: "button",
                  onClick: selectToday
                }, toDisplayString(resolvedLocale.value.today), 1),
                renderSlot(_ctx.$slots, "footer"),
                effectiveNeedConfirm.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  class: "aheart-date-picker__cancel",
                  type: "button",
                  onClick: cancelDraft
                }, toDisplayString(cancelText.value), 1)) : createCommentVNode("", true),
                effectiveNeedConfirm.value ? (openBlock(), createElementBlock("button", {
                  key: 1,
                  class: "aheart-date-picker__ok",
                  type: "button",
                  disabled: !hasDraftValue.value,
                  onClick: confirmDraft
                }, toDisplayString(resolvedLocale.value.ok), 9, _hoisted_27)) : createCommentVNode("", true)
              ]),
              createElementVNode("span", _hoisted_28, toDisplayString(liveMessage.value), 1)
            ])
          ], 14, _hoisted_7)), [
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
