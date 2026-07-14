<script setup lang="ts">
import { h, reactive, ref } from 'vue'

const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
const formDemo = reactive({ email: '' })
const formDemoResult = ref('等待提交')
const asyncForm = reactive({ email: 'taken@example.com' })
const asyncFormRef = ref<{ resetFields: () => void }>()
const asyncFormResult = ref('输入 free@example.com 可通过校验')
const asyncEmailValidator = async (_rule: unknown, value: unknown) => {
  await new Promise((resolve) => window.setTimeout(resolve, 240))
  if (value === 'taken@example.com') {
    throw new Error('该邮箱已被占用')
  }
}
</script>

# Form 表单 <span class="aheart-status aheart-status--ready">Ready</span>

Form manages field layout, model validation, submit success/failure events, and configuration inheritance.

## 基础用法

<div class="aheart-demo-panel">
  <AForm layout="vertical">
    <AFormItem :label="formLabelNode" required>
      <AInput model-value="Ada" />
    </AFormItem>
    <AFormItem label="Email" validate-status="error" :help="formHelpNode" :extra="formExtraNode">
      <AInput status="error" />
    </AFormItem>
  </AForm>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
</script>

<template>
  <AForm layout="vertical" @submit="handleSubmit">
    <AFormItem :label="formLabelNode" required>
      <AInput v-model="name" />
    </AFormItem>
    <AFormItem label="Email" validate-status="error" :help="formHelpNode" :extra="formExtraNode">
      <AInput v-model="email" status="error" />
    </AFormItem>
  </AForm>
</template>
```

## 校验与提交

<div class="aheart-demo-panel">
  <AForm
    :model="formDemo"
    :rules="{ email: [{ required: true, message: 'Email is required' }] }"
    layout="vertical"
    @finish="formDemoResult = '提交成功：' + formDemo.email"
    @finish-failed="formDemoResult = '请先修正表单错误'"
  >
    <AFormItem label="Email" name="email">
      <AInput v-model="formDemo.email" placeholder="Email" />
    </AFormItem>
    <AFormItem>
      <AButton type="primary" native-type="submit">Submit</AButton>
    </AFormItem>
    <span class="aheart-demo-result" aria-live="polite">{{ formDemoResult }}</span>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" :rules="rules" layout="vertical" @finish="handleFinish" @finish-failed="handleFailed">
    <AFormItem label="Email" name="email">
      <AInput v-model="formState.email" />
    </AFormItem>
    <AFormItem>
      <AButton type="primary" native-type="submit">Submit</AButton>
    </AFormItem>
  </AForm>
</template>
```

## 异步校验与重置

<div class="aheart-demo-panel q4-form-async-demo">
  <AForm
    ref="asyncFormRef"
    :model="asyncForm"
    layout="vertical"
    @finish="asyncFormResult = '校验通过，可以提交'"
    @finish-failed="asyncFormResult = '异步校验未通过'"
  >
    <AFormItem
      label="工作邮箱"
      name="email"
      html-for="q4-async-email"
      has-feedback
      :rules="[
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '邮箱格式不正确' },
        { validator: asyncEmailValidator }
      ]"
    >
      <AInput id="q4-async-email" v-model="asyncForm.email" placeholder="free@example.com" />
    </AFormItem>
    <AFormItem>
      <ASpace>
        <AButton type="primary" native-type="submit">异步校验</AButton>
        <AButton @click="asyncFormRef?.resetFields(); asyncFormResult = '已恢复初始值'">重置</AButton>
      </ASpace>
    </AFormItem>
    <span class="aheart-demo-result" aria-live="polite">{{ asyncFormResult }}</span>
  </AForm>
</div>

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const formState = reactive({ email: 'taken@example.com' })
const checkEmail = async (_rule, value) => {
  const available = await api.checkEmail(value)
  if (!available) throw new Error('该邮箱已被占用')
}
</script>

