<template>
  <nav class="aheart-breadcrumb" :class="breadcrumbClass" :style="rootStyle" aria-label="breadcrumb">
    <ol class="aheart-breadcrumb__list" :class="classNames.list" :style="styles.list">
      <li
        v-for="(item, index) in normalizedItems"
        :key="getItemKey(item, index)"
        class="aheart-breadcrumb__item"
        :class="itemClass(item, index)"
        :style="[styles.item, item.style]"
        :aria-current="isCurrent(index) ? 'page' : undefined"
      >
        <span
          v-if="itemRender"
          class="aheart-breadcrumb__custom"
          @click="handleItemClick($event, item, index)"
        >
          <ARenderNode :node="renderItem(item, index)" />
        </span>
        <a
          v-else-if="shouldRenderLink(item, index)"
          class="aheart-breadcrumb__link"
          :class="classNames.link"
          :style="styles.link"
          :href="getItemHref(item)"
          @click="handleItemClick($event, item, index)"
        >
          <ARenderNode :node="item.title" />
        </a>
        <span
          v-else
          class="aheart-breadcrumb__text"
          :class="classNames.text"
          :style="styles.text"
          @click="handleItemClick($event, item, index)"
        >
          <ARenderNode :node="item.title" />
        </span>
        <span
          v-if="!isCurrent(index)"
          class="aheart-breadcrumb__separator"
          :class="classNames.separator"
          :style="styles.separator"
          aria-hidden="true"
        >
          <ARenderNode :node="separator" />
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import { breadcrumbProps, type BreadcrumbItem } from './types'
import './style.css'

defineOptions({
  name: 'ABreadcrumb'
})

const props = defineProps(breadcrumbProps)

const ARenderNode = defineComponent({
  name: 'ABreadcrumbRenderNode',
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

const normalizedItems = computed(() => props.items ?? [])
const resolvedPaths = computed(() => normalizedItems.value.map((item) => resolvePath(item.path ?? item.href ?? '')))
const breadcrumbClass = computed(() => [props.className, props.classNames.root])
const rootStyle = computed(() => [props.style, props.styles.root])

const isCurrent = (index: number) => index === normalizedItems.value.length - 1

const shouldRenderLink = (item: BreadcrumbItem, index: number) => {
  return Boolean(getItemHref(item) && !item.disabled && !isCurrent(index))
}

const getItemHref = (item: BreadcrumbItem) => {
  return item.href ?? resolvePath(item.path ?? '')
}

const getItemKey = (item: BreadcrumbItem, index: number) => {
  if (item.key !== undefined) {
    return item.key
  }

  if (item.href || item.path) {
    return `${item.href ?? item.path}-${index}`
  }

  if (typeof item.title === 'string' || typeof item.title === 'number') {
    return `${item.title}-${index}`
  }

  return index
}

const itemClass = (item: BreadcrumbItem, index: number) => [
  props.classNames.item,
  item.className,
  {
    'is-current': isCurrent(index),
    'is-disabled': item.disabled
  }
]

const getCumulativePaths = (index: number) => resolvedPaths.value.slice(0, index + 1).filter(Boolean)

const renderItem = (item: BreadcrumbItem, index: number) => {
  return props.itemRender?.(item, props.params, normalizedItems.value, getCumulativePaths(index), index)
}

const resolvePath = (path: string) => {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = props.params[key]
    return value === undefined ? `:${key}` : String(value)
  })
}

const handleItemClick = (event: MouseEvent, item: BreadcrumbItem, index: number) => {
  if (item.disabled) {
    return
  }

  item.onClick?.(event, item, index)
}
</script>
