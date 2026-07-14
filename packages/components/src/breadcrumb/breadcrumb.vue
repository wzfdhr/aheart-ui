<template>
  <nav class="aheart-breadcrumb" :class="breadcrumbClass" :style="rootStyle" aria-label="breadcrumb">
    <ol class="aheart-breadcrumb__list" :class="classNames.list" :style="styles.list">
      <li
        v-for="entry in renderEntries"
        :key="getEntryKey(entry)"
        class="aheart-breadcrumb__item"
        :class="itemClass(entry)"
        :style="itemStyle(entry)"
        :aria-current="entry.kind === 'route' && isCurrent(entry.index) ? 'page' : undefined"
        :aria-disabled="entry.kind === 'route' && entry.item.disabled ? 'true' : undefined"
      >
        <template v-if="entry.kind === 'separator'">
          <span
            class="aheart-breadcrumb__separator"
            :class="classNames.separator"
            :style="styles.separator"
            aria-hidden="true"
          >
            <ARenderNode :node="entry.item.separator ?? separator" />
          </span>
        </template>
        <template v-else>
        <span
          v-if="itemRender"
          class="aheart-breadcrumb__custom"
          @click="handleItemClick($event, entry.item, entry.index)"
        >
          <ARenderNode :node="renderItem(entry.item, entry.index)" />
        </span>
        <a
          v-else-if="shouldRenderLink(entry.item, entry.index)"
          class="aheart-breadcrumb__link"
          :class="classNames.link"
          :style="styles.link"
          :href="getItemHref(entry.item, entry.index)"
          @click="handleItemClick($event, entry.item, entry.index)"
        >
          <ARenderNode :node="entry.item.title" />
        </a>
        <span
          v-else
          class="aheart-breadcrumb__text"
          :class="classNames.text"
          :style="styles.text"
          @click="handleItemClick($event, entry.item, entry.index)"
        >
          <ARenderNode :node="entry.item.title" />
        </span>
        <span
          v-if="shouldRenderAutomaticSeparator(entry.index)"
          class="aheart-breadcrumb__separator"
          :class="classNames.separator"
          :style="styles.separator"
          aria-hidden="true"
        >
          <ARenderNode :node="separator" />
        </span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineComponent, type PropType, type VNodeChild } from 'vue'
import { breadcrumbProps, type BreadcrumbItem, type BreadcrumbRouteItem, type BreadcrumbSeparatorItem } from './types'
import './style.css'

defineOptions({
  name: 'ABreadcrumb'
})

const props = defineProps(breadcrumbProps)

type BreadcrumbRouteEntry = {
  kind: 'route'
  item: BreadcrumbRouteItem
  index: number
}

type BreadcrumbSeparatorEntry = {
  kind: 'separator'
  item: BreadcrumbSeparatorItem
  index: number
}

type BreadcrumbRenderEntry = BreadcrumbRouteEntry | BreadcrumbSeparatorEntry

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
const renderEntries = computed<BreadcrumbRenderEntry[]>(() =>
  normalizedItems.value.map((item, index) =>
    isSeparatorItem(item)
      ? { kind: 'separator', item, index }
      : { kind: 'route', item, index }
  )
)
const routePathSegmentsByIndex = computed(() => {
  const segments: string[] = []
  const segmentMap = new Map<number, string[]>()

  normalizedItems.value.forEach((item, index) => {
    if (isSeparatorItem(item)) {
      return
    }

    if (item.path) {
      const segment = normalizePathSegment(resolvePath(item.path))
      if (segment) {
        segments.push(segment)
      }
    }

    segmentMap.set(index, [...segments])
  })

  return segmentMap
})
const lastRouteIndex = computed(() => {
  for (let index = normalizedItems.value.length - 1; index >= 0; index -= 1) {
    if (!isSeparatorItem(normalizedItems.value[index])) {
      return index
    }
  }

  return -1
})
const breadcrumbClass = computed(() => [props.className, props.classNames.root])
const rootStyle = computed(() => [props.style, props.styles.root])

const isSeparatorItem = (item: BreadcrumbItem): item is BreadcrumbSeparatorItem => item.type === 'separator'

const isCurrent = (index: number) => index === lastRouteIndex.value

const shouldRenderLink = (item: BreadcrumbRouteItem, index: number) => {
  return Boolean(getItemHref(item, index) && !item.disabled && !isCurrent(index))
}

const getItemHref = (item: BreadcrumbRouteItem, index: number) => {
  if (item.href) {
    return item.href
  }

  if (!item.path) {
    return ''
  }

  return joinPaths(getCumulativePaths(index))
}

const shouldRenderAutomaticSeparator = (index: number) => {
  if (isCurrent(index)) {
    return false
  }

  const nextItem = normalizedItems.value[index + 1]
  return Boolean(nextItem && !isSeparatorItem(nextItem))
}

const getEntryKey = (entry: BreadcrumbRenderEntry) => {
  if (entry.item.key !== undefined) {
    return entry.item.key
  }

  if (entry.kind === 'separator') {
    return `separator-${entry.index}`
  }

  const item = entry.item
  if (item.href || item.path) {
    return `${item.href ?? item.path}-${entry.index}`
  }

  if (typeof item.title === 'string' || typeof item.title === 'number') {
    return `${item.title}-${entry.index}`
  }

  return entry.index
}

const itemClass = (entry: BreadcrumbRenderEntry) => {
  const isRoute = entry.kind === 'route'
  return [
    props.classNames.item,
    entry.item.className,
    {
      'aheart-breadcrumb__item--separator': entry.kind === 'separator',
      'is-current': isRoute && isCurrent(entry.index),
      'is-disabled': isRoute && entry.item.disabled
    }
  ]
}

const itemStyle = (entry: BreadcrumbRenderEntry) => [props.styles.item, entry.item.style]

const getCumulativePaths = (index: number) => routePathSegmentsByIndex.value.get(index) ?? []

const renderItem = (item: BreadcrumbRouteItem, index: number) => {
  return props.itemRender?.(item, props.params, normalizedItems.value, getCumulativePaths(index), index)
}

const resolvePath = (path: string) => {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = props.params[key]
    return value === undefined ? `:${key}` : String(value)
  })
}

const normalizePathSegment = (path: string) => path.replace(/^\/+|\/+$/g, '')

const joinPaths = (paths: string[]) => (paths.length ? `/${paths.join('/')}` : '')

const handleItemClick = (event: MouseEvent, item: BreadcrumbRouteItem, index: number) => {
  if (item.disabled) {
    return
  }

  item.onClick?.(event, item, index)
}
</script>
