# Select <span class="aheart-status aheart-status--ready">Ready</span>

Select lets users choose one or more values from a fixed option list, with search, variants, adornments, and multi-value limits.

<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASelect
    model-value="banana"
    placeholder="Choose fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    model-value="banana"
    placeholder="Choose fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</template>
```

## Multiple Selection and Clear

<div class="aheart-demo-panel">
  <ASelect
    mode="multiple"
    :model-value="['apple', 'banana']"
    allow-clear
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    mode="multiple"
    :model-value="['apple', 'banana']"
    allow-clear
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</template>
```

## Focus Control

<div class="aheart-demo-panel">
  <ASpace>
    <ASelect
      ref="selectRef"
      placeholder="Focusable select"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <AButton size="small" @click="selectRef?.focus()">Focus</AButton>
    <AButton size="small" @click="selectRef?.blur()">Blur</AButton>
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASpace>
    <ASelect
      ref="selectRef"
      placeholder="Focusable select"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <AButton size="small" @click="selectRef?.focus()">Focus</AButton>
    <AButton size="small" @click="selectRef?.blur()">Blur</AButton>
  </ASpace>
</template>
```

## Search

<div class="aheart-demo-panel">
  <ASelect
    show-search
    placeholder="Search fruit"
    not-found-content="No fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    show-search
    placeholder="Search fruit"
    not-found-content="No fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</template>
```

## Field Mapping and Sorting

<div class="aheart-demo-panel">
  <ASelect
    show-search
    option-filter-prop="code"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked' }"
    :filter-sort="(a, b, info) => `${a.label}-${info.searchValue}`.localeCompare(`${b.label}-${info.searchValue}`)"
    :options="[
      { name: 'Beta', id: 2, code: 'fruit', locked: false },
      { name: 'Alpha', id: 1, code: 'fruit', locked: true },
      { name: 'Gamma', id: 3, code: 'team', locked: false }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    show-search
    option-filter-prop="code"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked' }"
    :filter-sort="(a, b, info) => `${a.label}-${info.searchValue}`.localeCompare(`${b.label}-${info.searchValue}`)"
    :options="[
      { name: 'Beta', id: 2, code: 'fruit', locked: false },
      { name: 'Alpha', id: 1, code: 'fruit', locked: true },
      { name: 'Gamma', id: 3, code: 'team', locked: false }
    ]"
  />
</template>
```

## Prefixes, Suffixes, and Variants

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      model-value="2"
      prefix="Level"
      suffix-icon="⌄"
      variant="filled"
      :options="[
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ]"
    />
    <ASelect
      model-value="apple"
      variant="underlined"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      model-value="apple"
      :bordered="false"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      model-value="2"
      prefix="Level"
      suffix-icon="⌄"
      variant="filled"
      :options="[
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ]"
    />
    <ASelect
      model-value="apple"
      variant="underlined"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      model-value="apple"
      :bordered="false"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</template>
```

## Default Value and Loading

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      default-value="banana"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      loading
      loading-icon="Loading"
      placeholder="Loading options"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASpace direction="vertical" style="width: 100%">
    <ASelect
      default-value="banana"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
    <ASelect
      loading
      loading-icon="Loading"
      placeholder="Loading options"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]"
    />
  </ASpace>
</template>
```

## Custom Clear and Semantic Styling

<div class="aheart-demo-panel">
  <ASelect
    model-value="apple"
    :allow-clear="{ clearIcon: 'clear' }"
    class-name="demo-select"
    :class-names="{ selector: 'demo-select-control', clear: 'demo-select-clear' }"
    :styles="{ root: { maxWidth: '320px' }, selector: { borderColor: 'var(--aheart-color-primary)' } }"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    model-value="apple"
    :allow-clear="{ clearIcon: 'clear' }"
    class-name="demo-select"
    :class-names="{ selector: 'demo-select-control', clear: 'demo-select-clear' }"
    :styles="{ root: { maxWidth: '320px' }, selector: { borderColor: 'var(--aheart-color-primary)' } }"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' }
    ]"
  />
</template>
```

## Tags and Count Limit

<div class="aheart-demo-panel">
  <ASelect
    mode="tags"
    :model-value="['apple']"
    :max-count="2"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <ASelect
    mode="tags"
    :model-value="['apple']"
    :max-count="2"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]"
  />
