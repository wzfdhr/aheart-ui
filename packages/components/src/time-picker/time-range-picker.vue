<template>
  <span ref="rootRef" class="aheart-time-range-picker" :class="rootClass">
    <span ref="triggerRef" class="aheart-time-range-picker__selector" @mousedown="handleSelectorMouseDown">
      <span v-if="hasPrefix" class="aheart-time-range-picker__prefix"><slot name="prefix"><ARenderNode :node="prefix" /></slot></span>
      <span class="aheart-time-range-picker__field" :class="{ 'is-active': activePart === 'start' && mergedOpen }">
        <input :id="id ? `${id}-start` : undefined" data-range-part="start" role="combobox" aria-haspopup="dialog" :aria-labelledby="labelledBy ?? ariaLabelledby" :aria-controls="panelId" :aria-expanded="mergedOpen" :aria-activedescendant="mergedOpen && activePart === 'start' ? activeDescendantId : undefined" :value="displayValue(0)" :placeholder="resolvedPlaceholders[0]" :disabled="isDisabled" :readonly="readOnly" @focus="activatePart('start')" @change="commitInput('start', $event)" @keydown="handleKeydown" />
        <button v-if="allowClear && mergedOpen && draftValue?.[0] && allowEmpty[0] && !isInteractionDisabled" data-range-clear="start" type="button" :aria-label="resolvedLocale.clearStart" @click.stop="clearPart('start')"><slot name="clearIcon"><ARenderNode v-if="clearIcon" :node="clearIcon" /><AIcon v-else name="close" :size="12" /></slot></button>
      </span>
      <span class="aheart-time-range-picker__separator"><slot name="separator"><ARenderNode v-if="separator" :node="separator" /><AIcon v-else name="arrow-right" :size="14" /></slot></span>
      <span class="aheart-time-range-picker__field" :class="{ 'is-active': activePart === 'end' && mergedOpen }">
        <input :id="id ? `${id}-end` : undefined" data-range-part="end" role="combobox" aria-haspopup="dialog" :aria-labelledby="labelledBy ?? ariaLabelledby" :aria-controls="panelId" :aria-expanded="mergedOpen" :aria-activedescendant="mergedOpen && activePart === 'end' ? activeDescendantId : undefined" :value="displayValue(1)" :placeholder="resolvedPlaceholders[1]" :disabled="isDisabled" :readonly="readOnly" @focus="activatePart('end')" @change="commitInput('end', $event)" @keydown="handleKeydown" />
        <button v-if="allowClear && mergedOpen && draftValue?.[1] && allowEmpty[1] && !isInteractionDisabled" data-range-clear="end" type="button" :aria-label="resolvedLocale.clearEnd" @click.stop="clearPart('end')"><slot name="clearIcon"><ARenderNode v-if="clearIcon" :node="clearIcon" /><AIcon v-else name="close" :size="12" /></slot></button>
      </span>
      <button v-if="allowClear && hasRangeValue && !isInteractionDisabled" class="aheart-time-range-picker__clear" data-range-clear="all" type="button" :aria-label="resolvedLocale.clearRange" @click.stop="clearRange"><slot name="clearIcon"><ARenderNode v-if="clearIcon" :node="clearIcon" /><AIcon v-else name="close" :size="12" /></slot></button>
      <span class="aheart-time-range-picker__suffix" aria-hidden="true"><slot name="suffix"><ARenderNode v-if="suffixIcon" :node="suffixIcon" /><AIcon v-else name="clock" :size="16" /></slot></span>
    </span>

    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div v-if="motion.isMounted.value" v-show="motion.phase.value !== 'hidden'" ref="panelRef" :id="panelId" class="aheart-time-range-picker__panel" :class="panelClass" :style="panelStyle" role="dialog" :aria-label="`${resolvedPlaceholders[0]} - ${resolvedPlaceholders[1]}`" @mousedown.prevent>
        <aside v-if="presets?.length" class="aheart-time-range-picker__presets" :aria-label="resolvedLocale.selectTime">
          <button v-for="(preset, index) in presets" :key="index" type="button" :data-preset-index="index" :disabled="isInteractionDisabled" @click="selectPreset(index)"><ARenderNode :node="preset.label" /></button>
        </aside>
        <div class="aheart-time-range-picker__body">
          <div class="aheart-time-range-picker__part-tabs" role="tablist">
            <button :id="startTabId" type="button" role="tab" :aria-controls="partPanelId" :aria-selected="activePart === 'start'" :tabindex="activePart === 'start' ? 0 : -1" @click="activatePart('start')" @keydown="handlePartTabKeydown('start', $event)">{{ resolvedPlaceholders[0] }}</button>
            <button :id="endTabId" type="button" role="tab" :aria-controls="partPanelId" :aria-selected="activePart === 'end'" :tabindex="activePart === 'end' ? 0 : -1" @click="activatePart('end')" @keydown="handlePartTabKeydown('end', $event)">{{ resolvedPlaceholders[1] }}</button>
          </div>
          <div :id="partPanelId" role="tabpanel" :aria-labelledby="activePart === 'start' ? startTabId : endTabId">
          <div class="aheart-time-picker__columns">
            <div ref="hourColumnRef" data-time-column="hour" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'hour' }" role="listbox" :aria-label="resolvedLocale.hour" @scroll="handleColumnScroll('hour', $event)">
              <button v-for="hour in visibleHourOptions" :id="optionId('hour', hour)" :key="hour" type="button" tabindex="-1" :data-hour="hour" :disabled="isHourDisabled(hour)" :class="{ 'is-selected': displayedHour === hour }" role="option" :aria-selected="displayedHour === hour" @click="selectHour(hour)">{{ pad(hour) }}</button>
            </div>
            <div ref="minuteColumnRef" data-time-column="minute" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'minute' }" role="listbox" :aria-label="resolvedLocale.minute" @scroll="handleColumnScroll('minute', $event)">
              <button v-for="minute in visibleMinuteOptions" :id="optionId('minute', minute)" :key="minute" type="button" tabindex="-1" :data-minute="minute" :disabled="isMinuteDisabled(minute)" :class="{ 'is-selected': activeDraft.minute === minute }" role="option" :aria-selected="activeDraft.minute === minute" @click="selectMinute(minute)">{{ pad(minute) }}</button>
            </div>
            <div v-if="showSeconds" ref="secondColumnRef" data-time-column="second" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'second' }" role="listbox" :aria-label="resolvedLocale.second" @scroll="handleColumnScroll('second', $event)">
              <button v-for="second in visibleSecondOptions" :id="optionId('second', second)" :key="second" type="button" tabindex="-1" :data-second="second" :disabled="isSecondDisabled(second)" :class="{ 'is-selected': activeDraft.second === second }" role="option" :aria-selected="activeDraft.second === second" @click="selectSecond(second)">{{ pad(second) }}</button>
            </div>
            <div v-if="showPeriod" ref="periodColumnRef" data-time-column="period" class="aheart-time-picker__column aheart-time-picker__column--period" :class="{ 'is-keyboard-active': activeColumn === 'period' }" role="listbox" :aria-label="resolvedLocale.period">
              <button v-for="period in ['AM', 'PM'] as const" :id="optionId('period', period)" :key="period" type="button" tabindex="-1" :data-period="period" :disabled="isPeriodDisabled(period)" :class="{ 'is-selected': selectedPeriod === period }" role="option" :aria-selected="selectedPeriod === period" @click="selectPeriod(period)">{{ period === 'AM' ? resolvedLocale.am : resolvedLocale.pm }}</button>
            </div>
          </div>
          <footer v-if="showNow || needConfirm || renderExtraFooter || slots.footer" class="aheart-time-range-picker__footer">
          <button v-if="showNow" type="button" :disabled="isInteractionDisabled" @click="selectNow">{{ resolvedLocale.now }}</button>
            <slot name="footer"><ARenderNode v-if="renderExtraFooter" :node="renderExtraFooter()" /></slot>
            <button v-if="needConfirm" class="aheart-time-range-picker__confirm" type="button" :disabled="!rangeComplete || isInteractionDisabled" @click="confirmDraft">{{ resolvedLocale.ok }}</button>
          </footer>
          <span class="aheart-time-range-picker__live" aria-live="polite">{{ liveMessage }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, isVNode, nextTick, ref, toRaw, useId, useSlots, watch, type Component, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig, zhCN } from '../config'
