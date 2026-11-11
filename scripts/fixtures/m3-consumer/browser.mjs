import { chromium, expect } from '@playwright/test'
import { build, preview } from 'vite'

export async function verifyBrowser() {
  await build({ configFile: false, logLevel: 'error' })
  const browser = await chromium.launch()
  try {
    const server = await preview({ configFile: false, preview: { host: '127.0.0.1', port: 0 } })
    try {
      const results = []
      for (const viewport of [{ width: 1200, height: 800 }, { width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        try {
          await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`)
          const chat = page.getByRole('region', { name: 'AI 对话' })
          await expect(chat).toHaveCSS('display', 'grid')
          const composer = chat.getByRole('textbox', { name: '消息内容' })
          await composer.fill('发送消费端消息')
          await composer.press('Enter')
          await expect(chat.getByText('收到消费端消息', { exact: true })).toBeVisible()

          const submit = page.getByRole('button', { name: '创建任务' })
          await expect(page.locator('.aheart-ai-form')).toHaveCSS('display', 'grid')
          await submit.click()
          await expect(page.getByText('任务名称为必填项').first()).toBeVisible()
          await page.getByRole('textbox', { name: /任务名称/ }).fill('验证 M3 迁移', { timeout: 5000 })
          await submit.click()
          await expect(page.getByText('已创建：验证 M3 迁移', { exact: true })).toBeVisible()
          expect(errors).toEqual([])
          results.push({ viewport, chat: 'passed', agent: 'passed' })
        } finally {
          await page.close()
        }
      }
      return { engine: 'chromium', version: browser.version(), results }
    } finally {
      await new Promise(resolve => server.httpServer.close(resolve))
    }
  } finally {
    await browser.close()
  }
}
