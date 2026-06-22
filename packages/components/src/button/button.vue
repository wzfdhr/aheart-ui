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
        <ARenderNode v-if="hasObjectLoadingIcon" :node="objectLoadingIcon" />
        <span v-else class="aheart-button__loading-spinner" />
      </slot>
    </span>
    <span v-if="showStartIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <AIcon v-if="isStringIcon" :name="stringIcon" />
        <ARenderNode v-else :node="icon" />
      </slot>
    </span>
    <span :class="contentClass" :style="contentStyle">
      <ARenderNode :node="contentNode" />
    </span>
    <span v-if="showEndIcon" :class="iconClass" :style="iconStyle" aria-hidden="true">
      <slot name="icon">
        <AIcon v-if="isStringIcon" :name="stringIcon" />
        <ARenderNode v-else :node="icon" />
      </slot>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { Comment, Text, computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType, type VNodeChild } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AIcon from '../icon/icon.vue'
import type { ButtonColor, ButtonType, ButtonVariant } from './types'
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

const ARenderNode = defineComponent({
  name: 'AButtonRenderNode',
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

const isTwoChineseCharacters = (value: string) => /^[\u4e00-\u9fa5]{2}$/.test(value)

const getAutoSpacedText = (value: string) => {
  if (!props.autoInsertSpace || !isTwoChineseCharacters(value)) {
    return value
  }

  return `${value[0]} ${value[1]}`
}

const getContentNode = () => {
  const nodes = slots.default?.()

  if (!nodes) {
    return getAutoSpacedText('按钮')
  }

  const meaningfulNodes = nodes.filter((node) => node.type !== Comment)

  if (meaningfulNodes.length !== 1) {
    return nodes
  }

  const [node] = meaningfulNodes

  if (typeof node.children !== 'string') {
    return nodes
  }

  if (node.type === Text) {
    return getAutoSpacedText(node.children)
  }

  return nodes
}

const colorTokens: Record<ButtonColor, string> = {
  default: 'var(--aheart-color-text)',
  primary: 'var(--aheart-color-primary)',
  danger: 'var(--aheart-color-danger)',
  success: 'var(--aheart-color-success)',
  warning: 'var(--aheart-color-warning)',
  info: 'var(--aheart-color-info)',
  blue: '#1677ff',
  purple: '#722ed1',
  cyan: '#13c2c2',
  green: '#52c41a',
  magenta: '#eb2f96',
  pink: '#eb2f96',
  red: '#f5222d',
  orange: '#fa8c16',
  yellow: '#fadb14',
  volcano: '#fa541c',
  geekblue: '#2f54eb',
  lime: '#a0d911',
  gold: '#faad14'
}

const typeColorMap: Partial<Record<ButtonType, ButtonColor>> = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger'
}

const typeVariantMap: Partial<Record<ButtonType, ButtonVariant>> = {
  primary: 'solid',
  success: 'solid',
  warning: 'solid',
  danger: 'solid',
  dashed: 'dashed',
  link: 'link',
  text: 'text'
}

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
const resolvedColor = computed<ButtonColor>(() => props.color || (isDanger.value ? 'danger' : typeColorMap[props.type] || 'default'))
const resolvedVariant = computed<ButtonVariant>(() => props.variant || typeVariantMap[props.type] || 'outlined')
const resolvedIconPlacement = computed(() => props.iconPlacement || props.iconPosition || 'start')
const isStringIcon = computed(() => typeof props.icon === 'string')
const stringIcon = computed(() => (isStringIcon.value ? props.icon as string : ''))
const hasRenderableIcon = computed(() => {
  if (Array.isArray(props.icon)) {
    return props.icon.length > 0
  }

  return props.icon !== undefined && props.icon !== null && props.icon !== false && props.icon !== true && props.icon !== ''
})
const hasIcon = computed(() => Boolean(slots.icon) || hasRenderableIcon.value)
const showStartIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === 'start')
const showEndIcon = computed(() => !isLoading.value && hasIcon.value && resolvedIconPlacement.value === 'end')
const objectLoadingIcon = computed(() =>
  typeof props.loading === 'object' && props.loading !== null ? props.loading.icon : undefined
)
const hasObjectLoadingIcon = computed(
  () => objectLoadingIcon.value !== undefined && objectLoadingIcon.value !== null && objectLoadingIcon.value !== false
)

const buttonClass = computed(() => [
  `aheart-button--${props.type}`,
  `aheart-button--${resolvedSize.value}`,
  `aheart-button--color-${resolvedColor.value}`,
  `aheart-button--variant-${resolvedVariant.value}`,
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
const rootStyle = computed(() => [
  {
    '--aheart-button-color': colorTokens[resolvedColor.value],
    '--aheart-button-color-hover':
      resolvedColor.value === 'default' ? 'var(--aheart-color-primary-hover)' : colorTokens[resolvedColor.value]
  },
  props.style,
  props.styles?.root
])
const iconClass = computed(() => ['aheart-button__icon', props.classNames?.icon])
const iconStyle = computed(() => props.styles?.icon)
const contentClass = computed(() => ['aheart-button__content', props.classNames?.content])
const contentStyle = computed(() => props.styles?.content)
const contentNode = computed(() => getContentNode())

const handleClick = (event: MouseEvent) => {
  if (isInteractiveDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>
