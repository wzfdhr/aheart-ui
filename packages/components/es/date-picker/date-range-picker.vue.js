import { defineComponent, useSlots, ref, useId, isVNode, h, toRaw, computed, watch, onMounted, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, withModifiers, createBlock, Teleport, withDirectives, normalizeStyle, Fragment, renderList, toDisplayString, mergeProps, createTextVNode, vShow } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { createDateMatrix, isPickerDateDisabled } from "../picker-core/calendar.js";
import { defaultValueFormat, normalizeFormats, parsePickerValue, formatPickerValue, comparePickerValues } from "../picker-core/codec.js";
import { createPickerDate, pickerDayjsLocale } from "../picker-core/dayjs.js";
import { normalizeRangeValue, advanceRangeSelection } from "../picker-core/selection.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { dateRangePickerProps, dateRangePickerEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, zhCN, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-date-range-picker__prefix"
};
const _hoisted_2 = ["id", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_3 = ["aria-label"];
const _hoisted_4 = { class: "aheart-date-range-picker__separator" };
const _hoisted_5 = ["id", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_6 = ["aria-label"];
const _hoisted_7 = ["aria-label"];
const _hoisted_8 = {
  class: "aheart-date-range-picker__suffix",
  "aria-hidden": "true"
};
const _hoisted_9 = ["aria-label"];
const _hoisted_10 = ["aria-label"];
const _hoisted_11 = ["data-preset-index", "onClick"];
const _hoisted_12 = { class: "aheart-date-range-picker__content" };
const _hoisted_13 = {
  class: "aheart-date-range-picker__mobile-parts",
  role: "tablist"
};
const _hoisted_14 = ["id", "tabindex", "aria-selected", "aria-controls"];
const _hoisted_15 = ["id", "tabindex", "aria-selected", "aria-controls"];
const _hoisted_16 = ["id", "aria-labelledby"];
const _hoisted_17 = { class: "aheart-date-range-picker__header" };
const _hoisted_18 = ["aria-label", "onClick"];
const _hoisted_19 = ["aria-label", "onClick"];
const _hoisted_20 = ["aria-label", "onClick"];
const _hoisted_21 = ["aria-label", "onClick"];
const _hoisted_22 = {
  key: 0,
  class: "aheart-date-range-picker__weekdays",
  "aria-hidden": "true"
};
const _hoisted_23 = ["aria-label"];
const _hoisted_24 = ["id", "data-value", "disabled", "aria-selected", "onMouseenter", "onClick"];
const _hoisted_25 = ["aria-label"];
const _hoisted_26 = ["disabled"];
const _hoisted_27 = ["data-time-part", "min", "max", "step", "value", "onInput"];
const _hoisted_28 = ["data-time-part", "value", "onChange"];
const _hoisted_29 = { value: "AM" };
const _hoisted_30 = { value: "PM" };
const _hoisted_31 = ["data-time-part", "step", "value", "onInput"];
const _hoisted_32 = ["data-time-part", "step", "value", "onInput"];
const _hoisted_33 = { class: "aheart-date-range-picker__footer" };
const _hoisted_34 = ["disabled"];
const _hoisted_35 = {
  class: "aheart-date-range-picker__live",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ADateRangePicker" },
  __name: "date-range-picker",
  props: dateRangePickerProps,
  emits: dateRangePickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const startInputRef = ref(null);
    const endInputRef = ref(null);
    const internalValue = ref(props.defaultValue ? [...props.defaultValue] : void 0);
    const internalOpen = ref(props.defaultOpen);
    const draftValue = ref();
    const activePart = ref("start");
    const activeKeyboardDate = ref();
    const activePanelIndex = ref(0);
    const hoverValue = ref();
    const liveMessage = ref("");
    const inputTexts = ref(["", ""]);
    const nowDate = ref();
    const rangeParts = ["start", "end"];
    const panelId = `aheart-date-range-picker-${useId().replace(/:/g, "")}-panel`;
    const isValueControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const isPanelControlled = usePropPresence("pickerValue", "picker-value");
    const ARenderNode = defineComponent({
      name: "ADateRangePickerRenderNode",
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
    const effectiveShowTime = computed(() => Boolean(props.showTime) && props.picker === "date");
    const showTimeOptions = computed(() => typeof props.showTime === "object" ? props.showTime : {});
    const effectiveNeedConfirm = computed(() => props.needConfirm ?? effectiveShowTime.value);
    const resolvedValueFormat = computed(() => props.valueFormat ?? defaultValueFormat(props.picker, effectiveShowTime.value));
    const displayFormats = computed(() => normalizeFormats(props.format ?? resolvedValueFormat.value));
    const displayFormat = computed(() => displayFormats.value[0] ?? resolvedValueFormat.value);
    const resolvedLocale = computed(() => {
      var _a, _b;
      return { ...zhCN.datePicker, ...(_a = config.value.locale) == null ? void 0 : _a.datePicker, ...(_b = props.locale) == null ? void 0 : _b.datePicker };
    });
    const resolvedPlaceholders = computed(() => props.placeholder ?? [resolvedLocale.value.startDate, resolvedLocale.value.endDate]);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const hasValue = computed(() => {
      var _a, _b;
      return Boolean(((_a = mergedValue.value) == null ? void 0 : _a[0]) || ((_b = mergedValue.value) == null ? void 0 : _b[1]));
    });
    const rangeComplete = computed(() => {
      var _a, _b, _c, _d;
      return Boolean(
        (((_a = draftValue.value) == null ? void 0 : _a[0]) || props.allowEmpty[0]) && (((_b = draftValue.value) == null ? void 0 : _b[1]) || props.allowEmpty[1]) && (((_c = draftValue.value) == null ? void 0 : _c[0]) || ((_d = draftValue.value) == null ? void 0 : _d[1]))
      );
    });
    const rootClass = computed(() => [
      `aheart-date-range-picker--${resolvedSize.value}`,
      `aheart-date-range-picker--${resolvedVariant.value}`,
      props.status && `aheart-date-range-picker--${props.status}`,
      { "is-open": mergedOpen.value, "is-disabled": isDisabled.value }
    ]);
    const parseValue = (value) => value ? parsePickerValue(value, [resolvedValueFormat.value, ...displayFormats.value, "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD", "GGGG-[W]WW", "YYYY-MM", "YYYY-[Q]Q", "YYYY"], pickerDayjsLocale(resolvedLocale.value.locale)) : void 0;
    const formatDisplay = (value) => {
      var _a;
      return value ? formatPickerValue((_a = parseValue(value)) == null ? void 0 : _a.locale(pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value : "";
    };
    const syncInputs = () => {
      var _a, _b;
      inputTexts.value = [formatDisplay((_a = mergedValue.value) == null ? void 0 : _a[0]), formatDisplay((_b = mergedValue.value) == null ? void 0 : _b[1])];
    };
    watch(mergedValue, syncInputs, { immediate: true, deep: true });
    const initialPanelValues = () => {
      var _a, _b;
      const explicit = props.pickerValue ?? props.defaultPickerValue;
      const start = parseValue(explicit == null ? void 0 : explicit[0]) ?? parseValue((_a = mergedValue.value) == null ? void 0 : _a[0]) ?? nowDate.value ?? createPickerDate("2000-01-01", "YYYY-MM-DD", true);
      const requestedEnd = parseValue(explicit == null ? void 0 : explicit[1]) ?? parseValue((_b = mergedValue.value) == null ? void 0 : _b[1]);
      if (props.picker === "year") {
        const startDecade = Math.floor(start.year() / 10);
        const end2 = requestedEnd && Math.floor(requestedEnd.year() / 10) > startDecade ? requestedEnd : start.add(10, "year");
        return [start, end2];
      }
      const panelUnit = props.picker === "date" || props.picker === "week" ? "month" : "year";
      const end = (requestedEnd == null ? void 0 : requestedEnd.isAfter(start, panelUnit)) ? requestedEnd : start.add(1, panelUnit);
      return [start, end];
    };
    const panelDates = ref(initialPanelValues());
    onMounted(() => {
      nowDate.value = createPickerDate();
      if (!props.defaultPickerValue && !props.pickerValue && !mergedValue.value)
        panelDates.value = initialPanelValues();
    });
    const minDateValue = computed(() => parsePickerValue(props.minDate, "YYYY-MM-DD"));
    const maxDateValue = computed(() => parsePickerValue(props.maxDate, "YYYY-MM-DD"));
    const cellValue = (date) => formatPickerValue(date, resolvedValueFormat.value);
    const canonicalCellValue = (date) => formatPickerValue(date, defaultValueFormat(props.picker, false));
    const isDisabledDate = (date) => isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a, _b;
        return Boolean((_b = props.disabledDate) == null ? void 0 : _b.call(props, formatPickerValue(current, "YYYY-MM-DD"), { from: (_a = draftValue.value) == null ? void 0 : _a[activePart.value === "start" ? 1 : 0], type: props.picker }));
      }
    });
    const comparisonValue = (value) => {
      const parsed = parseValue(value);
      return parsed ? formatPickerValue(parsed, defaultValueFormat(props.picker, false)) : value;
    };
    const isDateDisabledForPart = (date, part, range) => isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a;
        return Boolean((_a = props.disabledDate) == null ? void 0 : _a.call(props, formatPickerValue(current, "YYYY-MM-DD"), { from: range == null ? void 0 : range[part === "start" ? 1 : 0], type: props.picker }));
      }
    });
    const inPreviewRange = (value) => {
      var _a, _b;
      const start = (_a = draftValue.value) == null ? void 0 : _a[0];
      const end = (_b = draftValue.value) == null ? void 0 : _b[1];
      const previewEnd = activePart.value === "end" && start && !end ? hoverValue.value : void 0;
      const bounds = [start, end ?? previewEnd].filter(Boolean);
      if (bounds.length !== 2)
        return false;
      const current = comparisonValue(value);
      const left = comparisonValue(bounds[0]);
      const right = comparisonValue(bounds[1]);
      const low = comparePickerValues(left, right, defaultValueFormat(props.picker)) <= 0 ? left : right;
      const high = low === left ? right : left;
      return comparePickerValues(current, low, defaultValueFormat(props.picker)) > 0 && comparePickerValues(current, high, defaultValueFormat(props.picker)) < 0;
    };
    const createCell = (date, text, key, inView = true, today = false, panelIndex = 0) => {
      var _a, _b, _c;
      const value = canonicalCellValue(date);
      const start = (_a = draftValue.value) == null ? void 0 : _a[0];
      const end = (_b = draftValue.value) == null ? void 0 : _b[1];
      const isSameCandidate = (candidate) => Boolean(candidate && comparisonValue(candidate) === value);
      const disabled = isDisabledDate(date);
      const selected = isSameCandidate(start) || isSameCandidate(end);
      return {
        id: `${panelId}-${panelIndex}-${date.format("YYYYMMDD")}`,
        key,
        value,
        text,
        date,
        panelIndex,
        inView,
        today,
        disabled,
        active: panelIndex === activePanelIndex.value && Boolean((_c = activeKeyboardDate.value) == null ? void 0 : _c.isSame(date, "day")),
        selected,
        rangeStart: isSameCandidate(start),
        rangeEnd: isSameCandidate(end),
        inRange: inPreviewRange(value),
        renderInfo: { mode: props.picker, text, value, selected, disabled, range: activePart.value }
      };
    };
    const cellsForPanel = (view, panelIndex) => {
      if (props.picker === "date" || props.picker === "week") {
        return createDateMatrix(view, resolvedLocale.value.weekStartsOn, nowDate.value).map((item) => createCell(item.value, String(item.value.date()), formatPickerValue(item.value, "YYYY-MM-DD"), item.inView, item.today, panelIndex));
      }
      if (props.picker === "month")
        return Array.from({ length: 12 }, (_, month) => {
          const date = view.month(month).startOf("month");
          return createCell(date, resolvedLocale.value.monthsShort[month], formatPickerValue(date, "YYYY-MM"), true, false, panelIndex);
        });
      if (props.picker === "quarter")
        return Array.from({ length: 4 }, (_, quarter) => {
          const date = view.month(quarter * 3).startOf("quarter");
          return createCell(date, `Q${quarter + 1}`, formatPickerValue(date, "YYYY-[Q]Q"), true, false, panelIndex);
        });
      const decadeStart = Math.floor(view.year() / 10) * 10 - 1;
      return Array.from({ length: 12 }, (_, index) => {
        const date = view.year(decadeStart + index).startOf("year");
        return createCell(date, String(date.year()), formatPickerValue(date, "YYYY"), index > 0 && index < 11, false, panelIndex);
      });
    };
    const panelTitle = (view) => {
      if (props.picker === "date" || props.picker === "week") {
        const localized = view.locale(pickerDayjsLocale(resolvedLocale.value.locale));
        return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format("MMMM"));
      }
      if (props.picker === "year") {
        const start = Math.floor(view.year() / 10) * 10;
        return `${start} - ${start + 9}`;
      }
      return String(view.year());
    };
    const calendars = computed(() => panelDates.value.map((date, index) => ({ key: `${index}-${date.valueOf()}`, title: panelTitle(date), cells: cellsForPanel(date, index) })));
    const mobileCalendarIndex = ref(0);
    const panelIndexForDate = (date) => {
      const index = panelDates.value.findIndex((panelDate) => {
        if (props.picker === "year")
          return Math.floor(panelDate.year() / 10) === Math.floor(date.year() / 10);
        return date.isSame(panelDate, props.picker === "date" || props.picker === "week" ? "month" : "year");
      });
      return index;
    };
    const activeCellId = computed(() => {
      var _a;
      const cells = calendars.value.flatMap((calendar) => calendar.cells);
      return (_a = cells.find((cell) => cell.active && cell.inView) ?? cells.find((cell) => cell.active)) == null ? void 0 : _a.id;
    });
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => {
      if (!triggerRef.value)
        return false;
      if (props.getPopupContainer)
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
      var _a;
      return [`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`, { "has-presets": (_a = props.presets) == null ? void 0 : _a.length, "has-time": effectiveShowTime.value }];
    });
    const panelStyle = computed(() => floatingPosition.popupStyle.value);
    watch(() => motion.phase.value, (phase) => {
      if (phase === "entered")
        void nextTick(floatingPosition.update);
    });
    let restoringFocus = false;
    const requestOpen = (open, restoreFocus = false) => {
      if (open && (isDisabled.value || props.readOnly))
        return;
      if (!isOpenControlled.value)
        internalOpen.value = open;
      emit("openChange", open);
      if (!open && restoreFocus)
        void nextTick(() => {
          var _a;
          restoringFocus = true;
          (_a = activePart.value === "start" ? startInputRef.value : endInputRef.value) == null ? void 0 : _a.focus();
          queueMicrotask(() => {
            restoringFocus = false;
          });
        });
    };
    const syncDraft = () => {
      var _a;
      draftValue.value = mergedValue.value ? [...mergedValue.value] : void 0;
      hoverValue.value = void 0;
      if (!isPanelControlled.value)
        panelDates.value = initialPanelValues();
      activeKeyboardDate.value = parseValue((_a = draftValue.value) == null ? void 0 : _a[activePart.value === "start" ? 0 : 1]) ?? panelDates.value[0];
      activePanelIndex.value = Math.max(0, panelIndexForDate(activeKeyboardDate.value));
      mobileCalendarIndex.value = activePanelIndex.value;
    };
    watch(mergedOpen, (open) => {
      if (open)
        syncDraft();
    }, { immediate: true });
    watch(mergedValue, () => {
      if (mergedOpen.value)
        syncDraft();
    }, { deep: true });
    watch(() => props.pickerValue, () => {
      if (props.pickerValue)
        panelDates.value = initialPanelValues();
    }, { deep: true });
    useFloatingDismiss({ open: mergedOpen, trigger: triggerRef, floating: panelRef, onDismiss: (reason) => requestOpen(false, reason === "escape"), restoreFocus: false });
    const activatePart = (part) => {
      var _a;
      activePart.value = part;
      const date = parseValue((_a = draftValue.value) == null ? void 0 : _a[part === "start" ? 0 : 1]);
      if (date) {
        activeKeyboardDate.value = date;
        activePanelIndex.value = Math.max(0, panelIndexForDate(date));
        mobileCalendarIndex.value = activePanelIndex.value;
      }
      if (restoringFocus)
        return;
      requestOpen(true);
    };
    const handleSelectorMouseDown = (event) => {
      var _a;
      const target = event.target;
      if (target.closest("button"))
        return;
      const part = (_a = target.closest("[data-range-part]")) == null ? void 0 : _a.dataset.rangePart;
      if (part)
        activePart.value = part;
      requestOpen(true);
    };
    const activateMobilePart = (part) => {
      var _a;
      activePart.value = part;
      const value = parseValue((_a = draftValue.value) == null ? void 0 : _a[part === "start" ? 0 : 1]);
      activeKeyboardDate.value = value ?? panelDates.value[0];
      if (value && !isPanelControlled.value) {
        panelDates.value = [value, panelDates.value[1]];
      }
      activePanelIndex.value = 0;
      mobileCalendarIndex.value = 0;
    };
    const handlePartTabKeydown = (part, event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const nextPart = event.key === "Home" ? "start" : event.key === "End" ? "end" : part === "start" ? "end" : "start";
      activateMobilePart(nextPart);
      void nextTick(() => {
        var _a, _b;
        return (_b = (_a = panelRef.value) == null ? void 0 : _a.querySelector(`[data-mobile-part="${nextPart}"]`)) == null ? void 0 : _b.focus();
      });
    };
    const keyboardStep = (key) => {
      if (props.picker === "date")
        return (date) => date.add(key === "ArrowUp" ? -7 : key === "ArrowDown" ? 7 : key === "ArrowLeft" ? -1 : 1, "day");
      if (props.picker === "week")
        return (date) => date.add(key === "ArrowUp" || key === "ArrowLeft" ? -1 : 1, "week");
      if (props.picker === "month")
        return (date) => date.add(key === "ArrowUp" ? -3 : key === "ArrowDown" ? 3 : key === "ArrowLeft" ? -1 : 1, "month");
      if (props.picker === "quarter")
        return (date) => date.add((key === "ArrowUp" || key === "ArrowLeft" ? -1 : 1) * 3, "month");
      return (date) => date.add(key === "ArrowUp" ? -3 : key === "ArrowDown" ? 3 : key === "ArrowLeft" ? -1 : 1, "year");
    };
    const syncPanelToKeyboardDate = (date) => {
      const matchingPanel = panelIndexForDate(date);
      if (matchingPanel >= 0) {
        activePanelIndex.value = matchingPanel;
        mobileCalendarIndex.value = matchingPanel;
        return;
      }
      const next = [date, props.picker === "year" ? date.add(10, "year") : date.add(1, props.picker === "date" || props.picker === "week" ? "month" : "year")];
      activePanelIndex.value = 0;
      mobileCalendarIndex.value = 0;
      if (!isPanelControlled.value)
        panelDates.value = next;
      emit("panelChange", next.map((item) => formatPickerValue(item, resolvedValueFormat.value)), props.picker);
    };
    const handleInputKeydown = (event) => {
      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        requestOpen(true);
        const current = activeKeyboardDate.value ?? panelDates.value[0];
        activeKeyboardDate.value = keyboardStep(event.key)(current);
        syncPanelToKeyboardDate(activeKeyboardDate.value);
      }
      if (event.key === "Enter" && mergedOpen.value && activeKeyboardDate.value) {
        event.preventDefault();
        selectCell(createCell(activeKeyboardDate.value, String(activeKeyboardDate.value.date()), canonicalCellValue(activeKeyboardDate.value), true, false, activePanelIndex.value));
      }
      if (event.key === "Escape") {
        event.preventDefault();
        requestOpen(false, true);
      }
    };
    const updateInputText = (part, event) => {
      const index = part === "start" ? 0 : 1;
      inputTexts.value[index] = event.target.value;
    };
    const commitInput = (part) => {
      var _a, _b, _c, _d;
      const index = part === "start" ? 0 : 1;
      const input = inputTexts.value[index];
      if (!input && props.allowEmpty[index]) {
        commitValue([(_a = mergedValue.value) == null ? void 0 : _a[0], (_b = mergedValue.value) == null ? void 0 : _b[1]].map((value, valueIndex) => valueIndex === index ? void 0 : value), false);
        return;
      }
      const parsed = parsePickerValue(input, displayFormats.value, pickerDayjsLocale(resolvedLocale.value.locale));
      if (!parsed) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      const next = [(_c = mergedValue.value) == null ? void 0 : _c[0], (_d = mergedValue.value) == null ? void 0 : _d[1]];
      next[index] = formatPickerValue(parsed, resolvedValueFormat.value);
      if (isDateDisabledForPart(parsed, part, next)) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      const normalized = normalizeRangeValue(next, resolvedValueFormat.value, props.order, props.allowEmpty);
      if (!normalized) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      commitValue(normalized, false);
    };
    const commitValue = (value, close = true) => {
      const normalized = normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty) ?? value;
      if (!isValueControlled.value)
        internalValue.value = normalized ? [...normalized] : void 0;
      emit("update:modelValue", normalized);
      emit("change", normalized);
      if (isValueControlled.value)
        void nextTick(syncInputs);
      if (close)
        requestOpen(false, true);
    };
    const clearPart = (part) => {
      var _a, _b;
      const index = part === "start" ? 0 : 1;
      const next = [(_a = mergedValue.value) == null ? void 0 : _a[0], (_b = mergedValue.value) == null ? void 0 : _b[1]];
      next[index] = void 0;
      commitValue(next, false);
      emit("clear");
    };
    const clearAll = () => {
      commitValue(void 0, false);
      emit("clear");
    };
    const defaultTime = () => {
      const value = showTimeOptions.value.defaultValue;
      return value ? parsePickerValue(value, showTimeOptions.value.format ?? "HH:mm:ss") : void 0;
    };
    const dateWithDefaultTime = (date) => {
      if (!effectiveShowTime.value)
        return date;
      const time = defaultTime();
      return time ? date.hour(time.hour()).minute(time.minute()).second(time.second()) : date.startOf("day");
    };
    const selectCell = (cell) => {
      if (cell.disabled || isDisabled.value || props.readOnly)
        return;
      activeKeyboardDate.value = cell.date;
      activePanelIndex.value = cell.panelIndex;
      const value = cellValue(dateWithDefaultTime(cell.date));
      const selectedPart = activePart.value;
      const result = advanceRangeSelection(draftValue.value, value, selectedPart, resolvedValueFormat.value, props.order, props.allowEmpty);
      draftValue.value = result.value;
      activePart.value = result.activePart;
      emit("calendarChange", [...result.value], { range: selectedPart });
      liveMessage.value = result.complete ? resolvedLocale.value.rangeComplete(result.value[0] ?? "", result.value[1] ?? "") : resolvedLocale.value.rangeStartSelected;
      if (result.complete && !effectiveNeedConfirm.value)
        commitValue(result.value);
    };
    const selectPreset = (index) => {
      var _a;
      const preset = (_a = props.presets) == null ? void 0 : _a[index];
      if (!preset)
        return;
      const value = typeof preset.value === "function" ? preset.value() : preset.value;
      for (const [index2, endpoint] of (value ?? []).entries()) {
        const part = index2 === 0 ? "start" : "end";
        if (endpoint && !parseValue(endpoint)) {
          emit("invalid", endpoint, part);
          return;
        }
      }
      const normalized = normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty);
      if (!normalized)
        return;
      for (const [index2, endpoint] of normalized.entries()) {
        const part = index2 === 0 ? "start" : "end";
        const date = parseValue(endpoint);
        if (endpoint && !date) {
          emit("invalid", endpoint, part);
          return;
        }
        if (endpoint && date && isDateDisabledForPart(date, part, normalized)) {
          emit("invalid", endpoint, part);
          return;
        }
      }
      draftValue.value = [...normalized];
      emit("calendarChange", [...normalized], { range: "end" });
      if (effectiveNeedConfirm.value)
        liveMessage.value = resolvedLocale.value.rangeComplete(normalized[0] ?? "", normalized[1] ?? "");
      else
        commitValue(normalized);
    };
    const selectToday = () => {
      const date = nowDate.value ?? createPickerDate();
      const panelIndex = Math.max(0, panelIndexForDate(date));
      selectCell(createCell(date, String(date.date()), formatPickerValue(date, "YYYY-MM-DD"), true, true, panelIndex));
    };
    const confirmDraft = () => {
      if (!rangeComplete.value)
        return;
      const normalized = normalizeRangeValue(draftValue.value, resolvedValueFormat.value, props.order, props.allowEmpty);
      if (!normalized)
        return;
      commitValue(normalized);
      emit("ok", normalized);
    };
    const timeParts = (part) => {
      var _a;
      const value = parseValue((_a = draftValue.value) == null ? void 0 : _a[part === "start" ? 0 : 1]) ?? createPickerDate().startOf("day");
      return { hour: value.hour(), minute: value.minute(), second: value.second() };
    };
    const displayTimeHour = (part) => showTimeOptions.value.use12Hours ? timeParts(part).hour % 12 || 12 : timeParts(part).hour;
    const timePeriod = (part) => timeParts(part).hour >= 12 ? "PM" : "AM";
    const updateTime = (part, unit, event) => {
      var _a, _b, _c;
      const index = part === "start" ? 0 : 1;
      const current = parseValue((_a = draftValue.value) == null ? void 0 : _a[index]);
      if (!current)
        return;
      const maximum = unit === "hour" ? showTimeOptions.value.use12Hours ? 12 : 23 : 59;
      const minimum = unit === "hour" && showTimeOptions.value.use12Hours ? 1 : 0;
      const raw = Math.max(minimum, Math.min(maximum, Number(event.target.value) || minimum));
      const step = Math.max(1, Math.floor(unit === "hour" ? showTimeOptions.value.hourStep ?? 1 : unit === "minute" ? showTimeOptions.value.minuteStep ?? 1 : showTimeOptions.value.secondStep ?? 1));
      const value = unit === "hour" && showTimeOptions.value.use12Hours ? raw : Math.min(Math.floor(maximum / step) * step, Math.round(raw / step) * step);
      event.target.value = String(value);
      const hour = showTimeOptions.value.use12Hours ? value % 12 + (timePeriod(part) === "PM" ? 12 : 0) : value;
      const next = unit === "hour" ? current.hour(hour) : unit === "minute" ? current.minute(value) : current.second(value);
      const range = [(_b = draftValue.value) == null ? void 0 : _b[0], (_c = draftValue.value) == null ? void 0 : _c[1]];
      range[index] = formatPickerValue(next, resolvedValueFormat.value);
      draftValue.value = range;
      emit("calendarChange", [...range], { range: part });
    };
    const updatePeriod = (part, event) => {
      var _a, _b, _c;
      const index = part === "start" ? 0 : 1;
      const current = parseValue((_a = draftValue.value) == null ? void 0 : _a[index]);
      if (!current)
        return;
      const period = event.target.value;
      const next = current.hour(current.hour() % 12 + (period === "PM" ? 12 : 0));
      const range = [(_b = draftValue.value) == null ? void 0 : _b[0], (_c = draftValue.value) == null ? void 0 : _c[1]];
      range[index] = formatPickerValue(next, resolvedValueFormat.value);
      draftValue.value = range;
      emit("calendarChange", [...range], { range: part });
    };
    const movePanel = (index, amount, year = false) => {
      const resolvedAmount = props.picker === "year" ? amount * 10 : amount;
      if (isPanelControlled.value) {
        const values = panelDates.value.map((date, panelIndex) => formatPickerValue(panelIndex === index ? date.add(resolvedAmount, year ? "year" : "month") : date, resolvedValueFormat.value));
        emit("panelChange", values, props.picker);
        return;
      }
      const next = [...panelDates.value];
      next[index] = next[index].add(resolvedAmount, year ? "year" : "month");
      panelDates.value = next;
      emit("panelChange", next.map((date) => formatPickerValue(date, resolvedValueFormat.value)), props.picker);
    };
    __expose({
      focus: (part = "start") => {
        var _a;
        return (_a = part === "start" ? startInputRef.value : endInputRef.value) == null ? void 0 : _a.focus();
      },
      blur: () => {
        var _a, _b;
        (_a = startInputRef.value) == null ? void 0 : _a.blur();
        (_b = endInputRef.value) == null ? void 0 : _b.blur();
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-date-range-picker", rootClass.value])
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-date-range-picker__selector",
          onMousedown: handleSelectorMouseDown
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-date-range-picker__field", { "is-active": activePart.value === "start" && mergedOpen.value }])
          }, [
            createElementVNode("input", {
              ref_key: "startInputRef",
              ref: startInputRef,
              id: _ctx.id ? `${_ctx.id}-start` : void 0,
              "data-range-part": "start",
              role: "combobox",
              "aria-haspopup": "dialog",
              "aria-labelledby": _ctx.labelledBy ?? _ctx.ariaLabelledby,
              "aria-describedby": _ctx.describedBy ?? _ctx.ariaDescribedby,
              "aria-invalid": _ctx.status === "error" ? "true" : void 0,
              "aria-controls": panelId,
              "aria-expanded": mergedOpen.value ? "true" : "false",
              "aria-activedescendant": mergedOpen.value ? activeCellId.value : void 0,
              value: inputTexts.value[0],
              placeholder: resolvedPlaceholders.value[0],
              disabled: isDisabled.value,
              readonly: _ctx.readOnly,
              onFocus: _cache[0] || (_cache[0] = ($event) => activatePart("start")),
              onInput: _cache[1] || (_cache[1] = ($event) => updateInputText("start", $event)),
              onChange: _cache[2] || (_cache[2] = ($event) => commitInput("start")),
              onKeydown: handleInputKeydown
            }, null, 40, _hoisted_2),
            _ctx.allowClear && ((_a = mergedValue.value) == null ? void 0 : _a[0]) && _ctx.allowEmpty[0] && !isDisabled.value && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
              key: 0,
              "data-range-clear": "start",
              type: "button",
              "aria-label": `${resolvedLocale.value.clear} ${resolvedPlaceholders.value[0]}`,
              onClick: _cache[3] || (_cache[3] = withModifiers(($event) => clearPart("start"), ["stop"]))
            }, [
              createVNode(_sfc_main$1, {
                name: "close",
                size: 12
              })
            ], 8, _hoisted_3)) : createCommentVNode("", true)
          ], 2),
          createElementVNode("span", _hoisted_4, [
            renderSlot(_ctx.$slots, "separator", {}, () => [
              _ctx.separator ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.separator
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "arrow-right",
                size: 14
              }))
            ])
          ]),
          createElementVNode("span", {
            class: normalizeClass(["aheart-date-range-picker__field", { "is-active": activePart.value === "end" && mergedOpen.value }])
          }, [
            createElementVNode("input", {
              ref_key: "endInputRef",
              ref: endInputRef,
              id: _ctx.id ? `${_ctx.id}-end` : void 0,
              "data-range-part": "end",
              role: "combobox",
              "aria-haspopup": "dialog",
              "aria-labelledby": _ctx.labelledBy ?? _ctx.ariaLabelledby,
              "aria-describedby": _ctx.describedBy ?? _ctx.ariaDescribedby,
              "aria-invalid": _ctx.status === "error" ? "true" : void 0,
              "aria-controls": panelId,
              "aria-expanded": mergedOpen.value ? "true" : "false",
              "aria-activedescendant": mergedOpen.value ? activeCellId.value : void 0,
              value: inputTexts.value[1],
              placeholder: resolvedPlaceholders.value[1],
              disabled: isDisabled.value,
              readonly: _ctx.readOnly,
              onFocus: _cache[4] || (_cache[4] = ($event) => activatePart("end")),
              onInput: _cache[5] || (_cache[5] = ($event) => updateInputText("end", $event)),
              onChange: _cache[6] || (_cache[6] = ($event) => commitInput("end")),
              onKeydown: handleInputKeydown
            }, null, 40, _hoisted_5),
            _ctx.allowClear && ((_b = mergedValue.value) == null ? void 0 : _b[1]) && _ctx.allowEmpty[1] && !isDisabled.value && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
              key: 0,
              "data-range-clear": "end",
              type: "button",
              "aria-label": `${resolvedLocale.value.clear} ${resolvedPlaceholders.value[1]}`,
              onClick: _cache[7] || (_cache[7] = withModifiers(($event) => clearPart("end"), ["stop"]))
            }, [
              createVNode(_sfc_main$1, {
                name: "close",
                size: 12
              })
            ], 8, _hoisted_6)) : createCommentVNode("", true)
          ], 2),
          _ctx.allowClear && hasValue.value && !isDisabled.value && !_ctx.readOnly ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "aheart-date-range-picker__clear",
            type: "button",
            "aria-label": resolvedLocale.value.clear,
            onClick: withModifiers(clearAll, ["stop"])
          }, [
            createVNode(_sfc_main$1, {
              name: "close",
              size: 14
            })
          ], 8, _hoisted_7)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_8, [
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
            class: normalizeClass(["aheart-date-range-picker__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": `${resolvedPlaceholders.value[0]} - ${resolvedPlaceholders.value[1]}`
          }, [
            ((_c = _ctx.presets) == null ? void 0 : _c.length) ? (openBlock(), createElementBlock("aside", {
              key: 0,
              class: "aheart-date-range-picker__presets",
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
                ], 8, _hoisted_11);
              }), 128))
            ], 8, _hoisted_10)) : createCommentVNode("", true),
            createElementVNode("div", _hoisted_12, [
              createElementVNode("div", _hoisted_13, [
                createElementVNode("button", {
                  id: `${panelId}-tab-start`,
                  "data-mobile-part": "start",
                  type: "button",
                  role: "tab",
                  tabindex: activePart.value === "start" ? 0 : -1,
                  "aria-selected": activePart.value === "start",
                  "aria-controls": `${panelId}-tabpanel`,
                  onClick: _cache[8] || (_cache[8] = ($event) => activateMobilePart("start")),
                  onKeydown: _cache[9] || (_cache[9] = ($event) => handlePartTabKeydown("start", $event))
                }, toDisplayString(resolvedPlaceholders.value[0]), 41, _hoisted_14),
                createElementVNode("button", {
                  id: `${panelId}-tab-end`,
                  "data-mobile-part": "end",
                  type: "button",
                  role: "tab",
                  tabindex: activePart.value === "end" ? 0 : -1,
                  "aria-selected": activePart.value === "end",
                  "aria-controls": `${panelId}-tabpanel`,
                  onClick: _cache[10] || (_cache[10] = ($event) => activateMobilePart("end")),
                  onKeydown: _cache[11] || (_cache[11] = ($event) => handlePartTabKeydown("end", $event))
                }, toDisplayString(resolvedPlaceholders.value[1]), 41, _hoisted_15)
              ]),
              createElementVNode("div", {
                id: `${panelId}-tabpanel`,
                class: "aheart-date-range-picker__calendars",
                role: "tabpanel",
                "aria-labelledby": `${panelId}-tab-${activePart.value}`
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(calendars.value, (calendar, calendarIndex) => {
                  return openBlock(), createElementBlock("section", {
                    key: calendar.key,
                    class: normalizeClass(["aheart-date-range-picker__calendar", { "is-mobile-hidden": calendarIndex !== mobileCalendarIndex.value }])
                  }, [
                    createElementVNode("header", _hoisted_17, [
                      createElementVNode("button", {
                        type: "button",
                        "aria-label": _ctx.picker === "year" ? resolvedLocale.value.previousDecade : resolvedLocale.value.previousYear,
                        onClick: ($event) => movePanel(calendarIndex, -1, true)
                      }, [
                        createVNode(_sfc_main$1, {
                          name: "chevrons-left",
                          size: 16
                        })
                      ], 8, _hoisted_18),
                      _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        type: "button",
                        "aria-label": resolvedLocale.value.previousMonth,
                        onClick: ($event) => movePanel(calendarIndex, -1)
                      }, [
                        createVNode(_sfc_main$1, {
                          name: "chevron-left",
                          size: 16
                        })
                      ], 8, _hoisted_19)) : createCommentVNode("", true),
                      createElementVNode("strong", null, toDisplayString(calendar.title), 1),
                      _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("button", {
                        key: 1,
                        type: "button",
                        "aria-label": resolvedLocale.value.nextMonth,
                        onClick: ($event) => movePanel(calendarIndex, 1)
                      }, [
                        createVNode(_sfc_main$1, {
                          name: "chevron-right",
                          size: 16
                        })
                      ], 8, _hoisted_20)) : createCommentVNode("", true),
                      createElementVNode("button", {
                        type: "button",
                        "aria-label": _ctx.picker === "year" ? resolvedLocale.value.nextDecade : resolvedLocale.value.nextYear,
                        onClick: ($event) => movePanel(calendarIndex, 1, true)
                      }, [
                        createVNode(_sfc_main$1, {
                          name: "chevrons-right",
                          size: 16
                        })
                      ], 8, _hoisted_21)
                    ]),
                    _ctx.picker === "date" || _ctx.picker === "week" ? (openBlock(), createElementBlock("div", _hoisted_22, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(resolvedLocale.value.weekdaysShort, (day) => {
                        return openBlock(), createElementBlock("span", { key: day }, toDisplayString(day), 1);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    createElementVNode("div", {
                      class: normalizeClass(["aheart-date-range-picker__grid", `aheart-date-range-picker__grid--${_ctx.picker}`]),
                      role: "grid",
                      "aria-label": calendar.title
                    }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(calendar.cells, (cell) => {
                        return openBlock(), createElementBlock("button", {
                          key: cell.key,
                          type: "button",
                          role: "gridcell",
                          tabindex: "-1",
                          id: cell.id,
                          "data-value": cell.value,
                          disabled: cell.disabled,
                          "aria-selected": cell.selected ? "true" : "false",
                          class: normalizeClass({ "is-outside": !cell.inView, "is-active": cell.active, "is-selected": cell.selected, "is-range-start": cell.rangeStart, "is-range-end": cell.rangeEnd, "is-in-range": cell.inRange, "is-today": cell.today }),
                          onMouseenter: ($event) => hoverValue.value = cell.value,
                          onMouseleave: _cache[12] || (_cache[12] = ($event) => hoverValue.value = void 0),
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
                        ], 42, _hoisted_24);
                      }), 128))
                    ], 10, _hoisted_23)
                  ], 2);
                }), 128))
              ], 8, _hoisted_16),
              effectiveShowTime.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "aheart-date-range-picker__times",
                "aria-label": resolvedLocale.value.time
              }, [
                (openBlock(), createElementBlock(Fragment, null, renderList(rangeParts, (part) => {
                  var _a2;
                  return createElementVNode("fieldset", {
                    key: part,
                    disabled: !((_a2 = draftValue.value) == null ? void 0 : _a2[part === "start" ? 0 : 1])
                  }, [
                    createElementVNode("legend", null, toDisplayString(part === "start" ? resolvedPlaceholders.value[0] : resolvedPlaceholders.value[1]), 1),
                    createElementVNode("input", {
                      "data-time-part": `${part}-hour`,
                      type: "number",
                      min: showTimeOptions.value.use12Hours ? 1 : 0,
                      max: showTimeOptions.value.use12Hours ? 12 : 23,
                      step: showTimeOptions.value.hourStep ?? 1,
                      value: displayTimeHour(part),
                      onInput: ($event) => updateTime(part, "hour", $event)
                    }, null, 40, _hoisted_27),
                    showTimeOptions.value.use12Hours ? (openBlock(), createElementBlock("select", {
                      key: 0,
                      "data-time-part": `${part}-period`,
                      value: timePeriod(part),
                      onChange: ($event) => updatePeriod(part, $event)
                    }, [
                      createElementVNode("option", _hoisted_29, toDisplayString(resolvedLocale.value.am), 1),
                      createElementVNode("option", _hoisted_30, toDisplayString(resolvedLocale.value.pm), 1)
                    ], 40, _hoisted_28)) : createCommentVNode("", true),
                    _cache[13] || (_cache[13] = createElementVNode("span", null, ":", -1)),
                    createElementVNode("input", {
                      "data-time-part": `${part}-minute`,
                      type: "number",
                      min: "0",
                      max: "59",
                      step: showTimeOptions.value.minuteStep ?? 1,
                      value: timeParts(part).minute,
                      onInput: ($event) => updateTime(part, "minute", $event)
                    }, null, 40, _hoisted_31),
                    _cache[14] || (_cache[14] = createElementVNode("span", null, ":", -1)),
                    createElementVNode("input", {
                      "data-time-part": `${part}-second`,
                      type: "number",
                      min: "0",
                      max: "59",
                      step: showTimeOptions.value.secondStep ?? 1,
                      value: timeParts(part).second,
                      onInput: ($event) => updateTime(part, "second", $event)
                    }, null, 40, _hoisted_32)
                  ], 8, _hoisted_26);
                }), 64))
              ], 8, _hoisted_25)) : createCommentVNode("", true),
              createElementVNode("footer", _hoisted_33, [
                createElementVNode("button", {
                  type: "button",
                  class: "aheart-date-range-picker__today",
                  onClick: selectToday
                }, toDisplayString(resolvedLocale.value.today), 1),
                renderSlot(_ctx.$slots, "footer"),
                effectiveNeedConfirm.value || _ctx.allowEmpty.some(Boolean) ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "aheart-date-range-picker__ok",
                  disabled: !rangeComplete.value,
                  onClick: confirmDraft
                }, toDisplayString(resolvedLocale.value.ok), 9, _hoisted_34)) : createCommentVNode("", true)
              ]),
              createElementVNode("span", _hoisted_35, toDisplayString(liveMessage.value), 1)
            ])
          ], 14, _hoisted_9)), [
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
