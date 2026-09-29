import { getComponentCatalogs, getComponentCategories, type ComponentMeta } from './components'

export type ProductAreaKey = 'core' | 'composed' | 'ai' | 'motion' | 'dnd' | 'icons' | 'quality'
export type ProductAreaStatus = 'published' | 'verified' | 'preview' | 'planned' | 'later'

export interface ProductAreaItem {
  key: string
  name: string
  description: string
  href?: string
  status: ProductAreaStatus
  statusLabel?: string
  group?: string
}

export interface ProductAreaSection {
  key: string
  title: string
  description: string
  items: ProductAreaItem[]
}

export interface ProductArea {
  key: ProductAreaKey
  name: string
  eyebrow: string
  description: string
  packageNote: string
  sections: ProductAreaSection[]
}

export const productAreaStatusText: Record<ProductAreaStatus, string> = {
  published: '已发布',
  verified: '当前可用 / 已验证',
  preview: '仓库预览',
  planned: 'v2 尚未启动（候选）',
  later: 'Later'
}

const statusClass = (status: ProductAreaStatus) => `aheart-status--${status}`

const coreCatalogKeys = new Set(getComponentCatalogs('zh').core.map((component) => component.key))

const coreItems = getComponentCategories('zh')
  .flatMap((category) => category.components)
  .filter((component) => coreCatalogKeys.has(component.key))

const toCoreItem = (component: ComponentMeta): ProductAreaItem => ({
  key: component.key,
  name: component.zhName ? `${component.name} ${component.zhName}` : component.name,
  description: component.description,
  href: component.link,
  status: component.status === 'Ready' ? 'verified' : 'planned'
})

