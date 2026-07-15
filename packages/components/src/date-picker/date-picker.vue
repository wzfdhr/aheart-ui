<template>
  <span ref="rootRef" class="aheart-date-picker" :class="rootClass">
    <span ref="triggerRef" class="aheart-date-picker__selector" @mousedown="handleSelectorMouseDown">
      <span v-if="hasPrefix" class="aheart-date-picker__prefix">
        <slot name="prefix"><ARenderNode :node="prefix" /></slot>
      </span>

      <span v-if="multiple && selectedValues.length" class="aheart-date-picker__tags">
        <span v-for="value in selectedValues" :key="value" class="aheart-date-picker__tag">
          <slot name="tag" :value="value">{{ formatDisplayValue(value) }}</slot>
          <button type="button" :aria-label="`${resolvedLocale.clear} ${value}`" @click.stop="removeMultipleValue(value)">
            <AIcon name="close" :size="12" />
          </button>
        </span>
      </span>

      <input
        ref="inputRef"
        :id="id"
        class="aheart-date-picker__input"
        type="text"
        :inputmode="showTimeOptions.use12Hours ? 'text' : 'numeric'"
        autocomplete="off"
        role="combobox"
        aria-haspopup="dialog"
        :aria-labelledby="labelledBy ?? ariaLabelledby"
        :aria-describedby="describedBy ?? ariaDescribedby"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-controls="panelId"
        :aria-expanded="mergedOpen ? 'true' : 'false'"
        :aria-activedescendant="mergedOpen ? activeCellId : undefined"
        :value="inputText"
        :placeholder="resolvedPlaceholder"
        :disabled="isDisabled"
        :readonly="readOnly || multiple"
        @focus="handleFocus"
        @input="handleInput"
        @change="handleInputChange"
        @keydown="handleKeydown"
      />

      <button
        v-if="allowClear && hasValue && !isDisabled && !readOnly"
        class="aheart-date-picker__clear"
        type="button"
        :aria-label="resolvedLocale.clear"
        @click.stop="clearValue"
      >
        <AIcon name="close" :size="14" />
      </button>
      <span class="aheart-date-picker__suffix" aria-hidden="true">
        <slot name="suffix"><ARenderNode v-if="suffixIcon" :node="suffixIcon" /><AIcon v-else name="calendar" :size="16" /></slot>
      </span>
    </span>

    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="motion.isMounted.value"
        v-show="motion.phase.value !== 'hidden'"
        ref="panelRef"
        :id="panelId"
        class="aheart-date-picker__panel"
        :class="panelClass"
        :style="panelStyle"
        role="dialog"
        :aria-label="resolvedPlaceholder"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
      >
        <div v-if="presets?.length" class="aheart-date-picker__presets" :aria-label="resolvedLocale.presets">
          <button
            v-for="(preset, index) in presets"
            :key="index"
            type="button"
            :data-preset-index="index"
            @click="selectPreset(index)"
          ><ARenderNode :node="preset.label" /></button>
        </div>

        <div class="aheart-date-picker__main">
          <header class="aheart-date-picker__header" :class="{ 'is-compact': picker !== 'date' && picker !== 'week' }">
            <button type="button" :aria-label="picker === 'year' ? resolvedLocale.previousDecade : resolvedLocale.previousYear" @click="moveView(-1, true)">
              <AIcon name="chevrons-left" :size="16" />
            </button>
            <button
              v-if="picker === 'date' || picker === 'week'"
              type="button"
              :aria-label="resolvedLocale.previousMonth"
              @click="moveView(-1)"
            ><AIcon name="chevron-left" :size="16" /></button>
            <strong>{{ panelTitle }}</strong>
            <button
              v-if="picker === 'date' || picker === 'week'"
              type="button"
              :aria-label="resolvedLocale.nextMonth"
              @click="moveView(1)"
            ><AIcon name="chevron-right" :size="16" /></button>
            <button type="button" :aria-label="picker === 'year' ? resolvedLocale.nextDecade : resolvedLocale.nextYear" @click="moveView(1, true)">
              <AIcon name="chevrons-right" :size="16" />
            </button>
          </header>

          <div v-if="picker === 'date' || picker === 'week'" class="aheart-date-picker__weekdays" aria-hidden="true">
            <span v-for="day in resolvedLocale.weekdaysShort" :key="day">{{ day }}</span>
          </div>

          <div
            class="aheart-date-picker__grid"
            :class="`aheart-date-picker__grid--${picker}`"
            role="grid"
            :aria-label="panelTitle"
          >
            <button
              v-for="cell in panelCells"
              :id="cell.id"
              :key="cell.key"
              type="button"
              role="gridcell"
              tabindex="-1"
              :data-value="cell.value"
              :disabled="cell.disabled"
              :aria-selected="cell.selected ? 'true' : 'false'"
              :class="{
                'is-outside': !cell.inView,
                'is-selected': cell.selected,
                'is-today': cell.today,
                'is-active': cell.key === activeCellKey
              }"
              @mouseenter="activeCellKey = cell.key"
              @click="selectCell(cell)"
            >
              <slot name="cell" v-bind="cell.renderInfo">
                <ARenderNode v-if="cellRender" :node="cellRender(cell.renderInfo)" />
                <template v-else>{{ cell.text }}</template>
              </slot>
            </button>
          </div>

          <div v-if="effectiveShowTime" class="aheart-date-picker__time" :aria-label="resolvedLocale.time">
            <label>
              <span>{{ resolvedLocale.hour }}</span>
              <input
                data-time-part="hour"
                type="number"
                :min="showTimeOptions.use12Hours ? 1 : 0"
                :max="showTimeOptions.use12Hours ? 12 : 23"
                :step="showTimeOptions.hourStep ?? 1"
                :value="displayedDraftHour"
                @input="updateTimePart('hour', $event)"
              />
            </label>
            <label v-if="showTimeOptions.use12Hours">
              <span>{{ resolvedLocale.period }}</span>
              <select data-time-part="period" :value="draftPeriod" @change="updateTimePeriod">
                <option value="AM">{{ resolvedLocale.am }}</option>
                <option value="PM">{{ resolvedLocale.pm }}</option>
              </select>
            </label>
            <span>:</span>
            <label>
              <span>{{ resolvedLocale.minute }}</span>
              <input data-time-part="minute" type="number" min="0" max="59" :step="showTimeOptions.minuteStep ?? 1" :value="draftTime.minute" @input="updateTimePart('minute', $event)" />
            </label>
            <span>:</span>
            <label>
              <span>{{ resolvedLocale.second }}</span>
              <input data-time-part="second" type="number" min="0" max="59" :step="showTimeOptions.secondStep ?? 1" :value="draftTime.second" @input="updateTimePart('second', $event)" />
            </label>
          </div>

          <footer class="aheart-date-picker__footer">
            <button class="aheart-date-picker__today" type="button" @click="selectToday">{{ resolvedLocale.today }}</button>
            <slot name="footer" />
            <button v-if="effectiveNeedConfirm" class="aheart-date-picker__ok" type="button" :disabled="!hasDraftValue" @click="confirmDraft">
              {{ resolvedLocale.ok }}
            </button>
          </footer>
          <span class="aheart-date-picker__live" aria-live="polite">{{ liveMessage }}</span>
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
import { defaultValueFormat, formatPickerValue, normalizeFormats, parsePickerValue } from '../picker-core/codec'
import { createPickerDate, pickerDayjsLocale, type PickerDate } from '../picker-core/dayjs'
import { normalizeMultipleValues } from '../picker-core/selection'
import type { DatePickerValue, DatePickerCellRenderInfo } from './types'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { datePickerEmits, datePickerProps } from './types'
import './style.css'

