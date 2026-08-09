import { expect, test } from '@playwright/test'
import { qualityMatrix } from '../docs/.vitepress/data/quality-matrix.mjs'

type ComponentContract = {
  route: string
  selector: string
  activate?: { role: 'button'; name: string }
}

const contracts: Record<string, ComponentContract> = {
  form: { route: '/components/form', selector: '.aheart-demo-panel .aheart-form' },
  select: { route: '/components/select', selector: '.aheart-demo-panel .aheart-select' },
  'date-picker': { route: '/components/date-picker', selector: '.vp-doc .aheart-date-picker' },
  'time-picker': { route: '/components/time-picker', selector: '.aheart-demo-panel .aheart-time-picker' },
  upload: { route: '/components/upload', selector: '.vp-doc .aheart-upload' },
  table: { route: '/components/table', selector: '.aheart-demo-panel .aheart-table' },
  tree: { route: '/components/tree', selector: '.aheart-demo-panel .aheart-tree' },
  'tree-select': { route: '/components/tree-select', selector: '.aheart-demo-panel .aheart-tree-select' },
  cascader: { route: '/components/cascader', selector: '.aheart-demo-panel .aheart-cascader' },
  dropdown: { route: '/components/dropdown', selector: '.aheart-demo-panel .aheart-dropdown' },
  message: {
    route: '/components/message',
    selector: '.aheart-message:not(.demo-message-host)',
    activate: { role: 'button', name: 'Success' }
  },
  modal: {
    route: '/components/modal',
    selector: '.aheart-modal',
    activate: { role: 'button', name: 'Open modal' }
  },
  drawer: {
    route: '/components/drawer',
    selector: '.aheart-drawer',
    activate: { role: 'button', name: 'Open drawer' }
  },
  tooltip: { route: '/components/tooltip', selector: '.aheart-demo-panel .aheart-tooltip' },
  popover: { route: '/components/popover', selector: '.aheart-demo-panel .aheart-popover' },
  popconfirm: { route: '/components/popconfirm', selector: '.aheart-demo-panel .aheart-popconfirm' },
  splitter: { route: '/components/splitter', selector: '.aheart-demo-panel .aheart-splitter' },
  dnd: { route: '/components/dnd', selector: '.aheart-dnd-sortable-list' },
  ai: { route: '/components/ai', selector: '.aheart-ai-chat-panel' },
  'ai-form': { route: '/components/ai-form', selector: '.aheart-ai-form' },
  'ai-agent-workbench': { route: '/components/ai-agent-workbench', selector: '.aheart-ai-workbench' }
}

test.describe('QG1 Ready component contracts', () => {
  for (const record of qualityMatrix.filter((candidate) => candidate.risk === 'R1')) {
    test(`${record.component} exposes its Chinese product route and component entry`, async ({ page }) => {
      const contract = contracts[record.component]
      expect(contract, `Missing R1 contract for ${record.component}`).toBeDefined()

      await page.goto(contract.route)
      await expect(page.locator('.vp-doc h1')).toBeVisible()
      if (contract.activate) {
        await page.getByRole(contract.activate.role, { name: contract.activate.name, exact: true }).first().click()
      }
      await expect(page.locator(contract.selector).first()).toBeVisible()
    })
  }
})
