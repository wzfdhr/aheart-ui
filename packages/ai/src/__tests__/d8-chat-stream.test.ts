import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AIChatPanel from '../chat-panel.vue'
import type { AIMessage, AIStreamEvent, AITransport } from '../types'

type StreamEvent = Record<string, unknown> & {
  version: '2'
  requestId: string
  messageId: string
  sequence: number
  revision: number
  type: string
}

const requestIdentity = {
  requestId: 'request-1',
  messageId: 'message-1',
  idempotencyKey: 'idem-1'
}

function event(type: string, sequence: number, revision = 0, fields: Record<string, unknown> = {}, identity = requestIdentity): StreamEvent {
  return {
    version: '2',
    ...identity,
    type,
    sequence,
    revision,
    ...fields
  }
}

function text(sequence: number, delta: string, revision = 0, identity = requestIdentity) {
  return event('text-delta', sequence, revision, { delta }, identity)
}

function snapshot(sequence: number, content: string, revision: number, identity = requestIdentity) {
  return event('snapshot', sequence, revision, {
    message: { id: identity.messageId, role: 'assistant', content, status: 'streaming' }
  }, identity)
}

function final(sequence: number, content: string, revision: number, extra: Record<string, unknown> = {}, identity = requestIdentity) {
  return event('final', sequence, revision, {
    message: { id: identity.messageId, role: 'assistant', content, status: 'complete', ...extra }
  }, identity)
}

async function loadReducer() {
  const api = await import('../index') as Record<string, any>
  expect(typeof api.createAIStreamReducer).toBe('function')
  expect(typeof api.reduceAIStreamEvent).toBe('function')
  return api as {
    createAIStreamReducer: (request: Record<string, unknown>) => any
    reduceAIStreamEvent: (state: any, event: StreamEvent) => any
  }
}

function dispatch(api: Awaited<ReturnType<typeof loadReducer>>, reducer: any, item: StreamEvent) {
  if (typeof reducer.dispatch === 'function') return reducer.dispatch(item)
  if (typeof reducer.reduce === 'function') return reducer.reduce(item)
  return api.reduceAIStreamEvent(reducer, item)
}

function stateOf(reducer: any, result: any) {
  if (result?.state) return result.state
  if (result) return result
  return typeof reducer.getState === 'function' ? reducer.getState() : result
}

async function* v1Events(values: AIStreamEvent[]) {
  for (const value of values) yield value
}

