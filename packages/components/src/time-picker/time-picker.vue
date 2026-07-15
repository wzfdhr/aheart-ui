<template>
  <span ref="rootRef" class="aheart-time-picker" :class="rootClass">
    <span ref="triggerRef" class="aheart-time-picker__selector">
      <span v-if="hasPrefix" class="aheart-time-picker__prefix"><slot name="prefix"><ARenderNode :node="prefix" /></slot></span>
      <input
        ref="inputRef"
        class="aheart-time-picker__input"
        :id="id"
        :value="displayValue"
        :placeholder="resolvedPlaceholder"
        :disabled="isDisabled"
        :readonly="readOnly"
        role="combobox"
        :aria-labelledby="resolvedAriaLabelledby"
        :aria-describedby="describedBy ?? ariaDescribedby"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-controls="panelId"
        :aria-expanded="mergedOpen ? 'true' : 'false'"
        aria-haspopup="dialog"
        :aria-activedescendant="mergedOpen ? activeDescendantId : undefined"
        @focus="requestOpen(true)"
        @change="handleInputChange"
        @keydown="handleKeydown"
      />
      <button
        v-if="allowClear && displayValue && !isDisabled && !readOnly"
        class="aheart-time-picker__clear"
        type="button"
        :aria-label="resolvedLocale.clear"
        @click="clearValue"
      ><slot name="clearIcon"><ARenderNode v-if="clearIcon" :node="clearIcon" /><AIcon v-else name="close" :size="14" /></slot></button>
      <span class="aheart-time-picker__suffix" aria-hidden="true"><slot name="suffix"><ARenderNode v-if="suffixIcon" :node="suffixIcon" /><AIcon v-else name="clock" :size="16" /></slot></span>
    </span>

    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="motion.isMounted.value"
        v-show="motion.phase.value !== 'hidden'"
        ref="panelRef"
        :id="panelId"
        class="aheart-time-picker__panel"
        :class="panelClass"
        :style="panelStyle"
        role="dialog"
        :aria-label="resolvedLocale.selectTime"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
        @mousedown.prevent
      >
        <div class="aheart-time-picker__columns">
          <div ref="hourColumnRef" data-time-column="hour" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'hour' }" role="listbox" :aria-label="resolvedLocale.hour" @scroll="handleColumnScroll('hour', $event)">
            <button
              v-for="hour in visibleHourOptions"
              :key="hour"
              type="button"
              :id="getTimeOptionId('hour', hour)"
              :data-hour="hour"
              :disabled="isInteractionDisabled || isHourDisabled(hour)"
              tabindex="-1"
              :class="{ 'is-selected': displayedHour === hour }"
              role="option"
              :aria-selected="displayedHour === hour ? 'true' : 'false'"
              @click="selectHour(hour)"
            >{{ pad(hour) }}</button>
          </div>
          <div ref="minuteColumnRef" data-time-column="minute" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'minute' }" role="listbox" :aria-label="resolvedLocale.minute" @scroll="handleColumnScroll('minute', $event)">
            <button
              v-for="minute in visibleMinuteOptions"
              :key="minute"
              type="button"
              :id="getTimeOptionId('minute', minute)"
              :data-minute="minute"
              :disabled="isInteractionDisabled || isMinuteDisabled(minute)"
              tabindex="-1"
              :class="{ 'is-selected': draft.minute === minute }"
              role="option"
              :aria-selected="draft.minute === minute ? 'true' : 'false'"
              @click="selectMinute(minute)"
            >{{ pad(minute) }}</button>
          </div>
          <div v-if="showSeconds" ref="secondColumnRef" data-time-column="second" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'second' }" role="listbox" :aria-label="resolvedLocale.second" @scroll="handleColumnScroll('second', $event)">
            <button
              v-for="second in visibleSecondOptions"
              :key="second"
              type="button"
              :id="getTimeOptionId('second', second)"
              :data-second="second"
              :disabled="isInteractionDisabled || isSecondDisabled(second)"
              tabindex="-1"
              :class="{ 'is-selected': draft.second === second }"
              role="option"
              :aria-selected="draft.second === second ? 'true' : 'false'"
              @click="selectSecond(second)"
            >{{ pad(second) }}</button>
          </div>
          <div v-if="showPeriod" ref="periodColumnRef" data-time-column="period" class="aheart-time-picker__column aheart-time-picker__column--period" :class="{ 'is-keyboard-active': activeColumn === 'period' }" role="listbox" :aria-label="resolvedLocale.period">
            <button
              v-for="period in ['AM', 'PM'] as const"
              :key="period"
              type="button"
              :id="getTimeOptionId('period', period)"
              :data-period="period"
              :disabled="isInteractionDisabled || isPeriodDisabled(period)"
              tabindex="-1"
              :class="{ 'is-selected': selectedPeriod === period }"
              role="option"
              :aria-selected="selectedPeriod === period ? 'true' : 'false'"
              @click="selectPeriod(period)"
            >{{ period === 'AM' ? resolvedLocale.am : resolvedLocale.pm }}</button>
          </div>
        </div>
        <div v-if="showNow || needConfirm || renderExtraFooter || slots.footer" class="aheart-time-picker__footer">
          <button v-if="showNow" class="aheart-time-picker__now" type="button" :disabled="isInteractionDisabled" @click="selectNow">{{ resolvedLocale.now }}</button>
          <slot name="footer"><ARenderNode v-if="renderExtraFooter" :node="renderExtraFooter()" /></slot>
          <button v-if="needConfirm" class="aheart-time-picker__confirm" type="button" :disabled="isInteractionDisabled" @click="confirmValue">{{ resolvedLocale.ok }}</button>
        </div>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, isVNode, nextTick, ref, toRaw, useAttrs, useId, useSlots, watch, type Component, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig, zhCN } from '../config'
