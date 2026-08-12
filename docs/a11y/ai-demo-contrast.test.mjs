import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const stylesheet = fs.readFileSync(new URL('../.vitepress/theme/style.css', import.meta.url), 'utf8')

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255)
  const linear = channels.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrastRatio(foreground, background) {
  const light = relativeLuminance(foreground)
  const dark = relativeLuminance(background)
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05)
}

test('AI artifact preview emphasis has AA contrast on its demo surface', () => {
  const rule = stylesheet.match(/\.aheart-ai-demo-artifact-preview > span\s*\{([^}]+)\}/)?.[1]
  const color = rule?.match(/color:\s*(#[0-9a-f]{6})/i)?.[1]

  assert.ok(color, 'the demo emphasis rule must define a hex text color')
  assert.ok(
    contrastRatio(color, '#f8fbff') >= 4.5,
    `${color} must have at least 4.5:1 contrast on #f8fbff`,
  )
})
