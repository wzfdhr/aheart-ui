import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { enUS } from '../../config'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Empty from '../empty.vue'
import EmptyInstall from '../index'

describe('Empty', () => {
  it('renders default description', () => {
    const wrapper = mount(Empty)

    expect(wrapper.classes()).toContain('aheart-empty')
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('uses description prop before locale', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'Nothing here'
      }
    })

    expect(wrapper.text()).toContain('Nothing here')
  })

  it('renders vnode description and image props', () => {
    const wrapper = mount(Empty, {
      props: {
        description: h('span', { class: 'description-node' }, 'Node description'),
        image: h('span', { class: 'image-node' }, 'Node image')
      }
    })

    expect(wrapper.find('.description-node').text()).toBe('Node description')
    expect(wrapper.find('.image-node').text()).toBe('Node image')
    expect(wrapper.find('.aheart-empty__image img').exists()).toBe(false)
  })

  it('uses ConfigProvider empty locale fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: {
          render() {
            return h(Empty)
          }
        }
      }
    })

    expect(wrapper.text()).toContain('暂无内容')
  })

  it('uses the enUS locale pack when provided', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(Empty)
      }
    })

    expect(wrapper.text()).toContain('No Data')
  })

  it('renders image and default action slots', () => {
    const wrapper = mount(Empty, {
      slots: {
        image: '<span class="custom-image">image</span>',
        default: '<button>Create</button>'
      }
    })

    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create')
  })

  it('renders custom image url from image prop', () => {
    const wrapper = mount(Empty, {
      props: {
        image: '/empty-state.svg',
        description: 'No records'
      }
    })

    const image = wrapper.find('.aheart-empty__image img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('/empty-state.svg')
    expect(image.attributes('alt')).toBe('')
  })

  it('exposes and renders built-in image presets', () => {
    const emptyWithPresets = EmptyInstall as typeof EmptyInstall & {
      PRESENTED_IMAGE_DEFAULT?: unknown
      PRESENTED_IMAGE_SIMPLE?: unknown
    }

    expect(emptyWithPresets.PRESENTED_IMAGE_DEFAULT).toBeTruthy()
    expect(emptyWithPresets.PRESENTED_IMAGE_SIMPLE).toBeTruthy()

    const defaultWrapper = mount(Empty, {
      props: {
        image: emptyWithPresets.PRESENTED_IMAGE_DEFAULT,
        description: 'Default preset'
      }
    })
    expect(defaultWrapper.find('.aheart-empty__default-image').exists()).toBe(true)

    const simpleWrapper = mount(Empty, {
      props: {
        image: emptyWithPresets.PRESENTED_IMAGE_SIMPLE,
        description: 'Simple preset'
      }
    })
    expect(simpleWrapper.find('.aheart-empty__simple-image').exists()).toBe(true)
  })

  it('hides image area when image is false', () => {
    const wrapper = mount(Empty, {
      props: {
        image: false,
        description: 'No image'
      }
    })

    expect(wrapper.find('.aheart-empty__image').exists()).toBe(false)
    expect(wrapper.text()).toContain('No image')
  })

  it('hides description when description is false', () => {
    const wrapper = mount(Empty, {
      props: {
        description: false
      }
    })

    expect(wrapper.find('.aheart-empty__description').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('No Data')
  })

  it('uses description slot before locale fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: {
          render() {
            return h(Empty, null, {
              description: () => h('span', { class: 'custom-description' }, 'Slot description')
            })
          }
        }
      }
    })

    expect(wrapper.find('.custom-description').text()).toBe('Slot description')
    expect(wrapper.text()).not.toContain('暂无内容')
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'Styled empty',
        className: 'legacy-empty-class',
        rootClassName: 'root-empty-class',
        style: { marginBlockStart: '12px' },
        classNames: {
          root: 'semantic-empty-root'
        },
        styles: {
          root: { padding: '20px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('legacy-empty-class')
    expect(wrapper.classes()).toContain('root-empty-class')
    expect(wrapper.classes()).toContain('semantic-empty-root')
    expect(wrapper.attributes('style')).toContain('margin-block-start: 12px')
    expect(wrapper.attributes('style')).toContain('padding: 20px')
  })

  it('applies semantic image description and footer hooks', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'Semantic empty',
        imageStyle: { width: '80px' },
        classNames: {
          image: 'semantic-image',
          description: 'semantic-description',
          footer: 'semantic-footer'
        },
        styles: {
          image: { color: 'rgb(22, 119, 255)' },
          description: { color: 'rgb(0, 0, 0)' },
          footer: { marginTop: '16px' }
        }
      },
      slots: {
        default: '<button>Reload</button>'
      }
    })

    expect(wrapper.find('.aheart-empty__image').classes()).toContain('semantic-image')
    expect(wrapper.find('.aheart-empty__image').attributes('style')).toContain('width: 80px')
    expect(wrapper.find('.aheart-empty__image').attributes('style')).toContain('color: rgb(22, 119, 255)')
    expect(wrapper.find('.aheart-empty__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-empty__description').attributes('style')).toContain('color: rgb(0, 0, 0)')
    expect(wrapper.find('.aheart-empty__footer').classes()).toContain('semantic-footer')
    expect(wrapper.find('.aheart-empty__footer').attributes('style')).toContain('margin-top: 16px')
  })
})
