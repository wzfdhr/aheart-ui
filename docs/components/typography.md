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

## 标记与省略

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

## 语义化样式

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `TypographyClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `TypographyStyles` | - |

### Title

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| level | 标题级别 | `1` \| `2` \| `3` \| `4` \| `5` | `1` |
| type | 标题类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| disabled | 是否禁用样式 | `boolean` | `false` |
| mark | 是否标记高亮 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `TypographyClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `TypographyStyles` | - |

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
| mark | 是否标记高亮 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `TypographyClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `TypographyStyles` | - |

### Paragraph

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 段落类型 | `secondary` \| `success` \| `warning` \| `danger` | - |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| ellipsis | 是否省略，可配置最大行数 | `boolean` \| `TypographyEllipsisConfig` | `false` |
| mark | 是否标记高亮 | `boolean` | `false` |
| disabled | 是否禁用样式 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `TypographyClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `TypographyStyles` | - |

### TypographyEllipsisConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 最大显示行数 | `number` | `1` |

### Link

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| href | 链接地址 | `string` | - |
| target | 链接打开方式 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| underline | 是否显示下划线 | `boolean` | `false` |
| className | 根节点兼容 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class，支持对象或函数 | `TypographyClassNames` | - |
| styles | 语义化结构样式，支持对象或函数 | `TypographyStyles` | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 文本内容 |

## Semantic DOM

| 名称 | 说明 |
| --- | --- |
| root | 根排版节点 |
