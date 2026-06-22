<template>
  <section class="aheart-descriptions" :class="descriptionsClass" :style="descriptionsStyle">
    <div
      v-if="title || extra"
      class="aheart-descriptions__header"
      :class="classNames.header"
      :style="styles.header"
    >
      <div class="aheart-descriptions__title" :class="classNames.title" :style="styles.title">{{ title }}</div>
      <div v-if="extra" class="aheart-descriptions__extra" :class="classNames.extra" :style="styles.extra">
        {{ extra }}
      </div>
    </div>
    <div class="aheart-descriptions__table" :class="classNames.table" :style="styles.table" role="table">
      <div
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
        class="aheart-descriptions__row"
        :class="classNames.row"
        :style="styles.row"
        role="row"
      >
        <div
          v-for="item in row"
          :key="item.resolvedKey"
          class="aheart-descriptions__item"
          :class="getItemClass(item)"
          :style="getItemStyle(item)"
          role="cell"
        >
          <div
            class="aheart-descriptions__label"
            :class="getLabelClass()"
            :style="getLabelStyle(item)"
          >
            {{ item.label }}
          </div>
          <div
            class="aheart-descriptions__content"
            :class="classNames.content"
            :style="getContentStyle(item)"
          >
            {{ item.resolvedContent }}
          </div>
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
const normalizedColumn = computed(() => Math.max(1, Math.floor(props.column)))

interface RenderedDescriptionItem extends DescriptionItem {
  resolvedKey: string | number
  resolvedContent: string | number
  span: number
}

const resolveItemContent = (item: DescriptionItem) => item.content ?? item.children ?? ''

const resolveNumericSpan = (item: DescriptionItem, currentSpan: number) => {
  if (item.span === 'filled') {
    const remainingSpan = normalizedColumn.value - currentSpan
    return remainingSpan > 0 ? remainingSpan : normalizedColumn.value
  }

  return Math.max(1, Math.min(item.span ?? 1, normalizedColumn.value))
}

const resolveRenderedItem = (item: DescriptionItem, index: number, span: number): RenderedDescriptionItem => ({
  ...item,
  resolvedKey: item.key ?? `${item.label}-${index}`,
  resolvedContent: resolveItemContent(item),
  span
})

const rows = computed(() => {
  const nextRows: RenderedDescriptionItem[][] = []
  let currentRow: RenderedDescriptionItem[] = []
  let currentSpan = 0

  normalizedItems.value.forEach((item, index) => {
    let itemSpan = resolveNumericSpan(item, currentSpan)

    if (currentRow.length > 0 && currentSpan + itemSpan > normalizedColumn.value) {
      nextRows.push(currentRow)
      currentRow = []
      currentSpan = 0
      itemSpan = resolveNumericSpan(item, currentSpan)
    }

    currentRow.push(resolveRenderedItem(item, index, itemSpan))
    currentSpan += itemSpan

    if (currentSpan >= normalizedColumn.value) {
      nextRows.push(currentRow)
      currentRow = []
      currentSpan = 0
    }
  })

  if (currentRow.length > 0) {
    nextRows.push(currentRow)
  }

  return nextRows
})

const descriptionsClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames.root,
  `aheart-descriptions--${props.layout}`,
  `aheart-descriptions--${resolvedSize.value}`,
  {
    'is-bordered': props.bordered
  }
])

const descriptionsStyle = computed(() => [
  {
    '--aheart-descriptions-column': normalizedColumn.value
  },
  props.style,
  props.styles.root
])

const getItemClass = (item: RenderedDescriptionItem) => [props.classNames.item, item.className]

const getItemStyle = (item: RenderedDescriptionItem) => [
  {
    '--aheart-descriptions-item-span': item.span
  },
  props.styles.item,
  item.style
]

const getLabelClass = () => [
  props.classNames.label,
  {
    'has-colon': props.colon
  }
]

const getLabelStyle = (item: RenderedDescriptionItem) => [props.labelStyle, props.styles.label, item.labelStyle]
const getContentStyle = (item: RenderedDescriptionItem) => [props.contentStyle, props.styles.content, item.contentStyle]
</script>
