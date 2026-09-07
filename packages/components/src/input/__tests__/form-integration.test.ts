import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import Form from '../../form/form.vue'
import FormItem from '../../form/form-item.vue'
import Input from '../input.vue'
import Select from '../../select/select.vue'
import DateRangePicker from '../../date-picker/date-range-picker.vue'
import Upload from '../../upload/upload.vue'
import TreeSelect from '../../tree-select/tree-select.vue'

enableAutoUnmount(afterEach)

const mountForm = (render: () => ReturnType<typeof h>, model: Record<string, unknown> = {}) => mount(defineComponent({
  setup() { return () => h(Form, { model }, render) }
}))

describe('controls and Form control protocol', () => {
  it('updates a Form field on Input change and validates on blur', async () => {
    const model = ref<Record<string, unknown>>({ email: '' })
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(Form, { model: model.value, validateTrigger: ['change', 'blur'] }, () => h(FormItem,
          { name: 'email', label: 'Email', rules: [{ required: true, message: 'required' }] },
          () => h(Input, { modelValue: model.value.email as string, 'onUpdate:modelValue': (value: string) => { model.value.email = value } })))
      }
    }))
    const input = wrapper.get('input')
    await input.setValue('a@b.test')
    await nextTick()
    expect(model.value.email).toBe('a@b.test')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    model.value.email = ''
    await nextTick()
    await input.trigger('focusout')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').text()).toBe('required')
  })

  it('keeps explicit aria-invalid over Form status and merges descriptions', async () => {
    const wrapper = mountForm(() => h(FormItem, { name: 'field', label: 'Field', help: 'Help', validateStatus: 'error' }, () => h(Input, {
      'aria-invalid': 'false', 'aria-describedby': 'custom-help'
    })))
    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBe('false')
    expect(input.attributes('aria-describedby')).toContain('custom-help')
    expect(input.attributes('aria-describedby')).toContain('aheart-field')
  })

  it('does not report Select blur while focus moves into its teleported popup', async () => {
    const blurred: Event[] = []
    const wrapper = mount(FormItem, { props: { name: 'fruit', label: 'Fruit' }, slots: {
      default: () => h(Select, { options: [{ label: 'Apple', value: 'apple' }], defaultOpen: true, onBlur: (event: Event) => blurred.push(event) })
    }, attachTo: document.body })
    await nextTick()
    const trigger = wrapper.get('[role="combobox"]')
    const popup = document.body.querySelector('.aheart-select__popup') as HTMLElement
    popup.tabIndex = -1
    popup.focus()
    await trigger.trigger('focusout')
    await nextTick()
    expect(blurred).toHaveLength(0)
  })

  it('gives range controls distinct IDs and shared Form relationships', () => {
    const wrapper = mountForm(() => h(FormItem, { name: 'period', label: 'Period', help: 'Choose a period' }, () => h(DateRangePicker)))
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'))
    expect(inputs[0].attributes('aria-labelledby')).toBe(inputs[1].attributes('aria-labelledby'))
    expect(inputs[0].attributes('aria-describedby')).toBe(inputs[1].attributes('aria-describedby'))
  })

  it('associates Upload file input with Form label and validates its value change', async () => {
    const model = ref<Record<string, unknown>>({ files: [] })
    const wrapper = mount(defineComponent({ setup: () => () => h(Form, { model: model.value, validateTrigger: 'change' }, () => h(FormItem, {
      name: 'files', label: 'Attachments', rules: [{ required: true, message: 'attach a file' }]
    }, () => h(Upload, { fileList: model.value.files as never[], 'onUpdate:fileList': (files: unknown[]) => { model.value.files = files } }))) }))
    const input = wrapper.get('input[type="file"]')
    expect(input.attributes('id')).toBeTruthy()
    expect(input.attributes('aria-labelledby')).toBeTruthy()
    Object.defineProperty(input.element, 'files', { configurable: true, value: [new File(['x'], 'x.txt')] })
    await input.trigger('change')
    await nextTick()
    expect((model.value.files as unknown[]).length).toBe(1)
  })

  it('associates TreeSelect with Form label and validates its selected value', async () => {
    const model = ref<Record<string, unknown>>({ category: undefined })
    const wrapper = mount(defineComponent({ setup: () => () => h(Form, { model: model.value, validateTrigger: 'change' }, () => h(FormItem, {
      name: 'category', label: 'Category', rules: [{ required: true, message: 'choose one' }]
    }, () => h(TreeSelect, { treeData: [{ key: 'a', title: 'A' }], modelValue: model.value.category as string | undefined, 'onUpdate:modelValue': (value: string) => { model.value.category = value } }))) }))
    const trigger = wrapper.get('[role="combobox"]')
    expect(trigger.attributes('aria-labelledby')).toBeTruthy()
    await trigger.trigger('click')
    await nextTick()
    await (document.body.querySelector('[data-tree-key="a"]') as HTMLElement).click()
    await nextTick()
    expect(model.value.category).toBe('a')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
