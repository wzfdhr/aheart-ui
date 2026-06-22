<template>
  <component :is="tagName" class="aheart-typography-title" :class="`aheart-typography-title--${level}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { titleProps } from './types'
import './style.css'

defineOptions({
  name: 'ATitle'
})

const props = defineProps(titleProps)
const tagName = computed(() => `h${props.level}`)
</script>
