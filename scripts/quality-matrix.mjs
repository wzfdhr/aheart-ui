import { existsSync, lstatSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { e2ePolicyFor, qg1ComponentContractPath } from '../docs/.vitepress/data/quality-evidence-policy.mjs'

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

const canonicalSsrPath = {
  'date-picker': 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts',
  'time-picker': 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts'
}

export const parseReadyComponentKeys = (source) => {
  let sourceFile = ts.createSourceFile('components.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  if (sourceFile.parseDiagnostics.length) {
    const wrapped = `const __qualityMatrixFixture = (${source})`
    const wrappedSourceFile = ts.createSourceFile('components.ts', wrapped, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    if (!wrappedSourceFile.parseDiagnostics.length) sourceFile = wrappedSourceFile
  }
  if (sourceFile.parseDiagnostics.length) {
    throw new Error(`Cannot parse Ready component metadata: ${sourceFile.parseDiagnostics[0].messageText}`)
  }

  const constants = new Map()
  const collectConstants = (node) => {
    if (ts.isVariableStatement(node) && (node.declarationList.flags & ts.NodeFlags.Const)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) constants.set(declaration.name.text, declaration.initializer)
      }
    }
    ts.forEachChild(node, collectConstants)
  }
  collectConstants(sourceFile)

  const unwrap = (node) => {
    let current = node
    while (
      ts.isParenthesizedExpression(current) || ts.isAsExpression(current) ||
      ts.isTypeAssertionExpression(current) || ts.isSatisfiesExpression(current) || ts.isNonNullExpression(current)
    ) current = current.expression
    return current
  }

  const evaluateString = (node, seen = new Set()) => {
    const expression = unwrap(node)
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text
    if (!ts.isIdentifier(expression) || seen.has(expression.text) || !constants.has(expression.text)) return undefined
    return evaluateString(constants.get(expression.text), new Set([...seen, expression.text]))
  }

  const propertyName = (name) => {
    if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
    return undefined
  }

  const objectFields = (node, seen = new Set()) => {
    const expression = unwrap(node)
    if (ts.isIdentifier(expression)) {
      if (seen.has(expression.text) || !constants.has(expression.text)) return undefined
      return objectFields(constants.get(expression.text), new Set([...seen, expression.text]))
    }
    if (!ts.isObjectLiteralExpression(expression)) return undefined

    const fields = new Map()
    let unresolvedSpread = false
    for (const property of expression.properties) {
      if (ts.isSpreadAssignment(property)) {
        const spread = objectFields(property.expression, seen)
        if (!spread) {
          unresolvedSpread = true
          continue
        }
        for (const [name, value] of spread.fields) fields.set(name, value)
        unresolvedSpread ||= spread.unresolvedSpread
        continue
      }
      if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property.name)
        if (name) fields.set(name, property.initializer)
      } else if (ts.isShorthandPropertyAssignment(property)) {
        fields.set(property.name.text, property.name)
      }
    }
    return { fields, unresolvedSpread }
  }

  const keys = []
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const object = objectFields(node)
      const keyNode = object?.fields.get('key')
      const statusNode = object?.fields.get('status')
      const key = keyNode ? evaluateString(keyNode) : undefined
      if (!statusNode && key && object.unresolvedSpread) {
        throw new Error(`Cannot statically evaluate status for component "${key}": unsupported object spread`)
      }
      if (statusNode && (keyNode || object.unresolvedSpread)) {
        const status = evaluateString(statusNode)
        if (status === undefined) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(statusNode.getStart(sourceFile))
          throw new Error(`Cannot statically evaluate status for component "${key ?? 'unknown'}" at ${line + 1}:${character + 1}`)
        }
        if (!key) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition((keyNode ?? node).getStart(sourceFile))
          throw new Error(`Cannot statically evaluate key for component metadata with status "${status}" at ${line + 1}:${character + 1}`)
        }
        if (status === 'Ready') keys.push(key)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(constants.get('categoryDefinitions') ?? sourceFile)
  return keys
}

const isWithin = (parent, candidate) => {
  const relative = path.relative(parent, candidate)
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
}

