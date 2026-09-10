<template>
  <div class="aheart-ai-workbench__execution-content">
    <section v-if="priorityApproval || selectedArtifact" class="aheart-ai-workbench__mobile-priority" role="region" aria-label="移动端优先处理">
      <div class="aheart-ai-workbench__priority-heading">
        <span class="aheart-ai-workbench__eyebrow">{{ priorityLabel }}</span>
        <strong v-if="priorityApproval">{{ priorityApproval.approval?.title }}</strong>
        <strong v-else>查看当前产物</strong>
      </div>
      <div v-if="priorityApproval" class="aheart-ai-workbench__priority-approval">
        <p v-if="priorityApproval.approval?.description">{{ priorityApproval.approval.description }}</p>
        <div class="aheart-ai-workbench__priority-actions">
          <template v-if="!priorityApproval.approval?.status || priorityApproval.approval.status === 'pending'">
            <AButton data-action="approve" type="primary" :disabled="actionDisabled(priorityApproval, 'approve')" @click="emit('approve', priorityApproval)">批准</AButton>
            <AButton data-action="reject" danger :disabled="actionDisabled(priorityApproval, 'reject')" @click="emit('reject', priorityApproval)">拒绝</AButton>
          </template>
          <span v-else class="aheart-ai-workbench__approval-result">
            {{ priorityApproval.approval.status === 'approved' ? '已批准' : '已拒绝' }}
          </span>
        </div>
      </div>
      <button
        v-if="priorityArtifact"
        type="button"
        class="aheart-ai-workbench__priority-artifact"
        data-artifact-role="approval"
        :aria-label="priorityArtifact.title"
        @click="emit('select-artifact', priorityArtifact)"
      >
        <span>{{ priorityApproval?.approval?.artifactId ? '审批对象' : '当前产物' }}</span>
        <strong>{{ priorityArtifact.title }}</strong>
        <small v-if="priorityArtifact.description">{{ priorityArtifact.description }}</small>
      </button>
      <button
        v-if="selectedArtifact && selectedArtifact.id !== priorityArtifact?.id"
        type="button"
        class="aheart-ai-workbench__priority-artifact"
        data-artifact-role="current"
        :aria-label="selectedArtifact.title"
        @click="emit('select-artifact', selectedArtifact)"
      >
        <span>当前产物</span>
        <strong>{{ selectedArtifact.title }}</strong>
        <small v-if="selectedArtifact.description">{{ selectedArtifact.description }}</small>
      </button>
    </section>
    <section class="aheart-ai-workbench__tasks" :aria-labelledby="taskHeadingId">
      <div class="aheart-ai-workbench__section-heading">
        <div>
          <span class="aheart-ai-workbench__eyebrow">执行流程</span>
          <h2 :id="taskHeadingId">执行时间线</h2>
        </div>
        <span>{{ tasks.length }} 项</span>
      </div>
      <div class="aheart-ai-workbench__timeline">
        <ASortableList
          :items="sortableTasks"
          item-key="__sortableKey"
          :disabled="disabled || !reorderable"
          :revision="tasksRevision"
          :group="`agent-tasks-${scopeKey}`"
          @update:items="updateTasks"
          @move-reject="handleSortableReject"
        >
        <template #item="{ item, index }">
          <slot name="task" :task="asTask(item)" :index="index">
            <article
              :data-task-id="asTask(item).id"
              class="aheart-ai-workbench__timeline-item"
              :class="[`is-${effectiveStatus(asTask(item))}`, { 'has-approval-summary': Boolean(asTask(item).approval) }]"
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
                  <span class="aheart-ai-workbench__task-status">{{ effectiveStatusLabel(asTask(item)) }}</span>
                </header>
                <p v-if="asTask(item).detail && !toolCall(asTask(item))" class="aheart-ai-workbench__task-detail">{{ asTask(item).detail }}</p>
                <section v-if="toolCall(asTask(item))" class="aheart-ai-workbench__tool-call" aria-label="工具调用摘要">
                  <strong>{{ toolCall(asTask(item))?.name }}</strong>
                  <span>{{ toolCall(asTask(item))?.summary }}</span>
                  <small v-if="toolCall(asTask(item))?.inputSummary">{{ toolCall(asTask(item))?.inputSummary }}</small>
                  <small v-if="toolCall(asTask(item))?.resultSummary">{{ toolCall(asTask(item))?.resultSummary }}</small>
                  <small v-if="toolCall(asTask(item))?.error">{{ toolCall(asTask(item))?.error }}</small>
                </section>
                <p v-if="asTask(item).lockedReason || (operationMessages?.[operationKey(asTask(item))] === '')" class="aheart-ai-workbench__task-lock-reason" role="status">{{ asTask(item).lockedReason }}</p>
                <p v-if="asTask(item).revision === undefined && actionDisabled(asTask(item), 'approve')" class="aheart-ai-workbench__task-lock-reason" role="status">缺少任务版本</p>
                <p v-if="asTask(item).approval?.artifactId && (!artifacts.some((artifact) => artifact.id === asTask(item).approval?.artifactId) || artifacts.some((artifact) => artifact.id === asTask(item).approval?.artifactId && artifact.revision === undefined))" class="aheart-ai-workbench__task-lock-reason" role="status">缺少产物版本</p>
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
                    :disabled="actionDisabled(asTask(item), 'cancel')"
                    @click="emit('cancel', asTask(item))"
                  >取消</AButton>
                  <AButton
                    v-if="asTask(item).status === 'error' || operationMessages?.[operationKey(asTask(item))]"
                    data-action="retry"
                    type="text"
                    :disabled="actionDisabled(asTask(item), 'retry')"
                    @click="emit('retry', asTask(item))"
                  >重试</AButton>
                  <AButton
                    data-action="move-up"
                    type="text"
                    :disabled="moveDisabled(asTask(item), index, -1)"
                    @click="moveTask(index, -1)"
                  >上移</AButton>
                  <AButton
                    data-action="move-down"
                    type="text"
                    :disabled="moveDisabled(asTask(item), index, 1)"
                    @click="moveTask(index, 1)"
                  >下移</AButton>
                </div>
                <p v-if="operationMessages?.[operationKey(asTask(item))]" class="aheart-ai-workbench__operation-status" role="status">{{ operationMessages[operationKey(asTask(item))] }}</p>
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
                      :disabled="actionDisabled(asTask(item), 'approve')"
                      @click="emit('approve', asTask(item))"
                    >批准</AButton>
                    <AButton
                      data-action="reject"
                      danger
                      :disabled="actionDisabled(asTask(item), 'reject')"
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

    <section class="aheart-ai-workbench__artifacts" :aria-labelledby="artifactHeadingId">
      <div class="aheart-ai-workbench__section-heading">
        <div>
          <span class="aheart-ai-workbench__eyebrow">产物输出</span>
          <h2 :id="artifactHeadingId">产物</h2>
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
    reorderable?: boolean
    tasksRevision?: string | number
    scopeKey?: string
    actionDisabled?: (task: AIAgentTask, action: string) => boolean
    operationMessages?: Record<string, string>
    validateCandidate?: (tasks: AIAgentTask[]) => string | undefined
  }>(),
  {
    tasks: () => [],
    artifacts: () => [],
    activeArtifact: undefined,
    disabled: false
    ,reorderable: true
    ,scopeKey: 'default'
    ,actionDisabled: () => false
    ,operationMessages: () => ({})
    ,validateCandidate: () => undefined
  }
)
const executionId = computed(() => `aheart-agent-execution-${String(props.scopeKey ?? 'default').replace(/[^a-zA-Z0-9_-]/g, '-')}`)
const taskHeadingId = computed(() => `${executionId.value}-tasks`)
const artifactHeadingId = computed(() => `${executionId.value}-artifacts`)
const emit = defineEmits<{
  'update:tasks': [tasks: AIAgentTask[]]
  approve: [task: AIAgentTask]
  reject: [task: AIAgentTask]
  cancel: [task: AIAgentTask]
  retry: [task: AIAgentTask]
  'move-task': [id: string, direction: 'up' | 'down']
  'move-task-reject': [reason: string]
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
const sortableTasks = computed(() => props.tasks.map((task, index) => ({ ...task, __sortableKey: `${task.id}::${index}` })) as unknown as Record<string, unknown>[])
const selectedArtifact = computed(
  () => props.artifacts.find((artifact) => artifact.id === props.activeArtifact) ?? props.artifacts[0]
)
const priorityApproval = computed(
  () => props.tasks.find((task) => task.approval && (!task.approval.status || task.approval.status === 'pending')) ?? props.tasks.find((task) => task.approval)
)
const priorityArtifact = computed(
  () => props.artifacts.find((artifact) => artifact.id === priorityApproval.value?.approval?.artifactId) ?? selectedArtifact.value
)
const priorityLabel = computed(() => {
  if (priorityApproval.value?.approval && (!priorityApproval.value.approval.status || priorityApproval.value.approval.status === 'pending')) return '等待审批'
  return priorityApproval.value ? '审批结果' : '当前产物'
})
const asTask = (item: unknown) => item as AIAgentTask
const toolCall = (task: AIAgentTask) => task.toolCall
const operationKey = (task: AIAgentTask) => `${task.id}:${String(task.revision ?? '')}:${task.approval?.id ?? ''}`
const handleSortableReject = (event: { reason?: string }) => {
  const labels: Record<string, string> = {
    'stale-revision': '任务版本已变化，排序已拒绝',
    'source-missing': '源任务已不存在，排序已拒绝',
    'target-missing': '目标位置已不存在，排序已拒绝',
    'duplicate-key': '任务标识重复，无法排序',
    'group-mismatch': '任务不属于当前排序分组',
    disabled: '任务当前不可排序，排序已拒绝',
    'invalid-position': '目标位置无效，排序已拒绝',
    'parent-rejected': '任务版本已变化，排序已拒绝',
    'rollback-rejected': '排序回滚失败，请刷新后重试',
    unmounted: '排序目标已卸载',
    cancelled: '排序已取消'
  }
  emit('move-task-reject', labels[event.reason ?? ''] ?? '任务当前不可排序，排序已拒绝')
}
const statusLabel = (status: AIAgentTaskStatus) => statusLabels[status]
const effectiveStatus = (task: AIAgentTask): AIAgentTaskStatus => {
  return task.status
}
const effectiveStatusLabel = (task: AIAgentTask) => {
  return statusLabel(task.status)
}
const normalizedProgress = (progress?: number) => Math.min(100, Math.max(0, Math.round(progress ?? 0)))
const updateTasks = (tasks: Record<string, unknown>[]) => {
  if (!props.disabled && props.reorderable) {
    const normalized = tasks.map(({ __sortableKey: _key, ...task }) => task) as unknown as AIAgentTask[]
    const reason = props.validateCandidate?.(normalized)
    if (reason) { emit('move-task-reject', reason); return }
    emit('update:tasks', normalized)
  }
}
const moveTask = (index: number, offset: number) => {
  if (moveDisabled(props.tasks[index], index, offset)) return
  const next = [...props.tasks]
  const [task] = next.splice(index, 1)
  next.splice(index + offset, 0, task)
  const reason = props.validateCandidate?.(next)
  if (reason) { emit('move-task-reject', reason); return }
  emit('update:tasks', next)
  emit('move-task', task.id, offset < 0 ? 'up' : 'down')
}
const actionDisabled = (task: AIAgentTask, action: string) => props.disabled || Boolean(props.actionDisabled?.(task, action))
const moveDisabled = (task: AIAgentTask | undefined, index: number, offset: number) => Boolean(props.disabled || !props.reorderable || index + offset < 0 || index + offset >= props.tasks.length || task?.reorderable === false || task?.lockedReason || task?.status === 'running' || task?.status === 'waiting-approval')
</script>
