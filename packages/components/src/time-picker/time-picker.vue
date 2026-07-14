<template>
  <span ref="rootRef" class="aheart-time-picker" :class="{ 'is-open': mergedOpen, 'is-disabled': disabled }">
    <span ref="triggerRef" class="aheart-time-picker__selector">
      <input
        ref="inputRef"
        class="aheart-time-picker__input"
        :id="id"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        role="combobox"
        :aria-labelledby="resolvedAriaLabelledby"
        :aria-controls="panelId"
        :aria-expanded="mergedOpen ? 'true' : 'false'"
        aria-haspopup="dialog"
        :aria-activedescendant="mergedOpen ? activeDescendantId : undefined"
        @focus="requestOpen(true)"
        @change="handleInputChange"
        @keydown="handleKeydown"
      />
      <button
        v-if="allowClear && displayValue && !disabled && !readOnly"
        class="aheart-time-picker__clear"
        type="button"
        aria-label="Clear time"
        @click="clearValue"
      ><AIcon name="close" :size="14" /></button>
      <AIcon class="aheart-time-picker__suffix" name="clock" :size="16" aria-hidden="true" />
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
        aria-label="Choose time"
        :aria-hidden="motion.phase.value === 'hidden' ? 'true' : undefined"
        @mousedown.prevent
      >
        <div class="aheart-time-picker__columns">
          <div ref="hourColumnRef" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'hour' }" role="listbox" aria-label="Hour">
            <button
              v-for="hour in hourOptions"
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
          <div ref="minuteColumnRef" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'minute' }" role="listbox" aria-label="Minute">
            <button
              v-for="minute in minuteOptions"
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
          <div v-if="showSeconds" ref="secondColumnRef" class="aheart-time-picker__column" :class="{ 'is-keyboard-active': activeColumn === 'second' }" role="listbox" aria-label="Second">
            <button
              v-for="second in secondOptions"
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
          <div v-if="showPeriod" ref="periodColumnRef" class="aheart-time-picker__column aheart-time-picker__column--period" :class="{ 'is-keyboard-active': activeColumn === 'period' }" role="listbox" aria-label="Period">
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
            >{{ period }}</button>
          </div>
        </div>
        <div v-if="showNow || needConfirm" class="aheart-time-picker__footer">
          <button v-if="showNow" class="aheart-time-picker__now" type="button" :disabled="isInteractionDisabled" @click="selectNow">此刻</button>
          <button v-if="needConfirm" class="aheart-time-picker__confirm" type="button" :disabled="isInteractionDisabled" @click="confirmValue">确定</button>
        </div>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import AIcon from '../icon/icon.vue'
import { useFloatingDismiss } from '../utils/use-floating-dismiss'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import { usePropPresence } from '../utils/use-prop-presence'
import { timePickerEmits, timePickerProps, type DisabledTimeConfig } from './types'
import './style.css'

defineOptions({ name: 'ATimePicker' })

interface TimeParts {
  hour: number
  minute: number
  second: number
}

type TimeColumn = 'hour' | 'minute' | 'second' | 'period'

const props = defineProps(timePickerProps)
const emit = defineEmits(timePickerEmits)
const attrs = useAttrs()
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
const mergedValue = computed(() => isValueControlled.value ? props.modelValue : internalValue.value)
const mergedOpen = computed(() => Boolean(isOpenControlled.value ? props.open : internalOpen.value))
const resolvedAriaLabelledby = computed(() => props.labelledBy ?? props.ariaLabelledby ?? attrs['aria-labelledby'] as string | undefined)
const showSeconds = computed(() => props.format.includes('ss'))
const showPeriod = computed(() => props.use12Hours || props.format.includes('A'))
const pad = (value: number) => String(value).padStart(2, '0')
const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value))

const parseTime = (value?: string): TimeParts | undefined => {
  if (!value) return undefined
  const match = value.trim().match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s*(AM|PM))?$/i)
  if (!match) return undefined
  let hour = Number(match[1])
  const period = match[4]?.toUpperCase()
  if (period && hour <= 12) {
    hour = hour % 12 + (period === 'PM' ? 12 : 0)
  }
  if (hour > 23) return undefined
  return { hour, minute: Number(match[2]), second: Number(match[3] ?? 0) }
}

const formatTime = (parts: TimeParts) => {
  const hour12 = parts.hour % 12 || 12
  const period = parts.hour >= 12 ? 'PM' : 'AM'
  return props.format
    .replace('HH', pad(parts.hour))
    .replace('hh', pad(hour12))
    .replace('mm', pad(parts.minute))
    .replace('ss', pad(parts.second))
    .replace('A', period)
}

const initialParts = () => parseTime(mergedValue.value) ?? { hour: 0, minute: 0, second: 0 }
const draft = ref<TimeParts>(initialParts())
const displayValue = computed(() => {
  const parts = parseTime(mergedValue.value)
  return parts ? formatTime(parts) : mergedValue.value ?? ''
})
const displayedHour = computed(() => showPeriod.value ? draft.value.hour % 12 || 12 : draft.value.hour)
const selectedPeriod = computed<'AM' | 'PM'>(() => draft.value.hour >= 12 ? 'PM' : 'AM')
const isInteractionDisabled = computed(() => props.disabled || props.readOnly)
const normalizeStep = (step: number, limit: number) => Math.max(1, Math.min(limit, Math.floor(step) || 1))
const createOptions = (limit: number, step: number, start = 0) => {
  const normalizedStep = normalizeStep(step, limit)
  const values: number[] = []
  for (let value = start; value < limit + start; value += normalizedStep) values.push(value)
  return values
}
const hourOptions = computed(() => showPeriod.value
  ? createOptions(12, props.hourStep, 1).filter((hour) => hour <= 12)
  : createOptions(24, props.hourStep))