<template>
  <AForm ref="formRef" :model="formState">
    <AFormItem name="email" has-feedback :rules="[{ validator: checkEmail }]">
      <AInput v-model="formState.email" />
    </AFormItem>
    <AButton native-type="submit">提交</AButton>
    <AButton @click="formRef.resetFields()">重置</AButton>
  </AForm>
</template>
```

异步校验期间表单项进入 `validating` 状态；同一字段的新一轮校验会使旧结果失效，避免慢响应覆盖最新输入。

## 滚动到首个错误

<div class="aheart-demo-panel">
  <AForm :model="{ email: '', password: '' }" layout="vertical" scroll-to-first-error>
    <AFormItem label="Email" name="email" :rules="[{ required: true, message: 'Email is required' }]">
      <AInput model-value="" />
    </AFormItem>
    <AFormItem label="Password" name="password" :rules="[{ required: true, message: 'Password is required' }]">
      <AInput model-value="" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit and scroll</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" layout="vertical" scroll-to-first-error>
    <AFormItem label="Email" name="email" :rules="[{ required: true, message: 'Email is required' }]">
      <AInput v-model="formState.email" />
    </AFormItem>
    <AFormItem label="Password" name="password" :rules="[{ required: true, message: 'Password is required' }]">
      <AInput v-model="formState.password" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit and scroll</AButton>
    </AFormItem>
  </AForm>
</template>
```

## 首个错误

<div class="aheart-demo-panel">
  <AForm :model="{ email: 'abc' }" layout="vertical">
    <AFormItem
      label="Email"
      name="email"
      validate-first
      :rules="[
        { type: 'email', message: 'Use a valid email' },
        { min: 8, message: 'Use at least 8 characters' }
      ]"
    >
      <AInput model-value="abc" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit first error</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" layout="vertical">
    <AFormItem
      label="Email"
      name="email"
      validate-first
      :rules="[
        { type: 'email', message: 'Use a valid email' },
        { min: 8, message: 'Use at least 8 characters' }
      ]"
    >
      <AInput v-model="formState.email" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit first error</AButton>
    </AFormItem>
  </AForm>
</template>
```

## 消息变量

<div class="aheart-demo-panel">
  <AForm :model="{ email: 'abc' }" layout="vertical">
    <AFormItem
      label="Work email"
      name="email"
      :message-variables="{ domain: 'company' }"
      :rules="[
        { type: 'email', message: '${label} must be a valid ${domain} email' },
        { min: 8, message: '${name} needs at least ${min} characters, \\${label} stays literal' }
      ]"
    >
      <AInput model-value="abc" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit variables</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" layout="vertical">
    <AFormItem
      label="Work email"
      name="email"
      :message-variables="{ domain: 'company' }"
      :rules="[
        { type: 'email', message: '${label} must be a valid ${domain} email' },
        { min: 8, message: '${name} needs at least ${min} characters, \\${label} stays literal' }
      ]"
    >
      <AInput v-model="formState.email" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit variables</AButton>
    </AFormItem>
  </AForm>
</template>
```

使用 `\\${label}` 可以输出字面 `${label}`，不会触发消息变量替换。

## 必填标记与变体

<div class="aheart-demo-panel">
  <AForm
    :model="{ age: 12 }"
    required-mark="optional"
    :colon="false"
    variant="filled"
    layout="vertical"
  >
    <AFormItem label="Age" name="age" :rules="[{ min: 18, message: 'Adults only' }]">
      <AInput model-value="12" />
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" required-mark="optional" :colon="false" variant="filled">
    <AFormItem label="Age" name="age" :rules="[{ min: 18, message: 'Adults only' }]">
      <AInput v-model="formState.age" />
    </AFormItem>
  </AForm>
