# Tag <span class="aheart-status aheart-status--ready">Ready</span>

Tag labels content with compact status, category, link, close, and checkable selection affordances.

<script setup lang="ts">
import { h } from 'vue'
const tagNodeLabel = h('span', { class: 'demo-tag-option-node' }, 'Node label')
const handleClose = () => undefined
</script>



## Basic Usage

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag>Default</ATag>
    <ATag color="primary">Primary</ATag>
    <ATag color="success">Success</ATag>
    <ATag color="processing">Processing</ATag>
    <ATag color="warning">Warning</ATag>
    <ATag color="error">Error</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag>Default</ATag>
    <ATag color="primary">Primary</ATag>
    <ATag color="success">Success</ATag>
    <ATag color="processing">Processing</ATag>
    <ATag color="warning">Warning</ATag>
    <ATag color="error">Error</ATag>
  </ASpace>
</template>
```

## Variants

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag variant="filled" color="primary">Filled</ATag>
    <ATag variant="outlined" color="primary">Outlined</ATag>
    <ATag variant="solid" color="primary">Solid</ATag>
    <ATag :bordered="false">Borderless</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag variant="filled" color="primary">Filled</ATag>
    <ATag variant="outlined" color="primary">Outlined</ATag>
    <ATag variant="solid" color="primary">Solid</ATag>
    <ATag :bordered="false">Borderless</ATag>
  </ASpace>
</template>
```

## Icon, Link, and Disabled State

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag icon="✓" color="success">Ready</ATag>
    <ATag href="https://example.com" target="_blank" rel="noreferrer" color="primary">Link tag</ATag>
    <ATag disabled href="https://example.com">Disabled link</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag icon="✓" color="success">Ready</ATag>
    <ATag href="https://example.com" target="_blank" rel="noreferrer" color="primary">Link tag</ATag>
    <ATag disabled href="https://example.com">Disabled link</ATag>
  </ASpace>
</template>
```

## Closable

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag closable color="primary">Default close</ATag>
    <ATag closable close-icon="close" color="warning">Custom close</ATag>
    <ATag closable :close-icon="false" color="success">No close icon</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag closable color="primary" @close="handleClose">Default close</ATag>
    <ATag closable close-icon="close" color="warning">Custom close</ATag>
    <ATag closable :close-icon="false" color="success">No close icon</ATag>
  </ASpace>
</template>
```

## Checkable Tags

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ACheckableTag checked icon="✓">Checked</ACheckableTag>
    <ACheckableTag>Unchecked</ACheckableTag>
    <ACheckableTag disabled>Disabled</ACheckableTag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ACheckableTag :checked="checked" @change="checked = $event">Checked</ACheckableTag>
    <ACheckableTag :checked="false">Unchecked</ACheckableTag>
    <ACheckableTag disabled>Disabled</ACheckableTag>
  </ASpace>
</template>
```

## Checkable Tag Group

<div class="aheart-demo-panel">
  <ASpace direction="vertical">
    <ATagGroup
      default-value="review"
      :options="[
        'draft',
        { label: 'Review', value: 'review', title: 'Current stage' },
        { label: 'Done', value: 'done', disabled: true },
        { label: tagNodeLabel, value: 'node' }
      ]"
    />
    <ATagGroup
      multiple
      :default-value="['vue', 'docs']"
      :options="[
        { label: 'Vue', value: 'vue', icon: 'V' },
        { label: 'Docs', value: 'docs', className: 'demo-tag-option' },
        'Tests'
      ]"
    />
  </ASpace>
</div>

```vue
<script setup lang="ts">
import { h } from 'vue'

const tagNodeLabel = h('span', { class: 'demo-tag-option-node' }, 'Node label')
</script>

<template>
  <ATagGroup
    default-value="review"
    :options="[
      'draft',
      { label: 'Review', value: 'review', title: 'Current stage' },
      { label: 'Done', value: 'done', disabled: true },
      { label: tagNodeLabel, value: 'node' }
    ]"
  />
  <ATagGroup
    multiple
    :default-value="['vue', 'docs']"
    :options="[
      { label: 'Vue', value: 'vue', icon: 'V' },
      { label: 'Docs', value: 'docs', className: 'demo-tag-option' },
      'Tests'
    ]"
  />
