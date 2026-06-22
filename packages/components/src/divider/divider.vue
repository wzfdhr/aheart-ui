<template>
  <div class="aheart-divider" :class="dividerClass" role="separator" :aria-orientation="type">
    <span v-if="$slots.default && type === 'horizontal'" class="aheart-divider__text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { dividerProps } from './types'
import './style.css'

defineOptions({
  name: 'ADivider'
})

const props = defineProps(dividerProps)
const slots = useSlots()

const dividerClass = computed(() => [
  `aheart-divider--${props.type}`,
  `aheart-divider--${props.orientation}`,
  {
    'has-text': Boolean(slots.default && props.type === 'horizontal'),
    'is-dashed': props.dashed,
    'is-plain': props.plain
  }
])
</script>