defineOptions({ name: 'ADatePicker' })

const props = defineProps(datePickerProps)
const emit = defineEmits(datePickerEmits)
const slots = useSlots()
const config = useAheartConfig()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const internalValue = ref<DatePickerValue>(props.defaultValue)
const internalOpen = ref(props.defaultOpen)
const draftValue = ref<DatePickerValue>()
const inputText = ref('')
const activeCellKey = ref('')
const liveMessage = ref('')
const instanceId = useId().replace(/:/g, '')
const panelId = `aheart-date-picker-${instanceId}-panel`
const isValueControlled = usePropPresence('modelValue', 'model-value')
const isOpenControlled = usePropPresence('open')
const isPanelControlled = usePropPresence('pickerValue', 'picker-value')

const ARenderNode = defineComponent({
  name: 'ADatePickerRenderNode',
  props: { node: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup(renderProps) {
    return () => {
      const node = renderProps.node
      const isComponent = (typeof node === 'function' || (typeof node === 'object' && node !== null && !Array.isArray(node) && !isVNode(node)))
      return isComponent ? h(toRaw(node as Component)) : node
    }
  }
})

const mergedValue = computed<DatePickerValue>(() => isValueControlled.value ? props.modelValue : internalValue.value)
const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value))
const selectedValues = computed(() => Array.isArray(mergedValue.value)
  ? mergedValue.value
  : mergedValue.value ? [mergedValue.value] : [])
