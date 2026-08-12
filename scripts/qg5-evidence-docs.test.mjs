import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const guide = readFileSync(new URL('../docs/guide/qg5-evidence.md', import.meta.url), 'utf8')
const config = readFileSync(new URL('../docs/.vitepress/config.ts', import.meta.url), 'utf8')

test('documents physical iOS Safari evidence without equating it to mobile WebKit automation', () => {
  assert.match(guide, /物理 iOS 设备/)
  assert.match(guide, /不能替代|不可替代/)
  assert.match(guide, /mobile-webkit/)
  assert.match(guide, /DnD.*触摸排序/s)
  assert.match(guide, /正文滚动/)
  assert.match(guide, /Splitter/)
  assert.match(guide, /取消.*清理/s)
  assert.match(guide, /SHA-256/)
})

test('documents the two-stage master stability gate and exposes the guide in Chinese navigation', () => {
  assert.match(guide, /连续 10 次/)
  assert.match(guide, /低于 1%/)
  assert.match(guide, /测量期/)
  assert.match(guide, /强门禁期/)
  assert.match(config, /QG5 证据/)
  assert.match(config, /\/guide\/qg5-evidence/)
})
