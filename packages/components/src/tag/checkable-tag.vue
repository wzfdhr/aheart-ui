<template>
  <button
    class="aheart-tag aheart-checkable-tag"
    :class="tagClass"
    :style="tagStyle"
    type="button"
    :title="title"
    :aria-pressed="checked"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="hasIcon" class="aheart-tag__icon" :class="classNames.icon" :style="styles.icon">
      <slot name="icon">
        <ARenderNode :node="icon" />
      </slot>
    </span>
    <span class="aheart-tag__content" :class="classNames.content" :style="styles.content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, defineComponent, useSlots, type PropType, type VNodeChild } from 'vue'
import { checkableTagEmits, checkableTagProps } from './types'
import './style.css'

defineOptions({
  name: 'ACheckableTag'
})

const props = defineProps(checkableTagProps)
const emit = defineEmits(checkableTagEmits)
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ACheckableTagRenderNode',
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

const hasIcon = computed(() => props.icon !== undefined || Boolean(slots.icon))
const tagClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  {
    'is-checked': props.checked,
    'is-disabled': props.disabled
  }
])
const tagStyle = computed(() => [props.style, props.styles.root])

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    return
  }

  const nextChecked = !props.checked
  emit('update:checked', nextChecked)
  emit('change', nextChecked, event)
}
</script>
