import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('quality matrix registers every Ready component exactly once with release evidence', async () => {
  const [{ qualityMatrix, validateQualityMatrix }, { parseReadyComponentKeys, validateEvidence }, componentMetadata] = await Promise.all([
    import(path.join(root, 'docs/.vitepress/data/quality-matrix.mjs')),
    import(path.join(root, 'scripts/quality-matrix.mjs')),
    readFile(path.join(root, 'docs/.vitepress/data/components.ts'), 'utf8')
  ])
  const readyKeys = parseReadyComponentKeys(componentMetadata)

  assert.equal(new Set(readyKeys).size, 48, 'the Ready component baseline changed; update the quality matrix intentionally')
  assert.equal(qualityMatrix.length, readyKeys.length)
  assert.deepEqual(new Set(qualityMatrix.map((record) => record.component)), new Set(readyKeys))
  assert.doesNotThrow(() => validateQualityMatrix(readyKeys))
  assert.deepEqual(
    parseReadyComponentKeys("{ key: 'without-zh-name', name: 'Example', description: {}, status: 'Ready' }"),
    ['without-zh-name']
  )
  assert.deepEqual(
    parseReadyComponentKeys('{ key: "double-quoted", name: "Example", description: {}, status: "Ready" }'),
    ['double-quoted']
  )
  assert.deepEqual(
    parseReadyComponentKeys(`
      const ready = 'Ready'
      const base = { status: (ready) }
      const component = ({ key: \`static-template\`, ...base })
      const categories = [{ components: [component] }]
    `),
    ['static-template']
  )
  assert.throws(
    () => parseReadyComponentKeys("const status = getStatus(); const component = { key: 'dynamic', status }"),
    /dynamic.*status|status.*dynamic/i
  )

  for (const record of qualityMatrix) {
    assert.match(record.package, /^(aheart-ui|@aheart-ui\/(dnd|ai))$/)
    assert.match(record.risk, /^R[123]$/)
    assert.ok(record.owner.trim())
    assert.ok(Array.isArray(record.productTasks) && record.productTasks.length > 0)
    for (const productTask of record.productTasks) {
      assert.equal(productTask.id, `product-task:${record.package}:${record.component}`)
      assert.ok(productTask.taskGroup.trim())
      assert.ok(productTask.acceptance.trim())
    }
    assert.doesNotThrow(() => validateEvidence(record, root))
  }

  const sample = qualityMatrix.find((record) => record.component === 'button')
  assert.throws(
    () => validateEvidence({ ...sample, unit: [{ kind: 'file', path: 'packages/ai/src/__tests__/package.test.ts' }] }, root),
    /crosses package boundary/
  )
  assert.throws(
    () => validateEvidence({ ...sample, e2e: [{ kind: 'file', path: 'e2e/does-not-exist.spec.ts' }] }, root),
    /evidence is missing/
  )
  assert.throws(
    () => validateEvidence({ ...sample, a11y: [{ kind: 'planned', milestone: 'QG4' }] }, root),
    /invalid planned evidence item/
  )
  assert.throws(
    () => validateEvidence({ ...sample, visual: [{ kind: 'planned', milestone: 'QG5', reason: 'hypothetical' }] }, root),
    /invalid planned evidence item/
  )
  assert.throws(
    () => validateEvidence({ ...sample, a11y: [{ kind: 'file', path: 'packages/components/src/button/__tests__/button.test.ts' }] }, root),
    /a11y evidence must be planned for QG4/
  )
  assert.throws(
    () => validateEvidence({ ...sample, visual: [{ kind: 'notApplicable', reason: 'not tested' }] }, root),
    /visual evidence must be planned for QG4/
  )
  assert.throws(
    () => validateEvidence({ ...sample, ssr: [{ kind: 'planned', milestone: 'QG6', reason: 'deferred' }] }, root),
    /SSR planned evidence must be deferred at QG6/
  )
  assert.doesNotThrow(() => validateEvidence({
    ...sample,
    ssr: [{ kind: 'planned', milestone: 'QG6', status: 'deferred', reason: 'consumer SSR contract is pending' }]
  }, root))
  assert.throws(
    () => validateEvidence({ ...sample, e2e: [{ kind: 'planned', milestone: 'QG4', reason: 'not a supported browser milestone' }] }, root),
    /invalid planned evidence item/
  )
  assert.throws(
    () => validateEvidence({ ...sample, ssr: [{ kind: 'notApplicable', reason: 'not covered yet' }] }, root),
    /SSR evidence cannot be notApplicable/
  )
  const datePicker = qualityMatrix.find((record) => record.component === 'date-picker')
  const timePickerWithSsr = qualityMatrix.find((record) => record.component === 'time-picker')
  assert.throws(
    () => validateEvidence({ ...datePicker, ssr: [{ kind: 'planned', milestone: 'QG6', status: 'deferred', reason: 'deferred' }] }, root),
    /has a dedicated SSR file and cannot be deferred/
  )
  assert.throws(
    () => validateEvidence({ ...timePickerWithSsr, ssr: [{ kind: 'notApplicable', reason: 'not covered yet' }] }, root),
    /has a dedicated SSR file and cannot be notApplicable/
  )
  assert.throws(
    () => validateEvidence({ ...sample, unit: [{ kind: 'file', path: 'packages/components/src/input/__tests__/input.test.ts' }] }, root),
    /canonical component test/
  )

  assert.throws(
    () => validateEvidence({ ...sample, ssr: [{ kind: 'file', path: 'packages/components/src/button' }] }, root),
    /regular file/
  )
  assert.throws(
    () => validateEvidence({ ...sample, ssr: [{ kind: 'file', path: path.join(root, 'package.json') }] }, root),
    /outside repository root/
  )
  assert.throws(
    () => validateEvidence({ ...sample, ssr: [{ kind: 'file', path: 'packages/ai/src/__tests__/form.test.ts' }] }, root),
    /crosses package boundary/
  )
  assert.doesNotThrow(
    () => validateEvidence({ ...sample, e2e: [{ kind: 'file', path: 'e2e/q2-navigation-overlays.spec.ts' }] }, root)
  )

  const dnd = qualityMatrix.find((record) => record.component === 'dnd')
  const splitter = qualityMatrix.find((record) => record.component === 'splitter')
  const upload = qualityMatrix.find((record) => record.component === 'upload')
  const timePicker = qualityMatrix.find((record) => record.component === 'time-picker')
  assert.throws(
    () => validateEvidence({ ...upload, e2e: [{ kind: 'file', path: 'e2e/agent-workbench.spec.ts' }] }, root),
    /component contract/
  )
  assert.equal(dnd.e2e[0].path, 'e2e/qg1-ready-component-contracts.spec.ts')
  assert.equal(dnd.e2e[1].milestone, 'QG2')
  assert.equal(splitter.e2e[0].path, 'e2e/qg1-ready-component-contracts.spec.ts')
  assert.equal(splitter.e2e[1].milestone, 'QG2')
  assert.equal(timePicker.e2e[0].path, 'e2e/qg1-ready-component-contracts.spec.ts')
  assert.ok(timePicker.e2e.some((evidence) => evidence.path === 'e2e/time-picker-range.spec.ts'))
  const qg3Components = ['config-provider', 'upload', 'tree', 'message', 'modal']
  for (const component of qg3Components) {
    const record = qualityMatrix.find((candidate) => candidate.component === component)
    assert.ok(record.e2e.some((evidence) => evidence.kind === 'planned' && evidence.milestone === 'QG3'))
  }
  const dropdown = qualityMatrix.find((record) => record.component === 'dropdown')
  assert.ok(dropdown.e2e.some((evidence) => evidence.path === 'e2e/q2-navigation-overlays.spec.ts'))
  assert.equal(dropdown.e2e.some((evidence) => evidence.kind === 'planned' && evidence.milestone === 'QG2'), false)
  assert.equal(datePicker.ssr[0].path, 'packages/components/src/date-picker/__tests__/date-picker.ssr.test.ts')
  assert.equal(timePickerWithSsr.ssr[0].path, 'packages/components/src/time-picker/__tests__/time-picker.ssr.test.ts')
  assert.equal(sample.ssr[0].kind, 'planned')
  assert.equal(sample.ssr[0].milestone, 'QG6')
  assert.equal(sample.ssr[0].status, 'deferred')
})

