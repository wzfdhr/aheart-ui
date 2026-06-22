import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Descriptions from '../descriptions.vue'

const items = [
  { label: 'User', content: 'Ada' },
  { label: 'Role', content: 'Admin' },
  { label: 'Status', content: 'Active', span: 2 }
]

describe('Descriptions', () => {
  it('renders title, extra, items, and table semantics', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'Profile', extra: 'Updated', items }
    })

    expect(wrapper.classes()).toContain('aheart-descriptions')
    expect(wrapper.find('[role="table"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="row"]').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.text()).toContain('Updated')
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('Active')
  })

  it('applies bordered, vertical, column, and ConfigProvider size classes', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: {
          render() {
            return h(Descriptions, { items, bordered: true, layout: 'vertical', column: 2 })
          }
        }
      }
    })

    const descriptions = wrapper.findComponent(Descriptions)
    expect(descriptions.classes()).toContain('aheart-descriptions--large')
    expect(descriptions.classes()).toContain('is-bordered')
    expect(descriptions.classes()).toContain('aheart-descriptions--vertical')
    expect(descriptions.attributes('style')).toContain('--aheart-descriptions-column: 2')
  })

  it('applies root and semantic classes and styles', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 'Profile',
        extra: 'Updated',
        items: [{ label: 'User', content: 'Ada' }],
        column: 2,
        className: 'descriptions-class',
        rootClassName: 'descriptions-root',
        style: { marginTop: '4px' },
        labelStyle: { color: 'rgb(1, 2, 3)' },
        contentStyle: { fontWeight: 600 },
        classNames: {
          root: 'semantic-root',
          header: 'semantic-header',
          title: 'semantic-title',
          extra: 'semantic-extra',
          table: 'semantic-table',
          row: 'semantic-row',
          item: 'semantic-item',
          label: 'semantic-label',
          content: 'semantic-content'
        },
        styles: {
          root: { backgroundColor: 'rgb(250, 250, 250)' },
          header: { alignItems: 'flex-start' },
          title: { color: 'rgb(255, 0, 0)' },
          extra: { fontWeight: 600 },
          table: { gap: '12px' },
          row: { columnGap: '20px' },
          item: { backgroundColor: 'rgb(240, 240, 240)' },
          label: { textDecoration: 'underline' },
          content: { fontStyle: 'italic' }
        }
      }
    })

    expect(wrapper.classes()).toContain('descriptions-class')
    expect(wrapper.classes()).toContain('descriptions-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('--aheart-descriptions-column: 2')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('background-color: rgb(250, 250, 250)')

    const header = wrapper.find('.aheart-descriptions__header')
    expect(header.classes()).toContain('semantic-header')
    expect(header.attributes('style')).toContain('align-items: flex-start')

    const title = wrapper.find('.aheart-descriptions__title')
    expect(title.classes()).toContain('semantic-title')
    expect(title.attributes('style')).toContain('color: rgb(255, 0, 0)')

    const extra = wrapper.find('.aheart-descriptions__extra')
    expect(extra.classes()).toContain('semantic-extra')
    expect(extra.attributes('style')).toContain('font-weight: 600')

    const table = wrapper.find('.aheart-descriptions__table')
    expect(table.classes()).toContain('semantic-table')
    expect(table.attributes('style')).toContain('gap: 12px')

    const row = wrapper.find('.aheart-descriptions__row')
    expect(row.classes()).toContain('semantic-row')
    expect(row.attributes('style')).toContain('column-gap: 20px')

    const item = wrapper.find('.aheart-descriptions__item')
    expect(item.classes()).toContain('semantic-item')
    expect(item.attributes('style')).toContain('background-color: rgb(240, 240, 240)')

    const label = wrapper.find('.aheart-descriptions__label')
    expect(label.classes()).toContain('semantic-label')
    expect(label.classes()).toContain('has-colon')
    expect(label.attributes('style')).toContain('color: rgb(1, 2, 3)')
    expect(label.attributes('style')).toContain('text-decoration: underline')

    const content = wrapper.find('.aheart-descriptions__content')
    expect(content.classes()).toContain('semantic-content')
    expect(content.attributes('style')).toContain('font-weight: 600')
    expect(content.attributes('style')).toContain('font-style: italic')
  })

  it('supports item metadata filled span children content and colon control', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        colon: false,
        items: [
          { label: 'User', content: 'Ada' },
          {
            key: 'summary',
            label: 'Summary',
            children: 'Fills the rest',
            span: 'filled',
            className: 'summary-item',
            style: { backgroundColor: 'rgb(245, 245, 245)' },
            labelStyle: { color: 'blue' },
            contentStyle: { fontWeight: 600 }
          }
        ]
      }
    })

    const summary = wrapper.find('.summary-item')
    expect(summary.exists()).toBe(true)
    expect(summary.text()).toContain('Fills the rest')
    expect(summary.attributes('style')).toContain('--aheart-descriptions-item-span: 2')
    expect(summary.attributes('style')).toContain('background-color: rgb(245, 245, 245)')

    const labels = wrapper.findAll('.aheart-descriptions__label')
    expect(labels[0].classes()).not.toContain('has-colon')

    const summaryLabel = summary.find('.aheart-descriptions__label')
    expect(summaryLabel.attributes('style')).toContain('color: blue')

    const summaryContent = summary.find('.aheart-descriptions__content')
    expect(summaryContent.attributes('style')).toContain('font-weight: 600')
  })

  it('renders VNode title extra label and item content', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: h('strong', { class: 'title-node' }, 'Profile node'),
        extra: h('button', { class: 'extra-node' }, 'Refresh'),
        items: [
          {
            label: h('span', { class: 'label-node' }, 'Owner'),
            content: h('em', { class: 'content-node' }, 'Design System')
          }
        ]
      }
    })

    expect(wrapper.find('.title-node').text()).toBe('Profile node')
    expect(wrapper.find('.extra-node').text()).toBe('Refresh')
    expect(wrapper.find('.label-node').text()).toBe('Owner')
    expect(wrapper.find('.content-node').text()).toBe('Design System')
  })

  it('lets title and extra slots override renderable props', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: h('span', { class: 'prop-title' }, 'Prop title'),
        extra: h('span', { class: 'prop-extra' }, 'Prop extra'),
        items: [{ label: 'User', content: 'Ada' }]
      },
      slots: {
        title: '<span class="slot-title">Slot title</span>',
        extra: '<button class="slot-extra">Slot extra</button>'
      }
    })

    expect(wrapper.find('.slot-title').text()).toBe('Slot title')
    expect(wrapper.find('.slot-extra').text()).toBe('Slot extra')
    expect(wrapper.find('.prop-title').exists()).toBe(false)
    expect(wrapper.find('.prop-extra').exists()).toBe(false)
  })

  it('prefers content over children when both are renderable', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [
          {
            label: 'Priority',
            content: h('span', { class: 'content-value' }, 'Content wins'),
            children: h('span', { class: 'children-value' }, 'Children fallback')
          }
        ]
      }
    })

    expect(wrapper.find('.content-value').text()).toBe('Content wins')
    expect(wrapper.find('.children-value').exists()).toBe(false)
  })
})
