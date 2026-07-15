// @vitest-environment node
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import TimePicker, { TimeRangePicker } from '../index'

describe('TimePicker SSR', () => {
  it('renders closed single and range selectors without browser globals', async () => {
    const single = await renderToString(createSSRApp({ render: () => h(TimePicker, { modelValue: '09:30:00' }) }))
    const range = await renderToString(createSSRApp({ render: () => h(TimeRangePicker, { modelValue: ['09:30:00', '10:30:00'] }) }))
    expect(single).toContain('09:30:00')
    expect(range).toContain('09:30:00')
    expect(range).toContain('10:30:00')
  })
})
