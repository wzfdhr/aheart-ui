<template>
  <slot v-if="!loading" />
  <div v-else class="aheart-skeleton" :class="skeletonClass" :style="rootStyle" aria-busy="true">
    <span
      v-if="avatarConfig"
      class="aheart-skeleton__avatar"
      :class="[classNames.avatar, `aheart-skeleton__avatar--${avatarConfig.shape}`]"
      :style="[avatarStyle, styles.avatar]"
      aria-hidden="true"
    />
    <span
      v-if="buttonConfig"
      class="aheart-skeleton__button"
      :class="buttonClass"
      :style="[buttonStyle, styles.button]"
      aria-hidden="true"
    />
    <span
      v-if="inputConfig"
      class="aheart-skeleton__input"
      :class="inputClass"
      :style="[inputStyle, styles.input]"
      aria-hidden="true"
    />
    <span
      v-if="imageConfig"
      class="aheart-skeleton__image"
      :class="imageClass"
      :style="[imageStyle, styles.image]"
      aria-hidden="true"
    />
    <span
      v-if="nodeConfig"
      class="aheart-skeleton__node"
      :class="nodeClass"
      :style="[nodeStyle, styles.node]"
      aria-hidden="true"
    >
      <ARenderNode :node="nodeConfig.children" />
    </span>
    <div v-if="hasTextContent" class="aheart-skeleton__content" :class="classNames.content" :style="styles.content">
      <span
        v-if="titleConfig"
        class="aheart-skeleton__title"
        :class="classNames.title"
        :style="[titleStyle, styles.title]"
        aria-hidden="true"
      />
      <div
        v-if="paragraphConfig"
        class="aheart-skeleton__paragraph"
        :class="classNames.paragraph"
        :style="styles.paragraph"
      >
        <span
          v-for="row in paragraphRows"
          :key="row"
          class="aheart-skeleton__paragraph-row"
          :class="classNames.paragraphRow"
          :style="[getParagraphRowStyle(row), styles.paragraphRow]"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import {
  skeletonProps,
  type SkeletonAvatarConfig,
  type SkeletonButtonConfig,
  type SkeletonImageConfig,
  type SkeletonInputConfig,
  type SkeletonNodeConfig,
  type SkeletonParagraphConfig,
  type SkeletonTitleConfig
} from './types'
import './style.css'

defineOptions({
  name: 'ASkeleton'
})

const props = defineProps(skeletonProps)

const ARenderNode = defineComponent({
  name: 'ASkeletonRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const toCssValue = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

const isLocallyActive = (active: boolean | undefined) => props.active || active

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

const buttonConfig = computed<SkeletonButtonConfig | undefined>(() => {
  if (!props.button) {
    return undefined
  }

  return typeof props.button === 'boolean' ? { size: 'default', shape: 'default' } : { size: 'default', shape: 'default', ...props.button }
})

const inputConfig = computed<SkeletonInputConfig | undefined>(() => {
  if (!props.input) {
    return undefined
  }

  return typeof props.input === 'boolean' ? { size: 'default' } : { size: 'default', ...props.input }
})

const imageConfig = computed<SkeletonImageConfig | undefined>(() => {
  if (!props.image) {
    return undefined
  }

  return typeof props.image === 'boolean' ? { width: 96, height: 96 } : { width: 96, height: 96, ...props.image }
})

const nodeConfig = computed<SkeletonNodeConfig | undefined>(() => {
  if (!props.node) {
    return undefined
  }

  return typeof props.node === 'boolean' ? { width: 48, height: 48 } : { width: 48, height: 48, ...props.node }
})

const hasTextContent = computed(() => Boolean(titleConfig.value || paragraphConfig.value))

const skeletonClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  {
    'is-active': props.active,
    'is-round': props.round
  }
])

const rootStyle = computed(() => [props.style, props.styles.root])

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

const buttonClass = computed(() => [
  props.classNames.button,
  `aheart-skeleton__button--${buttonConfig.value?.size}`,
  `aheart-skeleton__button--${buttonConfig.value?.shape}`,
  {
    'is-active': isLocallyActive(buttonConfig.value?.active),
    'is-block': buttonConfig.value?.block
  }
])

const buttonStyle = computed(() => ({
  width: toCssValue(buttonConfig.value?.width)
}))

const inputClass = computed(() => [
  props.classNames.input,
  `aheart-skeleton__input--${inputConfig.value?.size}`,
  {
    'is-active': isLocallyActive(inputConfig.value?.active),
    'is-block': inputConfig.value?.block
  }
])

const inputStyle = computed(() => ({
  width: toCssValue(inputConfig.value?.width)
}))

const imageClass = computed(() => [
  props.classNames.image,
  {
    'is-active': isLocallyActive(imageConfig.value?.active)
  }
])

const imageStyle = computed(() => ({
  width: toCssValue(imageConfig.value?.width),
  height: toCssValue(imageConfig.value?.height)
}))

const nodeClass = computed(() => [
  props.classNames.node,
  {
    'is-active': isLocallyActive(nodeConfig.value?.active)
  }
])

const nodeStyle = computed(() => ({
  width: toCssValue(nodeConfig.value?.width),
  height: toCssValue(nodeConfig.value?.height)
}))
</script>
