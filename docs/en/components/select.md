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
<template>
  <ASelect
    v-model="value"
    placeholder="Choose fruit"
    :options="[
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry', disabled: true }
    ]"
  />
</template>
```

## contentandcontent

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
<template>
  <ASelect
    v-model="values"
    mode="multiple"
    allow-clear
    :options="options"
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
  <ASelect ref="selectRef" placeholder="Focusable select" :options="options" />
  <AButton @click="selectRef?.focus()">Focus</AButton>
  <AButton @click="selectRef?.blur()">Blur</AButton>
</template>
```

## content

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
<template>
  <ASelect
    v-model="value"
    show-search
    placeholder="Search fruit"
    not-found-content="No fruit"
    :options="options"
    @search="handleSearch"
  />
</template>
```

## fieldcontentandsort

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
<template>
  <ASelect
    show-search
    option-filter-prop="code"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked' }"
    :filter-sort="sortOptions"
    :options="remoteOptions"
  />
</template>
```

## beforeaftercontentandcontent

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
<template>
  <ASelect v-model="level" prefix="Level" suffix-icon="⌄" variant="filled" :options="levels" />
  <ASelect v-model="value" variant="underlined" :options="options" />
  <ASelect v-model="value" :bordered="false" :options="options" />
</template>
```

## defaultandloading

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
<template>
  <ASelect default-value="banana" :options="options" />
  <ASelect loading loading-icon="Loading" placeholder="Loading options" :options="options" />
</template>
```

## customcontentandcontentstyle

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
<template>
  <ASelect
    v-model="value"
    :allow-clear="{ clearIcon: 'clear' }"
    class-name="demo-select"
    :class-names="{ selector: 'demo-select-control', clear: 'demo-select-clear' }"
    :styles="{ root: { maxWidth: '320px' } }"
    :options="options"
  />
</template>
```

## Tags andcountcontent

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
<template>
  <ASelect v-model="values" mode="tags" :max-count="2" :options="options" />
</template>
```

## statusandglobal configuration

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
<template>
  <AConfigProvider size="large" disabled>
    <ASelect status="warning" placeholder="Disabled" :options="options" />
  </AConfigProvider>
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Configures `modelValue`. | `string` \| `number` \| `(string \| number)[]` | - |
| id | Configures `id`. | `string` | - |
| name | Configures `name`. | `string` | - |
| defaultValue | Configures `defaultValue`. | `string` \| `number` \| `(string \| number)[]` | - |
| options | Configures `options`. | `SelectOption[]` | `[]` |
| placeholder | Configures `placeholder`. | `string` | - |
| prefix | Configures `prefix`. | `string` | - |
| suffixIcon | Configures `suffixIcon`. | `string` | - |
| loadingIcon | Configures `loadingIcon`. | `VNodeChild` | - |
| size | Configures `size`. | `large` \|`middle` \|`small` | ConfigProvider size |
| disabled | Configures `disabled`. | `boolean` | ConfigProvider disabled |
| status | Configures `status`. | `error` \| `warning` | - |
| variant | Configures `variant`. | `outlined` \|`borderless` \|`filled` \|`underlined` | `outlined` |
| bordered | Configures `bordered`. | `boolean` | `true` |
| allowClear | Configures `allowClear`. | `boolean \|{ clearIcon?: VNodeChild }` | `false` |
| mode | Configures `mode`. | `multiple` \|`tags` | - |
| showSearch | Configures `showSearch`. | `boolean` | `false` |
| searchValue | Configures `searchValue`. | `string` | - |
| optionFilterProp | Configures `optionFilterProp`. | `string` | `label` |
| filterOption | Configures `filterOption`. | `boolean` \|`(inputValue: string, option: SelectOption) => boolean` | `true` |
| filterSort | Configures `filterSort`. | `(optionA, optionB, info) => number` | - |
| fieldNames | Configures `fieldNames`. | `SelectFieldNames` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| notFoundContent | Configures `notFoundContent`. | `string` | `Not Found` |
| maxCount | Configures `maxCount`. | `number` | - |
| loading | Configures `loading`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `SelectClassNames` | `{}` |
| styles | Configures `styles`. | `SelectStyles` | `{}` |

### SelectOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Configures `label`. | `string` | - |
| value | Configures `value`. | `string` \| `number` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |

### SelectFieldNames

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Configures `label`. | `string` | `label` |
| value | Configures `value`. | `string` | `value` |
| disabled | Configures `disabled`. | `string` | `disabled` |

### SelectFilterSortInfo

| Field | Description | Type |
| --- | --- | --- |
| searchValue | Describes `searchValue`. | `string` |

## Methods

| Name | Description |
| --- | --- |
| focus() | Provides the `focus()` entry. |
| blur() | Provides the `blur()` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(value: SelectValue) => void` |
| change | Emitted when `change` occurs. | `(value: SelectValue) => void` |
| clear | Emitted when `clear` occurs. | `() => void` |
| search | Emitted when `search` occurs. | `(value: string) => void` |
| focus | Emitted when `focus` occurs. | `(event: FocusEvent) => void` |
| blur | Emitted when `blur` occurs. | `(event: FocusEvent) => void` |

## Slots

| Name | Description |
| --- | --- |
| prefix | Provides the `prefix` entry. |
| suffixIcon | Provides the `suffixIcon` entry. |
| loadingIcon | Provides the `loadingIcon` entry. |
| clearIcon | Provides the `clearIcon` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| prefix | Provides the `prefix` entry. |
| search | Provides the `search` entry. |
| selector | Provides the `selector` entry. |
| option | Provides the `option` entry. |
| notFound | Provides the `notFound` entry. |
| clear | Provides the `clear` entry. |
| suffix | Provides the `suffix` entry. |
| loading | Provides the `loading` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-border`
- `--aheart-color-danger`
- `--aheart-color-warning`
- `--aheart-control-height`
- `--aheart-radius`
