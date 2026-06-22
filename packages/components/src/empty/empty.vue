<template>
  <div class="aheart-empty">
    <div class="aheart-empty__image">
      <slot name="image">
        <span class="aheart-empty__default-image" aria-hidden="true">∅</span>
      </slot>
    </div>
    <div class="aheart-empty__description">{{ resolvedDescription }}</div>
    <div v-if="$slots.default" class="aheart-empty__footer">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAheartConfig } from '../config'
import { emptyProps } from './types'
import './style.css'

defineOptions({
  name: 'AEmpty'
})

const props = defineProps(emptyProps)
const config = useAheartConfig()

const resolvedDescription = computed(() => props.description || config.value.locale?.empty?.description || 'No Data')
</script>
