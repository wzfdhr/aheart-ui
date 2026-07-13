export type Locale = 'zh' | 'en'
export type ComponentStatus = 'Ready' | 'Planned'

type LocalizedText = Record<Locale, string>

interface ComponentDefinition {
  key: string
  name: string
  zhName?: string
  description: LocalizedText
  status: ComponentStatus
  link?: Partial<Record<Locale, string>>
}

interface ComponentCategoryDefinition {
  key: string
  name: LocalizedText
  description: LocalizedText
  components: ComponentDefinition[]
}

export interface ComponentMeta {
  key: string
  name: string
  zhName?: string
  description: string
  status: ComponentStatus
  link?: string
}

export interface ComponentCategory {
  key: string
  name: string
  description: string
  components: ComponentMeta[]
}

export const statusText: Record<Locale, Record<ComponentStatus, string>> = {
  zh: {
    Ready: '已完成',
    Planned: '规划中'
  },
  en: {
    Ready: 'Ready',
    Planned: 'Planned'
  }
}

const zhLink = (key: string) => `/components/${key}`

const categoryDefinitions: ComponentCategoryDefinition[] = [
  {
    key: 'general',
    name: {
      zh: '通用',
      en: 'General'
    },
    description: {
      zh: '产品界面中最基础、最高频的构建单元。',
      en: 'Basic building blocks used across product interfaces.'
    },
    components: [
      {
        key: 'button',
        name: 'Button',
        zhName: '按钮',
        description: {
          zh: '触发操作并表达操作层级。',
          en: 'Trigger an action and communicate action priority.'
        },
        status: 'Ready',
        link: { zh: zhLink('button'), en: '/en/components/button' }
      },
      {
        key: 'config-provider',
        name: 'ConfigProvider',
        zhName: '全局配置',
        description: {
          zh: '配置全局主题、尺寸、语言和禁用状态。',
          en: 'Configure global theme, size, locale, and disabled state.'
        },
        status: 'Ready',
        link: { zh: zhLink('config-provider'), en: '/en/components/config-provider' }
      },
      {
        key: 'icon',
        name: 'Icon',
        zhName: '图标',
        description: {
          zh: '展示语义化符号和视觉提示。',
          en: 'Display semantic symbols and visual cues.'
        },
        status: 'Ready',
        link: { zh: zhLink('icon'), en: '/en/components/icon' }
      },
      {
        key: 'typography',
        name: 'Typography',
        zhName: '排版',
        description: {
          zh: '组织正文、标题和链接样式。',
          en: 'Organize text, title, and link styles.'
        },
        status: 'Ready',
        link: { zh: zhLink('typography'), en: '/en/components/typography' }
      }
    ]
  },
  {
    key: 'layout',
    name: {
      zh: '布局',
      en: 'Layout'
    },
    description: {
      zh: '管理间距、分隔和页面结构。',
      en: 'Tools for spacing, separation, and page structure.'
    },
    components: [
      {
        key: 'space',
        name: 'Space',
        zhName: '间距',
        description: {
          zh: '设置一致的行内或块级间距。',
          en: 'Set consistent inline or block spacing.'
        },
        status: 'Ready',
        link: { zh: zhLink('space'), en: '/en/components/space' }
      },
      {
        key: 'divider',
        name: 'Divider',
        zhName: '分割线',
        description: {
          zh: '分隔内容组并建立视觉节奏。',
          en: 'Separate content groups and establish visual rhythm.'
        },
        status: 'Ready',
        link: { zh: zhLink('divider'), en: '/en/components/divider' }
      },
      {
        key: 'flex',
        name: 'Flex',
        zhName: '弹性布局',
        description: {
          zh: '组合灵活的一维布局。',
          en: 'Compose flexible one-dimensional layouts.'
        },
        status: 'Ready',
        link: { zh: zhLink('flex'), en: '/en/components/flex' }
      },
      {
        key: 'grid',
        name: 'Grid',
        zhName: '栅格',
        description: {
          zh: '构建响应式网格和页面骨架。',
          en: 'Build responsive grids and page skeletons.'
        },
        status: 'Ready',
        link: { zh: zhLink('grid'), en: '/en/components/grid' }
      }
    ]
  },
  {
    key: 'navigation',
    name: {
      zh: '导航',
      en: 'Navigation'
    },
    description: {
      zh: '在页面、视图和流程步骤之间移动。',
      en: 'Move between pages, views, and workflow steps.'
    },
    components: [
      {
        key: 'tabs',
        name: 'Tabs',
        zhName: '标签页',
        description: {
          zh: '切换同层级的相关内容面板。',
          en: 'Switch between related panels at the same level.'
        },
        status: 'Ready',
        link: { zh: zhLink('tabs'), en: '/en/components/tabs' }
      },
      {
        key: 'breadcrumb',
        name: 'Breadcrumb',
        zhName: '面包屑',
        description: {
          zh: '展示当前位置和页面层级。',
          en: 'Show the current location and page hierarchy.'
        },
        status: 'Ready',
        link: { zh: zhLink('breadcrumb'), en: '/en/components/breadcrumb' }
      },
      {
        key: 'dropdown',
        name: 'Dropdown',
        zhName: '下拉菜单',
        description: {
          zh: '在菜单中承载次级操作。',
          en: 'Expose secondary actions in a menu.'
        },
        status: 'Ready',
        link: { zh: zhLink('dropdown'), en: '/en/components/dropdown' }
      },
      {
        key: 'menu',
        name: 'Menu',
        zhName: '菜单',
        description: {
          zh: '导航应用的主要功能区域。',
          en: 'Navigate primary application sections.'
        },
        status: 'Ready',
        link: { zh: zhLink('menu'), en: '/en/components/menu' }
      },
      {
        key: 'steps',
        name: 'Steps',
        zhName: '步骤条',
        description: {
          zh: '展示流程进度和当前位置。',
          en: 'Show workflow progress and the current step.'
        },
        status: 'Ready',
        link: { zh: zhLink('steps'), en: '/en/components/steps' }
      }
    ]
  },
  {
    key: 'data-entry',
    name: {
      zh: '数据录入',
      en: 'Data Entry'
    },
    description: {
      zh: '收集、选择和校验用户输入。',
      en: 'Collect, select, and validate user input.'
    },
    components: [
      {
        key: 'input',
        name: 'Input',
        zhName: '输入框',
        description: {
          zh: '输入单行文本。',
          en: 'Enter single-line text.'
        },
        status: 'Ready',
        link: { zh: zhLink('input'), en: '/en/components/input' }
      },
      {
        key: 'textarea',
        name: 'Textarea',
        zhName: '文本域',
        description: {
          zh: '输入多行文本。',
          en: 'Enter multi-line text.'
        },
        status: 'Ready',
        link: { zh: zhLink('textarea'), en: '/en/components/textarea' }
      },
      {
        key: 'input-number',
        name: 'InputNumber',
        zhName: '数字输入框',
        description: {
          zh: '输入和调整数值。',
          en: 'Enter and adjust numeric values.'
        },
        status: 'Ready',
        link: { zh: zhLink('input-number'), en: '/en/components/input-number' }
      },
      {
        key: 'checkbox',
        name: 'Checkbox',
        zhName: '复选框',
        description: {
          zh: '从一组选项中选择多个值。',
          en: 'Choose multiple values from a set.'
        },
        status: 'Ready',
        link: { zh: zhLink('checkbox'), en: '/en/components/checkbox' }
      },
      {
        key: 'radio',
        name: 'Radio',
        zhName: '单选框',
        description: {
          zh: '从一组选项中选择一个值。',
          en: 'Choose one value from a set.'
        },
        status: 'Ready',
        link: { zh: zhLink('radio'), en: '/en/components/radio' }
      },
      {
        key: 'switch',
        name: 'Switch',
        zhName: '开关',
        description: {
          zh: '切换开启或关闭状态。',
          en: 'Toggle an on or off state.'
        },
        status: 'Ready',
        link: { zh: zhLink('switch'), en: '/en/components/switch' }
      },
      {
        key: 'select',
        name: 'Select',
        zhName: '选择器',
        description: {
          zh: '从候选项中选择一个或多个值。',
          en: 'Select one or more values from options.'
        },
        status: 'Ready',
        link: { zh: zhLink('select'), en: '/en/components/select' }
      },
      {
        key: 'form',
        name: 'Form',
        zhName: '表单',
        description: {
          zh: '组织表单布局、校验和提交状态。',
          en: 'Manage form layout, validation, and submit state.'
        },
        status: 'Ready',
        link: { zh: zhLink('form'), en: '/en/components/form' }
      }
    ]
  },
  {
    key: 'data-display',
    name: {
      zh: '数据展示',
      en: 'Data Display'
    },
    description: {
      zh: '呈现状态、记录和结构化信息。',
      en: 'Present status, records, and structured information.'
    },
    components: [
      {
        key: 'tag',
        name: 'Tag',
        zhName: '标签',
        description: {
          zh: '标记内容、属性或状态。',
          en: 'Label content, attributes, or states.'
        },
        status: 'Ready',
        link: { zh: zhLink('tag'), en: '/en/components/tag' }
      },
      {
        key: 'badge',
        name: 'Badge',
        zhName: '徽标',
        description: {
          zh: '展示数量、提醒和状态点。',
          en: 'Show counts, notifications, and status dots.'
        },
        status: 'Ready',
        link: { zh: zhLink('badge'), en: '/en/components/badge' }
      },
      {
        key: 'card',
        name: 'Card',
        zhName: '卡片',
        description: {
          zh: '承载一组相关信息和操作。',
          en: 'Group related information and actions.'
        },
        status: 'Ready',
        link: { zh: zhLink('card'), en: '/en/components/card' }
      },
      {
        key: 'empty',
        name: 'Empty',
        zhName: '空状态',
        description: {
          zh: '展示无数据或无结果状态。',
          en: 'Show empty data or no-result states.'
        },
        status: 'Ready',
        link: { zh: zhLink('empty'), en: '/en/components/empty' }
      },
      {
        key: 'descriptions',
        name: 'Descriptions',
        zhName: '描述列表',
        description: {
          zh: '展示对象或记录的字段详情。',
          en: 'Display field details for an object or record.'
        },
        status: 'Ready',
        link: { zh: zhLink('descriptions'), en: '/en/components/descriptions' }
      },
      {
        key: 'table',
        name: 'Table',
        zhName: '表格',
        description: {
          zh: '展示可扫描和可操作的表格数据。',
          en: 'Display scannable and actionable tabular data.'
        },
        status: 'Ready',
        link: { zh: zhLink('table'), en: '/en/components/table' }
      },
      {
        key: 'pagination',
        name: 'Pagination',
        zhName: '分页',
        description: {
          zh: '在分页数据之间导航。',
          en: 'Navigate paged data.'
        },
        status: 'Ready',
        link: { zh: zhLink('pagination'), en: '/en/components/pagination' }
      }
    ]
  },
  {
    key: 'feedback',
    name: {
      zh: '反馈',
      en: 'Feedback'
    },
    description: {
      zh: '传达系统状态、结果和需要关注的信息。',
      en: 'Communicate system state, results, and important information.'
    },
    components: [
      {
        key: 'alert',
        name: 'Alert',
        zhName: '警告提示',
        description: {
          zh: '展示需要用户留意的上下文信息。',
          en: 'Show contextual information that deserves attention.'
        },
        status: 'Ready',
        link: { zh: zhLink('alert'), en: '/en/components/alert' }
      },
      {
        key: 'message',
        name: 'Message',
        zhName: '全局提示',
        description: {
          zh: '展示轻量级全局反馈。',
          en: 'Show lightweight global feedback.'
        },
        status: 'Ready',
        link: { zh: zhLink('message'), en: '/en/components/message' }
      },
      {
        key: 'modal',
        name: 'Modal',
        zhName: '对话框',
        description: {
          zh: '在模态层中聚焦确认、编辑或查看任务。',
          en: 'Focus confirmation, editing, or viewing tasks in a modal layer.'
        },
        status: 'Ready',
        link: { zh: zhLink('modal'), en: '/en/components/modal' }
      },
      {
        key: 'drawer',
        name: 'Drawer',
        zhName: '抽屉',
        description: {
          zh: '从屏幕边缘展示补充内容或表单。',
          en: 'Show supplementary content or forms from the screen edge.'
        },
        status: 'Ready',
        link: { zh: zhLink('drawer'), en: '/en/components/drawer' }
      },
      {
        key: 'tooltip',
        name: 'Tooltip',
        zhName: '文字提示',
        description: {
          zh: '解释紧凑控件或被截断的内容。',
          en: 'Explain compact controls or truncated content.'
        },
        status: 'Ready',
        link: { zh: zhLink('tooltip'), en: '/en/components/tooltip' }
      },
      {
        key: 'popover',
        name: 'Popover',
        zhName: '气泡卡片',
        description: {
          zh: '展示轻量浮层内容。',
          en: 'Show lightweight floating content.'
        },
        status: 'Ready',
        link: { zh: zhLink('popover'), en: '/en/components/popover' }
      },
      {
        key: 'popconfirm',
        name: 'Popconfirm',
        zhName: '气泡确认框',
        description: {
          zh: '在就地浮层中确认有风险的操作。',
          en: 'Confirm risky actions in an inline floating layer.'
        },
        status: 'Ready',
        link: { zh: zhLink('popconfirm'), en: '/en/components/popconfirm' }
      },
      {
        key: 'spin',
        name: 'Spin',
        zhName: '加载中',
        description: {
          zh: '展示局部或页面级加载状态。',
          en: 'Show local or page-level loading state.'
        },
        status: 'Ready',
        link: { zh: zhLink('spin'), en: '/en/components/spin' }
      },
      {
        key: 'skeleton',
        name: 'Skeleton',
        zhName: '骨架屏',
        description: {
          zh: '在内容加载前保留版式结构。',
          en: 'Reserve layout structure before content loads.'
        },
        status: 'Ready',
        link: { zh: zhLink('skeleton'), en: '/en/components/skeleton' }
      }
    ]
  }
]

export function getComponentCategories(locale: Locale): ComponentCategory[] {
  return categoryDefinitions.map((category) => ({
    key: category.key,
    name: category.name[locale],
    description: category.description[locale],
    components: category.components.map((component) => ({
      key: component.key,
      name: component.name,
      zhName: component.zhName,
      description: component.description[locale],
      status: component.status,
      link: component.link?.[locale]
    }))
  }))
}

export const componentCategories = getComponentCategories('en')
