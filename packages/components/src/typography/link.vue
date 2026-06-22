<template>
  <a
    class="aheart-typography-link"
    :class="linkClass"
    :href="resolvedHref"
    :target="props.target"
    :aria-disabled="props.disabled || undefined"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { linkProps } from './types'
import './style.css'

defineOptions({
  name: 'ALink'
})

const props = defineProps(linkProps)
const resolvedHref = computed(() => (props.disabled ? undefined : props.href))

const linkClass = computed(() => ({
  'is-disabled': props.disabled,
  'is-underline': props.underline
}))
</script>
