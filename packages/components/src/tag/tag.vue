<template>
  <component
    :is="tagComponent"
    class="aheart-tag"
    :class="tagClass"
    :style="tagStyle"
    :href="linkHref"
    :target="linkTarget"
    :rel="linkRel"
    :title="title"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <span v-if="hasIcon" class="aheart-tag__icon" :class="classNames.icon" :style="styles.icon">
      <slot name="icon">
        <ARenderNode :node="icon" />
      </slot>
    </span>
    <span class="aheart-tag__content" :class="classNames.content" :style="styles.content">
      <slot />
    </span>
    <button
      v-if="showClose"
      class="aheart-tag__close"
      :class="classNames.close"
      :style="styles.close"
      type="button"
      aria-label="Close"
      :disabled="disabled"
      @click="handleClose"
    >
      <slot name="closeIcon">
        <ARenderNode :node="closeIconContent" />
      </slot>
    </button>
  </component>
</template>

<script setup lang="ts">
import { computed, defineComponent, useSlots, type PropType, type VNodeChild } from 'vue'
import { tagEmits, tagProps } from './types'
import './style.css'

defineOptions({
  name: 'ATag'
})

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ATagRenderNode',
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

const presetColors = ['default', 'primary', 'success', 'processing', 'warning', 'danger', 'error']
const isPresetColor = computed(() => presetColors.includes(props.color))
const resolvedVariant = computed(() => props.variant ?? 'filled')
const isBorderless = computed(() => props.bordered === false && props.variant === undefined)
const tagComponent = computed(() => (props.href && !props.disabled ? 'a' : 'span'))
const linkHref = computed(() => (props.disabled ? undefined : props.href))
const linkTarget = computed(() => (props.disabled ? undefined : props.target))
const linkRel = computed(() => (props.disabled ? undefined : props.rel))
const hasIcon = computed(() => props.icon !== undefined || Boolean(slots.icon))
const showClose = computed(() => props.closable && props.closeIcon !== false && props.closeIcon !== null)
const closeIconContent = computed(() => props.closeIcon ?? '×')

const tagClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  `aheart-tag--${resolvedVariant.value}`,
  {
    [`aheart-tag--${props.color}`]: isPresetColor.value,
    'is-custom-color': !isPresetColor.value,
    'is-borderless': isBorderless.value,
    'is-closable': showClose.value,
    'is-disabled': props.disabled,
    'is-link': Boolean(props.href && !props.disabled)
  }
])

const tagStyle = computed(() => [
  !isPresetColor.value
    ? {
        '--aheart-tag-color': props.color
      }
    : undefined,
  props.style,
  props.styles.root
])

const handleClose = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('close', event)
}
</script>
