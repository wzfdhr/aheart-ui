import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import AIAgentWorkbench from '../agent-workbench.vue'
import type { AITransport } from '../types'

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

  it('keeps task ordering controlled and provides non-drag move controls', async () => {
    const wrapper = mount(AIAgentWorkbench, { props: { tasks } })

    await wrapper.get('[data-task-id="research"] [data-action="move-down"]').trigger('click')
    expect(wrapper.emitted('update:tasks')?.[0]?.[0]).toEqual([tasks[1], tasks[0]])
    expect(wrapper.emitted('move-task')?.[0]).toEqual(['research', 'down'])
  })

  it('includes a mobile tabs and drawer workflow', async () => {
    const wrapper = mount(AIAgentWorkbench, { props: { tasks, contextItems: [{ id: 'brief', label: '需求简报' }] } })

    expect(wrapper.find('.aheart-ai-workbench__mobile .aheart-tabs').exists()).toBe(true)
    await wrapper.get('#aheart-tab-conversations').trigger('click')
    expect(wrapper.find('.aheart-ai-workbench__mobile').text()).toContain('需求简报')
    await wrapper.get('#aheart-tab-execution').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
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
