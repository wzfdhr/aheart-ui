import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { validateIosSafariEvidence } from './qg5-ios-safari-evidence.mjs'

const sha256 = (content) => createHash('sha256').update(content).digest('hex')

const buildEvidence = (commit, files) => ({
  schemaVersion: 'qg5-ios-safari-evidence.v1',
  evidenceId: 'qg5-ios-safari-20260812-001',
  status: 'passed',
  commit: {
    sha: commit,
    repository: 'wzfdhr/aheart-ui',
    branch: 'codex/qg5-cross-browser-production'
  },
  environment: {
    deviceModel: 'iPhone 15 Pro',
    deviceIdentifier: 'lab-ios-15-pro-01',
    osName: 'iOS',
    osVersion: '18.6.1',
    osBuild: '22G90',
    browserName: 'Safari',
    browserVersion: '18.6',
    browserMode: 'physical-device',
    baseUrl: 'https://qa.example.test/qg5/8b8953d',
    timezone: 'Asia/Shanghai'
  },
  session: {
    startedAt: '2026-08-12T10:00:00+08:00',
    endedAt: '2026-08-12T10:18:00+08:00',
    operator: { name: 'QA operator', account: 'qa@example.test' },
    procedureVersion: 'qg5-ios-safari-procedure.v1'
  },
  tasks: {
    dndTrustedTouchSort: {
      method: 'physical-finger-touch',
      status: 'passed',
      route: '/components/dnd',
      beforeOrder: ['plan', 'review', 'release'],
      afterOrder: ['review', 'release', 'plan'],
      observed: {
        handleUsed: true,
        sortCommitted: true,
        overlayVisibleDuringDrag: true,
        overlayRemovedAfterTouchEnd: true
      },
      artifacts: ['dnd-before.png', 'dnd-after.png', 'session.mp4']
    },
    bodyScroll: {
      method: 'physical-finger-touch',
      status: 'passed',
      route: '/components/dnd',
      beforeScrollTop: 0,
      afterScrollTop: 184,
      orderUnchanged: true,
      artifacts: ['scroll-before.png', 'scroll-after.png', 'session.mp4']
    },
    splitterResize: {
      method: 'physical-finger-touch',
      status: 'passed',
      route: '/components/splitter',
      beforeSizes: [50, 50],
      afterSizes: [62, 38],
      adjustmentCommitted: true,
      artifacts: ['splitter-before.png', 'splitter-after.png', 'session.mp4']
    },
    cancelCleanup: {
      method: 'physical-interruption',
      status: 'passed',
      route: '/components/splitter',
      observed: {
        resizeNotCommitted: true,
        dragShieldRemoved: true,
        bodyCursorRestored: true,
        bodyUserSelectRestored: true,
        subsequentResizeWorks: true
      },
      artifacts: ['cancel-before.png', 'cancel-cleanup.png', 'session.mp4']
    }
  },
  artifacts: files.map(({ name, content, kind, mimeType }) => ({
    path: name,
    kind,
    mimeType,
    bytes: Buffer.byteLength(content),
    sha256: sha256(content)
  })),
  review: {
    reviewer: 'Test manager',
    reviewedAt: '2026-08-12T11:00:00+08:00',
    notes: 'Physical-device recording reviewed.'
  }
})

const prepareEvidence = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'aheart-qg5-ios-'))
  const evidenceDir = path.join(root, 'qg5-ios-safari-20260812-001')
  await mkdir(evidenceDir)
  const files = [
    ['dnd-before.png', 'dnd-before', 'screenshot', 'image/png'],
    ['dnd-after.png', 'dnd-after', 'screenshot', 'image/png'],
    ['scroll-before.png', 'scroll-before', 'screenshot', 'image/png'],
    ['scroll-after.png', 'scroll-after', 'screenshot', 'image/png'],
    ['splitter-before.png', 'splitter-before', 'screenshot', 'image/png'],
    ['splitter-after.png', 'splitter-after', 'screenshot', 'image/png'],
    ['cancel-before.png', 'cancel-before', 'screenshot', 'image/png'],
    ['cancel-cleanup.png', 'cancel-cleanup', 'screenshot', 'image/png'],
    ['session.mp4', 'session-video', 'video', 'video/mp4']
  ].map(([name, content, kind, mimeType]) => ({ name, content, kind, mimeType }))
  await Promise.all(files.map(({ name, content }) => writeFile(path.join(evidenceDir, name), content)))
  const commit = '8b8953de8ae78c33f8198297ec5066efa178af22'
  return { evidence: buildEvidence(commit, files), evidenceDir, commit }
}

