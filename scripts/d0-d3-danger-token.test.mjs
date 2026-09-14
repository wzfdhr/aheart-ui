import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const parseHex = value => {
  const match = value.match(/^#([0-9a-f]{6})$/i)
  assert.ok(match, `expected a six-digit danger token, received ${value}`)
  return [0, 2, 4].map(offset => Number.parseInt(match[1].slice(offset, offset + 2), 16))
}

const luminance = rgb => {
  const linear = channel => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2])
}

test('default danger token remains readable when used as text', async () => {
  const css = await readFile(path.join(root, 'packages/components/src/theme/index.css'), 'utf8')
  const value = css.match(/--aheart-color-danger:\s*(#[0-9a-f]{6})/i)?.[1]
  assert.ok(value, 'default danger token is missing')
  const foreground = luminance(parseHex(value))
  const background = luminance([255, 255, 255])
  const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
  assert.ok(ratio >= 4.5, `danger text contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`)
})
