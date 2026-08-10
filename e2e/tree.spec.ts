import { expect, test } from '@playwright/test'

const unhandledRejectionsKey = '__qg3TreeUnhandledRejections__'

test('Tree workbench keeps controlled keys, focus, keyboard navigation, and disabled states observable', async ({ page }) => {
  const runtimeErrors: string[] = []

  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) {
      runtimeErrors.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  await page.addInitScript((key) => {
    window.addEventListener('unhandledrejection', (event) => {
      const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
      target[key] = [...(target[key] ?? []), String(event.reason)]
    })
  }, unhandledRejectionsKey)

  await page.goto('/components/tree')

  const workbench = page.getByRole('region', { name: '树交互工作台', exact: true })
  await expect(workbench).toBeVisible()
  const tree = workbench.getByRole('tree', { name: '受控三层树', exact: true })
  await expect(tree).toBeVisible()
  await expect(tree.getByRole('treeitem')).toHaveCount(2)

  const rootItem = tree.getByRole('treeitem', { name: /根节点/ }).first()
  const root = rootItem.locator('[data-tree-key]')
  const leafItem = tree.getByRole('treeitem', { name: /可选叶节点/ }).first()
  const leaf = leafItem.locator('[data-tree-key]')
  const state = workbench.getByTestId('tree-state')

  await workbench.getByRole('button', { name: '拒绝展开更新', exact: true }).click()
  await root.focus()
  await root.press('ArrowRight')
  await expect(tree.getByRole('treeitem')).toHaveCount(2)
  await expect(rootItem).toHaveAttribute('aria-expanded', 'false')
  await expect(tree.getByRole('treeitem', { name: /一级子节点/ })).toHaveCount(0)
  await expect(state).toContainText('expanded=[]')
  await expect(state).toContainText('expand-events=1')
  await workbench.getByRole('button', { name: '接受展开更新', exact: true }).click()
  await root.press('ArrowRight')
  await expect(tree.getByRole('treeitem', { name: /一级子节点/ }).first().locator('[data-tree-key]')).toBeFocused()

  const firstChild = tree.getByRole('treeitem', { name: /一级子节点/ }).first().locator('[data-tree-key]')
  const secondChild = tree.getByRole('treeitem', { name: /二级子节点/ }).first().locator('[data-tree-key]')
  await firstChild.press('ArrowRight')
  await expect(secondChild).toBeFocused()
  await secondChild.press('ArrowLeft')
  await expect(firstChild).toBeFocused()

  await secondChild.focus()
  await secondChild.press('Home')
  await expect(tree.getByRole('treeitem').first().locator('[data-tree-key]')).toBeFocused()
  await tree.getByRole('treeitem').first().locator('[data-tree-key]').press('End')
  await expect(tree.getByRole('treeitem').last().locator('[data-tree-key]')).toBeFocused()

  const checkedLeaf = leaf.getByRole('checkbox')
  await checkedLeaf.check()
  await expect(checkedLeaf).not.toBeChecked()
  await workbench.getByRole('button', { name: '接受勾选更新', exact: true }).click()
  await checkedLeaf.check()
  await expect(checkedLeaf).toBeChecked()

  await workbench.getByRole('button', { name: '拒绝选择更新', exact: true }).click()
  await leaf.press('Enter')
  await expect(state).toContainText('selected=[]')
  await expect(leafItem).toHaveAttribute('aria-selected', 'false')
  await expect(state).toContainText('select-events=1')
  await workbench.getByRole('button', { name: '接受选择更新', exact: true }).click()
  await leaf.press('Enter')
  await expect(leafItem).toHaveAttribute('aria-selected', 'true')
  const anotherLeaf = tree.getByRole('treeitem', { name: /另一个叶节点/ }).first()
  await anotherLeaf.locator('[data-tree-key]').press('Enter')
  await expect(state).toContainText('select-events=3')
  await anotherLeaf.locator('[data-tree-key]').press('Enter')
  await expect(state).toContainText('select-events=4')

  await tree.evaluate((element) => { element.scrollTop = 80 })
  await checkedLeaf.focus()
  await checkedLeaf.press('Space')
  await expect.poll(() => tree.evaluate((element) => element.scrollTop)).toBe(80)

  const disabledLeafItem = tree.getByRole('treeitem', { name: /禁用叶节点/ }).first()
  const disabledLeaf = disabledLeafItem.locator('[data-tree-key]')
  await disabledLeaf.click()
  await expect(state).toContainText('select-events=3')
  await workbench.getByRole('button', { name: '禁用整树', exact: true }).click()
  await expect(tree.getByRole('checkbox').first()).toBeDisabled()
  await disabledLeaf.click()
  await expect(state).toContainText('select-events=4')

  await workbench.getByRole('button', { name: '外部折叠', exact: true }).click()
  await expect(tree.getByRole('treeitem').first().locator('[data-tree-key]')).toBeFocused()
  await expect(tree.getByRole('treeitem').first()).toHaveAttribute('aria-expanded', 'false')
  await expect(tree.getByRole('treeitem', { name: /一级子节点/ })).toHaveCount(0)
  await expect(state).toContainText('expanded=[]')

  const unhandledRejections = await page.evaluate((key) => {
    const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
    return target[key] ?? []
  }, unhandledRejectionsKey)
  expect([...runtimeErrors, ...unhandledRejections]).toEqual([])
})
