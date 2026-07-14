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

export interface ComponentDomain extends ComponentCategory {
  taskGroup: string
}

export interface ComponentDocumentContext {
  component: ComponentMeta
  domain: Pick<ComponentDomain, 'key' | 'name' | 'description' | 'taskGroup'>
  packageName: 'aheart-ui' | '@aheart-ui/dnd' | '@aheart-ui/ai'
  related: ComponentMeta[]
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
        key: 'splitter',
        name: 'Splitter',
        zhName: '分割面板',
        description: {
          zh: '通过可拖动分隔柄调整相邻面板尺寸。',
          en: 'Resize adjacent panels with draggable separator handles.'
        },
        status: 'Ready',
        link: { zh: zhLink('splitter'), en: '/en/components/splitter' }
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
        key: 'date-picker',
        name: 'DatePicker',
        zhName: '日期选择器',
        description: {
          zh: '输入或在日历中选择日期。',
          en: 'Enter or select a date from a calendar.'
        },
        status: 'Ready',
        link: { zh: zhLink('date-picker'), en: '/en/components/date-picker' }
      },
      {
        key: 'time-picker',
        name: 'TimePicker',
        zhName: '时间选择器',
        description: {
          zh: '输入或选择一天中的时间。',
          en: 'Enter or select a time of day.'
        },
        status: 'Ready',
        link: { zh: zhLink('time-picker'), en: '/en/components/time-picker' }
      },
      {
        key: 'upload',
        name: 'Upload',
        zhName: '上传',
        description: {
          zh: '选择文件并管理上传状态。',
          en: 'Select files and manage their upload state.'
        },
        status: 'Ready',
        link: { zh: zhLink('upload'), en: '/en/components/upload' }
      },
      {
        key: 'tree',
        name: 'Tree',
        zhName: '树形控件',
        description: {
          zh: '按层级展示、选择和勾选结构化数据。',
          en: 'Display, select, and check hierarchical data.'
        },
        status: 'Ready',
        link: { zh: zhLink('tree') }
      },
      {
        key: 'tree-select',
        name: 'TreeSelect',
        zhName: '树选择',
        description: {
          zh: '在下拉面板中选择层级数据。',
          en: 'Select hierarchical data from a dropdown panel.'
        },
        status: 'Ready',
        link: { zh: zhLink('tree-select') }
      },
      {
        key: 'cascader',
        name: 'Cascader',
        zhName: '级联选择',
        description: {
          zh: '从多级选项中选择一条或多条路径。',
          en: 'Select one or more paths from nested options.'
        },
        status: 'Ready',
        link: { zh: zhLink('cascader') }
      },
      {
        key: 'dnd',
        name: 'DnD',
        zhName: '拖拽',
        description: {
          zh: '为列表排序和跨容器移动提供拖拽能力。',
          en: 'Provide drag and drop for sorting and moving between containers.'
        },
        status: 'Ready',
        link: { zh: zhLink('dnd') }
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
  },
  {
    key: 'ai',
    name: {
      zh: '智能交互',
      en: 'AI Interaction'
    },
    description: {
      zh: '组织模型无关的 AI 对话、提示与执行反馈界面。',
      en: 'Model-agnostic interfaces for AI chat, prompts, and execution feedback.'
    },
    components: [
      {
        key: 'ai',
        name: 'AIChatPanel',
        zhName: 'AI 智能对话',
        description: {
          zh: '组合流式对话、来源、执行进度与受控交互。',
          en: 'Compose streaming chat, sources, execution progress, and controlled interactions.'
        },
        status: 'Ready',
        link: { zh: zhLink('ai') }
      },
      {
        key: 'ai-form',
        name: 'AIForm',
        zhName: 'AI 智能表单',
        description: {
          zh: '根据安全 schema 受控渲染表单字段与联动条件。',
          en: 'Render controlled form fields and conditions from a safe schema.'
        },
        status: 'Ready',
        link: { zh: zhLink('ai-form') }
      },
      {
        key: 'ai-agent-workbench',
        name: 'AIAgentWorkbench',
        zhName: 'AI Agent 工作台',
        description: {
          zh: '组合受控会话、对话、任务审批、上下文与产物的 Agent 工作台。',
          en: 'Compose controlled conversations, chat, approvals, context, and artifacts for agent workflows.'
        },
        status: 'Ready',
        link: { zh: zhLink('ai-agent-workbench') }
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

interface ComponentDomainDefinition {
  key: string
  name: LocalizedText
  description: LocalizedText
  taskGroup: LocalizedText
  componentKeys: string[]
}

const componentDomainDefinitions: ComponentDomainDefinition[] = [
  {
    key: 'foundations',
    name: { zh: '设计基础', en: 'Design Foundations' },
    description: { zh: '定义全局配置、视觉语言与内容表达。', en: 'Define global configuration, visual language, and content expression.' },
    taskGroup: { zh: '全局规范', en: 'Global standards' },
    componentKeys: ['config-provider', 'typography', 'icon']
  },
  {
    key: 'building',
    name: { zh: '通用构建', en: 'General Building' },
    description: { zh: '组织操作、间距与页面骨架。', en: 'Compose actions, spacing, and page structure.' },
    taskGroup: { zh: '布局与操作', en: 'Layout and actions' },
    componentKeys: ['button', 'space', 'flex', 'grid', 'divider']
  },
  {
    key: 'navigation',
    name: { zh: '导航与流程', en: 'Navigation And Flow' },
    description: { zh: '帮助用户在页面、视图与任务步骤中移动。', en: 'Move users across pages, views, and task steps.' },
    taskGroup: { zh: '路径与进度', en: 'Paths and progress' },
    componentKeys: ['menu', 'tabs', 'breadcrumb', 'steps', 'dropdown']
  },
  {
    key: 'entry',
    name: { zh: '表单与选择', en: 'Forms And Selection' },
    description: { zh: '录入、选择、校验并提交业务数据。', en: 'Enter, select, validate, and submit business data.' },
    taskGroup: { zh: '采集与选择', en: 'Collection and selection' },
    componentKeys: [
      'input', 'textarea', 'input-number', 'select', 'checkbox', 'radio', 'switch', 'date-picker', 'time-picker',
      'cascader', 'tree-select', 'upload', 'form'
    ]
  },
  {
    key: 'data',
    name: { zh: '数据与状态', en: 'Data And Status' },
    description: { zh: '展示结构化信息、结果与系统状态。', en: 'Present structured information, outcomes, and system state.' },
    taskGroup: { zh: '呈现与状态', en: 'Presentation and status' },
    componentKeys: ['table', 'pagination', 'tree', 'descriptions', 'card', 'tag', 'badge', 'empty', 'spin', 'skeleton', 'alert']
  },
  {
    key: 'feedback',
    name: { zh: '浮层与反馈', en: 'Overlays And Feedback' },
    description: { zh: '在不打断主任务的前提下提示、确认与补充内容。', en: 'Prompt, confirm, and reveal supporting content without losing task context.' },
    taskGroup: { zh: '上下文反馈', en: 'Contextual feedback' },
    componentKeys: ['message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm']
  },
  {
    key: 'advanced',
    name: { zh: '高级交互与工作区', en: 'Advanced Interaction And Workspace' },
    description: { zh: '构建可调整、多区域和可排序的复杂工作界面。', en: 'Build adjustable, multi-region, and sortable work interfaces.' },
    taskGroup: { zh: '空间与编排', en: 'Space and orchestration' },
    componentKeys: ['splitter', 'dnd']
  },
  {
    key: 'ai',
    name: { zh: '智能产品能力', en: 'Intelligent Product Capabilities' },
    description: { zh: '组织模型无关的对话、受控表单与 Agent 工作流。', en: 'Compose model-agnostic conversations, controlled forms, and agent workflows.' },
    taskGroup: { zh: '对话与协作', en: 'Conversation and collaboration' },
    componentKeys: ['ai', 'ai-form', 'ai-agent-workbench']
  }
]

const definitionsByKey = new Map(
  categoryDefinitions.flatMap((category) => category.components.map((component) => [component.key, component]))
)

const packageNameFor = (key: string): ComponentDocumentContext['packageName'] => {
  if (key === 'dnd') return '@aheart-ui/dnd'
  if (key === 'ai' || key === 'ai-form' || key === 'ai-agent-workbench') return '@aheart-ui/ai'
  return 'aheart-ui'
}

const toMeta = (component: ComponentDefinition, locale: Locale): ComponentMeta => ({
  key: component.key,
  name: component.name,
  zhName: component.zhName,
  description: component.description[locale],
  status: component.status,
  link: component.link?.[locale]
})

export function validateComponentDomains() {
  const domainKeys = componentDomainDefinitions.flatMap((domain) => domain.componentKeys)
  const duplicate = domainKeys.find((key, index) => domainKeys.indexOf(key) !== index)
  const readyKeys = [...definitionsByKey.values()].filter((component) => component.status === 'Ready').map((component) => component.key)
  const missing = readyKeys.filter((key) => !domainKeys.includes(key))
  const unknown = domainKeys.filter((key) => !definitionsByKey.has(key))

  if (duplicate || missing.length || unknown.length || domainKeys.length !== readyKeys.length) {
    throw new Error(`Invalid component domain metadata: duplicate=${duplicate ?? 'none'}, missing=${missing.join(',') || 'none'}, unknown=${unknown.join(',') || 'none'}`)
  }
}

validateComponentDomains()

export function getComponentDomains(locale: Locale): ComponentDomain[] {
  return componentDomainDefinitions.map((domain) => ({
    key: domain.key,
    name: domain.name[locale],
    description: domain.description[locale],
    taskGroup: domain.taskGroup[locale],
    components: domain.componentKeys.map((key) => toMeta(definitionsByKey.get(key)!, locale))
  }))
}

export function getComponentSidebar(locale: Locale) {
  return getComponentDomains(locale).map((domain) => ({
    text: `${domain.name} · ${domain.components.length}`,
    collapsed: true,
    items: domain.components.map((component) => ({
      text: component.zhName ? `${component.name} ${component.zhName}` : component.name,
      link: component.link
    }))
  }))
}

export function getComponentDocumentContext(path: string, locale: Locale): ComponentDocumentContext | undefined {
  const key = path.replace(/^\/?components\//, '').replace(/\.(md|html)$/, '').replace(/\/$/, '')
  const domain = getComponentDomains(locale).find((candidate) => candidate.components.some((component) => component.key === key))
  const component = domain?.components.find((candidate) => candidate.key === key)

  if (!domain || !component) return undefined

  return {
    component,
    domain: { key: domain.key, name: domain.name, description: domain.description, taskGroup: domain.taskGroup },
    packageName: packageNameFor(component.key),
    related: domain.components.filter((candidate) => candidate.key !== component.key).slice(0, 4)
  }
}