const effectiveShowTime = computed(() => Boolean(props.showTime) && !props.multiple && props.picker === 'date')
const showTimeOptions = computed(() => typeof props.showTime === 'object' ? props.showTime : {})
const effectiveNeedConfirm = computed(() => props.needConfirm ?? effectiveShowTime.value)
const resolvedValueFormat = computed(() => props.valueFormat ?? defaultValueFormat(props.picker, effectiveShowTime.value))
const resolvedFormats = computed(() => normalizeFormats(props.format ?? (
  effectiveShowTime.value && showTimeOptions.value.use12Hours
    ? 'YYYY-MM-DD hh:mm:ss A'
    : resolvedValueFormat.value
)))
const displayFormat = computed(() => resolvedFormats.value[0] ?? resolvedValueFormat.value)
const resolvedLocale = computed(() => ({
  ...zhCN.datePicker,
  ...config.value.locale?.datePicker,
  ...props.locale?.datePicker
}) as Required<NonNullable<typeof zhCN.datePicker>>)
const resolvedPlaceholder = computed(() => props.placeholder ?? ({
  date: effectiveShowTime.value ? resolvedLocale.value.selectTime : resolvedLocale.value.selectDate,
  week: resolvedLocale.value.selectWeek,
  month: resolvedLocale.value.selectMonth,
  quarter: resolvedLocale.value.selectQuarter,
  year: resolvedLocale.value.selectYear
})[props.picker])
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedVariant = computed(() => props.variant ?? config.value.variant ?? 'outlined')
const hasPrefix = computed(() => props.prefix !== undefined || Boolean(slots.prefix))
const hasValue = computed(() => selectedValues.value.length > 0)
const hasDraftValue = computed(() => Array.isArray(draftValue.value) ? draftValue.value.length > 0 : Boolean(draftValue.value))
const rootClass = computed(() => [
  `aheart-date-picker--${resolvedSize.value}`,
  `aheart-date-picker--${resolvedVariant.value}`,
  props.status && `aheart-date-picker--${props.status}`,
  { 'is-open': mergedOpen.value, 'is-disabled': isDisabled.value, 'is-multiple': props.multiple }
])

const parseDateValue = (value?: string) => value
  ? parsePickerValue(
      value,
      [resolvedValueFormat.value, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'GGGG-[W]WW', 'YYYY-MM', 'YYYY-[Q]Q', 'YYYY'],
      pickerDayjsLocale(resolvedLocale.value.locale)
    )
  : undefined
const initialPanelFallback = '2000-01-01'
const initialPanelDate = (runtimeNow?: PickerDate) => {
  const firstValue = Array.isArray(mergedValue.value) ? mergedValue.value[0] : mergedValue.value
  return parseDateValue(props.pickerValue) ?? parseDateValue(props.defaultPickerValue) ?? parseDateValue(firstValue) ?? runtimeNow ?? createPickerDate(initialPanelFallback)
}
const viewDate = ref<PickerDate>(initialPanelDate())
const focusedDate = ref<PickerDate>(initialPanelDate())
const nowDate = ref<PickerDate>()

