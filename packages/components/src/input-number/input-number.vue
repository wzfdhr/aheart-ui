<template>
  <span ref="rootRef" class="aheart-input-number" :class="inputNumberClass" :style="rootStyle" v-bind="rootAttrs">
    <span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
      <slot name="prefix">
        <AInputNumberRenderNode :node="prefix" />
      </slot>
    </span>
    <input
      v-bind="inputAttrs"
      class="aheart-input-number__control"
      ref="inputRef"
      :class="controlClass"
      :style="controlStyle"
      :id="id"
      :type="inputType"
      :inputmode="inputMode"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readOnly"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      @keydown="handleKeydown"
      @blur="handleBlur"
      @wheel="handleWheel"
    />
    <span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
      <slot name="suffix">
        <AInputNumberRenderNode :node="suffix" />
      </slot>
    </span>
    <span v-if="showControls" :class="actionsClass" :style="actionsStyle">
      <button
        class="aheart-input-number__increase"
        :class="actionClass"
        :style="actionStyle"
        type="button"
        aria-label="Increase"
        :disabled="isInteractiveDisabled"
        @click="handleStep(resolvedStep, 'up', 'handler')"
      >
        <slot name="increaseIcon">
          <AInputNumberRenderNode :node="increaseIcon" />
        </slot>
      </button>
      <button
        class="aheart-input-number__decrease"
        :class="actionClass"
        :style="actionStyle"
        type="button"
        aria-label="Decrease"
        :disabled="isInteractiveDisabled"
        @click="handleStep(-resolvedStep, 'down', 'handler')"
      >
        <slot name="decreaseIcon">
          <AInputNumberRenderNode :node="decreaseIcon" />
        </slot>
      </button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref, useAttrs, useSlots } from 'vue'
import type { InputHTMLAttributes, PropType, StyleValue, VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputNumberEmits, inputNumberProps } from './types'
import type { InputNumberFocusOptions, InputNumberSemanticInfo, InputNumberSemanticRecord, InputNumberValue } from './types'
import './style.css'

defineOptions({
  name: 'AInputNumber',
  inheritAttrs: false
})

const props = defineProps(inputNumberProps)
const emit = defineEmits(inputNumberEmits)
const config = useAheartConfig()
const attrs = useAttrs()
const slots = useSlots()
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const uncontrolledValue = ref<InputNumberValue | undefined>(props.defaultValue)
const pendingInputText = ref<string | undefined>(undefined)
const pendingInputValue = ref<InputNumberValue | undefined>(undefined)
const hasPendingInputValue = ref(false)

