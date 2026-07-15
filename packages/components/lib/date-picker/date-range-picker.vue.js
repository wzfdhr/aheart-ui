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
  class: "aheart-date-range-picker__prefix"
};
const _hoisted_2 = ["id", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_3 = ["aria-label"];
const _hoisted_4 = { class: "aheart-date-range-picker__separator" };
const _hoisted_5 = ["id", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
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
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  ...{ name: "ADateRangePicker" },
  __name: "date-range-picker",
  props: types.dateRangePickerProps,
  emits: types.dateRangePickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = vue.useSlots();
    const config = context.useAheartConfig();
    const rootRef = vue.ref(null);
    const triggerRef = vue.ref(null);
    const panelRef = vue.ref(null);
    const startInputRef = vue.ref(null);
    const endInputRef = vue.ref(null);
    const internalValue = vue.ref(props.defaultValue ? [...props.defaultValue] : void 0);
    const internalOpen = vue.ref(props.defaultOpen);
    const draftValue = vue.ref();
    const activePart = vue.ref("start");
    const activeKeyboardDate = vue.ref();
    const activePanelIndex = vue.ref(0);
    const hoverValue = vue.ref();
    const liveMessage = vue.ref("");
    const inputTexts = vue.ref(["", ""]);
    const nowDate = vue.ref();
    const rangeParts = ["start", "end"];
    const panelId = `aheart-date-range-picker-${vue.useId().replace(/:/g, "")}-panel`;
    const isValueControlled = usePropPresence.usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence.usePropPresence("open");
    const isPanelControlled = usePropPresence.usePropPresence("pickerValue", "picker-value");
    const ARenderNode = vue.defineComponent({
      name: "ADateRangePickerRenderNode",
      props: { node: { type: null, default: void 0 } },
      setup(renderProps) {
        return () => {
          const node = renderProps.node;
          const component = typeof node === "function" || typeof node === "object" && node !== null && !Array.isArray(node) && !vue.isVNode(node);
          return component ? vue.h(vue.toRaw(node)) : node;
        };
      }
    });
    const mergedValue = vue.computed(() => isValueControlled.value ? props.modelValue : internalValue.value);
    const mergedOpen = vue.computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value));
    const effectiveShowTime = vue.computed(() => Boolean(props.showTime) && props.picker === "date");
    const showTimeOptions = vue.computed(() => typeof props.showTime === "object" ? props.showTime : {});
    const effectiveNeedConfirm = vue.computed(() => props.needConfirm ?? effectiveShowTime.value);
    const resolvedValueFormat = vue.computed(() => props.valueFormat ?? codec.defaultValueFormat(props.picker, effectiveShowTime.value));
    const displayFormats = vue.computed(() => codec.normalizeFormats(props.format ?? resolvedValueFormat.value));
    const displayFormat = vue.computed(() => displayFormats.value[0] ?? resolvedValueFormat.value);
    const resolvedLocale = vue.computed(() => {
      var _a, _b;
      return { ...context.zhCN.datePicker, ...(_a = config.value.locale) == null ? void 0 : _a.datePicker, ...(_b = props.locale) == null ? void 0 : _b.datePicker };
    });
    const resolvedPlaceholders = vue.computed(() => props.placeholder ?? [resolvedLocale.value.startDate, resolvedLocale.value.endDate]);
    const isDisabled = vue.computed(() => context.resolveConfigValue(props.disabled, config.value.disabled, false));
    const resolvedSize = vue.computed(() => context.resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedVariant = vue.computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = vue.computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const hasValue = vue.computed(() => {
      var _a, _b;
      return Boolean(((_a = mergedValue.value) == null ? void 0 : _a[0]) || ((_b = mergedValue.value) == null ? void 0 : _b[1]));
    });
    const rangeComplete = vue.computed(() => {
      var _a, _b, _c, _d;
      return Boolean(
        (((_a = draftValue.value) == null ? void 0 : _a[0]) || props.allowEmpty[0]) && (((_b = draftValue.value) == null ? void 0 : _b[1]) || props.allowEmpty[1]) && (((_c = draftValue.value) == null ? void 0 : _c[0]) || ((_d = draftValue.value) == null ? void 0 : _d[1]))
      );
    });
    const rootClass = vue.computed(() => [
      `aheart-date-range-picker--${resolvedSize.value}`,
      `aheart-date-range-picker--${resolvedVariant.value}`,
      props.status && `aheart-date-range-picker--${props.status}`,
      { "is-open": mergedOpen.value, "is-disabled": isDisabled.value }
    ]);
    const parseValue = (value) => value ? codec.parsePickerValue(value, [resolvedValueFormat.value, ...displayFormats.value, "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD", "GGGG-[W]WW", "YYYY-MM", "YYYY-[Q]Q", "YYYY"], dayjs.pickerDayjsLocale(resolvedLocale.value.locale)) : void 0;
    const formatDisplay = (value) => {
      var _a;
      return value ? codec.formatPickerValue((_a = parseValue(value)) == null ? void 0 : _a.locale(dayjs.pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value : "";
    };
    const syncInputs = () => {
      var _a, _b;
      inputTexts.value = [formatDisplay((_a = mergedValue.value) == null ? void 0 : _a[0]), formatDisplay((_b = mergedValue.value) == null ? void 0 : _b[1])];
    };
    vue.watch(mergedValue, syncInputs, { immediate: true, deep: true });
    const initialPanelValues = () => {
      var _a, _b;
      const explicit = props.pickerValue ?? props.defaultPickerValue;
      const start = parseValue(explicit == null ? void 0 : explicit[0]) ?? parseValue((_a = mergedValue.value) == null ? void 0 : _a[0]) ?? nowDate.value ?? dayjs.createPickerDate("2000-01-01", "YYYY-MM-DD", true);
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
    const panelDates = vue.ref(initialPanelValues());
    vue.onMounted(() => {
      nowDate.value = dayjs.createPickerDate();
      if (!props.defaultPickerValue && !props.pickerValue && !mergedValue.value)
        panelDates.value = initialPanelValues();
    });
    const minDateValue = vue.computed(() => codec.parsePickerValue(props.minDate, "YYYY-MM-DD"));
    const maxDateValue = vue.computed(() => codec.parsePickerValue(props.maxDate, "YYYY-MM-DD"));
    const cellValue = (date) => codec.formatPickerValue(date, resolvedValueFormat.value);
    const canonicalCellValue = (date) => codec.formatPickerValue(date, codec.defaultValueFormat(props.picker, false));
    const isDisabledDate = (date) => calendar.isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a, _b;
        return Boolean((_b = props.disabledDate) == null ? void 0 : _b.call(props, codec.formatPickerValue(current, "YYYY-MM-DD"), { from: (_a = draftValue.value) == null ? void 0 : _a[activePart.value === "start" ? 1 : 0], type: props.picker }));
      }
    });
    const comparisonValue = (value) => {
      const parsed = parseValue(value);
      return parsed ? codec.formatPickerValue(parsed, codec.defaultValueFormat(props.picker, false)) : value;
    };
    const isDateDisabledForPart = (date, part, range) => calendar.isPickerDateDisabled(date, {
      min: minDateValue.value,
      max: maxDateValue.value,
      disabledDate: (current) => {
        var _a;
        return Boolean((_a = props.disabledDate) == null ? void 0 : _a.call(props, codec.formatPickerValue(current, "YYYY-MM-DD"), { from: range == null ? void 0 : range[part === "start" ? 1 : 0], type: props.picker }));
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
      const low = codec.comparePickerValues(left, right, codec.defaultValueFormat(props.picker)) <= 0 ? left : right;
      const high = low === left ? right : left;
      return codec.comparePickerValues(current, low, codec.defaultValueFormat(props.picker)) > 0 && codec.comparePickerValues(current, high, codec.defaultValueFormat(props.picker)) < 0;
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
        return calendar.createDateMatrix(view, resolvedLocale.value.weekStartsOn, nowDate.value).map((item) => createCell(item.value, String(item.value.date()), codec.formatPickerValue(item.value, "YYYY-MM-DD"), item.inView, item.today, panelIndex));
      }
      if (props.picker === "month")
        return Array.from({ length: 12 }, (_, month) => {
          const date = view.month(month).startOf("month");
          return createCell(date, resolvedLocale.value.monthsShort[month], codec.formatPickerValue(date, "YYYY-MM"), true, false, panelIndex);
        });
      if (props.picker === "quarter")
        return Array.from({ length: 4 }, (_, quarter) => {
          const date = view.month(quarter * 3).startOf("quarter");
          return createCell(date, `Q${quarter + 1}`, codec.formatPickerValue(date, "YYYY-[Q]Q"), true, false, panelIndex);
        });
      const decadeStart = Math.floor(view.year() / 10) * 10 - 1;
      return Array.from({ length: 12 }, (_, index) => {
        const date = view.year(decadeStart + index).startOf("year");
        return createCell(date, String(date.year()), codec.formatPickerValue(date, "YYYY"), index > 0 && index < 11, false, panelIndex);
      });
    };
    const panelTitle = (view) => {
      if (props.picker === "date" || props.picker === "week") {
        const localized = view.locale(dayjs.pickerDayjsLocale(resolvedLocale.value.locale));
        return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format("MMMM"));
      }
      if (props.picker === "year") {
        const start = Math.floor(view.year() / 10) * 10;
        return `${start} - ${start + 9}`;
      }
      return String(view.year());
    };
    const calendars = vue.computed(() => panelDates.value.map((date, index) => ({ key: `${index}-${date.valueOf()}`, title: panelTitle(date), cells: cellsForPanel(date, index) })));
    const mobileCalendarIndex = vue.ref(0);
    const panelIndexForDate = (date) => {
      const index = panelDates.value.findIndex((panelDate) => {
        if (props.picker === "year")
          return Math.floor(panelDate.year() / 10) === Math.floor(date.year() / 10);
        return date.isSame(panelDate, props.picker === "date" || props.picker === "week" ? "month" : "year");
      });
      return index;
    };
    const activeCellId = vue.computed(() => {
      var _a;
      const cells = calendars.value.flatMap((calendar2) => calendar2.cells);
      return (_a = cells.find((cell) => cell.active && cell.inView) ?? cells.find((cell) => cell.active)) == null ? void 0 : _a.id;
    });
    const motion = useMotionPresence.useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = vue.computed(() => {
      if (!triggerRef.value)
        return false;
      if (props.getPopupContainer)
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
      var _a;
      return [`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`, { "has-presets": (_a = props.presets) == null ? void 0 : _a.length, "has-time": effectiveShowTime.value }];
    });
    const panelStyle = vue.computed(() => floatingPosition.popupStyle.value);
    vue.watch(() => motion.phase.value, (phase) => {
      if (phase === "entered")
        void vue.nextTick(floatingPosition.update);
    });
    let restoringFocus = false;
    const requestOpen = (open, restoreFocus = false) => {
      if (open && (isDisabled.value || props.readOnly))
        return;
      if (!isOpenControlled.value)
        internalOpen.value = open;
      emit("openChange", open);
      if (!open && restoreFocus)
        void vue.nextTick(() => {
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
    vue.watch(mergedOpen, (open) => {
      if (open)
        syncDraft();
    }, { immediate: true });
    vue.watch(mergedValue, () => {
      if (mergedOpen.value)
        syncDraft();
    }, { deep: true });
    vue.watch(() => props.pickerValue, () => {
      if (props.pickerValue)
        panelDates.value = initialPanelValues();
    }, { deep: true });
    useFloatingDismiss.useFloatingDismiss({ open: mergedOpen, trigger: triggerRef, floating: panelRef, onDismiss: (reason) => requestOpen(false, reason === "escape"), restoreFocus: false });
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
      void vue.nextTick(() => {
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
      emit("panelChange", next.map((item) => codec.formatPickerValue(item, resolvedValueFormat.value)), props.picker);
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
      const parsed = codec.parsePickerValue(input, displayFormats.value, dayjs.pickerDayjsLocale(resolvedLocale.value.locale));
      if (!parsed) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      const next = [(_c = mergedValue.value) == null ? void 0 : _c[0], (_d = mergedValue.value) == null ? void 0 : _d[1]];
      next[index] = codec.formatPickerValue(parsed, resolvedValueFormat.value);
      if (isDateDisabledForPart(parsed, part, next)) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      const normalized = selection.normalizeRangeValue(next, resolvedValueFormat.value, props.order, props.allowEmpty);
      if (!normalized) {
        emit("invalid", input, part);
        syncInputs();
        return;
      }
      commitValue(normalized, false);
    };
    const commitValue = (value, close = true) => {
      const normalized = selection.normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty) ?? value;
      if (!isValueControlled.value)
        internalValue.value = normalized ? [...normalized] : void 0;
      emit("update:modelValue", normalized);
      emit("change", normalized);
      if (isValueControlled.value)
        void vue.nextTick(syncInputs);
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
      return value ? codec.parsePickerValue(value, showTimeOptions.value.format ?? "HH:mm:ss") : void 0;
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
      const result = selection.advanceRangeSelection(draftValue.value, value, selectedPart, resolvedValueFormat.value, props.order, props.allowEmpty);
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
      const normalized = selection.normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty);
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
      const date = nowDate.value ?? dayjs.createPickerDate();
      const panelIndex = Math.max(0, panelIndexForDate(date));
      selectCell(createCell(date, String(date.date()), codec.formatPickerValue(date, "YYYY-MM-DD"), true, true, panelIndex));
    };
    const confirmDraft = () => {
      if (!rangeComplete.value)
        return;
      const normalized = selection.normalizeRangeValue(draftValue.value, resolvedValueFormat.value, props.order, props.allowEmpty);
      if (!normalized)
        return;
      commitValue(normalized);
      emit("ok", normalized);
    };
    const timeParts = (part) => {
      var _a;
      const value = parseValue((_a = draftValue.value) == null ? void 0 : _a[part === "start" ? 0 : 1]) ?? dayjs.createPickerDate().startOf("day");
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
      range[index] = codec.formatPickerValue(next, resolvedValueFormat.value);
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
      range[index] = codec.formatPickerValue(next, resolvedValueFormat.value);
      draftValue.value = range;
      emit("calendarChange", [...range], { range: part });
    };
    const movePanel = (index, amount, year = false) => {
      const resolvedAmount = props.picker === "year" ? amount * 10 : amount;
      if (isPanelControlled.value) {
        const values = panelDates.value.map((date, panelIndex) => codec.formatPickerValue(panelIndex === index ? date.add(resolvedAmount, year ? "year" : "month") : date, resolvedValueFormat.value));
        emit("panelChange", values, props.picker);
        return;
      }
      const next = [...panelDates.value];
      next[index] = next[index].add(resolvedAmount, year ? "year" : "month");
      panelDates.value = next;
      emit("panelChange", next.map((date) => codec.formatPickerValue(date, resolvedValueFormat.value)), props.picker);
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
      return vue.openBlock(), vue.createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: vue.normalizeClass(["aheart-date-range-picker", rootClass.value])
      }, [
        vue.createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-date-range-picker__selector",
          onMousedown: handleSelectorMouseDown
        }, [
          hasPrefix.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
            vue.renderSlot(_ctx.$slots, "prefix", {}, () => [
              vue.createVNode(vue.unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-date-range-picker__field", { "is-active": activePart.value === "start" && mergedOpen.value }])
          }, [
            vue.createElementVNode("input", {
              ref_key: "startInputRef",
              ref: startInputRef,
              id: _ctx.id ? `${_ctx.id}-start` : void 0,
              "data-range-part": "start",
              role: "combobox",
              "aria-haspopup": "dialog",
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
            _ctx.allowClear && ((_a = mergedValue.value) == null ? void 0 : _a[0]) && _ctx.allowEmpty[0] && !isDisabled.value && !_ctx.readOnly ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              "data-range-clear": "start",
              type: "button",
              "aria-label": `${resolvedLocale.value.clear} ${resolvedPlaceholders.value[0]}`,
              onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => clearPart("start"), ["stop"]))
            }, [
              vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                name: "close",
                size: 12
              })
            ], 8, _hoisted_3)) : vue.createCommentVNode("", true)
          ], 2),
          vue.createElementVNode("span", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "separator", {}, () => [
              _ctx.separator ? (vue.openBlock(), vue.createBlock(vue.unref(ARenderNode), {
                key: 0,
                node: _ctx.separator
              }, null, 8, ["node"])) : (vue.openBlock(), vue.createBlock(icon_vue_vue_type_script_setup_true_lang.default, {
                key: 1,
                name: "arrow-right",
                size: 14
              }))
            ])
          ]),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(["aheart-date-range-picker__field", { "is-active": activePart.value === "end" && mergedOpen.value }])
          }, [
            vue.createElementVNode("input", {
              ref_key: "endInputRef",
              ref: endInputRef,
              id: _ctx.id ? `${_ctx.id}-end` : void 0,
              "data-range-part": "end",
              role: "combobox",
              "aria-haspopup": "dialog",
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
            _ctx.allowClear && ((_b = mergedValue.value) == null ? void 0 : _b[1]) && _ctx.allowEmpty[1] && !isDisabled.value && !_ctx.readOnly ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 0,
              "data-range-clear": "end",
              type: "button",
              "aria-label": `${resolvedLocale.value.clear} ${resolvedPlaceholders.value[1]}`,
              onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => clearPart("end"), ["stop"]))
            }, [
              vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                name: "close",
                size: 12
              })
            ], 8, _hoisted_6)) : vue.createCommentVNode("", true)
          ], 2),
          _ctx.allowClear && hasValue.value && !isDisabled.value && !_ctx.readOnly ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 1,
            class: "aheart-date-range-picker__clear",
            type: "button",
            "aria-label": resolvedLocale.value.clear,
            onClick: vue.withModifiers(clearAll, ["stop"])
          }, [
            vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
              name: "close",
              size: 14
            })
          ], 8, _hoisted_7)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_8, [
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
            class: vue.normalizeClass(["aheart-date-range-picker__panel", panelClass.value]),
            style: vue.normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": `${resolvedPlaceholders.value[0]} - ${resolvedPlaceholders.value[1]}`
          }, [
            ((_c = _ctx.presets) == null ? void 0 : _c.length) ? (vue.openBlock(), vue.createElementBlock("aside", {
              key: 0,
              class: "aheart-date-range-picker__presets",
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
                ], 8, _hoisted_11);
              }), 128))
            ], 8, _hoisted_10)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_12, [
              vue.createElementVNode("div", _hoisted_13, [
                vue.createElementVNode("button", {
                  id: `${panelId}-tab-start`,
                  "data-mobile-part": "start",
                  type: "button",
                  role: "tab",
                  tabindex: activePart.value === "start" ? 0 : -1,
                  "aria-selected": activePart.value === "start",
                  "aria-controls": `${panelId}-tabpanel`,
                  onClick: _cache[8] || (_cache[8] = ($event) => activateMobilePart("start")),
                  onKeydown: _cache[9] || (_cache[9] = ($event) => handlePartTabKeydown("start", $event))
                }, vue.toDisplayString(resolvedPlaceholders.value[0]), 41, _hoisted_14),
                vue.createElementVNode("button", {
                  id: `${panelId}-tab-end`,
                  "data-mobile-part": "end",
                  type: "button",
                  role: "tab",
                  tabindex: activePart.value === "end" ? 0 : -1,
                  "aria-selected": activePart.value === "end",
                  "aria-controls": `${panelId}-tabpanel`,
                  onClick: _cache[10] || (_cache[10] = ($event) => activateMobilePart("end")),
                  onKeydown: _cache[11] || (_cache[11] = ($event) => handlePartTabKeydown("end", $event))
                }, vue.toDisplayString(resolvedPlaceholders.value[1]), 41, _hoisted_15)
              ]),
              vue.createElementVNode("div", {
                id: `${panelId}-tabpanel`,
                class: "aheart-date-range-picker__calendars",
                role: "tabpanel",
                "aria-labelledby": `${panelId}-tab-${activePart.value}`
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(calendars.value, (calendar2, calendarIndex) => {
                  return vue.openBlock(), vue.createElementBlock("section", {
                    key: calendar2.key,
                    class: vue.normalizeClass(["aheart-date-range-picker__calendar", { "is-mobile-hidden": calendarIndex !== mobileCalendarIndex.value }])
                  }, [
                    vue.createElementVNode("header", _hoisted_17, [
                      vue.createElementVNode("button", {
                        type: "button",
                        "aria-label": _ctx.picker === "year" ? resolvedLocale.value.previousDecade : resolvedLocale.value.previousYear,
                        onClick: ($event) => movePanel(calendarIndex, -1, true)
                      }, [
                        vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                          name: "chevrons-left",
                          size: 16
                        })
                      ], 8, _hoisted_18),
                      _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        type: "button",
                        "aria-label": resolvedLocale.value.previousMonth,
                        onClick: ($event) => movePanel(calendarIndex, -1)
                      }, [
                        vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                          name: "chevron-left",
                          size: 16
                        })
                      ], 8, _hoisted_19)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("strong", null, vue.toDisplayString(calendar2.title), 1),
                      _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 1,
                        type: "button",
                        "aria-label": resolvedLocale.value.nextMonth,
                        onClick: ($event) => movePanel(calendarIndex, 1)
                      }, [
                        vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                          name: "chevron-right",
                          size: 16
                        })
                      ], 8, _hoisted_20)) : vue.createCommentVNode("", true),
                      vue.createElementVNode("button", {
                        type: "button",
                        "aria-label": _ctx.picker === "year" ? resolvedLocale.value.nextDecade : resolvedLocale.value.nextYear,
                        onClick: ($event) => movePanel(calendarIndex, 1, true)
                      }, [
                        vue.createVNode(icon_vue_vue_type_script_setup_true_lang.default, {
                          name: "chevrons-right",
                          size: 16
                        })
                      ], 8, _hoisted_21)
                    ]),
                    _ctx.picker === "date" || _ctx.picker === "week" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_22, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(resolvedLocale.value.weekdaysShort, (day) => {
                        return vue.openBlock(), vue.createElementBlock("span", { key: day }, vue.toDisplayString(day), 1);
                      }), 128))
                    ])) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(["aheart-date-range-picker__grid", `aheart-date-range-picker__grid--${_ctx.picker}`]),
                      role: "grid",
                      "aria-label": calendar2.title
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(calendar2.cells, (cell) => {
                        return vue.openBlock(), vue.createElementBlock("button", {
                          key: cell.key,
                          type: "button",
                          role: "gridcell",
                          tabindex: "-1",
                          id: cell.id,
                          "data-value": cell.value,
                          disabled: cell.disabled,
                          "aria-selected": cell.selected ? "true" : "false",
                          class: vue.normalizeClass({ "is-outside": !cell.inView, "is-active": cell.active, "is-selected": cell.selected, "is-range-start": cell.rangeStart, "is-range-end": cell.rangeEnd, "is-in-range": cell.inRange, "is-today": cell.today }),
                          onMouseenter: ($event) => hoverValue.value = cell.value,
                          onMouseleave: _cache[12] || (_cache[12] = ($event) => hoverValue.value = void 0),
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
                        ], 42, _hoisted_24);
                      }), 128))
                    ], 10, _hoisted_23)
                  ], 2);
                }), 128))
              ], 8, _hoisted_16),
              effectiveShowTime.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "aheart-date-range-picker__times",
                "aria-label": resolvedLocale.value.time
              }, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(rangeParts, (part) => {
                  var _a2;
                  return vue.createElementVNode("fieldset", {
                    key: part,
                    disabled: !((_a2 = draftValue.value) == null ? void 0 : _a2[part === "start" ? 0 : 1])
                  }, [
                    vue.createElementVNode("legend", null, vue.toDisplayString(part === "start" ? resolvedPlaceholders.value[0] : resolvedPlaceholders.value[1]), 1),
                    vue.createElementVNode("input", {
                      "data-time-part": `${part}-hour`,
                      type: "number",
                      min: showTimeOptions.value.use12Hours ? 1 : 0,
                      max: showTimeOptions.value.use12Hours ? 12 : 23,
                      step: showTimeOptions.value.hourStep ?? 1,
                      value: displayTimeHour(part),
                      onInput: ($event) => updateTime(part, "hour", $event)
                    }, null, 40, _hoisted_27),
                    showTimeOptions.value.use12Hours ? (vue.openBlock(), vue.createElementBlock("select", {
                      key: 0,
                      "data-time-part": `${part}-period`,
                      value: timePeriod(part),
                      onChange: ($event) => updatePeriod(part, $event)
                    }, [
                      vue.createElementVNode("option", _hoisted_29, vue.toDisplayString(resolvedLocale.value.am), 1),
                      vue.createElementVNode("option", _hoisted_30, vue.toDisplayString(resolvedLocale.value.pm), 1)
                    ], 40, _hoisted_28)) : vue.createCommentVNode("", true),
                    _cache[13] || (_cache[13] = vue.createElementVNode("span", null, ":", -1)),
                    vue.createElementVNode("input", {
                      "data-time-part": `${part}-minute`,
                      type: "number",
                      min: "0",
                      max: "59",
                      step: showTimeOptions.value.minuteStep ?? 1,
                      value: timeParts(part).minute,
                      onInput: ($event) => updateTime(part, "minute", $event)
                    }, null, 40, _hoisted_31),
                    _cache[14] || (_cache[14] = vue.createElementVNode("span", null, ":", -1)),
                    vue.createElementVNode("input", {
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
              ], 8, _hoisted_25)) : vue.createCommentVNode("", true),
              vue.createElementVNode("footer", _hoisted_33, [
                vue.createElementVNode("button", {
                  type: "button",
                  class: "aheart-date-range-picker__today",
                  onClick: selectToday
                }, vue.toDisplayString(resolvedLocale.value.today), 1),
                vue.renderSlot(_ctx.$slots, "footer"),
                effectiveNeedConfirm.value || _ctx.allowEmpty.some(Boolean) ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  type: "button",
                  class: "aheart-date-range-picker__ok",
                  disabled: !rangeComplete.value,
                  onClick: confirmDraft
                }, vue.toDisplayString(resolvedLocale.value.ok), 9, _hoisted_34)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("span", _hoisted_35, vue.toDisplayString(liveMessage.value), 1)
            ])
          ], 14, _hoisted_9)), [
            [vue.vShow, vue.unref(motion).phase.value !== "hidden"]
          ]) : vue.createCommentVNode("", true)
        ], 8, ["to", "disabled"]))
      ], 2);
    };
  }
});
exports.default = _sfc_main;
