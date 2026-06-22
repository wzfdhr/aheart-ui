<template>
  <div class="aheart-empty" :class="emptyClass" :style="rootStyle">
    <div v-if="showImage" :class="imageClass" :style="imageStyleValue">
      <slot name="image">
        <img v-if="imageUrl" class="aheart-empty__image-element" :src="imageUrl" alt="" />
        <AEmptyRenderNode v-else-if="hasCustomImageNode" :node="image" />
        <span v-else-if="isSimpleImage" class="aheart-empty__simple-image" aria-hidden="true">∅</span>
        <span v-else class="aheart-empty__default-image" aria-hidden="true">∅</span>
      </slot>
    </div>
    <div v-if="showDescription" :class="descriptionClass" :style="descriptionStyle">
      <slot name="description">
        <AEmptyRenderNode v-if="hasDescriptionProp" :node="description" />
        <template v-else>{{ fallbackDescription }}</template>
      </slot>
    </div>
    <div v-if="$slots.default" :class="footerClass" :style="footerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, useSlots, type VNodeChild } from 'vue'
import { useAheartConfig } from '../config'
import { EMPTY_PRESENTED_IMAGE_DEFAULT, EMPTY_PRESENTED_IMAGE_SIMPLE, emptyProps } from './types'
import './style.css'

defineOptions({
  name: 'AEmpty'
})

const props = defineProps(emptyProps)
const config = useAheartConfig()
const slots = useSlots()

const AEmptyRenderNode = defineComponent({
  name: 'AEmptyRenderNode',
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

const isPresetImage = (value: unknown) => {
  return value === EMPTY_PRESENTED_IMAGE_DEFAULT || value === EMPTY_PRESENTED_IMAGE_SIMPLE
}

const imageUrl = computed(() => {
  return typeof props.image === 'string' && props.image && !isPresetImage(props.image) ? props.image : undefined
})
const showImage = computed(() => Boolean(slots.image) || props.image !== false)
const isSimpleImage = computed(() => props.image === EMPTY_PRESENTED_IMAGE_SIMPLE)
const hasCustomImageNode = computed(() => {
  return props.image !== undefined && props.image !== false && !imageUrl.value && !isPresetImage(props.image)
})
const hasDescriptionProp = computed(() => props.description !== undefined && props.description !== false)
const fallbackDescription = computed(() => config.value.locale?.empty?.description || 'No Data')
const showDescription = computed(() => Boolean(slots.description) || props.description !== false)

const emptyClass = computed(() => [props.className, props.rootClassName, props.classNames?.root])
const rootStyle = computed(() => [props.style, props.styles?.root])
const imageClass = computed(() => ['aheart-empty__image', props.classNames?.image])
const imageStyleValue = computed(() => [props.imageStyle, props.styles?.image])
const descriptionClass = computed(() => ['aheart-empty__description', props.classNames?.description])
const descriptionStyle = computed(() => props.styles?.description)
const footerClass = computed(() => ['aheart-empty__footer', props.classNames?.footer])
const footerStyle = computed(() => props.styles?.footer)
</script>