import AIcon from '../icon/icon.vue'
import { createTimeOptions, formatTimeValue, parseTimeValue, timePartsToSeconds, type PickerTimeParts } from '../picker-core/time'
import type { PickerDisabledTimeConfig, RangePickerPart, RangePickerValue } from '../picker-core/types'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { timeRangePickerEmits, timeRangePickerProps } from './types'
import './style.css'

defineOptions({ name: 'ATimeRangePicker' })

const props = defineProps(timeRangePickerProps)
const emit = defineEmits(timeRangePickerEmits)
const slots = useSlots()
const config = useAheartConfig()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const hourColumnRef = ref<HTMLElement | null>(null)
const minuteColumnRef = ref<HTMLElement | null>(null)
const secondColumnRef = ref<HTMLElement | null>(null)
const periodColumnRef = ref<HTMLElement | null>(null)
const internalValue = ref<RangePickerValue>(props.defaultValue ? [...props.defaultValue] as RangePickerValue : undefined)
const internalOpen = ref(props.defaultOpen)
const activePart = ref<RangePickerPart>('start')
type TimeColumn = 'hour' | 'minute' | 'second' | 'period'
const activeColumn = ref<TimeColumn>('hour')
const draftValue = ref<RangePickerValue>()
const draftParts = ref<[PickerTimeParts, PickerTimeParts]>([{ hour: 0, minute: 0, second: 0 }, { hour: 0, minute: 0, second: 0 }])
const liveMessage = ref('')
const panelId = `aheart-time-range-${useId().replace(/:/g, '')}-panel`
const instanceId = panelId.replace('-panel', '')
const partPanelId = `${instanceId}-part-panel`
const startTabId = `${instanceId}-start-tab`
const endTabId = `${instanceId}-end-tab`
const isValueControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const isFormatProvided = usePropPresence('format')

