import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylePath = resolve(process.cwd(), 'src/style.css')
const docsConfigPath = resolve(process.cwd(), '../../docs/.vitepress/config.ts')

const hexColor = (css: string, token: string) => {
  const match = css.match(new RegExp(`${token}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!match) throw new Error(`Missing CSS color token: ${token}`)
  return match[1]
}

const relativeLuminance = (hex: string) => {
  const channels = hex.slice(1).match(/../g)?.map((channel) => Number.parseInt(channel, 16) / 255)
  if (!channels || channels.length !== 3) throw new Error(`Invalid hex color: ${hex}`)
  const linear = channels.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

describe('QG4 execution and docs shell guardrails', () => {
  it('keeps execution content from becoming a fixed-width nested scroller', async () => {
    const css = await readFile(stylePath, 'utf8')

    expect(css).toMatch(/\.aheart-ai-workbench__execution-content\s*\{[^}]*min-inline-size:\s*0;/s)
    expect(css).toMatch(/\.aheart-ai-workbench__execution-content\s*\{[^}]*overflow-x:\s*hidden;/s)
  })

  it('defines execution colors for dark mode and disables its motion under reduced motion', async () => {
    const css = await readFile(stylePath, 'utf8')

    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/)
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.aheart-ai-workbench/)
  })

  it('keeps AI interactive and metadata colors at WCAG AA contrast', async () => {
    const css = await readFile(stylePath, 'utf8')
    const brandStrong = hexColor(css, '--aheart-ai-brand-strong')
    const cyanStrong = hexColor(css, '--aheart-ai-cyan-strong')

    expect(contrastRatio(brandStrong, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(brandStrong, '#f8fafc')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(cyanStrong, '#f8fbff')).toBeGreaterThanOrEqual(4.5)
    expect(css).toMatch(/\.aheart-ai-sources\s+a\s*\{[^}]*color:\s*var\(--aheart-ai-brand-strong\)/s)
    expect(css).toMatch(/\.aheart-ai-workbench__mobile\s+\.aheart-tabs__tab\.is-active\s*\{[^}]*color:\s*var\(--aheart-ai-brand-strong\)/s)
    expect(css).toMatch(/\.aheart-ai-workbench__artifact-preview-header\s+span\s*\{[^}]*color:\s*var\(--aheart-ai-cyan-strong\)/s)
  })

  it('declares the docs shell language and title metadata explicitly', async () => {
    const config = await readFile(docsConfigPath, 'utf8')

    expect(config).toMatch(/\btitle:\s*['"]Aheart UI['"]/)
    expect(config).toMatch(/\blang:\s*['"]zh-CN['"]/)
  })
})
