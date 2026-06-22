export type ComponentStatus = 'Ready' | 'Planned'

export interface ComponentMeta {
  name: string
  description: string
  status: ComponentStatus
  link?: string
}

export interface ComponentCategory {
  name: string
  description: string
  components: ComponentMeta[]
}

export const componentCategories: ComponentCategory[] = [
  {
    name: 'General',
    description: 'Basic building blocks used across product interfaces.',
    components: [
      { name: 'Button', description: 'Trigger an action.', status: 'Ready', link: '/components/button' },
      {
        name: 'ConfigProvider',
        description: 'Configure global theme, size, locale, and disabled state.',
        status: 'Ready',
        link: '/components/config-provider'
      },
      { name: 'Icon', description: 'Display semantic symbols.', status: 'Ready', link: '/components/icon' },
      { name: 'Typography', description: 'Text, title, and link styles.', status: 'Ready', link: '/components/typography' }
    ]
  },
  {
    name: 'Layout',
    description: 'Tools for spacing and page structure.',
    components: [
      { name: 'Space', description: 'Set consistent inline spacing.', status: 'Ready', link: '/components/space' },
      { name: 'Divider', description: 'Separate content groups.', status: 'Ready', link: '/components/divider' },
      { name: 'Flex', description: 'Compose flexible layouts.', status: 'Ready', link: '/components/flex' },
      { name: 'Grid', description: 'Build responsive grids.', status: 'Planned' }
    ]
  },
  {
    name: 'Navigation',
    description: 'Move between pages, views, and steps.',
    components: [
      { name: 'Tabs', description: 'Switch related panels.', status: 'Ready', link: '/components/tabs' },
      { name: 'Breadcrumb', description: 'Show page hierarchy.', status: 'Ready', link: '/components/breadcrumb' },
      { name: 'Dropdown', description: 'Expose actions in a menu.', status: 'Ready', link: '/components/dropdown' },
      { name: 'Menu', description: 'Navigate application sections.', status: 'Ready', link: '/components/menu' },
      { name: 'Steps', description: 'Show workflow progress.', status: 'Ready', link: '/components/steps' }
    ]
  },
  {
    name: 'Data Entry',
    description: 'Collect and validate user input.',
    components: [
      { name: 'Input', description: 'Enter single-line text.', status: 'Ready', link: '/components/input' },
      { name: 'Textarea', description: 'Enter multi-line text.', status: 'Ready', link: '/components/textarea' },
      { name: 'InputNumber', description: 'Enter numeric values.', status: 'Ready', link: '/components/input-number' },
      { name: 'Checkbox', description: 'Choose multiple options.', status: 'Ready', link: '/components/checkbox' },
      { name: 'Radio', description: 'Choose one option.', status: 'Ready', link: '/components/radio' },
      { name: 'Switch', description: 'Toggle a setting.', status: 'Ready', link: '/components/switch' },
      { name: 'Select', description: 'Select from options.', status: 'Ready', link: '/components/select' },
      { name: 'Form', description: 'Manage form layout and validation.', status: 'Ready', link: '/components/form' }
    ]
  },
  {
    name: 'Data Display',
    description: 'Present structured information.',
    components: [
      { name: 'Tag', description: 'Label content with status.', status: 'Ready', link: '/components/tag' },
      { name: 'Badge', description: 'Show counts and states.', status: 'Ready', link: '/components/badge' },
      { name: 'Card', description: 'Group related content.', status: 'Ready', link: '/components/card' },
      { name: 'Empty', description: 'Show empty states.', status: 'Ready', link: '/components/empty' },
      { name: 'Descriptions', description: 'Display record details.', status: 'Ready', link: '/components/descriptions' },
      { name: 'Table', description: 'Display tabular data.', status: 'Ready', link: '/components/table' },
      { name: 'Pagination', description: 'Navigate paged data.', status: 'Ready', link: '/components/pagination' }
    ]
  },
  {
    name: 'Feedback',
    description: 'Communicate system state and user feedback.',
    components: [
      { name: 'Alert', description: 'Show contextual information.', status: 'Ready', link: '/components/alert' },
      { name: 'Message', description: 'Show global lightweight feedback.', status: 'Planned' },
      { name: 'Modal', description: 'Focus attention in a dialog.', status: 'Planned' },
      { name: 'Drawer', description: 'Show a side panel.', status: 'Planned' },
      { name: 'Tooltip', description: 'Explain compact controls.', status: 'Planned' },
      { name: 'Popover', description: 'Show floating content.', status: 'Planned' },
      { name: 'Popconfirm', description: 'Confirm risky actions.', status: 'Planned' },
      { name: 'Spin', description: 'Show loading state.', status: 'Ready', link: '/components/spin' },
      { name: 'Skeleton', description: 'Reserve loading layout.', status: 'Planned' }
    ]
  }
]