describe('D8 V2 stream protocol and reducer', () => {
  it('keeps the V1 transport arrival-order and EOF compatibility contract', async () => {
    const request: Record<string, unknown>[] = []
    const transport: AITransport = {
      send(value) {
        request.push(value as unknown as Record<string, unknown>)
        return v1Events([
          { type: 'text-delta', delta: 'V1 ' },
          { type: 'text-delta', delta: 'compatibility' }
        ])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [] } })
    await wrapper.get('textarea').setValue('legacy')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(request[0]).not.toHaveProperty('version')
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(
      expect.objectContaining({ role: 'assistant', content: 'V1 compatibility', status: 'complete' })
    )
  })

  it('accepts only the V2 envelope and starts at the empty cursor', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    const result = dispatch(api, reducer, text(1, 'hello'))
    const state = stateOf(reducer, result)
    expect(state.cursor).toEqual({ afterSequence: 1, revision: 0 })
    expect(state.message.content).toBe('hello')
    expect(state.status).toBe('streaming')
  })

  it('rejects malformed, mismatched, unsafe and mixed-protocol envelopes without mutation', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(1, 'safe'))
    const before = structuredClone(stateOf(reducer, undefined))
    for (const invalid of [
      { ...text(2, 'bad'), version: '1' },
      { ...text(2, 'bad'), requestId: 'other-request' },
      { ...text(2, 'bad'), messageId: 'other-message' },
      { ...text(Number.MAX_SAFE_INTEGER + 1, 'bad') },
      { ...text(2, 'bad'), revision: -1 },
      { ...text(2, 'bad'), sequence: 0 },
      { type: 'done' }
    ] as StreamEvent[]) {
      const result = dispatch(api, reducer, invalid)
      expect(stateOf(reducer, result)).toMatchObject({ cursor: before.cursor, message: before.message })
      expect(stateOf(reducer, result).diagnostic.kind).toBe('protocol-error')
    }
  })

  it('applies contiguous deltas once and treats identical replays as no-ops', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(1, 'a'))
    dispatch(api, reducer, text(2, 'b'))
    const replay = dispatch(api, reducer, text(2, 'b'))
    expect(stateOf(reducer, replay).message.content).toBe('ab')
    expect(stateOf(reducer, replay).diagnostic.kind).toBe('duplicate')
    expect(stateOf(reducer, replay).cursor.afterSequence).toBe(2)
  })

  it('rejects a conflicting same-sequence payload and never mutates visible content', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(1, 'a'))
    const result = dispatch(api, reducer, text(1, 'different'))
    expect(stateOf(reducer, result).message.content).toBe('a')
    expect(stateOf(reducer, result).diagnostic.kind).toBe('protocol-error')
  })

  it('buffers out-of-order events, drains a closed gap, and requests recovery beyond 32', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    const buffered = dispatch(api, reducer, text(3, 'c'))
    expect(stateOf(reducer, buffered).cursor.afterSequence).toBe(0)
    expect(stateOf(reducer, buffered).diagnostic.kind).toBe('buffered')
    dispatch(api, reducer, text(1, 'a'))
    const drained = dispatch(api, reducer, text(2, 'b'))
    expect(stateOf(reducer, drained).message.content).toBe('abc')
    expect(stateOf(reducer, drained).cursor.afterSequence).toBe(3)

    const overflow = api.createAIStreamReducer(requestIdentity)
    const result = dispatch(api, overflow, text(34, 'too far'))
    expect(stateOf(overflow, result).diagnostic.kind).toBe('gap')
    expect(stateOf(overflow, result).recoveryRequired).toBe(true)
  })

  it('keeps only the latest 64 fingerprints and classifies an evicted old sequence as stale', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    for (let sequence = 1; sequence <= 65; sequence += 1) dispatch(api, reducer, text(sequence, '.'))
    const result = dispatch(api, reducer, text(1, 'conflicting after eviction'))
    expect(stateOf(reducer, result).diagnostic.kind).toBe('stale')
    expect(stateOf(reducer, result).message.content).toHaveLength(65)
  })

  it('enforces revision baselines, checkpoint monotonicity and sequence monotonicity', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(1, 'local'))
    const lower = dispatch(api, reducer, text(2, 'ignored', -1))
    expect(stateOf(reducer, lower).diagnostic.kind).toBe('protocol-error')
    const checkpoint = dispatch(api, reducer, snapshot(3, 'authoritative', 2))
    expect(stateOf(reducer, checkpoint).message.content).toBe('authoritative')
    expect(stateOf(reducer, checkpoint).cursor).toEqual({ afterSequence: 3, revision: 2 })
    const lowerCheckpoint = dispatch(api, reducer, snapshot(4, 'old', 1))
    expect(stateOf(reducer, lowerCheckpoint).message.content).toBe('authoritative')
    expect(stateOf(reducer, lowerCheckpoint).cursor).toEqual({ afterSequence: 3, revision: 2 })
    const staleHighRevision = dispatch(api, reducer, snapshot(2, 'backwards', 8))
    expect(stateOf(reducer, staleHighRevision).cursor.afterSequence).toBe(3)
    expect(stateOf(reducer, staleHighRevision).message.content).toBe('authoritative')
  })

  it('allows authoritative snapshot/final to cross a forward gap and projects tool calls safely', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    const result = dispatch(api, reducer, final(10, 'done', 4, {
      toolCall: { id: 'tool-1', name: 'search', summary: '查找资料', inputStatus: 'ready', inputSummary: 'safe', resultStatus: 'success', resultSummary: '完成', secret: 'remove' },
      reasoning: 'must never render', rawArguments: { secret: true }
    }))
    const state = stateOf(reducer, result)
    expect(state.cursor).toEqual({ afterSequence: 10, revision: 4 })
    expect(state.status).toBe('completed')
    expect(state.message.toolCall).toEqual({ id: 'tool-1', name: 'search', summary: '查找资料', inputStatus: 'ready', inputSummary: 'safe', resultStatus: 'success', resultSummary: '完成' })
    expect(state.message).not.toHaveProperty('reasoning')
    expect(state.message).not.toHaveProperty('rawArguments')
  })

  it('clears older tool summaries when a checkpoint omits toolCall and prevents terminal revival', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, snapshot(1, 'working', 1))
    dispatch(api, reducer, final(2, 'finished', 1, { message: { id: 'message-1', role: 'assistant', content: 'finished', status: 'complete' } }))
    const late = dispatch(api, reducer, text(3, 'late'))
    const duplicate = dispatch(api, reducer, final(2, 'finished', 1, { message: { id: 'message-1', role: 'assistant', content: 'finished', status: 'complete' } }))
    expect(stateOf(reducer, late).status).toBe('completed')
    expect(stateOf(reducer, late).diagnostic.kind).toBe('terminal-no-op')
    expect(stateOf(reducer, duplicate).diagnostic.kind).toBe('duplicate')
  })

  it('uses one recovery path for throw, EOF and gaps, respecting resume budget and explicit final', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer({ ...requestIdentity, maxReconnectAttempts: 1 })
    expect(typeof reducer.recover).toBe('function')
    dispatch(api, reducer, text(1, 'before'))
    const eof = reducer.recover({ reason: 'eof' })
    expect(eof.recoveryRequired).toBe(true)
    expect(eof.status).toBe('reconnecting')
    const exhausted = reducer.recover({ reason: 'transport-throw' })
    expect(exhausted.status).toBe('error')
    expect(exhausted.message.error).toMatch(/重试|retry/i)

    const finalReducer = api.createAIStreamReducer({ ...requestIdentity, maxReconnectAttempts: 0 })
    dispatch(api, finalReducer, text(1, 'x'))
    const explicit = dispatch(api, finalReducer, final(2, 'x done', 0))
    expect(stateOf(finalReducer, explicit).status).toBe('completed')
  })
})

