import { defineComponent, useSlots, ref, useId, isVNode, h, toRaw, computed, watch, nextTick, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createVNode, unref, createCommentVNode, withModifiers, createBlock, Teleport, withDirectives, normalizeStyle, Fragment, renderList, toDisplayString, vShow } from "vue";
import _sfc_main$1 from "../icon/icon.vue.js";
import { createTimeOptions, formatTimeValue, parseTimeValue, timePartsToSeconds } from "../picker-core/time.js";
import { useFloatingDismiss } from "../utils/use-floating-dismiss.js";
import { useFloatingPosition } from "../utils/use-floating-position.js";
import { useMotionPresence } from "../utils/use-motion-presence.js";
import { usePropPresence } from "../utils/use-prop-presence.js";
import { timeRangePickerProps, timeRangePickerEmits } from "./types.js";
import "./style.css.js";
import { useAheartConfig, zhCN, resolveConfigValue } from "../config/context.js";
const _hoisted_1 = {
  key: 0,
  class: "aheart-time-range-picker__prefix"
};
const _hoisted_2 = ["id", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_3 = ["aria-label"];
const _hoisted_4 = { class: "aheart-time-range-picker__separator" };
const _hoisted_5 = ["id", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-expanded", "aria-activedescendant", "value", "placeholder", "disabled", "readonly"];
const _hoisted_6 = ["aria-label"];
const _hoisted_7 = ["aria-label"];
const _hoisted_8 = {
  class: "aheart-time-range-picker__suffix",
  "aria-hidden": "true"
};
const _hoisted_9 = ["aria-label"];
const _hoisted_10 = ["aria-label"];
const _hoisted_11 = ["data-preset-index", "disabled", "onClick"];
const _hoisted_12 = { class: "aheart-time-range-picker__body" };
const _hoisted_13 = {
  class: "aheart-time-range-picker__part-tabs",
  role: "tablist"
};
const _hoisted_14 = ["aria-selected", "tabindex"];
const _hoisted_15 = ["aria-selected", "tabindex"];
const _hoisted_16 = ["aria-labelledby"];
const _hoisted_17 = { class: "aheart-time-picker__columns" };
const _hoisted_18 = ["aria-label"];
const _hoisted_19 = ["id", "data-hour", "disabled", "aria-selected", "onClick"];
const _hoisted_20 = ["aria-label"];
const _hoisted_21 = ["id", "data-minute", "disabled", "aria-selected", "onClick"];
const _hoisted_22 = ["aria-label"];
const _hoisted_23 = ["id", "data-second", "disabled", "aria-selected", "onClick"];
const _hoisted_24 = ["aria-label"];
const _hoisted_25 = ["id", "data-period", "disabled", "aria-selected", "onClick"];
const _hoisted_26 = {
  key: 0,
  class: "aheart-time-range-picker__footer"
};
const _hoisted_27 = ["disabled"];
const _hoisted_28 = ["disabled"];
const _hoisted_29 = {
  class: "aheart-time-range-picker__live",
  "aria-live": "polite"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ATimeRangePicker" },
  __name: "time-range-picker",
  props: timeRangePickerProps,
  emits: timeRangePickerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const config = useAheartConfig();
    const rootRef = ref(null);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const hourColumnRef = ref(null);
    const minuteColumnRef = ref(null);
    const secondColumnRef = ref(null);
    const periodColumnRef = ref(null);
    const internalValue = ref(props.defaultValue ? [...props.defaultValue] : void 0);
    const internalOpen = ref(props.defaultOpen);
    const activePart = ref("start");
    const activeColumn = ref("hour");
    const draftValue = ref();
    const draftParts = ref([{ hour: 0, minute: 0, second: 0 }, { hour: 0, minute: 0, second: 0 }]);
    const liveMessage = ref("");
    const panelId = `aheart-time-range-${useId().replace(/:/g, "")}-panel`;
    const instanceId = panelId.replace("-panel", "");
    const partPanelId = `${instanceId}-part-panel`;
    const startTabId = `${instanceId}-start-tab`;
    const endTabId = `${instanceId}-end-tab`;
    const isValueControlled = usePropPresence("modelValue", "model-value");
    const isOpenControlled = usePropPresence("open");
    const isFormatProvided = usePropPresence("format");
    const ARenderNode = defineComponent({
      name: "ATimeRangePickerRenderNode",
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
    const resolvedPlaceholders = computed(() => props.placeholder ?? [resolvedLocale.value.startTime, resolvedLocale.value.endTime]);
    const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false));
    const isInteractionDisabled = computed(() => isDisabled.value || props.readOnly);
    const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, "middle"));
    const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? "outlined");
    const hasPrefix = computed(() => props.prefix !== void 0 || Boolean(slots.prefix));
    const rootClass = computed(() => [`aheart-time-range-picker--${resolvedSize.value}`, `aheart-time-range-picker--${resolvedVariant.value}`, props.status && `aheart-time-range-picker--${props.status}`, { "is-open": mergedOpen.value, "is-disabled": isDisabled.value }]);
    const resolvedFormat = computed(() => props.use12Hours && !isFormatProvided.value ? "hh:mm:ss A" : props.format);
    const meridiemLabels = computed(() => ({ am: resolvedLocale.value.am, pm: resolvedLocale.value.pm }));
    const showSeconds = computed(() => resolvedFormat.value.includes("ss"));
    const showPeriod = computed(() => props.use12Hours || resolvedFormat.value.includes("A"));
    const activeIndex = computed(() => activePart.value === "start" ? 0 : 1);
    const activeDraft = computed(() => draftParts.value[activeIndex.value]);
    const displayedHour = computed(() => showPeriod.value ? activeDraft.value.hour % 12 || 12 : activeDraft.value.hour);
    const selectedPeriod = computed(() => activeDraft.value.hour >= 12 ? "PM" : "AM");
    const visibleColumns = computed(() => ["hour", "minute", ...showSeconds.value ? ["second"] : [], ...showPeriod.value ? ["period"] : []]);
    const optionId = (column, value) => `${instanceId}-${column}-${String(value).toLowerCase()}`;
    const activeDescendantId = computed(() => activeColumn.value === "hour" ? visibleHourOptions.value.includes(displayedHour.value) ? optionId("hour", displayedHour.value) : void 0 : activeColumn.value === "minute" ? visibleMinuteOptions.value.includes(activeDraft.value.minute) ? optionId("minute", activeDraft.value.minute) : void 0 : activeColumn.value === "second" ? visibleSecondOptions.value.includes(activeDraft.value.second) ? optionId("second", activeDraft.value.second) : void 0 : optionId("period", selectedPeriod.value));
    const pad = (value) => String(value).padStart(2, "0");
    const parseTime = (value) => parseTimeValue(value, meridiemLabels.value);
    const formatDisplayTime = (parts) => formatTimeValue(parts, resolvedFormat.value, meridiemLabels.value);
    const displayValue = (index) => {
      const source = mergedOpen.value ? draftValue.value : mergedValue.value;
      const parts = parseTime(source == null ? void 0 : source[index]);
      return parts ? formatDisplayTime(parts) : (source == null ? void 0 : source[index]) ?? "";
    };
    const hasRangeValue = computed(() => {
      var _a;
      return Boolean((_a = mergedOpen.value ? draftValue.value : mergedValue.value) == null ? void 0 : _a.some(Boolean));
    });
    const syncDraft = () => {
      var _a, _b;
      draftValue.value = mergedValue.value ? [...mergedValue.value] : void 0;
      draftParts.value = [parseTime((_a = draftValue.value) == null ? void 0 : _a[0]) ?? { hour: 0, minute: 0, second: 0 }, parseTime((_b = draftValue.value) == null ? void 0 : _b[1]) ?? { hour: 0, minute: 0, second: 0 }];
    };
    watch(mergedValue, () => {
      if (mergedOpen.value)
        syncDraft();
    }, { deep: true });
    const normalizeRange = (value) => {
      if (!value)
        return void 0;
      const next = [value[0], value[1]];
      if (!next[0] && !props.allowEmpty[0] || !next[1] && !props.allowEmpty[1])
        return void 0;
      const start = parseTime(next[0]);
      const end = parseTime(next[1]);
      if (next[0] && !start || next[1] && !end)
        return void 0;
      if (props.order && start && end && timePartsToSeconds(start) > timePartsToSeconds(end))
        return [next[1], next[0]];
      return next;
    };
    const rangeComplete = computed(() => {
      var _a, _b, _c, _d;
      return Boolean((((_a = draftValue.value) == null ? void 0 : _a[0]) || props.allowEmpty[0]) && (((_b = draftValue.value) == null ? void 0 : _b[1]) || props.allowEmpty[1]) && (((_c = draftValue.value) == null ? void 0 : _c[0]) || ((_d = draftValue.value) == null ? void 0 : _d[1])));
    });
    const disabledResult = (parts, part = activePart.value) => {
      if (!props.disabledTime)
        return false;
      const value = formatTimeValue(parts, props.valueFormat);
      if (typeof props.disabledTime === "object")
        return props.disabledTime;
      return props.disabledTime(value, part);
    };
    const isPartsDisabled = (parts, part = activePart.value) => {
      var _a, _b, _c;
      const result = disabledResult(parts, part);
      if (typeof result === "boolean")
        return result;
      const rules = result;
      return Boolean(((_a = rules.disabledHours) == null ? void 0 : _a.call(rules).includes(parts.hour)) || ((_b = rules.disabledMinutes) == null ? void 0 : _b.call(rules, parts.hour).includes(parts.minute)) || ((_c = rules.disabledSeconds) == null ? void 0 : _c.call(rules, parts.hour, parts.minute).includes(parts.second)));
    };
    const hourOptions = computed(() => showPeriod.value ? createTimeOptions(12, props.hourStep).map((hour) => hour || 12) : createTimeOptions(24, props.hourStep));
    const minuteOptions = computed(() => createTimeOptions(60, props.minuteStep));
    const secondOptions = computed(() => createTimeOptions(60, props.secondStep));
    const candidateHour = (hour) => showPeriod.value ? hour % 12 + (selectedPeriod.value === "PM" ? 12 : 0) : hour;
    const isHourDisabled = (hour) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, hour: candidateHour(hour) });
    const isMinuteDisabled = (minute) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, minute });
    const isSecondDisabled = (second) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, second });
    const isPeriodDisabled = (period) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, hour: activeDraft.value.hour % 12 + (period === "PM" ? 12 : 0) });
    const visibleHourOptions = computed(() => props.hideDisabledOptions ? hourOptions.value.filter((value) => !isHourDisabled(value)) : hourOptions.value);
    const visibleMinuteOptions = computed(() => props.hideDisabledOptions ? minuteOptions.value.filter((value) => !isMinuteDisabled(value)) : minuteOptions.value);
    const visibleSecondOptions = computed(() => props.hideDisabledOptions ? secondOptions.value.filter((value) => !isSecondDisabled(value)) : secondOptions.value);
    const updateActiveDraft = (parts) => {
      var _a, _b;
      if (isInteractionDisabled.value)
        return;
      const nextParts = [...draftParts.value];
      nextParts[activeIndex.value] = parts;
      draftParts.value = nextParts;
      const next = [(_a = draftValue.value) == null ? void 0 : _a[0], (_b = draftValue.value) == null ? void 0 : _b[1]];
      next[activeIndex.value] = formatTimeValue(parts, props.valueFormat);
      draftValue.value = next;
      emit("calendarChange", [...next], { range: activePart.value });
      updateLiveMessage(next);
      if (!props.needConfirm)
        commitRange(next, false);
    };
    const selectHour = (hour) => {
      if (!isHourDisabled(hour))
        updateActiveDraft({ ...activeDraft.value, hour: candidateHour(hour) });
    };
    const selectMinute = (minute) => {
      if (!isMinuteDisabled(minute))
        updateActiveDraft({ ...activeDraft.value, minute });
    };
    const selectSecond = (second) => {
      if (!isSecondDisabled(second))
        updateActiveDraft({ ...activeDraft.value, second });
    };
    const selectPeriod = (period) => updateActiveDraft({ ...activeDraft.value, hour: activeDraft.value.hour % 12 + (period === "PM" ? 12 : 0) });
    const moveToOption = (options, current, direction, disabled, apply) => {
      let index = Math.max(0, options.indexOf(current));
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        index = (index + direction + options.length) % options.length;
        const value = options[index];
        if (value !== void 0 && !disabled(value)) {
          apply(value);
          return;
        }
      }
    };
    const moveActiveColumn = (direction) => {
      const index = visibleColumns.value.indexOf(activeColumn.value);
      activeColumn.value = visibleColumns.value[(index + direction + visibleColumns.value.length) % visibleColumns.value.length];
    };
    const moveActiveValue = (direction) => {
      if (activeColumn.value === "hour")
        moveToOption(visibleHourOptions.value, displayedHour.value, direction, isHourDisabled, selectHour);
      else if (activeColumn.value === "minute")
        moveToOption(visibleMinuteOptions.value, activeDraft.value.minute, direction, isMinuteDisabled, selectMinute);
      else if (activeColumn.value === "second")
        moveToOption(visibleSecondOptions.value, activeDraft.value.second, direction, isSecondDisabled, selectSecond);
      else
        moveToOption(["AM", "PM"], selectedPeriod.value, direction, isPeriodDisabled, selectPeriod);
      void nextTick(scrollSelectedOptionsIntoView);
    };
    const scrollSelectedOptionsIntoView = () => {
      var _a, _b;
      for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value])
        (_b = (_a = column == null ? void 0 : column.querySelector(".is-selected")) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { block: "center" });
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
        if (column === "hour")
          selectHour(value);
        else if (column === "minute")
          selectMinute(value);
        else
          selectSecond(value);
      }, 0);
    };
    const commitRange = (value, close = true) => {
      if (isInteractionDisabled.value)
        return false;
      if (!value) {
        if (!isValueControlled.value)
          internalValue.value = void 0;
        emit("update:modelValue", void 0);
        emit("change", void 0);
        if (close)
          requestOpen(false);
        return true;
      }
      const normalized = normalizeRange(value);
      if (!normalized)
        return false;
      for (const [index, endpoint] of normalized.entries()) {
        const parts = parseTime(endpoint);
        if (parts && isPartsDisabled(parts, index === 0 ? "start" : "end"))
          return false;
      }
      if (!isValueControlled.value)
        internalValue.value = [...normalized];
      emit("update:modelValue", normalized);
      emit("change", normalized);
      if (isValueControlled.value && !props.needConfirm)
        syncDraft();
      if (close)
        requestOpen(false);
      return true;
    };
    const commitInput = (part, event) => {
      var _a, _b, _c, _d;
      if (isInteractionDisabled.value)
        return;
      const inputElement = event.target;
      const inputValue = inputElement.value.trim();
      const index = part === "start" ? 0 : 1;
      if (!inputValue) {
        if (!props.allowEmpty[index]) {
          emit("invalid", inputValue, part);
          inputElement.value = displayValue(index);
          return;
        }
        const next2 = [(_a = draftValue.value) == null ? void 0 : _a[0], (_b = draftValue.value) == null ? void 0 : _b[1]];
        next2[index] = void 0;
        draftValue.value = next2;
        emit("calendarChange", [...next2], { range: part });
        if (!props.needConfirm)
          commitRange(next2, false);
        return;
      }
      const parts = parseTime(inputValue);
      if (!parts || isPartsDisabled(parts, part)) {
        emit("invalid", inputValue, part);
        inputElement.value = displayValue(index);
        return;
      }
      const next = [(_c = draftValue.value) == null ? void 0 : _c[0], (_d = draftValue.value) == null ? void 0 : _d[1]];
      next[index] = formatTimeValue(parts, props.valueFormat);
      draftValue.value = next;
      const nextParts = [...draftParts.value];
      nextParts[index] = parts;
      draftParts.value = nextParts;
      emit("calendarChange", [...next], { range: part });
      if (!props.needConfirm && !commitRange(next, false))
        emit("invalid", inputValue, part);
    };
    const confirmDraft = () => {
      const normalized = normalizeRange(draftValue.value);
      if (!normalized || !commitRange(normalized))
        return;
      emit("ok", normalized);
    };
    const clearPart = (part) => {
      var _a, _b;
      if (isInteractionDisabled.value)
        return;
      const index = part === "start" ? 0 : 1;
      const next = [(_a = draftValue.value) == null ? void 0 : _a[0], (_b = draftValue.value) == null ? void 0 : _b[1]];
      next[index] = void 0;
      draftValue.value = next;
      emit("calendarChange", [...next], { range: part });
      updateLiveMessage(next);
      if (!props.needConfirm)
        commitRange(next, false);
      emit("clear");
    };
    const clearRange = () => {
      if (isInteractionDisabled.value)
        return;
      draftValue.value = void 0;
      if (commitRange(void 0))
        emit("clear");
    };
    const selectPreset = (index) => {
      var _a;
      if (isInteractionDisabled.value)
        return;
      const preset = (_a = props.presets) == null ? void 0 : _a[index];
      if (!preset)
        return;
      const value = typeof preset.value === "function" ? preset.value() : preset.value;
      for (const [endpointIndex, endpoint] of (value ?? []).entries()) {
        const part = endpointIndex === 0 ? "start" : "end";
        const parts = parseTime(endpoint);
        if (endpoint && (!parts || isPartsDisabled(parts, part))) {
          emit("invalid", endpoint, part);
          return;
        }
      }
      draftValue.value = value ? [...value] : void 0;
      draftParts.value = [parseTime(value == null ? void 0 : value[0]) ?? { hour: 0, minute: 0, second: 0 }, parseTime(value == null ? void 0 : value[1]) ?? { hour: 0, minute: 0, second: 0 }];
      if (props.needConfirm) {
        emit("calendarChange", draftValue.value, { range: activePart.value });
        updateLiveMessage(draftValue.value);
      } else
        commitRange(draftValue.value);
    };
    const selectNow = () => {
      if (isInteractionDisabled.value)
        return;
      const now = /* @__PURE__ */ new Date();
      const next = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
      if (!isPartsDisabled(next))
        updateActiveDraft(next);
    };
    const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 });
    const popupContainer = computed(() => props.getPopupContainer && triggerRef.value ? props.getPopupContainer(triggerRef.value) : typeof document === "undefined" ? false : document.body);
    const shouldTeleport = computed(() => popupContainer.value !== false);
    const teleportTo = computed(() => popupContainer.value === false ? "body" : popupContainer.value);
    const floatingPosition = useFloatingPosition({ reference: triggerRef, floating: panelRef, open: () => motion.isMounted.value && motion.phase.value !== "hidden", placement: () => props.placement, strategy: "fixed", offset: 4, autoAdjustOverflow: () => props.autoAdjustOverflow });
    const panelClass = computed(() => {
      var _a;
      return [`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`, { "has-presets": (_a = props.presets) == null ? void 0 : _a.length }];
    });
    const panelStyle = computed(() => floatingPosition.popupStyle.value);
    const requestOpen = (open) => {
      if (open && isInteractionDisabled.value)
        return;
      const wasOpen = mergedOpen.value;
      if (!isOpenControlled.value)
        internalOpen.value = open;
      emit("openChange", open);
      if (open && !wasOpen)
        syncDraft();
    };
    const updateLiveMessage = (value) => {
      if ((value == null ? void 0 : value[0]) && value[1])
        liveMessage.value = resolvedLocale.value.rangeComplete(value[0], value[1]);
      else if (value == null ? void 0 : value[0])
        liveMessage.value = resolvedLocale.value.rangeStartSelected;
      else
        liveMessage.value = "";
    };
    watch(mergedOpen, (open) => {
      if (open) {
        syncDraft();
        void nextTick(scrollSelectedOptionsIntoView);
      }
    }, { immediate: true });
    useFloatingDismiss({ open: mergedOpen, trigger: triggerRef, floating: panelRef, onDismiss: () => requestOpen(false) });
    const activatePart = (part) => {
      activePart.value = part;
      activeColumn.value = "hour";
      requestOpen(true);
      void nextTick(scrollSelectedOptionsIntoView);
    };
    const handlePartTabKeydown = (part, event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const nextPart = event.key === "ArrowLeft" || event.key === "Home" ? "start" : "end";
      if (nextPart === part && (event.key === "ArrowLeft" || event.key === "ArrowRight"))
        activatePart(part === "start" ? "end" : "start");
      else
        activatePart(nextPart);
      void nextTick(() => {
        var _a, _b;
        return (_b = (_a = rootRef.value) == null ? void 0 : _a.querySelector(`#${nextPart === "start" ? startTabId : endTabId}`)) == null ? void 0 : _b.focus();
      });
    };
    const handleSelectorMouseDown = (event) => {
      var _a;
      const part = (_a = event.target.closest("[data-range-part]")) == null ? void 0 : _a.dataset.rangePart;
      if (part)
        activePart.value = part;
      requestOpen(true);
    };
    const handleKeydown = (event) => {
      if (!mergedOpen.value && event.key === "ArrowDown") {
        event.preventDefault();
        requestOpen(true);
      } else if (mergedOpen.value && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        moveActiveColumn(event.key === "ArrowRight" ? 1 : -1);
      } else if (mergedOpen.value && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        moveActiveValue(event.key === "ArrowDown" ? 1 : -1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        requestOpen(false);
      } else if (event.key === "Enter" && mergedOpen.value) {
        event.preventDefault();
        confirmDraft();
      }
    };
    __expose({
      focus: (part = "start") => {
        var _a, _b;
        return (_b = (_a = rootRef.value) == null ? void 0 : _a.querySelector(`[data-range-part="${part}"]`)) == null ? void 0 : _b.focus();
      },
      blur: () => {
        var _a;
        return (_a = rootRef.value) == null ? void 0 : _a.querySelectorAll("input").forEach((input) => input.blur());
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["aheart-time-range-picker", rootClass.value])
      }, [
        createElementVNode("span", {
          ref_key: "triggerRef",
          ref: triggerRef,
          class: "aheart-time-range-picker__selector",
          onMousedown: handleSelectorMouseDown
        }, [
          hasPrefix.value ? (openBlock(), createElementBlock("span", _hoisted_1, [
            renderSlot(_ctx.$slots, "prefix", {}, () => [
              createVNode(unref(ARenderNode), { node: _ctx.prefix }, null, 8, ["node"])
            ])
          ])) : createCommentVNode("", true),
          createElementVNode("span", {
            class: normalizeClass(["aheart-time-range-picker__field", { "is-active": activePart.value === "start" && mergedOpen.value }])
          }, [
            createElementVNode("input", {
              id: _ctx.id ? `${_ctx.id}-start` : void 0,
              "data-range-part": "start",
              role: "combobox",
              "aria-haspopup": "dialog",
              "aria-labelledby": _ctx.labelledBy ?? _ctx.ariaLabelledby,
              "aria-describedby": _ctx.describedBy ?? _ctx.ariaDescribedby,
              "aria-invalid": _ctx.status === "error" ? "true" : void 0,
              "aria-controls": panelId,
              "aria-expanded": mergedOpen.value,
              "aria-activedescendant": mergedOpen.value && activePart.value === "start" ? activeDescendantId.value : void 0,
              value: displayValue(0),
              placeholder: resolvedPlaceholders.value[0],
              disabled: isDisabled.value,
              readonly: _ctx.readOnly,
              onFocus: _cache[0] || (_cache[0] = ($event) => activatePart("start")),
              onChange: _cache[1] || (_cache[1] = ($event) => commitInput("start", $event)),
              onKeydown: handleKeydown
            }, null, 40, _hoisted_2),
            _ctx.allowClear && mergedOpen.value && ((_a = draftValue.value) == null ? void 0 : _a[0]) && _ctx.allowEmpty[0] && !isInteractionDisabled.value ? (openBlock(), createElementBlock("button", {
              key: 0,
              "data-range-clear": "start",
              type: "button",
              "aria-label": resolvedLocale.value.clearStart,
              onClick: _cache[2] || (_cache[2] = withModifiers(($event) => clearPart("start"), ["stop"]))
            }, [
              renderSlot(_ctx.$slots, "clearIcon", {}, () => [
                _ctx.clearIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                  key: 0,
                  node: _ctx.clearIcon
                }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                  key: 1,
                  name: "close",
                  size: 12
                }))
              ])
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
            class: normalizeClass(["aheart-time-range-picker__field", { "is-active": activePart.value === "end" && mergedOpen.value }])
          }, [
            createElementVNode("input", {
              id: _ctx.id ? `${_ctx.id}-end` : void 0,
              "data-range-part": "end",
              role: "combobox",
              "aria-haspopup": "dialog",
              "aria-labelledby": _ctx.labelledBy ?? _ctx.ariaLabelledby,
              "aria-describedby": _ctx.describedBy ?? _ctx.ariaDescribedby,
              "aria-invalid": _ctx.status === "error" ? "true" : void 0,
              "aria-controls": panelId,
              "aria-expanded": mergedOpen.value,
              "aria-activedescendant": mergedOpen.value && activePart.value === "end" ? activeDescendantId.value : void 0,
              value: displayValue(1),
              placeholder: resolvedPlaceholders.value[1],
              disabled: isDisabled.value,
              readonly: _ctx.readOnly,
              onFocus: _cache[3] || (_cache[3] = ($event) => activatePart("end")),
              onChange: _cache[4] || (_cache[4] = ($event) => commitInput("end", $event)),
              onKeydown: handleKeydown
            }, null, 40, _hoisted_5),
            _ctx.allowClear && mergedOpen.value && ((_b = draftValue.value) == null ? void 0 : _b[1]) && _ctx.allowEmpty[1] && !isInteractionDisabled.value ? (openBlock(), createElementBlock("button", {
              key: 0,
              "data-range-clear": "end",
              type: "button",
              "aria-label": resolvedLocale.value.clearEnd,
              onClick: _cache[5] || (_cache[5] = withModifiers(($event) => clearPart("end"), ["stop"]))
            }, [
              renderSlot(_ctx.$slots, "clearIcon", {}, () => [
                _ctx.clearIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                  key: 0,
                  node: _ctx.clearIcon
                }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                  key: 1,
                  name: "close",
                  size: 12
                }))
              ])
            ], 8, _hoisted_6)) : createCommentVNode("", true)
          ], 2),
          _ctx.allowClear && hasRangeValue.value && !isInteractionDisabled.value ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "aheart-time-range-picker__clear",
            "data-range-clear": "all",
            type: "button",
            "aria-label": resolvedLocale.value.clearRange,
            onClick: withModifiers(clearRange, ["stop"])
          }, [
            renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              _ctx.clearIcon ? (openBlock(), createBlock(unref(ARenderNode), {
                key: 0,
                node: _ctx.clearIcon
              }, null, 8, ["node"])) : (openBlock(), createBlock(_sfc_main$1, {
                key: 1,
                name: "close",
                size: 12
              }))
            ])
          ], 8, _hoisted_7)) : createCommentVNode("", true),
          createElementVNode("span", _hoisted_8, [
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
            class: normalizeClass(["aheart-time-range-picker__panel", panelClass.value]),
            style: normalizeStyle(panelStyle.value),
            role: "dialog",
            "aria-label": `${resolvedPlaceholders.value[0]} - ${resolvedPlaceholders.value[1]}`,
            onMousedown: _cache[13] || (_cache[13] = withModifiers(() => {
            }, ["prevent"]))
          }, [
            ((_c = _ctx.presets) == null ? void 0 : _c.length) ? (openBlock(), createElementBlock("aside", {
              key: 0,
              class: "aheart-time-range-picker__presets",
              "aria-label": resolvedLocale.value.selectTime
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.presets, (preset, index) => {
                return openBlock(), createElementBlock("button", {
                  key: index,
                  type: "button",
                  "data-preset-index": index,
                  disabled: isInteractionDisabled.value,
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
                  id: startTabId,
                  type: "button",
                  role: "tab",
                  "aria-controls": partPanelId,
                  "aria-selected": activePart.value === "start",
                  tabindex: activePart.value === "start" ? 0 : -1,
                  onClick: _cache[6] || (_cache[6] = ($event) => activatePart("start")),
                  onKeydown: _cache[7] || (_cache[7] = ($event) => handlePartTabKeydown("start", $event))
                }, toDisplayString(resolvedPlaceholders.value[0]), 41, _hoisted_14),
                createElementVNode("button", {
                  id: endTabId,
                  type: "button",
                  role: "tab",
                  "aria-controls": partPanelId,
                  "aria-selected": activePart.value === "end",
                  tabindex: activePart.value === "end" ? 0 : -1,
                  onClick: _cache[8] || (_cache[8] = ($event) => activatePart("end")),
                  onKeydown: _cache[9] || (_cache[9] = ($event) => handlePartTabKeydown("end", $event))
                }, toDisplayString(resolvedPlaceholders.value[1]), 41, _hoisted_15)
              ]),
              createElementVNode("div", {
                id: partPanelId,
                role: "tabpanel",
                "aria-labelledby": activePart.value === "start" ? startTabId : endTabId
              }, [
                createElementVNode("div", _hoisted_17, [
                  createElementVNode("div", {
                    ref_key: "hourColumnRef",
                    ref: hourColumnRef,
                    "data-time-column": "hour",
                    class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "hour" }]),
                    role: "listbox",
                    "aria-label": resolvedLocale.value.hour,
                    onScroll: _cache[10] || (_cache[10] = ($event) => handleColumnScroll("hour", $event))
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(visibleHourOptions.value, (hour) => {
                      return openBlock(), createElementBlock("button", {
                        id: optionId("hour", hour),
                        key: hour,
                        type: "button",
                        tabindex: "-1",
                        "data-hour": hour,
                        disabled: isHourDisabled(hour),
                        class: normalizeClass({ "is-selected": displayedHour.value === hour }),
                        role: "option",
                        "aria-selected": displayedHour.value === hour,
                        onClick: ($event) => selectHour(hour)
                      }, toDisplayString(pad(hour)), 11, _hoisted_19);
                    }), 128))
                  ], 42, _hoisted_18),
                  createElementVNode("div", {
                    ref_key: "minuteColumnRef",
                    ref: minuteColumnRef,
                    "data-time-column": "minute",
                    class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "minute" }]),
                    role: "listbox",
                    "aria-label": resolvedLocale.value.minute,
                    onScroll: _cache[11] || (_cache[11] = ($event) => handleColumnScroll("minute", $event))
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(visibleMinuteOptions.value, (minute) => {
                      return openBlock(), createElementBlock("button", {
                        id: optionId("minute", minute),
                        key: minute,
                        type: "button",
                        tabindex: "-1",
                        "data-minute": minute,
                        disabled: isMinuteDisabled(minute),
                        class: normalizeClass({ "is-selected": activeDraft.value.minute === minute }),
                        role: "option",
                        "aria-selected": activeDraft.value.minute === minute,
                        onClick: ($event) => selectMinute(minute)
                      }, toDisplayString(pad(minute)), 11, _hoisted_21);
                    }), 128))
                  ], 42, _hoisted_20),
                  showSeconds.value ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    ref_key: "secondColumnRef",
                    ref: secondColumnRef,
                    "data-time-column": "second",
                    class: normalizeClass(["aheart-time-picker__column", { "is-keyboard-active": activeColumn.value === "second" }]),
                    role: "listbox",
                    "aria-label": resolvedLocale.value.second,
                    onScroll: _cache[12] || (_cache[12] = ($event) => handleColumnScroll("second", $event))
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSecondOptions.value, (second) => {
                      return openBlock(), createElementBlock("button", {
                        id: optionId("second", second),
                        key: second,
                        type: "button",
                        tabindex: "-1",
                        "data-second": second,
                        disabled: isSecondDisabled(second),
                        class: normalizeClass({ "is-selected": activeDraft.value.second === second }),
                        role: "option",
                        "aria-selected": activeDraft.value.second === second,
                        onClick: ($event) => selectSecond(second)
                      }, toDisplayString(pad(second)), 11, _hoisted_23);
                    }), 128))
                  ], 42, _hoisted_22)) : createCommentVNode("", true),
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
                        id: optionId("period", period),
                        key: period,
                        type: "button",
                        tabindex: "-1",
                        "data-period": period,
                        disabled: isPeriodDisabled(period),
                        class: normalizeClass({ "is-selected": selectedPeriod.value === period }),
                        role: "option",
                        "aria-selected": selectedPeriod.value === period,
                        onClick: ($event) => selectPeriod(period)
                      }, toDisplayString(period === "AM" ? resolvedLocale.value.am : resolvedLocale.value.pm), 11, _hoisted_25);
                    }), 64))
                  ], 10, _hoisted_24)) : createCommentVNode("", true)
                ]),
                _ctx.showNow || _ctx.needConfirm || _ctx.renderExtraFooter || unref(slots).footer ? (openBlock(), createElementBlock("footer", _hoisted_26, [
                  _ctx.showNow ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    type: "button",
                    disabled: isInteractionDisabled.value,
                    onClick: selectNow
                  }, toDisplayString(resolvedLocale.value.now), 9, _hoisted_27)) : createCommentVNode("", true),
                  renderSlot(_ctx.$slots, "footer", {}, () => [
                    _ctx.renderExtraFooter ? (openBlock(), createBlock(unref(ARenderNode), {
                      key: 0,
                      node: _ctx.renderExtraFooter()
                    }, null, 8, ["node"])) : createCommentVNode("", true)
                  ]),
                  _ctx.needConfirm ? (openBlock(), createElementBlock("button", {
                    key: 1,
                    class: "aheart-time-range-picker__confirm",
                    type: "button",
                    disabled: !rangeComplete.value || isInteractionDisabled.value,
                    onClick: confirmDraft
                  }, toDisplayString(resolvedLocale.value.ok), 9, _hoisted_28)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                createElementVNode("span", _hoisted_29, toDisplayString(liveMessage.value), 1)
              ], 8, _hoisted_16)
            ])
          ], 46, _hoisted_9)), [
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
