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
      { name: 'Icon', description: 'Display semantic symbols.', status: 'Planned' },
      { name: 'Typography', description: 'Text, title, and link styles.', status: 'Planned' }
    ]
  },
  {
    name: 'Layout',
    description: 'Tools for spacing and page structure.',
    components: [
      { name: 'Space', description: 'Set consistent inline spacing.', status: 'Planned' },
      { name: 'Divider', description: 'Separate content groups.', status: 'Planned' },
      { name: 'Flex', description: 'Compose flexible layouts.', status: 'Planned' },
      { name: 'Grid', description: 'Build responsive grids.', status: 'Planned' }
    ]
  },
  {
    name: 'Navigation',
    description: 'Move between pages, views, and steps.',
    components: [
      { name: 'Tabs', description: 'Switch related panels.', status: 'Planned' },
      { name: 'Breadcrumb', description: 'Show page hierarchy.', status: 'Planned' },
      { name: 'Dropdown', description: 'Expose actions in a menu.', status: 'Planned' },
      { name: 'Menu', description: 'Navigate application sections.', status: 'Planned' },
      { name: 'Steps', description: 'Show workflow progress.', status: 'Planned' }
    ]
  },
  {
    name: 'Data Entry',
    description: 'Collect and validate user input.',
    components: [
      { name: 'Input', description: 'Enter single-line text.', status: 'Planned' },
      { name: 'Textarea', description: 'Enter multi-line text.', status: 'Planned' },
      { name: 'InputNumber', description: 'Enter numeric values.', status: 'Planned' },
      { name: 'Checkbox', description: 'Choose multiple options.', status: 'Planned' },
      { name: 'Radio', description: 'Choose one option.', status: 'Planned' },
      { name: 'Switch', description: 'Toggle a setting.', status: 'Planned' },
      { name: 'Select', description: 'Select from options.', status: 'Planned' },
      { name: 'Form', description: 'Manage form layout and validation.', status: 'Planned' }
    ]
  },
  {
    name: 'Data Display',
    description: 'Present structured information.',
    components: [
      { name: 'Tag', description: 'Label content with status.', status: 'Planned' },
      { name: 'Badge', description: 'Show counts and states.', status: 'Planned' },
      { name: 'Card', description: 'Group related content.', status: 'Planned' },
      { name: 'Empty', description: 'Show empty states.', status: 'Planned' },
      { name: 'Descriptions', description: 'Display record details.', status: 'Planned' },
      { name: 'Table', description: 'Display tabular data.', status: 'Planned' },
      { name: 'Pagination', description: 'Navigate paged data.', status: 'Planned' }
    ]
  },
  {
    name: 'Feedback',
    description: 'Communicate system state and user feedback.',
    components: [
      { name: 'Alert', description: 'Show contextual information.', status: 'Planned' },
      { name: 'Message', description: 'Show global lightweight feedback.', status: 'Planned' },
      { name: 'Modal', description: 'Focus attention in a dialog.', status: 'Planned' },
      { name: 'Drawer', description: 'Show a side panel.', status: 'Planned' },
      { name: 'Tooltip', description: 'Explain compact controls.', status: 'Planned' },
      { name: 'Popover', description: 'Show floating content.', status: 'Planned' },
      { name: 'Popconfirm', description: 'Confirm risky actions.', status: 'Planned' },
      { name: 'Spin', description: 'Show loading state.', status: 'Planned' },
      { name: 'Skeleton', description: 'Reserve loading layout.', status: 'Planned' }
    ]
  }
]
