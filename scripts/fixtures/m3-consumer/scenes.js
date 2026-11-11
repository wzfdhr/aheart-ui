import { createApp, h, ref } from 'vue'
import { AIChatPanel } from '@aheart-ui/ai/chat'
import { AIForm } from '@aheart-ui/ai/agent'
import 'aheart-ui/full.css'
import '@aheart-ui/ai/chat/style.css'
import '@aheart-ui/ai/agent/style.css'

const transport = {
  async *send() {
    yield { type: 'text-delta', delta: '收到消费端消息' }
    yield { type: 'done' }
  }
}
const schema = {
  version: '1',
  fields: [{ key: 'name', label: '任务名称', type: 'input', required: true }]
}

createApp({
  setup() {
    const model = ref({ name: '' })
    const submitted = ref('')
    return () => h('main', [
      h(AIChatPanel, { transport }),
      h(AIForm, {
        schema,
        modelValue: model.value,
        'onUpdate:modelValue': value => { model.value = value },
        submitText: '创建任务',
        onSubmit: value => { submitted.value = value.name }
      }),
      submitted.value ? h('p', { role: 'status' }, `已创建：${submitted.value}`) : null
    ])
  }
}).mount('#app')
