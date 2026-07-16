import { existsSync } from 'node:fs'
import path from 'node:path'

const packageRoot = {
  'aheart-ui': 'packages/components/',
  '@aheart-ui/dnd': 'packages/dnd/',
  '@aheart-ui/ai': 'packages/ai/'
}

const directFields = (source, start) => {
  let depth = 0
  let quote = ''
  let escaped = false
  let fields = ''
  for (let index = start; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (depth === 1) fields += character
      if (!escaped && character === quote) quote = ''
      escaped = !escaped && character === '\\'
      continue
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character
      if (depth === 1) fields += character
      continue
    }
    if (character === '{') { depth += 1; continue }
    if (character === '}') {
      depth -= 1
      if (depth === 0) return fields
      continue
    }
    if (depth === 1) fields += character
  }
  return ''
}

export const parseReadyComponentKeys = (source) => {
  const keys = []
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== '{') continue
    const fields = directFields(source, index)
    const key = fields.match(/\bkey\s*:\s*'([^']+)'/)
    if (key && /\bstatus\s*:\s*'Ready'/.test(fields)) keys.push(key[1])
  }
  return keys
}

const validateEvidenceItem = (record, category, evidence, root) => {
  if (evidence.kind === 'notApplicable') {
    if (!evidence.reason?.trim()) throw new Error(`${record.component}.${category} needs a notApplicable reason`)
    return
  }
  if (evidence.kind !== 'file' || !evidence.path) throw new Error(`${record.component}.${category} has invalid evidence`)
  if (!existsSync(path.join(root, evidence.path))) throw new Error(`${record.component}.${category} evidence is missing: ${evidence.path}`)
  if (category === 'unit' && !evidence.path.startsWith(packageRoot[record.package])) {
    throw new Error(`${record.component}.unit crosses package boundary: ${evidence.path}`)
  }
}

export const validateEvidence = (record, root) => {
  for (const category of ['unit', 'e2e', 'ssr', 'a11y', 'visual']) {
    if (!Array.isArray(record[category]) || record[category].length === 0) throw new Error(`${record.component}.${category} is missing`)
    record[category].forEach((evidence) => validateEvidenceItem(record, category, evidence, root))
  }
}
