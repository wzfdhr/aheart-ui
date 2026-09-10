import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import AIAgentWorkbench from '../agent-workbench.vue'

// D8 deliberately exercises the public contract before its implementation exists.
// Keep the component cast local so the test remains executable during the RED stage.
const Workbench = AIAgentWorkbench as any

type Task = Record<string, any>

const task = (overrides: Task = {}): Task => {
  const { approval, ...taskOverrides } = overrides
  return {
    id: 'publish',
    label: '发布结果',
    status: 'waiting-approval',
    revision: 'task-r1',
    ...taskOverrides,
    approval: {
      id: 'approval-r1',
      title: '确认发布',
      status: 'pending',
      ...(approval ?? {})
    }
  }
}

const operationTask = (overrides: Task = {}) => {
  const { approval, ...taskOverrides } = overrides
  return task({
    ...taskOverrides,
    approval: {
      artifactId: 'artifact-1',
      ...(approval ?? {})
    }
  })
}

const operationArtifacts = [{ id: 'artifact-1', title: '报告', revision: 'artifact-r1' }]

const mountWorkbench = (props: Record<string, unknown> = {}) => mount(Workbench, { props })

const installResponsiveMedia = (ownerWindow: Window = window) => {
  const previous = ownerWindow.matchMedia
  let matches = true
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  ownerWindow.matchMedia = vi.fn((query: string) => ({
    media: query,
    matches: query === '(max-width: 760px)' ? matches : false,
    onchange: null,
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: () => true
  })) as typeof ownerWindow.matchMedia
  return {
    change(next: boolean) {
      matches = next
      const event = { matches, media: '(max-width: 760px)' } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
    restore() {
      ownerWindow.matchMedia = previous
    }
  }
}

const findTab = (wrapper: any, name: string) => wrapper.findAll('[role="tab"]').find((tab: any) => tab.text().includes(name))

const deferred = <T = unknown>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const clickAction = async (wrapper: any, id: string, action: string) => {
  const button = wrapper.get(`[data-task-id="${id}"] [data-action="${action}"]`)
  await button.trigger('click')
  await nextTick()
}

describe('D8 AIAgentWorkbench single owner and operation contract', () => {
  it('mounts exactly one ChatPanel and one AgentExecution across desktop and mobile views', async () => {
    const media = installResponsiveMedia()
    const wrapper = mountWorkbench({
      transport: { send: async function* () { yield { type: 'done' } } }
    })

    expect(wrapper.findAllComponents({ name: 'AAIChatPanel' })).toHaveLength(1)
    expect(wrapper.findAllComponents({ name: 'AIAgentWorkbenchExecution' })).toHaveLength(1)

    const chat = wrapper.findComponent({ name: 'AAIChatPanel' })
    const chatUid = (chat.vm as any).$?.uid
    expect(window.matchMedia('(max-width: 760px)').matches).toBe(true)
    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    await findTab(wrapper, '对话').trigger('click')
    media.change(false)
    await nextTick()
    media.change(true)
    await nextTick()

    expect(wrapper.findAllComponents({ name: 'AAIChatPanel' })).toHaveLength(1)
    expect((wrapper.findComponent({ name: 'AAIChatPanel' }).vm as any).$?.uid).toBe(chatUid)
    expect(wrapper.findAllComponents({ name: 'AIAgentWorkbenchExecution' })).toHaveLength(1)
    media.restore()
  })

  it('keeps the same interactive ChatPanel and Execution visible in mobile tabs and Drawer', async () => {
    const media = installResponsiveMedia()
    const wrapper = mountWorkbench({
      transport: { send: async function* () { yield { type: 'done' } } },
      tasks: [task()]
    })
    const chat = wrapper.findComponent({ name: 'AAIChatPanel' })
    const execution = wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' })
    const chatUid = (chat.vm as any).$?.uid
    const executionUid = (execution.vm as any).$?.uid

    expect(window.matchMedia('(max-width: 760px)').matches).toBe(true)
    await findTab(wrapper, '对话').trigger('click')
    expect(wrapper.findAll('[role="tab"]').filter((tab) => tab.attributes('aria-selected') === 'true').map((tab) => tab.text())).toEqual(['对话'])
    const mobileChatElement = wrapper.find('.aheart-ai-workbench__mobile-panel--chat .aheart-ai-chat-panel')
    expect(mobileChatElement.exists()).toBe(true)
    await chat.get('textarea').setValue('移动端草稿')
    expect(chat.get('textarea').element).toHaveProperty('value', '移动端草稿')
    expect((wrapper.findComponent({ name: 'AAIChatPanel' }).vm as any).$?.uid).toBe(chatUid)

    await findTab(wrapper, '执行').trigger('click')
    expect(wrapper.findAll('[role="tab"]').filter((tab) => tab.attributes('aria-selected') === 'true').map((tab) => tab.text())).toEqual(['执行1'])
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    const drawer = wrapper.getComponent({ name: 'ADrawer' })
    const mobileExecution = drawer.get('.aheart-drawer__body .aheart-ai-workbench__execution-content')
    expect(mobileExecution.text()).toContain('发布结果')
    expect((wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' }).vm as any).$?.uid).toBe(executionUid)
    media.change(false)
    await nextTick()
    media.change(true)
    await nextTick()
    expect((wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' }).vm as any).$?.uid).toBe(executionUid)
    media.restore()
  })

  it('closes the mobile Drawer and releases overlay state when the viewport returns to desktop', async () => {
    const media = installResponsiveMedia()
    document.body.style.overflow = ''
    const wrapper = mountWorkbench({
      tasks: [task()],
      transport: { send: async function* () { yield { type: 'done' } } }
    })
    const executionUid = (wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' }).vm as any).$?.uid
    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    const drawer = wrapper.getComponent({ name: 'ADrawer' })
    expect(drawer.props('open')).toBe(true)
    expect(drawer.find('.aheart-drawer__body .aheart-ai-workbench__execution-content').exists()).toBe(true)

    vi.useFakeTimers()
    try {
      media.change(false)
      await nextTick()
      expect(drawer.props('open')).toBe(false)
      expect(document.body.style.overflow).toBe('')

      const rootState = () => {
        const drawerRoot = drawer.find('[role="presentation"]')
        if (!drawerRoot.exists()) return { hidden: true, closing: false }
        const rootStyle = drawerRoot.attributes('style') ?? ''
        const classes = drawerRoot.classes()
        return {
          hidden: drawerRoot.attributes('aria-hidden') === 'true' || /display:\s*none/i.test(rootStyle),
          closing: classes.some((name) => /is-(leave|closing|leaving)/.test(name))
        }
      }
      expect(rootState().hidden || rootState().closing).toBe(true)
      vi.advanceTimersByTime(240)
      await flushPromises()
      await nextTick()
      expect(rootState().hidden).toBe(true)
      expect((wrapper.findComponent({ name: 'AIAgentWorkbenchExecution' }).vm as any).$?.uid).toBe(executionUid)
    } finally {
      vi.useRealTimers()
      media.restore()
    }
  })

  it('keeps draft, conversation, and a pending operation continuous while the view changes', async () => {
    const pending = deferred<any>()
    const actionHandler = vi.fn(() => pending.promise)
    const wrapper = mountWorkbench({
      transport: { send: async function* () { yield { type: 'done' } } },
      activeConversation: 'conversation-a',
      tasks: [operationTask()],
      artifacts: [{ id: 'artifact-1', title: '报告', revision: 'artifact-r1' }],
      actionHandler
    })

    const chat = wrapper.findComponent({ name: 'AAIChatPanel' })
    await chat.get('textarea').setValue('未发送的草稿')
    await clickAction(wrapper, 'publish', 'approve')
    expect(actionHandler).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-task-id="publish"] [data-action="reject"]').attributes('disabled')).toBeDefined()

    await findTab(wrapper, '执行').trigger('click')
    await wrapper.get('[data-action="open-execution-drawer"]').trigger('click')
    await findTab(wrapper, '对话').trigger('click')

    expect(wrapper.findComponent({ name: 'AAIChatPanel' }).get('textarea').element).toHaveProperty('value', '未发送的草稿')
    expect(actionHandler.mock.calls[0][0]).toMatchObject({
      taskId: 'publish',
      taskRevision: 'task-r1',
      approvalId: 'approval-r1',
      artifactId: 'artifact-1',
      artifactRevision: 'artifact-r1',
      action: 'approve'
    })
    expect(actionHandler.mock.calls[0][1]).toBeInstanceOf(AbortSignal)
    pending.resolve({ status: 'success', operationId: actionHandler.mock.calls[0][0].operationId })
    await flushPromises()
    expect(wrapper.text()).toContain('成功')
  })

  it('uses actionHandler as the sole business-write path and keeps legacy events mutually exclusive', async () => {
    const handler = vi.fn(async (request: any) => ({ status: 'success', operationId: request.operationId }))
    const withHandler = mountWorkbench({ tasks: [task()], actionHandler: handler })
    await clickAction(withHandler, 'publish', 'approve')
    await flushPromises()
    expect(handler).toHaveBeenCalledTimes(1)
    expect(withHandler.emitted('approve')).toBeUndefined()

    const legacy = mountWorkbench({ tasks: [task()] })
    await clickAction(legacy, 'publish', 'approve')
    expect(legacy.emitted('approve')).toHaveLength(1)
  })

  it('routes non-approval cancel and retry through the transactional handler with task revisions', async () => {
    const handler = vi.fn(async (request: any) => ({ status: 'success', operationId: request.operationId }))
    const wrapper = mountWorkbench({
      tasks: [
        { id: 'running', label: '执行中任务', status: 'running', revision: 'running-r1' },
        { id: 'failed', label: '失败任务', status: 'error', revision: 'failed-r1' }
      ],
      actionHandler: handler
    })

    await clickAction(wrapper, 'running', 'cancel')
    await clickAction(wrapper, 'failed', 'retry')
    await flushPromises()

    expect(handler).toHaveBeenCalledTimes(2)
    expect(handler.mock.calls.map(([request]) => request.action)).toEqual(['cancel', 'retry'])
    expect(handler.mock.calls.map(([request]) => request.taskRevision)).toEqual(['running-r1', 'failed-r1'])
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('retry')).toBeUndefined()
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
  })

  it('disables handler actions without task revision and never invents approval identity for non-approval tasks', async () => {
    const missingRevisionHandler = vi.fn()
    const missingRevision = mountWorkbench({
      tasks: [
        { id: 'running', label: '执行中', status: 'running' },
        { id: 'error', label: '失败', status: 'error' }
      ],
      actionHandler: missingRevisionHandler
    })
    expect(missingRevision.get('[data-task-id="running"] [data-action="cancel"]').attributes('disabled')).toBeDefined()
    expect(missingRevision.get('[data-task-id="error"] [data-action="retry"]').attributes('disabled')).toBeDefined()
    expect(missingRevisionHandler).not.toHaveBeenCalled()

    const first = deferred<any>()
    const second = deferred<any>()
    const requests: any[] = []
    const handler = vi.fn((request: any) => {
      requests.push(request)
      return requests.length === 1 ? first.promise : second.promise
    })
    const wrapper = mountWorkbench({
      tasks: [{ id: 'running', label: '执行中', status: 'running', revision: 'running-r1' }],
      actionHandler: handler
    })
    await clickAction(wrapper, 'running', 'cancel')
    expect(requests[0]).toMatchObject({ action: 'cancel', taskRevision: 'running-r1' })
    expect(requests[0]).not.toHaveProperty('approvalId')
    first.resolve({ status: 'error', error: '服务失败', operationId: requests[0].operationId })
    await flushPromises()
    await clickAction(wrapper, 'running', 'retry')
    expect(requests[1].action).toBe('cancel')
    expect(requests[1].idempotencyKey).toBe(requests[0].idempotencyKey)
    expect(requests[1].operationId).not.toBe(requests[0].operationId)
    expect(requests[1]).not.toHaveProperty('approvalId')
    second.resolve({ status: 'success', operationId: requests[1].operationId })
    await flushPromises()
  })

  it('locks non-approval actions during pending and after success without duplicate writes', async () => {
    const pending = deferred<any>()
    const pendingHandler = vi.fn(() => pending.promise)
    const pendingWrapper = mountWorkbench({
      tasks: [{ id: 'pending', label: '处理中', status: 'running', revision: 'pending-r1' }],
      actionHandler: pendingHandler
    })
    await clickAction(pendingWrapper, 'pending', 'cancel')
    await clickAction(pendingWrapper, 'pending', 'cancel')
    expect(pendingHandler).toHaveBeenCalledTimes(1)
    expect(pendingWrapper.get('[data-task-id="pending"] [data-action="cancel"]').attributes('disabled')).toBeDefined()
    pending.resolve({ status: 'success', operationId: pendingHandler.mock.calls[0][0].operationId })
    await flushPromises()
    await clickAction(pendingWrapper, 'pending', 'cancel')
    expect(pendingHandler).toHaveBeenCalledTimes(1)

  })

  it.each([
    ['omitted-outcome', async (request: any) => ({ status: 'error', error: '结果未知', operationId: request.operationId })],
    ['thrown-error', async () => { throw new Error('结果未知') }]
  ])('retries an error non-approval task again after %s, then locks success until parent revision advances', async (_label, firstResult) => {
    const requests: any[] = []
    const handler = vi.fn(async (request: any) => {
      requests.push(request)
      if (requests.length === 1) return firstResult(request)
      return { status: 'success', operationId: request.operationId }
    })
    const wrapper = mountWorkbench({
      tasks: [{ id: 'error', label: '失败任务', status: 'error', revision: 'error-r1' }],
      actionHandler: handler
    })

    await clickAction(wrapper, 'error', 'retry')
    await flushPromises()
    expect(wrapper.get('[data-task-id="error"] [data-action="retry"]').element).toHaveProperty('disabled', false)
    await clickAction(wrapper, 'error', 'retry')
    await flushPromises()
    expect(requests).toHaveLength(2)
    expect(requests[1].action).toBe('retry')
    expect(requests[1].operationId).not.toBe(requests[0].operationId)
    expect(requests[1].idempotencyKey).toBe(requests[0].idempotencyKey)
    expect(requests[0]).not.toHaveProperty('approvalId')
    expect(requests[1]).not.toHaveProperty('approvalId')
    expect(wrapper.get('[data-task-id="error"] [data-action="retry"]').attributes('disabled')).toBeDefined()

    await wrapper.setProps({ tasks: [{ id: 'error', label: '失败任务', status: 'error', revision: 'error-r2' }] })
    expect(wrapper.get('[data-task-id="error"] [data-action="retry"]').element).toHaveProperty('disabled', false)
    await clickAction(wrapper, 'error', 'retry')
    expect(requests).toHaveLength(3)
    expect(requests[2].action).toBe('retry')
    expect(requests[2].idempotencyKey).not.toBe(requests[1].idempotencyKey)
    expect(requests[2]).not.toHaveProperty('approvalId')
  })

  it.each([
    ['success', { status: 'success' }],
    ['error', { status: 'error', error: '服务不可用', retryable: true }],
    ['not-applied', { status: 'error', error: '版本已变化', outcome: 'not-applied' }],
    ['unknown', { status: 'error', error: '结果未知', outcome: 'unknown' }]
  ])('renders the %s operation result without mutating parent task data', async (_label, result) => {
    const handler = vi.fn(async (request: any) => ({ ...result, operationId: request.operationId }))
    const original = operationTask()
    const wrapper = mountWorkbench({ tasks: [original], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()

    expect(wrapper.props('tasks')).toEqual([original])
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
    expect(wrapper.get('[data-task-id="publish"]')).toBeTruthy()
    expect(wrapper.text()).toContain(_label === 'success' ? '成功' : result.error)
  })

  it('locks every conflicting action after success until the parent advances the task revision', async () => {
    const handler = vi.fn(async (request: any) => ({ status: 'success', operationId: request.operationId }))
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    for (const action of ['approve', 'reject', 'cancel', 'retry']) {
      const button = wrapper.find(`[data-task-id="publish"] [data-action="${action}"]`)
      if (button.exists()) expect(button.attributes('disabled')).toBeDefined()
    }

    await wrapper.setProps({ tasks: [operationTask({ revision: 'task-r2' })] })
    const approve = wrapper.find('[data-task-id="publish"] [data-action="approve"]')
    expect(approve.exists() ? approve.attributes('disabled') : undefined).toBeUndefined()
  })

  it('generates a new attempt operationId while retaining idempotencyKey for unknown-result retry', async () => {
    const attempts: any[] = []
    const gates = [deferred<any>(), deferred<any>()]
    const handler = vi.fn((request: any) => {
      attempts.push(request)
      return gates[attempts.length - 1].promise
    })
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    expect(handler).toHaveBeenCalledTimes(1)
    gates[0].resolve({ status: 'error', outcome: 'unknown', error: '结果未知', operationId: attempts[0].operationId })
    await flushPromises()
    await clickAction(wrapper, 'publish', 'retry')

    expect(handler).toHaveBeenCalledTimes(2)
    expect(attempts[1].action).toBe('approve')
    expect(attempts[1].operationId).not.toBe(attempts[0].operationId)
    expect(attempts[1].idempotencyKey).toBe(attempts[0].idempotencyKey)
    gates[1].resolve({ status: 'success', operationId: attempts[1].operationId })
    await flushPromises()
  })

  it('creates a new idempotency key for a not-applied new approval intent', async () => {
    const attempts: any[] = []
    const gates = [deferred<any>(), deferred<any>()]
    const handler = vi.fn((request: any) => {
      attempts.push(request)
      return gates[attempts.length - 1].promise
    })
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    gates[0].resolve({ status: 'error', outcome: 'not-applied', error: '版本已变化', operationId: attempts[0].operationId })
    await flushPromises()
    await clickAction(wrapper, 'publish', 'approve')

    expect(handler).toHaveBeenCalledTimes(2)
    expect(attempts[1].action).toBe('approve')
    expect(attempts[1].idempotencyKey).not.toBe(attempts[0].idempotencyKey)
    expect(attempts[1].operationId).not.toBe(attempts[0].operationId)
    gates[1].resolve({ status: 'success', operationId: attempts[1].operationId })
    await flushPromises()
  })

  it.each([
    ['omitted-outcome', async (request: any) => ({ status: 'error', error: '服务结果未知', operationId: request.operationId })],
    ['thrown-error', async () => { throw new Error('网络结果未知') }]
  ])('treats %s as unknown and retries the original action with the same idempotency key', async (_label, firstResult) => {
    const attempts: any[] = []
    let call = 0
    const handler = vi.fn(async (request: any) => {
      attempts.push(request)
      if (++call === 1) return firstResult(request)
      return { status: 'success', operationId: request.operationId }
    })
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(wrapper.get('[data-task-id="publish"] [data-action="retry"]').exists()).toBe(true)
    await clickAction(wrapper, 'publish', 'retry')
    await flushPromises()
    expect(attempts).toHaveLength(2)
    expect(attempts[1].action).toBe('approve')
    expect(attempts[1].idempotencyKey).toBe(attempts[0].idempotencyKey)
    expect(attempts[1].operationId).not.toBe(attempts[0].operationId)
  })

  it('accepts only the current attempt result after retry using the request attempt IDs', async () => {
    const first = deferred<any>()
    const second = deferred<any>()
    const attempts: any[] = []
    let call = 0
    const handler = vi.fn((request: any) => {
      attempts.push(request)
      return ++call === 1 ? first.promise : second.promise
    })
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    expect(handler).toHaveBeenCalledTimes(1)
    first.resolve({ status: 'error', outcome: 'unknown', error: '结果未知', operationId: attempts[0].operationId })
    await flushPromises()
    await clickAction(wrapper, 'publish', 'retry')
    expect(handler).toHaveBeenCalledTimes(2)
    second.resolve({ status: 'success', operationId: attempts[1].operationId })
    await flushPromises()
    expect(wrapper.text()).toContain('成功')
  })

  it('ignores a result carrying an operation ID that does not match the active request', async () => {
    const handler = vi.fn(async () => ({ status: 'success', operationId: 'foreign-operation' }))
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(handler).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain('成功')
  })

  it('invalidates pending operations on task, artifact, conversation, handler, and unmount changes', async () => {
    const gate = deferred<any>()
    const handler = vi.fn(() => gate.promise)
    const wrapper = mountWorkbench({
      tasks: [operationTask()],
      artifacts: [{ id: 'artifact-1', title: '报告', revision: 'artifact-r1' }],
      activeConversation: 'a',
      actionHandler: handler
    })
    await clickAction(wrapper, 'publish', 'approve')
    expect(handler).toHaveBeenCalledTimes(1)
    const signal = handler.mock.calls[0][1] as AbortSignal

    await wrapper.setProps({ tasks: [operationTask({ revision: 'task-r2' })] })
    expect(signal.aborted).toBe(true)
    gate.resolve({ status: 'success', operationId: 'late' })
    await flushPromises()
    expect(wrapper.text()).not.toContain('成功')

    const secondGate = deferred<any>()
    const replacement = vi.fn(() => secondGate.promise)
    await wrapper.setProps({
      tasks: [operationTask()],
      artifacts: [{ id: 'artifact-1', title: '报告', revision: 'artifact-r1' }],
      actionHandler: replacement
    })
    await clickAction(wrapper, 'publish', 'approve')
    const secondSignal = replacement.mock.calls[0][1] as AbortSignal
    await wrapper.setProps({ artifacts: [{ id: 'artifact-1', title: '报告', revision: 'artifact-r2' }] })
    expect(secondSignal.aborted).toBe(true)

    const thirdGate = deferred<any>()
    const thirdHandler = vi.fn(() => thirdGate.promise)
    await wrapper.setProps({
      artifacts: [{ id: 'artifact-1', title: '报告', revision: 'artifact-r1' }],
      actionHandler: thirdHandler
    })
    await clickAction(wrapper, 'publish', 'approve')
    const thirdSignal = thirdHandler.mock.calls[0][1] as AbortSignal
    await wrapper.setProps({ tasks: [operationTask({ approval: { id: 'approval-r2', artifactId: 'artifact-1' } })] })
    expect(thirdSignal.aborted).toBe(true)

    const fourthGate = deferred<any>()
    const fourthHandler = vi.fn(() => fourthGate.promise)
    await wrapper.setProps({ tasks: [operationTask()], actionHandler: fourthHandler })
    await clickAction(wrapper, 'publish', 'approve')
    const fourthSignal = fourthHandler.mock.calls[0][1] as AbortSignal
    await wrapper.setProps({ activeConversation: 'b' })
    expect(fourthSignal.aborted).toBe(true)
    wrapper.unmount()
    fourthGate.resolve({ status: 'success', operationId: 'too-late' })
    await flushPromises()
  })

  it('clears settled operation state when conversation, task, approval, artifact identity, or handler changes', async () => {
    const handler = vi.fn(async (request: any) => ({ status: 'success', operationId: request.operationId }))
    const wrapper = mountWorkbench({
      activeConversation: 'conversation-a',
      tasks: [operationTask()],
      artifacts: operationArtifacts,
      actionHandler: handler
    })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(wrapper.text()).toContain('成功')

    await wrapper.setProps({ activeConversation: 'conversation-b' })
    expect(wrapper.text()).not.toContain('成功')

    await wrapper.setProps({ activeConversation: 'conversation-a' })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    await wrapper.setProps({ tasks: [operationTask({ revision: 'task-r2' })] })
    expect(wrapper.text()).not.toContain('成功')

    await wrapper.setProps({ tasks: [operationTask()], artifacts: operationArtifacts })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    await wrapper.setProps({ tasks: [operationTask({ approval: { id: 'approval-r2', artifactId: 'artifact-1' } })] })
    expect(wrapper.text()).not.toContain('成功')

    const artifactB = [{ id: 'artifact-2', title: '新报告', revision: 'artifact-r1' }]
    await wrapper.setProps({
      tasks: [operationTask({ approval: { id: 'approval-r2', artifactId: 'artifact-2' } })],
      artifacts: artifactB
    })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(wrapper.text()).toContain('成功')

    await wrapper.setProps({
      tasks: [operationTask({ approval: { id: 'approval-r2', artifactId: 'artifact-2' } })],
      artifacts: [{ id: 'artifact-1', title: '旧报告', revision: 'artifact-r1' }]
    })
    expect(wrapper.text()).not.toContain('成功')

    await wrapper.setProps({ tasks: [], artifacts: [], actionHandler: vi.fn() })
    expect(wrapper.find('.aheart-ai-workbench__operation-status').exists()).toBe(false)
  })

  it('clears success state when parent authority advances task status or approval status at the same revision', async () => {
    const handler = vi.fn(async (request: any) => ({ status: 'success', operationId: request.operationId }))
    const wrapper = mountWorkbench({ tasks: [operationTask()], artifacts: operationArtifacts, actionHandler: handler })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(wrapper.text()).toContain('成功')

    await wrapper.setProps({ tasks: [operationTask({ status: 'complete' })] })
    expect(wrapper.find('.aheart-ai-workbench__operation-status').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('成功')

    await wrapper.setProps({ tasks: [operationTask({ status: 'waiting-approval', approval: { status: 'pending' } })] })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    await wrapper.setProps({ tasks: [operationTask({ status: 'waiting-approval', approval: { status: 'approved' } })] })
    expect(wrapper.find('.aheart-ai-workbench__operation-status').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('成功')
  })

  it('keeps approval outcomes from rewriting task status, completion count, or timeline/header state', () => {
    const wrapper = mountWorkbench({
      tasks: [
        { id: 'approved', label: '已批准但执行中', status: 'running', approval: { id: 'a1', status: 'approved' } },
        { id: 'rejected', label: '已拒绝待审批', status: 'waiting-approval', approval: { id: 'a2', status: 'rejected' } }
      ]
    })

    expect(wrapper.get('[data-workbench-status]').text()).toContain('执行中')
    expect(wrapper.get('.aheart-ai-workbench__progress').text()).toContain('0 / 2 已完成')
    expect(wrapper.get('[data-task-id="approved"]').classes()).toContain('is-running')
    expect(wrapper.get('[data-task-id="approved"] .aheart-ai-workbench__task-status').text()).toBe('执行中')
    expect(wrapper.get('[data-task-id="rejected"]').classes()).toContain('is-waiting-approval')
    expect(wrapper.get('[data-task-id="rejected"] .aheart-ai-workbench__task-status').text()).toBe('等待审批')
  })

  it('aborts a pending operation when the approval artifact changes identity even with the same revision', async () => {
    const gate = deferred<any>()
    const handler = vi.fn(() => gate.promise)
    const wrapper = mountWorkbench({
      tasks: [operationTask()],
      artifacts: operationArtifacts,
      actionHandler: handler
    })
    await clickAction(wrapper, 'publish', 'approve')
    const signal = handler.mock.calls[0][1] as AbortSignal

    await wrapper.setProps({
      tasks: [operationTask({ approval: { artifactId: 'artifact-2' } })],
      artifacts: [{ id: 'artifact-2', title: '另一份报告', revision: 'artifact-r1' }]
    })
    expect(signal.aborted).toBe(true)
    gate.resolve({ status: 'success', operationId: handler.mock.calls[0][0].operationId })
    await flushPromises()
    expect(wrapper.text()).not.toContain('成功')
  })

  it('starts a fresh idempotent intent after conversation or handler authority changes', async () => {
    const attempts: any[] = []
    const handlerA = vi.fn(async (request: any) => {
      attempts.push(request)
      return { status: 'success', operationId: request.operationId }
    })
    const handlerB = vi.fn(async (request: any) => {
      attempts.push(request)
      return { status: 'success', operationId: request.operationId }
    })
    const wrapper = mountWorkbench({
      activeConversation: 'conversation-a',
      tasks: [operationTask()],
      artifacts: operationArtifacts,
      actionHandler: handlerA
    })

    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    await wrapper.setProps({ activeConversation: 'conversation-b' })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(attempts[1].idempotencyKey).not.toBe(attempts[0].idempotencyKey)

    await wrapper.setProps({ actionHandler: handlerB, activeConversation: 'conversation-c' })
    await clickAction(wrapper, 'publish', 'approve')
    await flushPromises()
    expect(attempts[2].idempotencyKey).not.toBe(attempts[1].idempotencyKey)
  })

  it('requires task and referenced artifact revisions before enabling handler actions', () => {
    const noTaskRevision = mountWorkbench({
      tasks: [task({ revision: undefined })],
      actionHandler: vi.fn()
    })
    expect(noTaskRevision.get('[data-action="approve"]').attributes('disabled')).toBeDefined()
    expect(noTaskRevision.text()).toContain('版本')

    const noArtifactRevision = mountWorkbench({
      tasks: [operationTask()],
      artifacts: [{ id: 'artifact-1', title: '报告' }],
      actionHandler: vi.fn()
    })
    expect(noArtifactRevision.get('[data-action="approve"]').attributes('disabled')).toBeDefined()
    expect(noArtifactRevision.text()).toContain('版本')
  })
})

describe('D8 Workbench dependency-aware reorder contract', () => {
  const reorderTasks = [
    { id: 'source', label: '准备资料', status: 'pending', revision: 'r1' },
    { id: 'dependent', label: '生成结果', status: 'pending', revision: 'r1', dependsOn: ['source'] },
    { id: 'free', label: '补充说明', status: 'pending', revision: 'r1' }
  ]

  it('translates D7 SortableList moveReject events into safe Workbench rejection messages', async () => {
    const wrapper = mountWorkbench({ tasks: [task({ revision: 'tasks-r1' })], tasksRevision: 'tasks-r1' })
    const taskList = wrapper.findAllComponents({ name: 'ASortableList' }).find((item) => item.props('group')?.toString().includes('task'))
    expect(taskList?.exists()).toBe(true)
    const location = { listId: 'workbench-task-list', listLabel: '执行时间线', index: 0, revision: 'tasks-r1' }
    const event = {
      transactionId: 'tx-stale',
      sessionId: 'session-stale',
      input: 'pointer' as const,
      itemKey: 'publish::0',
      itemLabel: '发布结果',
      source: location,
      target: { ...location, index: 1 },
      position: { kind: 'end' as const },
      reason: 'stale-revision' as const
    }

    taskList?.vm.$emit('moveReject', event)
    await nextTick()
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
    expect(wrapper.emitted('task-move-reject')?.[0]).toEqual(['任务版本已变化，排序已拒绝'])

    taskList?.vm.$emit('moveReject', { ...event, transactionId: 'tx-disabled', reason: 'disabled' })
    await nextTick()
    const safeReason = String(wrapper.emitted('task-move-reject')?.[1]?.[0])
    expect(safeReason).toContain('排序已拒绝')
    expect(safeReason).not.toContain('[object Object]')
  })

  it('rejects dependency inversion for both move buttons and sortable candidates', async () => {
    const wrapper = mountWorkbench({ tasks: reorderTasks, tasksRevision: 'tasks-r1' })
    await clickAction(wrapper, 'dependent', 'move-up')
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
    expect(wrapper.emitted('task-move-reject')).toHaveLength(1)

    const sortables = wrapper.findAllComponents({ name: 'ASortableList' })
    const taskList = sortables.find((item) => item.props('group')?.toString().includes('task'))
    taskList?.vm.$emit('update:items', [reorderTasks[1], reorderTasks[0], reorderTasks[2]])
    await nextTick()
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
  })

  it('exposes actionable lock reasons and applies the same lock to buttons and drag state', async () => {
    const wrapper = mountWorkbench({
      reorderable: true,
      tasks: [
        { ...reorderTasks[0], status: 'running' },
        { ...reorderTasks[1], lockedReason: '等待上游任务' },
        { ...reorderTasks[2], reorderable: false }
      ]
    })

    expect(wrapper.get('[data-task-id="source"] [data-action="move-down"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-task-id="dependent"] [data-action="move-up"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-task-id="dependent"]').text()).toContain('等待上游任务')
    expect(wrapper.get('[data-task-id="free"] [data-action="move-up"]').attributes('disabled')).toBeDefined()
  })

  it('keeps locked indexes fixed while allowing free tasks to exchange order without move-task side effects', async () => {
    const locked = { id: 'locked', label: '固定任务', status: 'pending', reorderable: false }
    const freeA = { id: 'free-a', label: '自由 A', status: 'pending' }
    const freeB = { id: 'free-b', label: '自由 B', status: 'pending' }
    const wrapper = mountWorkbench({ tasks: [locked, freeA, freeB], tasksRevision: 'tasks-r1' })
    const freeMove = wrapper.get('[data-task-id="free-b"] [data-action="move-up"]')
    expect(freeMove.attributes('disabled')).toBeUndefined()
    await freeMove.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:tasks')?.[0]?.[0]).toEqual([locked, freeB, freeA])
    expect(wrapper.emitted('move-task')).toHaveLength(1)
    expect(wrapper.emitted('task-move-reject')).toBeUndefined()
  })

  it('locks running and waiting-approval tasks even when revision is absent and rejects changed candidate fields', async () => {
    const wrapper = mountWorkbench({
      tasks: [
        { id: 'running-no-revision', label: '执行中', status: 'running' },
        { id: 'waiting-no-revision', label: '等待审批', status: 'waiting-approval', approval: { id: 'approval' } },
        { id: 'free', label: '自由任务', status: 'pending' }
      ],
      tasksRevision: 'tasks-r2'
    })
    expect(wrapper.get('[data-task-id="running-no-revision"] [data-action="move-down"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-task-id="waiting-no-revision"] [data-action="move-down"]').attributes('disabled')).toBeDefined()

    const taskList = wrapper.findAllComponents({ name: 'ASortableList' }).find((item) => item.props('group')?.toString().includes('task'))
    const changed = [
      { id: 'running-no-revision', label: '篡改后的标签', status: 'running' },
      { id: 'waiting-no-revision', label: '等待审批', status: 'waiting-approval', approval: { id: 'approval' } },
      { id: 'free', label: '自由任务', status: 'pending' }
    ]
    taskList?.vm.$emit('update:items', changed)
    await nextTick()
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
    expect(wrapper.emitted('move-task')).toBeUndefined()
    expect(wrapper.emitted('task-move-reject')).toHaveLength(1)
  })

  it('passes tasksRevision to the sortable candidate path and disables it when reorderable is false', async () => {
    const wrapper = mountWorkbench({
      tasks: [
        { id: 'a', label: 'A', status: 'pending' },
        { id: 'b', label: 'B', status: 'pending' }
      ],
      tasksRevision: 'tasks-r9',
      reorderable: false
    })
    const taskList = wrapper.findAllComponents({ name: 'ASortableList' }).find((item) => item.props('group')?.toString().includes('task'))
    expect(taskList?.props('revision')).toBe('tasks-r9')
    expect(taskList?.props('disabled')).toBe(true)
    taskList?.vm.$emit('update:items', [
      { id: 'b', label: 'B', status: 'pending' },
      { id: 'a', label: 'A', status: 'pending' }
    ])
    await nextTick()
    expect(wrapper.emitted('update:tasks')).toBeUndefined()
    expect(wrapper.emitted('move-task')).toBeUndefined()
  })

  it('rejects stale task revisions, duplicate ids, missing dependencies, cycles, and data changes during a drag', async () => {
    const wrapper = mountWorkbench({ tasks: reorderTasks, tasksRevision: 'tasks-r1' })
    await wrapper.setProps({ tasksRevision: 'tasks-r2' })
    const sortables = wrapper.findAllComponents({ name: 'ASortableList' })
    const taskList = sortables.find((item) => item.props('group')?.toString().includes('task'))
    expect(taskList?.props('revision')).toBe('tasks-r2')

    const moveAndExpectReject = async (expectedCount: number) => {
      const move = wrapper.find('[data-action="move-down"]')
      expect(move.exists()).toBe(true)
      await move.trigger('click')
      await nextTick()
      expect(wrapper.emitted('task-move-reject')).toHaveLength(expectedCount)
    }

    await wrapper.setProps({ tasks: [
      { id: 'missing', label: '缺失依赖', status: 'pending', dependsOn: ['does-not-exist'] },
      { id: 'other', label: '其他任务', status: 'pending' }
    ] })
    expect(wrapper.text()).toContain('无法排序')
    await moveAndExpectReject(1)

    await wrapper.setProps({ tasks: [
      { id: 'cycle-a', label: '循环 A', status: 'pending', dependsOn: ['cycle-b'] },
      { id: 'cycle-b', label: '循环 B', status: 'pending', dependsOn: ['cycle-a'] }
    ] })
    expect(wrapper.text()).toContain('无法排序')
    await moveAndExpectReject(2)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await wrapper.setProps({ tasks: [
      { id: 'same', label: 'A', status: 'pending' },
      { id: 'same', label: 'B', status: 'pending' }
    ] })
    expect(wrapper.text()).toContain('无法排序')
    await moveAndExpectReject(3)
    const duplicateKeyWarnings = warn.mock.calls.filter(([message]) => String(message).includes('Duplicate keys'))
    warn.mockRestore()
    expect(duplicateKeyWarnings).toHaveLength(0)
  })
})

describe('D8 Workbench scope isolation', () => {
  it('keeps task and context DnD groups isolated between workbench instances', () => {
    const Host = defineComponent({
      setup: () => () => h('div', [
        h(Workbench, { scopeKey: 'shared', tasks: [task({ id: 'left-task' })], contextItems: [{ id: 'left-context', label: '左侧' }] }),
        h(Workbench, { scopeKey: 'shared', tasks: [task({ id: 'right-task' })], contextItems: [{ id: 'right-context', label: '右侧' }] })
      ])
    })
    const wrapper = mount(Host)
    const groups = wrapper.findAllComponents({ name: 'ASortableList' }).map((list) => String(list.props('group')))
    expect(groups.filter((group) => group.includes('task'))).toHaveLength(2)
    expect(groups.filter((group) => group.includes('context'))).toHaveLength(2)
    expect(new Set(groups.filter((group) => group.includes('task'))).size).toBe(2)
    expect(new Set(groups.filter((group) => group.includes('context'))).size).toBe(2)
    expect(groups.every((group) => group.includes('scope-shared'))).toBe(true)

    const headingIds = wrapper.findAllComponents({ name: 'AIAgentWorkbenchExecution' }).flatMap((execution) => [
      execution.get('.aheart-ai-workbench__tasks h2').attributes('id'),
      execution.get('.aheart-ai-workbench__artifacts h2').attributes('id')
    ])
    expect(new Set(headingIds).size).toBe(headingIds.length)
  })
})