test('quality matrix uses the planned mutually exclusive risk mapping', async () => {
  const { qualityMatrix } = await import(path.join(root, 'docs/.vitepress/data/quality-matrix.mjs'))
  const expected = {
    R1: [
      'form', 'select', 'date-picker', 'time-picker', 'upload', 'table', 'tree', 'tree-select', 'cascader',
      'dropdown', 'message', 'modal', 'drawer', 'tooltip', 'popover', 'popconfirm', 'splitter', 'dnd',
      'ai', 'ai-form', 'ai-agent-workbench'
    ],
    R2: [
      'button', 'input', 'textarea', 'input-number', 'checkbox', 'radio', 'switch', 'menu', 'tabs', 'steps',
      'pagination', 'config-provider'
    ],
    R3: [
      'typography', 'icon', 'space', 'flex', 'grid', 'divider', 'breadcrumb', 'descriptions', 'card', 'tag',
      'badge', 'empty', 'spin', 'skeleton', 'alert'
    ]
  }

  for (const risk of ['R1', 'R2', 'R3']) {
    assert.deepEqual(
      new Set(qualityMatrix.filter((record) => record.risk === risk).map((record) => record.component)),
      new Set(expected[risk])
    )
  }
  assert.equal(new Set(Object.values(expected).flat()).size, 48)
  assert.equal(Object.values(expected).flat().length, 48)
})

test('R1 records have current component evidence and product task metadata', async () => {
  const { qualityMatrix } = await import(path.join(root, 'docs/.vitepress/data/quality-matrix.mjs'))
  const taskGroups = new Set([
    '全局规范', '布局与操作', '路径与进度', '采集与选择', '呈现与状态', '上下文反馈', '空间与编排', '对话与协作'
  ])

  for (const record of qualityMatrix) {
    assert.equal(record.productTasks.length, 1)
    assert.ok(taskGroups.has(record.productTasks[0].taskGroup))
    if (record.risk !== 'R1') continue
    const currentE2e = record.e2e.filter((evidence) => evidence.kind === 'file')
    assert.ok(currentE2e.length > 0, `${record.component} needs current E2E evidence`)
    assert.ok(
      currentE2e.some((evidence) => evidence.path !== 'e2e/docs-component-smoke.spec.ts'),
      `${record.component} cannot use docs-component-smoke as its only product evidence`
    )
  }
})

test('pull request template requires product task and quality matrix review', async () => {
  const template = await readFile(path.join(root, '.github/pull_request_template.md'), 'utf8')
  assert.match(template, /- \[ \].*影响的产品任务/)
  assert.match(template, /- \[ \].*质量矩阵更新/)
})
