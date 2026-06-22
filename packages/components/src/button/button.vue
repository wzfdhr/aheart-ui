<template>
  <component
    :is="rootTag"
    class="aheart-button"
    :class="buttonClass"
    :type="rootTag === 'button' ? resolvedNativeType : undefined"
    :href="rootTag === 'a' && !isInteractiveDisabled ? href : undefined"
    :target="rootTag === 'a' ? target : undefined"
    :disabled="rootTag === 'button' ? isInteractiveDisabled : undefined"
    :aria-disabled="rootTag === 'a' && isInteractiveDisabled ? 'true' : undefined"
    :tabindex="rootTag === 'a' && isInteractiveDisabled ? -1 : undefined"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="aheart-button__loading" aria-hidden="true" />
    <span class="aheart-button__content">
      <slot>按钮</slot>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { buttonEmits, buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)
const config = useAheartConfig()

const resolvedSize = computed(() => {
  const providerSize = config.value.size === 'middle' ? 'normal' : config.value.size
  return resolveConfigValue(props.size, providerSize, 'normal')
})

const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isInteractiveDisabled = computed(() => isDisabled.value || props.loading)
const rootTag = computed(() => (props.href ? 'a' : 'button'))
const resolvedNativeType = computed(() => props.htmlType || props.nativeType)
const isDanger = computed(() => props.danger || props.type === 'danger')

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${resolvedSize.value}`,
  {
    'is-block': props.block,
    'is-round': props.round || props.shape === 'round',
    'is-circle': props.shape === 'circle',
    'is-loading': props.loading,
    'is-danger': isDanger.value,
    'is-ghost': props.ghost,
    'is-anchor': rootTag.value === 'a'
  }
])

const handleClick = (event: MouseEvent) => {
  if (isInteractiveDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>