const ARenderNode = defineComponent({
  name: 'ATimeRangePickerRenderNode',
  props: { node: { type: null as unknown as PropType<VNodeChild | Component>, default: undefined } },
  setup(renderProps) {
    return () => {
      const node = renderProps.node
      const component = typeof node === 'function' || (typeof node === 'object' && node !== null && !Array.isArray(node) && !isVNode(node))
      return component ? h(toRaw(node as Component)) : node
    }
  }
})

const mergedValue = computed<RangePickerValue>(() => isValueControlled.value ? props.modelValue : internalValue.value)
const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value))
const resolvedLocale = computed(() => ({ ...zhCN.timePicker, ...config.value.locale?.timePicker }) as Required<NonNullable<typeof zhCN.timePicker>>)
const resolvedPlaceholders = computed<[string, string]>(() => props.placeholder ?? [resolvedLocale.value.startTime, resolvedLocale.value.endTime])
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isInteractionDisabled = computed(() => isDisabled.value || props.readOnly)
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? 'outlined')
const hasPrefix = computed(() => props.prefix !== undefined || Boolean(slots.prefix))
const rootClass = computed(() => [`aheart-time-range-picker--${resolvedSize.value}`, `aheart-time-range-picker--${resolvedVariant.value}`, props.status && `aheart-time-range-picker--${props.status}`, { 'is-open': mergedOpen.value, 'is-disabled': isDisabled.value }])
const resolvedFormat = computed(() => props.use12Hours && !isFormatProvided.value ? 'hh:mm:ss A' : props.format)
const meridiemLabels = computed(() => ({ am: resolvedLocale.value.am, pm: resolvedLocale.value.pm }))
const showSeconds = computed(() => resolvedFormat.value.includes('ss'))
const showPeriod = computed(() => props.use12Hours || resolvedFormat.value.includes('A'))
const activeIndex = computed(() => activePart.value === 'start' ? 0 : 1)
const activeDraft = computed(() => draftParts.value[activeIndex.value])
const displayedHour = computed(() => showPeriod.value ? activeDraft.value.hour % 12 || 12 : activeDraft.value.hour)
const selectedPeriod = computed<'AM' | 'PM'>(() => activeDraft.value.hour >= 12 ? 'PM' : 'AM')
const visibleColumns = computed<TimeColumn[]>(() => ['hour', 'minute', ...(showSeconds.value ? ['second' as const] : []), ...(showPeriod.value ? ['period' as const] : [])])
const optionId = (column: TimeColumn, value: number | string) => `${instanceId}-${column}-${String(value).toLowerCase()}`
const activeDescendantId = computed(() => activeColumn.value === 'hour'
  ? visibleHourOptions.value.includes(displayedHour.value) ? optionId('hour', displayedHour.value) : undefined
  : activeColumn.value === 'minute'
    ? visibleMinuteOptions.value.includes(activeDraft.value.minute) ? optionId('minute', activeDraft.value.minute) : undefined
    : activeColumn.value === 'second'
      ? visibleSecondOptions.value.includes(activeDraft.value.second) ? optionId('second', activeDraft.value.second) : undefined
      : optionId('period', selectedPeriod.value))
