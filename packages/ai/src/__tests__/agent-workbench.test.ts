import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import AIAgentWorkbench from '../agent-workbench.vue'
import type { AITransport } from '../types'

const installResponsiveMedia = (ownerWindow: Window = window) => {
  const previous = ownerWindow.matchMedia
  let matches = true
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  ownerWindow.matchMedia = vi.fn((query: string) => ({
    media: query,
    matches: query === '(max-width: 760px)' ? matches : false,
    onchange: null,
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: () => true
  })) as typeof ownerWindow.matchMedia
  return {
    change(next: boolean) {
      matches = next
      const event = { matches, media: '(max-width: 760px)' } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
    restore() {
      ownerWindow.matchMedia = previous
    }
  }
}

const findTab = (wrapper: any, name: string) => wrapper.findAll('[role="tab"]').find((tab: any) => tab.text().includes(name))

describe('AIAgentWorkbench', () => {
  const tasks = [
    { id: 'research', label: '检索资料', status: 'running' as const },
    { id: 'publish', label: '发布结果', status: 'waiting-approval' as const, approval: { id: 'approve-publish', title: '确认发布' } }
  ]

  it('renders the three-pane workbench and emits controlled approvals', async () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        panelSizes: [220, 520, 320],
        conversations: [{ key: 'work', label: '工作会话' }],
        activeConversation: 'work',
        tasks,
        artifacts: [{ id: 'report', title: '调研报告.md' }]
      }
    })

    expect(wrapper.find('.aheart-ai-workbench__desktop .aheart-splitter').exists()).toBe(true)
    expect(wrapper.text()).toContain('工作会话')
    expect(wrapper.text()).toContain('调研报告.md')
    await wrapper.get('[data-approval-id="approve-publish"] [data-action="approve"]').trigger('click')
    expect(wrapper.emitted('approve')?.[0]?.[0]).toMatchObject({ id: 'publish' })
  })

  it('keeps desktop splitter minimums within the zoomed desktop surface budget', () => {
    const wrapper = mount(AIAgentWorkbench)
    const panelMinimums = wrapper.findAllComponents({ name: 'ASplitterPanel' }).map((panel) => panel.props('min') as number)

    expect(panelMinimums.reduce((total, minimum) => total + minimum, 0) + 12).toBeLessThanOrEqual(574)
  })

  it('keeps task ordering controlled and provides non-drag move controls', async () => {
    const sortableTasks = [
      { id: 'research', label: '检索资料', status: 'pending' as const, revision: 'research-r1', reorderable: true },
      { id: 'publish', label: '发布结果', status: 'pending' as const, revision: 'publish-r1', reorderable: true }
    ]
    const wrapper = mount(AIAgentWorkbench, { props: { tasks: sortableTasks } })

    await wrapper.get('[data-task-id="research"] [data-action="move-down"]').trigger('click')
    expect(wrapper.emitted('update:tasks')?.[0]?.[0]).toEqual([sortableTasks[1], sortableTasks[0]])
    expect(wrapper.emitted('move-task')?.[0]).toEqual(['research', 'down'])
  })

  it('keeps one execution owner and stable labelled section ids across responsive and drawer views', async () => {
    const media = installResponsiveMedia()
    const wrapper = mount(AIAgentWorkbench, { props: { tasks, artifacts: [{ id: 'report', title: '报告.md' }] } })
    const execution = wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' })
    const executionUid = (execution.vm as any).$?.uid

    const assertExecutionSemantics = () => {
      const executions = wrapper.findAllComponents({ name: 'AIAgentWorkbenchExecution' })
      expect(executions).toHaveLength(1)
      expect((executions[0].vm as any).$?.uid).toBe(executionUid)

      const taskSection = executions[0].get('.aheart-ai-workbench__tasks')
      const artifactSection = executions[0].get('.aheart-ai-workbench__artifacts')
      const taskId = taskSection.get('h2').attributes('id')
      const artifactId = artifactSection.get('h2').attributes('id')
      expect(taskId).toBeTruthy()
      expect(artifactId).toBeTruthy()
      expect(new Set([taskId, artifactId]).size).toBe(2)
      expect(taskSection.attributes('aria-labelledby')).toBe(taskId)
      expect(artifactSection.attributes('aria-labelledby')).toBe(artifactId)
    }

    assertExecutionSemantics()
    expect(window.matchMedia('(max-width: 760px)').matches).toBe(true)
    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    assertExecutionSemantics()
    await findTab(wrapper, '会话').trigger('click')
    assertExecutionSemantics()
    media.change(false)
    await nextTick()
    media.change(true)
    await nextTick()
    await findTab(wrapper, '执行').trigger('click')
    assertExecutionSemantics()
    media.restore()
  })

  it('includes a mobile tabs and drawer workflow', async () => {
    const wrapper = mount(AIAgentWorkbench, { props: { tasks, contextItems: [{ id: 'brief', label: '需求简报' }] } })

    expect(wrapper.find('.aheart-ai-workbench__mobile .aheart-tabs').exists()).toBe(true)
    expect(findTab(wrapper, '执行').get('.aheart-ai-workbench__pending-badge').attributes('aria-label')).toBe('1 项待审批')
    await findTab(wrapper, '会话').trigger('click')
    expect(wrapper.find('.aheart-ai-workbench__mobile').text()).toContain('需求简报')
    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    const drawer = wrapper.getComponent({ name: 'ADrawer' })
    expect(drawer.exists()).toBe(true)
    expect(drawer.props('getContainer')).toBe(false)
  })

  it('shows the artifact explicitly associated with a pending approval', async () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks: [{
          id: 'publish',
          label: '发布结果',
          status: 'waiting-approval' as const,
          approval: { id: 'approve-publish', title: '确认发布', artifactId: 'report' }
        }],
        artifacts: [
          { id: 'report', title: '调研报告.md', description: '待发布版本' },
          { id: 'notes', title: '会议纪要.md', description: '背景资料' }
        ],
        activeArtifact: 'notes'
      }
    })

    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')

    const priority = wrapper.get('.aheart-ai-workbench__mobile-priority')
    expect(priority.text()).toContain('审批对象')
    expect(priority.text()).toContain('调研报告.md')
    expect(priority.text()).toContain('待发布版本')
  })

  it('shows approval result without rewriting the waiting-approval task status', () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks: [{
          id: 'publish',
          label: '发布结果',
          status: 'waiting-approval' as const,
          approval: { id: 'approve-publish', title: '确认发布', status: 'approved' as const }
        }]
      }
    })

    expect(wrapper.find('[data-pending-approval-summary]').exists()).toBe(false)
    expect(wrapper.find('.aheart-ai-workbench__pending-badge').exists()).toBe(false)
    expect(wrapper.get('[data-workbench-status]').text()).not.toContain('已完成')
    const timelineItem = wrapper.get('[data-task-id="publish"]')
    expect(timelineItem.get('.aheart-ai-workbench__task-status').text()).toBe('等待审批')
    expect(timelineItem.classes()).toContain('is-waiting-approval')
    expect(timelineItem.classes()).not.toContain('is-complete')
    expect(wrapper.get('.aheart-ai-workbench__progress').text()).toContain('0 / 1 已完成')
    expect(wrapper.get('[data-approval-id="approve-publish"] .aheart-ai-workbench__approval-result').text()).toBe('已批准')
    expect(wrapper.get('.aheart-ai-workbench__mobile-priority').text()).toContain('审批结果')
    expect(wrapper.get('.aheart-ai-workbench__mobile-priority').text()).toContain('已批准')
  })

  it('opens the mobile execution drawer from a pending approval summary with its artifact name', async () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks: [{
          id: 'publish',
          label: '发布结果',
          status: 'waiting-approval' as const,
          approval: { id: 'approve-publish', title: '确认发布', artifactId: 'report' }
        }],
        artifacts: [{ id: 'report', title: '调研报告.md' }]
      }
    })

    const summary = wrapper.get('[data-pending-approval-summary]')
    expect(summary.text()).toContain('待审批：调研报告.md')
    await summary.trigger('click')
    expect(wrapper.getComponent({ name: 'ADrawer' }).props('open')).toBe(true)
  })

  it('forwards scoped task, source, attachment and artifact preview slots', () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks,
        sources: [{ id: 'source', title: '产品来源' }],
        attachments: [{ id: 'attachment', name: '需求文档.pdf' }],
        artifacts: [{ id: 'report', title: '报告.md' }]
      },
      slots: {
        task: '<p class="custom-task">{{ task.label }}</p>',
        sources: '<p class="custom-sources">{{ sources[0].title }}</p>',
        attachments: '<p class="custom-attachments">{{ attachments[0].name }}</p>',
        artifact: '<p class="custom-artifact">{{ artifact.title }}</p>'
      }
    })

    expect(wrapper.get('.custom-task').text()).toBe('检索资料')
    expect(wrapper.get('.custom-sources').text()).toBe('产品来源')
    expect(wrapper.get('.custom-attachments').text()).toBe('需求文档.pdf')
    expect(wrapper.get('.custom-artifact').text()).toBe('报告.md')
  })

  it('presents a workbench status summary and a scannable execution timeline', () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        title: '发布方案 Agent',
        description: '整理资料、生成方案并等待人工确认。',
        tasks: [
          { id: 'research', label: '检索产品资料', status: 'complete', kind: 'tool', toolName: 'knowledge-search', detail: '已找到 8 个来源', startedAt: '10:01', completedAt: '10:02' },
          { id: 'draft', label: '生成发布方案', status: 'running', progress: 64, detail: '正在组织内容' },
          { id: 'publish', label: '确认发布', status: 'waiting-approval', approval: { id: 'approve-publish', title: '发布到知识库' } }
        ]
      }
    })

    expect(wrapper.get('.aheart-ai-workbench__header').text()).toContain('发布方案 Agent')
    expect(wrapper.get('[data-workbench-status]').text()).toContain('等待人工审批')
    expect(wrapper.get('.aheart-ai-workbench__progress').text()).toContain('1 / 3 已完成')
    expect(wrapper.get('[data-pending-approval-summary]').text()).toBe('1 项待审批')
    expect(wrapper.findAll('.aheart-ai-workbench__timeline-item')).toHaveLength(3)
    expect(wrapper.get('[data-task-id="research"]').text()).toContain('knowledge-search')
    expect(wrapper.get('[data-task-id="draft"] [role="progressbar"]').attributes('aria-valuenow')).toBe('64')
  })

  it('keeps artifact selection controlled and renders a dedicated preview surface', async () => {
    const artifacts = [
      { id: 'report', title: '调研报告.md', description: '可发布版本', type: 'markdown' },
      { id: 'data', title: '来源数据.csv', description: '结构化来源', type: 'table' }
    ]
    const wrapper = mount(AIAgentWorkbench, {
      props: { artifacts, activeArtifact: 'report' },
      slots: {
        'artifact-preview': '<article class="custom-preview">正在预览：{{ artifact.title }}</article>'
      }
    })

    expect(wrapper.get('.custom-preview').text()).toBe('正在预览：调研报告.md')
    await wrapper.get('[data-artifact-id="data"] button').trigger('click')
    expect(wrapper.emitted('update:activeArtifact')?.[0]).toEqual(['data'])
    expect(wrapper.get('.custom-preview').text()).toBe('正在预览：调研报告.md')

    await wrapper.setProps({ activeArtifact: 'data' })
    expect(wrapper.get('.custom-preview').text()).toBe('正在预览：来源数据.csv')
  })

  it('shows recoverable error details and completed approval outcomes', () => {
    const wrapper = mount(AIAgentWorkbench, {
      props: {
        tasks: [
          { id: 'failed', label: '生成摘要', status: 'error', error: '上游服务超时', detail: '执行失败' },
          { id: 'approved', label: '发布产物', status: 'complete', approval: { id: 'approval', title: '发布确认', status: 'approved' } }
        ]
      }
    })

    expect(wrapper.get('[data-task-id="failed"] details').text()).toContain('上游服务超时')
    expect(wrapper.get('[data-task-id="failed"] [data-action="retry"]').exists()).toBe(true)
    expect(wrapper.get('[data-approval-id="approval"]').text()).toContain('已批准')
    expect(wrapper.find('[data-approval-id="approval"] [data-action="approve"]').exists()).toBe(false)
  })

  it('keeps chat usable when messages are not externally controlled', async () => {
    const transport: AITransport = {
      async *send() {
        yield { type: 'text-delta', delta: '工作台回复' }
        yield { type: 'done' }
      }
    }
    const wrapper = mount(AIAgentWorkbench, { props: { transport } })
    const desktopChat = wrapper.get('.aheart-ai-workbench__desktop .aheart-ai-chat-panel')

    await desktopChat.get('textarea').setValue('工作台问题')
    await desktopChat.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(desktopChat.text()).toContain('工作台问题')
    expect(desktopChat.text()).toContain('工作台回复')
  })

  it('responds when messages switch between uncontrolled and controlled at runtime', async () => {
    const transport: AITransport = { send: async function* () { yield { type: 'done' } } }
    const Host = defineComponent({
      data: () => ({ controlled: false, messages: [{ id: 'history', role: 'assistant' as const, content: '异步历史消息', status: 'complete' as const }] }),
      render() {
        return h(AIAgentWorkbench, {
          transport,
          ...(this.controlled ? { messages: this.messages } : {})
        })
      }
    })
    const wrapper = mount(Host)
    expect(wrapper.text()).not.toContain('异步历史消息')

    wrapper.vm.controlled = true
    await flushPromises()
    expect(wrapper.getComponent(AIAgentWorkbench).props('messages')).toEqual(wrapper.vm.messages)
    const desktopChat = wrapper.getComponent(AIAgentWorkbench).findAllComponents({ name: 'AAIChatPanel' })[0]
    expect(desktopChat?.props('messages')).toEqual(wrapper.vm.messages)
    expect(wrapper.text()).toContain('异步历史消息')

    wrapper.vm.controlled = false
    await flushPromises()
    expect(wrapper.text()).not.toContain('异步历史消息')
  })

  it('locks disabled context items against drag and button reordering', async () => {
    const contextItems = [
      { id: 'locked', label: '锁定资料', disabled: true },
      { id: 'open', label: '普通资料' }
    ]
    const wrapper = mount(AIAgentWorkbench, { props: { contextItems } })
    const locked = wrapper.get('.aheart-ai-workbench__desktop [data-context-id="locked"]')

    expect(locked.get('button').attributes('disabled')).toBeDefined()
    expect(locked.element.closest('.aheart-dnd-sortable-item')?.getAttribute('aria-disabled')).toBe('true')
    await locked.get('button').trigger('click')
    expect(wrapper.emitted('update:contextItems')).toBeUndefined()
  })
})