</template>
```

## Status and Global Configuration

<div class="aheart-demo-panel">
  <AConfigProvider size="large" disabled>
    <ASelect
      status="warning"
      placeholder="Disabled"
      :options="[
        { label: 'Ready', value: 'ready' },
        { label: 'Paused', value: 'paused' }
      ]"
    />
  </AConfigProvider>
</div>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selectRef = ref<{ focus: () => void; blur: () => void }>()
</script>

<template>
  <AConfigProvider size="large" disabled>
    <ASelect
      status="warning"
      placeholder="Disabled"
      :options="[
        { label: 'Ready', value: 'ready' },
        { label: 'Paused', value: 'paused' }
      ]"
    />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | The current selected value or values. | `string` \| `number` \| `(string \| number)[]` | - |
| id | The native control id. | `string` | - |
| name | The native control name. | `string` | - |
| defaultValue | The initial uncontrolled value. | `string` \| `number` \| `(string \| number)[]` | - |
| options | The available options. | `SelectOption[]` | `[]` |
| placeholder | Placeholder text. | `string` | - |
| prefix | Prefix content. | `string` | - |
| suffixIcon | The selector suffix icon content. | `string` | - |
| loadingIcon | Custom loading-icon content. | `VNodeChild` | - |
| size | The component size. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Whether the component is disabled. | `boolean` | ConfigProvider disabled |
| status | The validation status. | `error` \| `warning` | - |
| variant | The visual variant. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Whether a border is shown; `false` is equivalent to `borderless`. | `boolean` | `true` |
| allowClear | Whether to show a clear control, with optional custom icon configuration. | `boolean \|{ clearIcon?: VNodeChild }` | `false` |
| mode | The selection mode. | `multiple` \|`tags` | - |
| showSearch | Whether to show a search input. | `boolean` | `false` |
| searchValue | The controlled search text. | `string` | - |
| optionFilterProp | The option field matched by the default search filter. | `string` | `label` |
| filterOption | Custom filter logic; `false` disables local filtering. | `boolean` \|`(inputValue: string, option: SelectOption) => boolean` | `true` |
| filterSort | Custom ordering after filtering. | `(optionA, optionB, info) => number` | - |
| fieldNames | Maps the option label, value, and disabled field names. | `SelectFieldNames` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| notFoundContent | Content shown when no option matches. | `string` | `Not Found` |
| maxCount | The maximum number of submitted values in multiple or tags mode. | `number` | - |
| loading | Whether to show a loading state. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `SelectClassNames` | `{}` |
| styles | Styles for semantic DOM parts. | `SelectStyles` | `{}` |

### SelectOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | The option text. | `string` | - |
| value | The option value. | `string` \| `number` | - |
| disabled | Whether this option is disabled. | `boolean` | `false` |

### SelectFieldNames

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | The option-text field name. | `string` | `label` |
| value | The option-value field name. | `string` | `value` |
| disabled | The disabled-state field name. | `string` | `disabled` |

### SelectFilterSortInfo

| Field | Description | Type |
| --- | --- | --- |
| searchValue | The current search text. | `string` |

## Methods

| Name | Description |
| --- | --- |
| focus() | Focuses the selector, or its search input when `showSearch` is enabled. |
| blur() | Removes focus from the selector. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Fires when the component value changes. | `(value: SelectValue) => void` |
| change | Fires when the component value changes. | `(value: SelectValue) => void` |
| clear | Fires when the clear control is clicked. | `() => void` |
| search | Fires when the search text changes. | `(value: string) => void` |
| focus | Fires when the selector or search input receives focus. | `(event: FocusEvent) => void` |
| blur | Fires when the selector or search input loses focus. | `(event: FocusEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| prefix | Custom prefix content. |
| suffixIcon | Custom suffix-icon content. |
| loadingIcon | Custom loading-icon content. |
| clearIcon | Custom clear-control content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
| prefix | Custom prefix content. |
| search | The search input. |
| selector | The native select control. |
| option | An option node. |
| notFound | The empty-results option. |
| clear | The clear control. |
| suffix | Custom suffix content. |
| loading | The loading-icon region. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
