<template>
  <div
    ref="fieldElement"
    class="aheart-ai-form__field"
    :class="{ 'is-error': Boolean(error), 'is-disabled': disabled }"
    :data-field-key="field.key"
    :aria-invalid="error ? 'true' : undefined"
    :aria-describedby="describedBy"
    tabindex="-1"
  >
    <label :id="`${field.key}-label`" :for="field.key">
      {{ field.label }}
      <span v-if="field.required" class="aheart-ai-form__required" aria-hidden="true">*</span>
    </label>
    <p v-if="field.description" :id="`${field.key}-description`" class="aheart-ai-form__field-description">
      {{ field.description }}
    </p>
    <ATextarea
      v-if="field.type === 'textarea'"
      :id="field.key"
      :aria-labelledby="`${field.key}-label`"
      :aria-describedby="describedBy"
      :model-value="value as string"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <ATreeSelect
      v-else-if="field.type === 'tree-select'"
      :id="field.key"
      :labelled-by="`${field.key}-label`"
      :model-value="value as string | number | Array<string | number>"
      :tree-data="treeData"
      :multiple="Array.isArray(value)"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <AUpload
      v-else-if="field.type === 'upload'"
      :file-list="value as UploadFile[]"
      :disabled="disabled"
      @update:file-list="emit('update', $event)"
    />
    <ARadioGroup
      v-else-if="field.type === 'radio'"
      :model-value="value as string | number"
      :options="field.options"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <ACheckboxGroup
      v-else-if="field.type === 'checkbox'"
      :model-value="value as Array<string | number>"
      :options="field.options"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <ASelect
      v-else-if="field.type === 'select'"
      :id="field.key"
      :labelled-by="`${field.key}-label`"
      :model-value="value as string | number"
      :disabled="disabled"
      :options="field.options"
      @update:model-value="emit('update', $event)"
    />
    <ASwitch
      v-else-if="field.type === 'switch'"
      :id="field.key"
      :model-value="Boolean(value)"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <AInputNumber
      v-else-if="field.type === 'number'"
      :id="field.key"
      :model-value="value as number | string"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <ADatePicker
      v-else-if="field.type === 'date'"
      :model-value="value as string"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <ATimePicker
      v-else-if="field.type === 'time'"
      :id="field.key"
      :labelled-by="`${field.key}-label`"
      :model-value="value as string"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @update:model-value="emit('update', $event)"
    />
    <AInput
      v-else
      :id="field.key"
      :model-value="value as string"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :aria-describedby="describedBy"
      @update:model-value="emit('update', $event)"
    />
    <p v-if="error" :id="`${field.key}-error`" class="aheart-ai-form__field-error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  CheckboxGroup as ACheckboxGroup,
  DatePicker as ADatePicker,
  Input as AInput,
  InputNumber as AInputNumber,
  RadioGroup as ARadioGroup,
  Select as ASelect,
  Switch as ASwitch,
  Textarea as ATextarea,
  TimePicker as ATimePicker,
  TreeSelect as ATreeSelect,
  Upload as AUpload,
  type TreeNodeData,
  type UploadFile
} from 'aheart-ui'
import type { AIFormFieldV1 } from './form-schema'

const props = defineProps<{
  field: AIFormFieldV1
  value: unknown
  disabled?: boolean
  error?: string
}>()
const emit = defineEmits<{ update: [value: unknown] }>()
const fieldElement = ref<HTMLElement>()
const treeData = computed<TreeNodeData[]>(() =>
  (props.field.options ?? []).map((option) => ({
    key: option.value,
    title: option.label,
    disabled: option.disabled
  }))
)
const describedBy = computed(() =>
  [props.field.description && `${props.field.key}-description`, props.error && `${props.field.key}-error`]
    .filter(Boolean)
    .join(' ') || undefined
)

defineExpose({
  focus: () => fieldElement.value?.focus({ preventScroll: true })
})
</script>
