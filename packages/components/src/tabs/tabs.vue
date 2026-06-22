<template>
  <div class="aheart-tabs" :class="tabsClass">
    <div class="aheart-tabs__nav" role="tablist">
      <button
        v-for="item in normalizedItems"
        :id="getTabId(item.key)"
        :key="item.key"
        class="aheart-tabs__tab"
        :class="{ 'is-active': item.key === mergedActiveKey }"
        type="button"
        role="tab"
        :aria-selected="item.key === mergedActiveKey ? 'true' : 'false'"
        :aria-controls="getPanelId(item.key)"
        :disabled="item.disabled"
        :tabindex="item.key === mergedActiveKey ? 0 : -1"
        @click="handleTabClick(item)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-if="activeItem"
      :id="getPanelId(activeItem.key)"
      class="aheart-tabs__panel"
      role="tabpanel"
      :aria-labelledby="getTabId(activeItem.key)"
    >
      <slot v-if="activeSlotName" :name="activeSlotName">
        {{ activeItem.children }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { tabsEmits, tabsProps, type TabItem } from './types'
import './style.css'

defineOptions({
  name: 'ATabs'
})

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)
const config = useAheartConfig()

const normalizedItems = computed(() => props.items ?? [])
const firstEnabledKey = computed(() => {
  return normalizedItems.value.find((item) => !item.disabled)?.key ?? normalizedItems.value[0]?.key
})

const innerActiveKey = ref(props.defaultActiveKey ?? firstEnabledKey.value)
const isControlled = computed(() => props.activeKey !== undefined)

const mergedActiveKey = computed(() => {
  return props.activeKey ?? innerActiveKey.value ?? firstEnabledKey.value
})

const activeItem = computed(() => normalizedItems.value.find((item) => item.key === mergedActiveKey.value))
const activeSlotName = computed(() => (activeItem.value ? `tab-${activeItem.value.key}` : undefined))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))

const tabsClass = computed(() => [
  `aheart-tabs--${props.type}`,
  `aheart-tabs--${resolvedSize.value}`,
  {
    'is-centered': props.centered
  }
])

watch(
  () => props.items,
  () => {
    if (!mergedActiveKey.value || !normalizedItems.value.some((item) => item.key === mergedActiveKey.value)) {
      innerActiveKey.value = firstEnabledKey.value
    }
  },
  { deep: true }
)

const getTabId = (key: string) => `aheart-tab-${key}`
const getPanelId = (key: string) => `aheart-tab-panel-${key}`

const handleTabClick = (item: TabItem) => {
  if (item.disabled || item.key === mergedActiveKey.value) {
    return
  }

  if (!isControlled.value) {
    innerActiveKey.value = item.key
  }

  emit('update:activeKey', item.key)
  emit('change', item.key)
}
</script>
