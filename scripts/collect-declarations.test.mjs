import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { collectDeclarations } from './collect-declarations.mjs'

const appleDouble = Buffer.alloc(26)
appleDouble.writeUInt32BE(0x00051607, 0)
appleDouble.writeUInt32BE(0x00020000, 4)

test('declaration audit skips verified AppleDouble companions and records them', async t => {
  const root = await mkdtemp(path.join(tmpdir(), 'aheart-declarations-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'card'))
  await writeFile(path.join(root, 'card/index.d.ts'), 'export declare const Card: unknown')
  await writeFile(path.join(root, 'card/._index.d.ts'), appleDouble)
  const ignored = []
  assert.deepEqual(await collectDeclarations(root, ignored), [path.join(root, 'card/index.d.ts')])
  assert.deepEqual(ignored, [path.join(root, 'card/._index.d.ts')])
})

test('filename prefixes alone cannot suppress declarations or malformed source', async t => {
  const root = await mkdtemp(path.join(tmpdir(), 'aheart-declarations-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const fixtures = { 'index.d.ts': 'export {}', '._index.d.ts': 'broken TypeScript', '._orphan.d.ts': appleDouble, 'binary.d.ts': appleDouble }
  for (const [name, data] of Object.entries(fixtures)) await writeFile(path.join(root, name), data)
  const ignored = []
  assert.deepEqual(await collectDeclarations(root, ignored), Object.keys(fixtures).map(name => path.join(root, name)).sort())
  assert.deepEqual(ignored, [])
})
