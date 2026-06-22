<template>
  <slot v-if="!loading" />
  <div v-else class="aheart-skeleton" :class="skeletonClass" aria-busy="true">
    <span
      v-if="avatarConfig"
      class="aheart-skeleton__avatar"
      :class="`aheart-skeleton__avatar--${avatarConfig.shape}`"
      :style="avatarStyle"
      aria-hidden="true"
    />
    <div class="aheart-skeleton__content">
      <span v-if="titleConfig" class="aheart-skeleton__title" :style="titleStyle" aria-hidden="true" />
      <div v-if="paragraphConfig" class="aheart-skeleton__paragraph">
        <span
          v-for="row in paragraphRows"
          :key="row"
          class="aheart-skeleton__paragraph-row"
          :style="getParagraphRowStyle(row)"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { skeletonProps, type SkeletonAvatarConfig, type SkeletonParagraphConfig, type SkeletonTitleConfig } from './types'
import './style.css'

defineOptions({
  name: 'ASkeleton'
})

const props = defineProps(skeletonProps)

const toCssValue = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

const avatarConfig = computed<SkeletonAvatarConfig | undefined>(() => {
  if (!props.avatar) {
    return undefined
  }

  return typeof props.avatar === 'boolean' ? { size: 32, shape: 'circle' } : { shape: 'circle', ...props.avatar }
})

const titleConfig = computed<SkeletonTitleConfig | undefined>(() => {
  if (!props.title) {
    return undefined
  }

  return typeof props.title === 'boolean' ? { width: '38%' } : props.title
})

const paragraphConfig = computed<SkeletonParagraphConfig | undefined>(() => {
  if (!props.paragraph) {
    return undefined
  }

  return typeof props.paragraph === 'boolean' ? { rows: 3 } : props.paragraph
})

const skeletonClass = computed(() => ({
  'is-active': props.active,
  'is-round': props.round
}))

const avatarStyle = computed(() => ({
  width: toCssValue(avatarConfig.value?.size),
  height: toCssValue(avatarConfig.value?.size)
}))

const titleStyle = computed(() => ({
  width: toCssValue(titleConfig.value?.width)
}))

const paragraphRows = computed(() => {
  return Array.from({ length: paragraphConfig.value?.rows ?? 3 }, (_, index) => index + 1)
})

const getParagraphRowStyle = (row: number) => {
  const width = paragraphConfig.value?.width
  const rowWidth = Array.isArray(width) ? width[row - 1] : row === paragraphRows.value.length ? width : undefined

  return {
    width: toCssValue(rowWidth)
  }
}
</script>