import AIcon from '../icon/icon.vue'
import { createTimeOptions, formatTimeValue, parseTimeValue, type PickerTimeParts } from '../picker-core/time'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { timePickerEmits, timePickerProps, type DisabledTimeConfig } from './types'
import './style.css'

defineOptions({ name: 'ATimePicker' })

type TimeParts = PickerTimeParts

type TimeColumn = 'hour' | 'minute' | 'second' | 'period'

const props = defineProps(timePickerProps)
const emit = defineEmits(timePickerEmits)
const attrs = useAttrs()
const slots = useSlots()
const config = useAheartConfig()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const hourColumnRef = ref<HTMLElement | null>(null)
const minuteColumnRef = ref<HTMLElement | null>(null)
const secondColumnRef = ref<HTMLElement | null>(null)
const periodColumnRef = ref<HTMLElement | null>(null)
const activeColumn = ref<TimeColumn>('hour')
const internalValue = ref(props.defaultValue)
const internalOpen = ref(props.defaultOpen)
const instanceId = useId().replace(/:/g, '')
const panelId = `aheart-time-${instanceId}-panel`
const isValueControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const isFormatProvided = usePropPresence('format')
const ARenderNode = defineComponent({
  name: 'ATimePickerRenderNode',
  props: { node: { type: null as unknown as PropType<VNodeChild | Component>, default: undefined } },
  setup(renderProps) {
    return () => {
      const node = renderProps.node
      const component = typeof node === 'function' || (typeof node === 'object' && node !== null && !Array.isArray(node) && !isVNode(node))
      return component ? h(toRaw(node as Component)) : node
    }
  }
})
const mergedValue = computed(() => isValueControlled.value ? props.modelValue : internalValue.value)
const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value))
const resolvedLocale = computed(() => ({ ...zhCN.timePicker, ...config.value.locale?.timePicker }) as Required<NonNullable<typeof zhCN.timePicker>>)
const resolvedPlaceholder = computed(() => props.placeholder ?? resolvedLocale.value.selectTime)
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? 'outlined')
const hasPrefix = computed(() => props.prefix !== undefined || Boolean(slots.prefix))
const rootClass = computed(() => [
  `aheart-time-picker--${resolvedSize.value}`,
  `aheart-time-picker--${resolvedVariant.value}`,
  props.status && `aheart-time-picker--${props.status}`,
  { 'is-open': mergedOpen.value, 'is-disabled': isDisabled.value }
])
const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs['aria-labelledby'] as string | undefined)
const resolvedFormat = computed(() => props.use12Hours && !isFormatProvided.value ? 'hh:mm:ss A' : props.format)
const meridiemLabels = computed(() => ({ am: resolvedLocale.value.am, pm: resolvedLocale.value.pm }))
const showSeconds = computed(() => resolvedFormat.value.includes('ss'))
const showPeriod = computed(() => props.use12Hours || resolvedFormat.value.includes('A'))
const pad = (value: number) => String(value).padStart(2, '0')
const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value))

