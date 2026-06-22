<template>
  <a
    class="aheart-typography-link"
    :class="linkClass"
    :href="resolvedHref"
    :target="props.target"
    :aria-disabled="props.disabled || undefined"
    :style="linkStyle"
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

const semanticInfo = computed(() => ({ props: props as unknown as Record<string, unknown> }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)

const linkClass = computed(() => [
  {
    'is-disabled': props.disabled,
    'is-underline': props.underline
  },
  props.className,
  props.rootClassName,
  semanticClassNames.value.root
])
const linkStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
