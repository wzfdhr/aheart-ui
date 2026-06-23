import { mount } from '@vue/test-utils'
import { createApp, h } from 'vue'
import { describe, expect, it } from 'vitest'
import AheartUI, { CardGrid as RootCardGrid } from '../../index'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Card, { CardGrid, CardMeta } from '../index'

describe('Card', () => {
  it('renders title, extra, default content, cover, and actions', () => {
    const wrapper = mount(Card, {
      props: { title: 'Project', extra: 'More' },
      slots: {
        cover: '<div class="cover">Cover</div>',
        default: '<p>Card body</p>',
        actions: '<button>Open</button>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card')
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.text()).toContain('Project')
    expect(wrapper.text()).toContain('More')
    expect(wrapper.find('.cover').exists()).toBe(true)
    expect(wrapper.text()).toContain('Card body')
    expect(wrapper.find('.aheart-card__actions button').text()).toBe('Open')
  })

  it('renders loading and variant classes with ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: {
        default: {
          render() {
            return h(Card, { loading: true, bordered: false, hoverable: true }, () => 'Hidden')
          }
        }
      }
    })

    const card = wrapper.findComponent(Card)
    expect(card.classes()).toContain('aheart-card--small')
    expect(card.classes()).toContain('is-borderless')
    expect(card.classes()).toContain('is-hoverable')
    expect(card.find('.aheart-card__loading').exists()).toBe(true)
    expect(card.text()).not.toContain('Hidden')
  })

  it('supports variant control and inner card type', () => {
    const borderless = mount(Card, {
      props: {
        variant: 'borderless'
      }
    })

    expect(borderless.classes()).toContain('is-borderless')

    const outlined = mount(Card, {
      props: {
        variant: 'outlined',
        bordered: false,
        type: 'inner'
      }
    })

    expect(outlined.classes()).not.toContain('is-borderless')
    expect(outlined.classes()).toContain('aheart-card--inner')
  })

  it('renders actions prop when no actions slot is provided', () => {
    const wrapper = mount(Card, {
      props: {
        actions: ['Edit', 'Delete']
      }
    })

    const actions = wrapper.findAll('.aheart-card__action')
    expect(actions).toHaveLength(2)
    expect(actions[0].text()).toBe('Edit')
    expect(actions[1].text()).toBe('Delete')
  })

  it('renders vnode title extra and actions props', () => {
    const wrapper = mount(Card, {
      props: {
        title: h('span', { class: 'card-title-node' }, 'Node title'),
        extra: h('a', { class: 'card-extra-node' }, 'More'),
        actions: [h('button', { class: 'card-action-node' }, 'Open')]
      },
      slots: {
        default: 'Body'
      }
    })

    expect(wrapper.find('.card-title-node').text()).toBe('Node title')
    expect(wrapper.find('.card-extra-node').text()).toBe('More')
    expect(wrapper.find('.card-action-node').text()).toBe('Open')
  })

  it('renders numeric zero title and extra as header content', () => {
    const wrapper = mount(Card, {
      props: {
        title: 0,
        extra: 0
      }
    })

    expect(wrapper.find('.aheart-card__header').exists()).toBe(true)
    expect(wrapper.find('.aheart-card__title').text()).toBe('0')
    expect(wrapper.find('.aheart-card__extra').text()).toBe('0')
  })

  it('lets title extra and actions slots override renderable prop fallbacks', () => {
    const wrapper = mount(Card, {
      props: {
        title: h('span', { class: 'prop-title-node' }, 'Prop title'),
        extra: h('span', { class: 'prop-extra-node' }, 'Prop extra'),
        actions: [h('button', { class: 'prop-action-node' }, 'Prop action')]
      },
      slots: {
        title: '<span class="slot-title-node">Slot title</span>',
        extra: '<span class="slot-extra-node">Slot extra</span>',
        actions: '<button class="slot-action-node">Slot action</button>'
      }
    })

    expect(wrapper.find('.slot-title-node').text()).toBe('Slot title')
    expect(wrapper.find('.slot-extra-node').text()).toBe('Slot extra')
    expect(wrapper.find('.slot-action-node').text()).toBe('Slot action')
    expect(wrapper.find('.prop-title-node').exists()).toBe(false)
    expect(wrapper.find('.prop-extra-node').exists()).toBe(false)
    expect(wrapper.find('.prop-action-node').exists()).toBe(false)
  })

  it('does not render header for empty string title and extra props', () => {
    const wrapper = mount(Card, {
      props: {
        title: '',
        extra: ''
      }
    })

    expect(wrapper.find('.aheart-card__header').exists()).toBe(false)
  })

  it('lets actions slot override actions prop', () => {
    const wrapper = mount(Card, {
      props: {
        actions: ['Edit']
      },
      slots: {
        actions: '<button class="slot-action">Open</button>'
      }
    })

    expect(wrapper.find('.slot-action').exists()).toBe(true)
    expect(wrapper.findAll('.aheart-card__action')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Edit')
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(Card, {
      props: {
        className: 'card-class',
        rootClassName: 'card-root',
        style: { width: '240px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '8px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('card-class')
    expect(wrapper.classes()).toContain('card-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.attributes('style')).toContain('margin-top: 8px')
  })

  it('applies semantic class and style hooks to Card parts', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        extra: 'More',
        actions: ['Open'],
        classNames: {
          cover: 'semantic-cover',
          header: 'semantic-header',
          title: 'semantic-title',
          extra: 'semantic-extra',
          body: 'semantic-body',
          actions: 'semantic-actions'
        },
        styles: {
          cover: { background: 'rgb(1, 2, 3)' },
          header: { minHeight: '40px' },
          title: { color: 'red' },
          extra: { color: 'blue' },
          body: { padding: '12px' },
          actions: { gap: '12px' }
        }
      },
      slots: {
        cover: '<div>Cover</div>',
        default: 'Body'
      }
    })

    expect(wrapper.find('.aheart-card__cover').classes()).toContain('semantic-cover')
    expect(wrapper.find('.aheart-card__cover').attributes('style')).toContain('background: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-card__header').classes()).toContain('semantic-header')
    expect(wrapper.find('.aheart-card__header').attributes('style')).toContain('min-height: 40px')
    expect(wrapper.find('.aheart-card__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-card__title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-card__extra').classes()).toContain('semantic-extra')
    expect(wrapper.find('.aheart-card__extra').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-card__body').classes()).toContain('semantic-body')
    expect(wrapper.find('.aheart-card__body').attributes('style')).toContain('padding: 12px')
    expect(wrapper.find('.aheart-card__actions').classes()).toContain('semantic-actions')
    expect(wrapper.find('.aheart-card__actions').attributes('style')).toContain('gap: 12px')
  })

  it('maps headStyle and bodyStyle to header and body styles', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        headStyle: { background: 'rgb(10, 20, 30)' },
        bodyStyle: { minHeight: '80px' }
      }
    })

    expect(wrapper.find('.aheart-card__header').attributes('style')).toContain('background: rgb(10, 20, 30)')
    expect(wrapper.find('.aheart-card__body').attributes('style')).toContain('min-height: 80px')
  })

  it('renders tab list with first enabled tab and keyed slot content', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Tabbed',
        tabList: [
          { key: 'disabled', tab: 'Disabled', disabled: true },
          { key: 'overview', tab: 'Overview' },
          { key: 'settings', tab: 'Settings' }
        ]
      },
      slots: {
        default: 'Default content',
        'tab-overview': '<span class="overview-panel">Overview panel</span>',
        'tab-settings': '<span class="settings-panel">Settings panel</span>'
      }
    })

    expect(wrapper.find('.aheart-card__tabs').exists()).toBe(true)
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
    expect(wrapper.find('.overview-panel').text()).toBe('Overview panel')
    expect(wrapper.text()).not.toContain('Default content')
  })

  it('supports default active tab and emits tab changes when uncontrolled', async () => {
    const wrapper = mount(Card, {
      props: {
        tabList: [
          { key: 'overview', tab: 'Overview' },
          { key: 'settings', tab: 'Settings' }
        ],
        defaultActiveTabKey: 'settings'
      },
      slots: {
        'tab-overview': 'Overview panel',
        'tab-settings': 'Settings panel'
      }
    })

    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Settings')

    await wrapper.findAll('[role="tab"]')[0].trigger('click')

    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
    expect(wrapper.emitted('update:activeTabKey')?.[0]).toEqual(['overview'])
    expect(wrapper.emitted('tabChange')?.[0]).toEqual(['overview'])
  })

  it('keeps controlled active tab visual state after tab clicks', async () => {
    const wrapper = mount(Card, {
      props: {
        activeTabKey: 'overview',
        tabList: [
          { key: 'overview', tab: 'Overview' },
          { key: 'settings', tab: 'Settings' }
        ]
      },
      slots: {
        'tab-overview': 'Overview panel',
        'tab-settings': 'Settings panel'
      }
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
    expect(wrapper.emitted('update:activeTabKey')?.[0]).toEqual(['settings'])
    expect(wrapper.emitted('tabChange')?.[0]).toEqual(['settings'])
  })

  it('does not emit tab changes for disabled or active tabs', async () => {
    const wrapper = mount(Card, {
      props: {
        defaultActiveTabKey: 'overview',
        tabList: [
          { key: 'overview', tab: 'Overview' },
          { key: 'disabled', tab: 'Disabled', disabled: true }
        ]
      }
    })

    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.emitted('update:activeTabKey')).toBeUndefined()
    expect(wrapper.emitted('tabChange')).toBeUndefined()
  })

  it('renders tab item children, tab extra content, and tabProps hooks', async () => {
    const wrapper = mount(Card, {
      props: {
        tabBarExtraContent: 'Extra',
        tabProps: {
          className: 'tabs-class',
          rootClassName: 'tabs-root',
          style: { marginTop: '4px' },
          tabBarGutter: 20,
          classNames: {
            root: 'semantic-tabs',
            list: 'semantic-list',
            tab: 'semantic-tab',
            activeTab: 'semantic-active-tab',
            tabLabel: 'semantic-label',
            extra: 'semantic-extra'
          },
          styles: {
            root: { backgroundColor: 'rgb(250, 250, 250)' },
            list: { paddingInlineStart: '2px' },
            tab: { minWidth: '64px' },
            activeTab: { fontWeight: 700 },
            tabLabel: { color: 'red' },
            extra: { color: 'blue' }
          }
        },
        tabList: [
          { key: 'overview', tab: 'Overview', children: 'Overview children' },
          { key: 'settings', tab: 'Settings', children: 'Settings children' }
        ]
      },
      slots: {
        default: 'Default fallback'
      }
    })

    expect(wrapper.text()).toContain('Overview children')
    expect(wrapper.find('.aheart-card__tabs').classes()).toEqual(
      expect.arrayContaining(['tabs-class', 'tabs-root', 'semantic-tabs'])
    )
    expect(wrapper.find('.aheart-card__tabs').attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-card__tabs').attributes('style')).toContain('background-color: rgb(250, 250, 250)')
    expect(wrapper.find('.aheart-card__tab-list').attributes('style')).toContain('--aheart-card-tab-gutter: 20px')
    expect(wrapper.find('.aheart-card__tab-list').classes()).toContain('semantic-list')
    expect(wrapper.find('.aheart-card__tab').classes()).toContain('semantic-tab')
    expect(wrapper.find('.aheart-card__tab.is-active').classes()).toContain('semantic-active-tab')
    expect(wrapper.find('.aheart-card__tab-label').classes()).toContain('semantic-label')
    expect(wrapper.find('.aheart-card__tab-extra').classes()).toContain('semantic-extra')
    expect(wrapper.find('.aheart-card__tab-extra').text()).toBe('Extra')

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.text()).toContain('Settings children')
  })

  it('lets tabBarExtraContent slot override the prop and falls back to default slot', () => {
    const wrapper = mount(Card, {
      props: {
        tabBarExtraContent: 'Prop extra',
        tabList: [
          { key: 'overview', tab: 'Overview' }
        ]
      },
      slots: {
        default: '<span class="fallback-panel">Fallback panel</span>',
        tabBarExtraContent: '<button class="extra-slot">Action</button>'
      }
    })

    expect(wrapper.find('.extra-slot').exists()).toBe(true)
    expect(wrapper.find('.aheart-card__tab-extra').text()).toBe('Action')
    expect(wrapper.text()).not.toContain('Prop extra')
    expect(wrapper.find('.fallback-panel').text()).toBe('Fallback panel')
  })

  it('renders CardMeta avatar, title, and description props', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: h('span', { class: 'avatar-node' }, 'A'),
        title: 'Meta title',
        description: 'Meta description'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card-meta')
    expect(wrapper.find('.aheart-card-meta__avatar .avatar-node').text()).toBe('A')
    expect(wrapper.find('.aheart-card-meta__title').text()).toBe('Meta title')
    expect(wrapper.find('.aheart-card-meta__description').text()).toBe('Meta description')
  })

  it('lets CardMeta slots override renderable props', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: 'prop avatar',
        title: 'prop title',
        description: 'prop description'
      },
      slots: {
        avatar: '<span class="slot-avatar">slot avatar</span>',
        title: '<strong class="slot-title">slot title</strong>',
        description: '<em class="slot-description">slot description</em>'
      }
    })

    expect(wrapper.find('.slot-avatar').text()).toBe('slot avatar')
    expect(wrapper.find('.slot-title').text()).toBe('slot title')
    expect(wrapper.find('.slot-description').text()).toBe('slot description')
    expect(wrapper.text()).not.toContain('prop title')
    expect(wrapper.text()).not.toContain('prop description')
  })

  it('applies CardMeta semantic classes and styles', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: 'A',
        title: 'Title',
        description: 'Description',
        className: 'meta-class',
        rootClassName: 'meta-root',
        style: { width: '180px' },
        classNames: {
          root: 'semantic-root',
          section: 'semantic-section',
          avatar: 'semantic-avatar',
          title: 'semantic-title',
          description: 'semantic-description'
        },
        styles: {
          root: { marginTop: '4px' },
          section: { gap: '2px' },
          avatar: { color: 'red' },
          title: { color: 'blue' },
          description: { color: 'green' }
        }
      }
    })

    expect(wrapper.classes()).toContain('meta-class')
    expect(wrapper.classes()).toContain('meta-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 180px')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-card-meta__section').classes()).toContain('semantic-section')
    expect(wrapper.find('.aheart-card-meta__section').attributes('style')).toContain('gap: 2px')
    expect(wrapper.find('.aheart-card-meta__avatar').classes()).toContain('semantic-avatar')
    expect(wrapper.find('.aheart-card-meta__avatar').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-card-meta__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-card-meta__title').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-card-meta__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-card-meta__description').attributes('style')).toContain('color: green')
  })

  it('renders CardGrid slot content with hoverable default', () => {
    const wrapper = mount(CardGrid, {
      slots: {
        default: '<span class="grid-content">Tile</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card-grid')
    expect(wrapper.classes()).toContain('is-hoverable')
    expect(wrapper.find('.aheart-card-grid__content .grid-content').text()).toBe('Tile')
  })

  it('supports non-hoverable CardGrid and semantic hooks', () => {
    const wrapper = mount(CardGrid, {
      props: {
        hoverable: false,
        className: 'grid-class',
        rootClassName: 'grid-root',
        style: { width: '50%' },
        classNames: {
          root: 'semantic-root',
          content: 'semantic-content'
        },
        styles: {
          root: { padding: '20px' },
          content: { color: 'red' }
        }
      },
      slots: {
        default: 'Tile'
      }
    })

    expect(wrapper.classes()).not.toContain('is-hoverable')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['grid-class', 'grid-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('width: 50%')
    expect(wrapper.attributes('style')).toContain('padding: 20px')
    expect(wrapper.find('.aheart-card-grid__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-card-grid__content').attributes('style')).toContain('color: red')
  })

  it('exposes Card.Grid for Ant-style composition', () => {
    expect(CardGrid).toBeDefined()
    expect(Card.Grid).toBeDefined()
    expect(Card.Grid).toBe(CardGrid)
  })

  it('installs CardGrid from the root plugin', () => {
    const app = createApp({})

    app.use(AheartUI)

    expect(RootCardGrid).toBe(CardGrid)
    expect(app.component('ACardGrid')).toBeTruthy()
  })

  it('exposes Card.Meta for Ant-style composition', () => {
    expect(CardMeta).toBeDefined()
    expect(Card.Meta).toBeDefined()
    expect(Card.Meta).toBe(CardMeta)
  })
})
