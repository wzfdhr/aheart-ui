<template>
  <form class="aheart-form" :class="formClass" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { provideAheartConfig } from '../config'
import { formEmits, formProps } from './types'
import './style.css'

defineOptions({
  name: 'AForm'
})

const props = defineProps(formProps)
const emit = defineEmits(formEmits)

provideAheartConfig(
  computed(() => ({
    size: props.size,
    disabled: props.disabled
  }))
)

const formClass = computed(() => [
  `aheart-form--${props.layout}`,
  `aheart-form--label-${props.labelAlign}`
])

const handleSubmit = (event: Event) => {
  emit('submit', event)
}
</script>