const parseTime = (value?: string) => parseTimeValue(value, meridiemLabels.value)
const formatTime = (parts: TimeParts, format = resolvedFormat.value, localized = false) =>
  formatTimeValue(parts, format, localized ? meridiemLabels.value : undefined)

const initialParts = () => parseTime(mergedValue.value) ?? { hour: 0, minute: 0, second: 0 }
const draft = ref<TimeParts>(initialParts())
const draftHasValue = ref(Boolean(mergedValue.value))
const displayValue = computed(() => {
  if (mergedOpen.value && props.needConfirm && draftHasValue.value) return formatTime(draft.value, resolvedFormat.value, true)
  const parts = parseTime(mergedValue.value)
  return parts ? formatTime(parts, resolvedFormat.value, true) : mergedValue.value ?? ''
})
const displayedHour = computed(() => showPeriod.value ? draft.value.hour % 12 || 12 : draft.value.hour)
const selectedPeriod = computed<'AM' | 'PM'>(() => draft.value.hour >= 12 ? 'PM' : 'AM')
const isInteractionDisabled = computed(() => isDisabled.value || props.readOnly)
const hourOptions = computed(() => showPeriod.value
  ? createTimeOptions(12, props.hourStep).map((hour) => hour || 12)
  : createTimeOptions(24, props.hourStep))
const minuteOptions = computed(() => createTimeOptions(60, props.minuteStep))
const secondOptions = computed(() => createTimeOptions(60, props.secondStep))
const visibleHourOptions = computed(() => props.hideDisabledOptions ? hourOptions.value.filter((value) => !isHourDisabled(value)) : hourOptions.value)
const visibleMinuteOptions = computed(() => props.hideDisabledOptions ? minuteOptions.value.filter((value) => !isMinuteDisabled(value)) : minuteOptions.value)
const visibleSecondOptions = computed(() => props.hideDisabledOptions ? secondOptions.value.filter((value) => !isSecondDisabled(value)) : secondOptions.value)
const visibleColumns = computed<TimeColumn[]>(() => [
  'hour',
  'minute',
  ...(showSeconds.value ? ['second' as const] : []),
  ...(showPeriod.value ? ['period' as const] : [])
])
const getTimeOptionId = (column: TimeColumn, value: number | string) => `aheart-time-${instanceId}-${column}-${String(value).toLowerCase()}`
const activeDescendantId = computed(() => {
  if (activeColumn.value === 'hour') return visibleHourOptions.value.includes(displayedHour.value) ? getTimeOptionId('hour', displayedHour.value) : undefined
  if (activeColumn.value === 'minute') return visibleMinuteOptions.value.includes(draft.value.minute) ? getTimeOptionId('minute', draft.value.minute) : undefined
  if (activeColumn.value === 'second') return visibleSecondOptions.value.includes(draft.value.second) ? getTimeOptionId('second', draft.value.second) : undefined
  return getTimeOptionId('period', selectedPeriod.value)
})

const disabledConfig = computed<DisabledTimeConfig | undefined>(() => {
  if (!props.disabledTime) return undefined
  if (typeof props.disabledTime === 'object') return props.disabledTime
  if (props.disabledTime.length === 0) return (props.disabledTime as () => DisabledTimeConfig)()
  return undefined
})
const legacyDisabled = computed(() =>
  typeof props.disabledTime === 'function' && props.disabledTime.length > 0
    ? props.disabledTime as (value: string) => boolean
    : undefined
)
const isLegacyDisabled = (parts: TimeParts) => {
  if (!legacyDisabled.value) return false
  return legacyDisabled.value(formatTime(parts, props.valueFormat)) || legacyDisabled.value(formatTime(parts, 'HH:mm'))
}
const isPartsDisabled = (parts: TimeParts) => Boolean(
  disabledConfig.value?.disabledHours?.().includes(parts.hour) ||
  disabledConfig.value?.disabledMinutes?.(parts.hour).includes(parts.minute) ||
  disabledConfig.value?.disabledSeconds?.(parts.hour, parts.minute).includes(parts.second) ||
  isLegacyDisabled(parts)
)
const toHour24 = (hour: number) => showPeriod.value
  ? hour % 12 + (selectedPeriod.value === 'PM' ? 12 : 0)
  : hour
