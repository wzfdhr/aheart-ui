import { computed, createSSRApp, h, nextTick, ref } from 'vue'
import { useVirtualizer, defaultRangeExtractor } from '@tanstack/vue-virtual'
import ASelect from 'aheart-ui/es/select/select.vue.js'

export const App = {
  props: { dynamic: Boolean, enabled: { type: Boolean, default: true } },
  setup(props) {
    const scroll = ref(null)
    const active = ref(0)
    const grow = ref(false)
    const count = 10000
    const virtual = useVirtualizer(computed(() => ({
      count,
      enabled: props.enabled,
      getScrollElement: () => scroll.value,
      initialRect: { height: 288, width: 600 },
      estimateSize: () => props.dynamic ? 48 : 32,
      overscan: 3,
      getItemKey: index => 'row-' + index,
      rangeExtractor: range => [...new Set([...defaultRangeExtractor(range), active.value])].sort((a, b) => a - b)
    })))
    const keydown = async event => {
      const direction = event.key === 'ArrowDown' ? 1 : -1
      if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return
      event.preventDefault()
      let next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : Math.max(0, Math.min(count - 1, active.value + direction))
      while (next > 0 && next < count - 1 && next % 17 === 0) next += direction
      active.value = next
      await nextTick()
      virtual.value.scrollToIndex(next, { align: 'auto' })
    }
    return () => h('main', [
      h('h1', 'D4 isolated consumer'),
      props.dynamic ? h('button', { onClick: () => { grow.value = !grow.value } }, 'Change row height') : null,
      h(ASelect, { options: [{ label: 'Packaged Aheart consumer', value: 1 }], defaultValue: 1, 'aria-label': 'Packaged Select' }),
      h('input', { role: 'combobox', 'aria-label': 'Virtual items', 'aria-controls': 'virtual-list', 'aria-expanded': 'true', 'aria-activedescendant': 'virtual-row-' + active.value, readonly: true, value: 'Active ' + active.value, onKeydown: keydown }),
      h('div', { id: 'virtual-list', ref: scroll, role: 'listbox', style: 'height:288px;width:600px;max-width:100%;overflow:auto;border:1px solid #ccc' }, [
        h('div', { style: { height: virtual.value.getTotalSize() + 'px', position: 'relative', width: '100%' } },
          virtual.value.getVirtualItems().map(item => h('div', {
            key: item.key, id: 'virtual-row-' + item.index, 'data-index': item.index, role: 'option',
            'aria-posinset': item.index + 1, 'aria-setsize': count,
            'aria-disabled': item.index > 0 && item.index % 17 === 0 ? 'true' : undefined,
            'aria-selected': String(item.index === active.value),
            ref: element => { if (element) virtual.value.measureElement(element) },
            style: { boxSizing:'border-box', position:'absolute', top:0, left:0, width:'100%', minHeight:'32px', padding:'8px', lineHeight:'16px', transform:'translateY(' + item.start + 'px)', background: item.index === active.value ? '#e6f4ff' : '#fff' }
          }, props.dynamic && item.index % 2 === 0 ? ['Item ' + item.index, h('br'), 'Dynamic second line', ...(grow.value ? [h('br'), 'Third line', h('br'), 'Fourth line'] : [])] : 'Item ' + item.index))
        )
      ])
    ])
  }
}

export function makeApp(dynamic, enabled = true) { return createSSRApp(App, { dynamic, enabled }) }