const AInputNumberRenderNode = defineComponent({
  name: 'AInputNumberRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const hasRenderable = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== undefined && value !== null && value !== false && value !== true && value !== ''
}

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
const mergedValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : props.value !== undefined ? props.value : uncontrolledValue.value
)
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
const resolvedStep = computed(() => {
  const value = Number(props.step)
  return Number.isFinite(value) ? value : 1
})
const hasPrefix = computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix))
const hasSuffix = computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix))
const semanticInfo = computed<InputNumberSemanticInfo>(() => ({ props }))
const resolvedClassNames = computed<InputNumberSemanticRecord<string>>(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const resolvedStyles = computed<InputNumberSemanticRecord<StyleValue>>(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const shouldUseDecimalSeparator = computed(() => Boolean(props.decimalSeparator && props.decimalSeparator !== '.'))
const formatDecimalSeparator = (value: string) =>
  shouldUseDecimalSeparator.value ? value.replace('.', props.decimalSeparator as string) : value
const parseDecimalSeparator = (value: string) =>
  shouldUseDecimalSeparator.value ? value.split(props.decimalSeparator as string).join('.') : value
const plainDecimalPattern = /^[+-]?(?:\d+\.?\d*|\.\d+)$/

const isPlainDecimalString = (value: string) => plainDecimalPattern.test(value.trim())
const stripLeadingZeros = (value: string) => value.replace(/^0+(?=\d)/, '') || '0'
const stripTrailingZeros = (value: string) => value.replace(/0+$/, '')

const splitDecimal = (value: string) => {
  const trimmedValue = value.trim()
  const sign = trimmedValue.startsWith('-') ? -1 : 1
  const unsignedValue = trimmedValue.replace(/^[+-]/, '')
  const [integer = '0', fraction = ''] = unsignedValue.split('.')

  return {
    sign,
    integer: stripLeadingZeros(integer || '0'),
    fraction
  }
}

const padRight = (value: string, length: number) => value + '0'.repeat(Math.max(0, length - value.length))
const compareDigits = (left: string, right: string) => {
  const normalizedLeft = stripLeadingZeros(left)
  const normalizedRight = stripLeadingZeros(right)

  if (normalizedLeft.length !== normalizedRight.length) {
    return normalizedLeft.length > normalizedRight.length ? 1 : -1
  }

  return normalizedLeft === normalizedRight ? 0 : normalizedLeft > normalizedRight ? 1 : -1
}

const addDigits = (left: string, right: string) => {
  let carry = 0
  let result = ''
  let leftIndex = left.length - 1
  let rightIndex = right.length - 1

  while (leftIndex >= 0 || rightIndex >= 0 || carry > 0) {
    const sum = Number(left[leftIndex] ?? 0) + Number(right[rightIndex] ?? 0) + carry
    result = String(sum % 10) + result
    carry = Math.floor(sum / 10)
    leftIndex -= 1
    rightIndex -= 1
  }

  return stripLeadingZeros(result)
}

const subtractDigits = (left: string, right: string) => {
  let borrow = 0
  let result = ''
  let leftIndex = left.length - 1
  let rightIndex = right.length - 1

  while (leftIndex >= 0) {
    let digit = Number(left[leftIndex]) - borrow - Number(right[rightIndex] ?? 0)
    borrow = 0

    if (digit < 0) {
      digit += 10
      borrow = 1
    }

    result = String(digit) + result
    leftIndex -= 1
    rightIndex -= 1
  }

  return stripLeadingZeros(result)
}

const toScaledDecimal = (value: string, scale: number) => {
  const decimal = splitDecimal(value)

  return {
    sign: decimal.sign,
    digits: stripLeadingZeros(`${decimal.integer}${padRight(decimal.fraction, scale)}`)
  }
}

const formatScaledDecimal = (sign: number, digits: string, scale: number) => {
  const normalizedDigits = stripLeadingZeros(digits)

  if (/^0+$/.test(normalizedDigits)) {
    return '0'
  }

  const paddedDigits = normalizedDigits.padStart(scale + 1, '0')
  const integer = scale > 0 ? paddedDigits.slice(0, -scale) : paddedDigits
  const fraction = scale > 0 ? stripTrailingZeros(paddedDigits.slice(-scale)) : ''
  const signPrefix = sign < 0 ? '-' : ''

  return `${signPrefix}${stripLeadingZeros(integer)}${fraction ? `.${fraction}` : ''}`
}

const addDecimalStrings = (left: string, right: string) => {
  if (!isPlainDecimalString(left) || !isPlainDecimalString(right)) {
    return String(Number(left) + Number(right))
  }

  const leftParts = splitDecimal(left)
  const rightParts = splitDecimal(right)
  const scale = Math.max(leftParts.fraction.length, rightParts.fraction.length)
  const scaledLeft = toScaledDecimal(left, scale)
  const scaledRight = toScaledDecimal(right, scale)

  if (scaledLeft.sign === scaledRight.sign) {
    return formatScaledDecimal(scaledLeft.sign, addDigits(scaledLeft.digits, scaledRight.digits), scale)
  }

  const comparison = compareDigits(scaledLeft.digits, scaledRight.digits)

  if (comparison === 0) {
    return '0'
  }

  return comparison > 0
    ? formatScaledDecimal(scaledLeft.sign, subtractDigits(scaledLeft.digits, scaledRight.digits), scale)
    : formatScaledDecimal(scaledRight.sign, subtractDigits(scaledRight.digits, scaledLeft.digits), scale)
}

const negateDecimalString = (value: string) => {
  const trimmedValue = value.trim()

  if (Number(trimmedValue) === 0) {
    return '0'
  }

  return trimmedValue.startsWith('-') ? trimmedValue.slice(1) : `-${trimmedValue}`
}

const compareDecimalStrings = (left: string, right: string) => {
  if (!isPlainDecimalString(left) || !isPlainDecimalString(right)) {
    const leftNumber = Number(left)
    const rightNumber = Number(right)
    return leftNumber === rightNumber ? 0 : leftNumber > rightNumber ? 1 : -1
  }

  const leftParts = splitDecimal(left)
  const rightParts = splitDecimal(right)

  if (leftParts.sign !== rightParts.sign) {
    return leftParts.sign > rightParts.sign ? 1 : -1
  }

  const scale = Math.max(leftParts.fraction.length, rightParts.fraction.length)
  const comparison = compareDigits(toScaledDecimal(left, scale).digits, toScaledDecimal(right, scale).digits)

  return leftParts.sign < 0 ? -comparison : comparison
}

const isValidValueString = (value: string) => isPlainDecimalString(value) && Number.isFinite(Number(value))

const displayValue = computed(() => {
  if (props.changeOnBlur && pendingInputText.value !== undefined) {
    if (props.formatter) {
      return props.formatter(hasPendingInputValue.value ? pendingInputValue.value : mergedValue.value, {
        userTyping: true,
        input: pendingInputText.value
      })
    }

    return pendingInputText.value
  }

  const input = mergedValue.value === undefined ? '' : String(mergedValue.value)

  if (props.formatter) {
    return props.formatter(mergedValue.value, {
      userTyping: false,
      input
    })
  }

  return formatDecimalSeparator(input)
})

const inputNumberClass = computed(() => [
  `aheart-input-number--${resolvedSize.value}`,
  `aheart-input-number--${resolvedVariant.value}`,
  props.className,
  props.rootClassName,
  resolvedClassNames.value.root,
  {
    [`aheart-input-number--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])
const rootStyle = computed(() => [props.style, resolvedStyles.value.root])
const controlClass = computed(() => resolvedClassNames.value.input)
const controlStyle = computed(() => resolvedStyles.value.input)
const prefixClass = computed(() => ['aheart-input-number__prefix', resolvedClassNames.value.prefix])
const prefixStyle = computed(() => resolvedStyles.value.prefix)
const suffixClass = computed(() => ['aheart-input-number__suffix', resolvedClassNames.value.suffix])
const suffixStyle = computed(() => resolvedStyles.value.suffix)
const actionsClass = computed(() => ['aheart-input-number__controls', resolvedClassNames.value.actions])
const actionsStyle = computed(() => resolvedStyles.value.actions)
const actionClass = computed(() => resolvedClassNames.value.action)
const actionStyle = computed(() => resolvedStyles.value.action)
const rootAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  if (attrs.class !== undefined) {
    result.class = attrs.class
  }

  if (attrs.style !== undefined) {
    result.style = attrs.style
  }

  return result
})
const inputType = computed<InputHTMLAttributes['type']>(() =>
  typeof attrs.type === 'string' ? (attrs.type as InputHTMLAttributes['type']) : 'text'
)
const inputMode = computed<InputHTMLAttributes['inputmode']>(() => {
  const value = attrs.inputmode ?? attrs.inputMode

  return typeof value === 'string' ? (value as InputHTMLAttributes['inputmode']) : 'decimal'
})
const inputAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !['class', 'style', 'type', 'inputmode', 'inputMode'].includes(key))
  )
)

const applyPrecision = (value: number) => {
  if (props.precision === undefined) {
    return value
  }

  return Number(value.toFixed(props.precision))
}

const clampNumberValue = (value: number) => {
  const preciseValue = applyPrecision(value)

  if (props.min !== undefined && preciseValue < props.min) {
    return props.min
  }

  if (props.max !== undefined && preciseValue > props.max) {
    return props.max
  }

  return preciseValue
}

const clampStringValue = (value: string) => {
  if (props.min !== undefined && compareDecimalStrings(value, String(props.min)) < 0) {
    return String(props.min)
  }

  if (props.max !== undefined && compareDecimalStrings(value, String(props.max)) > 0) {
    return String(props.max)
  }

  return value
}

const clampValue = (value: InputNumberValue) =>
  props.stringMode ? clampStringValue(String(value)) : clampNumberValue(Number(value))

const emitValue = (value: InputNumberValue | undefined) => {
  const nextValue = props.stringMode && value !== undefined ? String(value) : value

  if (!isControlled.value) {
    uncontrolledValue.value = nextValue
  }

  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

const parseInputValue = (rawValue: string): { valid: boolean; value?: InputNumberValue } => {
  if (rawValue === '') {
    return { valid: true, value: undefined }
  }

  const parsedValue = props.parser
    ? props.parser(rawValue)
    : props.stringMode
      ? parseDecimalSeparator(rawValue)
      : Number(parseDecimalSeparator(rawValue))

  if (parsedValue === undefined) {
    return { valid: false }
  }

  if (props.stringMode) {
    const stringValue = String(parsedValue)

    if (isValidValueString(stringValue)) {
      return { valid: true, value: clampValue(stringValue) }
    }

    return { valid: false }
  }

  const numericValue = Number(parsedValue)

  if (!Number.isNaN(numericValue)) {
    return { valid: true, value: clampValue(numericValue) }
  }

  return { valid: false }
}

const resetPendingInput = () => {
  pendingInputText.value = undefined
  pendingInputValue.value = undefined
  hasPendingInputValue.value = false
}

const commitPendingInput = () => {
  if (pendingInputText.value === undefined) {
    return
  }

  if (hasPendingInputValue.value) {
    emitValue(pendingInputValue.value)
  }

  resetPendingInput()
}

const handleInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value
  const parsedInput = parseInputValue(rawValue)

  if (props.changeOnBlur) {
    pendingInputText.value = rawValue
    pendingInputValue.value = parsedInput.valid ? parsedInput.value : undefined
    hasPendingInputValue.value = parsedInput.valid
    return
  }

  if (parsedInput.valid) {
    emitValue(parsedInput.value)
  }
}

const handleStep = (offset: number, type: 'up' | 'down', emitter: 'handler' | 'keydown' | 'wheel') => {
  if (isInteractiveDisabled.value) {
    return
  }

  const baseValue = hasPendingInputValue.value ? pendingInputValue.value : mergedValue.value
  const nextValue = props.stringMode
    ? clampValue(
        addDecimalStrings(
          String(baseValue ?? 0),
          type === 'up' ? String(props.step) : negateDecimalString(String(props.step))
        )
      )
    : clampValue(Number(baseValue ?? 0) + offset)
  resetPendingInput()
  emitValue(nextValue)
  emit('step', nextValue, { offset, type, emitter })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    commitPendingInput()
    emit('pressEnter', event)
    return
  }

  if (!props.keyboard) {
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    handleStep(resolvedStep.value, 'up', 'keydown')
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    handleStep(-resolvedStep.value, 'down', 'keydown')
  }
}

const handleBlur = () => {
  commitPendingInput()
}

const handleWheel = (event: WheelEvent) => {
  if (!props.changeOnWheel || event.deltaY === 0) {
    return
  }

  event.preventDefault()
  handleStep(
    event.deltaY < 0 ? resolvedStep.value : -resolvedStep.value,
    event.deltaY < 0 ? 'up' : 'down',
    'wheel'
  )
}

const setCursor = (cursor: InputNumberFocusOptions['cursor']) => {
  if (!inputRef.value || !cursor) {
    return
  }

  const length = inputRef.value.value.length

  if (cursor === 'start') {
    inputRef.value.setSelectionRange(0, 0)
    return
  }

  if (cursor === 'end') {
    inputRef.value.setSelectionRange(length, length)
    return
  }

  inputRef.value.setSelectionRange(0, length)
}

const focus = (options?: InputNumberFocusOptions) => {
  inputRef.value?.focus({ preventScroll: options?.preventScroll })
  setCursor(options?.cursor)
}

const blur = () => {
  inputRef.value?.blur()
}

onMounted(() => {
  if (props.autoFocus) {
    focus()
  }
})

defineExpose({
  focus,
  blur,
  nativeElement: rootRef
})
</script>
