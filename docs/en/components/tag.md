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
    <ATag closable color="primary">Default close</ATag>
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
    <ACheckableTag checked icon="✓">Checked</ACheckableTag>
    <ACheckableTag>Unchecked</ACheckableTag>
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
</template>
```

## API

### Tag

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| color | Custom color. | `default` \|`primary` \|`success` \|`processing` \|`warning` \|`danger` \|`error` \|`string` | `default` |
| variant | Tag visual variant. | `filled` \|`solid` \|`outlined` | `filled` |
| bordered | Whether to show a border; a compatibility option, so prefer `variant` in new code. | `boolean` | `true` |
| closable | Whether to show the close control. | `boolean` | `false` |
| closeIcon | Custom close icon or close-button content. | `VNodeChild` \| `false` \| `null` | `×` |
| icon | Custom icon. | `VNodeChild` | - |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| href | Link address. | `string` | - |
| target | Link target. | `string` | - |
| rel | Link relationship attribute. | `string` | - |
| title | Native title tooltip. | `string` | - |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', string>>` | - |
| styles | Semantic DOM styles, as an object or function. | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', StyleValue>>` | - |

### CheckableTag

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Controlled checked state. | `boolean` | `false` |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| icon | Custom icon. | `VNodeChild` | - |
| title | Native title tooltip. | `string` | - |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `Partial<Record<'root' \| 'icon' \| 'content', string>>` | - |
| styles | Semantic DOM styles, as an object or function. | `Partial<Record<'root' \| 'icon' \| 'content', StyleValue>>` | - |

### TagGroup

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue | Current selected value in Vue controlled mode. | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| value | Ant-style controlled selected-value alias, which takes precedence over `modelValue`. | `string` \|`number` \|`(string \|number)[]` \|`null` | - |
| defaultValue | Initial value in uncontrolled mode. | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| options | Option list. | `TagRawOption[]` | `[]` |
| multiple | Whether multiple selection is allowed. | `boolean` | `false` |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `Partial<Record<'root' \| 'item' \| 'activeItem', string>>` | - |
| styles | Semantic DOM styles, as an object or function. | `Partial<Record<'root' \| 'item' \| 'activeItem', StyleValue>>` | - |

### TagOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Item label content. | `VNodeChild` | - |
| value | Ant-style controlled selected-value alias, which takes precedence over `modelValue`. | `string` \| `number` | - |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| icon | Custom icon. | `VNodeChild` | - |
| className | Compatibility class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| title | Native title tooltip. | `string` | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| close | Fired when the close button is clicked. | `(event: MouseEvent) => void` |
| update:checked | Fired when `ACheckableTag` updates its selected state. | `(checked: boolean) => void` |
| change | Fired when `ACheckableTag` selection changes. | `(checked: boolean, event: MouseEvent) => void` |
| update:modelValue | Fired when `ATagGroup` updates its Vue-controlled selected value. | `(value: TagGroupValue) => void` |
| update:value | Fired when `ATagGroup` updates its Ant-style controlled selected value. | `(value: TagGroupValue) => void` |
| change | Fired when the `ATagGroup` selection changes. | `(value: TagGroupValue) => void` |

## Slots

| Name | Description |
| --- | --- |
| default | Tag content. |
| icon | Custom tag icon. |
| closeIcon | Custom close icon. |

## Semantic DOM

### Tag / CheckableTag

| Name | Description |
| --- | --- |
| root | Root element. |
| icon | Icon container. |
| content | Content container. |
| close | Close button, available only on `ATag`. |

### TagGroup

| Name | Description |
| --- | --- |
| root | Group root element. |
| item | Individual selectable tag. |
| activeItem | Selected selectable tag. |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-border`
- `--aheart-border-radius-sm`
