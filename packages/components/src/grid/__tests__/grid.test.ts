import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { describe, expect, it } from 'vitest'
import Grid, { Col, Row } from '../index'

describe('Grid', () => {
  it('renders Row classes with justify, align, and wrap', () => {
    const wrapper = mount(Row, {
      props: { justify: 'center', align: 'middle', wrap: false },
      slots: { default: '<div>content</div>' }
    })

    expect(wrapper.classes()).toContain('aheart-row')
    expect(wrapper.classes()).toContain('aheart-row--justify-center')
    expect(wrapper.classes()).toContain('aheart-row--align-middle')
    expect(wrapper.classes()).toContain('is-nowrap')
    expect(wrapper.text()).toContain('content')
  })

  it('normalizes numeric and tuple gutters into CSS variables', () => {
    const wrapper = mount(Row, {
      props: { gutter: [16, 24] }
    })

    expect(wrapper.attributes('style')).toContain('--aheart-row-gutter-horizontal: 16px')
    expect(wrapper.attributes('style')).toContain('--aheart-row-gutter-vertical: 24px')
  })

  it('renders Col span and layout classes', () => {
    const wrapper = mount(Col, {
      props: { span: 8, offset: 4, order: 2, push: 1, pull: 3 },
      slots: { default: 'column' }
    })

    expect(wrapper.classes()).toContain('aheart-col')
    expect(wrapper.classes()).toContain('aheart-col-8')
    expect(wrapper.classes()).toContain('aheart-col-offset-4')
    expect(wrapper.classes()).toContain('aheart-col-order-2')
    expect(wrapper.classes()).toContain('aheart-col-push-1')
    expect(wrapper.classes()).toContain('aheart-col-pull-3')
    expect(wrapper.text()).toBe('column')
  })

  it('renders numeric and string flex styles', () => {
    const numeric = mount(Col, { props: { flex: 160 } })
    const string = mount(Col, { props: { flex: 'auto' } })

    expect(numeric.attributes('style')).toContain('--aheart-col-flex: 0 0 160px')
    expect(string.attributes('style')).toContain('--aheart-col-flex: auto')
  })

  it('renders responsive classes and variables', () => {
    const wrapper = mount(Col, {
      props: {
        xs: 24,
        md: { span: 12, offset: 6 },
        xl: { span: 8, order: 3, flex: '1 1 0' }
      }
    })

    expect(wrapper.classes()).toContain('aheart-col-xs')
    expect(wrapper.classes()).toContain('aheart-col-md')
    expect(wrapper.classes()).toContain('aheart-col-xl')
    expect(wrapper.attributes('style')).toContain('--aheart-col-xs-span: 24')
    expect(wrapper.attributes('style')).toContain('--aheart-col-md-offset: 6')
    expect(wrapper.attributes('style')).toContain('--aheart-col-xl-flex: 1 1 0')
  })

  it('installs Row and Col from Grid plugin', () => {
    const app = createApp({})

    app.use(Grid)

    expect(app.component('ARow')).toBeTruthy()
    expect(app.component('ACol')).toBeTruthy()
  })
})
