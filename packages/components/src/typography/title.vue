<template>
  <component :is="tagName" class="aheart-typography-title" :class="titleClass" :style="titleStyle">
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
import { titleProps } from './types'
import './style.css'

defineOptions({
  name: 'ATitle'
})

const props = defineProps(titleProps)
const contentRef = ref<HTMLElement | null>(null)
const tagName = computed(() => `h${props.level}`)

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

const titleClass = computed(() => [
  `aheart-typography-title--${props.level}`,
  props.type ? `aheart-typography-title--${props.type}` : undefined,
  {
    'is-disabled': props.disabled,
    'is-mark': props.mark
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const titleStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
