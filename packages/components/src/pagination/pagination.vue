<template>
  <nav
    v-if="shouldRender"
    class="aheart-pagination"
    :class="paginationClass"
    :style="rootStyle"
    aria-label="pagination"
  >
    <span v-if="showTotalContent" :class="totalClass" :style="totalStyle">{{ totalText }}</span>
    <button
      :class="prevClass"
      :style="prevStyle"
      type="button"
      :disabled="isDisabled || mergedCurrent <= 1"
      aria-label="Previous Page"
      @click="setCurrent(mergedCurrent - 1)"
    >
      {{ prevLabel }}
    </button>
    <span v-if="simple" class="aheart-pagination__simple">{{ mergedCurrent }} / {{ pageCount }}</span>
    <template v-else>
      <template v-for="item in pageItems" :key="item.key">
        <span v-if="item.type === 'ellipsis'" class="aheart-pagination__ellipsis" aria-hidden="true">...</span>
        <button
          v-else
          class="aheart-pagination__page"
          type="button"
          :class="getPageClass(item.page)"
          :style="getPageStyle(item.page)"
          :aria-current="item.page === mergedCurrent ? 'page' : undefined"
          :disabled="isDisabled"
          @click="setCurrent(item.page)"
        >
          {{ renderItem(item.page, 'page', String(item.page)) }}
        </button>
      </template>
    </template>
    <button
      :class="nextClass"
      :style="nextStyle"
      type="button"
      :disabled="isDisabled || mergedCurrent >= pageCount"
      aria-label="Next Page"
      @click="setCurrent(mergedCurrent + 1)"
    >
      {{ nextLabel }}
    </button>
    <select
      v-if="showSizeChanger"
      :class="sizeChangerClass"
      :style="sizeChangerStyle"
      :value="mergedPageSize"
      :disabled="isDisabled"
      aria-label="Page Size"
      @change="handlePageSizeChange"
    >
      <option v-for="option in normalizedPageSizeOptions" :key="option" :value="option">
        {{ option }} / page
      </option>
    </select>
    <span v-if="showQuickJumper" :class="quickJumperClass" :style="quickJumperStyle">
      <span class="aheart-pagination__quick-jumper-label">Go to</span>
      <input
        v-model="quickJumpValue"
        class="aheart-pagination__quick-jumper-input"
        type="number"
        min="1"
        :max="pageCount"
        :disabled="isDisabled"
        @keydown.enter="jumpToQuickPage"
      />
      <button
        class="aheart-pagination__quick-jumper-go"
        type="button"
        :disabled="isDisabled"
        @click="jumpToQuickPage"
      >
        Go
      </button>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { paginationEmits, paginationProps, type PaginationItemType } from './types'
import './style.css'

defineOptions({
  name: 'APagination'
})

const props = defineProps(paginationProps)
const emit = defineEmits(paginationEmits)
const config = useAheartConfig()

const innerCurrent = ref(props.defaultCurrent)
const innerPageSize = ref(props.defaultPageSize)
const quickJumpValue = ref('')
const isControlled = computed(() => props.current !== undefined)
const isPageSizeControlled = computed(() => props.pageSize !== undefined)
const mergedPageSize = computed(() => props.pageSize ?? innerPageSize.value)
const pageCount = computed(() => getPageCount(props.total, mergedPageSize.value))
const mergedCurrent = computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value))
const shouldRender = computed(() => !(props.hideOnSinglePage && pageCount.value <= 1))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))
const normalizedPageSizeOptions = computed(() => {
  const options = props.pageSizeOptions
    .map((option) => Number(option))
    .filter((option) => Number.isInteger(option) && option > 0)

  return Array.from(new Set(options.length > 0 ? options : [10, 20, 50, 100]))
})

