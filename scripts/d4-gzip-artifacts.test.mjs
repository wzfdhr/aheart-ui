import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'

test('gzip recollection fixes CommonJS wrapping and requires repeat-build equality', async () => {
  const source = await readFile(new URL('./d4-gzip-recollect.mjs', import.meta.url), 'utf8')
  assert.match(source, /strictRequires:\s*true/)
  assert.match(source, /gzip repeat build differs/)
})

test('gzip artifacts are reopened with exact asset sets and embedded bytes', async () => {
  const { persistGzipArtifacts, verifyGzipArtifacts, verifyGzipSupplement } = await import('./d4-gzip-artifacts.mjs')
  const root = await mkdtemp(path.join(tmpdir(), 'd4-gzip-binding-'))
  try {
    const source = path.join(root, 'source')
    await mkdir(source)
    const content = Buffer.from('export const Tree={},TreeSelect={},Cascader={};')
    await writeFile(path.join(source, 'entry.js'), content)
    const files = [{ path: 'entry.js', contentBase64: content.toString('base64'), rawBytes: content.length, rawSha256: createHash('sha256').update(content).digest('hex'), gzipBytes: gzipSync(content, { level: 9 }).length }]
    const binding = await persistGzipArtifacts(source, path.join(root, 'durable'), files)
    await verifyGzipArtifacts(binding, files)
    const sourcePath = path.join(root, 'source-report.json')
    const sourceBytes = Buffer.from(JSON.stringify({ packages: { baseline: { sha256: 'baseline' }, candidate: { sha256: 'candidate' } } }))
    await writeFile(sourcePath, sourceBytes)
    const supplement = { sourceReport: { path: sourcePath, sha256: createHash('sha256').update(sourceBytes).digest('hex') }, sides: Object.fromEntries(['baseline', 'candidate'].map(side => [side, { binding, files, tarballSha256: side, gzipBytes: files[0].gzipBytes }])), deltaBytes: 0, limitBytes: 12288 }
    await verifyGzipSupplement(supplement)
    for (const [field, value] of [['deltaBytes', -1], ['limitBytes', 99999]]) {
      await assert.rejects(() => verifyGzipSupplement({ ...supplement, [field]: value }), /supplement/)
    }
    await assert.rejects(() => verifyGzipSupplement({ ...supplement, sides: { ...supplement.sides, candidate: { ...supplement.sides.candidate, gzipBytes: 0 } } }), /total/)
    await assert.rejects(() => verifyGzipArtifacts(binding, [{ ...files[0], gzipBytes: 0 }]), /gzip size/)
    await assert.rejects(() => persistGzipArtifacts(source, path.join(root, 'durable'), files), /EEXIST/)
    const manifest = await readFile(binding.manifestPath)
    await writeFile(binding.manifestPath, '{}')
    await assert.rejects(() => verifyGzipArtifacts(binding, files), /manifest hash/)
    await writeFile(binding.manifestPath, manifest)
    await symlink(path.join(source, 'entry.js'), path.join(binding.directory, 'linked.js'))
    await assert.rejects(() => verifyGzipArtifacts(binding, files), /symlinks/)
    await rm(path.join(binding.directory, 'linked.js'))
    await assert.rejects(() => verifyGzipArtifacts(binding, [{ ...files[0], contentBase64: Buffer.from('export {};').toString('base64') }]), /embedded bytes/)
    await writeFile(path.join(binding.directory, 'extra.js'), 'extra')
    await assert.rejects(() => verifyGzipArtifacts(binding, files), /asset set/)
    await rm(path.join(binding.directory, 'extra.js'))
    await writeFile(path.join(binding.directory, 'entry.js'), 'tampered')
    await assert.rejects(() => verifyGzipArtifacts(binding, files), /hash/)
    await rm(path.join(binding.directory, 'entry.js'))
    await assert.rejects(() => verifyGzipArtifacts(binding, files), /asset set/)
  } finally { await rm(root, { recursive: true, force: true }) }
})
