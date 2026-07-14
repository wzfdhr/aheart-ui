<template>
  <form class="aheart-ai-sender" @submit.prevent="submit">
    <textarea
      :value="modelValue"
      aria-label="消息内容"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown.enter.exact.prevent="submit"
    />
    <button v-if="loading" type="button" aria-label="停止生成" @click="emit('stop')">停止</button>
    <button v-else type="submit" aria-label="发送消息" :disabled="disabled || !modelValue.trim()" @click.prevent="submit">发送</button>
  </form>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string; placeholder?: string; disabled?: boolean; loading?: boolean }>(), {
  modelValue: '',
  placeholder: '输入消息',
  disabled: false,
  loading: false
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; submit: [content: string]; stop: [] }>()
defineOptions({ name: 'AAISender' })

const submit = () => {
  const content = props.modelValue.trim()
  if (content && !props.disabled && !props.loading) emit('submit', content)
}
</script>