const isHourDisabled = (hour: number) => {
  const hour24 = toHour24(hour)
  return Boolean(disabledConfig.value?.disabledHours?.().includes(hour24)) || isLegacyDisabled({ ...draft.value, hour: hour24 })
}
const isMinuteDisabled = (minute: number) =>
  Boolean(disabledConfig.value?.disabledMinutes?.(draft.value.hour).includes(minute)) || isLegacyDisabled({ ...draft.value, minute })
const isSecondDisabled = (second: number) =>
  Boolean(disabledConfig.value?.disabledSeconds?.(draft.value.hour, draft.value.minute).includes(second)) || isLegacyDisabled({ ...draft.value, second })
const isPeriodDisabled = (period: 'AM' | 'PM') => {
  const hour12 = draft.value.hour % 12
  return isPartsDisabled({ ...draft.value, hour: hour12 + (period === 'PM' ? 12 : 0) })
}

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) return props.getPopupContainer(triggerRef.value)
  return typeof document === 'undefined' ? false : document.body
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => popupContainer.value === false ? 'body' : popupContainer.value)
const floatingPosition = useFloatingPosition({
  reference: triggerRef,
  floating: panelRef,
  open: () => motion.isMounted.value && motion.phase.value !== 'hidden',
  placement: () => props.placement,
  strategy: 'fixed',
  offset: 4,
  autoAdjustOverflow: () => props.autoAdjustOverflow
})
const panelClass = computed(() => [
  `aheart-floating--${floatingPosition.placement.value}`,
  `is-${motion.phase.value}`
])
const panelStyle = computed(() => floatingPosition.popupStyle.value)

