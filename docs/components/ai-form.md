<script setup lang="ts">
import { ref } from 'vue'
import type { AIFormSchemaV1 } from '@aheart-ui/ai'

const value = ref<Record<string, unknown>>({
  priority: 'normal',
  advanced: false,
  channel: 'report',
  deliveryWindow: ['2026-07-20', '2026-07-24']
})
const submitting = ref(false)
const submitError = ref('')
const successMessage = ref('')

const schema: AIFormSchemaV1 = {
  version: '1',
  title: '创建研究任务',
  description: '配置目标、执行范围和交付方式。',
  groups: [
    { key: 'basic', title: '任务目标', description: '定义 Agent 要解决的问题。' },
    { key: 'delivery', title: '交付设置', description: '选择优先级和最终产物。' }
  ],
  fields: [
    {
      key: 'title',
      label: '任务名称',
      type: 'input',
      group: 'basic',
      required: true,
      placeholder: '例如：Aheart UI 质量研究',
      description: '使用便于团队识别的名称。'
    },
    { key: 'advanced', label: '扩展分析', type: 'switch', group: 'basic' },
    {
      key: 'detail',
      label: '补充说明',
      type: 'textarea',
      group: 'basic',
      visibleWhen: { field: 'advanced', operator: 'equals', value: true },
      placeholder: '补充研究边界和约束'
    },
    {
      key: 'priority',
      label: '优先级',
      type: 'radio',
      group: 'delivery',
      options: [
        { label: '普通', value: 'normal' },
        { label: '紧急', value: 'urgent' }
      ]
    },
    {
      key: 'channel',
      label: '交付格式',
      type: 'select',
      group: 'delivery',
      options: [
        { label: '研究报告', value: 'report' },
        { label: '任务清单', value: 'checklist' }
      ]
    },
    { key: 'deliveryWindow', label: '交付窗口', type: 'date-range', group: 'delivery', required: true }
  ]
}

const submit = async (data: Record<string, unknown>) => {
  submitting.value = true
  submitError.value = ''
  successMessage.value = ''
  await new Promise((resolve) => setTimeout(resolve, 450))
  if (String(data.title).includes('失败')) {
    submitError.value = '任务创建失败，请修改名称后重试。'
  } else {
    successMessage.value = `任务已创建：${data.title}`
  }
  submitting.value = false
}
</script>

# AI 智能表单 <span class="aheart-status aheart-status--ready">已完成</span>

`AIForm` 以受控数据和版本化 schema 构建可交付的业务表单。它支持字段分组、条件联动、校验反馈和外部提交状态；不会执行 schema 中的函数、脚本、HTML 或样式。

日期时间默认值必须使用 `YYYY-MM-DD`、`HH:mm:ss` 或对应的完整双端范围。必填范围要求起止两端都有值；V1 暂不提供开放端范围。

## 任务表单

<AAIForm
  v-model="value"
  :schema="schema"
  :submitting="submitting"
  :submit-error="submitError"
  submit-text="创建研究任务"
  @submit="submit"
/>

<p v-if="successMessage" class="aheart-ai-demo-success" data-ai-form-success role="status">
  {{ successMessage }}
</p>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { AIFormSchemaV1 } from '@aheart-ui/ai'

const value = ref({})
const submitting = ref(false)
const schema: AIFormSchemaV1 = {
  version: '1',
  title: '创建研究任务',
  groups: [{ key: 'basic', title: '任务目标' }],
  fields: [
    { key: 'title', label: '任务名称', type: 'input', group: 'basic', required: true }
  ]
}
</script>

<template>
  <AAIForm v-model="value" :schema="schema" :submitting="submitting" @submit="createTask" />
</template>
```

提交前会在顶部汇总错误并聚焦第一个无效字段。`submitting` 为 `true` 时所有字段与提交按钮锁定，避免重复提交；业务错误通过 `submitError` 展示，不会被误认为 schema 或字段校验错误。

## Schema

`AIFormSchemaV1` 只支持 `input`、`textarea`、`number`、`select`、`checkbox`、`radio`、`switch`、`date`、`date-range`、`time`、`time-range`、`upload` 和 `tree-select` 字段。范围字段使用完整双端 `[string, string]` 默认值；运行时未选择时可以是 `undefined`，并始终保持完全受控。

条件字段 `visibleWhen` 与 `disabledWhen` 只允许 `equals`、`not-equals`、`includes`、`not-includes`、`is-empty`、`is-not-empty` 操作符。根对象、分组、字段、选项与条件均执行属性白名单校验，未声明的函数、事件或样式属性会使 schema 安全降级。

## 字段与分组

| 字段 | 说明 |
| --- | --- |
| `title` / `description` | 表单产品标题与说明。 |
| `groups` | 可选分组列表，包含 `key`、`title` 和 `description`。 |
| `fields[].group` | 引用已声明分组；悬空引用会被拒绝。 |
| `fields[].description` | 字段辅助说明，并参与可访问描述关系。 |
| `defaultValue` | 受控数据尚未包含字段时使用；显式 `undefined` 不回退。 |
| `options` | Select、Checkbox、Radio、TreeSelect 的安全选项。 |
| `required` | 提交时校验可见且未禁用字段。 |
| `visibleWhen` / `disabledWhen` | 白名单条件表达式。 |

## API

| 属性 | 说明 |
| --- | --- |
| `v-model` | 完全受控的字段值对象。组件只发出更新事件。 |
| `schema` | 必填，`AIFormSchemaV1` 或待校验的 JSON 数据。 |
| `disabled` | 禁用全部字段和提交。 |
| `submitting` | 标记业务提交中，锁定字段并显示按钮 loading。 |
| `submitText` | 提交命令文案。 |
| `submitError` | 业务提交失败信息。 |

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | 单个字段更新后的完整数据对象。 |
| `submit` | 校验通过后提交包含默认值的完整数据对象。 |
| `validation-error` | 必填校验失败，返回 `{ key, message }[]`。 |
| `schema-error` | schema 不合法，返回安全错误信息数组。 |
