export type AIMessageRole = 'user' | 'assistant' | 'system' | 'tool'
export type AIMessageStatus = 'complete' | 'streaming' | 'stopped' | 'error'
export type AIProcessStatus = 'pending' | 'running' | 'complete' | 'stopped' | 'error'

export interface AIAttachment {
  id: string
  name: string
  url?: string
  type?: string
  size?: number
}

export interface AISource {
  id: string
  title: string
  url?: string
  description?: string
}

export interface AIProcessItem {
  id: string
  label: string
  status: AIProcessStatus
  detail?: string
}

export interface AIMessage {
  id: string
  role: AIMessageRole
  content: string
  status?: AIMessageStatus
  attachments?: AIAttachment[]
  sources?: AISource[]
  process?: AIProcessItem[]
  error?: string
}

export type AIContentRenderer = (message: AIMessage) => VNodeChild

export type AIChatAction = 'send' | 'retry' | 'regenerate' | 'edit'

export interface AIChatRequest {
  conversationId?: string
  messages: AIMessage[]
  action?: AIChatAction
  messageId?: string
}

export type AIStreamEvent =
  | { type: 'text-delta'; delta: string }
  | { type: 'process'; item: AIProcessItem }
  | { type: 'sources'; sources: AISource[] }
  | { type: 'done' }
  | { type: 'cancelled' }
  | { type: 'error'; error: string }

export interface AITransport {
  send(request: AIChatRequest, signal: AbortSignal): AsyncIterable<AIStreamEvent>
}

export interface AIPrompt {
  key: string
  label: string
  description?: string
}

export interface AIConversation {
  key: string
  label: string
  disabled?: boolean
}

export interface AIAction {
  key: string
  label: string
  disabled?: boolean
}

export type AIAgentTaskStatus = 'pending' | 'running' | 'waiting-approval' | 'complete' | 'error' | 'cancelled'
export type AIAgentApprovalStatus = 'pending' | 'approved' | 'rejected'
export type AIAgentTaskKind = 'task' | 'tool' | 'approval'

export interface AIAgentApproval {
  id: string
  title: string
  description?: string
  status?: AIAgentApprovalStatus
}

export interface AIAgentTask {
  id: string
  label: string
  status: AIAgentTaskStatus
  kind?: AIAgentTaskKind
  detail?: string
  error?: string
  toolName?: string
  progress?: number
  startedAt?: string
  completedAt?: string
  approval?: AIAgentApproval
}

export interface AIAgentContextItem {
  id: string
  label: string
  description?: string
  disabled?: boolean
}

export interface AIAgentArtifact {
  id: string
  title: string
  description?: string
  type?: string
  url?: string
  status?: 'draft' | 'ready' | 'error'
  updatedAt?: string
}
import type { VNodeChild } from 'vue'