describe('D8 AIChatPanel lifecycle and owner realm', () => {
  it('sends a V2 request with frozen identities and resumes with the same cursor identity', async () => {
    const requests: Record<string, unknown>[] = []
    const resumed: Record<string, unknown>[] = []
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        requests.push(request)
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, 'part', 0, identity)
        throw new Error('socket closed')
      },
      async *resume(request: Record<string, unknown>) {
        resumed.push(request)
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield final(2, 'complete', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 1, messages: [] } })
    await wrapper.get('textarea').setValue('V2')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(requests[0]).toMatchObject({ version: '2', idempotencyKey: expect.any(String), requestId: expect.any(String), messageId: expect.any(String) })
    expect(resumed[0]).toMatchObject({ version: '2', requestId: requests[0].requestId, messageId: requests[0].messageId, idempotencyKey: requests[0].idempotencyKey, resume: { afterSequence: 1, revision: 0 } })
  })

  it('aborts and ignores late events after unmount, conversation change, and transport replacement', async () => {
    const releases: Array<() => void> = []
    const aborted: AbortSignal[] = []
    const transport = {
      send(_request: unknown, signal: AbortSignal) {
        aborted.push(signal)
        return (async function* () {
          yield text(1, 'before')
          await new Promise<void>((resolve) => releases.push(resolve))
          yield text(2, 'late')
        })()
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, activeConversation: 'one' } })
    await wrapper.get('textarea').setValue('hello')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.setProps({ activeConversation: 'two' })
    expect(aborted[0]?.aborted).toBe(true)
    releases.forEach((release) => release())
    await flushPromises()
    expect(wrapper.text()).not.toContain('late')

    const replacementSignals: AbortSignal[] = []
    const priorAborted = aborted.length
    const replacementTransport = {
      send(_request: unknown, signal: AbortSignal) {
        replacementSignals.push(signal)
        return (async function* () {
          await new Promise<void>((resolve) => signal.addEventListener('abort', resolve, { once: true }))
        })()
      }
    }
    const replacementWrapper = mount(AIChatPanel, { props: { transport, activeConversation: 'replacement' } })
    await replacementWrapper.get('textarea').setValue('replace transport')
    await replacementWrapper.get('button[type="submit"]').trigger('click')
    await replacementWrapper.setProps({ transport: replacementTransport })
    expect(aborted.length).toBe(priorAborted + 1)
    expect(aborted.at(-1)?.aborted).toBe(true)
    expect(replacementSignals).toHaveLength(0)
    replacementWrapper.unmount()

    const beforeUnmount = aborted.length
    wrapper.unmount()
    expect(aborted.length).toBe(beforeUnmount)
  })

  it('does not present a rejected controlled candidate as accepted state', async () => {
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield final(1, 'candidate', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [] } })
    await wrapper.get('textarea').setValue('reject me')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    const candidates = wrapper.emitted('update:messages') ?? []
    expect(candidates.length).toBeGreaterThanOrEqual(1)
    expect(candidates.at(-1)?.[0]).toContainEqual(expect.objectContaining({ content: 'candidate', status: 'complete' }))
    expect(wrapper.text()).not.toContain('candidate')
    expect(wrapper.get('[role="status"]').text()).not.toContain('candidate')
  })

  it('uses the rendered root ownerDocument clipboard and focus realm', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameDocument = frame.contentDocument!
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(frameDocument.defaultView!.navigator, 'clipboard', { configurable: true, value: { writeText } })
    const message: AIMessage = { id: 'assistant', role: 'assistant', content: '来自 iframe', status: 'complete' }
    const transport: AITransport = { send: () => v1Events([{ type: 'done' }]) }
    const wrapper = mount(AIChatPanel, { attachTo: frameDocument.body, props: { transport, messages: [message] } })
    await wrapper.get('[data-action="copy"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('来自 iframe')
    expect(wrapper.element.ownerDocument).toBe(frameDocument)
    const textarea = wrapper.element.querySelector('textarea')!
    expect(textarea.ownerDocument).toBe(frameDocument)
    textarea.focus()
    expect(frameDocument.activeElement).toBe(textarea)
    wrapper.unmount()
    frame.remove()
  })
})

