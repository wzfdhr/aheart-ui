<template>
  <section class="aheart-ai-welcome">
    <h2 class="aheart-ai-welcome__title">{{ title }}</h2>
    <p v-if="description" class="aheart-ai-welcome__description">{{ description }}</p>
    <div v-if="$slots.default" class="aheart-ai-welcome__content"><slot /></div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), { title: '你好，我能为你做些什么？', description: undefined })
defineOptions({ name: 'AAIWelcome' })
</script>
