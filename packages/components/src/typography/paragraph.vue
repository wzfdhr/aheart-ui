<template>
  <p class="aheart-typography-paragraph" :class="paragraphClass" :style="paragraphStyle">
    <button
      v-if="isCopyable && actionPlacement === 'start'"
      class="aheart-typography__copy"
      type="button"
      :title="copyTitle"
      :aria-label="copyTitle || 'Copy'"
      :tabindex="copyTabIndex"
      :disabled="disabled"
      @click="handleCopy"
    >
      <TypographyRenderNode :node="copyIcon" />
    </button>
    <span ref="contentRef" class="aheart-typography__content">
      <slot />
    </span>
    <button
      v-if="isCopyable && actionPlacement === 'end'"
      class="aheart-typography__copy"
      type="button"
      :title="copyTitle"
      :aria-label="copyTitle || 'Copy'"
      :tabindex="copyTabIndex"
      :disabled="disabled"
      @click="handleCopy"
    >
      <TypographyRenderNode :node="copyIcon" />
    </button>
  </p>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { TypographyRenderNode, useTypographyCopyable } from './copyable'
import { paragraphProps } from './types'
import './style.css'

defineOptions({
  name: 'AParagraph'
})

const props = defineProps(paragraphProps)
const contentRef = ref<HTMLElement | null>(null)

const semanticInfo = computed(() => ({ props: props as unknown as Record<string, unknown> }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
const actionPlacement = computed(() => props.actions?.placement ?? 'end')
const { isCopyable, copyIcon, copyTitle, copyTabIndex, handleCopy } = useTypographyCopyable(
  toRef(props, 'copyable'),
  contentRef,
  computed(() => props.disabled)
)

const isEllipsis = computed(() => Boolean(props.ellipsis))
const ellipsisRows = computed(() => {
  if (typeof props.ellipsis === 'object' && props.ellipsis?.rows && props.ellipsis.rows > 0) {
    return props.ellipsis.rows
  }

  return 1
})
const isMultilineEllipsis = computed(() => isEllipsis.value && ellipsisRows.value > 1)

const paragraphClass = computed(() => [
  {
    [`aheart-typography-paragraph--${props.type}`]: props.type,
    'is-strong': props.strong,
    'is-italic': props.italic,
    'is-ellipsis': isEllipsis.value,
    'is-ellipsis-multiline': isMultilineEllipsis.value,
    'is-mark': props.mark,
    'is-disabled': props.disabled
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const paragraphStyle = computed(() => [
  isEllipsis.value ? { '--aheart-typography-ellipsis-rows': ellipsisRows.value } : undefined,
  props.style,
  semanticStyles.value.root
])
</script>
