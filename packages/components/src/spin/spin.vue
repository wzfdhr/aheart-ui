<template>
  <div :class="spinRootClass" :style="rootStyle" :aria-busy="spinning ? 'true' : 'false'">
    <div v-if="hasDefaultSlot" class="aheart-spin-section" :class="sectionClass" :style="sectionStyle">
      <div class="aheart-spin-container" :class="containerClass" :style="containerStyle">
        <slot />
      </div>
      <div v-if="visible" class="aheart-spin__indicator" :class="indicatorClass" :style="indicatorStyle" role="status" aria-live="polite">
        <ARenderNode v-if="hasCustomIndicator" :node="indicatorNode" />
        <span v-else class="aheart-spin__dot" :class="classNames.dot" :style="styles.dot" aria-hidden="true" />
        <span
          v-if="hasDescription"
          class="aheart-spin__tip aheart-spin__description"
          :class="descriptionClass"
          :style="descriptionStyle"
        >
          <slot name="description">
            <ARenderNode :node="descriptionNode" />
          </slot>
        </span>
        <span v-if="percentText" class="aheart-spin__percent" :class="classNames.percent" :style="styles.percent">
          {{ percentText }}
        </span>
      </div>
    </div>
    <div v-else-if="visible" class="aheart-spin__indicator" :class="indicatorClass" :style="indicatorStyle" role="status" aria-live="polite">
      <ARenderNode v-if="hasCustomIndicator" :node="indicatorNode" />
      <span v-else class="aheart-spin__dot" :class="classNames.dot" :style="styles.dot" aria-hidden="true" />
      <span
        v-if="hasDescription"
        class="aheart-spin__tip aheart-spin__description"
        :class="descriptionClass"
        :style="descriptionStyle"
      >
        <slot name="description">
          <ARenderNode :node="descriptionNode" />
        </slot>
      </span>
      <span v-if="percentText" class="aheart-spin__percent" :class="classNames.percent" :style="styles.percent">
        {{ percentText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, useSlots, watch, type PropType, type VNodeChild } from 'vue'
import { spinProps } from './types'
import './style.css'

defineOptions({
  name: 'ASpin'
})

const props = defineProps(spinProps)
const slots = useSlots()
const visible = ref(false)
let delayTimer: ReturnType<typeof setTimeout> | undefined

const ARenderNode = defineComponent({
  name: 'ASpinRenderNode',
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

const hasRenderable = (value: unknown) => value !== undefined && value !== null && value !== false && value !== ''

const clearDelayTimer = () => {
  if (delayTimer) {
    clearTimeout(delayTimer)
    delayTimer = undefined
  }
}

const syncVisibleState = () => {
  clearDelayTimer()

  if (!props.spinning) {
    visible.value = false
    return
  }

  const delay = props.delay ?? 0

  if (delay > 0) {
    visible.value = false
    delayTimer = setTimeout(() => {
      if (props.spinning) {
        visible.value = true
      }
    }, delay)
    return
  }

  visible.value = true
}

watch(() => [props.spinning, props.delay] as const, syncVisibleState, { immediate: true })

onBeforeUnmount(clearDelayTimer)

const hasDefaultSlot = computed(() => Boolean(slots.default))
const hasCustomIndicator = computed(() => props.indicator !== undefined && props.indicator !== null)
const indicatorNode = computed(() =>
  typeof props.indicator === 'function' ? props.indicator() : props.indicator
)
const hasDescriptionSlot = computed(() => Boolean(slots.description))
const descriptionNode = computed(() => props.description ?? props.tip)
const hasDescription = computed(() => hasDescriptionSlot.value || hasRenderable(descriptionNode.value))
const percentText = computed(() => {
  if (props.percent === undefined || props.percent === null) {
    return ''
  }

  return props.percent === 'auto' ? 'auto' : `${props.percent}%`
})

const spinRootClass = computed(() => [
  visible.value ? 'aheart-spin' : 'aheart-spin-wrapper',
  `aheart-spin--${props.size}`,
  props.className,
  props.rootClassName,
  props.classNames.root,
  {
    'aheart-spin-nested': hasDefaultSlot.value,
    'aheart-spin-fullscreen': props.fullscreen,
    'is-spinning': visible.value
  }
])
const rootStyle = computed(() => [props.style, props.styles.root])
const sectionClass = computed(() => [props.wrapperClassName, props.classNames.section])
const sectionStyle = computed(() => props.styles.section)
const containerClass = computed(() => [
  props.classNames.container,
  {
    'is-blur': visible.value
  }
])
const containerStyle = computed(() => props.styles.container)
const indicatorClass = computed(() => [
  props.classNames.indicator,
  {
    'is-custom': hasCustomIndicator.value
  }
])
const indicatorStyle = computed(() => props.styles.indicator)
const descriptionClass = computed(() => [props.classNames.description, props.classNames.tip])
const descriptionStyle = computed(() => [props.styles.description, props.styles.tip])
</script>
