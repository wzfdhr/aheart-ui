<template>
  <nav v-if="shouldRender" class="aheart-pagination" :class="paginationClass" aria-label="pagination">
    <span v-if="showTotal" class="aheart-pagination__total">Total {{ total }} items</span>
    <button
      class="aheart-pagination__prev"
      type="button"
      :disabled="isDisabled || mergedCurrent <= 1"
      aria-label="Previous Page"
      @click="setCurrent(mergedCurrent - 1)"
    >
      ‹
    </button>
    <span v-if="simple" class="aheart-pagination__simple">{{ mergedCurrent }} / {{ pageCount }}</span>
    <template v-else>
      <button
        v-for="page in pages"
        :key="page"
        class="aheart-pagination__page"
        type="button"
        :class="{ 'is-active': page === mergedCurrent }"
        :aria-current="page === mergedCurrent ? 'page' : undefined"
        :disabled="isDisabled"
        @click="setCurrent(page)"
      >
        {{ page }}
      </button>
    </template>
    <button
      class="aheart-pagination__next"
      type="button"
      :disabled="isDisabled || mergedCurrent >= pageCount"
      aria-label="Next Page"
      @click="setCurrent(mergedCurrent + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveConfigValue, useAheartConfig } from '../config'
import { paginationEmits, paginationProps } from './types'
import './style.css'

defineOptions({
  name: 'APagination'
})

const props = defineProps(paginationProps)
const emit = defineEmits(paginationEmits)
const config = useAheartConfig()

const innerCurrent = ref(props.defaultCurrent)
const isControlled = computed(() => props.current !== undefined)
const mergedPageSize = computed(() => props.pageSize ?? props.defaultPageSize)
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / mergedPageSize.value)))
const mergedCurrent = computed(() => Math.min(Math.max(props.current ?? innerCurrent.value, 1), pageCount.value))
const shouldRender = computed(() => !(props.hideOnSinglePage && pageCount.value <= 1))
const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))
const resolvedSize = computed(() => resolveConfigValue(props.size, config.value.size, 'middle'))
const isDisabled = computed(() => resolveConfigValue(props.disabled, config.value.disabled, false))

const paginationClass = computed(() => [
  `aheart-pagination--${resolvedSize.value}`,
  {
    'is-disabled': isDisabled.value,
    'is-simple': props.simple
  }
])

watch(
  () => props.total,
  () => {
    if (!isControlled.value && innerCurrent.value > pageCount.value) {
      innerCurrent.value = pageCount.value
    }
  }
)

const setCurrent = (nextCurrent: number) => {
  if (isDisabled.value) {
    return
  }

  const normalizedCurrent = Math.min(Math.max(nextCurrent, 1), pageCount.value)

  if (normalizedCurrent === mergedCurrent.value) {
    return
  }

  if (!isControlled.value) {
    innerCurrent.value = normalizedCurrent
  }

  emit('update:current', normalizedCurrent)
  emit('change', normalizedCurrent, mergedPageSize.value)
}
</script>
