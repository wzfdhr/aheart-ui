// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { describe, expect, it } from 'vitest'
import Cascader from '../cascader.vue'
import TreeSelect from '../../tree-select/tree-select.vue'

const render = (component: Parameters<typeof h>[0], props: Record<string, unknown>) =>
  renderToString(createSSRApp({ render: () => h(component, props) }))

describe('selection overlay SSR ids', () => {
  it('renders stable Cascader control and option relationships', async () => {
    const props = {
      defaultOpen: true,
      options: [{ value: 'parent', label: 'Parent', children: [{ value: 'child', label: 'Child' }] }]
    }
    const first = await render(Cascader, props)
    const second = await render(Cascader, props)
    const panelId = first.match(/aria-controls="([^"]+)"/)?.[1]

    expect(first).toBe(second)
    expect(panelId).toBeTruthy()
    expect(first).toContain(`id="${panelId}"`)
  })

  it('renders stable TreeSelect control and tree relationships', async () => {
    const props = {
      defaultOpen: true,
      treeData: [{ key: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] }]
    }
    const first = await render(TreeSelect, props)
    const second = await render(TreeSelect, props)
    const panelId = first.match(/aria-controls="([^"]+)"/)?.[1]

    expect(first).toBe(second)
    expect(panelId).toBeTruthy()
    expect(first).toContain(`id="${panelId}"`)
  })
})
