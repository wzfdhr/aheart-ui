import type { AIMessage, AIStreamEventV2, AIToolCallDisplay } from './types'

export type AIStreamDiagnosticKind = 'accepted' | 'duplicate' | 'buffered' | 'stale' | 'gap' | 'protocol-error' | 'terminal-no-op'
export interface AIStreamReducerState {
  requestId: string
  messageId: string
  cursor: { afterSequence: number; revision: number }
  message: AIMessage
  status: 'idle' | 'streaming' | 'reconnecting' | 'completed' | 'cancelled' | 'error'
  recoveryRequired: boolean
  diagnostic: { kind: AIStreamDiagnosticKind; sequence?: number; reason?: string }
}
export interface AIStreamReducerOptions {
  requestId: string
  messageId: string
  maxReconnectAttempts?: number
  initialMessage?: AIMessage
}
export interface AIStreamReducer {
  dispatch(event: AIStreamEventV2): AIStreamReducerState
  reduce(event: AIStreamEventV2): AIStreamReducerState
  recover(options?: { reason?: string }): AIStreamReducerState
  failRecovery(reason?: string, retryable?: boolean): AIStreamReducerState
  getState(): AIStreamReducerState
}

const safeInt = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value)
const clone = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(clone) as T
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, clone(v)])) as T
  return value
}
const stable = (value: unknown): string => {
  if (value === undefined) return 'undefined'
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(',')}}`
}
const projectTool = (value: unknown): AIToolCallDisplay | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const source = value as Record<string, unknown>
  if (typeof source.id !== 'string' || typeof source.name !== 'string' || typeof source.summary !== 'string') return undefined
  const result: AIToolCallDisplay = { id: source.id, name: source.name, summary: source.summary }
  for (const key of ['inputStatus', 'inputSummary', 'resultStatus', 'resultSummary', 'error'] as const) {
    if (typeof source[key] === 'string') result[key] = source[key] as never
  }
  return result
}
const projectMessage = (value: unknown, identity: string): AIMessage | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const source = value as Record<string, unknown>
  if (source.id !== identity || source.role !== 'assistant' || typeof source.content !== 'string') return undefined
  const message: AIMessage = { id: identity, role: 'assistant', content: source.content }
  if (source.status === 'streaming' || source.status === 'complete') message.status = source.status
  if (typeof source.error === 'string') message.error = source.error
  if (Array.isArray(source.process)) message.process = clone(source.process) as AIMessage['process']
  if (Array.isArray(source.sources)) message.sources = clone(source.sources) as AIMessage['sources']
  if (source.toolCall !== undefined) {
    const tool = projectTool(source.toolCall)
    if (tool) message.toolCall = tool
  }
  return message
}

export const createAIStreamReducer = (options: AIStreamReducerOptions): AIStreamReducer => {
  const maxReconnectAttempts = safeInt(options.maxReconnectAttempts) ? Math.max(0, options.maxReconnectAttempts as number) : 1
  const initial: AIMessage = options.initialMessage ?? { id: options.messageId, role: 'assistant', content: '', status: 'streaming' }
  let state: AIStreamReducerState = {
    requestId: options.requestId,
    messageId: options.messageId,
    cursor: { afterSequence: 0, revision: 0 },
    message: clone(initial),
    status: 'idle',
    recoveryRequired: false,
    diagnostic: { kind: 'accepted' }
  }
  const buffer = new Map<number, AIStreamEventV2>()
  const fingerprints = new Map<number, string>()
  let recoveryAttempts = 0
  const terminalFingerprints = new Map<number, string>()

  const diagnostic = (kind: AIStreamDiagnosticKind, sequence?: number, reason?: string) => {
    state = { ...state, diagnostic: { kind, ...(sequence === undefined ? {} : { sequence }), ...(reason ? { reason } : {}) } }
    return clone(state)
  }
  const remember = (sequence: number, fingerprint: string) => {
    fingerprints.delete(sequence)
    fingerprints.set(sequence, fingerprint)
    while (fingerprints.size > 64) fingerprints.delete(fingerprints.keys().next().value as number)
  }
  const validEnvelope = (event: AIStreamEventV2) => {
    if (!event || typeof event !== 'object' || event.version !== '2' || typeof event.requestId !== 'string' || !event.requestId || typeof event.messageId !== 'string' || !event.messageId || event.requestId !== options.requestId || event.messageId !== options.messageId) return false
    if (!safeInt(event.sequence) || event.sequence < 1 || !safeInt(event.revision) || event.revision < 0) return false
    if (!['text-delta', 'process-upsert', 'sources-replace', 'snapshot', 'final', 'cancelled', 'error'].includes(event.type)) return false
    if (event.type === 'text-delta' && typeof event.delta !== 'string') return false
    if (event.type === 'process-upsert' && (!event.item || typeof event.item.id !== 'string')) return false
    if (event.type === 'sources-replace' && !Array.isArray(event.sources)) return false
    if ((event.type === 'snapshot' || event.type === 'final') && !projectMessage(event.message, options.messageId)) return false
    if ((event.type === 'cancelled') && event.reason !== undefined && typeof event.reason !== 'string') return false
    if (event.type === 'error' && typeof event.error !== 'string') return false
    return true
  }
  const applyIncremental = (event: AIStreamEventV2) => {
    if (event.revision > state.cursor.revision) { state = { ...state, recoveryRequired: true }; return }
    state = { ...state, cursor: { afterSequence: event.sequence, revision: state.cursor.revision }, status: 'streaming', recoveryRequired: false }
    if (event.revision < state.cursor.revision) return
    if (event.type === 'text-delta') state.message = { ...state.message, content: state.message.content + event.delta, status: 'streaming' }
    else if (event.type === 'process-upsert') state.message = { ...state.message, process: [...(state.message.process ?? []).filter((item) => item.id !== event.item.id), clone(event.item)] }
    else if (event.type === 'sources-replace') state.message = { ...state.message, sources: clone(event.sources) }
    else if (event.type === 'cancelled') { state.status = 'cancelled'; terminalFingerprints.set(event.sequence, stable(event)); state.message = { ...state.message, status: 'stopped', error: event.reason } }
    else if (event.type === 'error') { state.status = 'error'; terminalFingerprints.set(event.sequence, stable(event)); state.message = { ...state.message, status: 'error', error: event.error, retryable: event.retryable } }
  }
  const applyCheckpoint = (event: Extract<AIStreamEventV2, { type: 'snapshot' | 'final' }>, fingerprint: string) => {
    const message = projectMessage(event.message, options.messageId)
    if (!message) return diagnostic('protocol-error', event.sequence, 'invalid checkpoint')
    if (event.revision < state.cursor.revision || event.sequence < state.cursor.afterSequence) return diagnostic('stale', event.sequence)
    const preserved = state.message.attachments ? { attachments: state.message.attachments } : {}
    const { id: _id, role: _role, content, ...owned } = message
    void _id; void _role
    state = { ...state, message: { id: state.message.id, role: 'assistant', content, ...preserved, ...owned, status: event.type === 'final' ? 'complete' : 'streaming' }, cursor: { afterSequence: event.sequence, revision: event.revision }, recoveryRequired: false, status: event.type === 'final' ? 'completed' : 'streaming' }
    buffer.forEach((_, sequence) => { if (sequence <= event.sequence) buffer.delete(sequence) })
    if (event.type === 'final') terminalFingerprints.set(event.sequence, fingerprint)
    while (buffer.has(state.cursor.afterSequence + 1)) {
      const next = buffer.get(state.cursor.afterSequence + 1)!
      if ((state as AIStreamReducerState).status === 'completed' || (state as AIStreamReducerState).status === 'cancelled' || (state as AIStreamReducerState).status === 'error' || next.revision > state.cursor.revision) break
      buffer.delete(next.sequence)
      remember(next.sequence, stable(next))
      applyIncremental(next)
    }
    return diagnostic('accepted', event.sequence)
  }
  const dispatch = (event: AIStreamEventV2): AIStreamReducerState => {
    const fingerprint = stable(event)
    if (!validEnvelope(event)) return diagnostic('protocol-error', (event as any)?.sequence, 'invalid envelope')
    const terminalFingerprint = terminalFingerprints.get(event.sequence)
    if (terminalFingerprint) return terminalFingerprint === fingerprint ? diagnostic('duplicate', event.sequence) : diagnostic('protocol-error', event.sequence, 'conflicting terminal')
    if (state.status === 'completed' || state.status === 'cancelled' || state.status === 'error') return diagnostic('terminal-no-op', event.sequence)
    const known = fingerprints.get(event.sequence)
    if (known) return known === fingerprint ? diagnostic('duplicate', event.sequence) : diagnostic('protocol-error', event.sequence, 'conflicting sequence')
    if (event.type === 'snapshot' || event.type === 'final') {
      if (event.revision < state.cursor.revision || event.sequence < state.cursor.afterSequence) { remember(event.sequence, fingerprint); return diagnostic('stale', event.sequence) }
      remember(event.sequence, fingerprint)
      return applyCheckpoint(event, fingerprint)
    }
    if (event.sequence <= state.cursor.afterSequence) {
      return fingerprints.has(event.sequence) ? diagnostic('stale', event.sequence) : diagnostic('stale', event.sequence)
    }
    if (event.sequence > state.cursor.afterSequence + 1) {
      const waiting = buffer.get(event.sequence)
      if (waiting) return stable(waiting) === fingerprint ? diagnostic('duplicate', event.sequence) : diagnostic('protocol-error', event.sequence, 'conflicting buffered sequence')
      if (event.sequence - state.cursor.afterSequence > 32 || buffer.size >= 32) { state = { ...state, recoveryRequired: true }; return diagnostic('gap', event.sequence) }
      buffer.set(event.sequence, event)
      return diagnostic('buffered', event.sequence)
    }
    if (event.revision > state.cursor.revision) { state = { ...state, recoveryRequired: true }; return diagnostic('protocol-error', event.sequence, 'revision checkpoint required') }
    remember(event.sequence, fingerprint)
    applyIncremental(event)
    while (buffer.has(state.cursor.afterSequence + 1)) {
      const next = buffer.get(state.cursor.afterSequence + 1)!
      if ((state as AIStreamReducerState).status === 'completed' || (state as AIStreamReducerState).status === 'cancelled' || (state as AIStreamReducerState).status === 'error' || next.revision > state.cursor.revision) break
      buffer.delete(next.sequence)
      const nextFp = stable(next)
      remember(next.sequence, nextFp)
      applyIncremental(next)
      if ((state as AIStreamReducerState).status === 'error' || (state as AIStreamReducerState).status === 'cancelled') break
    }
    return diagnostic('accepted', event.sequence)
  }
  const recover = ({ reason = 'transport' }: { reason?: string } = {}) => {
    if (state.status === 'completed' || state.status === 'cancelled' || state.status === 'error') return diagnostic('terminal-no-op', state.cursor.afterSequence)
    if (recoveryAttempts < maxReconnectAttempts) {
      recoveryAttempts += 1
      state = { ...state, status: 'reconnecting', recoveryRequired: true }
      return diagnostic('gap', state.cursor.afterSequence, reason)
    }
    state = { ...state, status: 'error', message: { ...state.message, status: 'error', error: '连接中断，请重试', retryable: true }, recoveryRequired: false }
    return diagnostic('gap', state.cursor.afterSequence, reason)
  }
  const failRecovery = (reason = 'transport', retryable = true) => {
    if (state.status === 'completed' || state.status === 'cancelled' || state.status === 'error') return diagnostic('terminal-no-op', state.cursor.afterSequence)
    state = { ...state, status: 'error', message: { ...state.message, status: 'error', error: reason, retryable }, recoveryRequired: false }
    return diagnostic('gap', state.cursor.afterSequence, reason)
  }
  return { dispatch, reduce: dispatch, recover, failRecovery, getState: () => state }
}

export const reduceAIStreamEvent = (state: AIStreamReducer, event: AIStreamEventV2) => state.dispatch(event)