const resolveEvidenceFile = (record, category, evidence, root) => {
  if (path.isAbsolute(evidence.path)) {
    throw new Error(`${record.component}.${category} evidence is outside repository root: ${evidence.path}`)
  }
  const resolved = path.resolve(root, evidence.path)
  if (!isWithin(root, resolved)) {
    throw new Error(`${record.component}.${category} evidence is outside repository root: ${evidence.path}`)
  }
  if (!existsSync(resolved)) throw new Error(`${record.component}.${category} evidence is missing: ${evidence.path}`)
  if (!lstatSync(resolved).isFile()) throw new Error(`${record.component}.${category} evidence must be a regular file: ${evidence.path}`)
  return resolved
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
    if (category === 'ssr' && evidence.milestone === 'QG6' && evidence.status !== 'deferred') {
      throw new Error(`${record.component}.ssr SSR planned evidence must be deferred at QG6`)
    }
    if (category === 'ssr' && canonicalSsrPath[record.component]) {
      throw new Error(`${record.component}.ssr has a dedicated SSR file and cannot be deferred`)
    }
    const qg4Coverage = ['a11y', 'visual'].includes(category) && evidence.milestone === 'QG4'
    const browserPlan = category === 'e2e' && ['QG2', 'QG3'].includes(evidence.milestone)
    const qg6SsrDefer = category === 'ssr' && evidence.milestone === 'QG6' && evidence.status === 'deferred'
    if (!(qg4Coverage || browserPlan || qg6SsrDefer) || !evidence.reason?.trim()) {
      throw new Error(`${record.component}.${category} has an invalid planned evidence item`)
    }
    return
  }
  if (evidence.kind !== 'file' || !evidence.path) throw new Error(`${record.component}.${category} has invalid evidence`)
  const resolved = resolveEvidenceFile(record, category, evidence, root)
  if (['unit', 'ssr'].includes(category) && !isWithin(path.resolve(root, packageRoot[record.package]), resolved)) {
    throw new Error(`${record.component}.${category} crosses package boundary: ${evidence.path}`)
  }
  if (category === 'unit' && evidence.path !== canonicalUnitPath(record)) {
    throw new Error(`${record.component}.unit does not match the canonical component test: ${evidence.path}`)
  }
  if (category === 'e2e' && !isWithin(path.resolve(root, 'e2e'), resolved)) {
    throw new Error(`${record.component}.e2e evidence must be inside e2e/: ${evidence.path}`)
  }
}

export const validateEvidence = (record, root) => {
  for (const category of ['unit', 'e2e', 'ssr', 'a11y', 'visual']) {
    if (!Array.isArray(record[category]) || record[category].length === 0) throw new Error(`${record.component}.${category} is missing`)
    record[category].forEach((evidence) => validateEvidenceItem(record, category, evidence, root))
  }
  if (record.risk === 'R1') {
    const currentProductEvidence = record.e2e.filter(
      (evidence) => evidence.kind === 'file' && evidence.path !== 'e2e/docs-component-smoke.spec.ts'
    )
    if (!currentProductEvidence.length) {
      throw new Error(`${record.component}.e2e requires current component contract or dedicated product evidence`)
    }
    if (!currentProductEvidence.some((evidence) => evidence.path === qg1ComponentContractPath)) {
      throw new Error(`${record.component}.e2e requires the QG1 component contract`)
    }
  }
  const expectedPolicy = e2ePolicyFor(record.component, record.risk)
  const actualFiles = record.e2e.filter((evidence) => evidence.kind === 'file').map((evidence) => evidence.path)
  const actualMilestones = record.e2e.filter((evidence) => evidence.kind === 'planned').map((evidence) => evidence.milestone)
  if (
    actualFiles.length !== expectedPolicy.files.length ||
    actualFiles.some((filePath) => !expectedPolicy.files.includes(filePath)) ||
    actualMilestones.length !== expectedPolicy.plannedMilestones.length ||
    actualMilestones.some((milestone) => !expectedPolicy.plannedMilestones.includes(milestone))
  ) {
    throw new Error(`${record.component}.e2e has unexpected component browser evidence`)
  }
}
