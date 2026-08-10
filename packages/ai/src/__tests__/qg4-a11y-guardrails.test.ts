import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylePath = resolve(process.cwd(), 'src/style.css')
const docsConfigPath = resolve(process.cwd(), '../../docs/.vitepress/config.ts')

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

  it('declares the docs shell language and title metadata explicitly', async () => {
    const config = await readFile(docsConfigPath, 'utf8')

    expect(config).toMatch(/\btitle:\s*['"]Aheart UI['"]/)
    expect(config).toMatch(/\blang:\s*['"]zh-CN['"]/)
  })
})
