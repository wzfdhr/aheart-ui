import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
    const wrapper = mount(AIChatPanel, { props: { transport } })

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
    await wrapper.get('button[type="button"]').trigger('click')
    release?.()
    await flushPromises()

    await wrapper.setProps({ messages: wrapper.emitted('update:messages')?.at(-1)?.[0] })

    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(
      expect.objectContaining({ role: 'assistant', content: '正在生成', status: 'stopped' })
    )
  })

  it('keeps an error visible when the transport fails', async () => {
    const transport: AITransport = {
      send() {
        return events([{ type: 'error', error: '服务暂不可用' }])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })

    await wrapper.get('textarea').setValue('测试错误')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    await wrapper.setProps({ messages: wrapper.emitted('update:messages')?.at(-1)?.[0] })

    expect(wrapper.text()).toContain('服务暂不可用')
    expect(wrapper.emitted('error')?.[0]).toEqual(['服务暂不可用'])
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
    await wrapper.get('button[type="button"]').trigger('click')
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
})
