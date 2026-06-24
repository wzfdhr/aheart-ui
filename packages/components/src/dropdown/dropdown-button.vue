<template>
  <span class="aheart-dropdown-button" :class="rootClass" :style="rootStyle">
    <ARenderNode :node="renderedButtons" />
  </span>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, useSlots, type PropType, type VNodeChild } from 'vue'
import AButton from '../button'
import ADropdown from './dropdown.vue'
import {
  dropdownButtonEmits,
  dropdownButtonProps,
  type DropdownClickInfo,
  type DropdownOpenChangeInfo
} from './types'
import './style.css'

defineOptions({
  name: 'ADropdownButton'
})

const props = defineProps(dropdownButtonProps)
const emit = defineEmits(dropdownButtonEmits)
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ADropdownButtonRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild | VNodeChild[]>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const isLoading = computed(() => props.loading === true || (typeof props.loading === 'object' && props.loading !== null))
const triggerDisabled = computed(() => (isLoading.value ? true : props.disabled))
const rootClass = computed(() => [
  props.className,
  props.rootClassName,
  {
    'is-disabled': props.disabled,
    'is-loading': isLoading.value
  }
])
const rootStyle = computed(() => props.style)
const toggleIcon = computed(() =>
  props.icon === undefined ? h('span', { class: 'aheart-dropdown-button__default-icon' }, 'v') : props.icon
)

const handleMainClick = (event: MouseEvent) => {
  emit('click', event)
}

const handleOpenChange = (open: boolean, info?: DropdownOpenChangeInfo) => {
  emit('openChange', open, info)
}

const handleMenuClick = (info: DropdownClickInfo) => {
  emit('menuClick', info)
}

const mainButtonNode = computed(() =>
  h(
    AButton,
    {
      className: 'aheart-dropdown-button__main',
      type: props.type,
      size: props.size,
      nativeType: props.nativeType,
      htmlType: props.htmlType,
      danger: props.danger,
      loading: props.loading,
      disabled: props.disabled,
      href: props.href,
      target: props.target,
      title: props.title,
      onClick: handleMainClick
    },
    {
      default: () => slots.default?.()
    }
  )
)

const dropdownNode = computed(() =>
  h(
    ADropdown,
    {
      className: 'aheart-dropdown-button__dropdown',
      menu: props.menu,
      trigger: props.trigger,
      placement: props.placement,
      getPopupContainer: props.getPopupContainer,
      mouseEnterDelay: props.mouseEnterDelay,
      mouseLeaveDelay: props.mouseLeaveDelay,
      open: props.open,
      defaultOpen: props.defaultOpen,
      disabled: triggerDisabled.value,
      arrow: props.arrow,
      destroyOnHidden: props.destroyOnHidden,
      destroyPopupOnHide: props.destroyPopupOnHide,
      overlayClassName: props.overlayClassName,
      overlayStyle: props.overlayStyle,
      classNames: props.classNames,
      styles: props.styles,
      popupRender: props.popupRender,
      dropdownRender: props.dropdownRender,
      'onUpdate:open': (open: boolean) => emit('update:open', open),
      onOpenChange: handleOpenChange,
      onClick: handleMenuClick
    },
    {
      default: () =>
        h(
          AButton,
          {
            className: 'aheart-dropdown-button__toggle',
            type: props.type,
            size: props.size,
            danger: props.danger,
            disabled: triggerDisabled.value,
            icon: toggleIcon.value,
            title: props.title,
            'aria-label': 'Open menu'
          },
          {
            default: () => []
          }
        ),
      popup: slots.popup
    }
  )
)

const buttonNodes = computed(() => [mainButtonNode.value, dropdownNode.value])
const renderedButtons = computed(() => (props.buttonsRender ? props.buttonsRender(buttonNodes.value) : buttonNodes.value))
</script>