describe('D8 accepted candidates, request identity and stream status', () => {
  it('keeps streaming status when the first V2 packet is buffered behind a sequence gap', async () => {
    const transport = { version: '2' as const, async *send(request: Record<string, unknown>) { const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }; yield text(2, 'buffered', 0, identity); await new Promise<void>(() => {}) } }
    const wrapper = mount(AIChatPanel, { props: { transport } })
    await wrapper.get('textarea').setValue('gap')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[role="status"]').text()).toBe('正在生成')
    wrapper.unmount()
  })

  it('renders an uncontrolled V2 delta/final candidate and settles it as complete', async () => {
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, '流式 ', 0, identity)
        yield final(2, '流式完成', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })
    await wrapper.get('textarea').setValue('显示 V2')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('流式完成')
    expect(wrapper.get('[role="status"]').text()).toBe('已完成生成')
    expect(wrapper.emitted('stream-status')).toEqual(expect.arrayContaining([expect.any(Array)]))
  })

  it('emits each accepted controlled candidate while keeping a rejected parent candidate invisible, then shows a parent acceptance', async () => {
    let release: (() => void) | undefined
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, '第一段', 0, identity)
        await new Promise<void>((resolve) => { release = resolve })
        yield final(2, '第一段第二段', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [] } })
    await wrapper.get('textarea').setValue('受控候选')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    const updates = wrapper.emitted('update:messages') ?? []
    expect(updates.length).toBeGreaterThanOrEqual(2)
    const firstCandidate = updates.at(-1)?.[0] as AIMessage[]
    expect(firstCandidate.at(-1)).toMatchObject({ content: '第一段', status: 'streaming' })
    expect(wrapper.text()).not.toContain('第一段')
    await wrapper.setProps({ messages: firstCandidate })
    release?.()
    await flushPromises()
    const finalCandidate = wrapper.emitted('update:messages')?.at(-1)?.[0] as AIMessage[]
    expect(wrapper.emitted('update:messages')?.length).toBeGreaterThanOrEqual(3)
    expect(finalCandidate.at(-1)).toMatchObject({ content: '第一段第二段', status: 'complete' })
    await wrapper.setProps({ messages: finalCandidate })
    expect(wrapper.text()).toContain('第一段第二段')
  })

  it('uses a fresh output messageId and targetMessageId for edit, retry and regenerate, while resume reuses both identities', async () => {
    const oldAssistant: AIMessage = { id: 'assistant-old', role: 'assistant', content: '旧回答', status: 'complete' }
    const oldError: AIMessage = { id: 'assistant-error', role: 'assistant', content: '', status: 'error', error: '断线' }
    const requests: Record<string, unknown>[] = []
    const resumes: Record<string, unknown>[] = []
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        requests.push(request)
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, 'partial', 0, identity)
        if (requests.length === 1) throw new Error('resume me')
        yield final(2, 'done', 0, {}, identity)
      },
      async *resume(request: Record<string, unknown>) {
        resumes.push(request)
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield final(2, 'resumed', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, {
      props: {
        transport,
        defaultMessages: [
          { id: 'user-old', role: 'user', content: '原问题', status: 'complete' },
          oldAssistant,
          { id: 'user-error', role: 'user', content: '失败问题', status: 'complete' },
          oldError
        ]
      }
    })

    await wrapper.get('[data-message-id="assistant-error"] [data-action="retry"]').trigger('click')
    await flushPromises()
    await wrapper.get('[data-message-id="assistant-old"] [data-action="regenerate"]').trigger('click')
    await flushPromises()
    await wrapper.get('[data-message-id="user-old"] [data-action="edit"]').trigger('click')
    await wrapper.get('textarea').setValue('编辑后的问题')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()

    expect(requests.length).toBe(3)
    expect(requests[0]).toMatchObject({ action: 'retry', targetMessageId: 'assistant-error' })
    expect(requests[1]).toMatchObject({ action: 'regenerate', targetMessageId: 'assistant-old' })
    expect(requests[2]).toMatchObject({ action: 'edit', targetMessageId: 'user-old' })
    for (const request of requests) {
      expect(request.messageId).not.toBe(request.targetMessageId)
    }
    expect(resumes[0]).toMatchObject({ messageId: requests[0].messageId, targetMessageId: 'assistant-error', idempotencyKey: requests[0].idempotencyKey })
  })
})

