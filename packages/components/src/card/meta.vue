<template>
  <div class="aheart-card-meta" :class="metaClass" :style="rootStyle">
    <div v-if="hasAvatar" class="aheart-card-meta__avatar" :class="classNames?.avatar" :style="styles?.avatar">
      <slot name="avatar">
        <ARenderNode :node="avatar" />
      </slot>
    </div>
    <div v-if="hasSection" class="aheart-card-meta__section" :class="classNames?.section" :style="styles?.section">
      <div v-if="hasTitle" class="aheart-card-meta__title" :class="classNames?.title" :style="styles?.title">
        <slot name="title">
          <ARenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasDescription" class="aheart-card-meta__description" :class="classNames?.description" :style="styles?.description">
        <slot name="description">
          <ARenderNode :node="description" />
        </slot>
      </div>
      <slot v-if="!hasTitle && !hasDescription" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, useSlots, type PropType, type VNodeChild } from 'vue'
import { cardMetaProps } from './types'
import './style.css'

defineOptions({
  name: 'ACardMeta'
})

const props = defineProps(cardMetaProps)
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ACardMetaRenderNode',
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

const hasRenderable = (value: VNodeChild | undefined) => value !== undefined && value !== null && value !== false

const hasAvatar = computed(() => hasRenderable(props.avatar) || Boolean(slots.avatar))
const hasTitle = computed(() => hasRenderable(props.title) || Boolean(slots.title))
const hasDescription = computed(() => hasRenderable(props.description) || Boolean(slots.description))
const hasSection = computed(() => hasTitle.value || hasDescription.value || Boolean(slots.default))
const metaClass = computed(() => [props.className, props.rootClassName, props.classNames?.root])
const rootStyle = computed(() => [props.style, props.styles?.root])
</script>
