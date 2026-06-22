<template>
  <nav class="aheart-breadcrumb" aria-label="breadcrumb">
    <ol class="aheart-breadcrumb__list">
      <li
        v-for="(item, index) in normalizedItems"
        :key="`${item.title}-${index}`"
        class="aheart-breadcrumb__item"
        :class="{ 'is-current': isCurrent(index), 'is-disabled': item.disabled }"
        :aria-current="isCurrent(index) ? 'page' : undefined"
      >
        <a v-if="shouldRenderLink(item, index)" class="aheart-breadcrumb__link" :href="item.href">
          {{ item.title }}
        </a>
        <span v-else class="aheart-breadcrumb__text">
          {{ item.title }}
        </span>
        <span v-if="!isCurrent(index)" class="aheart-breadcrumb__separator" aria-hidden="true">
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { breadcrumbProps, type BreadcrumbItem } from './types'
import './style.css'

defineOptions({
  name: 'ABreadcrumb'
})

const props = defineProps(breadcrumbProps)

const normalizedItems = computed(() => props.items ?? [])

const isCurrent = (index: number) => index === normalizedItems.value.length - 1

const shouldRenderLink = (item: BreadcrumbItem, index: number) => {
  return Boolean(item.href && !item.disabled && !isCurrent(index))
}
</script>
