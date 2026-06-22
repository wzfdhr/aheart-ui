<template>
  <section class="aheart-card" :class="cardClass" :style="rootStyle" role="region">
    <div v-if="$slots.cover" :class="coverClass" :style="coverStyle">
      <slot name="cover" />
    </div>
    <div v-if="hasHeader" :class="headerClass" :style="headerStyle">
      <div :class="titleClass" :style="titleStyle">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="hasExtra" :class="extraClass" :style="extraStyle">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
    <div :class="bodyClass" :style="bodyStyleValue">
      <div v-if="loading" class="aheart-card__loading" aria-busy="true" aria-live="polite">
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line" />
        <span class="aheart-card__loading-line is-short" />
      </div>
      <slot v-else />
    </div>
    <div v-if="showActions" :class="actionsClass" :style="actionsStyle">
      <slot name="actions">
        <span v-for="(action, index) in actions" :key="index" class="aheart-card__action">
          {{ action }}
        </span>
      </slot>
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
const isBorderless = computed(() => {
  if (props.variant) {
    return props.variant === 'borderless'
  }

  return !props.bordered
})
const showActions = computed(() => Boolean(slots.actions) || Boolean(props.actions?.length))

const cardClass = computed(() => [
  `aheart-card--${resolvedSize.value}`,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-borderless': isBorderless.value,
    'aheart-card--inner': props.type === 'inner',
    'is-hoverable': props.hoverable,
    'is-loading': props.loading
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const coverClass = computed(() => ['aheart-card__cover', props.classNames?.cover])
const coverStyle = computed(() => props.styles?.cover)
const headerClass = computed(() => ['aheart-card__header', props.classNames?.header])
const headerStyle = computed(() => [props.headStyle, props.styles?.header])
const titleClass = computed(() => ['aheart-card__title', props.classNames?.title])
const titleStyle = computed(() => props.styles?.title)
const extraClass = computed(() => ['aheart-card__extra', props.classNames?.extra])
const extraStyle = computed(() => props.styles?.extra)
const bodyClass = computed(() => ['aheart-card__body', props.classNames?.body])
const bodyStyleValue = computed(() => [props.bodyStyle, props.styles?.body])
const actionsClass = computed(() => ['aheart-card__actions', props.classNames?.actions])
const actionsStyle = computed(() => props.styles?.actions)
</script>
