import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Button from '../button.vue'

describe('Button', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '保存'
      }
    })

    expect(wrapper.text()).toContain('保 存')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        size: 'large'
      }
    })

    expect(wrapper.classes()).toContain('aheart-button--primary')
    expect(wrapper.classes()).toContain('aheart-button--large')
  })

  it('disables native button while loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
  })

  it('uses global size and disabled config when local props are absent', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: Button
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--large')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('lets local Button props override global config', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true
      },
      slots: {
        default: {
          render() {
            return h(Button, { size: 'small', disabled: false }, () => '保存')
          }
        }
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('aheart-button--small')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('supports Ant-style visual props and shapes', () => {
    const dashed = mount(Button, {
      props: { type: 'dashed', danger: true, ghost: true, shape: 'round' },
      slots: { default: 'Delete' }
    })

    expect(dashed.classes()).toContain('aheart-button--dashed')
    expect(dashed.classes()).toContain('is-danger')
    expect(dashed.classes()).toContain('is-ghost')
    expect(dashed.classes()).toContain('is-round')

    const circle = mount(Button, {
      props: { shape: 'circle' },
      slots: { default: 'i' }
    })

    expect(circle.classes()).toContain('is-circle')
  })

  it('renders anchor buttons from href and suppresses disabled clicks', async () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank', disabled: true },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('target')).toBe('_blank')

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('uses htmlType over nativeType for native buttons', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'button', htmlType: 'submit' }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders icon prop before content by default', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'plus'
      },
      slots: {
        default: 'Create'
      }
    })

    const children = Array.from(wrapper.element.children)
    expect(children[0].classList.contains('aheart-button__icon')).toBe(true)
    expect(children[1].classList.contains('aheart-button__content')).toBe(true)
    expect(wrapper.find('.aheart-icon').text()).toBe('plus')
  })

  it('renders vnode icon prop content', () => {
    const wrapper = mount(Button, {
      props: {
        icon: h('span', { class: 'icon-node' }, 'node')
      },
      slots: {
        default: 'Create'
      }
    })

    expect(wrapper.find('.icon-node').text()).toBe('node')
    expect(wrapper.find('.aheart-icon').exists()).toBe(false)
  })

  it('renders numeric zero icon prop content', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 0
      },
      slots: {
        default: 'Count'
      }
    })

    expect(wrapper.find('.aheart-button__icon').text()).toBe('0')
  })

  it('uses the icon slot before the icon prop', () => {
    const wrapper = mount(Button, {
      props: {
        icon: h('span', { class: 'prop-icon-node' }, 'prop')
      },
      slots: {
        icon: '<span class="custom-icon">custom</span>',
        default: 'Create'
      }
    })

    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.aheart-icon').exists()).toBe(false)
    expect(wrapper.find('.prop-icon-node').exists()).toBe(false)
  })

  it('renders icon after content when iconPlacement is end', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow',
        iconPlacement: 'end'
      },
      slots: {
        default: 'Next'
      }
    })

    const children = Array.from(wrapper.element.children)
    expect(children[0].classList.contains('aheart-button__content')).toBe(true)
    expect(children[1].classList.contains('aheart-button__icon')).toBe(true)
  })

  it('supports iconPosition as an icon placement alias', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow',
        iconPosition: 'end'
      },
      slots: {
        default: 'Next'
      }
    })

    const children = Array.from(wrapper.element.children)
    expect(children[0].classList.contains('aheart-button__content')).toBe(true)
    expect(children[1].classList.contains('aheart-button__icon')).toBe(true)
  })

  it('defers loading indicator and disabled state when loading has delay', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Button, {
      props: {
        loading: {
          delay: 120
        }
      },
      slots: {
        default: 'Save'
      }
    })

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(false)
    expect(wrapper.attributes('disabled')).toBeUndefined()

    await vi.advanceTimersByTimeAsync(119)
    await nextTick()

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(false)
    expect(wrapper.attributes('disabled')).toBeUndefined()

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders a custom loading icon slot', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        loadingIcon: '<span class="custom-loading">wait</span>',
        default: 'Save'
      }
    })

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
    expect(wrapper.find('.aheart-button__loading-spinner').exists()).toBe(false)
  })

  it('auto inserts a space between exactly two Chinese characters by default', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '保存'
      }
    })

    expect(wrapper.find('.aheart-button__content').text()).toBe('保 存')
  })

  it('can disable Chinese character auto spacing', () => {
    const wrapper = mount(Button, {
      props: {
        autoInsertSpace: false
      },
      slots: {
        default: '保存'
      }
    })

    expect(wrapper.find('.aheart-button__content').text()).toBe('保存')
  })

  it('does not auto space non-Chinese or longer text content', () => {
    const english = mount(Button, {
      slots: {
        default: 'OK'
      }
    })
    const longerChinese = mount(Button, {
      slots: {
        default: '默认按钮'
      }
    })

    expect(english.find('.aheart-button__content').text()).toBe('OK')
    expect(longerChinese.find('.aheart-button__content').text()).toBe('默认按钮')
  })

  it('applies root, icon, and content semantic hooks', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'setting',
        className: 'button-class',
        rootClassName: 'button-root',
        style: { width: '120px' },
        classNames: {
          root: 'semantic-root',
          icon: 'semantic-icon',
          content: 'semantic-content'
        },
        styles: {
          root: { marginTop: '4px' },
          icon: { color: 'red' },
          content: { fontWeight: '600' }
        }
      },
      slots: {
        default: 'Settings'
      }
    })

    expect(wrapper.classes()).toContain('button-class')
    expect(wrapper.classes()).toContain('button-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 120px')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-button__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-button__icon').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-button__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-button__content').attributes('style')).toContain('font-weight: 600')
  })

  it('resolves explicit color and variant classes over type sugar', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        color: 'danger',
        variant: 'filled'
      },
      slots: {
        default: 'Delete'
      }
    })

    expect(wrapper.classes()).toContain('aheart-button--primary')
    expect(wrapper.classes()).toContain('aheart-button--color-danger')
    expect(wrapper.classes()).toContain('aheart-button--variant-filled')
    expect(wrapper.classes()).not.toContain('aheart-button--color-primary')
    expect(wrapper.attributes('style')).toContain('--aheart-button-color: var(--aheart-color-danger)')
  })

  it('maps type and danger to Ant-style color and variant classes', () => {
    const primary = mount(Button, {
      props: {
        type: 'primary'
      }
    })
    const dashedDanger = mount(Button, {
      props: {
        type: 'dashed',
        danger: true
      }
    })

    expect(primary.classes()).toContain('aheart-button--color-primary')
    expect(primary.classes()).toContain('aheart-button--variant-solid')
    expect(dashedDanger.classes()).toContain('aheart-button--color-danger')
    expect(dashedDanger.classes()).toContain('aheart-button--variant-dashed')
  })

  it('renders loading.icon from object loading after delay', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Button, {
      props: {
        loading: {
          delay: 50,
          icon: h('span', { class: 'object-loading-icon' }, 'loading')
        }
      },
      slots: {
        default: 'Save'
      }
    })

    expect(wrapper.find('.object-loading-icon').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(50)
    await nextTick()

    expect(wrapper.find('.aheart-button__loading').exists()).toBe(true)
    expect(wrapper.find('.object-loading-icon').text()).toBe('loading')
    expect(wrapper.find('.aheart-button__loading-spinner').exists()).toBe(false)
  })

  it('keeps the loadingIcon slot higher priority than loading.icon', () => {
    const wrapper = mount(Button, {
      props: {
        loading: {
          icon: h('span', { class: 'object-loading-icon' }, 'object')
        }
      },
      slots: {
        loadingIcon: '<span class="slot-loading-icon">slot</span>',
        default: 'Save'
      }
    })

    expect(wrapper.find('.slot-loading-icon').text()).toBe('slot')
    expect(wrapper.find('.object-loading-icon').exists()).toBe(false)
  })
})
