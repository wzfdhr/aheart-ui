<template>
  <li
    v-if="item.type === 'divider'"
    class="aheart-menu__divider"
    :class="[classNames.divider, { 'is-dashed': item.dashed }]"
    :style="styles.divider"
    role="separator"
  />
  <li
    v-else-if="item.type === 'group'"
    class="aheart-menu__group"
    :class="classNames.group"
    :style="styles.group"
    role="presentation"
  >
    <div class="aheart-menu__group-title" :class="classNames.groupTitle" :style="styles.groupTitle">
      <ARenderNode :node="item.label" />
    </div>
    <ul class="aheart-menu__group-list" role="group">
      <AMenuNode
        v-for="child in item.children ?? []"
        :key="child.key"
        :item="child"
        :level="level + 1"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        :disabled="disabled"
        :mode="mode"
        :force-sub-menu-render="forceSubMenuRender"
        :trigger-sub-menu-action="triggerSubMenuAction"
        :expand-icon="expandIcon"
        :class-names="classNames"
        :styles="styles"
        :key-path="[...keyPath, item.key]"
        @item-click="$emit('itemClick', $event)"
        @submenu-toggle="$emit('submenuToggle', $event)"
        @submenu-open-change="$emit('submenuOpenChange', $event)"
      />
    </ul>
  </li>
  <li
    v-else-if="hasChildren"
    class="aheart-menu__submenu"
    :class="[nodeClass, classNames.submenu]"
    :style="styles.submenu"
    role="presentation"
    @mouseenter="handleSubmenuMouseEnter"
    @mouseleave="handleSubmenuMouseLeave"
  >
    <button
      ref="titleRef"
      class="aheart-menu__submenu-title"
      :class="classNames.submenuTitle"
      :style="[nodeLevelStyle, styles.submenuTitle]"
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      :data-submenu-key="item.key"
      :disabled="isDisabled"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :title="item.title"
      @click="handleSubmenuClick"
    >
      <span v-if="item.icon" class="aheart-menu__icon" :class="classNames.icon" :style="styles.icon">
        <ARenderNode :node="item.icon" />
      </span>
      <span class="aheart-menu__label" :class="classNames.label" :style="styles.label">
        <ARenderNode :node="item.label" />
      </span>
      <span v-if="item.extra" class="aheart-menu__extra" :class="classNames.extra" :style="styles.extra">
        <ARenderNode :node="item.extra" />
      </span>
      <span
        class="aheart-menu__submenu-arrow aheart-menu__expand-icon"
        :class="classNames.expandIcon"
        :style="styles.expandIcon"
        aria-hidden="true"
      >
        <ARenderNode :node="expandIconNode" />
      </span>
    </button>
    <ul
      v-if="motion.isMounted.value"
      v-show="motion.phase.value !== 'hidden'"
      ref="submenuRef"
      class="aheart-menu__submenu-list"
      :class="submenuListClass"
      :style="submenuListStyle"
      role="menu"
      :data-open="isOpen ? 'true' : 'false'"
      :aria-hidden="isOpen ? undefined : 'true'"
    >
      <AMenuNode
        v-for="child in item.children ?? []"
        :key="child.key"
        :item="child"
        :level="level + 1"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        :disabled="disabled"
        :mode="mode"
        :force-sub-menu-render="forceSubMenuRender"
        :trigger-sub-menu-action="triggerSubMenuAction"
        :expand-icon="expandIcon"
        :class-names="classNames"
        :styles="styles"
        :key-path="[...keyPath, item.key]"
        @item-click="$emit('itemClick', $event)"
        @submenu-toggle="$emit('submenuToggle', $event)"
        @submenu-open-change="$emit('submenuOpenChange', $event)"
      />
    </ul>
  </li>
  <li
    v-else
    class="aheart-menu__item"
    :class="[nodeClass, classNames.item]"
    :style="styles.item"
    role="none"
  >
    <button
      class="aheart-menu__item-button"
      :class="classNames.itemButton"
      :style="[nodeLevelStyle, styles.itemButton]"
      type="button"
      role="menuitem"
      :data-menu-key="item.key"
      :disabled="isDisabled"
      :aria-current="isSelected ? 'page' : undefined"
      :title="item.title"
      @click="handleItemClick"
    >
      <span v-if="item.icon" class="aheart-menu__icon" :class="classNames.icon" :style="styles.icon">
        <ARenderNode :node="item.icon" />
      </span>
      <span class="aheart-menu__label" :class="classNames.label" :style="styles.label">
        <ARenderNode :node="item.label" />
      </span>
      <span v-if="item.extra" class="aheart-menu__extra" :class="classNames.extra" :style="styles.extra">
        <ARenderNode :node="item.extra" />
      </span>
    </button>
  </li>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
  type StyleValue,
  type VNodeChild
} from 'vue'
import { useFloatingPosition } from '../utils/use-floating-position'
import { useMotionPresence } from '../utils/use-motion-presence'
import type {
  MenuClassNames,
  MenuClickInfo,
  MenuExpandIcon,
  MenuItem,
  MenuMode,
  MenuStyles,
  MenuTriggerSubMenuAction
} from './types'

