import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AIChatPanel from '../chat-panel.vue'
import type { AIStreamEvent, AITransport } from '../types'

async function* events(values: AIStreamEvent[]) {
  for (const value of values) yield value
}

describe('AIChatPanel', () => {
  it('sends a user message and progressively renders transport text', async () => {
    const requests: string[] = []
    const transport: AITransport = {
      send(request) {
        requests.push(request.messages.at(-1)?.content ?? '')
        return events([{ type: 'text-delta', delta: '你好，' }, { type: 'text-delta', delta: '有什么可以帮你？' }, { type: 'done' }])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [] } })

    await wrapper.get('textarea').setValue('帮我整理需求')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(requests).toEqual(['帮我整理需求'])
    expect(wrapper.text()).not.toContain('帮我整理需求')
    const confirmedMessages = wrapper.emitted('update:messages')?.at(-1)?.[0] as Array<Record<string, unknown>>
    await wrapper.setProps({ messages: confirmedMessages })
    expect(wrapper.text()).toContain('帮我整理需求')
    expect(wrapper.text()).toContain('你好，有什么可以帮你？')
    expect(wrapper.get('[role="status"]').text()).toBe('已完成生成')
    expect(wrapper.get('textarea').attributes('aria-label')).toBe('消息内容')
    expect(wrapper.get('[role="log"]').attributes('aria-live')).toBe('polite')
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toMatchObject([
      { role: 'user', content: '帮我整理需求' },
      { role: 'assistant', content: '你好，有什么可以帮你？', status: 'complete' }
    ])
  })

  it('marks the assistant message as stopped when the user cancels streaming', async () => {
    let release: (() => void) | undefined
    const transport: AITransport = {
      async *send(_request, signal) {
        yield { type: 'process', item: { id: 'tool', label: '检索资料', status: 'running' } }
        yield { type: 'text-delta', delta: '正在生成' }
        await new Promise<void>((resolve) => {
          release = resolve
          signal.addEventListener('abort', resolve, { once: true })
        })
        yield { type: 'cancelled' }
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })

    await wrapper.get('textarea').setValue('停止测试')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.get('button[type="button"][aria-label="停止生成"]').trigger('click')
    release?.()
    await flushPromises()

    await wrapper.setProps({ messages: wrapper.emitted('update:messages')?.at(-1)?.[0] })

    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(
      expect.objectContaining({
        role: 'assistant',
        status: 'stopped',
        process: [expect.objectContaining({ id: 'tool', status: 'stopped' })]
      })
    )
  })

  it('keeps an error visible when the transport fails', async () => {
    const transport: AITransport = {
      send() {
        return events([
          { type: 'process', item: { id: 'tool', label: '读取资料', status: 'running' } },
          { type: 'error', error: '服务暂不可用' }
        ])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })

    await wrapper.get('textarea').setValue('测试错误')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    await wrapper.setProps({ messages: wrapper.emitted('update:messages')?.at(-1)?.[0] })

    expect(wrapper.text()).toContain('服务暂不可用')
    expect(wrapper.emitted('error')?.[0]).toEqual(['服务暂不可用'])
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(
      expect.objectContaining({ process: [expect.objectContaining({ id: 'tool', status: 'error' })] })
    )
  })

  it('ignores late transport events after stopping', async () => {
    let continueStream: (() => void) | undefined
    const transport: AITransport = {
      async *send() {
        yield { type: 'text-delta', delta: '第一段' }
        await new Promise<void>((resolve) => {
          continueStream = resolve
        })
        yield { type: 'text-delta', delta: '不应出现' }
        yield { type: 'done' }
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })

    await wrapper.get('textarea').setValue('停止后丢弃事件')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.get('button[type="button"][aria-label="停止生成"]').trigger('click')
    continueStream?.()
    await flushPromises()

    await wrapper.setProps({ messages: wrapper.emitted('update:messages')?.at(-1)?.[0] })

    expect(wrapper.text()).toContain('第一段')
    expect(wrapper.text()).not.toContain('不应出现')
    expect(wrapper.get('[role="status"]').text()).toBe('已停止生成')
  })

  it('keeps later deltas when the parent confirms an older streaming snapshot', async () => {
    let continueStream: (() => void) | undefined
    const transport: AITransport = {
      async *send() {
        yield { type: 'text-delta', delta: '第一段' }
        await new Promise<void>((resolve) => {
          continueStream = resolve
        })
        yield { type: 'text-delta', delta: '第二段' }
        yield { type: 'done' }
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })

    await wrapper.get('textarea').setValue('竞态测试')
    await wrapper.get('button[type="submit"]').trigger('click')
    const olderSnapshot = wrapper.emitted('update:messages')?.[0]?.[0]
    await wrapper.setProps({ messages: olderSnapshot })
    continueStream?.()
    await flushPromises()

    const finalMessages = wrapper.emitted('update:messages')?.at(-1)?.[0] as Array<Record<string, unknown>>
    expect(finalMessages.at(-1)).toMatchObject({ role: 'assistant', content: '第一段第二段', status: 'complete' })
  })

  it('uses the parent-confirmed history for the next request after a stream finishes', async () => {
    const requests: string[][] = []
    const transport: AITransport = {
      send(request) {
        requests.push(request.messages.map((message) => message.content))
        return events([{ type: 'done' }])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [] } })

    await wrapper.get('textarea').setValue('父级不确认的第一条')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    await wrapper.get('textarea').setValue('第二条')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(requests).toEqual([['父级不确认的第一条'], ['第二条']])
  })

  it('renders uncontrolled defaults and an actionable empty-state entry', async () => {
    const requests: Array<{ content: string; conversationId?: string }> = []
    const transport: AITransport = {
      send(request) {
        requests.push({
          content: request.messages.at(-1)?.content ?? '',
          conversationId: request.conversationId
        })
        return events([{ type: 'done' }])
      }
    }
    const wrapper = mount(AIChatPanel, {
      props: {
        transport,
        defaultMessages: [{ id: 'seed', role: 'assistant', content: '历史消息', status: 'complete' }],
        conversations: [
          { key: 'one', label: '会话一' },
          { key: 'two', label: '会话二' }
        ],
        activeConversation: 'one'
      }
    })

    expect(wrapper.text()).toContain('历史消息')
    await wrapper.get('.aheart-ai-conversations button:nth-child(2)').trigger('click')
    expect(wrapper.emitted('update:activeConversation')?.[0]).toEqual(['two'])

    wrapper.unmount()
    const emptyWrapper = mount(AIChatPanel, {
      props: {
        transport,
        conversationId: 'one',
        prompts: [{ key: 'summary', label: '总结当前需求' }]
      }
    })
    expect(emptyWrapper.get('.aheart-ai-welcome').text()).toContain('我能为你做些什么')
    await emptyWrapper.get('.aheart-ai-prompts button').trigger('click')
    await flushPromises()

    expect(requests.at(-1)).toEqual({ content: '总结当前需求', conversationId: 'one' })
    expect(emptyWrapper.emitted('send')?.at(-1)).toEqual(['总结当前需求'])
  })

  it('sends controlled attachments with the user message and clears the composer list', async () => {
    const requests: Parameters<AITransport['send']>[0][] = []
    const transport: AITransport = {
      send(request) {
        requests.push(request)
        return events([{ type: 'done' }])
      }
    }
    const wrapper = mount(AIChatPanel, {
      props: {
        transport,
        attachments: [{ id: 'brief', name: '需求简报.md' }]
      }
    })

    await wrapper.get('textarea').setValue('结合附件给出方案')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(requests[0].messages.at(-1)).toMatchObject({
      role: 'user',
      content: '结合附件给出方案',
      attachments: [{ id: 'brief', name: '需求简报.md' }]
    })
    expect(wrapper.emitted('update:attachments')?.[0]).toEqual([[]])
  })

  it('retries and regenerates assistant messages with explicit request actions', async () => {
    const requests: Parameters<AITransport['send']>[0][] = []
    const transport: AITransport = {
      send(request) {
        requests.push(request)
        return events([{ type: 'text-delta', delta: '恢复后的回答' }, { type: 'done' }])
      }
    }
    const failedHistory = [
      { id: 'user-1', role: 'user' as const, content: '生成发布计划', status: 'complete' as const },
      { id: 'assistant-1', role: 'assistant' as const, content: '', status: 'error' as const, error: '网络错误' }
    ]
    const wrapper = mount(AIChatPanel, { props: { transport, defaultMessages: failedHistory } })

    await wrapper.get('[data-message-id="assistant-1"] [data-action="retry"]').trigger('click')
    await flushPromises()
    expect(requests[0]).toMatchObject({ action: 'retry', messageId: 'assistant-1' })
    expect(wrapper.emitted('retry')?.[0]?.[0]).toMatchObject({ id: 'assistant-1' })

    const regeneratedHistory = wrapper.emitted('update:messages')?.at(-1)?.[0]
    await wrapper.setProps({ messages: regeneratedHistory })
    const completedAssistant = (regeneratedHistory as Array<{ role: string }>).findLast((message) => message.role === 'assistant')
    await wrapper.get(`[data-message-id="${(completedAssistant as { id: string }).id}"] [data-action="regenerate"]`).trigger('click')
    await flushPromises()

    expect(requests[1]).toMatchObject({ action: 'regenerate', messageId: (completedAssistant as { id: string }).id })
    expect(wrapper.emitted('regenerate')).toHaveLength(1)
  })

  it('edits and resends a user message, and copies message content', async () => {
    const requests: Parameters<AITransport['send']>[0][] = []
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })
    const transport: AITransport = {
      send(request) {
        requests.push(request)
        return events([{ type: 'done' }])
      }
    }
    const wrapper = mount(AIChatPanel, {
      props: {
        transport,
        defaultMessages: [
          { id: 'user-1', role: 'user', content: '旧问题', status: 'complete' },
          { id: 'assistant-1', role: 'assistant', content: '旧回答', status: 'complete' }
        ]
      }
    })

    await wrapper.get('[data-message-id="assistant-1"] [data-action="copy"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('旧回答')
    expect(wrapper.emitted('copy')?.[0]?.[0]).toMatchObject({ id: 'assistant-1' })

    await wrapper.get('[data-message-id="user-1"] [data-action="edit"]').trigger('click')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('旧问题')
    await wrapper.get('textarea').setValue('更新后的问题')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(requests[0]).toMatchObject({ action: 'edit', messageId: 'user-1' })
    expect(requests[0].messages.at(-1)?.content).toBe('更新后的问题')
    expect(wrapper.emitted('edit')?.[0]).toEqual([
      expect.objectContaining({ id: 'user-1' }),
      '更新后的问题'
    ])
  })
})