describe('D8 reducer edge and terminal invariants', () => {
  it('consumes a lower-revision contiguous event without changing the message, but rejects higher-revision deltas until a checkpoint', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, snapshot(1, 'server baseline', 3))
    const lower = dispatch(api, reducer, text(2, ' ignored', 2))
    expect(stateOf(reducer, lower).cursor).toEqual({ afterSequence: 2, revision: 3 })
    expect(stateOf(reducer, lower).message.content).toBe('server baseline')
    const higher = dispatch(api, reducer, text(3, 'must wait', 4))
    expect(stateOf(reducer, higher).cursor).toEqual({ afterSequence: 2, revision: 3 })
    expect(stateOf(reducer, higher).message.content).toBe('server baseline')
    expect(stateOf(reducer, higher).diagnostic.kind).toBe('protocol-error')
  })

  it('rejects conflicting events already waiting in the out-of-order buffer', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(3, 'first'))
    const conflict = dispatch(api, reducer, text(3, 'different'))
    expect(stateOf(reducer, conflict).diagnostic.kind).toBe('protocol-error')
  })

  it('fingerprints matching and conflicting final/cancelled/error terminal events', async () => {
    const api = await loadReducer()
    for (const terminal of [
      final(1, 'done', 0),
      event('cancelled', 1, 0, { reason: 'stopped' }),
      event('error', 1, 0, { error: 'failed', retryable: true })
    ]) {
      const reducer = api.createAIStreamReducer(requestIdentity)
      const first = dispatch(api, reducer, terminal)
      expect(stateOf(reducer, first).status).toMatch(/completed|cancelled|error/)
      const matching = dispatch(api, reducer, terminal)
      expect(stateOf(reducer, matching).diagnostic.kind).toBe('duplicate')
      const conflicting = dispatch(api, reducer, { ...terminal, ...(terminal.type === 'final' ? { message: { id: 'message-1', role: 'assistant', content: 'different', status: 'complete' } } : terminal.type === 'error' ? { error: 'different' } : { reason: 'different' }) })
      expect(stateOf(reducer, conflicting).diagnostic.kind).toBe('protocol-error')
    }
  })

  it('clears omitted checkpoint-owned fields and enforces snapshot streaming/final complete status', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer({ ...requestIdentity, initialMessage: {
      id: 'message-1', role: 'assistant', content: 'old', status: 'streaming',
      process: [{ id: 'p', label: 'old', status: 'running' }], sources: [{ id: 's', title: 'old' }], error: 'old error',
      toolCall: { id: 'tool', name: 'old', summary: 'old' }
    } })
    const snap = dispatch(api, reducer, { ...snapshot(1, 'new', 1), message: { id: 'message-1', role: 'assistant', content: 'new', status: 'complete' } })
    expect(stateOf(reducer, snap).message.status).toBe('streaming')
    expect(stateOf(reducer, snap).message).not.toHaveProperty('process')
    expect(stateOf(reducer, snap).message).not.toHaveProperty('sources')
    expect(stateOf(reducer, snap).message).not.toHaveProperty('error')
    const fin = dispatch(api, reducer, { ...final(2, 'final', 1), message: { id: 'message-1', role: 'assistant', content: 'final', status: 'streaming' } })
    expect(stateOf(reducer, fin).message.status).toBe('complete')
  })

  it('drains buffered contiguous events after an authoritative checkpoint and rejects unknown types or empty identities', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(3, 'buffered', 1))
    const checkpoint = dispatch(api, reducer, snapshot(2, 'checkpoint', 1))
    expect(stateOf(reducer, checkpoint).message.content).toBe('checkpointbuffered')
    const unknown = dispatch(api, reducer, { ...text(4, 'unknown'), type: 'unknown' })
    expect(stateOf(reducer, unknown).diagnostic.kind).toBe('protocol-error')
    const empty = dispatch(api, reducer, { ...text(5, 'empty'), requestId: '' })
    expect(stateOf(reducer, empty).diagnostic.kind).toBe('protocol-error')
  })

  it('does not revive a terminal server error through recovery', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer({ ...requestIdentity, maxReconnectAttempts: 3 })
    dispatch(api, reducer, event('error', 1, 0, { error: 'fatal', retryable: true }))
    const recovered = reducer.recover({ reason: 'late transport throw' })
    expect(recovered.status).toBe('error')
    expect(recovered.diagnostic.kind).toBe('terminal-no-op')
  })
})

