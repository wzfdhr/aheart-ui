import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AIAgentWorkbench from '../agent-workbench.vue'

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
})
