import { defineComponent, h, nextTick, ref } from 'vue'
import { AIAgentWorkbench, AIForm } from '@aheart-ui/ai'
import { createAIStreamReducer } from '@aheart-ui/ai'

const wait = () => new Promise(resolve => setTimeout(resolve, 0))

export const makeConsumerApp = () => defineComponent({
  name: 'D8ConsumerApp',
  setup() {
    const messages = ref([])
    const tasks = ref([
      { id: 'approval-task', label: 'Approve deployment', status: 'waiting-approval', kind: 'approval', revision: 1, approval: { id: 'approval-1', title: 'Deploy' }, toolCall: { id: 'tool-1', name: 'deploy', summary: 'Deploy artifact', inputStatus: 'ready', resultStatus: 'pending' } },
      { id: 'ready-task', label: 'Prepare report', status: 'pending', reorderable: true, revision: 1 },
      { id: 'free-task', label: 'Review report', status: 'pending', reorderable: true, revision: 1 },
    ])
    const operations = ref([])
    const reorderEvents = ref([])
    const moveEvents = ref([])
    const model = ref({ name: '', count: 0 })
    const schema = {
      version: '1',
      fields: [
        { key: 'name', label: 'Name', type: 'input', required: true },
        { key: 'count', label: 'Count', type: 'number', rules: [{ kind: 'range', valueType: 'number', min: 1, max: 10, message: 'Count must be 1-10' }] },
      ],
    }
    const state = {
      get messages() { return messages.value },
      get tasks() { return tasks.value },
      get operations() { return operations.value },
      get reorderEvents() { return reorderEvents.value },
      get moveEvents() { return moveEvents.value },
      get model() { return model.value },
      async settle() { await nextTick(); await wait(); await nextTick() },
      reducer: createAIStreamReducer({ requestId: 'consumer-request', messageId: 'consumer-message' }),
    }
    const transport = {
      send: async function* (request) {
        yield { version: '2', requestId: request.requestId, messageId: request.messageId, sequence: 1, revision: 0, type: 'text-delta', delta: 'Hello from D8' }
        yield { version: '2', requestId: request.requestId, messageId: request.messageId, sequence: 2, revision: 0, type: 'final', message: { id: request.messageId, role: 'assistant', content: 'Hello from D8', status: 'complete' } }
      },
    }
    const actionHandler = async request => {
      operations.value.push(request)
      return { status: 'success', operationId: request.operationId }
    }
    const updateTasks = next => { tasks.value = next; reorderEvents.value.push(next.map(item => item.id)) }
    globalThis.__d8ConsumerState = state
    return () => h('main', { 'data-d8-consumer': '' }, [
      h('section', { 'data-d8-chat': '' }, [
        h(AIAgentWorkbench, {
          title: 'D8 consumer workbench', messages: messages.value, transport,
          tasks: tasks.value, reorderable: true, actionHandler,
          'onUpdate:messages': value => { messages.value = value },
          'onUpdate:tasks': updateTasks,
          onMoveTask: (id, direction) => moveEvents.value.push({ id, direction }),
        }),
      ]),
      h('section', { 'data-d8-form': '' }, [
        h(AIForm, { schema, modelValue: model.value, 'onUpdate:modelValue': value => { model.value = value } }),
      ]),
    ])
  },
})
