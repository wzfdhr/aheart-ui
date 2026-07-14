<template>
  <nav
    ref="rootRef"
    class="aheart-menu"
    :class="menuClass"
    :style="rootStyle"
    aria-label="menu"
    @keydown="handleMenuKeydown"
  >
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
import { computed, nextTick, ref, watch } from 'vue'
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
const rootRef = ref<HTMLElement | null>(null)

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

  setOpenKeys(nextOpenKeys)
}

const setOpenKeys = (keys: string[]) => {
  if (!isOpenControlled.value) {
    innerOpenKeys.value = keys
  }

  emit('openChange', keys)
  emit('update:openKeys', keys)
}

const getKeyboardItems = () => {
  if (!rootRef.value) {
    return []
  }

  return Array.from(
    rootRef.value.querySelectorAll<HTMLButtonElement>('[data-menu-key], [data-submenu-key]')
  ).filter((button) => {
    if (button.disabled) {
      return false
    }

    return !Array.from(button.closest('.aheart-menu')?.querySelectorAll('.aheart-menu__submenu-list[data-open="false"]') ?? [])
      .some((list) => list.contains(button))
  })
}

const focusRelativeItem = (current: HTMLButtonElement, offset: number) => {
  const items = getKeyboardItems()
  const currentIndex = items.indexOf(current)

  if (currentIndex < 0 || items.length === 0) {
    return
  }

  items[(currentIndex + offset + items.length) % items.length]?.focus()
}

const getSubmenuKey = (button: HTMLButtonElement) => button.dataset.submenuKey

const focusFirstSubmenuItem = async (button: HTMLButtonElement) => {
  const key = getSubmenuKey(button)
  if (!key) return

  setOpenKey(key, true)
  await nextTick()
  const submenu = button.closest('.aheart-menu__submenu')
  submenu?.querySelector<HTMLButtonElement>('.aheart-menu__submenu-list[data-open="true"] [data-menu-key], .aheart-menu__submenu-list[data-open="true"] [data-submenu-key]')?.focus()
}

const closeCurrentSubmenu = (button: HTMLButtonElement) => {
  const parentList = button.closest('.aheart-menu__submenu-list[data-open="true"]')
  const parentSubmenu = parentList?.closest('.aheart-menu__submenu')
  const parentTrigger = parentSubmenu?.querySelector<HTMLButtonElement>(':scope > [data-submenu-key]')
  const parentKey = parentTrigger && getSubmenuKey(parentTrigger)

  if (parentTrigger && parentKey) {
    setOpenKey(parentKey, false)
    parentTrigger.focus()
    return
  }

  if (mergedOpenKeys.value.length) {
    setOpenKeys([])
  }
}

const handleMenuKeydown = (event: KeyboardEvent) => {
  const current = event.target instanceof HTMLButtonElement
    ? event.target.closest<HTMLButtonElement>('[data-menu-key], [data-submenu-key]')
    : null

  if (!current || current.disabled) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    current.click()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeCurrentSubmenu(current)
    return
  }

  const horizontal = props.mode === 'horizontal'

  if ((horizontal && event.key === 'ArrowRight') || (!horizontal && event.key === 'ArrowDown')) {
    event.preventDefault()
    focusRelativeItem(current, 1)
    return
  }

  if ((horizontal && event.key === 'ArrowLeft') || (!horizontal && event.key === 'ArrowUp')) {
    event.preventDefault()
    focusRelativeItem(current, -1)
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    if (getSubmenuKey(current)) {
      event.preventDefault()
      void focusFirstSubmenuItem(current)
    }
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    closeCurrentSubmenu(current)
  }
}
</script>
