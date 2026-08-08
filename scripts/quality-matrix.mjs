import { existsSync } from 'node:fs'
import path from 'node:path'

const packageRoot = {
  'aheart-ui': 'packages/components/',
  '@aheart-ui/dnd': 'packages/dnd/',
  '@aheart-ui/ai': 'packages/ai/'
}

const canonicalUnitPath = (record) => {
  const exceptions = {
    '@aheart-ui/dnd:dnd': 'packages/dnd/src/__tests__/dnd.test.ts',
    '@aheart-ui/ai:ai': 'packages/ai/src/__tests__/chat-panel.test.ts',
    '@aheart-ui/ai:ai-form': 'packages/ai/src/__tests__/form.test.ts',
    '@aheart-ui/ai:ai-agent-workbench': 'packages/ai/src/__tests__/agent-workbench.test.ts'
  }
  return exceptions[`${record.package}:${record.component}`]
    ?? `${packageRoot[record.package]}src/${record.component}/__tests__/${record.component}.test.ts`
}

const canonicalE2ePath = (record) => {
  if (record.component === 'date-picker') return 'e2e/date-picker.spec.ts'
  if (record.component === 'time-picker') return 'e2e/time-picker-range.spec.ts'
  if (record.component === 'ai' || record.component.startsWith('ai-')) return 'e2e/q5-ai-product-suite.spec.ts'
  return 'e2e/docs-component-smoke.spec.ts'
}

const canonicalSsrPath = {
  'date-picker': 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts',
  'time-picker': 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts'
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
    const key = fields.match(/\bkey\s*:\s*(['"])([^'"`]+)\1/)
    if (key && /\bstatus\s*:\s*(['"])Ready\1/.test(fields)) keys.push(key[2])
  }
  return keys
}

const validateEvidenceItem = (record, category, evidence, root) => {
  if (['a11y', 'visual'].includes(category) && evidence.kind !== 'planned') {
    throw new Error(`${record.component}.${category} evidence must be planned for QG4`)
  }
  if (evidence.kind === 'notApplicable') {
    if (category === 'ssr' && canonicalSsrPath[record.component]) {
      throw new Error(`${record.component}.ssr has a dedicated SSR file and cannot be notApplicable`)
    }
    if (category === 'ssr') throw new Error(`${record.component}.ssr SSR evidence cannot be notApplicable`)
    if (!evidence.reason?.trim()) throw new Error(`${record.component}.${category} needs a notApplicable reason`)
    return
  }
  if (evidence.kind === 'planned') {
    if (category === 'e2e' && evidence.milestone === 'QG2' && !['dnd', 'splitter'].includes(record.component)) {
      throw new Error(`${record.component}.e2e QG2 e2e planned evidence is only allowed for dnd and splitter`)
    }
    if (category === 'ssr' && evidence.milestone === 'QG6' && evidence.status !== 'deferred') {
      throw new Error(`${record.component}.ssr SSR planned evidence must be deferred at QG6`)
    }
    if (category === 'ssr' && canonicalSsrPath[record.component]) {
      throw new Error(`${record.component}.ssr has a dedicated SSR file and cannot be deferred`)
    }
    const qg4Coverage = ['a11y', 'visual'].includes(category) && evidence.milestone === 'QG4'
    const qg2BrowserPlan = category === 'e2e' && evidence.milestone === 'QG2'
    const qg6SsrDefer = category === 'ssr' && evidence.milestone === 'QG6' && evidence.status === 'deferred'
    if (!(qg4Coverage || qg2BrowserPlan || qg6SsrDefer) || !evidence.reason?.trim()) {
      throw new Error(`${record.component}.${category} has an invalid planned evidence item`)
    }
    return
  }
  if (evidence.kind !== 'file' || !evidence.path) throw new Error(`${record.component}.${category} has invalid evidence`)
  if (!existsSync(path.join(root, evidence.path))) throw new Error(`${record.component}.${category} evidence is missing: ${evidence.path}`)
  if (category === 'unit' && !evidence.path.startsWith(packageRoot[record.package])) {
    throw new Error(`${record.component}.unit crosses package boundary: ${evidence.path}`)
  }
  if (category === 'unit' && evidence.path !== canonicalUnitPath(record)) {
    throw new Error(`${record.component}.unit does not match the canonical component test: ${evidence.path}`)
  }
  if (category === 'e2e' && evidence.path !== canonicalE2ePath(record)) {
    throw new Error(`${record.component}.e2e does not match the canonical component browser evidence: ${evidence.path}`)
  }
  if (category === 'ssr' && canonicalSsrPath[record.component] && evidence.path !== canonicalSsrPath[record.component]) {
    throw new Error(`${record.component}.ssr does not match the dedicated SSR file: ${evidence.path}`)
  }
}

export const validateEvidence = (record, root) => {
  for (const category of ['unit', 'e2e', 'ssr', 'a11y', 'visual']) {
    if (!Array.isArray(record[category]) || record[category].length === 0) throw new Error(`${record.component}.${category} is missing`)
    record[category].forEach((evidence) => validateEvidenceItem(record, category, evidence, root))
  }
}
