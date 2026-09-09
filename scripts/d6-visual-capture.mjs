import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

const baseURL = process.argv[2] ?? 'http://127.0.0.1:5290'
const output = process.argv[3] ?? 'docs/superpowers/evidence/d6/visual'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
const selectedFile = (name) => ({ name, mimeType: 'text/plain', buffer: Buffer.from(`D6 visual ${name}`) })

const capture = async (page, name) => {
  const file = path.join(output, name)
  await page.screenshot({ path: file })
  results.push({ file, viewport: page.viewportSize(), url: page.url() })
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await desktop.goto(`${baseURL}/components/date-picker`, { waitUntil: 'networkidle' })
  const dateRange = desktop.getByRole('region', { name: 'D6 范围日期事务' })
  await dateRange.scrollIntoViewIfNeeded()
  await dateRange.getByRole('combobox').first().focus()
  let panel = desktop.locator('.aheart-date-range-picker__panel:visible')
  await panel.locator('[data-value="2026-07-16"]').first().click()
  await panel.locator('[data-value="2026-07-21"]').first().click()
  await capture(desktop, '01-date-range-deep-desktop.png')

  await desktop.goto(`${baseURL}/components/time-picker`, { waitUntil: 'networkidle' })
  const geometry = desktop.getByRole('region', { name: 'D6 时间列真实尺寸' })
  await geometry.scrollIntoViewIfNeeded()
  await geometry.getByRole('combobox').focus()
  panel = desktop.locator('.aheart-time-picker__panel:visible')
  await desktop.addStyleTag({ content: '.aheart-time-picker__column button { height: 52px !important; min-height: 52px !important; }' })
  const minuteColumn = panel.locator('[data-time-column="minute"]')
  await minuteColumn.evaluate((column) => {
    const target = column.querySelector('[data-minute="40"]')
    const columnRect = column.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    column.scrollTop += targetRect.top - columnRect.top + targetRect.height / 2 - column.clientHeight / 2
    column.dispatchEvent(new Event('scroll'))
  })
  await desktop.waitForTimeout(150)
  await capture(desktop, '02-time-geometry-desktop.png')

  await desktop.goto(`${baseURL}/components/upload`, { waitUntil: 'networkidle' })
  const cancel = desktop.getByRole('region', { name: '取消与任务隔离' })
  await cancel.getByLabel('选择文件').setInputFiles(selectedFile('cancel-visual.txt'))
  await cancel.getByRole('button', { name: '取消上传 cancel-visual.txt' }).click()
  await cancel.screenshot({ path: path.join(output, '03-upload-cancel-retry-desktop.png') })
  results.push({ file: path.join(output, '03-upload-cancel-retry-desktop.png'), viewport: desktop.viewportSize(), url: desktop.url() })

  const timeout = desktop.getByRole('region', { name: '上传超时' })
  await timeout.getByLabel('选择文件').setInputFiles(selectedFile('timeout-visual.txt'))
  await desktop.waitForTimeout(100)
  await timeout.screenshot({ path: path.join(output, '04-upload-timeout-desktop.png') })
  results.push({ file: path.join(output, '04-upload-timeout-desktop.png'), viewport: desktop.viewportSize(), url: desktop.url() })

  const validation = desktop.getByRole('region', { name: '上传校验失败' })
  await validation.getByLabel('选择文件').setInputFiles(selectedFile('invalid-visual.txt'))
  await validation.screenshot({ path: path.join(output, '05-upload-validation-desktop.png') })
  results.push({ file: path.join(output, '05-upload-validation-desktop.png'), viewport: desktop.viewportSize(), url: desktop.url() })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await mobile.goto(`${baseURL}/components/date-picker`, { waitUntil: 'networkidle' })
  const mobileRange = mobile.getByRole('region', { name: 'D6 范围日期事务' })
  await mobileRange.scrollIntoViewIfNeeded()
  await mobileRange.getByRole('combobox').first().focus()
  await capture(mobile, '06-date-range-mobile.png')

  await mobile.goto(`${baseURL}/components/upload`, { waitUntil: 'networkidle' })
  const mobileCancel = mobile.getByRole('region', { name: '取消与任务隔离' })
  await mobileCancel.scrollIntoViewIfNeeded()
  await mobileCancel.getByLabel('选择文件').setInputFiles(selectedFile('mobile-cancel.txt'))
  await mobileCancel.getByRole('button', { name: '取消上传 mobile-cancel.txt' }).click()
  await capture(mobile, '07-upload-cancel-mobile.png')

  await writeFile(path.join(output, 'capture.json'), `${JSON.stringify({ status: 'captured', results }, null, 2)}\n`)
  console.log(JSON.stringify({ status: 'captured', count: results.length, output }, null, 2))
} finally {
  await browser.close()
}