export const productAreas: Record<ProductAreaKey, ProductArea> = {
  core: {
    key: 'core',
    name: '基础组件',
    eyebrow: 'CORE COMPONENTS / 当前可用',
    description: '从配置、布局、输入到反馈，基础组件覆盖专业产品界面的高频构建任务。',
    packageNote: '基础组件来自 aheart-ui；每个旧版 /components/* 详细文档继续保留。',
    sections: getComponentCategories('zh')
      .filter((category) => category.key !== 'ai')
      .map((category) => ({
        key: category.key,
        title: category.name,
        description: category.description,
        items: category.components.filter((component) => coreCatalogKeys.has(component.key)).map(toCoreItem)
      }))
      .filter((section) => section.items.length > 0)
  },
  composed: {
    key: 'composed',
    name: '组合组件',
    eyebrow: 'COMPOSED COMPONENTS / 产品模式',
    description: '把多个基础能力组织成可复用的业务模式，适合表单、数据工作区和复杂交互。',
    packageNote: '当前入口链接到仓库中已验证的详细文档；规划能力不会被表述为当前可安装。',
    sections: [
      {
        key: 'forms-selection',
        title: '表单与选择工作流',
        description: '当前随 aheart-ui 提供，并已有详细文档与交互验证。',
        items: [
          { key: 'select', name: 'Select', description: '受控选择、键盘导航与可选虚拟列表。', href: '/components/select', status: 'verified' },
          { key: 'date-picker', name: 'DatePicker', description: '日期、多选日期与范围选择工作流。', href: '/components/date-picker', status: 'verified' },
          { key: 'time-picker', name: 'TimePicker', description: '时间、时间范围与禁用规则。', href: '/components/time-picker', status: 'verified' },
          { key: 'cascader', name: 'Cascader', description: '多层级选项浏览、加载与选择。', href: '/components/cascader', status: 'verified' },
          { key: 'tree-select', name: 'TreeSelect', description: '树形数据的展开、搜索与选择。', href: '/components/tree-select', status: 'verified' },
          { key: 'upload', name: 'Upload', description: '文件校验、上传状态与失败恢复。', href: '/components/upload', status: 'verified' },
          { key: 'form', name: 'Form', description: '布局、校验、依赖字段与提交状态。', href: '/components/form', status: 'verified' }
        ]
      },
      {
        key: 'data-workspace',
        title: '数据与工作区',
        description: '组织大数据量、层级信息和多区域工作界面。',
        items: [
          { key: 'table', name: 'Table', description: '分页、筛选、固定列和虚拟数据工作区。', href: '/components/table', status: 'verified' },
          { key: 'pagination', name: 'Pagination', description: '受控分页状态与数据导航。', href: '/components/pagination', status: 'verified' },
          { key: 'tree', name: 'Tree', description: '层级数据的展开、选择与异步加载。', href: '/components/tree', status: 'verified' },
          { key: 'splitter', name: 'Splitter', description: '可调整尺寸的多区域工作区骨架。', href: '/components/splitter', status: 'verified' }
        ]
      },
      {
        key: 'layered-interaction',
        title: '浮层与上下文交互',
        description: '把定位、焦点、退出与嵌套关系组合成稳定的任务流。',
        items: [
          { key: 'dropdown', name: 'Dropdown', description: '上下文菜单与操作入口。', href: '/components/dropdown', status: 'verified' },
          { key: 'tooltip', name: 'Tooltip', description: '轻量解释与辅助提示。', href: '/components/tooltip', status: 'verified' },
          { key: 'popover', name: 'Popover / Popconfirm', description: '补充内容与就地确认。', href: '/components/popover', status: 'verified' },
          { key: 'modal', name: 'Modal / Drawer', description: '模态任务、侧边工作流与焦点管理。', href: '/components/modal', status: 'verified' }
        ]
      },
      {
        key: 'v2-planned',
        title: 'v2 M3 / M4 候选方向',
        description: 'v2 当前暂停，M0–M8 均未启动；此处仅记录候选方向，不代表当前可安装。',
        items: [
          { key: 'combobox', name: 'Combobox', description: '搜索、选择与创建的统一组合模式。', status: 'planned' },
          { key: 'compound', name: 'Compound', description: '可组合子部件与受控上下文模式。', status: 'planned' },
          { key: 'namespaced', name: 'Namespaced', description: '命名空间组件 API 与样式边界。', status: 'planned' },
          { key: 'layer-focus', name: '统一 Layer-Focus', description: '跨浮层的焦点、退出和堆叠协议。', status: 'planned' }
        ]
      }
    ]
  },
  ai: {
    key: 'ai',
    name: 'AI 产品',
    eyebrow: 'AI PRODUCT / 仓库预览',
    description: '按 Chat、Agent、Workbench 三类产品场景浏览 AI 界面能力。',
    packageNote: '当前仅提供仓库预览，@aheart-ui/ai 尚未公共 npm 发布；v2 当前暂停，M6 尚未启动。',
    sections: [
      {
        key: 'chat',
        title: 'Chat',
        description: '流式对话、来源和受控消息状态。',
        items: [
          { key: 'ai-chat-panel', name: 'AIChatPanel', description: '流式消息、来源、附件与停止操作。', href: '/components/ai', status: 'preview' }
        ]
      },
      {
        key: 'agent',
        title: 'Agent',
        description: '思考过程、工具状态、重试与停止反馈。',
        items: [
          { key: 'agent-flow', name: 'ThoughtChain / Process', description: '任务过程、工具调用状态与错误恢复。', href: '/components/ai', status: 'preview' }
        ]
      },
      {
        key: 'workbench',
        title: 'Workbench',
        description: '人工审批、产物、上下文与多区域产品工作区。',
        items: [
          { key: 'agent-workbench', name: 'AIAgentWorkbench', description: '对话、任务、审批、上下文与产物的一体化工作台。', href: '/components/ai-agent-workbench', status: 'preview' },
          { key: 'ai-form', name: 'AIForm', description: '根据安全 schema 受控渲染配套业务表单。', href: '/components/ai-form', status: 'preview' }
        ]
      }
    ]
  },
  motion: {
    key: 'motion',
    name: 'Motion',
    eyebrow: 'MOTION / v2 M5 候选方向',
    description: '为状态切换、浮层和布局变化建立可访问、可控制的动效协议。',
    packageNote: 'v2 当前暂停，M5 尚未启动；以下仅为候选方向，Effects later 不代表当前已完成或可安装。',
    sections: [
      {
        key: 'm5',
        title: 'v2 M5 候选方向',
        description: 'v2 当前暂停；启动前仍需动效门禁、Reduced Motion 和跨组件验证。',
        items: ['Presence', 'Fade', 'Slide', 'Scale', 'Collapse', 'ReducedMotionProvider'].map((name) => ({
          key: name.toLowerCase(), name, description: `${name} 状态协议与 Vue 3 组合 API。`, status: 'planned' as const
        }))
      },
      {
        key: 'later',
        title: 'Later',
        description: '在 M5 之后再评估的效果能力。',
        items: [{ key: 'effects', name: 'Effects', description: '更丰富的效果预设，尚未纳入当前交付。', status: 'later' }]
      }
    ]
  },
  dnd: {
    key: 'dnd',
    name: 'DND',
    eyebrow: 'DND / 仓库预览',
    description: '排序、跨容器移动和键盘路径的受控拖拽能力。',
    packageNote: '当前仅提供仓库预览，@aheart-ui/dnd 尚未公共 npm 发布；v2 当前暂停，M6 尚未启动。',
    sections: [
      {
        key: 'preview',
        title: '当前仓库预览',
        description: '可查看已有实现和交互示例，但不要当作公开安装承诺。',
        items: [
          { key: 'dnd', name: 'SortableList / DragOverlay', description: '排序、跨列表移动、键盘和触摸路径。', href: '/components/dnd', status: 'preview' }
        ]
      },
      {
        key: 'm6',
        title: 'v2 M6 候选方向',
        description: 'v2 当前暂停；公共包、发布门禁和跨平台证据均未开始。',
        items: [{ key: 'public-package', name: '@aheart-ui/dnd 公共供应链', description: '公共 npm 发布与安装验证。', status: 'planned' }]
      }
    ]
  },
  icons: {
    key: 'icons',
    name: 'Icons',
    eyebrow: 'ICONS / 当前可用与供应链规划',
    description: '使用 AIcon 与 Lucide 兼容层表达产品语义，再逐步建立独立图标供应链。',
    packageNote: 'AIcon/Lucide 兼容层当前可用；独立 @aheart-ui/icons 包是 v2 候选方向，M2 尚未启动。',
    sections: [
      {
        key: 'available',
        title: '当前可用 / 已验证',
        description: '沿用现有 Icon 详细文档和兼容 API。',
        items: [{ key: 'aicon', name: 'AIcon', description: 'aheart-ui 内置图标渲染与 Lucide 名称兼容层。', href: '/components/icon', status: 'verified' }]
      },
      {
        key: 'm2',
        title: 'v2 M2 候选方向',
        description: 'v2 当前暂停；启动前仍需确定独立包、版本策略和发布证据。',
        items: [{ key: 'icons-package', name: '@aheart-ui/icons', description: '独立图标公共供应链。', status: 'planned' }]
      }
    ]
  },
  quality: {
    key: 'quality',
    name: '工程质量',
    eyebrow: 'QUALITY / 证据门禁',
    description: '查看组件质量矩阵、浏览器覆盖和发布前证据。',
    packageNote: '质量矩阵是工程证据入口，不等于所有 v2 产品能力都已发布。',
    sections: [
      {
        key: 'quality',
        title: '工程证据',
        description: '按当前仓库质量门禁浏览。',
        items: [{ key: 'quality-matrix', name: '质量矩阵', description: '组件、风险、测试和发布证据。', href: '/guide/quality-matrix', status: 'verified' }]
      }
    ]
  }
}

export function getProductArea(key: ProductAreaKey): ProductArea {
  return productAreas[key]
}

export function getProductAreaSidebar(key: ProductAreaKey) {
  const area = getProductArea(key)
  return [
    { text: `${area.name} · ${area.eyebrow.split(' / ')[1] ?? '入口'}`, link: `/${key}/overview` },
    ...area.sections.map((section) => ({
      text: section.title,
      collapsed: false,
      items: section.items.filter((item) => item.href).map((item) => ({ text: item.name, link: item.href }))
    }))
  ]
}

export { coreItems, statusClass }
