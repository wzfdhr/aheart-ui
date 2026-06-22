<template>
  <component
    :is="rootTag"
    class="aheart-button"
    :class="buttonClass"
    :style="rootStyle"
    :type="rootTag === 'button' ? resolvedNativeType : undefined"
    :href="rootTag === 'a' && !isInteractiveDisabled ? href : undefined"
    :target="rootTag === 'a' ? target : undefined"
    :disabled="rootTag === 'button' ? isInteractiveDisabled : undefined"
    :aria-disabled="rootTag === 'a' && isInteractiveDisabled ? 'true' : undefined"
    :tabindex="rootTag === 'a' && isInteractiveDisabled ? -1 : undefined"
    :aria-busy="isLoading"
    @click="handleClick"
  >
    <span v-if="isLoading" class="aheart-button__loading" aria-hidden="true">
      <slot name="loadingIcon">
        <span class="aheart-button__loading-spinner" />
      </slot>
    </span>
    <span v-if="showStartIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <AIcon :name="icon" />
      </slot>
    </span>
    <span :class="contentClass" :style="contentStyle">
      <slot>按钮</slot>
    </span>
    <span v-if="showEndIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <AIcon :name="icon" />
      </slot>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AIcon from '../icon/icon.vue'
import { buttonEmits, buttonProps } from './types'
import './style.css'

defineOptions({
  name: 'AButton'
})

const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)
const config = useAheartConfig()
const slots = useSlots()
const delayedLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

const resolvedSize = computed(() => {
  const providerSize = config.value.size === 'middle' ? 'normal' : config.value.size
  return resolveConfigValue(props.size, providerSize, 'normal')
})

const loadingDelay = computed(() => {
  if (typeof props.loading === 'object' && props.loading !== null) {
    return props.loading.delay ?? 0
  }

  return 0
})
const rawLoading = computed(() => props.loading === true || (typeof props.loading === 'object' && props.loading !== null))
const clearLoadingTimer = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = undefined
  }
}

watch(
  [rawLoading, loadingDelay],
  ([loading, delay]) => {
    clearLoadingTimer()

    if (!loading) {
      delayedLoading.value = false
      return
    }

    if (delay > 0) {
      delayedLoading.value = false
      loadingTimer = setTimeout(() => {
        delayedLoading.value = true
        loadingTimer = undefined
      }, delay)
      return
    }

    delayedLoading.value = true
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearLoadingTimer()
})

const isLoading = computed(() => delayedLoading.value)
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const isInteractiveDisabled = computed(() => isDisabled.value || isLoading.value)
const rootTag = computed(() => (props.href ? 'a' : 'button'))
const resolvedNativeType = computed(() => props.htmlType || props.nativeType)
const isDanger = computed(() => props.danger || props.type === 'danger')
const resolvedIconPlacement = computed(() => props.iconPlacement || props.iconPosition || 'start')
const hasIcon = computed(() => Boolean(slots.icon) || Boolean(props.icon))
const showStartIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === 'start')
const showEndIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === 'end')

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${resolvedSize.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-block': props.block,
    'is-round': props.round || props.shape === 'round',
    'is-circle': props.shape === 'circle',
    'is-loading': isLoading.value,
    'is-danger': isDanger.value,
    'is-ghost': props.ghost,
    'is-anchor': rootTag.value === 'a'
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const iconClass = computed(() => ['aheart-button__icon', props.classNames?.icon])
const iconStyle = computed(() => props.styles?.icon)
const contentClass = computed(() => ['aheart-button__content', props.classNames?.content])
const contentStyle = computed(() => props.styles?.content)

const handleClick = (event: MouseEvent) => {
  if (isInteractiveDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>
