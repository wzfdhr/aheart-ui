<template>
  <span ref="rootRef" class="aheart-date-range-picker" :class="rootClass">
    <span ref="triggerRef" class="aheart-date-range-picker__selector" @mousedown="handleSelectorMouseDown">
      <span v-if="hasPrefix" class="aheart-date-range-picker__prefix"><slot name="prefix"><ARenderNode :node="prefix" /></slot></span>
      <span class="aheart-date-range-picker__field" :class="{ 'is-active': activePart === 'start' && mergedOpen }">
        <input
          ref="startInputRef"
          :id="id ? `${id}-start` : undefined"
          data-range-part="start"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="panelId"
          :aria-expanded="mergedOpen ? 'true' : 'false'"
          :aria-activedescendant="mergedOpen ? activeCellId : undefined"
          :value="inputTexts[0]"
          :placeholder="resolvedPlaceholders[0]"
          :disabled="isDisabled"
          :readonly="readOnly"
          @focus="activatePart('start')"
          @input="updateInputText('start', $event)"
          @change="commitInput('start')"
          @keydown="handleInputKeydown"
        />
        <button
          v-if="allowClear && mergedValue?.[0] && allowEmpty[0] && !isDisabled && !readOnly"
          data-range-clear="start"
          type="button"
          :aria-label="`${resolvedLocale.clear} ${resolvedPlaceholders[0]}`"
          @click.stop="clearPart('start')"
        ><AIcon name="close" :size="12" /></button>
      </span>
      <span class="aheart-date-range-picker__separator"><slot name="separator"><ARenderNode v-if="separator" :node="separator" /><AIcon v-else name="arrow-right" :size="14" /></slot></span>
      <span class="aheart-date-range-picker__field" :class="{ 'is-active': activePart === 'end' && mergedOpen }">
        <input
          ref="endInputRef"
          :id="id ? `${id}-end` : undefined"
          data-range-part="end"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="panelId"
          :aria-expanded="mergedOpen ? 'true' : 'false'"
          :aria-activedescendant="mergedOpen ? activeCellId : undefined"
          :value="inputTexts[1]"
          :placeholder="resolvedPlaceholders[1]"
          :disabled="isDisabled"
          :readonly="readOnly"
          @focus="activatePart('end')"
          @input="updateInputText('end', $event)"
          @change="commitInput('end')"
          @keydown="handleInputKeydown"
        />
        <button
          v-if="allowClear && mergedValue?.[1] && allowEmpty[1] && !isDisabled && !readOnly"
          data-range-clear="end"
          type="button"
          :aria-label="`${resolvedLocale.clear} ${resolvedPlaceholders[1]}`"
          @click.stop="clearPart('end')"
        ><AIcon name="close" :size="12" /></button>
      </span>
      <button v-if="allowClear && hasValue && !isDisabled && !readOnly" class="aheart-date-range-picker__clear" type="button" :aria-label="resolvedLocale.clear" @click.stop="clearAll">
        <AIcon name="close" :size="14" />
      </button>
      <span class="aheart-date-range-picker__suffix" aria-hidden="true"><slot name="suffix"><ARenderNode v-if="suffixIcon" :node="suffixIcon" /><AIcon v-else name="calendar" :size="16" /></slot></span>
    </span>

    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="motion.isMounted.value"
        v-show="motion.phase.value !== 'hidden'"
        ref="panelRef"
        :id="panelId"
        class="aheart-date-range-picker__panel"
        :class="panelClass"
        :style="panelStyle"
        role="dialog"
        :aria-label="`${resolvedPlaceholders[0]} - ${resolvedPlaceholders[1]}`"
      >
        <aside v-if="presets?.length" class="aheart-date-range-picker__presets" :aria-label="resolvedLocale.presets">
          <button v-for="(preset, index) in presets" :key="index" type="button" :data-preset-index="index" @click="selectPreset(index)"><ARenderNode :node="preset.label" /></button>
        </aside>
        <div class="aheart-date-range-picker__content">
          <div class="aheart-date-range-picker__mobile-parts" role="tablist">
            <button :id="`${panelId}-tab-start`" data-mobile-part="start" type="button" role="tab" :tabindex="activePart === 'start' ? 0 : -1" :aria-selected="activePart === 'start'" :aria-controls="`${panelId}-tabpanel`" @click="activateMobilePart('start')" @keydown="handlePartTabKeydown('start', $event)">{{ resolvedPlaceholders[0] }}</button>
            <button :id="`${panelId}-tab-end`" data-mobile-part="end" type="button" role="tab" :tabindex="activePart === 'end' ? 0 : -1" :aria-selected="activePart === 'end'" :aria-controls="`${panelId}-tabpanel`" @click="activateMobilePart('end')" @keydown="handlePartTabKeydown('end', $event)">{{ resolvedPlaceholders[1] }}</button>
          </div>
          <div :id="`${panelId}-tabpanel`" class="aheart-date-range-picker__calendars" role="tabpanel" :aria-labelledby="`${panelId}-tab-${activePart}`">
            <section v-for="(calendar, calendarIndex) in calendars" :key="calendar.key" class="aheart-date-range-picker__calendar" :class="{ 'is-mobile-hidden': calendarIndex !== mobileCalendarIndex }">
              <header class="aheart-date-range-picker__header">
                <button type="button" :aria-label="picker === 'year' ? resolvedLocale.previousDecade : resolvedLocale.previousYear" @click="movePanel(calendarIndex, -1, true)"><AIcon name="chevrons-left" :size="16" /></button>
                <button v-if="picker === 'date' || picker === 'week'" type="button" :aria-label="resolvedLocale.previousMonth" @click="movePanel(calendarIndex, -1)"><AIcon name="chevron-left" :size="16" /></button>
                <strong>{{ calendar.title }}</strong>
                <button v-if="picker === 'date' || picker === 'week'" type="button" :aria-label="resolvedLocale.nextMonth" @click="movePanel(calendarIndex, 1)"><AIcon name="chevron-right" :size="16" /></button>
                <button type="button" :aria-label="picker === 'year' ? resolvedLocale.nextDecade : resolvedLocale.nextYear" @click="movePanel(calendarIndex, 1, true)"><AIcon name="chevrons-right" :size="16" /></button>
              </header>
              <div v-if="picker === 'date' || picker === 'week'" class="aheart-date-range-picker__weekdays" aria-hidden="true">
                <span v-for="day in resolvedLocale.weekdaysShort" :key="day">{{ day }}</span>
              </div>
              <div class="aheart-date-range-picker__grid" :class="`aheart-date-range-picker__grid--${picker}`" role="grid" :aria-label="calendar.title">
                <button
                  v-for="cell in calendar.cells"
                  :key="cell.key"
                  type="button"
                  role="gridcell"
                  tabindex="-1"
                  :id="cell.id"
                  :data-value="cell.value"
                  :disabled="cell.disabled"
                  :aria-selected="cell.selected ? 'true' : 'false'"
                  :class="{ 'is-outside': !cell.inView, 'is-active': cell.active, 'is-selected': cell.selected, 'is-range-start': cell.rangeStart, 'is-range-end': cell.rangeEnd, 'is-in-range': cell.inRange, 'is-today': cell.today }"
                  @mouseenter="hoverValue = cell.value"
                  @mouseleave="hoverValue = undefined"
                  @click="selectCell(cell)"
                ><slot name="cell" v-bind="cell.renderInfo"><ARenderNode v-if="cellRender" :node="cellRender(cell.renderInfo)" /><template v-else>{{ cell.text }}</template></slot></button>
              </div>
            </section>
          </div>

          <div v-if="effectiveShowTime" class="aheart-date-range-picker__times" :aria-label="resolvedLocale.time">
            <fieldset v-for="part in rangeParts" :key="part" :disabled="!draftValue?.[part === 'start' ? 0 : 1]">
              <legend>{{ part === 'start' ? resolvedPlaceholders[0] : resolvedPlaceholders[1] }}</legend>
              <input
                :data-time-part="`${part}-hour`"
                type="number"
                :min="showTimeOptions.use12Hours ? 1 : 0"
                :max="showTimeOptions.use12Hours ? 12 : 23"
                :step="showTimeOptions.hourStep ?? 1"
                :value="displayTimeHour(part)"
                @input="updateTime(part, 'hour', $event)"
              />
              <select v-if="showTimeOptions.use12Hours" :data-time-part="`${part}-period`" :value="timePeriod(part)" @change="updatePeriod(part, $event)">
                <option value="AM">{{ resolvedLocale.am }}</option>
                <option value="PM">{{ resolvedLocale.pm }}</option>
              </select>
              <span>:</span>
              <input :data-time-part="`${part}-minute`" type="number" min="0" max="59" :step="showTimeOptions.minuteStep ?? 1" :value="timeParts(part).minute" @input="updateTime(part, 'minute', $event)" />
              <span>:</span>
              <input :data-time-part="`${part}-second`" type="number" min="0" max="59" :step="showTimeOptions.secondStep ?? 1" :value="timeParts(part).second" @input="updateTime(part, 'second', $event)" />
            </fieldset>
          </div>

          <footer class="aheart-date-range-picker__footer">
            <button type="button" class="aheart-date-range-picker__today" @click="selectToday">{{ resolvedLocale.today }}</button>
            <slot name="footer" />
            <button v-if="effectiveNeedConfirm || allowEmpty.some(Boolean)" type="button" class="aheart-date-range-picker__ok" :disabled="!rangeComplete" @click="confirmDraft">{{ resolvedLocale.ok }}</button>
          </footer>
          <span class="aheart-date-range-picker__live" aria-live="polite">{{ liveMessage }}</span>
        </div>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, isVNode, nextTick, onMounted, ref, toRaw, useId, useSlots, watch, type Component, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig, zhCN } from '../config'
