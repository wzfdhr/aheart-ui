<template>
  <div class="aheart-message" :class="messageClass" :style="messageStyle">
    <div
      v-for="notice in notices"
      :key="notice.key"
      class="aheart-message-notice"
      :class="getNoticeClass(notice)"
      :style="getNoticeStyle(notice)"
      role="status"
      aria-live="polite"
      @click="notice.onClick?.()"
      @mouseenter="$emit('noticeMouseEnter', notice.key)"
      @mouseleave="$emit('noticeMouseLeave', notice.key)"
    >
      <span class="aheart-message-notice__icon" :class="getIconClass(notice)" :style="getIconStyle(notice)" aria-hidden="true">
        <ARenderNode :node="notice.icon ?? iconMap[notice.type]" />
      </span>
      <span class="aheart-message-notice__content" :class="getContentClass(notice)" :style="getContentStyle(notice)">
        <ARenderNode :node="notice.content" />
      </span>
      <button
        class="aheart-message-notice__close"
        :class="getCloseClass(notice)"
        :style="getCloseStyle(notice)"
        type="button"
        aria-label="Close"
        @click.stop="$emit('close', notice.key)"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import { messageEmits, messageProps } from './types'
import type { MessageNotice } from './types'
import './style.css'

defineOptions({
  name: 'AMessage'
})

const props = defineProps(messageProps)
defineEmits(messageEmits)

const ARenderNode = defineComponent({
  name: 'AMessageRenderNode',
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

const iconMap = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×',
  loading: '…'
}

const normalizeTop = (top: number | string) => (typeof top === 'number' ? `${top}px` : top)

const messageClass = computed(() => [
  props.prefixCls,
  props.classNames.root,
  {
    'is-rtl': props.rtl
  }
])
const messageStyle = computed(() => [
  {
    top: normalizeTop(props.top)
  },
  props.styles.root
])

const getNoticeClass = (notice: MessageNotice) => [
  `aheart-message-notice--${notice.type}`,
  props.prefixCls ? `${props.prefixCls}-notice` : undefined,
  notice.className,
  props.classNames.notice,
  notice.classNames?.notice,
  {
    'is-rtl': props.rtl
  }
]

const getNoticeStyle = (notice: MessageNotice) => [props.styles.notice, notice.style, notice.styles?.notice]

const getIconClass = (notice: MessageNotice) => [
  props.prefixCls ? `${props.prefixCls}-notice-icon` : undefined,
  props.classNames.icon,
  notice.classNames?.icon
]

const getIconStyle = (notice: MessageNotice) => [props.styles.icon, notice.styles?.icon]

const getContentClass = (notice: MessageNotice) => [
  props.prefixCls ? `${props.prefixCls}-notice-content` : undefined,
  props.classNames.content,
  notice.classNames?.content
]

const getContentStyle = (notice: MessageNotice) => [props.styles.content, notice.styles?.content]

const getCloseClass = (notice: MessageNotice) => [
  props.prefixCls ? `${props.prefixCls}-notice-close` : undefined,
  props.classNames.close,
  notice.classNames?.close
]

const getCloseStyle = (notice: MessageNotice) => [props.styles.close, notice.styles?.close]
</script>
