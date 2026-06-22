<template>
  <span
    class="aheart-popconfirm"
    :class="popconfirmClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-popconfirm__trigger"
      :class="triggerClass"
      :style="triggerStyle"
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
      :class="popupClass"
      :style="popupStyle"
      role="dialog"
      @click="handlePopupClick"
    >
      <span
        v-if="arrow"
        class="aheart-floating__arrow aheart-popconfirm__arrow"
        :class="arrowClass"
        :style="arrowStyle"
        aria-hidden="true"
      />
      <span class="aheart-popconfirm__message" :class="messageClass" :style="messageStyle">
        <span class="aheart-popconfirm__icon" :class="iconClass" :style="iconStyle" aria-hidden="true">
          <slot name="icon">{{ icon ?? '!' }}</slot>
        </span>
        <span class="aheart-popconfirm__text" :class="textClass" :style="textStyle">
          <span v-if="title || $slots.title" class="aheart-popconfirm__title" :class="titleClass" :style="titleStyle">
            <slot name="title">{{ title }}</slot>
          </span>
          <span
            v-if="description || $slots.description"
            class="aheart-popconfirm__description"
            :class="descriptionClass"
            :style="descriptionStyle"
          >
            <slot name="description">{{ description }}</slot>
          </span>
        </span>
      </span>
      <span class="aheart-popconfirm__actions" :class="actionsClass" :style="actionsStyle">
        <AButton
          v-if="showCancel"
          v-bind="resolvedCancelButtonProps"
          class="aheart-popconfirm__cancel"
          :class="cancelButtonClass"
          :style="cancelButtonStyle"
          @click="handleCancel"
        >
          {{ cancelText }}
        </AButton>
        <AButton
          v-bind="resolvedOkButtonProps"
          class="aheart-popconfirm__ok"
          :class="okButtonClass"
          :style="okButtonStyle"
          @click="handleConfirm"
        >
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
const popconfirmClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-open': visible.value,
    'is-disabled': props.disabled
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const triggerClass = computed(() => props.classNames?.trigger)
const triggerStyle = computed(() => props.styles?.trigger)
const popupClass = computed(() => [`aheart-floating--${props.placement}`, props.classNames?.popup])
const popupStyle = computed(() => [getFloatingPopupStyle(props.color, props.zIndex), props.styles?.popup])
const arrowClass = computed(() => props.classNames?.arrow)
const arrowStyle = computed(() => props.styles?.arrow)
const messageClass = computed(() => props.classNames?.message)
const messageStyle = computed(() => props.styles?.message)
const iconClass = computed(() => props.classNames?.icon)
const iconStyle = computed(() => props.styles?.icon)
const textClass = computed(() => props.classNames?.text)
const textStyle = computed(() => props.styles?.text)
const titleClass = computed(() => props.classNames?.title)
const titleStyle = computed(() => props.styles?.title)
const descriptionClass = computed(() => props.classNames?.description)
const descriptionStyle = computed(() => props.styles?.description)
const actionsClass = computed(() => props.classNames?.actions)
const actionsStyle = computed(() => props.styles?.actions)
const cancelButtonClass = computed(() => props.classNames?.cancelButton)
const cancelButtonStyle = computed(() => props.styles?.cancelButton)
const okButtonClass = computed(() => props.classNames?.okButton)
const okButtonStyle = computed(() => props.styles?.okButton)
const resolvedCancelButtonProps = computed(() => ({
  size: 'small' as const,
  ...props.cancelButtonProps
}))
const resolvedOkButtonProps = computed(() => ({
  size: 'small' as const,
  type: props.okType,
  ...props.okButtonProps
}))

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

const handlePopupClick = (event: MouseEvent) => {
  emit('popupClick', event)
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