import AIcon from '../icon/icon.vue'
import { createDateMatrix, isPickerDateDisabled } from '../picker-core/calendar'
import { comparePickerValues, defaultValueFormat, formatPickerValue, normalizeFormats, parsePickerValue } from '../picker-core/codec'
import { createPickerDate, pickerDayjsLocale, type PickerDate } from '../picker-core/dayjs'
import { advanceRangeSelection, normalizeRangeValue } from '../picker-core/selection'
import type { RangePickerPart, RangePickerValue } from '../picker-core/types'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { dateRangePickerEmits, dateRangePickerProps, type DatePickerCellRenderInfo } from './types'
import './style.css'

defineOptions({ name: 'ADateRangePicker' })

const props = defineProps(dateRangePickerProps)
const emit = defineEmits(dateRangePickerEmits)
const slots = useSlots()
const config = useAheartConfig()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const startInputRef = ref<HTMLInputElement | null>(null)
const endInputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref<RangePickerValue>(props.defaultValue ? [...props.defaultValue] as RangePickerValue : undefined)
const internalOpen = ref(props.defaultOpen)
const draftValue = ref<RangePickerValue>()
const activePart = ref<RangePickerPart>('start')
const activeKeyboardDate = ref<PickerDate>()
const activePanelIndex = ref(0)
const hoverValue = ref<string>()
const liveMessage = ref('')
const inputTexts = ref<[string, string]>(['', ''])
const nowDate = ref<PickerDate>()
const rangeParts: RangePickerPart[] = ['start', 'end']
const panelId = `aheart-date-range-picker-${useId().replace(/:/g, '')}-panel`
const isValueControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const isPanelControlled = usePropPresence('pickerValue', 'picker-value')

