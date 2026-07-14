<template>
  <div class="aheart-ai-workbench__execution-content">
    <section class="aheart-ai-workbench__tasks">
      <h2>执行任务</h2>
      <ASortableList :items="sortableTasks" item-key="id" group="agent-tasks" :disabled="disabled" @update:items="updateTasks">
        <template #item="{ item, index }">
          <slot name="task" :task="asTask(item)" :index="index">
            <div :data-task-id="asTask(item).id" :class="`is-${asTask(item).status}`">
              <div class="aheart-ai-workbench__task-summary">
                <strong>{{ asTask(item).label }}</strong>
                <small>{{ asTask(item).detail ?? asTask(item).status }}</small>
              </div>
              <p v-if="asTask(item).error" class="aheart-ai-workbench__task-error">{{ asTask(item).error }}</p>
              <div class="aheart-ai-workbench__task-actions">
                <AButton v-if="asTask(item).status === 'running'" type="text" :disabled="disabled" @click="emit('cancel', asTask(item))">取消</AButton>
                <AButton v-if="asTask(item).status === 'error'" type="text" :disabled="disabled" @click="emit('retry', asTask(item))">重试</AButton>
                <AButton data-action="move-up" type="text" :disabled="disabled || index === 0" @click="moveTask(index, -1)">上移</AButton>
                <AButton data-action="move-down" type="text" :disabled="disabled || index === tasks.length - 1" @click="moveTask(index, 1)">下移</AButton>
              </div>
              <div v-if="asTask(item).approval && asTask(item).approval?.status !== 'approved' && asTask(item).approval?.status !== 'rejected'" :data-approval-id="asTask(item).approval?.id" class="aheart-ai-workbench__approval">
                <strong>{{ asTask(item).approval?.title }}</strong>
                <p v-if="asTask(item).approval?.description">{{ asTask(item).approval?.description }}</p>
                <AButton data-action="approve" type="primary" :disabled="disabled" @click="emit('approve', asTask(item))">批准</AButton>
                <AButton data-action="reject" danger :disabled="disabled" @click="emit('reject', asTask(item))">拒绝</AButton>
              </div>
            </div>
          </slot>
        </template>
      </ASortableList>
    </section>
    <section class="aheart-ai-workbench__artifacts">
      <h2>产物</h2>
      <ul>
        <li v-for="artifact in artifacts" :key="artifact.id">
          <slot name="artifact" :artifact="artifact">
            <a v-if="getSafeUrl(artifact.url)" :href="getSafeUrl(artifact.url)" target="_blank" rel="noreferrer">{{ artifact.title }}</a>
            <span v-else>{{ artifact.title }}</span>
            <small v-if="artifact.description">{{ artifact.description }}</small>
          </slot>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button as AButton } from 'aheart-ui'
import { SortableList as ASortableList } from '@aheart-ui/dnd'
import { getSafeUrl } from './safe-markdown'
import type { AIAgentArtifact, AIAgentTask } from './types'

defineOptions({ name: 'AIAgentWorkbenchExecution' })

const props = withDefaults(defineProps<{ tasks?: AIAgentTask[]; artifacts?: AIAgentArtifact[]; disabled?: boolean }>(), {
  tasks: () => [],
  artifacts: () => [],
  disabled: false
})
const emit = defineEmits<{
  'update:tasks': [tasks: AIAgentTask[]]
  approve: [task: AIAgentTask]
  reject: [task: AIAgentTask]
  cancel: [task: AIAgentTask]
  retry: [task: AIAgentTask]
  'move-task': [id: string, direction: 'up' | 'down']
}>()

const sortableTasks = computed(() => props.tasks as unknown as Record<string, unknown>[])
const asTask = (item: unknown) => item as AIAgentTask
const updateTasks = (tasks: Record<string, unknown>[]) => {
  if (!props.disabled) emit('update:tasks', tasks as unknown as AIAgentTask[])
}

const moveTask = (index: number, offset: number) => {
  if (props.disabled || index + offset < 0 || index + offset >= props.tasks.length) return
  const next = [...props.tasks]
  const [task] = next.splice(index, 1)
  next.splice(index + offset, 0, task)
  emit('update:tasks', next)
  emit('move-task', task.id, offset < 0 ? 'up' : 'down')
}
</script>