onMounted(() => {
  nowDate.value = createPickerDate()
  const firstValue = Array.isArray(mergedValue.value) ? mergedValue.value[0] : mergedValue.value
  if (!props.pickerValue && !props.defaultPickerValue && !firstValue) {
    viewDate.value = nowDate.value
    focusedDate.value = nowDate.value
    activeCellKey.value = cellKeyForDate(nowDate.value)
  }
})

const runtimeProcess = (globalThis as typeof globalThis & { process?: { env?: { NODE_ENV?: string } } }).process
if (runtimeProcess?.env?.NODE_ENV !== 'production' && props.multiple && props.showTime) {
  console.warn('[Aheart UI DatePicker] `multiple` cannot be combined with `showTime`; time selection was disabled.')
}

const formatDisplayValue = (value: string) => {
  const parsed = parseDateValue(value)
  return formatPickerValue(parsed?.locale(pickerDayjsLocale(resolvedLocale.value.locale)), displayFormat.value) ?? value
}
const committedInputText = computed(() => props.multiple ? '' : selectedValues.value[0] ? formatDisplayValue(selectedValues.value[0]) : '')
watch(committedInputText, (value) => { inputText.value = value }, { immediate: true })

const candidateValues = computed(() => effectiveNeedConfirm.value
  ? Array.isArray(draftValue.value) ? draftValue.value : draftValue.value ? [draftValue.value] : []
  : selectedValues.value)

interface PanelCell {
  id: string
  key: string
  value: string
  text: string
  date: PickerDate
  inView: boolean
  today: boolean
  selected: boolean
  disabled: boolean
  renderInfo: DatePickerCellRenderInfo
}

const minDateValue = computed(() => parsePickerValue(props.minDate, 'YYYY-MM-DD'))
const maxDateValue = computed(() => parsePickerValue(props.maxDate, 'YYYY-MM-DD'))
const isDateDisabled = (date: PickerDate) => isPickerDateDisabled(date, {
  min: minDateValue.value,
  max: maxDateValue.value,
  disabledDate: (current) => Boolean(props.disabledDate?.(
    formatPickerValue(current, 'YYYY-MM-DD')!,
    { type: props.picker }
  ))
})
const modelValueForDate = (date: PickerDate) => formatPickerValue(date, resolvedValueFormat.value)!
const cellValueForDate = (date: PickerDate) => formatPickerValue(date, defaultValueFormat(props.picker))!
const cellKeyForDate = (date: PickerDate) => formatPickerValue(date, props.picker === 'date' || props.picker === 'week'
  ? 'YYYY-MM-DD'
  : defaultValueFormat(props.picker)) ?? ''
const isCellSelected = (date: PickerDate) => effectiveShowTime.value
  ? candidateValues.value.some((value) => parseDateValue(value)?.isSame(date, 'day'))
  : candidateValues.value.includes(modelValueForDate(date))
const createPanelCell = (date: PickerDate, text: string, key: string, inView = true, today = false): PanelCell => {
  const value = cellValueForDate(date)
  const disabled = isDateDisabled(date)
  const selected = isCellSelected(date)
  return {
    id: `${panelId}-${key.replace(/[^a-zA-Z0-9]/g, '')}`,
    key,
    value,
    text,
    date,
    inView,
    today,
    selected,
    disabled,
    renderInfo: { mode: props.picker, text, value, selected, disabled }
  }
}

const panelCells = computed<PanelCell[]>(() => {
  if (props.picker === 'date' || props.picker === 'week') {
    return createDateMatrix(viewDate.value, resolvedLocale.value.weekStartsOn, nowDate.value).map((cell) =>
      createPanelCell(cell.value, String(cell.value.date()), formatPickerValue(cell.value, 'YYYY-MM-DD')!, cell.inView, cell.today)
    )
  }
  if (props.picker === 'month') {
    return Array.from({ length: 12 }, (_, month) => {
      const date = viewDate.value.month(month).startOf('month')
      return createPanelCell(date, resolvedLocale.value.monthsShort[month]!, formatPickerValue(date, 'YYYY-MM')!)
    })
  }
  if (props.picker === 'quarter') {
    return Array.from({ length: 4 }, (_, quarter) => {
      const date = viewDate.value.month(quarter * 3).startOf('month')
      return createPanelCell(date, `Q${quarter + 1}`, formatPickerValue(date, 'YYYY-[Q]Q')!)
    })
  }
  const decadeStart = Math.floor(viewDate.value.year() / 10) * 10 - 1
  return Array.from({ length: 12 }, (_, index) => {
    const date = viewDate.value.year(decadeStart + index).startOf('year')
    return createPanelCell(date, String(date.year()), formatPickerValue(date, 'YYYY')!, index > 0 && index < 11)
  })
})