const pad = (value: number) => String(value).padStart(2, '0')
const parseTime = (value?: string) => parseTimeValue(value, meridiemLabels.value)
const formatDisplayTime = (parts: PickerTimeParts) => formatTimeValue(parts, resolvedFormat.value, meridiemLabels.value)

const displayValue = (index: number) => {
  const source = mergedOpen.value ? draftValue.value : mergedValue.value
  const parts = parseTime(source?.[index])
  return parts ? formatDisplayTime(parts) : source?.[index] ?? ''
}
const hasRangeValue = computed(() => Boolean((mergedOpen.value ? draftValue.value : mergedValue.value)?.some(Boolean)))
const syncDraft = () => {
  draftValue.value = mergedValue.value ? [...mergedValue.value] as RangePickerValue : undefined
  draftParts.value = [parseTime(draftValue.value?.[0]) ?? { hour: 0, minute: 0, second: 0 }, parseTime(draftValue.value?.[1]) ?? { hour: 0, minute: 0, second: 0 }]
}
watch(mergedValue, () => { if (mergedOpen.value) syncDraft() }, { deep: true })

const normalizeRange = (value: RangePickerValue) => {
  if (!value) return undefined
  const next: [string | undefined, string | undefined] = [value[0], value[1]]
  if ((!next[0] && !props.allowEmpty[0]) || (!next[1] && !props.allowEmpty[1])) return undefined
  const start = parseTime(next[0])
  const end = parseTime(next[1])
  if ((next[0] && !start) || (next[1] && !end)) return undefined
  if (props.order && start && end && timePartsToSeconds(start) > timePartsToSeconds(end)) return [next[1], next[0]] as RangePickerValue
  return next as RangePickerValue
}
const rangeComplete = computed(() => Boolean((draftValue.value?.[0] || props.allowEmpty[0]) && (draftValue.value?.[1] || props.allowEmpty[1]) && (draftValue.value?.[0] || draftValue.value?.[1])))

