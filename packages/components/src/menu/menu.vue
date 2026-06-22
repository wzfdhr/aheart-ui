<template>
  <nav class="aheart-menu" :class="menuClass" :style="rootStyle" aria-label="menu">
    <ul role="menu" class="aheart-menu__list" :class="classNames.list" :style="styles.list">
      <AMenuNode
        v-for="item in normalizedItems"
        :key="item.key"
        :item="item"
        :selected-keys="mergedSelectedKeys"
        :open-keys="mergedOpenKeys"
        :disabled="isDisabled"
        :mode="mode"
        :force-sub-menu-render="forceSubMenuRender"
        :trigger-sub-menu-action="triggerSubMenuAction"
        :expand-icon="expandIcon"
        :class-names="classNames"
        :styles="styles"
        @item-click="handleItemClick"
        @submenu-toggle="handleSubmenuToggle"
        @submenu-open-change="handleSubmenuOpenChange"
      />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AMenuNode from './menu-node.vue'
import { menuEmits, menuProps, type MenuClickInfo } from './types'
import './style.css'

defineOptions({
  name: 'AMenu'
})

const props = defineProps(menuProps)
const emit = defineEmits(menuEmits)
const config = useAheartConfig()

const innerSelectedKeys = ref([...props.defaultSelectedKeys])
const innerOpenKeys = ref([...props.defaultOpenKeys])

const normalizedItems = computed(() => props.items ?? [])
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const mergedSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value)
const mergedOpenKeys = computed(() => props.openKeys ?? innerOpenKeys.value)
const isSelectedControlled = computed(() => props.selectedKeys !== undefined)
const isOpenControlled = computed(() => props.openKeys !== undefined)

const menuClass = computed(() => [
  `aheart-menu--${props.mode}`,
  `aheart-menu--${props.theme}`,
  props.className,
  props.classNames.root,
  {
    'is-disabled': isDisabled.value,
    'is-collapsed': props.inlineCollapsed
  }
])

const rootStyle = computed(() => [
  { '--aheart-menu-inline-indent': `${props.inlineIndent}px` },
  props.style,
  props.styles.root
])

watch(
  () => props.defaultSelectedKeys,
  (keys) => {
    if (!isSelectedControlled.value) {
      innerSelectedKeys.value = [...keys]
    }
  }
)

watch(
  () => props.defaultOpenKeys,
  (keys) => {
    if (!isOpenControlled.value) {
      innerOpenKeys.value = [...keys]
    }
  }
)

const handleItemClick = (info: MenuClickInfo) => {
  if (isDisabled.value) {
    return
  }

  emit('click', info)

  if (!props.selectable) {
    return
  }

  const alreadySelected = mergedSelectedKeys.value.includes(info.key)
  const nextSelectedKeys = props.multiple
    ? alreadySelected
      ? mergedSelectedKeys.value.filter((key) => key !== info.key)
      : [...mergedSelectedKeys.value, info.key]
    : [info.key]

  if (!isSelectedControlled.value) {
    innerSelectedKeys.value = nextSelectedKeys
  }

  emit('update:selectedKeys', nextSelectedKeys)

  if (alreadySelected && props.multiple) {
    emit('deselect', {
      ...info,
      selectedKeys: nextSelectedKeys
    })
    return
  }

  emit('select', {
    ...info,
    selectedKeys: nextSelectedKeys
  })
}

const handleSubmenuToggle = (key: string) => {
  setOpenKey(key)
}

const handleSubmenuOpenChange = ({ key, open }: { key: string; open: boolean }) => {
  setOpenKey(key, open)
}

const setOpenKey = (key: string, open?: boolean) => {
  if (isDisabled.value) {
    return
  }

  const isOpen = mergedOpenKeys.value.includes(key)
  const shouldOpen = open ?? !isOpen

  if (isOpen === shouldOpen) {
    return
  }

  const nextOpenKeys = shouldOpen
    ? [...mergedOpenKeys.value, key]
    : mergedOpenKeys.value.filter((currentKey) => currentKey !== key)

  if (!isOpenControlled.value) {
    innerOpenKeys.value = nextOpenKeys
  }

  emit('openChange', nextOpenKeys)
  emit('update:openKeys', nextOpenKeys)
}
</script>