</template>
```

## Custom Color

<div class="aheart-demo-panel">
  <ASpace wrap>
    <ATag color="#722ed1">Purple</ATag>
    <ATag color="#13c2c2" variant="outlined">Cyan</ATag>
    <ATag color="#eb2f96" variant="solid">Magenta</ATag>
  </ASpace>
</div>

```vue
<template>
  <ASpace wrap>
    <ATag color="#722ed1">Purple</ATag>
    <ATag color="#13c2c2" variant="outlined">Cyan</ATag>
    <ATag color="#eb2f96" variant="solid">Magenta</ATag>
  </ASpace>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ASpace direction="vertical">
    <ATag
      icon="!"
      closable
      close-icon="×"
      class-name="demo-tag"
      root-class-name="demo-tag-root"
      :style="{ marginTop: '2px' }"
      :class-names="{ root: 'demo-tag-semantic-root', icon: 'demo-tag-icon', content: 'demo-tag-content', close: 'demo-tag-close' }"
      :styles="{ content: { fontWeight: 600 }, close: { color: '#1677ff' } }"
    >
      Semantic tag
    </ATag>
    <ATagGroup
      default-value="a"
      :options="['a', 'b']"
      :class-names="{ root: 'demo-tag-group', item: 'demo-tag-item', activeItem: 'demo-tag-active' }"
      :styles="{ activeItem: { fontWeight: 600 } }"
    />
  </ASpace>
</div>

```vue
<template>
  <ATag
    icon="!"
    closable
    close-icon="×"
    class-name="demo-tag"
    root-class-name="demo-tag-root"
    :class-names="{ root: 'demo-tag-semantic-root', icon: 'demo-tag-icon', content: 'demo-tag-content', close: 'demo-tag-close' }"
    :styles="{ content: { fontWeight: 600 }, close: { color: '#1677ff' } }"
  >
    Semantic tag
  </ATag>
  <ATagGroup
    default-value="a"
    :options="['a', 'b']"
    :class-names="{ root: 'demo-tag-group', item: 'demo-tag-item', activeItem: 'demo-tag-active' }"
    :styles="{ activeItem: { fontWeight: 600 } }"
  />
</template>
```

## API

### Tag

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| color | Configures `color`. | `default` \|`primary` \|`success` \|`processing` \|`warning` \|`danger` \|`error` \|`string` | `default` |
| variant | Configures `variant`. | `filled` \|`solid` \|`outlined` | `filled` |
| bordered | Configures `bordered`. | `boolean` | `true` |
| closable | Configures `closable`. | `boolean` | `false` |
| closeIcon | Configures `closeIcon`. | `VNodeChild` \| `false` \| `null` | `×` |
| icon | Configures `icon`. | `VNodeChild` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| href | Configures `href`. | `string` | - |
| target | Configures `target`. | `string` | - |
| rel | Configures `rel`. | `string` | - |
| title | Configures `title`. | `string` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', StyleValue>>` | - |

### CheckableTag

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Configures `checked`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | `false` |
| icon | Configures `icon`. | `VNodeChild` | - |
| title | Configures `title`. | `string` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'icon' \| 'content', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'icon' \| 'content', StyleValue>>` | - |

### TagGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Configures `modelValue`. | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| value | Configures `value`. | `string` \|`number` \|`(string \|number)[]` \|`null` | - |
| defaultValue | Configures `defaultValue`. | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| options | Configures `options`. | `TagRawOption[]` | `[]` |
| multiple | Configures `multiple`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<'root' \| 'item' \| 'activeItem', string>>` | - |
| styles | Configures `styles`. | `Partial<Record<'root' \| 'item' \| 'activeItem', StyleValue>>` | - |

### TagOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Configures `label`. | `VNodeChild` | - |
| value | Configures `value`. | `string` \| `number` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| icon | Configures `icon`. | `VNodeChild` | - |
| className | Configures `className`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| title | Configures `title`. | `string` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Emitted when `close` occurs. | `(event: MouseEvent) => void` |
| update:checked | Emitted when `update:checked` occurs. | `(checked: boolean) => void` |
| change | Emitted when `change` occurs. | `(checked: boolean, event: MouseEvent) => void` |
| update:modelValue | Emitted when `update:modelValue` occurs. | `(value: TagGroupValue) => void` |
| update:value | Emitted when `update:value` occurs. | `(value: TagGroupValue) => void` |
| change | Emitted when `change` occurs. | `(value: TagGroupValue) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |
| icon | Provides the `icon` entry. |
| closeIcon | Provides the `closeIcon` entry. |

## Semantic DOM

### Tag / CheckableTag

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| icon | Provides the `icon` entry. |
| content | Provides the `content` entry. |
| close | Provides the `close` entry. |

### TagGroup

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
| item | Provides the `item` entry. |
| activeItem | Provides the `activeItem` entry. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-border`
- `--aheart-border-radius-sm`
