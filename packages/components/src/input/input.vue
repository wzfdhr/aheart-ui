<template>
  <span v-if="hasAddon" :class="groupClass" :style="groupStyle">
    <span
      v-if="hasAddonBefore"
      class="aheart-input__addon aheart-input__addon--before"
      :class="addonBeforeClass"
      :style="addonBeforeStyle"
    >
      <slot name="addonBefore">
        <AInputRenderNode :node="addonBefore" />
      </slot>
    </span>
    <span class="aheart-input" :class="inputClass" :style="rootStyle">
      <span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
        <slot name="prefix">
          <AInputRenderNode :node="prefix" />
        </slot>
      </span>
      <input
        class="aheart-input__control"
        :class="controlClass"
        :style="controlStyle"
        :id="id"
        :type="type"
        :value="currentValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :readonly="readOnly"
        :maxlength="maxlength"
        @input="handleInput"
        @change="handleChange"
        @keydown="handleKeydown"
      />
      <button
        v-if="showClear"
        :class="clearClass"
        :style="clearStyle"
        type="button"
        aria-label="Clear"
        @click="handleClear"
      >
        <slot name="clearIcon">
          <AInputRenderNode :node="clearIconContent" />
        </slot>
      </button>
      <span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
        <slot name="suffix">
          <AInputRenderNode :node="suffix" />
        </slot>
      </span>
      <span v-if="showCountDisplay" :class="countClass" :style="countStyle">
        <AInputRenderNode :node="countText" />
      </span>
    </span>
    <span
      v-if="hasAddonAfter"
      class="aheart-input__addon aheart-input__addon--after"
      :class="addonAfterClass"
      :style="addonAfterStyle"
    >
      <slot name="addonAfter">
        <AInputRenderNode :node="addonAfter" />
      </slot>
    </span>
  </span>
  <span v-else class="aheart-input" :class="inputClass" :style="rootStyle">
    <span v-if="hasPrefix" :class="prefixClass" :style="prefixStyle">
      <slot name="prefix">
        <AInputRenderNode :node="prefix" />
      </slot>
    </span>
    <input
      class="aheart-input__control"
      :class="controlClass"
      :style="controlStyle"
      :id="id"
      :type="type"
      :value="currentValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readOnly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @keydown="handleKeydown"
    />
    <button
      v-if="showClear"
      :class="clearClass"
      :style="clearStyle"
      type="button"
      aria-label="Clear"
      @click="handleClear"
    >
      <slot name="clearIcon">
        <AInputRenderNode :node="clearIconContent" />
      </slot>
    </button>
    <span v-if="hasSuffix" :class="suffixClass" :style="suffixStyle">
      <slot name="suffix">
        <AInputRenderNode :node="suffix" />
      </slot>
    </span>
    <span v-if="showCountDisplay" :class="countClass" :style="countStyle">
      <AInputRenderNode :node="countText" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, useSlots } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { inputEmits, inputProps } from './types'
import './style.css'

defineOptions({
  name: 'AInput'
})

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const slots = useSlots()
const config = useAheartConfig()

const AInputRenderNode = defineComponent({
  name: 'AInputRenderNode',
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

const measureCount = (value: string) => props.count?.strategy?.(value) ?? value.length
const formatExceededValue = (value: string) => {
  const max = props.count?.max

  if (max === undefined || !props.count?.exceedFormatter || measureCount(value) <= max) {
    return value
  }

  return props.count.exceedFormatter(value, { max })
}

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const currentValue = computed(() => formatExceededValue(props.modelValue ?? ''))
const resolvedVariant = computed(() =>
  props.variant ?? (props.bordered === false ? 'borderless' : config.value.variant ?? 'outlined')
)
const hasAddonBefore = computed(() => Boolean(slots.addonBefore) || hasRenderable(props.addonBefore))
const hasAddonAfter = computed(() => Boolean(slots.addonAfter) || hasRenderable(props.addonAfter))
const hasAddon = computed(() => hasAddonBefore.value || hasAddonAfter.value)
const hasPrefix = computed(() => Boolean(slots.prefix) || hasRenderable(props.prefix))
const hasSuffix = computed(() => Boolean(slots.suffix) || hasRenderable(props.suffix))
const allowClearConfig = computed(() =>
  typeof props.allowClear === 'object' && props.allowClear !== null ? props.allowClear : undefined
)
const allowClearDisabled = computed(() => allowClearConfig.value?.disabled ?? false)
const showClear = computed(
  () => Boolean(props.allowClear) && !allowClearDisabled.value && !isDisabled.value && Boolean(currentValue.value)
)
const clearIconContent = computed(() => allowClearConfig.value?.clearIcon ?? '×')

const groupClass = computed(() => [
  'aheart-input-group',
  `aheart-input-group--${resolvedSize.value}`,
  props.classNames?.group
])
const groupStyle = computed(() => props.styles?.group)
const inputClass = computed(() => [
  `aheart-input--${resolvedSize.value}`,
  `aheart-input--${resolvedVariant.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    [`aheart-input--${props.status}`]: props.status,
    'is-disabled': isDisabled.value,
    'is-readonly': props.readOnly
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const addonBeforeClass = computed(() => props.classNames?.addonBefore)
const addonBeforeStyle = computed(() => props.styles?.addonBefore)
const addonAfterClass = computed(() => props.classNames?.addonAfter)
const addonAfterStyle = computed(() => props.styles?.addonAfter)
const controlClass = computed(() => props.classNames?.input)
const controlStyle = computed(() => props.styles?.input)
const prefixClass = computed(() => ['aheart-input__prefix', props.classNames?.prefix])
const prefixStyle = computed(() => props.styles?.prefix)
const suffixClass = computed(() => ['aheart-input__suffix', props.classNames?.suffix])
const suffixStyle = computed(() => props.styles?.suffix)
const clearClass = computed(() => ['aheart-input__clear', props.classNames?.clear])
const clearStyle = computed(() => props.styles?.clear)
const countClass = computed(() => ['aheart-input__count', props.classNames?.count])
const countStyle = computed(() => props.styles?.count)

const countLength = computed(() => measureCount(currentValue.value))
const countMaxLength = computed(() => props.count?.max ?? props.maxlength)
const countInfo = computed(() => ({
  count: countLength.value,
  maxLength: countMaxLength.value,
  value: currentValue.value
}))
const showCountFormatter = computed(() =>
  typeof props.showCount === 'object' && props.showCount !== null ? props.showCount.formatter : undefined
)
const showCountDisplay = computed(() => {
  if (props.count?.show === false) {
    return false
  }

  return Boolean(props.showCount) || props.count?.show === true || typeof props.count?.show === 'function'
})
const countText = computed(() => {
  if (typeof props.count?.show === 'function') {
    return props.count.show(countInfo.value)
  }

  if (showCountFormatter.value) {
    return showCountFormatter.value(countInfo.value)
  }

  return countMaxLength.value ? `${countLength.value} / ${countMaxLength.value}` : String(countLength.value)
})

const getEventValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = formatExceededValue(target.value)

  if (target.value !== value) {
    target.value = value
  }

  return value
}

const handleInput = (event: Event) => {
  const value = getEventValue(event)
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  emit('change', getEventValue(event))
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('pressEnter', event)
  }
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
}
</script>
