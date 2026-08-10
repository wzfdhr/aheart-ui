import { expect, test, type Page } from '@playwright/test'

const unhandledRejectionsKey = '__qg3UploadUnhandledRejections__'
const runtimeErrors = new WeakMap<Page, string[]>()

const file = (name: string) => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(`QG3 Upload contract: ${name}`)
})

const collectRuntimeErrors = async (page: Page) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) {
      errors.push(`${message.type()}: ${message.text()}`)
    }
  })
  await page.addInitScript((key) => {
    const errors: string[] = []
    ;(window as typeof window & Record<string, string[]>)[key] = errors
    window.addEventListener('unhandledrejection', (event) => errors.push(String(event.reason)))
  }, unhandledRejectionsKey)
}

const expectNoRuntimeErrors = async (page: Page) => {
  const unhandledRejections = await page.evaluate((key) =>
    (window as typeof window & Record<string, string[] | undefined>)[key] ?? [],
  unhandledRejectionsKey)
  expect([...runtimeErrors.get(page) ?? [], ...unhandledRejections]).toEqual([])
}

test.describe('QG3 Upload browser flows', () => {
  test.beforeEach(async ({ page }) => {
    await collectRuntimeErrors(page)
    await page.goto('/components/upload')
    await expect(page.getByTestId('upload-fixture'), 'QG3 Upload 测试夹具必须提供浏览器流程控件').toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    await expectNoRuntimeErrors(page)
  })

  test('uploads a real selected file through stable progress to success', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '进度与成功' })
    await scenario.getByLabel('选择文件').setInputFiles(file('progress.txt'))

    await expect(scenario.getByText('progress.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByTestId('upload-progress-status')).toHaveText('上传进度：50%')
    await scenario.getByRole('button', { name: '完成上传' }).click()
    await expect(scenario.getByTestId('upload-progress-status')).toHaveText('上传成功')
  })

  test('fails an upload and retries it through a visible control', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '失败与重试' })
    await scenario.getByLabel('选择文件').setInputFiles(file('failure.txt'))

    await expect(scenario.getByText('failure.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByTestId('upload-retry-status')).toHaveText('上传失败')
    await scenario.getByRole('button', { name: '重试 failure.txt' }).click()
    await expect(scenario.getByTestId('upload-retry-status')).toHaveText('等待重新上传')
    await expect(scenario.getByRole('button', { name: 'Upload' })).toBeVisible()
    await scenario.getByRole('button', { name: 'Upload' }).click()
    await expect(scenario.getByTestId('upload-retry-request-count')).toHaveText('请求次数：2')
    await expect(scenario.getByTestId('upload-retry-status')).toHaveText('上传成功')
  })

  test('holds manual uploads until the user clicks Upload', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '手动上传' })
    await scenario.getByLabel('选择文件').setInputFiles(file('manual.txt'))

    await expect(scenario.getByText('manual.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByTestId('upload-manual-request-count')).toHaveText('请求次数：0')
    await scenario.getByRole('button', { name: 'Upload' }).click()
    await expect(scenario.getByTestId('upload-manual-request-count')).toHaveText('请求次数：1')
    await expect(scenario.getByTestId('upload-manual-status')).toHaveText('上传成功')
  })

  test('does not restore an in-flight item after removal and a late callback', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '移除上传中的文件' })
    await scenario.getByLabel('选择文件').setInputFiles(file('pending.txt'))

    await expect(scenario.getByText('pending.txt', { exact: true })).toBeVisible()
    await scenario.getByRole('button', { name: '移除 pending.txt' }).click()
    await scenario.getByRole('button', { name: '完成待处理上传' }).click()
    await expect(scenario.getByText('pending.txt', { exact: true })).toHaveCount(0)
    await expect(scenario.getByTestId('upload-removal-status')).toHaveText('已移除')
  })

  test('prevents selection and upload actions when disabled', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '禁用上传' })
    const input = scenario.getByLabel('选择文件')
    await expect(input).toBeDisabled()

    await expect(scenario.getByTestId('upload-disabled-count')).toHaveText('已选择 0 个文件')
    await input.setInputFiles(file('disabled.txt'))
    await expect(scenario.getByTestId('upload-disabled-count')).toHaveText('已选择 0 个文件')
  })

  test('caps accepted files at maxCount and frees capacity after removal', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '最大文件数' })
    const input = scenario.getByLabel('选择文件')
    await input.setInputFiles([file('first.txt'), file('second.txt')])

    await expect(scenario.getByText('first.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByText('second.txt', { exact: true })).toHaveCount(0)
    await scenario.getByRole('button', { name: '移除 first.txt' }).click()
    await input.setInputFiles(file('replacement.txt'))
    await expect(scenario.getByText('replacement.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByTestId('upload-max-count')).toHaveText('已接受 1 个文件')
  })

  test('keeps a rejected controlled choice invisible without blocking the next accepted choice', async ({ page }) => {
    const scenario = page.getByRole('region', { name: '受控拒绝' })
    const input = scenario.getByLabel('选择文件')
    await input.setInputFiles(file('rejected.txt'))

    await expect(scenario.getByText('rejected.txt', { exact: true })).toHaveCount(0)
    await expect(scenario.getByTestId('upload-controlled-count')).toHaveText('已接受 0 个文件')
    await input.setInputFiles(file('accepted.txt'))
    await expect(scenario.getByText('accepted.txt', { exact: true })).toBeVisible()
    await expect(scenario.getByTestId('upload-controlled-count')).toHaveText('已接受 1 个文件')
  })
})
