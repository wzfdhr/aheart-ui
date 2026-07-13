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
  <AText>Default</AText>
  <AText type="success" strong>Success</AText>
  <AText type="warning">Warning</AText>
  <AText code>code</AText>
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
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TypographyClassNames` | - |
| styles | Configures `styles`. | `TypographyStyles` | - |

### Title

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| level | Configures `level`. | `1` \|`2` \|`3` \|`4` \|`5` | `1` |
| type | Configures `type`. | `secondary` \| `success` \| `warning` \| `danger` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| mark | Configures `mark`. | `boolean` | `false` |
| copyable | Configures `copyable`. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Configures `actions`. | `TypographyActionsConfig` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TypographyClassNames` | - |
| styles | Configures `styles`. | `TypographyStyles` | - |

### Text

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Configures `type`. | `secondary` \|`success` \|`warning` \|`danger` | - |
| strong | Configures `strong`. | `boolean` | `false` |
| italic | Configures `italic`. | `boolean` | `false` |
| code | Configures `code`. | `boolean` | `false` |
| keyboard | Configures `keyboard`. | `boolean` | `false` |
| delete | Configures `delete`. | `boolean` | `false` |
| underline | Configures `underline`. | `boolean` | `false` |
| mark | Configures `mark`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | `false` |
| copyable | Configures `copyable`. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Configures `actions`. | `TypographyActionsConfig` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TypographyClassNames` | - |
| styles | Configures `styles`. | `TypographyStyles` | - |

### Paragraph

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Configures `type`. | `secondary` \|`success` \|`warning` \|`danger` | - |
| strong | Configures `strong`. | `boolean` | `false` |
| italic | Configures `italic`. | `boolean` | `false` |
| ellipsis | Configures `ellipsis`. | `boolean` \|`TypographyEllipsisConfig` | `false` |
| mark | Configures `mark`. | `boolean` | `false` |
| disabled | Configures `disabled`. | `boolean` | `false` |
| copyable | Configures `copyable`. | `boolean` \|`TypographyCopyableConfig` | `false` |
| actions | Configures `actions`. | `TypographyActionsConfig` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TypographyClassNames` | - |
| styles | Configures `styles`. | `TypographyStyles` | - |

### TypographyEllipsisConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Configures `rows`. | `number` | `1` |

### TypographyCopyableConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| text | Configures `text`. | `string` \|`() => string \|Promise<string>` | rendered text |
| icon | Configures `icon`. | `VNodeChild` \|`[VNodeChild, VNodeChild]` | `copy` / `copied` |
| tooltips | Configures `tooltips`. | `false` \|`[VNodeChild, VNodeChild]` | `Copy` / `Copied` |
| format | Configures `format`. | `text/plain` \|`text/html` | `text/plain` |
| tabIndex | Configures `tabIndex`. | `number` | `0` |
| onCopy | Configures `onCopy`. | `(event: MouseEvent) => void` | - |

### TypographyActionsConfig

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| placement | Configures `placement`. | `start` \|`end` | `end` |

### Link

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| href | Configures `href`. | `string` | - |
| target | Configures `target`. | `string` | - |
| disabled | Configures `disabled`. | `boolean` | `false` |
| underline | Configures `underline`. | `boolean` | `false` |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `TypographyClassNames` | - |
| styles | Configures `styles`. | `TypographyStyles` | - |

## Slots

| Name | Description |
| --- | --- |
| default | Provides the `default` entry. |

## Semantic DOM

| Name | Description |
| --- | --- |
| root | Provides the `root` entry. |
