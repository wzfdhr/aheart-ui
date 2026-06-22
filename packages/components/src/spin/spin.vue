<template>
  <div :class="spinRootClass" :aria-busy="spinning ? 'true' : 'false'">
    <div v-if="$slots.default" class="aheart-spin-container" :class="{ 'is-blur': spinning }">
      <slot />
    </div>
    <div v-if="spinning" class="aheart-spin__indicator" role="status" aria-live="polite">
      <span class="aheart-spin__dot" aria-hidden="true" />
      <span v-if="tip" class="aheart-spin__tip">{{ tip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { spinProps } from './types'
import './style.css'

defineOptions({
  name: 'ASpin'
})

const props = defineProps(spinProps)

const spinRootClass = computed(() => [
  props.spinning ? 'aheart-spin' : 'aheart-spin-wrapper',
  `aheart-spin--${props.size}`,
  {
    'aheart-spin-nested': true
  }
])
</script>