const panelTitle = computed(() => {
  if (props.picker === 'date' || props.picker === 'week') {
    const localized = viewDate.value.locale(pickerDayjsLocale(resolvedLocale.value.locale))
    return resolvedLocale.value.monthTitle(localized.year(), localized.month() + 1, localized.format('MMMM'))
  }
  if (props.picker === 'year') {
    const start = Math.floor(viewDate.value.year() / 10) * 10
    return `${start} - ${start + 9}`
  }
  return String(viewDate.value.year())
})
const activeCell = computed(() => panelCells.value.find((cell) => cell.key === activeCellKey.value) ?? panelCells.value.find((cell) => cell.inView && !cell.disabled))
const activeCellId = computed(() => activeCell.value?.id)

const motion = useMotionPresence(mergedOpen, { destroyOnHidden: true, duration: 120 })
const popupContainer = computed(() => {
  if (!triggerRef.value) return false
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
  `is-${motion.phase.value}`,
  { 'has-presets': props.presets?.length, 'has-time': effectiveShowTime.value }
])
const panelStyle = computed(() => floatingPosition.popupStyle.value)

watch(() => motion.phase.value, (phase) => {
  if (phase === 'entered') void nextTick(floatingPosition.update)
})

const syncDraft = () => {
  draftValue.value = Array.isArray(mergedValue.value) ? [...mergedValue.value] : mergedValue.value
  const panel = initialPanelDate(nowDate.value)
  if (!isPanelControlled.value) viewDate.value = panel
  focusedDate.value = panel
  activeCellKey.value = cellKeyForDate(panel)
}
let restoreFocusOnClose = false
const requestOpen = (nextOpen: boolean, restoreFocus = false) => {
  if (nextOpen && (isDisabled.value || props.readOnly)) return
  if (!nextOpen) restoreFocusOnClose = restoreFocus
  if (!isOpenControlled.value) internalOpen.value = nextOpen
  emit('openChange', nextOpen)
}
let restoringFocus = false
const handleFocus = () => {
  if (restoringFocus) return
  requestOpen(true)
}
watch(mergedOpen, (open, wasOpen) => {
  if (open) {
    syncDraft()
    return
  }
  if (wasOpen) {
    draftValue.value = undefined
    const shouldRestoreFocus = restoreFocusOnClose
    restoreFocusOnClose = false
    if (shouldRestoreFocus) {
      void nextTick(() => {
        restoringFocus = true
        inputRef.value?.focus()
        queueMicrotask(() => { restoringFocus = false })
      })
    }
  }
}, { immediate: true })
useFloatingDismiss({
  open: mergedOpen,
  trigger: triggerRef,
  floating: panelRef,
  onDismiss: (reason) => requestOpen(false, reason === 'escape'),
  restoreFocus: false
})

const commitValue = (value: DatePickerValue, close = true) => {
  const normalized = Array.isArray(value) ? normalizeMultipleValues(value) : value
  if (!isValueControlled.value) internalValue.value = normalized
  emit('update:modelValue', normalized)
  emit('change', normalized)
  if (isValueControlled.value) {
    void nextTick(() => { inputText.value = committedInputText.value })
  }
  liveMessage.value = Array.isArray(normalized)
    ? normalized.map(formatDisplayValue).join(', ')
    : normalized ? resolvedLocale.value.selected(normalized) : ''
  if (close) {
    requestOpen(false, true)
  }
}

