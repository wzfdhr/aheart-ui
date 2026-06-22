<template>
  <div class="aheart-steps" :class="stepsClass" role="list">
    <div
      v-for="(item, index) in normalizedItems"
      :key="`${item.title}-${index}`"
      class="aheart-steps__item"
      :class="getItemClass(item, index)"
      role="listitem"
      :aria-current="index === current ? 'step' : undefined"
    >
      <button
        class="aheart-steps__button"
        type="button"
        :disabled="item.disabled"
        :aria-disabled="item.disabled ? 'true' : undefined"
        @click="handleStepClick(item, index)"
      >
        <span class="aheart-steps__indicator" aria-hidden="true">
          <span class="aheart-steps__icon">{{ getIndicatorText(item, index) }}</span>
        </span>
        <span class="aheart-steps__content">
          <span class="aheart-steps__title">{{ item.title }}</span>
          <span v-if="item.description" class="aheart-steps__description">{{ item.description }}</span>
        </span>
      </button>
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

const stepsClass = computed(() => [
  `aheart-steps--${props.direction}`,
  `aheart-steps--${resolvedSize.value}`
])

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

  return {
    [`aheart-steps__item--${status}`]: true,
    'is-disabled': item.disabled
  }
}

const getIndicatorText = (item: StepItem, index: number) => {
  const status = getStatus(item, index)

  if (status === 'finish') {
    return '✓'
  }

  if (status === 'error') {
    return '!'
  }

  return index + 1
}

const handleStepClick = (item: StepItem, index: number) => {
  if (item.disabled || index === props.current) {
    return
  }

  emit('change', index)
}
</script>
