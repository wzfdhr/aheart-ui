<template>
  <li v-if="item.type === 'divider'" class="aheart-menu__divider" role="separator" />
  <li v-else-if="item.type === 'group'" class="aheart-menu__group" role="presentation">
    <div class="aheart-menu__group-title">{{ item.label }}</div>
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
        :key-path="[...keyPath, item.key]"
        @item-click="$emit('itemClick', $event)"
        @submenu-toggle="$emit('submenuToggle', $event)"
      />
    </ul>
  </li>
  <li v-else-if="hasChildren" class="aheart-menu__submenu" :class="nodeClass" role="presentation">
    <button
      class="aheart-menu__submenu-title"
      type="button"
      :data-submenu-key="item.key"
      :disabled="isDisabled"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click="handleSubmenuClick"
    >
      <span class="aheart-menu__label">{{ item.label }}</span>
      <span class="aheart-menu__submenu-arrow" aria-hidden="true">›</span>
    </button>
    <ul v-if="isOpen" class="aheart-menu__submenu-list" role="menu">
      <AMenuNode
        v-for="child in item.children ?? []"
        :key="child.key"
        :item="child"
        :level="level + 1"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        :disabled="disabled"
        :mode="mode"
        :key-path="[...keyPath, item.key]"
        @item-click="$emit('itemClick', $event)"
        @submenu-toggle="$emit('submenuToggle', $event)"
      />
    </ul>
  </li>
  <li v-else class="aheart-menu__item" :class="nodeClass" role="none">
    <button
      class="aheart-menu__item-button"
      type="button"
      role="menuitem"
      :data-menu-key="item.key"
      :disabled="isDisabled"
      :aria-current="isSelected ? 'page' : undefined"
      @click="handleItemClick"
    >
      <span class="aheart-menu__label">{{ item.label }}</span>
    </button>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuClickInfo, MenuItem, MenuMode } from './types'

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
    keyPath?: string[]
  }>(),
  {
    level: 0,
    disabled: false,
    mode: 'vertical',
    keyPath: () => []
  }
)

const emit = defineEmits<{
  itemClick: [info: MenuClickInfo]
  submenuToggle: [key: string]
}>()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const isOpen = computed(() => props.openKeys.includes(props.item.key))
const isSelected = computed(() => props.selectedKeys.includes(props.item.key))
const isDisabled = computed(() => props.disabled || Boolean(props.item.disabled))
const currentKeyPath = computed(() => [...props.keyPath, props.item.key])

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

  emit('submenuToggle', props.item.key)
}
</script>