const paginationClass = computed(() => [
  `aheart-pagination--${resolvedSize.value}`,
  props.align ? `aheart-pagination--align-${props.align}` : undefined,
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-disabled': isDisabled.value,
    'is-simple': props.simple,
    'is-compact': props.showLessItems
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
const totalClass = computed(() => ['aheart-pagination__total', props.classNames?.total])
const totalStyle = computed(() => props.styles?.total)
const prevClass = computed(() => ['aheart-pagination__prev', props.classNames?.prev])
const prevStyle = computed(() => props.styles?.prev)
const nextClass = computed(() => ['aheart-pagination__next', props.classNames?.next])
const nextStyle = computed(() => props.styles?.next)
const sizeChangerClass = computed(() => ['aheart-pagination__size-changer', props.classNames?.sizeChanger])
const sizeChangerStyle = computed(() => props.styles?.sizeChanger)
const quickJumperClass = computed(() => ['aheart-pagination__quick-jumper', props.classNames?.quickJumper])
const quickJumperStyle = computed(() => props.styles?.quickJumper)

type PageItem = { key: string; type: 'page'; page: number } | { key: string; type: 'ellipsis' }

const currentRange = computed<[number, number]>(() => {
  if (props.total <= 0) {
    return [0, 0]
  }

  const start = (mergedCurrent.value - 1) * mergedPageSize.value + 1
  const end = Math.min(mergedCurrent.value * mergedPageSize.value, props.total)
  return [start, end]
})

const showTotalContent = computed(() => Boolean(props.showTotal))
const totalText = computed(() => {
  if (typeof props.showTotal === 'function') {
    return props.showTotal(props.total, currentRange.value)
  }

  return `Total ${props.total} items`
})

const pageItems = computed<PageItem[]>(() => {
  const count = pageCount.value
  const current = mergedCurrent.value
  const siblingCount = props.showLessItems ? 1 : 2
  const allPagesLimit = siblingCount * 2 + 5

  if (count <= allPagesLimit) {
    return Array.from({ length: count }, (_, index) => ({
      key: `page-${index + 1}`,
      type: 'page',
      page: index + 1
    }))
  }

  const items: PageItem[] = [{ key: 'page-1', type: 'page', page: 1 }]
  const left = Math.max(2, current - siblingCount)
  const right = Math.min(count - 1, current + siblingCount)

  if (left > 2) {
    if (left === 3) {
      items.push({ key: 'page-2', type: 'page', page: 2 })
    } else {
      items.push({ key: 'ellipsis-left', type: 'ellipsis' })
    }
  }

  for (let page = left; page <= right; page += 1) {
    items.push({ key: `page-${page}`, type: 'page', page })
  }

  if (right < count - 1) {
    if (right === count - 2) {
      items.push({ key: `page-${count - 1}`, type: 'page', page: count - 1 })
    } else {
      items.push({ key: 'ellipsis-right', type: 'ellipsis' })
    }
  }

  items.push({ key: `page-${count}`, type: 'page', page: count })
  return items
})

const prevLabel = computed(() => renderItem(Math.max(mergedCurrent.value - 1, 1), 'prev', '‹'))
const nextLabel = computed(() => renderItem(Math.min(mergedCurrent.value + 1, pageCount.value), 'next', '›'))

watch(
  () => [props.total, mergedPageSize.value],
  () => {
    if (!isControlled.value && innerCurrent.value > pageCount.value) {
      innerCurrent.value = pageCount.value
    }
  }
)

const getPageCount = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize))

const normalizeCurrent = (nextCurrent: number) => Math.min(Math.max(nextCurrent, 1), pageCount.value)

const setCurrent = (nextCurrent: number) => {
  if (isDisabled.value) {
    return
  }

  const normalizedCurrent = normalizeCurrent(nextCurrent)

  if (normalizedCurrent === mergedCurrent.value) {
    return
  }

  if (!isControlled.value) {
    innerCurrent.value = normalizedCurrent
  }

  emit('update:current', normalizedCurrent)
  emit('change', normalizedCurrent, mergedPageSize.value)
}

const getPageClass = (page: number) => [
  props.classNames?.page,
  {
    'is-active': page === mergedCurrent.value,
    [String(props.classNames?.activePage)]: page === mergedCurrent.value && props.classNames?.activePage
  }
]

const getPageStyle = (page: number) => [props.styles?.page, page === mergedCurrent.value ? props.styles?.activePage : undefined]

const renderItem = (page: number, type: PaginationItemType, originalElement: string) => {
  return props.itemRender?.(page, type, originalElement) ?? originalElement
}

const handlePageSizeChange = (event: Event) => {
  if (isDisabled.value) {
    return
  }

  const nextPageSize = Number((event.target as HTMLSelectElement).value)

  if (!Number.isInteger(nextPageSize) || nextPageSize <= 0 || nextPageSize === mergedPageSize.value) {
    return
  }

  const nextPageCount = getPageCount(props.total, nextPageSize)
  const nextCurrent = Math.min(mergedCurrent.value, nextPageCount)

  if (!isPageSizeControlled.value) {
    innerPageSize.value = nextPageSize
  }

  if (!isControlled.value) {
    innerCurrent.value = nextCurrent
  }

  if (nextCurrent !== mergedCurrent.value) {
    emit('update:current', nextCurrent)
  }

  emit('update:pageSize', nextPageSize)
  emit('showSizeChange', nextCurrent, nextPageSize)
  emit('change', nextCurrent, nextPageSize)
}

const jumpToQuickPage = () => {
  const nextInputValue = String(quickJumpValue.value).trim()

  if (isDisabled.value || !nextInputValue) {
    return
  }

  const nextCurrent = Number(nextInputValue)

  if (!Number.isFinite(nextCurrent)) {
    return
  }

  setCurrent(Math.trunc(nextCurrent))
}
</script>
