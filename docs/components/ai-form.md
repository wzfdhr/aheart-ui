<script setup lang="ts">
import { ref } from 'vue'

const value = ref({ advanced: false, title: '' })
const schema = {
  version: '1' as const,
  fields: [
    { key: 'title', label: '任务名称', type: 'input' as const, required: true, placeholder: '输入名称' },
    { key: 'advanced', label: '高级模式', type: 'switch' as const },
    { key: 'detail', label: '补充说明', type: 'textarea' as const, visibleWhen: { field: 'advanced', operator: 'equals' as const, value: true } }
  ]
}
</script>

# AI 智能表单 <span class="aheart-status aheart-status--ready">Ready</span>

`AIForm` 以受控数据和版本化 schema 渲染表单。它不会执行 schema 中的函数、脚本、HTML 或样式；结构不合法时仅显示安全错误并触发 `schema-error`。

## 基础使用

<AAIForm v-model="value" :schema="schema" />

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref({ advanced: false, title: '' })
const schema = {
  version: '1',
  fields: [
    { key: 'title', label: '任务名称', type: 'input', required: true },
    { key: 'advanced', label: '高级模式', type: 'switch' },
    {
      key: 'detail',
      label: '补充说明',
      type: 'textarea',
      visibleWhen: { field: 'advanced', operator: 'equals', value: true }
    }
  ]
}
</script>

<template>
  <AAIForm v-model="value" :schema="schema" @schema-error="reportSchemaError" />
</template>
```

## Schema

`AIFormSchemaV1` 只支持 `input`、`textarea`、`number`、`select`、`checkbox`、`radio`、`switch`、`date`、`time`、`upload` 和 `tree-select` 字段。

条件字段 `visibleWhen` 与 `disabledWhen` 只允许 `equals`、`not-equals`、`includes`、`not-includes`、`is-empty`、`is-not-empty` 操作符。所有字段更新均通过 `update:modelValue` 回传，提交时触发 `submit`。

## 字段配置

```ts
import type { AIFormSchemaV1 } from '@aheart-ui/ai'

const schema: AIFormSchemaV1 = {
  version: '1',
  fields: [
    {
      key: 'priority',
      label: '优先级',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: '普通', value: 'normal' },
        { label: '紧急', value: 'urgent' }
      ]
    }
  ]
}
```

| 字段 | 说明 |
| --- | --- |
| `key` | 唯一字段标识。 |
| `label` | 显示给用户的字段名称。 |
| `type` | `input`、`textarea`、`number`、`select`、`checkbox`、`radio`、`switch`、`date`、`time`、`upload` 或 `tree-select`。 |
| `defaultValue` | 受控数据中尚未包含该字段时使用的初始值；外部显式传入 `undefined` 不会回退为默认值。 |
| `options` | Select、Checkbox、Radio、TreeSelect 的选项，包含 `label`、`value` 和可选 `disabled`。 |
| `required` | 提交时校验可见且未禁用字段。 |
| `visibleWhen` | 条件命中时显示字段。 |
| `disabledWhen` | 条件命中时禁用字段并跳过必填校验。 |

## API

| 属性 | 说明 |
| --- | --- |
| `v-model` | 完全受控的字段值对象。组件只发出更新事件，不保留本地草稿。 |
| `schema` | 必填，`AIFormSchemaV1` 或待校验的 JSON 数据。 |

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | 单个字段更新后的完整数据对象。 |
| `submit` | 校验通过后提交包含默认值的完整数据对象。 |
| `validation-error` | 必填校验失败，返回 `{ key, message }[]`。 |
| `schema-error` | schema 不合法，返回安全的错误信息数组。 |

`schema` 只能描述数据，不接受函数、脚本、HTML 或任意样式。条件表达式仅使用白名单操作符，非法配置会渲染为安全错误状态，不会中断页面其他内容。
