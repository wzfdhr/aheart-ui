<template>
  <span class="aheart-input-number" :class="inputNumberClass" :style="rootStyle">
    <span v-if="prefix" :class="prefixClass" :style="prefixStyle">{{ prefix }}</span>
    <input
      class="aheart-input-number__control"
      :class="controlClass"
      :style="controlStyle"
      :id="id"
      type="text"
      inputmode="decimal"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readOnly"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      @keydown="handleKeydown"
      @wheel="handleWheel"
    />
    <span v-if="suffix" :class="suffixClass" :style="suffixStyle">{{ suffix }}</span>
    <span v-if="showControls" :class="actionsClass" :style="actionsStyle">
      <button
        class="aheart-input-number__increase"
        :class="actionClass"
        :style="actionStyle"
        type="button"
        aria-label="Increase"
        :disabled="isInteractiveDisabled"
        @click="handleStep(step, 'up')"
      >
        {{ increaseIcon }}
      </button>
      <button
        class="aheart-input-number__decrease"
        :class="actionClass"
        :style="actionStyle"
        type="button"
        aria-label="Decrease"
        :disabled="isInteractiveDisabled"
        @click="handleStep(-step, 'down')"
      >
        {{ decreaseIcon }}
      </button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputNumberEmits, inputNumberProps } from './types'
import './style.css'

defineOptions({
  name: 'AInputNumber'
})

const props = defineProps(inputNumberProps)
const emit = defineEmits(inputNumberEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const isInteractiveDisabled = computed(() => isDisabled.value || props.readOnly)
const controlsConfig = computed(() =>
  typeof props.controls === 'object' && props.controls !== null ? props.controls : undefined
)
const showControls = computed(() => props.controls !== false)
const increaseIcon = computed(() => controlsConfig.value?.upIcon ?? '+')
const decreaseIcon = computed(() => controlsConfig.value?.downIcon ?? '−')
const displayValue = computed(() => {
  const input = props.modelValue === undefined ? '' : String(props.modelValue)

  if (props.formatter) {
    return props.formatter(props.modelValue, {
      userTyping: false,
      input
    })
  }

  return input
})

const inputNumberClass = computed(() => [
  `aheart-input-number--${resolvedSize.value}`,
  `aheart-input-number--${resolvedVariant.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    [`aheart-input-number--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const controlClass = computed(() => props.classNames?.input)
const controlStyle = computed(() => props.styles?.input)
const prefixClass = computed(() => ['aheart-input-number__prefix', props.classNames?.prefix])
const prefixStyle = computed(() => props.styles?.prefix)
const suffixClass = computed(() => ['aheart-input-number__suffix', props.classNames?.suffix])
const suffixStyle = computed(() => props.styles?.suffix)
const actionsClass = computed(() => ['aheart-input-number__controls', props.classNames?.actions])
const actionsStyle = computed(() => props.styles?.actions)
const actionClass = computed(() => props.classNames?.action)
const actionStyle = computed(() => props.styles?.action)

const applyPrecision = (value: number) => {
  if (props.precision === undefined) {
    return value
  }

  return Number(value.toFixed(props.precision))
}

const clampValue = (value: number) => {
  const preciseValue = applyPrecision(value)

  if (props.min !== undefined && preciseValue < props.min) {
    return props.min
  }

  if (props.max !== undefined && preciseValue > props.max) {
    return props.max
  }

  return preciseValue
}

const emitValue = (value: number | undefined) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value

  if (rawValue === '') {
    emitValue(undefined)
    return
  }

  const parsedValue = props.parser ? props.parser(rawValue) : Number(rawValue)

  if (parsedValue !== undefined && !Number.isNaN(parsedValue)) {
    emitValue(clampValue(parsedValue))
  }
}

const handleStep = (offset: number, type: 'up' | 'down') => {
  if (isInteractiveDisabled.value) {
    return
  }

  const nextValue = clampValue((props.modelValue ?? 0) + offset)
  emitValue(nextValue)
  emit('step', nextValue, { offset, type })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event)
    return
  }

  if (!props.keyboard) {
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    handleStep(props.step, 'up')
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    handleStep(-props.step, 'down')
  }
}

const handleWheel = (event: WheelEvent) => {
  if (!props.changeOnWheel || event.deltaY === 0) {
    return
  }

  event.preventDefault()
  handleStep(event.deltaY < 0 ? props.step : -props.step, event.deltaY < 0 ? 'up' : 'down')
}
</script>