describe('D8 recovery and epoch closure', () => {
  it('shows a visible accessible reconnecting state and clears it after resume', async () => {
    let rejectSend!: (error: Error) => void
    let releaseResume!: () => void
    let resumeRequest: Record<string, unknown> | undefined
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, 'before', 0, identity)
        await new Promise<void>((_resolve, reject) => { rejectSend = reject as (error: Error) => void })
      },
      async *resume(request: Record<string, unknown>) {
        resumeRequest = request
        await new Promise<void>((resolve) => { releaseResume = resolve })
        yield final(2, 'done', 0, {}, { ...requestIdentity, requestId: String(resumeRequest?.requestId), messageId: String(resumeRequest?.messageId) })
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 1 } })
    await wrapper.get('textarea').setValue('reconnect')
    await wrapper.get('button[type="submit"]').trigger('click')
    rejectSend(new Error('socket closed'))
    await flushPromises()
    const status = wrapper.get('.aheart-ai-chat-panel__stream-reconnecting')
    expect(status.text()).toBe('正在恢复连接')
    expect(status.classes()).not.toContain('aheart-ai-visually-hidden')
    expect(wrapper.find('.aheart-ai-visually-hidden[role="status"]').text()).toBe('')
    releaseResume()
    await flushPromises()
    expect(wrapper.find('.aheart-ai-chat-panel__stream-reconnecting').exists()).toBe(false)
    wrapper.unmount()
  })

  it('uses one immediate recovery path and ends in error without resume or budget, never reconnecting', async () => {
    const attempts: string[] = []
    const makeTransport = (mode: 'eof' | 'throw' | 'gap', withResume = false) => ({
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        if (mode === 'eof') return
        if (mode === 'throw') throw new Error('transport failure')
        yield text(3, 'gap', 0, identity)
      },
      ...(withResume ? { async *resume() { attempts.push(mode) } } : {})
    })
    for (const mode of ['eof', 'throw', 'gap'] as const) {
      const wrapper = mount(AIChatPanel, { props: { transport: makeTransport(mode), maxReconnectAttempts: 0 } })
      await wrapper.get('textarea').setValue(mode)
      await wrapper.get('button[type="submit"]').trigger('click')
      await flushPromises()
      expect(wrapper.emitted('error')?.length).toBeGreaterThan(0)
      expect(wrapper.emitted('stream-status')).toEqual(expect.arrayContaining([['error']]))
      wrapper.unmount()
    }
    expect(attempts).toEqual([])
  })

  it('does not resume after protocol error and does not offer retry for retryable false server errors', async () => {
    let resumeCalls = 0
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield { ...text(1, 'bad', 0, identity), requestId: 'wrong-request' }
        yield event('error', 2, 0, { error: '不可重试', retryable: false }, identity)
      },
      async *resume() { resumeCalls += 1 }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 1 } })
    await wrapper.get('textarea').setValue('protocol')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(resumeCalls).toBe(0)
    expect(wrapper.find('[data-action="retry"]').exists()).toBe(false)
  })

  it('settles immediately after final even when the transport iterator remains suspended', async () => {
    let release: (() => void) | undefined
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield final(1, 'settled', 0, {}, identity)
        await new Promise<void>((resolve) => { release = resolve })
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport } })
    await wrapper.get('textarea').setValue('final')
    await wrapper.get('button[type="submit"]').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(wrapper.get('[role="status"]').text()).toBe('已完成生成')
    release?.()
    wrapper.unmount()
  })

  it('uses owner-realm AbortController, ignores resolved-conversation-equivalent changes, and releases sending on stop despite an abort-ignoring iterator', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const frameWindow = frame.contentWindow!
    const ownerAbort = vi.fn()
    const OwnerAbortController = class extends frameWindow.AbortController {
      abort(...args: []): void { ownerAbort(); super.abort(...args) }
    }
    Object.defineProperty(frameWindow, 'AbortController', { configurable: true, value: OwnerAbortController })
    let release: (() => void) | undefined
    const signals: AbortSignal[] = []
    const transport = {
      send(_request: unknown, signal: AbortSignal) {
        signals.push(signal)
        return (async function* () {
          await new Promise<void>((resolve) => { release = resolve })
          yield { type: 'text-delta', delta: 'late' } as AIStreamEvent
        })()
      }
    }
    const frameDocument = frame.contentDocument!
    const wrapper = mount(AIChatPanel, { attachTo: frameDocument.body, props: { transport, conversationId: 'fixed', activeConversation: 'one' } })
    await wrapper.get('textarea').setValue('epoch')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.setProps({ activeConversation: 'two' })
    expect(signals[0]?.aborted).toBe(false)
    expect(ownerAbort).not.toHaveBeenCalled()
    await wrapper.get('button[aria-label="停止生成"]').trigger('click')
    expect(ownerAbort).toHaveBeenCalled()
    await wrapper.get('textarea').setValue('new request')
    await wrapper.get('button[type="submit"]').trigger('click')
    expect(signals).toHaveLength(2)
    release?.()
    wrapper.unmount()
    frame.remove()
  })

  it('does not emit an error from an old epoch when its iterator rejects after conversation change', async () => {
    let reject: ((error: Error) => void) | undefined
    const transport = {
      send() {
        return (async function* () {
          await new Promise<void>((_resolve, rejectPromise) => { reject = rejectPromise as (error: Error) => void })
          yield { type: 'text-delta', delta: 'never' } as AIStreamEvent
        })()
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, activeConversation: 'one' } })
    await wrapper.get('textarea').setValue('old')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.setProps({ activeConversation: 'two' })
    reject?.(new Error('late old epoch'))
    await flushPromises()
    expect(wrapper.emitted('error')).toBeUndefined()
  })
})

