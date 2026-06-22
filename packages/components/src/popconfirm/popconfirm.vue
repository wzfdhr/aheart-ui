<template>
  <span
    class="aheart-popconfirm"
    :class="{ 'is-open': visible, 'is-disabled': disabled }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-popconfirm__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
      @click="handleClick"
      @contextmenu="handleContextmenu"
    >
      <slot />
    </span>
    <span
      v-if="visible"
      class="aheart-popconfirm__popup"
      :class="`aheart-floating--${placement}`"
      :style="popupStyle"
      role="dialog"
    >
      <span v-if="arrow" class="aheart-floating__arrow aheart-popconfirm__arrow" aria-hidden="true" />
      <span class="aheart-popconfirm__message">
        <span class="aheart-popconfirm__icon" aria-hidden="true">
          <slot name="icon">!</slot>
        </span>
        <span class="aheart-popconfirm__text">
          <span v-if="title || $slots.title" class="aheart-popconfirm__title">
            <slot name="title">{{ title }}</slot>
          </span>
          <span v-if="description || $slots.description" class="aheart-popconfirm__description">
            <slot name="description">{{ description }}</slot>
          </span>
        </span>
      </span>
      <span class="aheart-popconfirm__actions">
        <AButton v-if="showCancel" class="aheart-popconfirm__cancel" size="small" @click="handleCancel">
          {{ cancelText }}
        </AButton>
        <AButton class="aheart-popconfirm__ok" :type="okType" size="small" @click="handleConfirm">
          {{ okText }}
        </AButton>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AButton from '../button'
import { getFloatingPopupStyle, normalizeFloatingTriggers } from '../utils/floating'
import '../utils/floating.css'
import { popconfirmEmits, popconfirmProps } from './types'
import './style.css'

defineOptions({
  name: 'APopconfirm'
})

const props = defineProps(popconfirmProps)
const emit = defineEmits(popconfirmEmits)

const innerOpen = ref(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const normalizedTriggers = computed(() => new Set(normalizeFloatingTriggers(props.trigger)))
const visible = computed(() => !props.disabled && mergedOpen.value)
const popupStyle = computed(() => getFloatingPopupStyle(undefined, props.zIndex))

watch(
  () => props.defaultOpen,
  (open) => {
    if (!isControlled.value) {
      innerOpen.value = open
    }
  }
)

const requestOpen = (open: boolean) => {
  if (props.disabled) {
    return
  }

  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

const handleMouseEnter = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpen(true)
  }
}

const handleMouseLeave = () => {
  if (normalizedTriggers.value.has('hover')) {
    requestOpen(false)
  }
}

const handleFocusIn = () => {
  if (normalizedTriggers.value.has('focus')) {
    requestOpen(true)
  }
}

const handleFocusOut = () => {
  if (normalizedTriggers.value.has('focus')) {
    requestOpen(false)
  }
}

const handleClick = () => {
  if (normalizedTriggers.value.has('click')) {
    requestOpen(!mergedOpen.value)
  }
}

const handleContextmenu = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('contextMenu')) {
    event.preventDefault()
    requestOpen(true)
  }
}

const handleConfirm = () => {
  emit('confirm')
  requestOpen(false)
}

const handleCancel = () => {
  emit('cancel')
  requestOpen(false)
}
</script>
