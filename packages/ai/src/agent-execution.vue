<template>
  <div class="aheart-ai-workbench__execution-content">
    <section class="aheart-ai-workbench__tasks" aria-labelledby="agent-tasks-title">
      <div class="aheart-ai-workbench__section-heading">
        <div>
          <span class="aheart-ai-workbench__eyebrow">EXECUTION</span>
          <h2 id="agent-tasks-title">执行时间线</h2>
        </div>
        <span>{{ tasks.length }} 项</span>
      </div>
      <div class="aheart-ai-workbench__timeline">
        <ASortableList
          :items="sortableTasks"
          item-key="id"
          group="agent-tasks"
          :disabled="disabled"
          @update:items="updateTasks"
        >
        <template #item="{ item, index }">
          <slot name="task" :task="asTask(item)" :index="index">
            <article
              :data-task-id="asTask(item).id"
              class="aheart-ai-workbench__timeline-item"
              :class="`is-${asTask(item).status}`"
            >
              <span class="aheart-ai-workbench__timeline-marker" aria-hidden="true"></span>
              <div class="aheart-ai-workbench__task-body">
                <header class="aheart-ai-workbench__task-summary">
                  <div>
                    <strong>{{ asTask(item).label }}</strong>
                    <span v-if="asTask(item).toolName" class="aheart-ai-workbench__tool-name">
                      {{ asTask(item).toolName }}
                    </span>
                  </div>
                  <span class="aheart-ai-workbench__task-status">{{ statusLabel(asTask(item).status) }}</span>
                </header>
                <p v-if="asTask(item).detail" class="aheart-ai-workbench__task-detail">{{ asTask(item).detail }}</p>
                <div v-if="asTask(item).progress !== undefined" class="aheart-ai-workbench__task-progress">
                  <div
                    role="progressbar"
                    aria-label="任务进度"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :aria-valuenow="normalizedProgress(asTask(item).progress)"
                  >
                    <span :style="{ inlineSize: `${normalizedProgress(asTask(item).progress)}%` }"></span>
                  </div>
                  <small>{{ normalizedProgress(asTask(item).progress) }}%</small>
                </div>
                <div v-if="asTask(item).startedAt || asTask(item).completedAt" class="aheart-ai-workbench__task-time">
                  <span v-if="asTask(item).startedAt">开始 {{ asTask(item).startedAt }}</span>
                  <span v-if="asTask(item).completedAt">完成 {{ asTask(item).completedAt }}</span>
                </div>
                <details v-if="asTask(item).error" class="aheart-ai-workbench__task-error">
                  <summary>查看错误详情</summary>
                  <p>{{ asTask(item).error }}</p>
                </details>
                <div class="aheart-ai-workbench__task-actions">
                  <AButton
                    v-if="asTask(item).status === 'running'"
                    data-action="cancel"
                    type="text"
                    :disabled="disabled"
                    @click="emit('cancel', asTask(item))"
                  >取消</AButton>
                  <AButton
                    v-if="asTask(item).status === 'error'"
                    data-action="retry"
                    type="text"
                    :disabled="disabled"
                    @click="emit('retry', asTask(item))"
                  >重试</AButton>
                  <AButton
                    data-action="move-up"
                    type="text"
                    :disabled="disabled || index === 0"
                    @click="moveTask(index, -1)"
                  >上移</AButton>
                  <AButton
                    data-action="move-down"
                    type="text"
                    :disabled="disabled || index === tasks.length - 1"
                    @click="moveTask(index, 1)"
                  >下移</AButton>
                </div>
                <div
                  v-if="asTask(item).approval"
                  :data-approval-id="asTask(item).approval?.id"
                  class="aheart-ai-workbench__approval"
                  :class="`is-${asTask(item).approval?.status ?? 'pending'}`"
                >
                  <div>
                    <strong>{{ asTask(item).approval?.title }}</strong>
                    <p v-if="asTask(item).approval?.description">{{ asTask(item).approval?.description }}</p>
                  </div>
                  <template v-if="!asTask(item).approval?.status || asTask(item).approval?.status === 'pending'">
                    <AButton
                      data-action="approve"
                      type="primary"
                      :disabled="disabled"
                      @click="emit('approve', asTask(item))"
                    >批准</AButton>
                    <AButton
                      data-action="reject"
                      danger
                      :disabled="disabled"
                      @click="emit('reject', asTask(item))"
                    >拒绝</AButton>
                  </template>
                  <span v-else class="aheart-ai-workbench__approval-result">
                    {{ asTask(item).approval?.status === 'approved' ? '已批准' : '已拒绝' }}
                  </span>
                </div>
              </div>
            </article>
          </slot>
        </template>
        </ASortableList>
      </div>
      <p v-if="!tasks.length" class="aheart-ai-workbench__empty">尚无执行任务。</p>
    </section>

    <section class="aheart-ai-workbench__artifacts" aria-labelledby="agent-artifacts-title">
      <div class="aheart-ai-workbench__section-heading">
        <div>
          <span class="aheart-ai-workbench__eyebrow">OUTPUTS</span>
          <h2 id="agent-artifacts-title">产物</h2>
        </div>
        <span>{{ artifacts.length }} 项</span>
      </div>
      <ul v-if="artifacts.length" class="aheart-ai-workbench__artifact-list">
        <li
          v-for="artifact in artifacts"
          :key="artifact.id"
          :data-artifact-id="artifact.id"
          :class="{ 'is-active': artifact.id === selectedArtifact?.id }"
        >
          <button type="button" :aria-pressed="artifact.id === selectedArtifact?.id" @click="emit('select-artifact', artifact)">
            <slot name="artifact" :artifact="artifact">
              <span>{{ artifact.title }}</span>
              <small v-if="artifact.description">{{ artifact.description }}</small>
            </slot>
          </button>
        </li>
      </ul>
      <p v-else class="aheart-ai-workbench__empty">任务完成后，产物会出现在这里。</p>

      <section v-if="selectedArtifact" class="aheart-ai-workbench__artifact-preview" aria-label="产物预览">
        <slot name="artifact-preview" :artifact="selectedArtifact">
          <div class="aheart-ai-workbench__artifact-preview-header">
            <div>
              <span>{{ selectedArtifact.type ?? '文件' }}</span>
              <h3>{{ selectedArtifact.title }}</h3>
            </div>
            <a
              v-if="getSafeUrl(selectedArtifact.url)"
              :href="getSafeUrl(selectedArtifact.url)"
              target="_blank"
              rel="noreferrer"
            >打开产物</a>
          </div>
          <p>{{ selectedArtifact.description ?? '业务层可通过 artifact-preview 插槽提供自定义预览。' }}</p>
          <small v-if="selectedArtifact.updatedAt">更新于 {{ selectedArtifact.updatedAt }}</small>
        </slot>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button as AButton } from 'aheart-ui'