const toggleMultipleValue = (value: string) => {
  const base = effectiveNeedConfirm.value
    ? Array.isArray(draftValue.value) ? draftValue.value : []
    : selectedValues.value
  const next = base.includes(value) ? base.filter((item) => item !== value) : [...base, value]
  if (effectiveNeedConfirm.value) draftValue.value = next
  else commitValue(next, false)
}
const removeMultipleValue = (value: string) => {
  if (isDisabled.value || props.readOnly) return
  commitValue(selectedValues.value.filter((item) => item !== value), false)
}

const currentDraftDate = () => {
  const value = Array.isArray(draftValue.value) ? draftValue.value[0] : draftValue.value
  const base = parseDateValue(value) ?? parseDateValue(props.defaultPickerValue) ?? viewDate.value
  const defaultTime = showTimeOptions.value.defaultValue
    ? parsePickerValue(showTimeOptions.value.defaultValue, showTimeOptions.value.format ?? 'HH:mm:ss')
    : undefined
  return value || !defaultTime
    ? base
    : base.hour(defaultTime.hour()).minute(defaultTime.minute()).second(defaultTime.second())
}
const applyDraftTime = (date: PickerDate) => {
  const time = currentDraftDate()
  return date.hour(time.hour()).minute(time.minute()).second(time.second())
}
const selectCell = (cell: PanelCell) => {
  if (cell.disabled || isDisabled.value || props.readOnly) return
  focusedDate.value = cell.date
  const selectedDate = effectiveShowTime.value ? applyDraftTime(cell.date) : cell.date
  const value = modelValueForDate(selectedDate)
  if (props.multiple) {
    toggleMultipleValue(value)
    return
  }
  if (effectiveNeedConfirm.value) {
    draftValue.value = value
    liveMessage.value = resolvedLocale.value.selected(value)
  } else commitValue(value)
}

const draftDate = computed(() => currentDraftDate())
const draftTime = computed(() => ({ hour: draftDate.value.hour(), minute: draftDate.value.minute(), second: draftDate.value.second() }))
const displayedDraftHour = computed(() => showTimeOptions.value.use12Hours ? draftTime.value.hour % 12 || 12 : draftTime.value.hour)
const draftPeriod = computed(() => draftTime.value.hour >= 12 ? 'PM' : 'AM')
const updateTimePart = (part: 'hour' | 'minute' | 'second', event: Event) => {
  const maximum = part === 'hour' ? (showTimeOptions.value.use12Hours ? 12 : 23) : 59
  const configuredStep = part === 'hour'
    ? showTimeOptions.value.hourStep ?? 1
    : part === 'minute'
      ? showTimeOptions.value.minuteStep ?? 1
      : showTimeOptions.value.secondStep ?? 1
  const step = Number.isFinite(configuredStep) && configuredStep > 0 ? Math.max(1, Math.floor(configuredStep)) : 1
  const rawValue = Math.max(0, Math.min(maximum, Number((event.target as HTMLInputElement).value) || 0))
  let normalizedHour: number | undefined
  let value: number
  if (part === 'hour' && showTimeOptions.value.use12Hours) {
    const rawHour = Math.max(1, rawValue)
    const hour24 = rawHour % 12 + (draftPeriod.value === 'PM' ? 12 : 0)
    normalizedHour = Math.max(0, Math.min(23, hour24))
    value = normalizedHour % 12 || 12
  } else {
    const maximumStepValue = Math.floor(maximum / step) * step
    value = Math.max(0, Math.min(maximumStepValue, Math.round(rawValue / step) * step))
  }
  ;(event.target as HTMLInputElement).value = String(value)
  const next = part === 'hour'
    ? draftDate.value.hour(normalizedHour ?? value)
    : part === 'minute'
      ? draftDate.value.minute(value)
      : draftDate.value.second(value)
  draftValue.value = modelValueForDate(next)
}
const updateTimePeriod = (event: Event) => {
  const period = (event.target as HTMLSelectElement).value
  const hour = draftTime.value.hour % 12 + (period === 'PM' ? 12 : 0)
  draftValue.value = modelValueForDate(draftDate.value.hour(hour))
}
const confirmDraft = () => {
  if (!hasDraftValue.value) return
  const value = Array.isArray(draftValue.value) ? [...draftValue.value] : draftValue.value
  commitValue(value)
  emit('ok', value)
}

