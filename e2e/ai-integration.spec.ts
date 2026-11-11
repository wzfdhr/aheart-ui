import { expect, test } from '@playwright/test'
import { getComponentCategories } from '../docs/.vitepress/data/components'

test('publishes the installable skill and the component index with usable documentation links', async ({ page, request }) => {
  await page.goto('/guide/usage.html')
  const guideLink = page.locator('#VPSidebarNav').getByRole('link', { name: 'AI 接入', exact: true, includeHidden: true })
  const guidePath = await guideLink.getAttribute('href')
  await page.goto(guidePath!)
  await expect(page.getByRole('heading', { level: 1, name: /^AI 接入/ })).toBeVisible()
  await expect(page.getByText('npx skills add https://labradorca.github.io/aheart-ui/ai/aheart-ui/SKILL.md --skill aheart-ui -a codex')).toBeVisible()

  const indexPath = await page.getByRole('link', { name: 'search-index.json' }).getAttribute('href')
  const indexUrl = new URL(indexPath!, page.url())
  const indexResponse = await request.get(indexUrl.href)
  expect(indexResponse.ok()).toBe(true)
  const index = await indexResponse.json()
  const readyKeys = getComponentCategories('zh').flatMap(({ components }) => components
    .filter(({ status }) => status === 'Ready').map(({ key }) => key))
  expect(index.components.map(({ key }: { key: string }) => key)).toEqual(readyKeys)
  expect(index.components.find(({ key }: { key: string }) => key === 'table').description).toMatch(/筛选.*分页.*行选择/)

  for (const [key, packageName, api] of [
    ['table', 'aheart-ui', 'selectedRowKeys'],
    ['ai-form', '@aheart-ui/ai', 'AIFormSchemaV1'],
    ['dnd', '@aheart-ui/dnd', 'SortableList']
  ]) {
    const component = index.components.find((entry: { key: string }) => entry.key === key)
    expect(component.packageName).toBe(packageName)
    expect(index.packages[packageName].styleImport).toBe(`${packageName}/style.css`)

    const [markdown, docs] = await Promise.all([
      request.get(new URL(component.markdownPath, indexUrl).href),
      request.get(new URL(component.docsPath, indexUrl).href)
    ])
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain(api)
    expect(docs.ok()).toBe(true)
    expect(await docs.text()).toContain(api)
  }

  const downloadLink = page.getByRole('link', { name: '下载 SKILL.md' })
  const skillPath = await downloadLink.getAttribute('href')
  const skill = await request.get(skillPath!)
  expect(skill.ok()).toBe(true)
  expect(await skill.text()).toMatch(/^---\nname: aheart-ui\n/)
  const [download] = await Promise.all([page.waitForEvent('download'), downloadLink.click()])
  expect(download.suggestedFilename()).toBe('SKILL.md')

  const discoveryPath = await page.getByRole('link', { name: 'llms.txt' }).getAttribute('href')
  const discovery = await request.get(discoveryPath!)
  expect(discovery.ok()).toBe(true)
  expect(await discovery.text()).toContain('ai/search-index.json')
})
