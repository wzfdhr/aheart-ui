import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AIAttachments from '../attachments.vue'
import AIBubble from '../bubble.vue'
import AIConversations from '../conversations.vue'
import AIPrompts from '../prompts.vue'
import AISources from '../sources.vue'

describe('AI primitive components', () => {
  it('renders message content as text instead of raw HTML', () => {
    const wrapper = mount(AIBubble, {
      props: {
        message: { id: 'assistant-1', role: 'assistant', content: '<img src=x onerror=alert(1)>' }
      }
    })

    expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders a safe Markdown subset and accepts a custom content renderer', () => {
    const markdown = mount(AIBubble, {
      props: { message: { id: 'assistant-1', role: 'assistant', content: '**重点** [文档](https://example.com) <script>bad()</script>' } }
    })

    expect(markdown.get('strong').text()).toBe('重点')
    expect(markdown.get('a').attributes('href')).toBe('https://example.com')
    expect(markdown.text()).toContain('<script>bad()</script>')

    const custom = mount(AIBubble, {
      props: {
        message: { id: 'assistant-2', role: 'assistant', content: '默认文本' },
        contentRenderer: (message) => h('code', `自定义：${message.content}`)
      }
    })
    expect(custom.get('code').text()).toBe('自定义：默认文本')
  })

  it('renders only safe source protocols', () => {
    const wrapper = mount(AISources, {
      props: {
        sources: [
          { id: 'safe', title: '文档', url: 'https://example.com/docs' },
          { id: 'unsafe', title: '不安全链接', url: 'javascript:alert(1)' }
        ]
      }
    })

    expect(wrapper.find('a').attributes('href')).toBe('https://example.com/docs')
    expect(wrapper.text()).toContain('不安全链接')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('keeps prompt, conversation and attachment interactions controlled', async () => {
    const prompts = mount(AIPrompts, { props: { prompts: [{ key: 'summary', label: '总结' }] } })
    await prompts.get('button').trigger('click')
    expect(prompts.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'summary' })

    const conversations = mount(AIConversations, {
      props: { modelValue: 'one', conversations: [{ key: 'one', label: '会话一' }, { key: 'two', label: '会话二' }] }
    })
    await conversations.findAll('button')[1].trigger('click')
    expect(conversations.emitted('update:modelValue')).toEqual([['two']])

    const attachments = mount(AIAttachments, { props: { removable: true, items: [{ id: 'file', name: '需求.md' }] } })
    await attachments.get('button').trigger('click')
    expect(attachments.emitted('remove')?.[0]?.[0]).toMatchObject({ id: 'file' })
  })

  it('does not turn unsafe attachment URLs into links', () => {
    const wrapper = mount(AIAttachments, {
      props: { items: [{ id: 'unsafe', name: '危险附件', url: 'javascript:alert(1)' }] }
    })

    expect(wrapper.text()).toContain('危险附件')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
