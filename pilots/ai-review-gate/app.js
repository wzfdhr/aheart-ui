import { defineComponent, h, ref } from 'vue'
import { Button, Checkbox, Modal } from 'aheart-ui'
import { AIAgentWorkbench } from '@aheart-ui/ai'
export const createPilotApp = () => defineComponent({
  setup() {
    const checks = ref([false, false]), preview = ref(false), approved = ref(false), messages = ref([]), audit = ref([])
    const tasks = ref([{ id: 'inspect', label: '检查修订内容', status: 'pending', revision: 1, reorderable: true }, { id: 'verify', label: '验证本地结果', status: 'pending', revision: 1, reorderable: true }])
    const transport = { send: async function* (request) {
      yield { version: '2', requestId: request.requestId, messageId: request.messageId, sequence: 1, revision: 0, type: 'text-delta', delta: '本地复核建议：检查输入、样式和焦点，再批准修订。' }
      yield { version: '2', requestId: request.requestId, messageId: request.messageId, sequence: 2, revision: 0, type: 'final', message: { id: request.messageId, role: 'assistant', content: '本地复核建议：检查输入、样式和焦点，再批准修订。', status: 'complete' } }
    } }
    const canApprove = () => checks.value.every(Boolean) && !approved.value
    return () => h('main', { 'data-pilot': 'ai-review-gate' }, [
      h('header', [h('p', { class: 'eyebrow' }, 'AHEART UI / AI REVIEW GATE'), h('h1', '每次批准都有依据'), h('p', { class: 'notice' }, '新建的本地验证应用：消息由确定性本地适配器生成，批准仅更新本页状态，不调用模型、Git 或发布服务。')]),
      h('section', { class: 'panel', 'aria-labelledby': 'review-title' }, [h('h2', { id: 'review-title' }, '修订 R1 · 待人工检查'), h('div', { class: 'checklist' }, ['已检查变更内容', '已完成本地验证'].map((label, i) => h(Checkbox, { modelValue: checks.value[i], 'onUpdate:modelValue': value => { checks.value[i] = value } }, () => label))), h('div', { class: 'row' }, [h(Button, { onClick: () => { preview.value = true } }, () => '查看本地变更'), h(Button, { type: 'primary', disabled: !canApprove(), onClick: () => { approved.value = true; tasks.value = tasks.value.map(task => ({ ...task, status: 'completed' })); audit.value.push('R1：人工批准已记录') } }, () => '批准本地修订'), h('output', { 'aria-label': '修订状态', role: 'status' }, approved.value ? '已批准' : '等待检查')]), h('ul', { 'aria-label': '批准记录' }, audit.value.map(x => h('li', x)))]),
      h('section', { class: 'panel', 'aria-label': 'AI 工作台' }, [h(AIAgentWorkbench, { title: '本地复核工作台', messages: messages.value, tasks: tasks.value, reorderable: true, transport, 'onUpdate:messages': value => { messages.value = value }, 'onUpdate:tasks': value => { tasks.value = value } })]),
      h(Modal, { open: preview.value, title: '本地变更 R1', okText: '返回检查', cancelText: '关闭', 'onUpdate:open': value => { preview.value = value }, onOk: () => { preview.value = false } }, () => h('pre', '- 保存按钮没有提示\n+ 保存后显示确认状态\n\n此内容是验证用固定样例，不代表真实 Git diff。')),
    ])
  },
})
