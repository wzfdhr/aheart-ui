# Form <span class="aheart-status aheart-status--ready">Ready</span>

Form manages field layout, model validation, submit success/failure events, and configuration inheritance.

<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>



## Basic Usage

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

## Validation and Submit

<div class="aheart-demo-panel">
  <AForm
    :model="{ email: '' }"
    :rules="{ email: [{ required: true, message: 'Email is required' }] }"
    layout="vertical"
  >
    <AFormItem label="Email" name="email">
      <AInput model-value="" placeholder="Email" />
    </AFormItem>
    <AFormItem>
      <AButton type="primary" native-type="submit">Submit</AButton>
    </AFormItem>
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

## Scroll to First Error

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

## First Error

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

## Message Variables

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

use `\\${label}` cancontent `${label}`，contenttriggercontent。

## Required Mark and Variants

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

## Form Item Label Control

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

## Label Tooltip

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

## Hidden Field

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

## No-Style Field

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

## Inline Layout

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

## Form-Level Configuration

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

## API

## Form API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| model | Configures `model`. | `Record<string, unknown>` | `{}` |
| rules | Configures `rules`. | `Record<string, FormRule[]>` | `{}` |
| layout | Configures `layout`. | `horizontal` \| `vertical` \| `inline` | `horizontal` |
| labelAlign | Configures `labelAlign`. | `left` \|`right` | `right` |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| requiredMark | Configures `requiredMark`. | `boolean` \|`optional` | `true` |
| colon | Configures `colon`. | `boolean` | `true` |
| variant | Configures `variant`. | `outlined` \|`borderless` \|`filled` \|`underlined` | - |
| scrollToFirstError | Configures `scrollToFirstError`. | `boolean` \|`ScrollIntoViewOptions` | `false` |

## Form Events

| Event | Description | Parameters |
| --- | --- | --- |
| submit | Describes `submit`. | `(event: Event) => void` |
| finish | Describes `finish`. | `(values: FormModel) => void` |
| finishFailed | Describes `finishFailed`. | `(info: FormFinishFailedInfo) => void` |
| validate | Describes `validate`. | `(name: string, status: boolean, errors: string[]) => void` |

## FormItem API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Configures `label`. | `VNodeChild` | - |
| name | Configures `name`. | `string` | - |
| colon | Configures `colon`. | `boolean` | Form colon |
| htmlFor | Configures `htmlFor`. | `string` | - |
| labelAlign | Configures `labelAlign`. | `left` \|`right` | Form labelAlign |
| layout | Configures `layout`. | `horizontal` \|`vertical` | Form layout |
| hidden | Configures `hidden`. | `boolean` | `false` |
| noStyle | Configures `noStyle`. | `boolean` | `false` |
| required | Configures `required`. | `boolean` | `false` |
| rules | Configures `rules`. | `FormRule[]` | - |
| validateFirst | Configures `validateFirst`. | `boolean` \|`parallel` | `false` |
| messageVariables | Configures `messageVariables`. | `Record<string, string \|number>` | `{}` |
| validateStatus | Configures `validateStatus`. | `success` \| `warning` \| `error` \| `validating` | - |
| help | Configures `help`. | `VNodeChild` | - |
| extra | Configures `extra`. | `VNodeChild` | - |
| tooltip | Configures `tooltip`. | `FormItemTooltip` | - |
| hasFeedback | Configures `hasFeedback`. | `boolean` | `false` |

## FormItemTooltip

| Type | Description |
| --- | --- |
| `VNodeChild \| (() => VNodeChild)` | Provides the ``VNodeChild \| (() => VNodeChild)`` entry. |
| `{ title?: VNodeChild \| (() => VNodeChild); icon?: VNodeChild } & Partial<TooltipProps>` | Provides the ``{ title?: VNodeChild \| (() => VNodeChild); icon?: VNodeChild } & Partial<TooltipProps>`` entry. |

## FormRule

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| required | Configures `required`. | `boolean` | `false` |
| message | Configures `message`. | `string` | - |
| type | Configures `type`. | `string` \| `number` \| `email` \| `array` | - |
| min | Configures `min`. | `number` | - |
| max | Configures `max`. | `number` | - |
| len | Configures `len`. | `number` | - |
| pattern | Configures `pattern`. | `RegExp` | - |

## FormFinishFailedInfo

| Field | Description | Type |
| --- | --- | --- |
| values | Describes `values`. | `FormModel` |
| errorFields | Describes `errorFields`. | `{ name: string; errors: string[] }[]` |

## Exposes

| Name | Description | Type |
| --- | --- | --- |
| validate | Exposes the `validate` method. | `() => { values: FormModel; errorFields: FormValidationError[] }` |
| validateFields | Exposes the `validateFields` method. | `(names?: string[]) => { values: FormModel; errorFields: FormValidationError[] }` |
| clearValidate | Exposes the `clearValidate` method. | `(names?: string[]) => void` |
| setFieldValue | Exposes the `setFieldValue` method. | `(name: string, value: unknown) => void` |
| setFieldsValue | Exposes the `setFieldsValue` method. | `(values: FormModel) => void` |
| getFieldError | Exposes the `getFieldError` method. | `(name: string) => string[]` |
| getFieldsError | Exposes the `getFieldsError` method. | `(names?: string[]) => FormValidationError[]` |
| getFieldValue | Exposes the `getFieldValue` method. | `(name: string) => unknown` |
| getFieldsValue | Exposes the `getFieldsValue` method. | `(names?: string[] \|true) => FormModel` |
| scrollToField | Exposes the `scrollToField` method. | `(name: string, options?: ScrollIntoViewOptions) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| label | Provides the `label` entry. |
| help | Provides the `help` entry. |
| extra | Provides the `extra` entry. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-success`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