const ARenderNode = defineComponent({
  name: 'ADateRangePickerRenderNode',
  props: { node: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
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
const effectiveShowTime = computed(() => Boolean(props.showTime) && props.picker === 'date')
const showTimeOptions = computed(() => typeof props.showTime === 'object' ? props.showTime : {})
const effectiveNeedConfirm = computed(() => props.needConfirm ?? effectiveShowTime.value)
const resolvedValueFormat = computed(() => props.valueFormat ?? defaultValueFormat(props.picker, effectiveShowTime.value))
const displayFormats = computed(() => normalizeFormats(props.format ?? resolvedValueFormat.value))
const displayFormat = computed(() => displayFormats.value[0] ?? resolvedValueFormat.value)
const resolvedLocale = computed(() => ({ ...zhCN.datePicker, ...config.value.locale?.datePicker, ...props.locale?.datePicker }) as Required<NonNullable<typeof zhCN.datePicker>>)
const resolvedPlaceholders = computed<[string, string]>(() => props.placeholder ?? [resolvedLocale.value.startDate, resolvedLocale.value.endDate])
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? 'outlined')
const hasPrefix = computed(() => props.prefix !== undefined || Boolean(slots.prefix))
const hasValue = computed(() => Boolean(mergedValue.value?.[0] || mergedValue.value?.[1]))
const rangeComplete = computed(() => Boolean(
  (draftValue.value?.[0] || props.allowEmpty[0])
  && (draftValue.value?.[1] || props.allowEmpty[1])
  && (draftValue.value?.[0] || draftValue.value?.[1])
))
const rootClass = computed(() => [
  `aheart-date-range-picker--${resolvedSize.value}`,
  `aheart-date-range-picker--${resolvedVariant.value}`,
  props.status && `aheart-date-range-picker--${props.status}`,
  { 'is-open': mergedOpen.value, 'is-disabled': isDisabled.value }
])

const parseValue = (value?: string) => value
  ? parsePickerValue(value, [resolvedValueFormat.value, ...displayFormats.value, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'GGGG-[W]WW', 'YYYY-MM', 'YYYY-[Q]Q', 'YYYY'], pickerDayjsLocale(resolvedLocale.value.locale))
  : undefined
const formatDisplay = (value?: string) => value ? formatPickerValue(parseValue(value)?.locale(pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value : ''
const syncInputs = () => {
  inputTexts.value = [formatDisplay(mergedValue.value?.[0]), formatDisplay(mergedValue.value?.[1])]
}
watch(mergedValue, syncInputs, { immediate: true, deep: true })

const initialPanelValues = (): [PickerDate, PickerDate] => {
  const explicit = props.pickerValue ?? props.defaultPickerValue
  const start = parseValue(explicit?.[0]) ?? parseValue(mergedValue.value?.[0]) ?? nowDate.value ?? createPickerDate('2000-01-01', 'YYYY-MM-DD', true)
  const requestedEnd = parseValue(explicit?.[1]) ?? parseValue(mergedValue.value?.[1])
  if (props.picker === 'year') {
    const startDecade = Math.floor(start.year() / 10)
    const end = requestedEnd && Math.floor(requestedEnd.year() / 10) > startDecade ? requestedEnd : start.add(10, 'year')
    return [start, end]
  }
  const panelUnit = props.picker === 'date' || props.picker === 'week' ? 'month' : 'year'
  const end = requestedEnd?.isAfter(start, panelUnit) ? requestedEnd : start.add(1, panelUnit)
  return [start, end]
}
const panelDates = ref<[PickerDate, PickerDate]>(initialPanelValues())

onMounted(() => {
  nowDate.value = createPickerDate()
  if (!props.defaultPickerValue && !props.pickerValue && !mergedValue.value) panelDates.value = initialPanelValues()
})

const minDateValue = computed(() => parsePickerValue(props.minDate, 'YYYY-MM-DD'))
const maxDateValue = computed(() => parsePickerValue(props.maxDate, 'YYYY-MM-DD'))
const cellValue = (date: PickerDate) => formatPickerValue(date, resolvedValueFormat.value)!
const canonicalCellValue = (date: PickerDate) => formatPickerValue(date, defaultValueFormat(props.picker, false))!
const isDisabledDate = (date: PickerDate) => isPickerDateDisabled(date, {
  min: minDateValue.value,
  max: maxDateValue.value,
  disabledDate: (current) => Boolean(props.disabledDate?.(formatPickerValue(current, 'YYYY-MM-DD')!, { from: draftValue.value?.[activePart.value === 'start' ? 1 : 0], type: props.picker }))
})
const comparisonValue = (value: string) => {
  const parsed = parseValue(value)
  return parsed ? formatPickerValue(parsed, defaultValueFormat(props.picker, false))! : value
}
const isDateDisabledForPart = (date: PickerDate, part: RangePickerPart, range: RangePickerValue) => isPickerDateDisabled(date, {
  min: minDateValue.value,
  max: maxDateValue.value,
  disabledDate: (current) => Boolean(props.disabledDate?.(formatPickerValue(current, 'YYYY-MM-DD')!, { from: range?.[part === 'start' ? 1 : 0], type: props.picker }))
})
const inPreviewRange = (value: string) => {
  const start = draftValue.value?.[0]
  const end = draftValue.value?.[1]
  const previewEnd = activePart.value === 'end' && start && !end ? hoverValue.value : undefined
  const bounds = [start, end ?? previewEnd].filter(Boolean) as string[]
  if (bounds.length !== 2) return false
  const current = comparisonValue(value)
  const left = comparisonValue(bounds[0]!)
  const right = comparisonValue(bounds[1]!)
  const low = comparePickerValues(left, right, defaultValueFormat(props.picker)) <= 0 ? left : right
  const high = low === left ? right : left
  return comparePickerValues(current, low, defaultValueFormat(props.picker)) > 0 && comparePickerValues(current, high, defaultValueFormat(props.picker)) < 0
}

interface RangeCell {
  id: string
  key: string
  value: string
  text: string
  date: PickerDate
  panelIndex: number
  inView: boolean
  today: boolean
  disabled: boolean
  active: boolean
  selected: boolean
  rangeStart: boolean
  rangeEnd: boolean
  inRange: boolean
  renderInfo: DatePickerCellRenderInfo & { range: RangePickerPart }
}

const createCell = (date: PickerDate, text: string, key: string, inView = true, today = false, panelIndex = 0): RangeCell => {
  const value = canonicalCellValue(date)
  const start = draftValue.value?.[0]
  const end = draftValue.value?.[1]
  const isSameCandidate = (candidate?: string) => Boolean(candidate && comparisonValue(candidate) === value)
  const disabled = isDisabledDate(date)
  const selected = isSameCandidate(start) || isSameCandidate(end)
  return {
    id: `${panelId}-${panelIndex}-${date.format('YYYYMMDD')}`,
    key,
    value,
    text,
    date,
    panelIndex,
    inView,
    today,
    disabled,
    active: panelIndex === activePanelIndex.value && Boolean(activeKeyboardDate.value?.isSame(date, 'day')),
    selected,
    rangeStart: isSameCandidate(start),
    rangeEnd: isSameCandidate(end),
    inRange: inPreviewRange(value),
    renderInfo: { mode: props.picker, text, value, selected, disabled, range: activePart.value }
  }
}

const cellsForPanel = (view: PickerDate, panelIndex: number) => {
  if (props.picker === 'date' || props.picker === 'week') {
    return createDateMatrix(view, resolvedLocale.value.weekStartsOn, nowDate.value).map((item) => createCell(item.value, String(item.value.date()), formatPickerValue(item.value, 'YYYY-MM-DD')!, item.inView, item.today, panelIndex))
  }
  if (props.picker === 'month') return Array.from({ length: 12 }, (_, month) => {
    const date = view.month(month).startOf('month')
    return createCell(date, resolvedLocale.value.monthsShort[month]!, formatPickerValue(date, 'YYYY-MM')!, true, false, panelIndex)
  })
  if (props.picker === 'quarter') return Array.from({ length: 4 }, (_, quarter) => {
    const date = view.month(quarter * 3).startOf('quarter')
    return createCell(date, `Q${quarter + 1}`, formatPickerValue(date, 'YYYY-[Q]Q')!, true, false, panelIndex)
  })
  const decadeStart = Math.floor(view.year() / 10) * 10 - 1
  return Array.from({ length: 12 }, (_, index) => {
    const date = view.year(decadeStart + index).startOf('year')
    return createCell(date, String(date.year()), formatPickerValue(date, 'YYYY')!, index > 0 && index < 11, false, panelIndex)
  })
}
const panelTitle = (view: PickerDate) => {
  if (props.picker === 'date' || props.picker === 'week') {
    const localized = view.locale(pickerDayjsLocale(resolvedLocale.value.locale))
    return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format('MMMM'))
  }
  if (props.picker === 'year') {
    const start = Math.floor(view.year() / 10) * 10
    return `${start} - ${start + 9}`
  }
  return String(view.year())
}
const calendars = computed(() => panelDates.value.map((date, index) => ({ key: `${index}-${date.valueOf()}`, title: panelTitle(date), cells: cellsForPanel(date, index) })))
const mobileCalendarIndex = ref(0)
const panelIndexForDate = (date: PickerDate) => {
  const index = panelDates.value.findIndex((panelDate) => {
    if (props.picker === 'year') return Math.floor(panelDate.year() / 10) === Math.floor(date.year() / 10)
    return date.isSame(panelDate, props.picker === 'date' || props.picker === 'week' ? 'month' : 'year')
  })
  return index
}
const activeCellId = computed(() => {
  const cells = calendars.value.flatMap((calendar) => calendar.cells)
  return (cells.find((cell) => cell.active && cell.inView) ?? cells.find((cell) => cell.active))?.id
})

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => {
  if (!triggerRef.value) return false
  if (props.getPopupContainer) return props.getPopupContainer(triggerRef.value)
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
const panelClass = computed(() => [`aheart-floating--${floatingPosition.placement.value}`, `is-${motion.phase.value}`, { 'has-presets': props.presets?.length, 'has-time': effectiveShowTime.value }])
const panelStyle = computed(() => floatingPosition.popupStyle.value)
watch(() => motion.phase.value, (phase) => { if (phase === 'entered') void nextTick(floatingPosition.update) })

let restoringFocus = false
const requestOpen = (open: boolean, restoreFocus = false) => {
  if (open && (isDisabled.value || props.readOnly)) return
  if (!isOpenControlled.value) internalOpen.value = open
  emit('openChange', open)
  if (!open && restoreFocus) void nextTick(() => {
    restoringFocus = true
    ;(activePart.value === 'start' ? startInputRef.value : endInputRef.value)?.focus()
    queueMicrotask(() => { restoringFocus = false })
  })
}
const syncDraft = () => {
  draftValue.value = mergedValue.value ? [...mergedValue.value] as RangePickerValue : undefined
  hoverValue.value = undefined
  if (!isPanelControlled.value) panelDates.value = initialPanelValues()
  activeKeyboardDate.value = parseValue(draftValue.value?.[activePart.value === 'start' ? 0 : 1]) ?? panelDates.value[0]
  activePanelIndex.value = Math.max(0, panelIndexForDate(activeKeyboardDate.value))
  mobileCalendarIndex.value = activePanelIndex.value
}
watch(mergedOpen, (open) => { if (open) syncDraft() }, { immediate: true })
watch(mergedValue, () => { if (mergedOpen.value) syncDraft() }, { deep: true })
watch(() => props.pickerValue, () => {
  if (props.pickerValue) panelDates.value = initialPanelValues()
}, { deep: true })
useFloatingDismiss({ open: mergedOpen, trigger: triggerRef, floating: panelRef, onDismiss: (reason) => requestOpen(false, reason === 'escape'), restoreFocus: false })

const activatePart = (part: RangePickerPart) => {
  activePart.value = part
  const date = parseValue(draftValue.value?.[part === 'start' ? 0 : 1])
  if (date) {
    activeKeyboardDate.value = date
    activePanelIndex.value = Math.max(0, panelIndexForDate(date))
    mobileCalendarIndex.value = activePanelIndex.value
  }
  if (restoringFocus) return
  requestOpen(true)
}
const handleSelectorMouseDown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest('button')) return
  const part = target.closest<HTMLInputElement>('[data-range-part]')?.dataset.rangePart as RangePickerPart | undefined
  if (part) activePart.value = part
  requestOpen(true)
}
const activateMobilePart = (part: RangePickerPart) => {
  activePart.value = part
  const value = parseValue(draftValue.value?.[part === 'start' ? 0 : 1])
  activeKeyboardDate.value = value ?? panelDates.value[0]
  if (value && !isPanelControlled.value) {
    panelDates.value = [value, panelDates.value[1]]
  }
  activePanelIndex.value = 0
  mobileCalendarIndex.value = 0
}
const handlePartTabKeydown = (part: RangePickerPart, event: KeyboardEvent) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const nextPart: RangePickerPart = event.key === 'Home' ? 'start' : event.key === 'End' ? 'end' : part === 'start' ? 'end' : 'start'
  activateMobilePart(nextPart)
  void nextTick(() => panelRef.value?.querySelector<HTMLButtonElement>(`[data-mobile-part="${nextPart}"]`)?.focus())
}
const keyboardStep = (key: string) => {
  if (props.picker === 'date') return (date: PickerDate) => date.add(key === 'ArrowUp' ? -7 : key === 'ArrowDown' ? 7 : key === 'ArrowLeft' ? -1 : 1, 'day')
  if (props.picker === 'week') return (date: PickerDate) => date.add(key === 'ArrowUp' || key === 'ArrowLeft' ? -1 : 1, 'week')
  if (props.picker === 'month') return (date: PickerDate) => date.add(key === 'ArrowUp' ? -3 : key === 'ArrowDown' ? 3 : key === 'ArrowLeft' ? -1 : 1, 'month')
  if (props.picker === 'quarter') return (date: PickerDate) => date.add((key === 'ArrowUp' || key === 'ArrowLeft' ? -1 : 1) * 3, 'month')
  return (date: PickerDate) => date.add(key === 'ArrowUp' ? -3 : key === 'ArrowDown' ? 3 : key === 'ArrowLeft' ? -1 : 1, 'year')
}
const syncPanelToKeyboardDate = (date: PickerDate) => {
  const matchingPanel = panelIndexForDate(date)
  if (matchingPanel >= 0) {
    activePanelIndex.value = matchingPanel
    mobileCalendarIndex.value = matchingPanel
    return
  }
  const next: [PickerDate, PickerDate] = [date, props.picker === 'year' ? date.add(10, 'year') : date.add(1, props.picker === 'date' || props.picker === 'week' ? 'month' : 'year')]
  activePanelIndex.value = 0
  mobileCalendarIndex.value = 0
  if (!isPanelControlled.value) panelDates.value = next
  emit('panelChange', next.map((item) => formatPickerValue(item, resolvedValueFormat.value)!) as [string, string], props.picker)
}
const handleInputKeydown = (event: KeyboardEvent) => {
  if (event.key.startsWith('Arrow')) {
    event.preventDefault()
    requestOpen(true)
    const current = activeKeyboardDate.value ?? panelDates.value[0]
    activeKeyboardDate.value = keyboardStep(event.key)(current)
    syncPanelToKeyboardDate(activeKeyboardDate.value)
  }
  if (event.key === 'Enter' && mergedOpen.value && activeKeyboardDate.value) {
    event.preventDefault()
    selectCell(createCell(activeKeyboardDate.value, String(activeKeyboardDate.value.date()), canonicalCellValue(activeKeyboardDate.value), true, false, activePanelIndex.value))
  }
  if (event.key === 'Escape') { event.preventDefault(); requestOpen(false, true) }
}
const updateInputText = (part: RangePickerPart, event: Event) => {
  const index = part === 'start' ? 0 : 1
  inputTexts.value[index] = (event.target as HTMLInputElement).value
}
const commitInput = (part: RangePickerPart) => {
  const index = part === 'start' ? 0 : 1
  const input = inputTexts.value[index]
  if (!input && props.allowEmpty[index]) {
    commitValue([mergedValue.value?.[0], mergedValue.value?.[1]].map((value, valueIndex) => valueIndex === index ? undefined : value) as [string | undefined, string | undefined], false)
    return
  }
  const parsed = parsePickerValue(input, displayFormats.value, pickerDayjsLocale(resolvedLocale.value.locale))
  if (!parsed) { emit('invalid', input, part); syncInputs(); return }
  const next: [string | undefined, string | undefined] = [mergedValue.value?.[0], mergedValue.value?.[1]]
  next[index] = formatPickerValue(parsed, resolvedValueFormat.value)
  if (isDateDisabledForPart(parsed, part, next)) { emit('invalid', input, part); syncInputs(); return }
  const normalized = normalizeRangeValue(next, resolvedValueFormat.value, props.order, props.allowEmpty)
  if (!normalized) { emit('invalid', input, part); syncInputs(); return }
  commitValue(normalized, false)
}

const commitValue = (value: RangePickerValue, close = true) => {
  const normalized = normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty) ?? value
  if (!isValueControlled.value) internalValue.value = normalized ? [...normalized] as RangePickerValue : undefined
  emit('update:modelValue', normalized)
  emit('change', normalized)
  if (isValueControlled.value) void nextTick(syncInputs)
  if (close) requestOpen(false, true)
}
const clearPart = (part: RangePickerPart) => {
  const index = part === 'start' ? 0 : 1
  const next: [string | undefined, string | undefined] = [mergedValue.value?.[0], mergedValue.value?.[1]]
  next[index] = undefined
  commitValue(next, false)
  emit('clear')
}
const clearAll = () => { commitValue(undefined, false); emit('clear') }

