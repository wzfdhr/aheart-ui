<template>
  <Teleport :to="teleportTo" :disabled="!shouldTeleport">
    <div
      v-if="shouldRender"
      v-show="open"
      :class="rootClass"
      :style="rootStyle"
      role="presentation"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div v-if="mask" :class="maskClass" :style="maskStyle" @click="handleMaskClick" />
      <section
        :class="panelClass"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
      >
        <header v-if="hasHeader" :class="headerClass" :style="semanticStyle('header')">
          <button
            v-if="showCloseButton && !isCloseAtEnd"
            :class="closeClass"
            :style="semanticStyle('close')"
            :disabled="isCloseButtonDisabled"
            type="button"
            aria-label="Close"
            @click="handleCloseButtonClick"
          >
            <ADrawerRenderNode :node="resolvedCloseIcon" />
          </button>
          <div v-if="hasTitle" :class="titleClass" :style="semanticStyle('title')">
            <slot name="title">
              <ADrawerRenderNode :node="title" />
            </slot>
          </div>
          <div v-if="hasExtra" :class="extraClass" :style="semanticStyle('extra')">
            <slot name="extra">
              <ADrawerRenderNode :node="extra" />
            </slot>
          </div>
          <button
            v-if="showCloseButton && isCloseAtEnd"
            :class="closeClass"
            :style="semanticStyle('close')"
            :disabled="isCloseButtonDisabled"
            type="button"
            aria-label="Close"
            @click="handleCloseButtonClick"
          >
            <ADrawerRenderNode :node="resolvedCloseIcon" />
          </button>
        </header>
        <div :class="bodyClass" :style="semanticStyle('body')">
          <ASkeleton v-if="loading" active :paragraph="{ rows: 4 }" />
          <slot v-else />
        </div>
        <footer v-if="hasFooter" :class="footerClass" :style="semanticStyle('footer')">
          <slot name="footer">
            <ADrawerRenderNode v-if="shouldRenderFooterProp" :node="footer" />
          </slot>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, useSlots, watch, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import ASkeleton from '../skeleton'
import { drawerEmits, drawerProps, type DrawerClosableConfig, type DrawerSemanticPart } from './types'
import './style.css'

defineOptions({
  name: 'ADrawer'
})

const ADrawerRenderNode = defineComponent({
  name: 'ADrawerRenderNode',
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

const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)
const slots = useSlots()
const hasRendered = ref(props.open || props.forceRender)

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)
const getDefaultContainer = () => (typeof document === 'undefined' ? false : document.body)
const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer())
const teleportTarget = computed(() => {
  const container = resolvedContainer.value

  return typeof container === 'function' ? container() : container
})
const shouldTeleport = computed(() => teleportTarget.value !== false)
const teleportTo = computed(() => (teleportTarget.value === false ? 'body' : teleportTarget.value))

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose)
const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value)
const isRenderableNode = (value: VNodeChild) =>
  value !== undefined && value !== null && value !== false && value !== true && value !== ''
const isClosableConfig = (value: typeof props.closable): value is DrawerClosableConfig =>
  typeof value === 'object' && value !== null
const closableConfig = computed(() => (isClosableConfig(props.closable) ? props.closable : undefined))
const resolvedCloseIcon = computed(() => {
  if (closableConfig.value?.closeIcon !== undefined) {
    return closableConfig.value.closeIcon
  }

  if (props.closeIcon !== undefined) {
    return props.closeIcon
  }

  return '×'
})
const showCloseButton = computed(
  () => props.closable !== false && resolvedCloseIcon.value !== false && resolvedCloseIcon.value !== null
)
const isCloseButtonDisabled = computed(() => closableConfig.value?.disabled === true)
const closePlacement = computed(() => closableConfig.value?.placement ?? 'start')
const isCloseAtEnd = computed(() => closePlacement.value === 'end')
const hasTitle = computed(() => Boolean(slots.title) || isRenderableNode(props.title))
const hasExtra = computed(() => Boolean(slots.extra) || isRenderableNode(props.extra))
const hasHeader = computed(() => hasTitle.value || hasExtra.value || showCloseButton.value)

const resolvedSize = computed(() => {
  if (props.size === 'large') {
    return 736
  }

  if (props.size === 'default') {
    return 378
  }

  return props.size
})

const panelStyle = computed(() =>
  isVertical.value
    ? {
        ...props.style,
        ...semanticStyle('section'),
        height: normalizeSize(props.height ?? resolvedSize.value)
      }
    : {
        ...props.style,
        ...semanticStyle('section'),
        width: normalizeSize(props.width ?? resolvedSize.value)
      }
)

const rootStyle = computed(() => ({
  ...props.rootStyle,
  ...semanticStyle('root'),
  zIndex: props.zIndex
}))

const maskStyle = computed(() => semanticStyle('mask'))
const shouldHideFooter = computed(() => props.footer === false || props.footer === null)
const shouldRenderFooterProp = computed(() => isRenderableNode(props.footer))
const hasFooter = computed(
  () => !shouldHideFooter.value && (Boolean(slots.footer) || props.footer === true || shouldRenderFooterProp.value)
)

const rootClass = computed(() => ['aheart-drawer', props.rootClassName, semanticClass('root')])
const maskClass = computed(() => ['aheart-drawer__mask', semanticClass('mask')])
const panelClass = computed(() => [
  'aheart-drawer__panel',
  `aheart-drawer__panel--${props.placement}`,
  props.className,
  semanticClass('section')
])
const headerClass = computed(() => ['aheart-drawer__header', semanticClass('header')])
const titleClass = computed(() => ['aheart-drawer__title', semanticClass('title')])
const extraClass = computed(() => ['aheart-drawer__extra', semanticClass('extra')])
const bodyClass = computed(() => ['aheart-drawer__body', { 'is-loading': props.loading }, semanticClass('body')])
const footerClass = computed(() => ['aheart-drawer__footer', semanticClass('footer')])
const closeClass = computed(() => [
  'aheart-drawer__close',
  { 'is-end': isCloseAtEnd.value },
  semanticClass('close')
])

watch(
  () => props.open,
  (open) => {
    if (open) {
      hasRendered.value = true
    } else if (shouldDestroy.value && !props.forceRender) {
      hasRendered.value = false
    }

    emit('afterOpenChange', open)
  }
)

watch(
  () => props.forceRender,
  (forceRender) => {
    if (forceRender) {
      hasRendered.value = true
    }
  }
)

const semanticClass = (part: DrawerSemanticPart) => props.classNames?.[part]
const semanticStyle = (part: DrawerSemanticPart): CSSProperties | undefined => props.styles?.[part]

const close = () => {
  emit('update:open', false)
  emit('close')
}

const handleCloseButtonClick = () => {
  if (isCloseButtonDisabled.value) {
    return
  }

  close()
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.keyboard && event.key === 'Escape') {
    close()
  }
}
</script>
