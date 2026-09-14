import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
async function inventory(directory, prefix = '') {
  const files = []
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    assert(!entry.isSymbolicLink(), 'gzip assets cannot be symlinks')
    if (entry.isDirectory()) files.push(...await inventory(directory, relative))
    else {
      assert(entry.isFile() && /\.(js|css)$/.test(relative), 'unexpected gzip asset')
      const bytes = await readFile(path.join(directory, relative))
      files.push({ path: relative, bytes: bytes.length, sha256: hash(bytes) })
    }
  }
  return files.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)
}

export async function persistGzipArtifacts(source, destination, embeddedFiles) {
  await mkdir(destination) // Refuse to overwrite an existing evidence directory.
  const directory = path.join(destination, 'bundle')
  await cp(source, directory, { recursive: true })
  const files = await inventory(directory)
  const manifestPath = path.join(destination, 'manifest.json')
  const bytes = Buffer.from(`${JSON.stringify({ files }, null, 2)}\n`)
  await writeFile(manifestPath, bytes)
  const binding = { directory, manifestPath, manifestSha256: hash(bytes) }
  await verifyGzipArtifacts(binding, embeddedFiles)
  return binding
}

export async function verifyGzipArtifacts(binding, embeddedFiles) {
  const manifestBytes = await readFile(binding.manifestPath)
  assert.equal(hash(manifestBytes), binding.manifestSha256, 'gzip manifest hash mismatch')
  const { files } = JSON.parse(manifestBytes)
  const actual = await inventory(binding.directory)
  assert.deepEqual(actual.map(file => file.path), files.map(file => file.path), 'gzip asset set mismatch')
  assert.deepEqual(actual, files, 'gzip asset hash mismatch')
  assert.deepEqual([...embeddedFiles.map(file => file.path)].sort(), actual.map(file => file.path), 'gzip embedded asset set mismatch')
  for (const file of actual) {
    const embedded = embeddedFiles.find(item => item.path === file.path)
    const bytes = await readFile(path.join(binding.directory, file.path))
    assert(bytes.equals(Buffer.from(embedded.contentBase64 ?? '', 'base64')), 'gzip embedded bytes mismatch')
    assert.equal(embedded.rawBytes, bytes.length, 'gzip raw size mismatch')
    assert.equal(embedded.rawSha256, hash(bytes), 'gzip raw hash mismatch')
    assert.equal(embedded.gzipBytes, gzipSync(bytes, { level: 9 }).length, 'gzip size mismatch')
  }
  return { status: 'passed', files: actual.length }
}

export async function verifyGzipSupplement(report) {
  const sourceBytes = await readFile(report.sourceReport.path)
  assert.equal(hash(sourceBytes), report.sourceReport.sha256, 'source report hash mismatch')
  const source = JSON.parse(sourceBytes)
  const totals = {}
  for (const side of ['baseline', 'candidate']) {
    const evidence = report.sides[side]
    assert.equal(evidence.tarballSha256, source.packages[side].sha256, 'supplement package binding mismatch')
    await verifyGzipArtifacts(evidence.binding, evidence.files)
    totals[side] = evidence.files.reduce((sum, file) => sum + file.gzipBytes, 0)
    assert.equal(evidence.gzipBytes, totals[side], 'supplement total mismatch')
  }
  assert.equal(report.deltaBytes, totals.candidate - totals.baseline, 'supplement delta mismatch')
  assert.equal(report.limitBytes, 12 * 1024, 'supplement limit mismatch')
  assert(report.deltaBytes <= report.limitBytes, 'supplement exceeds gzip limit')
  return { status: 'passed', deltaBytes: report.deltaBytes }
}