test('accepts complete physical iOS Safari evidence bound to the reviewed commit', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  const result = await validateIosSafariEvidence(evidence, {
    expectedCommit: commit,
    expectedRepository: 'wzfdhr/aheart-ui',
    expectedBranch: 'codex/qg5-cross-browser-production',
    artifactRoot: evidenceDir
  })
  assert.deepEqual(result, {
    ok: true,
    evidenceId: evidence.evidenceId,
    commit,
    taskCount: 4,
    artifactCount: 9
  })
})

test('rejects simulator and scripted touch evidence', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.environment.browserMode = 'simulator'
  evidence.tasks.dndTrustedTouchSort.method = 'playwright-webkit'
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /physical-device/
  )
})

test('rejects evidence for another commit and missing artifact integrity', async () => {
  const { evidence, evidenceDir } = await prepareEvidence()
  await assert.rejects(
    validateIosSafariEvidence(evidence, {
      expectedCommit: '1111111111111111111111111111111111111111',
      expectedRepository: 'wzfdhr/aheart-ui',
      expectedBranch: 'codex/qg5-cross-browser-production',
      artifactRoot: evidenceDir
    }),
    /does not match reviewed commit/
  )

  evidence.artifacts[0].sha256 = '0'.repeat(64)
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: evidence.commit.sha, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /SHA-256 mismatch/
  )
})

test('rejects incomplete observable task outcomes', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.tasks.cancelCleanup.observed.dragShieldRemoved = false
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /cancelCleanup.*dragShieldRemoved/
  )
})

test('requires before and after screenshots plus a session video for every physical task', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.tasks.dndTrustedTouchSort.artifacts = ['dnd-after.png']
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /dndTrustedTouchSort.*two distinct screenshots.*video/
  )
})

test('rejects duplicate before and after media references', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.tasks.dndTrustedTouchSort.artifacts = ['dnd-before.png', 'dnd-before.png', 'session.mp4']
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /dndTrustedTouchSort.*two distinct screenshots/
  )
})

test('rejects symlinks that can escape the evidence directory', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  const outside = path.join(path.dirname(evidenceDir), 'outside.png')
  await writeFile(outside, 'outside')
  await rm(path.join(evidenceDir, 'dnd-before.png'))
  await symlink(outside, path.join(evidenceDir, 'dnd-before.png'))
  evidence.artifacts.find((artifact) => artifact.path === 'dnd-before.png').bytes = Buffer.byteLength('outside')
  evidence.artifacts.find((artifact) => artifact.path === 'dnd-before.png').sha256 = sha256('outside')
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /symbolic link|escapes evidence directory/
  )
})

test('binds evidence to the expected repository and branch', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'another/repository', expectedBranch: 'master', artifactRoot: evidenceDir }),
    /repository does not match/
  )
})

test('rejects artifact MIME metadata that does not match its evidence kind and extension', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.artifacts.find((artifact) => artifact.path === 'session.mp4').mimeType = 'image/png'
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /session\.mp4.*mimeType/
  )
})

test('rejects evidence IDs that can escape the JSON evidence directory', async () => {
  const { evidence, evidenceDir, commit } = await prepareEvidence()
  evidence.evidenceId = '../outside'
  await assert.rejects(
    validateIosSafariEvidence(evidence, { expectedCommit: commit, expectedRepository: 'wzfdhr/aheart-ui', expectedBranch: 'codex/qg5-cross-browser-production', artifactRoot: evidenceDir }),
    /evidenceId must be a safe single-path identifier/
  )
})