const defaultTime = () => {
  const value = showTimeOptions.value.defaultValue
  return value ? parsePickerValue(value, showTimeOptions.value.format ?? 'HH:mm:ss') : undefined
}
const dateWithDefaultTime = (date: PickerDate) => {
  if (!effectiveShowTime.value) return date
  const time = defaultTime()
  return time ? date.hour(time.hour()).minute(time.minute()).second(time.second()) : date.startOf('day')
}
const selectCell = (cell: RangeCell) => {
  if (cell.disabled || isDisabled.value || props.readOnly) return
  activeKeyboardDate.value = cell.date
  activePanelIndex.value = cell.panelIndex
  const value = cellValue(dateWithDefaultTime(cell.date))
  const selectedPart = activePart.value
  const result = advanceRangeSelection(draftValue.value, value, selectedPart, resolvedValueFormat.value, props.order, props.allowEmpty)
  draftValue.value = result.value
  activePart.value = result.activePart
  emit('calendarChange', [...result.value] as RangePickerValue, { range: selectedPart })
  liveMessage.value = result.complete ? resolvedLocale.value.rangeComplete(result.value[0] ?? '', result.value[1] ?? '') : resolvedLocale.value.rangeStartSelected
  if (result.complete && !effectiveNeedConfirm.value) commitValue(result.value)
}
const selectPreset = (index: number) => {
  const preset = props.presets?.[index]
  if (!preset) return
  const value = typeof preset.value === 'function' ? preset.value() : preset.value
  for (const [index, endpoint] of (value ?? []).entries()) {
    const part: RangePickerPart = index === 0 ? 'start' : 'end'
    if (endpoint && !parseValue(endpoint)) {
      emit('invalid', endpoint, part)
      return
    }
  }
  const normalized = normalizeRangeValue(value, resolvedValueFormat.value, props.order, props.allowEmpty)
  if (!normalized) return
  for (const [index, endpoint] of normalized.entries()) {
    const part: RangePickerPart = index === 0 ? 'start' : 'end'
    const date = parseValue(endpoint)
    if (endpoint && !date) {
      emit('invalid', endpoint, part)
      return
    }
    if (endpoint && date && isDateDisabledForPart(date, part, normalized)) {
      emit('invalid', endpoint, part)
      return
    }
  }
  draftValue.value = [...normalized] as RangePickerValue
  emit('calendarChange', [...normalized] as RangePickerValue, { range: 'end' })
  if (effectiveNeedConfirm.value) liveMessage.value = resolvedLocale.value.rangeComplete(normalized[0] ?? '', normalized[1] ?? '')
  else commitValue(normalized)
}
const selectToday = () => {
  const date = nowDate.value ?? createPickerDate()
  const panelIndex = Math.max(0, panelIndexForDate(date))
  selectCell(createCell(date, String(date.date()), formatPickerValue(date, 'YYYY-MM-DD')!, true, true, panelIndex))
}
const confirmDraft = () => {
  if (!rangeComplete.value) return
  const normalized = normalizeRangeValue(draftValue.value, resolvedValueFormat.value, props.order, props.allowEmpty)
  if (!normalized) return
  commitValue(normalized)
  emit('ok', normalized)
}

