import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from '../tag.vue'

describe('Tag', () => {
  it('renders slot content with color class', () => {
    const wrapper = mount(Tag, {
      props: {
        color: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.classes()).toContain('aheart-tag')
    expect(wrapper.classes()).toContain('aheart-tag--success')
    expect(wrapper.text()).toContain('Active')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true
      },
      slots: {
        default: 'Closable'
      }
    })

    await wrapper.find('.aheart-tag__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
