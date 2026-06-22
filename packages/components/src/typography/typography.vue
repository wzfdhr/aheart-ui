<template>
  <article class="aheart-typography" :class="typographyClass" :style="typographyStyle">
    <slot />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { typographyProps } from './types'
import './style.css'

defineOptions({
  name: 'ATypography'
})

const props = defineProps(typographyProps)

const semanticInfo = computed(() => ({ props: props as unknown as Record<string, unknown> }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)

const typographyClass = computed(() => [props.className, props.rootClassName, semanticClassNames.value.root])
const typographyStyle = computed(() => [props.style, semanticStyles.value.root])
</script>
