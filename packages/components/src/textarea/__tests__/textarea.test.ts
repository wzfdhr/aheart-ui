import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Textarea from '../textarea.vue'

describe('Textarea', () => {
  it('renders value, rows, count, and autosize class', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'Line one', rows: 4, maxlength: 20, showCount: true, autoSize: true }
    })

    expect(wrapper.classes()).toContain('aheart-textarea')
    expect(wrapper.classes()).toContain('is-autosize')
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    expect(wrapper.find('textarea').element.value).toBe('Line one')
    expect(wrapper.find('.aheart-textarea__count').text()).toBe('8 / 20')
  })

  it('emits model update, input, and change', async () => {
    const wrapper = mount(Textarea)

    await wrapper.find('textarea').setValue('Long text')
    await wrapper.find('textarea').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Long text'])
  })

  it('updates the count immediately while the user is typing', async () => {
    const wrapper = mount(Textarea, {
      props: { maxlength: 20, showCount: true }
    })

    await wrapper.find('textarea').setValue('实时计数')

    expect(wrapper.find('.aheart-textarea__count').text()).toBe('4 / 20')
  })

  it('keeps a controlled value visible when the owner rejects input and clear requests', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'locked', allowClear: true, showCount: true }
    })
    const control = wrapper.get('textarea')

    await control.setValue('draft')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['draft'])
    expect(control.element.value).toBe('locked')
    expect(wrapper.get('.aheart-textarea__count').text()).toBe('6')

    await wrapper.get('.aheart-textarea__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
    expect(control.element.value).toBe('locked')
  })

  it('marks count overflow without truncating when no exceed formatter is supplied', async () => {
    const wrapper = mount(Textarea, {
      props: { showCount: true, count: { max: 3 } }
    })

    await wrapper.find('textarea').setValue('1234')

    expect(wrapper.classes()).toContain('is-count-exceeded')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('.aheart-textarea__count').text()).toBe('4 / 3')
  })

  it('resizes from scrollHeight and clamps object autosize rows', async () => {
    const wrapper = mount(Textarea, {
      attachTo: document.body,
      props: { modelValue: '', autoSize: { minRows: 2, maxRows: 4 } }
    })
    const control = wrapper.find('textarea').element
    Object.defineProperty(control, 'scrollHeight', { configurable: true, value: 96 })
    Object.defineProperty(control, 'clientHeight', { configurable: true, value: 48 })

    await wrapper.find('textarea').setValue('line one\nline two\nline three')
    await nextTick()

    expect(control.style.height).not.toBe('')
    expect(control.style.overflowY).toBe('auto')
    wrapper.unmount()
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Textarea, { modelValue: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('textarea').attributes()).toHaveProperty('disabled')
  })

  it('keeps readonly text immutable while supporting variants, id, and pressEnter', async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'Clear me',
        allowClear: true,
        variant: 'underlined',
        id: 'notes',
        readOnly: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-textarea--underlined')
    expect(wrapper.find('textarea').attributes('id')).toBe('notes')
    expect(wrapper.find('textarea').attributes()).toHaveProperty('readonly')

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)

    expect(wrapper.find('.aheart-textarea__clear').exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('clear')).toBeUndefined()
  })

  it('supports autoSize object minRows and maxRows', () => {
    const wrapper = mount(Textarea, {
      props: { autoSize: { minRows: 2, maxRows: 5 } }
    })

    expect(wrapper.classes()).toContain('is-autosize')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-min-rows: 2')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-max-rows: 5')
  })

  it('renders custom allowClear icon content', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'Clear me',
        allowClear: {
          clearIcon: 'clear'
        }
      }
    })

    expect(wrapper.find('.aheart-textarea__clear').text()).toBe('clear')
  })

  it('lets clearIcon slot override allowClear clearIcon', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'Clear me',
        allowClear: {
          clearIcon: 'clear'
        }
      },
      slots: {
        clearIcon: '<span class="custom-clear">x</span>'
      }
    })

    expect(wrapper.find('.custom-clear').exists()).toBe(true)
    expect(wrapper.find('.aheart-textarea__clear').text()).toBe('x')
  })

  it('renders showCount formatter output', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'abc',
        showCount: {
          formatter: ({ count, maxLength, value }: { count: number; maxLength?: number; value: string }) =>
            `${count}:${maxLength}:${value}`
        },
        maxlength: 8
      }
    })

    expect(wrapper.find('.aheart-textarea__count').text()).toBe('3:8:abc')
  })

  it('supports count max, strategy, and show formatter', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'hello',
        count: {
          max: 10,
          strategy: (value: string) => value.split('').filter((char) => char === 'l').length,
          show: ({ count, maxLength }: { count: number; maxLength?: number }) => `${count} of ${maxLength}`
        }
      }
    })

    expect(wrapper.find('.aheart-textarea__count').text()).toBe('2 of 10')
  })

  it('lets count show false hide count display', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'hidden',
        showCount: true,
        count: {
          show: false
        }
      }
    })

    expect(wrapper.find('.aheart-textarea__count').exists()).toBe(false)
  })

  it('renders vnode clear icon and showCount formatter', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'Aheart',
        allowClear: {
          clearIcon: h('span', { class: 'clear-node' }, 'clear')
        },
        showCount: {
          formatter: ({ count }: { count: number }) => h('span', { class: 'count-node' }, `${count} chars`)
        }
      }
    })

    expect(wrapper.find('.clear-node').text()).toBe('clear')
    expect(wrapper.find('.count-node').text()).toBe('6 chars')
  })

  it('renders vnode count show output', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'hello',
        count: {
          max: 10,
          show: ({ count, maxLength }: { count: number; maxLength?: number }) =>
            h('strong', { class: 'count-show-node' }, `${count}/${maxLength}`)
        }
      }
    })

    expect(wrapper.find('.count-show-node').text()).toBe('5/10')
  })

  it('supports disabled allowClear config', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'value',
        allowClear: {
          disabled: true,
          clearIcon: 'clear'
        }
      }
    })

    expect(wrapper.find('.aheart-textarea__clear').exists()).toBe(false)
  })

  it('uses count exceedFormatter for displayed and emitted values', async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'abcdef',
        count: {
          max: 3,
          exceedFormatter: (value: string, { max }: { max: number }) => value.slice(0, max)
        },
        showCount: true
      }
    })

    expect(wrapper.find('textarea').element.value).toBe('abc')
    expect(wrapper.find('.aheart-textarea__count').text()).toBe('3 / 3')

    await wrapper.find('textarea').setValue('12345')
    await wrapper.setProps({ modelValue: '123' })
    wrapper.find('textarea').element.value = '123'
    wrapper.find('textarea').element.dispatchEvent(new Event('change'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['123'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['123'])
  })

  it('applies root class and style hooks with autosize variables', () => {
    const wrapper = mount(Textarea, {
      props: {
        autoSize: { minRows: 2, maxRows: 5 },
        className: 'textarea-class',
        rootClassName: 'textarea-root',
        style: { width: '320px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '6px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('textarea-class')
    expect(wrapper.classes()).toContain('textarea-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 320px')
    expect(wrapper.attributes('style')).toContain('margin-top: 6px')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-min-rows: 2')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-max-rows: 5')
  })

  it('applies semantic class and style hooks to Textarea parts', () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'value',
        allowClear: true,
        showCount: true,
        classNames: {
          textarea: 'semantic-textarea',
          clear: 'semantic-clear',
          count: 'semantic-count'
        },
        styles: {
          textarea: { color: 'red' },
          clear: { color: 'purple' },
          count: { color: 'orange' }
        }
      }
    })

    expect(wrapper.find('textarea').classes()).toContain('semantic-textarea')
    expect(wrapper.find('textarea').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-textarea__clear').classes()).toContain('semantic-clear')
    expect(wrapper.find('.aheart-textarea__clear').attributes('style')).toContain('color: purple')
    expect(wrapper.find('.aheart-textarea__count').classes()).toContain('semantic-count')
    expect(wrapper.find('.aheart-textarea__count').attributes('style')).toContain('color: orange')
  })
})