const timeParts = (part: RangePickerPart) => {
  const value = parseValue(draftValue.value?.[part === 'start' ? 0 : 1]) ?? createPickerDate().startOf('day')
  return { hour: value.hour(), minute: value.minute(), second: value.second() }
}
const displayTimeHour = (part: RangePickerPart) => showTimeOptions.value.use12Hours ? timeParts(part).hour % 12 || 12 : timeParts(part).hour
const timePeriod = (part: RangePickerPart) => timeParts(part).hour >= 12 ? 'PM' : 'AM'
const updateTime = (part: RangePickerPart, unit: 'hour' | 'minute' | 'second', event: Event) => {
  const index = part === 'start' ? 0 : 1
  const current = parseValue(draftValue.value?.[index])
  if (!current) return
  const maximum = unit === 'hour' ? (showTimeOptions.value.use12Hours ? 12 : 23) : 59
  const minimum = unit === 'hour' && showTimeOptions.value.use12Hours ? 1 : 0
  const raw = Math.max(minimum, Math.min(maximum, Number((event.target as HTMLInputElement).value) || minimum))
  const step = Math.max(1, Math.floor(unit === 'hour' ? showTimeOptions.value.hourStep ?? 1 : unit === 'minute' ? showTimeOptions.value.minuteStep ?? 1 : showTimeOptions.value.secondStep ?? 1))
  const value = unit === 'hour' && showTimeOptions.value.use12Hours
    ? raw
    : Math.min(Math.floor(maximum / step) * step, Math.round(raw / step) * step)
  ;(event.target as HTMLInputElement).value = String(value)
  const hour = showTimeOptions.value.use12Hours ? value % 12 + (timePeriod(part) === 'PM' ? 12 : 0) : value
  const next = unit === 'hour' ? current.hour(hour) : unit === 'minute' ? current.minute(value) : current.second(value)
  const range: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
  range[index] = formatPickerValue(next, resolvedValueFormat.value)
  draftValue.value = range
  emit('calendarChange', [...range] as RangePickerValue, { range: part })
}
const updatePeriod = (part: RangePickerPart, event: Event) => {
  const index = part === 'start' ? 0 : 1
  const current = parseValue(draftValue.value?.[index])
  if (!current) return
  const period = (event.target as HTMLSelectElement).value
  const next = current.hour(current.hour() % 12 + (period === 'PM' ? 12 : 0))
  const range: [string | undefined, string | undefined] = [draftValue.value?.[0], draftValue.value?.[1]]
  range[index] = formatPickerValue(next, resolvedValueFormat.value)
  draftValue.value = range
  emit('calendarChange', [...range] as RangePickerValue, { range: part })
}

const movePanel = (index: number, amount: number, year = false) => {
  const resolvedAmount = props.picker === 'year' ? amount * 10 : amount
  if (isPanelControlled.value) {
    const values = panelDates.value.map((date, panelIndex) => formatPickerValue(panelIndex === index ? date.add(resolvedAmount, year ? 'year' : 'month') : date, resolvedValueFormat.value)!) as [string, string]
    emit('panelChange', values, props.picker)
    return
  }
  const next = [...panelDates.value] as [PickerDate, PickerDate]
  next[index] = next[index].add(resolvedAmount, year ? 'year' : 'month')
  panelDates.value = next
  emit('panelChange', next.map((date) => formatPickerValue(date, resolvedValueFormat.value)!) as [string, string], props.picker)
}

defineExpose({
  focus: (part: RangePickerPart = 'start') => (part === 'start' ? startInputRef.value : endInputRef.value)?.focus(),
  blur: () => { startInputRef.value?.blur(); endInputRef.value?.blur() }
})
</script>