</template>
```

## 表单项标签控制

<div class="aheart-demo-panel">
  <AForm :colon="false" label-align="right" layout="vertical">
    <AFormItem label="Email" html-for="label-control-email" :colon="true" label-align="left" layout="horizontal">
      <AInput id="label-control-email" model-value="ada@example.com" />
    </AFormItem>
    <AFormItem label="Nickname" :colon="false" label-align="right">
      <AInput model-value="Ada" />
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :colon="false" label-align="right" layout="vertical">
    <AFormItem label="Email" html-for="label-control-email" :colon="true" label-align="left" layout="horizontal">
      <AInput id="label-control-email" v-model="email" />
    </AFormItem>
    <AFormItem label="Nickname" :colon="false" label-align="right">
      <AInput v-model="nickname" />
    </AFormItem>
  </AForm>
</template>
```

## 标签提示

<div class="aheart-demo-panel">
  <AForm layout="vertical">
    <AFormItem label="Email" tooltip="Use your work email">
      <AInput model-value="ada@example.com" />
    </AFormItem>
    <AFormItem label="Password" :tooltip="{ title: formTooltipNode, icon: formTooltipIcon, placement: 'right' }">
      <AInput model-value="secret" />
    </AFormItem>
  </AForm>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const passwordTooltip = h('span', 'Password must be at least 8 characters')
const passwordTooltipIcon = h('span', 'i')
</script>

<template>
  <AForm layout="vertical">
    <AFormItem label="Email" tooltip="Use your work email">
      <AInput v-model="email" />
    </AFormItem>
    <AFormItem label="Password" :tooltip="{ title: passwordTooltip, icon: passwordTooltipIcon, placement: 'right' }">
      <AInput v-model="password" />
    </AFormItem>
  </AForm>
</template>
```

## 隐藏字段

<div class="aheart-demo-panel">
  <AForm :model="{ token: '' }" layout="vertical">
    <AFormItem label="Token" name="token" hidden :rules="[{ required: true, message: 'Token required' }]">
      <AInput model-value="" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit hidden field</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" layout="vertical">
    <AFormItem label="Token" name="token" hidden :rules="[{ required: true, message: 'Token required' }]">
      <AInput v-model="formState.token" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit hidden field</AButton>
    </AFormItem>
  </AForm>
</template>
```

## 无样式字段

<div class="aheart-demo-panel">
  <AForm :model="{ token: '' }" layout="vertical">
    <AFormItem name="token" no-style :rules="[{ required: true, message: 'Token required' }]">
      <AInput model-value="" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit no-style field</AButton>
    </AFormItem>
  </AForm>
</div>

