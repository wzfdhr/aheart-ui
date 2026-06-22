# Tag 标签 <span class="aheart-status aheart-status--ready">Ready</span>

Tag labels content with compact status, category, link, close, and checkable selection affordances.

## 基础用法

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

## 变体

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

## 图标、链接与禁用

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

## 可关闭

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

## 可选标签

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

## 可选标签组

<div class="aheart-demo-panel">
  <ASpace direction="vertical">
    <ATagGroup
      default-value="review"
      :options="[
        'draft',
        { label: 'Review', value: 'review', title: 'Current stage' },
        { label: 'Done', value: 'done', disabled: true }
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
<template>
  <ATagGroup
    default-value="review"
    :options="[
      'draft',
      { label: 'Review', value: 'review', title: 'Current stage' },
      { label: 'Done', value: 'done', disabled: true }
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

## 自定义颜色

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

## 语义化样式

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 标签颜色，支持预设状态色和自定义色值 | `default` \| `primary` \| `success` \| `processing` \| `warning` \| `danger` \| `error` \| `string` | `default` |
| variant | 标签变体，仿 Ant Design 6 | `filled` \| `solid` \| `outlined` | `filled` |
| bordered | 是否显示边框，兼容旧写法；新项目优先使用 `variant` | `boolean` | `true` |
| closable | 是否显示关闭按钮 | `boolean` | `false` |
| closeIcon | 自定义关闭图标；为 `false` 或 `null` 时隐藏关闭按钮 | `VNodeChild` \| `false` \| `null` | `×` |
| icon | 标签图标 | `VNodeChild` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| href | 链接地址，存在且未禁用时根节点渲染为 `<a>` | `string` | - |
| target | 链接打开方式 | `string` | - |
| rel | 链接关系属性 | `string` | - |
| title | 原生标题提示 | `string` | - |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'icon' \| 'content' \| 'close', StyleValue>>` | - |

### CheckableTag

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 是否选中，受控 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| icon | 标签图标 | `VNodeChild` | - |
| title | 原生标题提示 | `string` | - |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'icon' \| 'content', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'icon' \| 'content', StyleValue>>` | - |

### TagGroup

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前选中值，Vue 受控值 | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| value | 当前选中值，Ant 风格受控别名，优先级高于 `modelValue` | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| defaultValue | 非受控初始选中值 | `string` \| `number` \| `(string \| number)[]` \| `null` | - |
| options | 选项列表 | `TagRawOption[]` | `[]` |
| multiple | 是否多选 | `boolean` | `false` |
| disabled | 是否禁用全部选项 | `boolean` | `false` |
| className | 根节点 class | `string` | - |
| rootClassName | 根节点 class | `string` | - |
| style | 根节点样式 | `StyleValue` | - |
| classNames | 语义化结构 class | `Partial<Record<'root' \| 'item' \| 'activeItem', string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<'root' \| 'item' \| 'activeItem', StyleValue>>` | - |

### TagOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项内容 | `string` | - |
| value | 选项值 | `string` \| `number` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| icon | 选项图标 | `VNodeChild` | - |
| className | 选项根节点 class | `string` | - |
| style | 选项根节点样式 | `StyleValue` | - |
| title | 原生标题提示 | `string` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | `(event: MouseEvent) => void` |
| update:checked | `ACheckableTag` 选中状态更新 | `(checked: boolean) => void` |
| change | `ACheckableTag` 选中状态变化 | `(checked: boolean, event: MouseEvent) => void` |
| update:modelValue | `ATagGroup` 选中值更新 | `(value: TagGroupValue) => void` |
| update:value | `ATagGroup` Ant 风格选中值更新 | `(value: TagGroupValue) => void` |
| change | `ATagGroup` 选中值变化 | `(value: TagGroupValue) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 标签内容 |
| icon | 自定义标签图标 |
| closeIcon | 自定义关闭图标 |

## Semantic DOM

### Tag / CheckableTag

| 名称 | 说明 |
| --- | --- |
| root | 根节点 |
| icon | 图标容器 |
| content | 内容容器 |
| close | 关闭按钮，仅 `ATag` |

### TagGroup

| 名称 | 说明 |
| --- | --- |
| root | 组根节点 |
| item | 每个可选标签 |
| activeItem | 已选中的可选标签 |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-color-border`
- `--aheart-border-radius-sm`
