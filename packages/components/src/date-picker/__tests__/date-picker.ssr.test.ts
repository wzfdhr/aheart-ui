import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DatePicker from '../date-picker.vue'
import DateRangePicker from '../date-range-picker.vue'

describe('DatePicker SSR', () => {
  afterEach(() => vi.useRealTimers())
  it('renders a deterministic closed selector without browser globals', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(DatePicker, { modelValue: '2026-07-14' })
    }))

    expect(html).toContain('aheart-date-picker__selector')
    expect(html).toContain('value="2026-07-14"')
    expect(html).not.toContain('aheart-date-picker__panel')
  })

  it('renders a deterministic default-open panel without reading the ambient clock', async () => {
    const render = () => renderToString(createSSRApp({
      render: () => h(DatePicker, { defaultOpen: true })
    }))

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-15T00:00:00Z'))
    const first = await render()
    vi.setSystemTime(new Date('2031-12-31T00:00:00Z'))
    const second = await render()
    expect(first).toBe(second)
    expect(first).toContain('2000年1月')
  })

  it('renders a deterministic range selector without browser globals', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(DateRangePicker, { modelValue: ['2026-07-14', '2026-07-20'] })
    }))

    expect(html).toContain('aheart-date-range-picker__selector')
    expect(html).toContain('value="2026-07-14"')
    expect(html).toContain('value="2026-07-20"')
    expect(html).not.toContain('aheart-date-range-picker__panel')
  })
})
