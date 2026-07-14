<template>
  <Teleport to="body">
    <div v-if="isDragActive" class="aheart-dnd-overlay" aria-hidden="true">
      <slot :data="currentDragData">{{ currentDragData?.label ?? currentDragData?.type }}</slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { currentDragData, isDragActive } from './drag-state'

defineOptions({ name: 'ADragOverlay' })
</script>