const selectToday = () => {
  const today = nowDate.value ?? createPickerDate()
  const cell = createPanelCell(today, String(today.date()), formatPickerValue(today, 'YYYY-MM-DD')!)
  selectCell(cell)
}
const selectPreset = (index: number) => {
  const preset = props.presets?.[index]
  if (!preset) return
  const value = typeof preset.value === 'function' ? preset.value() : preset.value
  const values = Array.isArray(value) ? value : value ? [value] : []
  const invalidValue = values.find((item) => {
    const parsed = parseDateValue(item)
    return !parsed || isDateDisabled(parsed)
  })
  if (invalidValue) {
    emit('invalid', invalidValue)
    return
  }
  if (effectiveNeedConfirm.value) draftValue.value = Array.isArray(value) ? [...value] : value
  else commitValue(value, props.multiple ? false : true)
}

const clearValue = () => {
  if (isDisabled.value || props.readOnly) return
  const empty = props.multiple ? [] : undefined
  commitValue(empty, false)
  emit('clear')
  requestOpen(false, true)
}

const moveView = (offset: number, yearJump = false) => {
  const unit = yearJump ? (props.picker === 'year' ? 'year' : 'year') : (props.picker === 'date' || props.picker === 'week' ? 'month' : 'year')
  const amount = yearJump && props.picker === 'year' ? offset * 10 : offset
  const next = viewDate.value.add(amount, unit)
  if (!isPanelControlled.value) viewDate.value = next
  emit('panelChange', formatPickerValue(next, 'YYYY-MM-DD')!, props.picker)
}

const applyInputMask = (value: string) => {
  const tokenNames = ['YYYY', 'GGGG', 'MM', 'DD', 'HH', 'hh', 'mm', 'ss', 'WW', 'Q', 'A'] as const
  const parts: Array<{ value: string; token: boolean }> = []
  for (let index = 0; index < displayFormat.value.length;) {
    if (displayFormat.value[index] === '[') {
      const end = displayFormat.value.indexOf(']', index + 1)
      if (end >= 0) {
        parts.push({ value: displayFormat.value.slice(index + 1, end), token: false })
        index = end + 1
        continue
      }
    }
    const token = tokenNames.find((name) => displayFormat.value.startsWith(name, index))
    if (token) {
      parts.push({ value: token, token: true })
      index += token.length
    } else {
      parts.push({ value: displayFormat.value[index]!, token: false })
      index += 1
    }
  }
  const allowedLiterals = new Set(parts.filter((part) => !part.token).flatMap((part) => [...part.value]))
  if (resolvedFormats.value.length > 1) {
    const requiredDigits = parts.reduce((total, part) => total + (part.token && part.value !== 'A' ? (part.value === 'Q' ? 1 : part.value.length) : 0), 0)
    if (/^\d+$/.test(value) && value.length < requiredDigits) return value
    if (/\D/.test(value)) return value
  }
  const inputLiterals = value.replace(/[\dA-Za-z]/g, '')
  if ([...inputLiterals].some((literal) => !allowedLiterals.has(literal))) return value
  const digits = value.replace(/\D/g, '')
  const period = value.match(/(?:AM|PM)/i)?.[0]?.toUpperCase()
  let digitIndex = 0
  let output = ''
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]!
    const tokenLength = part.token && part.value !== 'A' ? (part.value === 'Q' ? 1 : part.value.length) : 0
    if (tokenLength) {
      const segment = digits.slice(digitIndex, digitIndex + tokenLength)
      if (!segment) break
      output += segment
      digitIndex += segment.length
      if (segment.length < tokenLength) break
    } else if (part.token && part.value === 'A') {
      if (period) output += period
    } else if (digitIndex > 0 && (digitIndex < digits.length || index < parts.length - 1)) output += part.value
  }
  return output
}
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const masked = applyInputMask(target.value)
  target.value = masked
  inputText.value = masked
}
const restoreInput = async () => {
  inputText.value = ''
  await nextTick()
  inputText.value = committedInputText.value
}
const handleInputChange = async () => {
  const value = inputText.value.trim()
  if (!value) return clearValue()
  const parsed = parsePickerValue(value, resolvedFormats.value, pickerDayjsLocale(resolvedLocale.value.locale))
  if (!parsed || isDateDisabled(parsed)) {
    emit('invalid', value)
    await restoreInput()
    return
  }
  const parsedValue = formatPickerValue(parsed, resolvedValueFormat.value)!
  if (effectiveNeedConfirm.value) {
    if (!mergedOpen.value) {
      requestOpen(true)
      await nextTick()
      if (!mergedOpen.value) {
        await restoreInput()
        return
      }
    }
    draftValue.value = parsedValue
    liveMessage.value = resolvedLocale.value.selected(parsedValue)
    return
  }
  commitValue(parsedValue)
}

