import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SortableList from '../sortable-list.vue'

vi.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => ({
  draggable: () => () => {},
  dropTargetForElements: () => () => {}
}))
vi.mock('@atlaskit/pragmatic-drag-and-drop-auto-scroll/element', () => ({
  autoScrollForElements: () => () => {},
  autoScrollWindowForElements: () => () => {}
}))

const props = { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' }
const regionsIn = (ownerDocument: Document) => Array.from(ownerDocument.querySelectorAll<HTMLElement>('.aheart-dnd-live-region'))
const announce = (list: HTMLElement, message: string) => {
  const CustomEventConstructor = list.ownerDocument.defaultView!.CustomEvent
  list.dispatchEvent(new CustomEventConstructor('aheart-sortable-announce', { detail: message }))
}

afterEach(() => {
  vi.useRealTimers()
  document.querySelectorAll('.aheart-dnd-live-region').forEach((element) => element.remove())
})

describe('sortable list live region', () => {
  it('shares one polite atomic region across Vue apps and removes it after the final list unmounts', async () => {
    const first = mount(SortableList, { props, attachTo: document.body })
    const second = mount(SortableList, { props, attachTo: document.body })
    await nextTick()

    expect(regionsIn(document)).toHaveLength(1)
    expect(regionsIn(document)[0].getAttribute('aria-live')).toBe('polite')
    expect(regionsIn(document)[0].getAttribute('aria-atomic')).toBe('true')

    first.unmount()
    expect(regionsIn(document)).toHaveLength(1)
    second.unmount()
    expect(regionsIn(document)).toHaveLength(0)
  })

  it('keeps the body-owned region available when the last mounted list unmounts first', async () => {
    const first = mount(SortableList, { props, attachTo: document.body })
    const second = mount(SortableList, { props, attachTo: document.body })
    await nextTick()
    const region = regionsIn(document)[0]
    const firstList = first.find('ul').element as HTMLElement

    expect(region.parentElement).toBe(document.body)
    second.unmount()

    expect(regionsIn(document)).toEqual([region])
    announce(firstList, '已移动到第 2 项')
    await Promise.resolve()
    expect(region.textContent).toBe('已移动到第 2 项')

    first.unmount()
  })

  it('replaces prior announcements and clears before asynchronously replaying the same message', async () => {
    const first = mount(SortableList, { props, attachTo: document.body })
    const second = mount(SortableList, { props, attachTo: document.body })
    await nextTick()
    const [firstList, secondList] = [first.find('ul').element as HTMLElement, second.find('ul').element as HTMLElement]
    const region = regionsIn(document)[0]

    announce(firstList, '已移动到第 2 项')
    await Promise.resolve()
    expect(region.textContent).toBe('已移动到第 2 项')

    announce(secondList, '已移动到第 2 项')
    expect(region.textContent).toBe('')
    await Promise.resolve()
    expect(region.textContent).toBe('已移动到第 2 项')

    announce(secondList, '已移动到第 1 项')
    announce(firstList, '已移动到第 2 项')
    expect(region.textContent).toBe('')
    await Promise.resolve()

    expect(regionsIn(document)).toHaveLength(1)
    expect(region.textContent).toBe('已移动到第 2 项')
    first.unmount()
    second.unmount()
  })

  it('keeps an independent live region for each owner document', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const iframeDocument = iframe.contentDocument!
    const main = mount(SortableList, { props, attachTo: document.body })
    const framed = mount(SortableList, { props, attachTo: iframeDocument.body })
    await nextTick()

    expect(regionsIn(document)).toHaveLength(1)
    expect(regionsIn(iframeDocument)).toHaveLength(1)

    main.unmount()
    framed.unmount()
    iframe.remove()
  })

  it('does not render a live region during SSR', async () => {
    const app = createSSRApp(defineComponent({
      setup() {
        return () => h(SortableList, props)
      }
    }))

    const html = await renderToString(app)

    expect(html).not.toContain('aheart-dnd-live-region')
    expect(regionsIn(document)).toHaveLength(0)
  })
})
