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
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm layout="vertical">
    <AFormItem :label="formLabelNode" required>
      <AInput model-value="Ada" />
    </AFormItem>
    <AFormItem label="Email" validate-status="error" :help="formHelpNode" :extra="formExtraNode">
      <AInput status="error" />
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
</template>
```

Use `\\${label}` to render a literal `${label}` without triggering message-variable interpolation.

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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm :colon="false" label-align="right" layout="vertical">
    <AFormItem label="Email" html-for="label-control-email" :colon="true" label-align="left" layout="horizontal">
      <AInput id="label-control-email" model-value="ada@example.com" />
    </AFormItem>
    <AFormItem label="Nickname" :colon="false" label-align="right">
      <AInput model-value="Ada" />
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
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm layout="vertical">
    <AFormItem label="Email" tooltip="Use your work email">
      <AInput model-value="ada@example.com" />
    </AFormItem>
    <AFormItem label="Password" :tooltip="{ title: formTooltipNode, icon: formTooltipIcon, placement: 'right' }">
      <AInput model-value="secret" />
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm :model="{ token: '' }" layout="vertical">
    <AFormItem label="Token" name="token" hidden :rules="[{ required: true, message: 'Token required' }]">
      <AInput model-value="" />
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm :model="{ token: '' }" layout="vertical">
    <AFormItem name="token" no-style :rules="[{ required: true, message: 'Token required' }]">
      <AInput model-value="" />
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
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
<script setup lang="ts">
import { h } from 'vue'
const formLabelNode = h('span', { class: 'demo-form-label-node' }, 'Name')
const formHelpNode = h('span', { class: 'demo-form-help-node' }, 'Email is required')
const formExtraNode = h('span', { class: 'demo-form-extra-node' }, 'Use your work email')
const formTooltipNode = h('span', { class: 'demo-form-tooltip-node' }, 'Password must be at least 8 characters')
const formTooltipIcon = h('span', { class: 'demo-form-tooltip-icon' }, 'i')
</script>

<template>
  <AForm size="large" disabled>
    <AFormItem label="Disabled">
      <AInput model-value="Inherited disabled" />
    </AFormItem>
  </AForm>
</template>
```

## API

### Form

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| model | The form data object. | `Record<string, unknown>` | `{}` |
| rules | Form validation rules indexed by field name. | `Record<string, FormRule[]>` | `{}` |
| layout | The form layout. | `horizontal` \| `vertical` \| `inline` | `horizontal` |
| labelAlign | The label alignment. | `left` \|`right` | `right` |
| size | The component size. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| requiredMark | How required marks are displayed. | `boolean` \|`optional` | `true` |
| colon | Whether to show a colon after labels. | `boolean` | `true` |
| variant | The visual variant. | `outlined` \|`borderless` \|`filled` \|`underlined` | - |
| scrollToFirstError | Whether to scroll to the first invalid field after a failed submission. | `boolean` \|`ScrollIntoViewOptions` | `false` |

## Form Events

| Event | Description | Parameters |
| --- | --- | --- |
| submit | Fires when the form is submitted. | `(event: Event) => void` |
| finish | Fires after validation succeeds. | `(values: FormModel) => void` |
| finishFailed | Fires after validation fails. | `(info: FormFinishFailedInfo) => void` |
| validate | Fires when field validation completes. | `(name: string, status: boolean, errors: string[]) => void` |

## FormItem API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | The label content. | `VNodeChild` | - |
| name | The field name. | `string` | - |
| colon | Whether to show a colon after this item’s label; takes precedence over Form `colon`. | `boolean` | Form colon |
| htmlFor | Sets the label’s `for` attribute. | `string` | - |
| labelAlign | This item’s label alignment; takes precedence over Form `labelAlign`. | `left` \|`right` | Form labelAlign |
| layout | This item’s layout. | `horizontal` \|`vertical` | Form layout |
| hidden | Whether to hide this form item. Hidden fields still participate in validation. | `boolean` | `false` |
| noStyle | Whether to omit the form-item styling structure. The field still participates in validation. | `boolean` | `false` |
| required | Whether the field is required. | `boolean` | `false` |
| rules | Form validation rules indexed by field name. | `FormRule[]` | - |
| validateFirst | Whether to stop reporting later errors after the field’s first failed rule. | `boolean` \|`parallel` | `false` |
| messageVariables | Variables available to validation-message templates. | `Record<string, string \|number>` | `{}` |
| validateStatus | The validation status. | `success` \| `warning` \| `error` \| `validating` | - |
| help | Help or error content; the `help` slot takes precedence. | `VNodeChild` | - |
| extra | Additional hint content; the `extra` slot takes precedence. | `VNodeChild` | - |
| tooltip | Content beside the label or a Tooltip configuration. | `FormItemTooltip` | - |
| hasFeedback | Whether to show a feedback icon. | `boolean` | `false` |

## FormItemTooltip

| Type | Description |
| --- | --- |
| `VNodeChild \| (() => VNodeChild)` | Renders directly as the Tooltip `title`. |
| `{ title?: VNodeChild \| (() => VNodeChild); icon?: VNodeChild } & Partial<TooltipProps>` | Defines the Tooltip title, trigger icon, placement, and other Tooltip props. |

## FormRule

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| required | Whether the field is required. | `boolean` | `false` |
| message | The validation failure message. | `string` | - |
| type | The value type. | `string` \| `number` \| `email` \| `array` | - |
| min | The minimum value or character/array length. | `number` | - |
| max | The maximum value or character/array length. | `number` | - |
| len | The exact value or character/array length. | `number` | - |
| pattern | A regular-expression validation rule. | `RegExp` | - |

## FormFinishFailedInfo

| Field | Description | Type |
| --- | --- | --- |
| values | The current form data. | `FormModel` |
| errorFields | The invalid fields. | `{ name: string; errors: string[] }[]` |

## Exposes

| Name | Description | Type |
| --- | --- | --- |
| validate | Runs synchronous form validation. | `() => { values: FormModel; errorFields: FormValidationError[] }` |
| validateFields | Runs synchronous validation for specified fields or all fields. | `(names?: string[]) => { values: FormModel; errorFields: FormValidationError[] }` |
| clearValidate | Clears field errors. | `(names?: string[]) => void` |
| setFieldValue | Sets one field value and clears its error. | `(name: string, value: unknown) => void` |
| setFieldsValue | Sets multiple field values and clears their errors. | `(values: FormModel) => void` |
| getFieldError | Reads a field’s current errors. | `(name: string) => string[]` |
| getFieldsError | Reads the current field-error collection. | `(names?: string[]) => FormValidationError[]` |
| getFieldValue | Reads a field’s current value. | `(name: string) => unknown` |
| getFieldsValue | Reads current field values; passing `true` returns a shallow copy of the complete model. | `(names?: string[] \|true) => FormModel` |
| scrollToField | Scrolls to a specified field. | `(name: string, options?: ScrollIntoViewOptions) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Custom component content. |
| label | The label content. |
| help | Custom help content. |
| extra | Custom additional-hint content. |

## Theme Tokens

- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-color-success`
- `--aheart-spacing-sm`
- `--aheart-spacing-md`