import { SortableList as ASortableList } from '@aheart-ui/dnd'
import { getSafeUrl } from './safe-markdown'
import type { AIAgentArtifact, AIAgentTask, AIAgentTaskStatus } from './types'

defineOptions({ name: 'AIAgentWorkbenchExecution' })

const props = withDefaults(
  defineProps<{
    tasks?: AIAgentTask[]
    artifacts?: AIAgentArtifact[]
    activeArtifact?: string
    disabled?: boolean
  }>(),
  {
    tasks: () => [],
    artifacts: () => [],
    activeArtifact: undefined,
    disabled: false
  }
)
const emit = defineEmits<{
  'update:tasks': [tasks: AIAgentTask[]]
  approve: [task: AIAgentTask]
  reject: [task: AIAgentTask]
  cancel: [task: AIAgentTask]
  retry: [task: AIAgentTask]
  'move-task': [id: string, direction: 'up' | 'down']
  'select-artifact': [artifact: AIAgentArtifact]
}>()

const statusLabels: Record<AIAgentTaskStatus, string> = {
  pending: '等待执行',
  running: '执行中',
  'waiting-approval': '等待审批',
  complete: '已完成',
  error: '执行失败',
  cancelled: '已取消'
}
const sortableTasks = computed(() => props.tasks as unknown as Record<string, unknown>[])
const selectedArtifact = computed(
  () => props.artifacts.find((artifact) => artifact.id === props.activeArtifact) ?? props.artifacts[0]
)
const asTask = (item: unknown) => item as AIAgentTask
const statusLabel = (status: AIAgentTaskStatus) => statusLabels[status]
const normalizedProgress = (progress?: number) => Math.min(100, Math.max(0, Math.round(progress ?? 0)))
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