describe('D8 revision barriers, recovery publication and pending epochs', () => {
  it('never displays a future revision buffered before the current baseline', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(2, 'FUTURE', 9))
    const current = dispatch(api, reducer, text(1, 'CURRENT', 0))
    expect(stateOf(reducer, current).message.content).toBe('CURRENT')
    expect(stateOf(reducer, current).message.content).not.toContain('FUTURE')
  })

  it('does not display an old-revision buffered event around a newer snapshot and current delta', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, text(3, 'OLD', 1))
    dispatch(api, reducer, snapshot(2, 'BASE', 2))
    const current = dispatch(api, reducer, text(4, 'CURRENT', 2))
    expect(stateOf(reducer, current).message.content).toBe('BASECURRENT')
    expect(stateOf(reducer, current).message.content).not.toContain('OLD')
  })

  it('does not revive a buffered delta after final, or a post-error delta after a buffered error', async () => {
    const api = await loadReducer()
    const finalReducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, finalReducer, text(2, 'FUTURE', 0))
    const done = dispatch(api, finalReducer, final(1, 'DONE', 0))
    expect(stateOf(finalReducer, done).status).toBe('completed')
    expect(stateOf(finalReducer, done).message.content).toBe('DONE')

    const errorReducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, errorReducer, snapshot(1, 'BASE', 0))
    dispatch(api, errorReducer, event('error', 3, 0, { error: 'buffered error', retryable: true }))
    const error = dispatch(api, errorReducer, text(2, 'before error', 0))
    expect(stateOf(errorReducer, error).status).toBe('error')
    const late = dispatch(api, errorReducer, text(4, 'REVIVE', 0))
    expect(stateOf(errorReducer, late).status).toBe('error')
    expect(stateOf(errorReducer, late).message.content).not.toContain('REVIVE')
  })

  it('publishes an error candidate for V2 EOF without resume and after resume budget exhaustion', async () => {
    const noResume = {
      version: '2' as const,
      async *send() { return }
    }
    const eofWrapper = mount(AIChatPanel, { props: { transport: noResume, messages: [] } })
    await eofWrapper.get('textarea').setValue('EOF')
    await eofWrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    const eofUpdates = eofWrapper.emitted('update:messages') ?? []
    expect(eofUpdates.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', status: 'error' }))
    expect(eofWrapper.emitted('stream-status')).not.toContainEqual(['reconnecting'])
    eofWrapper.unmount()

    let resumeCalls = 0
    const exhausted = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, 'partial', 0, identity)
        throw new Error('drop')
      },
      async *resume() {
        resumeCalls += 1
        throw new Error('resume drop')
      }
    }
    const exhaustedWrapper = mount(AIChatPanel, { props: { transport: exhausted, messages: [] } })
    await exhaustedWrapper.get('textarea').setValue('budget')
    await exhaustedWrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    const exhaustedUpdates = exhaustedWrapper.emitted('update:messages') ?? []
    expect(resumeCalls).toBe(1)
    expect(exhaustedUpdates.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', status: 'error' }))
    exhaustedWrapper.unmount()
  })

  it('starts resume immediately on a gap overflow before the source iterator reaches EOF', async () => {
    let release: (() => void) | undefined
    let resumeCalls = 0
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(34, 'overflow', 0, identity)
        await new Promise<void>((resolve) => { release = resolve })
      },
      async *resume() { resumeCalls += 1; yield }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 1 } })
    await wrapper.get('textarea').setValue('gap')
    await wrapper.get('button[type="submit"]').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(resumeCalls).toBe(1)
    release?.()
    wrapper.unmount()
  })

  it('releases sending immediately on resolved-conversation change and stop, allowing a new request while old iterators remain pending', async () => {
    const signals: AbortSignal[] = []
    let sendCount = 0
    const transport = {
      version: '2' as const,
      send(_request: unknown, signal: AbortSignal) {
        signals.push(signal)
        sendCount += 1
        return (async function* () {
          await new Promise<void>(() => {})
        })()
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, conversationId: 'one' } })
    await wrapper.get('textarea').setValue('first')
    await wrapper.get('button[type="submit"]').trigger('click')
    await wrapper.setProps({ conversationId: 'two' })
    expect(wrapper.find('button[aria-label="停止生成"]').exists()).toBe(false)
    await wrapper.get('textarea').setValue('second')
    await wrapper.get('button[type="submit"]').trigger('click')
    expect(sendCount).toBe(2)
    expect(signals[0]?.aborted).toBe(true)
    wrapper.unmount()

    const stopWrapper = mount(AIChatPanel, { props: { transport } })
    await stopWrapper.get('textarea').setValue('stop first')
    await stopWrapper.get('button[type="submit"]').trigger('click')
    await stopWrapper.get('button[aria-label="停止生成"]').trigger('click')
    expect(stopWrapper.find('button[aria-label="停止生成"]').exists()).toBe(false)
    await stopWrapper.get('textarea').setValue('stop second')
    await stopWrapper.get('button[type="submit"]').trigger('click')
    expect(sendCount).toBe(4)
    stopWrapper.unmount()
  })

  it('does not finish or emit when an old epoch iterator rejects after invalidation', async () => {
    let reject: ((error: Error) => void) | undefined
    const transport = {
      version: '2' as const,
      send() {
        return (async function* () {
          await new Promise<void>((_resolve, rejectPromise) => { reject = rejectPromise as (error: Error) => void })
        })()
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, activeConversation: 'one' } })
    await wrapper.get('textarea').setValue('old epoch')
    await wrapper.get('button[type="submit"]').trigger('click')
    const updatesBefore = wrapper.emitted('update:messages')?.length ?? 0
    await wrapper.setProps({ activeConversation: 'two' })
    reject?.(new Error('late old epoch'))
    await flushPromises()
    expect(wrapper.emitted('update:messages')?.length ?? 0).toBe(updatesBefore)
    expect(wrapper.emitted('error')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('D8 authoritative checkpoints and retryable recovery', () => {
  it('drains only same-revision buffered deltas after a newer snapshot', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    dispatch(api, reducer, snapshot(1, 'A', 2))
    dispatch(api, reducer, text(3, 'OLD', 1))
    const current = dispatch(api, reducer, text(2, 'B', 2))
    expect(stateOf(reducer, current).message.content).toBe('AB')
    expect(stateOf(reducer, current).message.content).not.toContain('OLD')
    expect(stateOf(reducer, current).cursor).toEqual({ afterSequence: 3, revision: 2 })
  })

  it('rejects a final whose outer message is wrong even when a nested message looks valid', async () => {
    const api = await loadReducer()
    const reducer = api.createAIStreamReducer(requestIdentity)
    const result = dispatch(api, reducer, {
      ...final(1, 'outer', 0),
      message: {
        id: 'wrong-message',
        role: 'user',
        content: 'outer',
        message: { id: 'message-1', role: 'assistant', content: 'inner', status: 'complete' }
      }
    } as StreamEvent)
    expect(stateOf(reducer, result).diagnostic.kind).toBe('protocol-error')
    expect(stateOf(reducer, result).status).toBe('idle')
    expect(stateOf(reducer, result).message.content).toBe('')
  })

  it('publishes error instead of reconnecting for maxReconnectAttempts=3 EOF and default no-resume throw', async () => {
    const eofTransport = {
      version: '2' as const,
      async *send() { return }
    }
    const eofWrapper = mount(AIChatPanel, { props: { transport: eofTransport, maxReconnectAttempts: 3, messages: [] } })
    await eofWrapper.get('textarea').setValue('three attempts but no resume')
    await eofWrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(eofWrapper.emitted('stream-status')).not.toContainEqual(['reconnecting'])
    expect(eofWrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', status: 'error' }))
    eofWrapper.unmount()

    const throwTransport = {
      version: '2' as const,
      async *send() { throw new Error('no resume throw') }
    }
    const throwWrapper = mount(AIChatPanel, { props: { transport: throwTransport, messages: [] } })
    await throwWrapper.get('textarea').setValue('default throw')
    await throwWrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(throwWrapper.emitted('stream-status')).not.toContainEqual(['reconnecting'])
    expect(throwWrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', status: 'error' }))
    throwWrapper.unmount()
  })

  it('publishes a retryable terminal error after a delta-then-throw with no resume, regardless of the larger budget', async () => {
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield text(1, 'partial', 0, identity)
        throw new Error('delta then throw')
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 3, messages: [] } })
    await wrapper.get('textarea').setValue('delta then throw')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('stream-status')).not.toContainEqual(['reconnecting'])
    expect(wrapper.emitted('error')).toContainEqual(['连接中断，请重试'])
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', status: 'error', error: '连接中断，请重试' }))
  })

  it('offers a retry after recovery exhaustion and allows the next user retry', async () => {
    let attempts = 0
    const requests: Record<string, unknown>[] = []
    const transport = {
      version: '2' as const,
      async *send(request: Record<string, unknown>) {
        attempts += 1
        requests.push(request)
        if (attempts === 1) throw new Error('recoverable failure')
        const identity = { ...requestIdentity, requestId: String(request.requestId), messageId: String(request.messageId) }
        yield final(1, 'retry success', 0, {}, identity)
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, maxReconnectAttempts: 0 } })
    await wrapper.get('textarea').setValue('retry after exhaustion')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('请重试')
    const retry = wrapper.find('[data-action="retry"]')
    expect(retry.exists()).toBe(true)
    await retry.trigger('click')
    await flushPromises()
    expect(requests).toHaveLength(2)
    expect(wrapper.text()).toContain('retry success')
  })
})

