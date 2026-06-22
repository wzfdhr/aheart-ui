<template>
  <div class="aheart-steps" :class="stepsClass" :style="rootStyle" role="list">
    <div
      v-for="(item, index) in normalizedItems"
      :key="`${item.title}-${index}`"
      class="aheart-steps__item"
      :class="getItemClass(item, index)"
      :style="getItemStyle(index)"
      role="listitem"
      :aria-current="index === current ? 'step' : undefined"
    >
      <button
        class="aheart-steps__button"
        :class="buttonClass"
        :style="buttonStyle"
        type="button"
        :disabled="item.disabled"
        :aria-disabled="item.disabled ? 'true' : undefined"
        @click="handleStepClick(item, index)"
      >
        <span class="aheart-steps__indicator" :class="indicatorClass" :style="indicatorStyle" aria-hidden="true">
          <span class="aheart-steps__icon" :class="iconClass" :style="getIconStyle(item, index)">
            <span v-if="!hasPercent(item, index)" class="aheart-steps__icon-text">{{ getIndicatorText(item, index) }}</span>
            <span v-if="hasPercent(item, index)" class="aheart-steps__percent">{{ percentText }}%</span>
          </span>
        </span>
        <span class="aheart-steps__content" :class="contentClass" :style="contentStyle">
          <span class="aheart-steps__title-row">
            <span class="aheart-steps__title" :class="titleClass" :style="titleStyle">{{ item.title }}</span>
            <span v-if="item.subTitle" class="aheart-steps__subtitle" :class="subTitleClass" :style="subTitleStyle">
              {{ item.subTitle }}
            </span>
          </span>
          <span v-if="item.description" class="aheart-steps__description" :class="descriptionClass" :style="descriptionStyle">
            {{ item.description }}
          </span>
          <span v-if="item.content" class="aheart-steps__extra-content">{{ item.content }}</span>
        </span>
      </button>
      <span
        v-if="index < normalizedItems.length - 1"
        class="aheart-steps__connector"
        :class="connectorClass"
        :style="connectorStyle"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { stepsEmits, stepsProps, type StepItem, type StepStatus } from './types'
import './style.css'

defineOptions({
  name: 'ASteps'
})

const props = defineProps(stepsProps)
const emit = defineEmits(stepsEmits)
const config = useAheartConfig()

const normalizedItems = computed(() => props.items ?? [])
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const resolvedDirection = computed(() => props.orientation ?? props.direction)

const stepsClass = computed(() => [
  `aheart-steps--${resolvedDirection.value}`,
  `aheart-steps--${resolvedSize.value}`,
  `aheart-steps--${props.type}`,
  `aheart-steps--title-${props.titlePlacement}`,
  props.className,
  props.rootClassName,
  props.classNames?.root
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const buttonClass = computed(() => props.classNames?.button)
const buttonStyle = computed(() => props.styles?.button)
const indicatorClass = computed(() => props.classNames?.indicator)
const indicatorStyle = computed(() => props.styles?.indicator)
const iconClass = computed(() => props.classNames?.icon)
const contentClass = computed(() => props.classNames?.content)
const contentStyle = computed(() => props.styles?.content)
const titleClass = computed(() => props.classNames?.title)
const titleStyle = computed(() => props.styles?.title)
const subTitleClass = computed(() => props.classNames?.subTitle)
const subTitleStyle = computed(() => props.styles?.subTitle)
const descriptionClass = computed(() => props.classNames?.description)
const descriptionStyle = computed(() => props.styles?.description)
const connectorClass = computed(() => props.classNames?.connector)
const connectorStyle = computed(() => props.styles?.connector)
const clampedPercent = computed(() => {
  if (props.percent === undefined || Number.isNaN(props.percent)) {
    return 0
  }

  return Math.min(100, Math.max(0, props.percent))
})
const percentText = computed(() =>
  Number.isInteger(clampedPercent.value)
    ? String(clampedPercent.value)
    : String(Number(clampedPercent.value.toFixed(2)))
)

const getStatus = (item: StepItem, index: number): StepStatus => {
  if (item.status) {
    return item.status
  }

  if (index < props.current) {
    return 'finish'
  }

  if (index === props.current) {
    return props.status
  }

  return 'wait'
}

const getItemClass = (item: StepItem, index: number) => {
  const status = getStatus(item, index)

  return [
    props.classNames?.item,
    index === props.current ? props.classNames?.activeItem : undefined,
    {
      [`aheart-steps__item--${status}`]: true,
      'is-disabled': item.disabled
    }
  ]
}

const getItemStyle = (index: number) => [
  props.styles?.item,
  index === props.current ? props.styles?.activeItem : undefined
]

const hasPercent = (item: StepItem, index: number) =>
  typeof props.percent === 'number' && index === props.current && getStatus(item, index) === 'process'

const getIconStyle = (item: StepItem, index: number) => [
  hasPercent(item, index) ? { '--aheart-steps-percent': percentText.value } : undefined,
  props.styles?.icon
]

const getDisplayNumber = (index: number) => props.initial + index

const shouldUseNumericIndicator = () => props.type === 'dot'

const getIndicatorText = (item: StepItem, index: number) => {
  if (item.icon) {
    return item.icon
  }

  if (shouldUseNumericIndicator()) {
    return getDisplayNumber(index)
  }

  const status = getStatus(item, index)

  if (status === 'finish') {
    return '✓'
  }

  if (status === 'error') {
    return '!'
  }

  return getDisplayNumber(index)
}

const handleStepClick = (item: StepItem, index: number) => {
  if (item.disabled || index === props.current) {
    return
  }

  emit('change', index)
}
</script>
