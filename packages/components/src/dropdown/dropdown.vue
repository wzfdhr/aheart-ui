<template>
  <div
    class="aheart-dropdown"
    :class="dropdownClass"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      class="aheart-dropdown__trigger"
      :aria-expanded="mergedOpen ? 'true' : 'false'"
      @click="handleTriggerClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot />
    </span>
    <div v-if="mergedOpen" class="aheart-dropdown__overlay" :class="overlayClass" role="presentation">
      <span v-if="arrow" class="aheart-dropdown__arrow" aria-hidden="true" />
      <AMenu
        v-if="menu?.items?.length"
        :items="menu.items"
        :selectable="menu.selectable ?? false"
        :selected-keys="menu.selectedKeys"
        :default-selected-keys="menu.defaultSelectedKeys"
        @click="handleMenuClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import AMenu, { type MenuClickInfo } from '../menu'
import { dropdownEmits, dropdownProps } from './types'
import './style.css'

defineOptions({
  name: 'ADropdown'
})

const props = defineProps(dropdownProps)
const emit = defineEmits(dropdownEmits)
const config = useAheartConfig()

const innerOpen = ref(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const mergedOpen = computed(() => props.open ?? innerOpen.value)
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const triggerSet = computed(() => new Set(props.trigger))

const dropdownClass = computed(() => [
  {
    'is-open': mergedOpen.value,
    'is-disabled': isDisabled.value
  }
])

const overlayClass = computed(() => [`aheart-dropdown__overlay--${props.placement}`])

watch(
  () => props.defaultOpen,
  (open) => {
    if (!isControlled.value) {
      innerOpen.value = open
    }
  }
)

const setOpen = (open: boolean) => {
  if (isDisabled.value) {
    return
  }

  if (!isControlled.value) {
    innerOpen.value = open
  }

  emit('update:open', open)
  emit('openChange', open)
}

const handleTriggerClick = () => {
  if (!triggerSet.value.has('click')) {
    return
  }

  setOpen(!mergedOpen.value)
}

const handleMouseEnter = () => {
  if (triggerSet.value.has('hover')) {
    setOpen(true)
  }
}

const handleMouseLeave = () => {
  if (triggerSet.value.has('hover')) {
    setOpen(false)
  }
}

const handleMenuClick = (info: MenuClickInfo) => {
  emit('click', info)
  setOpen(false)
}
</script>
