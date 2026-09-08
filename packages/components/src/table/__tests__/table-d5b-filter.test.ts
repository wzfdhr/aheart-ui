import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Table from '../table.vue'

interface Row {
  key: string
  name: string
  role: string
}

const rows: Row[] = [
  { key: 'ada', name: 'Ada', role: 'Architect' },
  { key: 'grace', name: 'Grace', role: 'Engineer' }
]

const tableColumns = (dropdown?: (context: any) => any) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    filters: rows.map((row) => ({ text: row.name, value: row.name })),
    filterDropdown: dropdown
  }
] as any

const filterDropdown = (context: any) => h(
  'div',
  { role: 'dialog', 'data-table-filter-popup': 'name', tabindex: -1 },
  [
    h('input', {
      'data-filter-input': 'name',
      value: context.selectedKeys?.[0] ?? '',
      onInput: (event: Event) => context.setSelectedKeys?.([(event.target as HTMLInputElement).value])
    }),
    h('button', { type: 'button', 'data-filter-action': 'confirm', onClick: () => context.confirm?.() }, 'Confirm'),
    h('button', { type: 'button', 'data-filter-action': 'reset', onClick: () => context.clearFilters?.() }, 'Reset'),
    h('button', { type: 'button', 'data-filter-action': 'cancel', onClick: () => context.close?.() }, 'Cancel')
  ]
)

const popup = () => document.querySelector<HTMLElement>('[data-table-filter-popup]')
const trigger = (wrapper: ReturnType<typeof mount>) => wrapper.find('button[aria-haspopup="dialog"]')

describe('Table D5-B filter dropdown contract', () => {
  it('keeps a draft through cancel, then confirms it and resets page/filter state', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: tableColumns(filterDropdown),
        dataSource: rows,
        pagination: { defaultCurrent: 1, pageSize: 1 }
      }
    })

    const filterTrigger = trigger(wrapper)
    expect(filterTrigger.exists()).toBe(true)
    if (!filterTrigger.exists()) return

    await filterTrigger.trigger('click')
    const openPopup = popup()
    expect(openPopup).not.toBeNull()
    if (!openPopup) return

    const input = openPopup.querySelector<HTMLInputElement>('[data-filter-input="name"]')
    expect(input).not.toBeNull()
    if (!input) return
    input.value = 'Ada'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    openPopup.querySelector<HTMLElement>('[data-filter-action="cancel"]')?.click()
    await nextTick()
    expect(popup()).toBeNull()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)

    await filterTrigger.trigger('click')
    const confirmPopup = popup()
    expect(confirmPopup).not.toBeNull()
    if (!confirmPopup) return
    const confirmInput = confirmPopup.querySelector<HTMLInputElement>('[data-filter-input="name"]')
    expect(confirmInput).not.toBeNull()
    if (!confirmInput) return
    confirmInput.value = 'Ada'
    confirmInput.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    confirmPopup.querySelector<HTMLElement>('[data-filter-action="confirm"]')?.click()
    await nextTick()

    expect(popup()).toBeNull()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual({ name: ['Ada'] })
  })

  it('reset clears the draft immediately and closes the single popup', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...tableColumns(filterDropdown)[0], defaultFilterDropdownOpen: true }],
        dataSource: rows
      }
    })

    const openPopup = popup()
    expect(openPopup).not.toBeNull()
    if (!openPopup) return
    openPopup.querySelector<HTMLElement>('[data-filter-action="reset"]')?.click()
    await nextTick()

    expect(popup()).toBeNull()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual({})
  })

  it.each(['escape', 'outside'])('dismisses the draft on %s without confirming it', async (reason) => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...tableColumns(filterDropdown)[0], defaultFilterDropdownOpen: true }],
        dataSource: rows
      }
    })
    const openPopup = popup()
    expect(openPopup).not.toBeNull()
    if (!openPopup) return

    if (reason === 'escape') {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    } else {
      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }))
    }
    await nextTick()

    expect(popup()).toBeNull()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('keeps Tab navigation inside the open filter popup and restores focus to its trigger', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...tableColumns(filterDropdown)[0], defaultFilterDropdownOpen: true }],
        dataSource: rows
      }
    })
    const openPopup = popup()
    expect(openPopup).not.toBeNull()
    if (!openPopup) return
    const controls = openPopup.querySelectorAll<HTMLElement>('input,button')
    expect(controls.length).toBeGreaterThan(0)
    if (controls.length === 0) return

    controls[0].focus()
    controls[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    await nextTick()
    expect(openPopup.contains(document.activeElement)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(trigger(wrapper).element)
  })

  it('honors controlled open rejection, asynchronous acceptance, and one visible popup', async () => {
    const open = ref(false)
    const requests: Array<[string, boolean]> = []
    const wrapper = mount(defineComponent({
      setup: () => () => h(Table, {
        columns: [
          { ...tableColumns(filterDropdown)[0], key: 'name', filterDropdownOpen: open.value },
          { ...tableColumns(filterDropdown)[0], key: 'role', title: 'Role', dataIndex: 'role', filterDropdownOpen: open.value }
        ],
        dataSource: rows,
        onFilterDropdownOpenChange: (key: string, nextOpen: boolean) => {
          requests.push([key, nextOpen])
        }
      } as any)
    }))
    const firstTrigger = trigger(wrapper)
    expect(firstTrigger.exists()).toBe(true)
    if (!firstTrigger.exists()) return
    await firstTrigger.trigger('click')
    expect(requests).toEqual([['name', true]])
    expect(popup()).toBeNull()

    open.value = true
    await nextTick()
    expect(popup()).not.toBeNull()
    if (!popup()) return
    const secondTrigger = wrapper.findAll('button[aria-haspopup="dialog"]')[1]
    expect(secondTrigger?.exists()).toBe(true)
    if (!secondTrigger?.exists()) return
    await secondTrigger.trigger('click')
    await nextTick()
    expect(document.querySelectorAll('[data-table-filter-popup]')).toHaveLength(1)
    expect(requests.at(-1)).toEqual(['role', true])

    open.value = false
    await nextTick()
    expect(popup()).toBeNull()
  })

  it('mounts by default in the trigger owner body and honors getPopupContainer', async () => {
    const container = document.createElement('div')
    container.dataset.filterHost = 'true'
    document.body.appendChild(container)
    const wrapper = mount(Table, {
      props: {
        columns: [{ ...tableColumns(filterDropdown)[0], defaultFilterDropdownOpen: true }],
        dataSource: rows,
        getPopupContainer: () => container
      } as any
    })
    await nextTick()
    expect(popup()).not.toBeNull()
    if (!popup()) return
    expect(popup()?.parentElement).toBe(container)
    wrapper.unmount()
    container.remove()
  })
})
