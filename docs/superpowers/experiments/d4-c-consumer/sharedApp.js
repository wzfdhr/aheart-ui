import { h, ref } from 'vue'
import Select from 'aheart-ui/es/select/select.vue.js'

export function makeConsumerApp({ count = 1000, virtual = false, dynamic = false, defaultOpen = false } = {}) {
  const options = Array.from({ length: count }, (_, index) => ({ label: `Row ${index}`, value: index, disabled: index === 17 }))
  return { setup() {
    const value = ref(count - 1)
    const search = ref('')
    return () => h('main', [h('h1', 'Packaged Select consumer'), h(Select, {
      id: 'consumer-select', 'aria-label': 'Consumer Select', defaultOpen, options,
      modelValue: value.value, 'onUpdate:modelValue': next => { value.value = next },
      showSearch: true, searchValue: search.value, onSearch: next => { search.value = next },
      virtual, style: 'width:400px;max-width:100%',
      optionRender: option => h('span', { style: 'display:block;white-space:normal' }, [
        option.label, dynamic && option.value % 2 ? h('br') : null,
        dynamic && option.value % 2 ? 'detail line' : null
      ])
    })])
  }}
}
