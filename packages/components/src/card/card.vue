<template>
  <section class="aheart-card" :class="cardClass" role="region">
    <div v-if="$slots.cover" class="aheart-card__cover">
      <slot name="cover" />
    </div>
    <div v-if="hasHeader" class="aheart-card__header">
      <div class="aheart-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="hasExtra" class="aheart-card__extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
    <div class="aheart-card__body">
      <div v-if="loading" class="aheart-card__loading" aria-busy="true" aria-live="polite">
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line is-short" />
      </div>
      <slot v-else />
    </div>
    <div v-if="$slots.actions" class="aheart-card__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { cardProps } from './types'
import './style.css'

defineOptions({
  name: 'ACard'
})

const props = defineProps(cardProps)
const slots = useSlots()
const config = useAheartConfig()

const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const hasHeader = computed(() => Boolean(props.title || slots.title || props.extra || slots.extra))
const hasExtra = computed(() => Boolean(props.extra || slots.extra))

const cardClass = computed(() => [
  `aheart-card--${resolvedSize.value}`,
  {
    'is-borderless': !props.bordered,
    'is-hoverable': props.hoverable,
    'is-loading': props.loading
  }
])
</script>
