import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { expect, it } from 'vitest'
import Table from '../table.vue'

it('restores the whole native radio group when its controlled selection request is rejected', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const wrapper = mount(Table, {
    attachTo: host,
    props: {
      columns: [{ title: 'Name', key: 'name', dataIndex: 'name' }],
      dataSource: [{ key: 'first', name: 'First' }, { key: 'second', name: 'Second' }],
      rowSelection: { type: 'radio', selectedRowKeys: ['first'] }
    }
  })
  try {
    const inputs = wrapper.findAll<HTMLInputElement>('tbody input[type="radio"]')
    inputs[1].element.click()
    await nextTick()
    expect(wrapper.emitted('update:selectedRowKeys')).toEqual([[['second']]])
    expect(inputs.map(input => input.element.checked)).toEqual([true, false])
  } finally {
    wrapper.unmount()
    host.remove()
  }
})
