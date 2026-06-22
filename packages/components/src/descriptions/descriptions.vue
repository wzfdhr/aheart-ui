<template>
  <section class="aheart-descriptions" :class="descriptionsClass" :style="descriptionsStyle">
    <div v-if="title || extra" class="aheart-descriptions__header">
      <div class="aheart-descriptions__title">{{ title }}</div>
      <div v-if="extra" class="aheart-descriptions__extra">{{ extra }}</div>
    </div>
    <div class="aheart-descriptions__table" role="table">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="aheart-descriptions__row"
        role="row"
      >
        <div
          v-for="item in row"
          :key="item.label"
          class="aheart-descriptions__item"
          :style="{ '--aheart-descriptions-item-span': item.span ?? 1 }"
          role="cell"
        >
          <div class="aheart-descriptions__label">{{ item.label }}</div>
          <div class="aheart-descriptions__content">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { descriptionsProps, type DescriptionItem } from './types'
import './style.css'

defineOptions({
  name: 'ADescriptions'
})

const props = defineProps(descriptionsProps)
const config = useAheartConfig()

const normalizedItems = computed(() => props.items ?? [])
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))

const rows = computed(() => {
  const nextRows: DescriptionItem[][] = []
  let currentRow: DescriptionItem[] = []
  let currentSpan = 0

  normalizedItems.value.forEach((item) => {
    const itemSpan = Math.max(1, Math.min(item.span ?? 1, props.column))

    if (currentRow.length > 0 && currentSpan + itemSpan > props.column) {
      nextRows.push(currentRow)
      currentRow = []
      currentSpan = 0
    }

    currentRow.push({ ...item, span: itemSpan })
    currentSpan += itemSpan
  })

  if (currentRow.length > 0) {
    nextRows.push(currentRow)
  }

  return nextRows
})

const descriptionsClass = computed(() => [
  `aheart-descriptions--${props.layout}`,
  `aheart-descriptions--${resolvedSize.value}`,
  {
    'is-bordered': props.bordered
  }
])

const descriptionsStyle = computed(() => ({
  '--aheart-descriptions-column': props.column
}))
</script>