const disabledResult = (parts: PickerTimeParts, part = activePart.value) => {
  if (!props.disabledTime) return false
  const value = formatTimeValue(parts, props.valueFormat)
  if (typeof props.disabledTime === 'object') return props.disabledTime
  return props.disabledTime(value, part)
}
const isPartsDisabled = (parts: PickerTimeParts, part = activePart.value) => {
  const result = disabledResult(parts, part)
  if (typeof result === 'boolean') return result
  const rules = result as PickerDisabledTimeConfig
  return Boolean(rules.disabledHours?.().includes(parts.hour) || rules.disabledMinutes?.(parts.hour).includes(parts.minute) || rules.disabledSeconds?.(parts.hour, parts.minute).includes(parts.second))
}
const hourOptions = computed(() => showPeriod.value ? createTimeOptions(12, props.hourStep).map((hour) => hour || 12) : createTimeOptions(24, props.hourStep))
const minuteOptions = computed(() => createTimeOptions(60, props.minuteStep))
const secondOptions = computed(() => createTimeOptions(60, props.secondStep))
const candidateHour = (hour: number) => showPeriod.value ? hour % 12 + (selectedPeriod.value === 'PM' ? 12 : 0) : hour
const isHourDisabled = (hour: number) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, hour: candidateHour(hour) })
const isMinuteDisabled = (minute: number) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, minute })
const isSecondDisabled = (second: number) => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, second })
const isPeriodDisabled = (period: 'AM' | 'PM') => isInteractionDisabled.value || isPartsDisabled({ ...activeDraft.value, hour: activeDraft.value.hour % 12 + (period === 'PM' ? 12 : 0) })
const visibleHourOptions = computed(() => props.hideDisabledOptions ? hourOptions.value.filter((value) => !isHourDisabled(value)) : hourOptions.value)
const visibleMinuteOptions = computed(() => props.hideDisabledOptions ? minuteOptions.value.filter((value) => !isMinuteDisabled(value)) : minuteOptions.value)
const visibleSecondOptions = computed(() => props.hideDisabledOptions ? secondOptions.value.filter((value) => !isSecondDisabled(value)) : secondOptions.value)

const updateActiveDraft = (parts: PickerTimeParts) => {
  if (isInteractionDisabled.value) return
  const nextParts = [...draftParts.value] as [PickerTimeParts, PickerTimeParts]
  nextParts[activeIndex.value] = parts
  draftParts.value = nextParts
  const next: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
  next[activeIndex.value] = formatTimeValue(parts, props.valueFormat)
  draftValue.value = next
  emit('calendarChange', [...next] as RangePickerValue, { range: activePart.value })
  updateLiveMessage(next)
  if (!props.needConfirm) commitRange(next, false)
}
const selectHour = (hour: number) => { if (!isHourDisabled(hour)) updateActiveDraft({ ...activeDraft.value, hour: candidateHour(hour) }) }
const selectMinute = (minute: number) => { if (!isMinuteDisabled(minute)) updateActiveDraft({ ...activeDraft.value, minute }) }
const selectSecond = (second: number) => { if (!isSecondDisabled(second)) updateActiveDraft({ ...activeDraft.value, second }) }
const selectPeriod = (period: 'AM' | 'PM') => updateActiveDraft({ ...activeDraft.value, hour: activeDraft.value.hour % 12 + (period === 'PM' ? 12 : 0) })
const moveToOption = <T>(options: T[], current: T, direction: 1 | -1, disabled: (value: T) => boolean, apply: (value: T) => void) => {
  let index = Math.max(0, options.indexOf(current))
  for (let attempt = 0; attempt < options.length; attempt += 1) {
    index = (index + direction + options.length) % options.length
    const value = options[index]
    if (value !== undefined && !disabled(value)) { apply(value); return }
  }
}
const moveActiveColumn = (direction: 1 | -1) => {
  const index = visibleColumns.value.indexOf(activeColumn.value)
  activeColumn.value = visibleColumns.value[(index + direction + visibleColumns.value.length) % visibleColumns.value.length]!
}
const moveActiveValue = (direction: 1 | -1) => {
  if (activeColumn.value === 'hour') moveToOption(visibleHourOptions.value, displayedHour.value, direction, isHourDisabled, selectHour)
  else if (activeColumn.value === 'minute') moveToOption(visibleMinuteOptions.value, activeDraft.value.minute, direction, isMinuteDisabled, selectMinute)
  else if (activeColumn.value === 'second') moveToOption(visibleSecondOptions.value, activeDraft.value.second, direction, isSecondDisabled, selectSecond)
  else moveToOption<Array<'AM' | 'PM'>[number]>(['AM', 'PM'], selectedPeriod.value, direction, isPeriodDisabled, selectPeriod)
  void nextTick(scrollSelectedOptionsIntoView)
}
const scrollSelectedOptionsIntoView = () => {
  for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value]) column?.querySelector<HTMLElement>('.is-selected')?.scrollIntoView?.({ block: 'center' })
}
let scrollTimer: ReturnType<typeof setTimeout> | undefined
const handleColumnScroll = (column: 'hour' | 'minute' | 'second', event: Event) => {
  if (!props.changeOnScroll || isInteractionDisabled.value) return
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const options = column === 'hour' ? visibleHourOptions.value : column === 'minute' ? visibleMinuteOptions.value : visibleSecondOptions.value
    const value = options[Math.max(0, Math.min(options.length - 1, Math.round((event.target as HTMLElement).scrollTop / 28)))]
    if (value === undefined) return
    if (column === 'hour') selectHour(value)
    else if (column === 'minute') selectMinute(value)
    else selectSecond(value)
  }, 0)
}