```vue
<template>
  <AForm :model="formState" layout="vertical">
    <AFormItem name="token" no-style :rules="[{ required: true, message: 'Token required' }]">
      <AInput v-model="formState.token" />
    </AFormItem>
    <AFormItem>
      <AButton native-type="submit">Submit no-style field</AButton>
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
| model | 表单数据对象 | `Record<string, unknown>` | `{}` |
| rules | 表单校验规则，按字段名索引 | `Record<string, FormRule[]>` | `{}` |
| layout | 表单布局 | `horizontal` \| `vertical` \| `inline` | `horizontal` |
| labelAlign | 标签对齐方式 | `left` \| `right` | `right` |
| size | 表单控件尺寸 | `large` \| `middle` \| `small` | ConfigProvider size |
| disabled | 是否禁用内部控件 | `boolean` | ConfigProvider disabled |
| requiredMark | 必填标记展示方式 | `boolean` \| `optional` | `true` |
| colon | 是否在 label 后显示冒号 | `boolean` | `true` |
| variant | 内部控件默认变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | - |
| scrollToFirstError | 提交失败后滚动到首个错误字段 | `boolean` \| `ScrollIntoViewOptions` | `false` |

## Form Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 提交表单时触发 | `(event: Event) => void` |
| finish | 校验成功后触发 | `(values: FormModel) => void` |
| finishFailed | 校验失败后触发 | `(info: FormFinishFailedInfo) => void` |
| validate | 字段校验完成时触发 | `(name: string, status: boolean, errors: string[]) => void` |

## FormItem API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签内容；`label` 插槽优先级更高 | `VNodeChild` | - |
| name | 字段名 | `string` | - |
| colon | 是否在当前表单项 label 后显示冒号，优先于 Form `colon` | `boolean` | Form colon |
| htmlFor | 设置 label 的 `for` 属性 | `string` | - |
| labelAlign | 当前表单项标签对齐方式，优先于 Form `labelAlign` | `left` \| `right` | Form labelAlign |
| layout | 当前表单项布局 | `horizontal` \| `vertical` | Form layout |
| hidden | 是否隐藏当前表单项；隐藏后仍参与校验 | `boolean` | `false` |
| noStyle | 是否不渲染表单项样式结构；开启后仍参与校验 | `boolean` | `false` |
| required | 是否显示必填标记 | `boolean` | `false` |
| rules | 表单项校验规则 | `FormRule[]` | - |
| validateFirst | 是否在当前字段首个规则失败后停止报告后续错误 | `boolean` \| `parallel` | `false` |
| messageVariables | 校验消息模板变量 | `Record<string, string \| number>` | `{}` |
| validateStatus | 校验状态 | `success` \| `warning` \| `error` \| `validating` | - |
| help | 帮助或错误内容；`help` 插槽优先级更高 | `VNodeChild` | - |
| extra | 额外提示内容；`extra` 插槽优先级更高 | `VNodeChild` | - |
| tooltip | 标签旁提示内容或 Tooltip 配置 | `FormItemTooltip` | - |
| hasFeedback | 是否显示反馈图标 | `boolean` | `false` |

## FormItemTooltip

| 类型 | 说明 |
| --- | --- |
| `VNodeChild \| (() => VNodeChild)` | 直接作为 Tooltip `title` 渲染 |
| `{ title?: VNodeChild \| (() => VNodeChild); icon?: VNodeChild } & Partial<TooltipProps>` | 配置 Tooltip 标题、触发图标和位置等 Tooltip 参数 |

## FormRule

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| required | 是否必填 | `boolean` | `false` |
| message | 校验失败提示 | `string` | - |
| type | 值类型 | `string` \| `number` \| `email` \| `array` | - |
| min | 字符/数组最小长度，或数字最小值 | `number` | - |
| max | 字符/数组最大长度，或数字最大值 | `number` | - |
| len | 字符/数组固定长度，或数字固定值 | `number` | - |
| pattern | 正则校验 | `RegExp` | - |
| validator | 自定义同步或异步校验器；返回 `false`、错误字符串或 reject 表示失败 | `(rule, value, model) => void \| boolean \| string \| Promise` | - |

## FormFinishFailedInfo

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| values | 当前表单数据 | `FormModel` |
| errorFields | 错误字段列表 | `{ name: string; errors: string[] }[]` |

## Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| validate | 触发表单校验；含异步规则时返回 Promise | `() => FormValidationResult \| Promise<FormValidationResult>` |
| validateFields | 触发指定字段或全部字段校验；含异步规则时返回 Promise | `(names?: string[]) => FormValidationResult \| Promise<FormValidationResult>` |
| resetFields | 将指定字段或全部已注册字段恢复为初始值并清除校验状态 | `(names?: string[]) => void` |
| clearValidate | 清除字段错误 | `(names?: string[]) => void` |
| setFieldValue | 设置指定字段值并清除该字段错误 | `(name: string, value: unknown) => void` |
| setFieldsValue | 批量设置字段值并清除对应字段错误 | `(values: FormModel) => void` |
| getFieldError | 读取指定字段当前错误 | `(name: string) => string[]` |
| getFieldsError | 读取当前字段错误集合 | `(names?: string[]) => FormValidationError[]` |
| getFieldValue | 读取指定字段的当前值 | `(name: string) => unknown` |
| getFieldsValue | 读取当前字段值集合，传入 `true` 时返回完整 model 浅拷贝 | `(names?: string[] \| true) => FormModel` |
| scrollToField | 滚动到指定字段 | `(name: string, options?: ScrollIntoViewOptions) => void` |

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
