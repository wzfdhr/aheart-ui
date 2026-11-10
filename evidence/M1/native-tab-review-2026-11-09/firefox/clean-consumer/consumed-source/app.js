import { defineComponent, h, ref } from 'vue'
import Button from 'aheart-ui/button'
import Modal from 'aheart-ui/modal'
import Select from 'aheart-ui/select'
export const createPilotApp = () => defineComponent({
  setup() {
    const count = ref(0), open = ref(false), size = ref('standard'), result = ref('等待检查')
    return () => h('main', { 'data-pilot': 'clean-consumer' }, [
      h('header', [h('p', { class: 'eyebrow' }, 'AHEART UI / CLEAN CONSUMER'), h('h1', '从干净安装开始'), h('p', { class: 'muted' }, '直接消费公开包，验证 Button、Modal、Select 的样式与交互。')]),
      h('section', { class: 'panel', 'aria-labelledby': 'controls-title' }, [h('h2', { id: 'controls-title' }, '核心组件'), h('div', { class: 'row' }, [h(Button, { type: 'primary', onClick: () => count.value++ }, () => '点击计数'), h('output', { 'aria-label': '计数结果' }, String(count.value)), h('div', { class: 'field' }, [h('label', { id: 'size-label' }, '展示方式'), h(Select, { 'aria-labelledby': 'size-label', modelValue: size.value, options: [{ label: '标准', value: 'standard' }, { label: '紧凑', value: 'compact' }], 'onUpdate:modelValue': value => { size.value = value } })]), h('output', { 'aria-label': '选中方式' }, size.value), h(Button, { onClick: () => { open.value = true } }, () => '打开检查弹窗')])]),
      h('p', { role: 'status' }, result.value),
      h('section', { class: 'notice' }, '本页是消费验证工程；使用公开组件子入口与显式 theme/组件 CSS。'),
      h(Modal, { open: open.value, title: '组件检查', okText: '完成检查', cancelText: '取消', 'onUpdate:open': value => { open.value = value }, onOk: () => { result.value = '检查完成'; open.value = false } }, () => h('p', '检查按钮、键盘焦点与关闭后的焦点恢复。')),
    ])
  },
})
