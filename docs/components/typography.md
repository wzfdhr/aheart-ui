# Typography 排版 <span class="aheart-status aheart-status--ready">Ready</span>

Typography provides text, title, paragraph, and link primitives for product interfaces.

## 标题

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

## 文本类型

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

## API

### Title

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| level | 标题级别 | `1` \| `2` \| `3` \| `4` \| `5` | `1` |

### Text

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| code | 是否代码样式 | `boolean` | `false` |
| keyboard | 是否键盘样式 | `boolean` | `false` |
| delete | 是否删除线 | `boolean` | `false` |
| underline | 是否下划线 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |

### Paragraph

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 段落类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| ellipsis | 是否单行省略 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |

### Link

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| href | 链接地址 | `string` | - |
| target | 链接打开方式 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| underline | 是否显示下划线 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 文本内容 |
