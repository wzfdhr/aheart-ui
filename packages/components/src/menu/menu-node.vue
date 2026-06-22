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
      class="aheart-menu__submenu-title"
      :class="classNames.submenuTitle"
      :style="[nodeLevelStyle, styles.submenuTitle]"
      type="button"
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
      v-if="forceSubMenuRender || isOpen"
      v-show="isOpen"
      class="aheart-menu__submenu-list"
      :class="classNames.submenuList"
      :style="styles.submenuList"
      role="menu"
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
import { computed, defineComponent, type PropType, type StyleValue, type VNodeChild } from 'vue'
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
