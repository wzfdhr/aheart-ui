# Typography <span class="aheart-status aheart-status--ready">Ready</span>

Typography provides text, title, paragraph, and link primitives for product interfaces.



## Basic Usage

### Title

<div class="aheart-demo-panel">
  <ATitle :level="3">Aheart UI</ATitle>
  <AParagraph>Calm and consistent product interface typography.</AParagraph>
</div>

```vue
<template>
<ATitle :level="3">Aheart UI</ATitle>
  <AParagraph>Calm and consistent product interface typography.</AParagraph>
</template>
```

## Text Types

<div class="aheart-demo-panel">
  <ASpace>
    <AText>Default</AText>
    <AText type="success" strong>Success</AText>
    <AText type="warning">Warning</AText>
    <AText code>code</AText>
  </ASpace>
</div>

```vue
<template>
<ASpace>
    <AText>Default</AText>
    <AText type="success" strong>Success</AText>
    <AText type="warning">Warning</AText>
    <AText code>code</AText>
  </ASpace>
</template>
```

## Mark and Ellipsis

<div class="aheart-demo-panel">
  <AText mark strong>Important</AText>
  <AParagraph :ellipsis="{ rows: 2 }" style="max-width: 280px">
    A long paragraph can be constrained to multiple lines while keeping the same Typography API surface.
  </AParagraph>
</div>

```vue
<template>
<AText mark strong>Important</AText>
  <AParagraph :ellipsis="{ rows: 2 }" style="max-width: 280px">
    A long paragraph can be constrained to multiple lines while keeping the same Typography API surface.
  </AParagraph>
</template>
```

## Copyable

<div class="aheart-demo-panel">
  <ASpace direction="vertical" style="width: 100%">
    <AText copyable>Copy this text</AText>
    <AParagraph
      :copyable="{
        text: 'Plain copied paragraph',
        icon: ['copy', 'copied'],
        tooltips: ['Copy paragraph', 'Copied paragraph']
      }"
      :actions="{ placement: 'start' }"
    >
      Copy operation can use custom text and render before the paragraph content.
    </AParagraph>
    <ATitle :level="5" copyable>Copyable heading</ATitle>
  </ASpace>
</div>

```vue
<template>
<ASpace direction="vertical" style="width: 100%">
    <AText copyable>Copy this text</AText>
    <AParagraph
      :copyable="{
        text: 'Plain copied paragraph',
        icon: ['copy', 'copied'],
        tooltips: ['Copy paragraph', 'Copied paragraph']
      }"
      :actions="{ placement: 'start' }"
    >
      Copy operation can use custom text and render before the paragraph content.
    </AParagraph>
    <ATitle :level="5" copyable>Copyable heading</ATitle>
  </ASpace>
</template>
```

## Semantic Styling

<div class="aheart-demo-panel">
  <ATypography
    root-class-name="demo-typography-root"
    :styles="{ root: { padding: '8px', border: '1px solid var(--aheart-color-border)' } }"
  >
    <ATitle
      :level="4"
      type="warning"
      mark
      :class-names="{ root: 'demo-title-root' }"
      :styles="{ root: { marginBottom: '4px' } }"
    >
      Semantic title
    </ATitle>
    <ALink href="https://example.com" root-class-name="demo-link-root">Semantic link</ALink>
  </ATypography>
</div>

```vue
<template>
<ATypography
    root-class-name="demo-typography-root"
    :styles="{ root: { padding: '8px', border: '1px solid var(--aheart-color-border)' } }"
  >
    <ATitle
      :level="4"
      type="warning"
      mark
      :class-names="{ root: 'demo-title-root' }"
      :styles="{ root: { marginBottom: '4px' } }"
    >
      Semantic title
    </ATitle>
    <ALink href="https://example.com" root-class-name="demo-link-root">Semantic link</ALink>
  </ATypography>
</template>
```

## API

### Typography

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `TypographyClassNames` | - |
| styles | Styles for semantic DOM parts. | `TypographyStyles` | - |

### Title

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| level | The heading level. | `1` \|`2` \|`3` \|`4` \|`5` | `1` |
| type | The value type. | `secondary` \| `success` \| `warning` \| `danger` | - |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| mark | Whether text is highlighted. | `boolean` | `false` |
| copyable | Whether to show copy actions, or their text, icons, tooltips, and callback configuration. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Action-area configuration, including copy-button placement. | `TypographyActionsConfig` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `TypographyClassNames` | - |
| styles | Styles for semantic DOM parts. | `TypographyStyles` | - |

### Text

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | The value type. | `secondary` \|`success` \|`warning` \|`danger` | - |
| strong | Whether text is bold. | `boolean` | `false` |
| italic | Whether text is italic. | `boolean` | `false` |
| code | Whether text is rendered as code. | `boolean` | `false` |
| keyboard | Whether keyboard-style text is rendered. | `boolean` | `false` |
| delete | Whether text is struck through. | `boolean` | `false` |
| underline | Whether text is underlined. | `boolean` | `false` |
| mark | Whether text is highlighted. | `boolean` | `false` |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| copyable | Whether to show copy actions, or their text, icons, tooltips, and callback configuration. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Action-area configuration, including copy-button placement. | `TypographyActionsConfig` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `TypographyClassNames` | - |
| styles | Styles for semantic DOM parts. | `TypographyStyles` | - |

### Paragraph

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | The value type. | `secondary` \|`success` \|`warning` \|`danger` | - |
| strong | Whether text is bold. | `boolean` | `false` |
| italic | Whether text is italic. | `boolean` | `false` |
| ellipsis | Whether text is truncated with an ellipsis. | `boolean` \|`TypographyEllipsisConfig` | `false` |
| mark | Whether text is highlighted. | `boolean` | `false` |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| copyable | Whether to show copy actions, or their text, icons, tooltips, and callback configuration. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Action-area configuration, including copy-button placement. | `TypographyActionsConfig` | - |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `TypographyClassNames` | - |
| styles | Styles for semantic DOM parts. | `TypographyStyles` | - |

### TypographyEllipsisConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| rows | The number of visible rows. | `number` | `1` |

### TypographyCopyableConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| text | The copied text. | `string` \|`() => string \|Promise<string>` | rendered text |
| icon | The copy and copied icons. | `VNodeChild` \|`[VNodeChild, VNodeChild]` | `copy` / `copied` |
| tooltips | Copy and copied tooltips, or `false` to disable them. | `false` \|`[VNodeChild, VNodeChild]` | `Copy` / `Copied` |
| format | The copied content format. | `text/plain` \|`text/html` | `text/plain` |
| tabIndex | The copy action tab index. | `number` | `0` |
| onCopy | The callback invoked after copying. | `(event: MouseEvent) => void` | - |

### TypographyActionsConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| placement | The action-area placement. | `start` \|`end` | `end` |

### Link

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| href | The link target URL. | `string` | - |
| target | The link target browsing context. | `string` | - |
| disabled | Whether the component is disabled. | `boolean` | `false` |
| underline | Whether text is underlined. | `boolean` | `false` |
| className | A compatibility CSS class for the root element. | `string` | - |
| rootClassName | The root element CSS class. | `string` | - |
| style | Styles for the root element. | `StyleValue` | - |
| classNames | CSS classes for semantic DOM parts. | `TypographyClassNames` | - |
| styles | Styles for semantic DOM parts. | `TypographyStyles` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Custom component content. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | The root element. |
