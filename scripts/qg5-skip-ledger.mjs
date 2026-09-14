import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ledgerPath = path.join(root, 'docs/superpowers/evidence/d9-skip-ledger.json')

const readLedger = async () => JSON.parse(await readFile(ledgerPath, 'utf8'))

export const collectSkipSites = async () => {
  const files = (await import('node:fs/promises')).readdir(path.join(root, 'e2e'))
  const sites = []
  for (const file of await files) {
    if (!file.endsWith('.spec.ts')) continue
    const relative = `e2e/${file}`
    const source = await readFile(path.join(root, relative), 'utf8')
    source.split('\n').forEach((line, index) => {
      if (/\btest\.skip\s*\(/.test(line)) sites.push({ file: relative, line: index + 1 })
    })
  }
  return sites.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
}

export const validateSkipLedger = async () => {
  const ledger = await readLedger()
  if (ledger.schemaVersion !== 'd9-skip-ledger.v1') throw new Error('unsupported skip ledger schema')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ledger.defaultExpiry)) throw new Error('defaultExpiry must be YYYY-MM-DD')
  const sourceSites = await collectSkipSites()
  const entries = ledger.sites ?? []
  const keys = (site) => `${site.file}:${site.line}`
  const entryKeys = entries.map(keys)
  if (new Set(entryKeys).size !== entryKeys.length) throw new Error('skip ledger contains duplicate sites')
  const sourceKeys = sourceSites.map(keys)
  const missing = sourceKeys.filter((key) => !entryKeys.includes(key))
  const stale = entryKeys.filter((key) => !sourceKeys.includes(key))
  if (missing.length || stale.length) throw new Error(`skip ledger mismatch; missing=${missing.join(',') || 'none'} stale=${stale.join(',') || 'none'}`)
  for (const entry of entries) {
    if (!entry.id || !entry.reason || !entry.owner || !entry.issue || !/^\d{4}-\d{2}-\d{2}$/.test(entry.expiresOn)) {
      throw new Error(`skip ledger entry is incomplete: ${entry.id ?? `${entry.file}:${entry.line}`}`)
    }
    if (entry.expiresOn < ledger.reviewedAt) throw new Error(`skip ledger entry is expired: ${entry.id}`)
  }
  return { ok: true, count: entries.length, missing, stale }
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href) {
  validateSkipLedger().then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}