describe('D8 V1 epoch isolation across conversation replacement', () => {
  it('does not let a rejected old conversation overwrite a completed new conversation', async () => {
    let rejectA: ((error: Error) => void) | undefined
    let markAStarted: (() => void) | undefined
    const aStarted = new Promise<void>((resolve) => { markAStarted = resolve })
    const sentConversations: Array<string | undefined> = []
    const transport: AITransport = {
        send(request) {
        sentConversations.push(request.conversationId)
        if (request.conversationId === 'A') {
          return (async function* () {
            markAStarted?.()
            await new Promise<void>((_resolve, reject) => { rejectA = reject as (error: Error) => void })
          })()
        }
        return v1Events([
          { type: 'text-delta', delta: 'NEW' },
          { type: 'done' }
        ])
      }
    }
    const wrapper = mount(AIChatPanel, { props: { transport, messages: [], activeConversation: 'A' } })
    await wrapper.get('textarea').setValue('old A')
    await wrapper.get('button[type="submit"]').trigger('click')
    await aStarted
    await wrapper.setProps({ activeConversation: 'B' })
    await wrapper.get('textarea').setValue('new B')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(sentConversations).toEqual(['A', 'B'])
    const afterNew = wrapper.emitted('update:messages')?.length ?? 0
    expect(afterNew).toBe(4)
    const latest = wrapper.emitted('update:messages')?.at(-1)?.[0] as AIMessage[]
    expect(latest).toContainEqual(expect.objectContaining({ role: 'assistant', content: 'NEW', status: 'complete' }))
    rejectA?.(new Error('old A rejected'))
    await flushPromises()
    expect(wrapper.emitted('update:messages')?.length ?? 0).toBe(afterNew)
    expect(wrapper.emitted('update:messages')?.at(-1)?.[0]).toContainEqual(expect.objectContaining({ role: 'assistant', content: 'NEW', status: 'complete' }))
  })
})