defineOptions({
  name: 'AMenuNode'
})

const props = withDefaults(
  defineProps<{
    item: MenuItem
    level?: number
    selectedKeys: string[]
    openKeys: string[]
    disabled?: boolean
    mode?: MenuMode
    forceSubMenuRender?: boolean
    triggerSubMenuAction?: MenuTriggerSubMenuAction
    expandIcon?: MenuExpandIcon
    classNames?: MenuClassNames
    styles?: MenuStyles
    keyPath?: string[]
  }>(),
  {
    level: 0,
    disabled: false,
    mode: 'vertical',
    forceSubMenuRender: false,
    triggerSubMenuAction: 'click',
    classNames: () => ({}),
    styles: () => ({}),
    keyPath: () => []
  }
)

const emit = defineEmits<{
  itemClick: [info: MenuClickInfo]
  submenuToggle: [key: string]
  submenuOpenChange: [info: { key: string; open: boolean }]
}>()

const ARenderNode = defineComponent({
  name: 'AMenuRenderNode',
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

const hasChildren = computed(() => Boolean(props.item.children?.length))
const isOpen = computed(() => props.openKeys.includes(props.item.key))
const isSelected = computed(() => props.selectedKeys.includes(props.item.key))
const isDisabled = computed(() => props.disabled || Boolean(props.item.disabled))
const currentKeyPath = computed(() => [...props.keyPath, props.item.key])
const nodeLevelStyle = computed<StyleValue>(() => ({ '--aheart-menu-node-level': props.level }))
const titleRef = ref<HTMLElement | null>(null)
const submenuRef = ref<HTMLElement | null>(null)
const submenuHeight = ref(0)
const isFloatingSubmenu = computed(() => props.mode === 'horizontal')
const motion = useMotionPresence(isOpen, {
  forceRender: () => props.forceSubMenuRender,
  destroyOnHidden: () => !props.forceSubMenuRender,
  duration: 120
})
const floating = useFloatingPosition({
  reference: titleRef,
  floating: submenuRef,
  open: () => isFloatingSubmenu.value && motion.phase.value !== 'hidden',
  placement: () => (props.level === 0 ? 'bottomLeft' : 'rightTop'),
  offset: 4,
  autoAdjustOverflow: true
})
const submenuListClass = computed(() => [
  props.classNames.submenuList,
  `is-${motion.phase.value}`,
  `aheart-floating--${floating.placement.value}`,
  { 'is-floating': isFloatingSubmenu.value }
])
const submenuListStyle = computed<StyleValue>(() => [
  isFloatingSubmenu.value
    ? floating.popupStyle.value
    : { '--aheart-menu-submenu-height': `${submenuHeight.value}px` },
  props.styles.submenuList
])
let resizeObserver: ResizeObserver | undefined

const measureSubmenu = () => {
  if (!submenuRef.value || isFloatingSubmenu.value) return
  submenuHeight.value = submenuRef.value.scrollHeight
}

watch(
  [isOpen, () => props.item.children?.length],
  () => {
    void nextTick(measureSubmenu)
  },
  { immediate: true }
)

onMounted(() => {
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(measureSubmenu)
  if (submenuRef.value) resizeObserver.observe(submenuRef.value)
})

watch(submenuRef, (element, previousElement) => {
  if (!resizeObserver) return
  if (previousElement) resizeObserver.unobserve(previousElement)
  if (element) resizeObserver.observe(element)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
const expandIconNode = computed(() => {
  if (typeof props.expandIcon === 'function') {
    return props.expandIcon({
      item: props.item,
      isOpen: isOpen.value,
      disabled: isDisabled.value,
      level: props.level
    })
  }

  return props.expandIcon ?? '›'
})

const nodeClass = computed(() => [
  `aheart-menu__node--level-${props.level}`,
  {
    'is-open': isOpen.value,
    'is-selected': isSelected.value,
    'is-disabled': isDisabled.value,
    'is-danger': props.item.danger
  }
])

const handleItemClick = () => {
  if (isDisabled.value) {
    return
  }

  emit('itemClick', {
    key: props.item.key,
    keyPath: currentKeyPath.value,
    item: props.item
  })
}

const handleSubmenuClick = () => {
  if (isDisabled.value) {
    return
  }

  if (props.triggerSubMenuAction !== 'click') {
    return
  }

  emit('submenuToggle', props.item.key)
}

const handleSubmenuMouseEnter = () => {
  if (isDisabled.value || props.triggerSubMenuAction !== 'hover') {
    return
  }

  emit('submenuOpenChange', { key: props.item.key, open: true })
}

const handleSubmenuMouseLeave = () => {
  if (isDisabled.value || props.triggerSubMenuAction !== 'hover') {
    return
  }

  emit('submenuOpenChange', { key: props.item.key, open: false })
}
</script>
