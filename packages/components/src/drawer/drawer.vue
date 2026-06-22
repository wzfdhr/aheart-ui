<template>
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
        <button v-if="closable" :class="closeClass" :style="semanticStyle('close')" type="button" aria-label="Close" @click="close">
          ×
        </button>
        <div v-if="title || $slots.title" :class="titleClass" :style="semanticStyle('title')">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="hasExtra" :class="extraClass" :style="semanticStyle('extra')">
          <slot name="extra">{{ extra }}</slot>
        </div>
      </header>
      <div :class="bodyClass" :style="semanticStyle('body')">
        <ASkeleton v-if="loading" active :paragraph="{ rows: 4 }" />
        <slot v-else />
      </div>
      <footer v-if="hasFooter" :class="footerClass" :style="semanticStyle('footer')">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch, type CSSProperties } from 'vue'
import ASkeleton from '../skeleton'
import { drawerEmits, drawerProps, type DrawerSemanticPart } from './types'
import './style.css'

defineOptions({
  name: 'ADrawer'
})

const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)
const slots = useSlots()
const hasRendered = ref(props.open || props.forceRender)

const normalizeSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose)
const shouldRender = computed(() => props.open || props.forceRender || hasRendered.value)
const hasExtra = computed(() => Boolean(slots.extra) || props.extra !== undefined)
const hasHeader = computed(() => Boolean(props.title || slots.title || hasExtra.value || props.closable))

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
const hasFooter = computed(() => props.footer || Boolean(slots.footer))

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
const closeClass = computed(() => ['aheart-drawer__close', semanticClass('close')])

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
