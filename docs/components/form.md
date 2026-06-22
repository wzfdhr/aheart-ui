# Form 表单 <span class="aheart-status aheart-status--ready">Ready</span>

Form manages field layout and visual validation state. This first slice focuses on structure and configuration inheritance.

## 基础用法

<div class="aheart-demo-panel">
  <AForm layout="vertical">
    <AFormItem label="Name" required>
      <AInput model-value="Ada" />
    </AFormItem>
    <AFormItem label="Email" validate-status="error" help="Email is required">
      <AInput status="error" />
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm layout="vertical" @submit="handleSubmit">
    <AFormItem label="Name" required>
      <AInput v-model="name" />
    </AFormItem>
    <AFormItem label="Email" validate-status="error" help="Email is required">
      <AInput v-model="email" status="error" />
    </AFormItem>
  </AForm>
</template>
```

## 行内布局

<div class="aheart-demo-panel">
  <AForm layout="inline">
    <AFormItem label="Status">
      <ASelect
        model-value="ready"
        :options="[
          { label: 'Ready', value: 'ready' },
          { label: 'Paused', value: 'paused' }
        ]"
      />
    </AFormItem>
    <AFormItem>
      <AButton type="primary">Search</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm layout="inline">
    <AFormItem label="Status">
      <ASelect v-model="status" :options="options" />
    </AFormItem>
    <AFormItem>
      <AButton type="primary">Search</AButton>
    </AFormItem>
  </AForm>
</template>
```

## 表单级配置

<div class="aheart-demo-panel">
  <AForm size="large" disabled>
    <AFormItem label="Disabled">
      <AInput model-value="Inherited disabled" />
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm size="large" disabled>
    <AFormItem label="Disabled">
      <AInput model-value="Inherited disabled" />
    </AFormItem>
  </AForm>
</template>
```

## Form API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 表单布局 | `horizontal` \| `vertical` \| `inline` | `horizontal` |
| labelAlign | 标签对齐方式 | `left` \| `right` | `right` |
| size | 表单控件尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用内部控件 | `boolean` | ConfigProvider disabled |

## Form Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 提交表单时触发 | `(event: Event) => void` |

## FormItem API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | `string` | - |
| name | 字段名 | `string` | - |
| required | 是否显示必填标记 | `boolean` | `false` |
| validateStatus | 校验状态 | `success` \| `warning` \| `error` \| `validating` | - |
| help | 帮助或错误文案 | `string` | - |
| extra | 额外提示 | `string` | - |
| hasFeedback | 是否显示反馈图标 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 表单或表单项内容 |
| label | 自定义 FormItem 标签 |
| help | 自定义帮助文案 |
| extra | 自定义额外提示 |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-success`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