const moveFocusedDate = (key: string) => {
  const dateOffsets: Record<string, [number, 'day' | 'month' | 'year']> = {
    ArrowLeft: [props.picker === 'quarter' ? -3 : -1, props.picker === 'date' || props.picker === 'week' ? 'day' : props.picker === 'year' ? 'year' : 'month'],
    ArrowRight: [props.picker === 'quarter' ? 3 : 1, props.picker === 'date' || props.picker === 'week' ? 'day' : props.picker === 'year' ? 'year' : 'month'],
    ArrowUp: [props.picker === 'date' || props.picker === 'week' ? -7 : props.picker === 'year' || props.picker === 'month' ? -3 : -6, props.picker === 'date' || props.picker === 'week' ? 'day' : props.picker === 'year' ? 'year' : 'month'],
    ArrowDown: [props.picker === 'date' || props.picker === 'week' ? 7 : props.picker === 'year' || props.picker === 'month' ? 3 : 6, props.picker === 'date' || props.picker === 'week' ? 'day' : props.picker === 'year' ? 'year' : 'month']
  }
  const [offset, unit] = dateOffsets[key]!
  const next = focusedDate.value.add(offset, unit)
  const panelIdentity = (date: PickerDate) => props.picker === 'date' || props.picker === 'week'
    ? date.format('YYYY-MM')
    : props.picker === 'year'
      ? String(Math.floor(date.year() / 10))
      : String(date.year())
  const changesPanel = panelIdentity(next) !== panelIdentity(viewDate.value)
  if (changesPanel && isPanelControlled.value) {
    emit('panelChange', formatPickerValue(next, 'YYYY-MM-DD')!, props.picker)
    return
  }
  focusedDate.value = next
  if (changesPanel) {
    viewDate.value = next
    emit('panelChange', formatPickerValue(next, 'YYYY-MM-DD')!, props.picker)
  }
  activeCellKey.value = cellKeyForDate(next)
}
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (!event.defaultPrevented) {
      event.preventDefault()
      requestOpen(false, true)
    }
    return
  }
  if (event.key.startsWith('Arrow')) {
    event.preventDefault()
    if (!mergedOpen.value) requestOpen(true)
    if (!mergedOpen.value) return
    moveFocusedDate(event.key)
    return
  }
  if (event.key === 'Enter' && mergedOpen.value) {
    event.preventDefault()
    if (inputText.value.trim() !== committedInputText.value) {
      void handleInputChange()
      return
    }
    const cell = createPanelCell(focusedDate.value, String(focusedDate.value.date()), formatPickerValue(focusedDate.value, 'YYYY-MM-DD')!)
    selectCell(cell)
  }
}
const handleSelectorMouseDown = (event: MouseEvent) => {
  if ((event.target as HTMLElement).closest('button')) return
  const inputWasFocused = typeof document !== 'undefined' && document.activeElement === inputRef.value
  if (event.target !== inputRef.value) inputRef.value?.focus()
  if (inputWasFocused && !mergedOpen.value) requestOpen(true)
}

watch(() => props.pickerValue, (value) => {
  const next = parseDateValue(value)
  if (next) viewDate.value = next
})

watch(mergedValue, (value) => {
  if (!mergedOpen.value || !effectiveNeedConfirm.value) return
  draftValue.value = Array.isArray(value) ? [...value] : value
}, { deep: true })

const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()
defineExpose({ focus, blur })
</script>
