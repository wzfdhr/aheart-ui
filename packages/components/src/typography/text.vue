<template>
  <component :is="tagName" class="aheart-typography-text" :class="textClass" :style="textStyle">
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
  </component>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { TypographyRenderNode, useTypographyCopyable } from './copyable'
import { textProps } from './types'
import './style.css'

defineOptions({
  name: 'AText'
})

const props = defineProps(textProps)
const contentRef = ref<HTMLElement | null>(null)

const tagName = computed(() => {
  if (props.code) return 'code'
  if (props.keyboard) return 'kbd'
  if (props.delete) return 'del'
  if (props.underline) return 'u'
  if (props.mark) return 'mark'
  if (props.italic) return 'em'
  if (props.strong) return 'strong'
  return 'span'
})

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

const textClass = computed(() => [
  {
    [`aheart-typography-text--${props.type}`]: props.type,
    'is-strong': props.strong,
    'is-italic': props.italic,
    'is-mark': props.mark,
    'is-disabled': props.disabled
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const textStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