const syncDraft = () => {
  draft.value = initialParts()
  draftHasValue.value = Boolean(mergedValue.value)
}
const scrollSelectedOptionsIntoView = () => {
  for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value]) {
    column?.querySelector<HTMLElement>('.is-selected')?.scrollIntoView?.({ block: 'center' })
  }
}
const requestOpen = (open: boolean) => {
  if (open && isInteractionDisabled.value) return
  if (!isOpenControlled.value) internalOpen.value = open
  emit('openChange', open)
  if (open) {
    syncDraft()
    activeColumn.value = 'hour'
  }
}
const commitValue = (parts: TimeParts, close = true) => {
  if (isInteractionDisabled.value || isPartsDisabled(parts)) return false
  const value = formatTime(parts, props.valueFormat)
  if (!isValueControlled.value) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  if (isValueControlled.value && !props.needConfirm) syncDraft()
  if (close) requestOpen(false)
  return true
}
const selectHour = (hour: number) => {
  if (isInteractionDisabled.value || isHourDisabled(hour)) return
  draft.value = { ...draft.value, hour: toHour24(hour) }
  draftHasValue.value = true
  if (!props.needConfirm) commitValue(draft.value, false)
}
const selectMinute = (minute: number) => {
  if (isInteractionDisabled.value || isMinuteDisabled(minute)) return
  draft.value = { ...draft.value, minute }
  draftHasValue.value = true
  if (!props.needConfirm) commitValue(draft.value, false)
}
const selectSecond = (second: number) => {
  if (isInteractionDisabled.value || isSecondDisabled(second)) return
  draft.value = { ...draft.value, second }
  draftHasValue.value = true
  if (!props.needConfirm) commitValue(draft.value, false)
}
const selectPeriod = (period: 'AM' | 'PM') => {
  if (isInteractionDisabled.value || isPeriodDisabled(period)) return
  const hour12 = draft.value.hour % 12
  draft.value = { ...draft.value, hour: hour12 + (period === 'PM' ? 12 : 0) }
  draftHasValue.value = true
  if (!props.needConfirm) commitValue(draft.value, false)
}
const confirmValue = () => commitValue(draft.value)
const selectNow = () => {
  if (isInteractionDisabled.value) return
  const now = new Date()
  const next = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() }
  if (isPartsDisabled(next)) return
  draft.value = next
  draftHasValue.value = true
  if (!props.needConfirm) commitValue(draft.value)
}
const clearValue = () => {
  if (isInteractionDisabled.value) return
  if (!isValueControlled.value) internalValue.value = undefined
  emit('update:modelValue', undefined)
  emit('change', undefined)
  emit('clear')
  requestOpen(false)
}
const handleInputChange = (event: Event) => {
  if (isInteractionDisabled.value) return
  const input = event.target as HTMLInputElement
  const value = input.value.trim()
  if (!value) return clearValue()
  const parts = parseTime(value)
  if (!parts || isPartsDisabled(parts)) {
    emit('invalid', value)
    input.value = displayValue.value
  } else if (props.needConfirm) {
    draft.value = parts
    draftHasValue.value = true
    input.value = formatTime(parts, resolvedFormat.value, true)
  } else if (!commitValue(parts)) {
    emit('invalid', value)
    input.value = displayValue.value
  }
}
let scrollTimer: ReturnType<typeof setTimeout> | undefined
const handleColumnScroll = (column: 'hour' | 'minute' | 'second', event: Event) => {
  if (!props.changeOnScroll || isInteractionDisabled.value) return
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const options = column === 'hour' ? visibleHourOptions.value : column === 'minute' ? visibleMinuteOptions.value : visibleSecondOptions.value
    const value = options[Math.max(0, Math.min(options.length - 1, Math.round((event.target as HTMLElement).scrollTop / 28)))]
    if (value === undefined) return
    const next = column === 'hour'
      ? { ...draft.value, hour: toHour24(value) }
      : column === 'minute'
        ? { ...draft.value, minute: value }
        : { ...draft.value, second: value }
    draft.value = next
    draftHasValue.value = true
    if (!props.needConfirm) commitValue(next, false)
  }, 0)
}
const moveToOption = <T>(options: T[], current: T, direction: 1 | -1, disabled: (option: T) => boolean, apply: (option: T) => void) => {
  if (!options.length) return
  let index = Math.max(0, options.indexOf(current))
  for (let attempt = 0; attempt < options.length; attempt += 1) {
    index = (index + direction + options.length) % options.length
    const option = options[index]
    if (!disabled(option)) {
      apply(option)
      return
    }
  }
}
const moveActiveColumn = (direction: 1 | -1) => {
  const index = visibleColumns.value.indexOf(activeColumn.value)
  activeColumn.value = visibleColumns.value[(index + direction + visibleColumns.value.length) % visibleColumns.value.length]
}
const moveActiveValue = (direction: 1 | -1) => {
  if (activeColumn.value === 'hour') {
    moveToOption(visibleHourOptions.value, displayedHour.value, direction, isHourDisabled, selectHour)
  } else if (activeColumn.value === 'minute') {
    moveToOption(visibleMinuteOptions.value, draft.value.minute, direction, isMinuteDisabled, selectMinute)
  } else if (activeColumn.value === 'second') {
    moveToOption(visibleSecondOptions.value, draft.value.second, direction, isSecondDisabled, selectSecond)
  } else {
    moveToOption<Array<'AM' | 'PM'>[number]>(['AM', 'PM'], selectedPeriod.value, direction, isPeriodDisabled, selectPeriod)
  }
  void nextTick(scrollSelectedOptionsIntoView)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => inputRef.value?.focus())
    return
  }
  if (isInteractionDisabled.value) return
  if (!mergedOpen.value && event.key === 'ArrowDown') {
    event.preventDefault()
    requestOpen(true)
  } else if (mergedOpen.value && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault()
    moveActiveColumn(event.key === 'ArrowRight' ? 1 : -1)
  } else if (mergedOpen.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault()
    moveActiveValue(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && mergedOpen.value) {
    event.preventDefault()
    confirmValue()
  }
}

useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: panelRef,
  onDismiss: () => requestOpen(false)
})

watch(mergedValue, syncDraft)
watch(mergedOpen, (open) => {
  if (open) void nextTick(scrollSelectedOptionsIntoView)
}, { immediate: true })
watch(() => props.defaultOpen, (open) => {
  if (!isOpenControlled.value) internalOpen.value = open
})
</script>