const minuteOptions = computed(() => createOptions(60, props.minuteStep))
const secondOptions = computed(() => createOptions(60, props.secondStep))
const visibleColumns = computed<TimeColumn[]>(() => [
  'hour',
  'minute',
  ...(showSeconds.value ? ['second' as const] : []),
  ...(showPeriod.value ? ['period' as const] : [])
])
const getTimeOptionId = (column: TimeColumn, value: number | string) => `aheart-time-${instanceId}-${column}-${String(value).toLowerCase()}`
const activeDescendantId = computed(() => {
  if (activeColumn.value === 'hour') return getTimeOptionId('hour', displayedHour.value)
  if (activeColumn.value === 'minute') return getTimeOptionId('minute', draft.value.minute)
  if (activeColumn.value === 'second') return getTimeOptionId('second', draft.value.second)
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
const isPartsDisabled = (parts: TimeParts) => Boolean(
  disabledConfig.value?.disabledHours?.().includes(parts.hour) ||
  disabledConfig.value?.disabledMinutes?.(parts.hour).includes(parts.minute) ||
  disabledConfig.value?.disabledSeconds?.(parts.hour, parts.minute).includes(parts.second) ||
  legacyDisabled.value?.(formatTime(parts))
)
const toHour24 = (hour: number) => showPeriod.value
  ? hour % 12 + (selectedPeriod.value === 'PM' ? 12 : 0)
  : hour
const isHourDisabled = (hour: number) => {
  const hour24 = toHour24(hour)
  return Boolean(disabledConfig.value?.disabledHours?.().includes(hour24)) || Boolean(legacyDisabled.value?.(formatTime({ ...draft.value, hour: hour24 })))
}
const isMinuteDisabled = (minute: number) =>
  Boolean(disabledConfig.value?.disabledMinutes?.(draft.value.hour).includes(minute)) || Boolean(legacyDisabled.value?.(formatTime({ ...draft.value, minute })))
const isSecondDisabled = (second: number) =>
  Boolean(disabledConfig.value?.disabledSeconds?.(draft.value.hour, draft.value.minute).includes(second)) || Boolean(legacyDisabled.value?.(formatTime({ ...draft.value, second })))
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
}
const scrollSelectedOptionsIntoView = () => {
  for (const column of [hourColumnRef.value, minuteColumnRef.value, secondColumnRef.value, periodColumnRef.value]) {
    column?.querySelector<HTMLElement>('.is-selected')?.scrollIntoView?.({ block: 'center' })
  }
}
const requestOpen = (open: boolean) => {
  if (isInteractionDisabled.value) return
  if (!isOpenControlled.value) internalOpen.value = open
  emit('openChange', open)
  if (open) {
    syncDraft()
    activeColumn.value = 'hour'
  }
}
const commitValue = (parts: TimeParts, close = true) => {
  if (isInteractionDisabled.value || isPartsDisabled(parts)) return false
  const value = formatTime(parts)
  if (!isValueControlled.value) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
  if (close) requestOpen(false)
  return true
}
const selectHour = (hour: number) => {
  if (isInteractionDisabled.value || isHourDisabled(hour)) return
  draft.value = { ...draft.value, hour: toHour24(hour) }
}
const selectMinute = (minute: number) => {
  if (isInteractionDisabled.value || isMinuteDisabled(minute)) return
  draft.value = { ...draft.value, minute }
  if (!props.needConfirm && !showSeconds.value) commitValue(draft.value)
}
const selectSecond = (second: number) => {
  if (isInteractionDisabled.value || isSecondDisabled(second)) return
  draft.value = { ...draft.value, second }
  if (!props.needConfirm) commitValue(draft.value)
}
const selectPeriod = (period: 'AM' | 'PM') => {
  if (isInteractionDisabled.value || isPeriodDisabled(period)) return
  const hour12 = draft.value.hour % 12
  draft.value = { ...draft.value, hour: hour12 + (period === 'PM' ? 12 : 0) }
}
const confirmValue = () => commitValue(draft.value)
const selectNow = () => {
  if (isInteractionDisabled.value) return
  const now = new Date()
  draft.value = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() }
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
  if (!parts || !commitValue(parts)) input.value = displayValue.value
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
    moveToOption(hourOptions.value, displayedHour.value, direction, isHourDisabled, (hour) => {
      draft.value = { ...draft.value, hour: toHour24(hour) }
    })
  } else if (activeColumn.value === 'minute') {
    moveToOption(minuteOptions.value, draft.value.minute, direction, isMinuteDisabled, (minute) => {
      draft.value = { ...draft.value, minute }
    })
  } else if (activeColumn.value === 'second') {
    moveToOption(secondOptions.value, draft.value.second, direction, isSecondDisabled, (second) => {
      draft.value = { ...draft.value, second }
    })
  } else {
    moveToOption<Array<'AM' | 'PM'>[number]>(['AM', 'PM'], selectedPeriod.value, direction, isPeriodDisabled, (period) => {
      const hour12 = draft.value.hour % 12
      const next = { ...draft.value, hour: hour12 + (period === 'PM' ? 12 : 0) }
      if (!isPartsDisabled(next)) draft.value = next
    })
  }
  void nextTick(scrollSelectedOptionsIntoView)
}
const handleKeydown = (event: KeyboardEvent) => {
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
  } else if (event.key === 'Escape' && mergedOpen.value) {
    event.preventDefault()
    requestOpen(false)
    void nextTick(() => inputRef.value?.focus())
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
