import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { Button, Input, Checkbox, Select, Modal } from 'aheart-ui'
const storageKey = 'aheart-m0-muxu-todo-v1'
export const createPilotApp = () => defineComponent({
  setup() {
    const tasks = ref([{ id: 1, title: '核对组件样式', done: false }]), title = ref(''), filter = ref('all'), removing = ref(null), status = ref('本地任务清单')
    let nextId = 2
    onMounted(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || 'null')
        if (Array.isArray(saved) && saved.every(x => Number.isInteger(x.id) && typeof x.title === 'string' && typeof x.done === 'boolean')) { tasks.value = saved; nextId = Math.max(0, ...saved.map(x => x.id)) + 1 }
      } catch { status.value = '存储不可用，当前会话仍可使用' }
    })
    watch(tasks, value => { try { localStorage.setItem(storageKey, JSON.stringify(value)) } catch { status.value = '存储失败，刷新前请保留任务' } }, { deep: true })
    const add = () => { if (!title.value.trim()) return; tasks.value.push({ id: nextId++, title: title.value.trim(), done: false }); title.value = ''; status.value = '任务已添加' }
    return () => h('main', { 'data-pilot': 'muxu-todo' }, [
      h('header', [h('p', { class: 'eyebrow' }, 'AHEART UI / MUXU TODO'), h('h1', '把下一件事做好'), h('p', { class: 'muted' }, '一个可以添加、完成、筛选和删除任务的本地业务应用。')]),
      h('section', { class: 'panel', 'aria-labelledby': 'new-task-title' }, [h('h2', { id: 'new-task-title' }, '新建任务'), h('form', { class: 'row', onSubmit: event => { event.preventDefault(); add() } }, [h('div', { class: 'field' }, [h('label', { for: 'todo-title' }, '任务名称'), h(Input, { id: 'todo-title', modelValue: title.value, 'onUpdate:modelValue': value => { title.value = value }, placeholder: '例如：验证弹窗键盘交互' })]), h(Button, { type: 'primary', htmlType: 'submit', disabled: !title.value.trim() }, () => '添加任务')])]),
      h('section', { class: 'panel', 'aria-labelledby': 'tasks-title' }, [h('div', { class: 'row' }, [h('h2', { id: 'tasks-title' }, '任务清单'), h('div', { class: 'field' }, [h('label', { id: 'filter-label' }, '任务筛选'), h(Select, { modelValue: filter.value, 'aria-labelledby': 'filter-label', options: [{ label: '全部任务', value: 'all' }, { label: '待完成', value: 'active' }, { label: '已完成', value: 'done' }], 'onUpdate:modelValue': value => { filter.value = value } })])]), h('ul', { class: 'task-list' }, tasks.value.filter(x => filter.value === 'all' || (filter.value === 'done' ? x.done : !x.done)).map(task => h('li', { class: 'task', key: task.id }, [h(Checkbox, { modelValue: task.done, 'onUpdate:modelValue': value => { task.done = value } }, () => h('span', { class: task.done ? 'done' : '' }, task.title)), h(Button, { 'aria-label': `删除 ${task.title}`, onClick: () => { removing.value = task } }, () => '删除')]))), h('p', { role: 'status' }, status.value)]),
      h(Modal, { open: Boolean(removing.value), title: '删除任务', okText: '确认删除', cancelText: '保留任务', 'onUpdate:open': value => { if (!value) removing.value = null }, onOk: () => { tasks.value = tasks.value.filter(x => x.id !== removing.value?.id); removing.value = null; status.value = '任务已删除' } }, () => h('p', `确认删除“${removing.value?.title || ''}”？`)),
    ])
  },
})
