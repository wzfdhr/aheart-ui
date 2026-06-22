<template>
  <div class="aheart-empty" :class="emptyClass" :style="rootStyle">
    <div v-if="showImage" :class="imageClass" :style="imageStyleValue">
      <slot name="image">
        <img v-if="imageUrl" class="aheart-empty__image-element" :src="imageUrl" alt="" />
        <span v-else class="aheart-empty__default-image" aria-hidden="true">∅</span>
      </slot>
    </div>
    <div v-if="showDescription" :class="descriptionClass" :style="descriptionStyle">
      <slot name="description">{{ resolvedDescription }}</slot>
    </div>
    <div v-if="$slots.default" :class="footerClass" :style="footerStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useAheartConfig } from '../config'
import { emptyProps } from './types'
import './style.css'

defineOptions({
  name: 'AEmpty'
})

const props = defineProps(emptyProps)
const config = useAheartConfig()
const slots = useSlots()

const imageUrl = computed(() => (typeof props.image === 'string' && props.image ? props.image : undefined))
const showImage = computed(() => Boolean(slots.image) || props.image !== false)
const resolvedDescription = computed(() => {
  if (props.description === false) {
    return ''
  }

  if (typeof props.description === 'string') {
    return props.description
  }

  return config.value.locale?.empty?.description || 'No Data'
})
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
