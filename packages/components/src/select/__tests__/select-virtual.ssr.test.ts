// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { describe, expect, it } from 'vitest'
import Select from '../select.vue'

const render = (component: Parameters<typeof h>[0], props: Record<string, unknown>) =>
  renderToString(createSSRApp({ render: () => h(component, props) }))

const options = Array.from({ length: 1_000 }, (_, index) => ({ label: `Option ${index}`, value: index }))

describe('Select virtual SSR', () => {
  it('renders a bounded virtual window with selected tail active and typed ids', async () => {
    const html = await render(Select, { defaultOpen: true, virtual: true, defaultValue: 999, options })
    const optionTags = [...html.matchAll(/<div\b[^>]*role="option"[^>]*>/g)].map((match) => match[0])
    const optionIds = optionTags.map((tag) => tag.match(/\bid="([^"]+)"/)?.[1]).filter((id): id is string => Boolean(id))
    const activeId = html.match(/aria-activedescendant="([^"]+)"/)?.[1]
    expect(optionIds.length).toBeGreaterThan(0)
    expect(optionIds.length).toBeLessThan(options.length)
    expect(activeId).toBeTruthy()
    expect(optionIds).toContain(activeId)
    expect(html).toContain('Option 999')

    const typed = await render(Select, { defaultOpen: true, virtual: true, defaultValue: 1, options: [
      { label: 'Number one', value: 1 },
      { label: 'String one', value: '1' }
    ] })
    const typedTags = [...typed.matchAll(/<div\b[^>]*role="option"[^>]*>/g)].map((match) => match[0])
    const typedIds = typedTags.map((tag) => tag.match(/\bid="([^"]+)"/)?.[1]).filter((id): id is string => Boolean(id))
    expect(new Set(typedIds).size).toBe(2)
    expect(typed.match(/aria-activedescendant="([^"]+)"/)?.[1]).toBe(typedIds[0])
  })

  it('keeps SSR output stable for multiple instances and separate requests', async () => {
    const props = { defaultOpen: true, virtual: { height: 240, estimateSize: 28, overscan: 2 }, options: options.slice(0, 20) }
    const renderPair = () => renderToString(createSSRApp({ render: () => h('div', [h(Select, props), h(Select, props)]) }))
    const first = await renderPair()
    const second = await renderPair()
    expect(first).toBe(second)
    const controls = [...first.matchAll(/aria-controls="([^"]+)"/g)].map((match) => match[1])
    expect(controls).toHaveLength(2)
    expect(new Set(controls).size).toBe(2)
    for (const id of controls) expect(first).toContain(`id="${id}"`)
  })

  it('keeps the default non-virtual mode complete and supports empty options without window', async () => {
    const html = await render(Select, { defaultOpen: true, options })
    expect((html.match(/class="aheart-select__option(?:"|\s)/g) ?? []).length).toBe(options.length)
    expect(html).not.toContain('data-index=')

    const empty = await render(Select, { defaultOpen: true, virtual: true, notFoundContent: 'No options', options: [] })
    expect(empty).toContain('No options')
    expect(empty).toContain('role="listbox"')
  })
})