const commitRange = (value: RangePickerValue, close = true) => {
  if (isInteractionDisabled.value) return false
  if (!value) {
    if (!isValueControlled.value) internalValue.value = undefined
    emit('update:modelValue', undefined)
    emit('change', undefined)
    if (close) requestOpen(false)
    return true
  }
  const normalized = normalizeRange(value)
  if (!normalized) return false
  for (const [index, endpoint] of normalized.entries()) {
    const parts = parseTime(endpoint)
    if (parts && isPartsDisabled(parts, index === 0 ? 'start' : 'end')) return false
  }
  if (!isValueControlled.value) internalValue.value = [...normalized] as RangePickerValue
  emit('update:modelValue', normalized)
  emit('change', normalized)
  if (isValueControlled.value && !props.needConfirm) syncDraft()
  if (close) requestOpen(false)
  return true
}
const commitInput = (part: RangePickerPart, event: Event) => {
  if (isInteractionDisabled.value) return
  const inputElement = event.target as HTMLInputElement
  const inputValue = inputElement.value.trim()
  const index = part === 'start' ? 0 : 1
  if (!inputValue) {
    if (!props.allowEmpty[index]) { emit('invalid', inputValue, part); inputElement.value = displayValue(index); return }
    const next: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
    next[index] = undefined
    draftValue.value = next
    emit('calendarChange', [...next] as RangePickerValue, { range: part })
    if (!props.needConfirm) commitRange(next, false)
    return
  }
  const parts = parseTime(inputValue)
  if (!parts || isPartsDisabled(parts, part)) { emit('invalid', inputValue, part); inputElement.value = displayValue(index); return }
  const next: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
  next[index] = formatTimeValue(parts, props.valueFormat)
  draftValue.value = next
  const nextParts = [...draftParts.value] as [PickerTimeParts, PickerTimeParts]
  nextParts[index] = parts
  draftParts.value = nextParts
  emit('calendarChange', [...next] as RangePickerValue, { range: part })
  if (!props.needConfirm && !commitRange(next, false)) emit('invalid', inputValue, part)
}
const confirmDraft = () => {
  const normalized = normalizeRange(draftValue.value)
  if (!normalized || !commitRange(normalized)) return
  emit('ok', normalized)
}
const clearPart = (part: RangePickerPart) => {
  if (isInteractionDisabled.value) return
  const index = part === 'start' ? 0 : 1
  const next: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
  next[index] = undefined
  draftValue.value = next
  emit('calendarChange', [...next] as RangePickerValue, { range: part })
  updateLiveMessage(next)
  if (!props.needConfirm) commitRange(next, false)
  emit('clear')
}
const clearRange = () => {
  if (isInteractionDisabled.value) return
  draftValue.value = undefined
  if (commitRange(undefined)) emit('clear')
}
const selectPreset = (index: number) => {
  if (isInteractionDisabled.value) return
  const preset = props.presets?.[index]
  if (!preset) return
  const value = typeof preset.value === 'function' ? preset.value() : preset.value
  for (const [endpointIndex, endpoint] of (value ?? []).entries()) {
    const part: RangePickerPart = endpointIndex === 0 ? 'start' : 'end'
    const parts = parseTime(endpoint)
    if (endpoint && (!parts || isPartsDisabled(parts, part))) { emit('invalid', endpoint, part); return }
  }
  draftValue.value = value ? [...value] as RangePickerValue : undefined
  draftParts.value = [parseTime(value?.[0]) ?? { hour: 0, minute: 0, second: 0 }, parseTime(value?.[1]) ?? { hour: 0, minute: 0, second: 0 }]
  if (props.needConfirm) {
    emit('calendarChange', draftValue.value, { range: activePart.value })
    updateLiveMessage(draftValue.value)
  } else commitRange(draftValue.value)
}
const selectNow = () => {
  if (isInteractionDisabled.value) return
  const now = new Date()
  const next = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() }
  if (!isPartsDisabled(next)) updateActiveDraft(next)
}

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => props.getPopupContainer && triggerRef.value ? props.getPopupContainer(triggerRef.value) : typeof document === 'undefined' ? false : document.body)
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => popupContainer.value === false ? 'body' : popupContainer.value)
const floatingPosition = useFloatingPosition({ reference: triggerRef, floating: panelRef, open: () => motion.isMounted.value && motion.phase.value !== 'hidden', placement: () => props.placement, strategy: 'fixed', offset: 4, autoAdjustOverflow: () => props.autoAdjustOverflow })
const panelClass = computed(() => [`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`, { 'has-presets': props.presets?.length }])
const panelStyle = computed(() => floatingPosition.popupStyle.value)
const requestOpen = (open: boolean) => {
  if (open && isInteractionDisabled.value) return
  const wasOpen = mergedOpen.value
  if (!isOpenControlled.value) internalOpen.value = open
  emit('openChange', open)
  if (open && !wasOpen) syncDraft()
}
const updateLiveMessage = (value: RangePickerValue) => {
  if (value?.[0] && value[1]) liveMessage.value = resolvedLocale.value.rangeComplete(value[0], value[1])
  else if (value?.[0]) liveMessage.value = resolvedLocale.value.rangeStartSelected
  else liveMessage.value = ''
}
watch(mergedOpen, (open) => {
  if (open) {
    syncDraft()
    void nextTick(scrollSelectedOptionsIntoView)
  }
}, { immediate: true })
useFloatingDismiss({ open: mergedOpen, trigger: triggerRef, floating: panelRef, onDismiss: () => requestOpen(false) })
const activatePart = (part: RangePickerPart) => { activePart.value = part; activeColumn.value = 'hour'; requestOpen(true); void nextTick(scrollSelectedOptionsIntoView) }
const handlePartTabKeydown = (part: RangePickerPart, event: KeyboardEvent) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const nextPart: RangePickerPart = event.key === 'ArrowLeft' || event.key === 'Home' ? 'start' : 'end'
  if (nextPart === part && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) activatePart(part === 'start' ? 'end' : 'start')
  else activatePart(nextPart)
  void nextTick(() => rootRef.value?.querySelector<HTMLElement>(`#${nextPart === 'start' ? startTabId : endTabId}`)?.focus())
}
const handleSelectorMouseDown = (event: MouseEvent) => {
  const part = (event.target as HTMLElement).closest<HTMLInputElement>('[data-range-part]')?.dataset.rangePart as RangePickerPart | undefined
  if (part) activePart.value = part
  requestOpen(true)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (!mergedOpen.value && event.key === 'ArrowDown') { event.preventDefault(); requestOpen(true) }
  else if (mergedOpen.value && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); moveActiveColumn(event.key === 'ArrowRight' ? 1 : -1) }
  else if (mergedOpen.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) { event.preventDefault(); moveActiveValue(event.key === 'ArrowDown' ? 1 : -1) }
  else if (event.key === 'Escape') { event.preventDefault(); requestOpen(false) }
  else if (event.key === 'Enter' && mergedOpen.value) { event.preventDefault(); confirmDraft() }
}

defineExpose({
  focus: (part: RangePickerPart = 'start') => rootRef.value?.querySelector<HTMLInputElement>(`[data-range-part="${part}"]`)?.focus(),
  blur: () => rootRef.value?.querySelectorAll('input').forEach((input) => input.blur())
})
</script>
