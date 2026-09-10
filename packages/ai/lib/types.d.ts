export type AIMessageRole = 'user' | 'assistant' | 'system' | 'tool';
export type AIMessageStatus = 'complete' | 'streaming' | 'stopped' | 'error';
export type AIProcessStatus = 'pending' | 'running' | 'complete' | 'stopped' | 'error';
export interface AIAttachment {
    id: string;
    name: string;
    url?: string;
    type?: string;
    size?: number;
}
export interface AISource {
    id: string;
    title: string;
    url?: string;
    description?: string;
}
export interface AIProcessItem {
    id: string;
    label: string;
    status: AIProcessStatus;
    detail?: string;
}
export interface AIMessage {
    id: string;
    role: AIMessageRole;
    content: string;
    status?: AIMessageStatus;
    attachments?: AIAttachment[];
    sources?: AISource[];
    process?: AIProcessItem[];
    error?: string;
    retryable?: boolean;
    toolCall?: AIToolCallDisplay;
}
export interface AIToolCallDisplay {
    id: string;
    name: string;
    summary: string;
    inputStatus?: 'pending' | 'ready' | 'redacted';
    inputSummary?: string;
    resultStatus?: 'pending' | 'success' | 'error';
    resultSummary?: string;
    error?: string;
}
export type AIContentRenderer = (message: AIMessage) => VNodeChild;
export type AIChatAction = 'send' | 'retry' | 'regenerate' | 'edit';
export interface AIChatRequest {
    conversationId?: string;
    messages: AIMessage[];
    action?: AIChatAction;
    messageId?: string;
}
export type AIStreamEvent = {
    type: 'text-delta';
    delta: string;
} | {
    type: 'process';
    item: AIProcessItem;
} | {
    type: 'sources';
    sources: AISource[];
} | {
    type: 'done';
} | {
    type: 'cancelled';
} | {
    type: 'error';
    error: string;
};
export interface AITransport {
    send(request: AIChatRequest, signal: AbortSignal): AsyncIterable<AIStreamEvent>;
}
export interface AIStreamEventBaseV2 {
    version: '2';
    requestId: string;
    messageId: string;
    sequence: number;
    revision: number;
}
export type AIStreamEventV2 = (AIStreamEventBaseV2 & {
    type: 'text-delta';
    delta: string;
}) | (AIStreamEventBaseV2 & {
    type: 'process-upsert';
    item: AIProcessItem;
}) | (AIStreamEventBaseV2 & {
    type: 'sources-replace';
    sources: AISource[];
}) | (AIStreamEventBaseV2 & {
    type: 'snapshot';
    message: AIMessage;
}) | (AIStreamEventBaseV2 & {
    type: 'final';
    message: AIMessage;
}) | (AIStreamEventBaseV2 & {
    type: 'cancelled';
    reason?: string;
}) | (AIStreamEventBaseV2 & {
    type: 'error';
    error: string;
    retryable?: boolean;
});
export interface AIChatResumeCursorV2 {
    afterSequence: number;
    revision: number;
}
export interface AIChatRequestV2 extends Omit<AIChatRequest, 'messageId'> {
    version: '2';
    requestId: string;
    messageId: string;
    targetMessageId?: string;
    idempotencyKey: string;
    resume?: AIChatResumeCursorV2;
}
export interface AITransportV2 {
    version: '2';
    send(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>;
    resume?(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>;
}
export interface AIPrompt {
    key: string;
    label: string;
    description?: string;
}
export interface AIConversation {
    key: string;
    label: string;
    disabled?: boolean;
}
export interface AIAction {
    key: string;
    label: string;
    disabled?: boolean;
}
export type AIAgentTaskStatus = 'pending' | 'running' | 'waiting-approval' | 'complete' | 'error' | 'cancelled';
export type AIAgentApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AIAgentTaskKind = 'task' | 'tool' | 'approval';
export interface AIAgentApproval {
    id: string;
    title: string;
    description?: string;
    artifactId?: string;
    status?: AIAgentApprovalStatus;
}
export interface AIAgentTask {
    id: string;
    label: string;
    status: AIAgentTaskStatus;
    kind?: AIAgentTaskKind;
    detail?: string;
    error?: string;
    toolName?: string;
    progress?: number;
    startedAt?: string;
    completedAt?: string;
    approval?: AIAgentApproval;
    revision?: string | number;
    dependsOn?: string[];
    reorderable?: boolean;
    lockedReason?: string;
    toolCall?: AIToolCallDisplay;
}
export interface AIAgentContextItem {
    id: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
export interface AIAgentArtifact {
    id: string;
    title: string;
    description?: string;
    type?: string;
    url?: string;
    status?: 'draft' | 'ready' | 'error';
    updatedAt?: string;
    revision?: string | number;
}
export type AIAgentOperationAction = 'approve' | 'reject' | 'cancel' | 'retry';
export type AIAgentOperationStatus = 'idle' | 'pending' | 'success' | 'error';
export interface AIAgentOperationRequest {
    operationId: string;
    idempotencyKey: string;
    conversationId?: string;
    taskId: string;
    taskRevision: string | number;
    action: AIAgentOperationAction;
    approvalId?: string;
    artifactId?: string;
    artifactRevision?: string | number;
}
export type AIAgentOperationResult = {
    status: 'success';
    operationId: string;
} | {
    status: 'error';
    operationId: string;
    error: string;
    retryable?: boolean;
    outcome?: 'not-applied' | 'unknown';
};
export type AIAgentActionHandler = (request: AIAgentOperationRequest, signal: AbortSignal) => Promise<AIAgentOperationResult>;
import type { VNodeChild } from 'vue';
