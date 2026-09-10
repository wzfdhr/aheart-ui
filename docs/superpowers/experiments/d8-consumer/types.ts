import { h } from 'vue'
import { AIAgentWorkbench, AIChatPanel, AIForm, createAIStreamReducer, reduceAIStreamEvent } from '@aheart-ui/ai'
import type {
  AIAgentActionHandler, AIAgentOperationRequest, AIAgentTask, AIChatRequestV2, AIStreamEventV2,
  AIStreamReducer, AIToolCallDisplay, AITransportV2
} from '@aheart-ui/ai'

const task: AIAgentTask = { id: 'task', label: 'Task', status: 'waiting-approval', approval: { id: 'approval', title: 'Approve' } }
const request: AIChatRequestV2 = {
  version: '2', requestId: 'request', messageId: 'message', idempotencyKey: 'once', messages: [],
}
const event: AIStreamEventV2 = { version: '2', requestId: 'request', messageId: 'message', sequence: 1, revision: 0, type: 'text-delta', delta: 'ok' }
const tool: AIToolCallDisplay = { id: 'tool', name: 'lookup', summary: 'business summary', inputStatus: 'ready' }
const reducer: AIStreamReducer = createAIStreamReducer({ requestId: 'request', messageId: 'message' })
const transport: AITransportV2 = { version: '2', send: async function* () { yield event } }
const operation: AIAgentOperationRequest = { operationId: 'operation', idempotencyKey: 'once', taskId: 'task', taskRevision: 1, action: 'approve' }
const handler: AIAgentActionHandler = async () => ({ status: 'success', operationId: operation.operationId })
void [task, request, event, tool, reducer, transport, operation, handler, reduceAIStreamEvent(reducer, event)]
void h(AIChatPanel, { transport })
void h(AIAgentWorkbench, { tasks: [task], actionHandler: handler })
void h(AIForm, { schema: { version: '1', fields: [] } })
